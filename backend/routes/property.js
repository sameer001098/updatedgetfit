const express = require("express");
const router = express.Router();
const db = require("../db/db");
const upload = require("./savefiles");


router.post("/", upload.array("images"), (req, res) => {
  const {
    propertyownerid,
    firstname,
    lastname,
    email,
    phone,
    businessname,
    parking,
    amenities,
    appliances,
    propertyname,
    propertyaddress,
    propertytype,
    noofbedroom,
    noofbathrooms,
    square,
    rent,
    description,
  } = req.body;

  const imageUrls = req.files.map(file => `/uploads/${file.filename}`);
  const imagesJson = JSON.stringify(imageUrls);

  const query = `
    INSERT INTO property_submissions (
      propertyownerid,
      firstname, lastname, email, phone,
      businessname, parking, amenities, appliances,
      propertyname, propertyaddress, propertytype,
      noofbedroom, noofbathrooms, square, rent, description, images
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    propertyownerid, firstname, lastname, email, phone,
    businessname, parking, amenities, appliances,
    propertyname, propertyaddress, propertytype,
    noofbedroom, noofbathrooms, square, rent, description, imagesJson
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("MySQL Error:", err.message);
      return res.status(500).json({ error: "Database insert failed" });
    }

    res.status(201).json({
      message: "Property added successfully",
      insertId: result.insertId,
      images: imageUrls
    });
  });
});



router.get("/", (req, res) => {
  db.query("SELECT * FROM property_submissions", (err, results) => {
    if (err) {
      console.error("MySQL Error:", err.message);
      return res.status(500).json({ error: "Failed to fetch properties" });
    }

    // Parse images from stringified JSON
    const properties = results.map(row => ({
      ...row,
      images: JSON.parse(row.images || "[]")
    }));

    res.json(properties);
  });
});


router.get("/:id", (req, res) => {
  const { id } = req.params;

  db.query(
    "SELECT * FROM property_submissions WHERE propertyownerid = ?",
    [id],
    (err, results) => {
      if (err) {
        console.error("MySQL Error:", err.message); 
        return res.status(500).json({ error: "Failed to fetch properties" });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "No properties found for this owner" });
      }

      // Parse the images field for each property
      const properties = results.map(property => ({
        ...property,
        images: JSON.parse(property.images || "[]"), 
      }));

      res.json(properties);
    }
  );
});

router.get("/getpropertybyid/:id", (req, res) => {
  const { id } = req.params;

  db.query(
    "SELECT * FROM property_submissions WHERE id = ?",
    [id],
    (err, results) => {
      if (err) {
        console.error("MySQL Error:", err.message); 
        return res.status(500).json({ error: "Failed to fetch properties" });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "No properties found for this owner" });
      }

      // Parse the images field for each property
      const properties = results.map(property => ({
        ...property,
        images: JSON.parse(property.images || "[]"), 
      }));

      res.json(properties);
    }
  );
});

router.delete("/deleteproperty/:id", (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM property_submissions WHERE id = ?",
    [id],
    (err, result) => {
      if (err) {
        console.error("MySQL Error:", err.message);
        return res.status(500).json({ error: "Failed to delete property" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Property not found" });
      }

      res.json({ message: "Property deleted successfully" });
    }
  );
});



module.exports = router;
