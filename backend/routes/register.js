const express = require("express");
const router = express.Router();
const db = require("../db/db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Make sure uploads directory exists
const uploadDir = path.join(__dirname, "./uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Save file with timestamp + original name to avoid collisions
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

const upload = multer({ storage: storage });



router.post("/google-register", (req, res) => {
  const { fullname, email, googleid } = req.body;

  if (!fullname || !email || !googleid) {
    return res.status(400).json({ error: "Full name, email, and Google ID are required" });
  }

  const query = `
    INSERT INTO users (fullname, email, googleid)
    VALUES (?, ?, ?)
  `;

  db.query(query, [fullname, email, googleid], (err, result) => {
    if (err) {
      console.error("MySQL Error:", err.message);

      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ error: "Email already registered" });
      }

      return res.status(500).json({ error: "Database insert failed" });
    }

    res.status(201).json({ message: "Google user registered successfully", userId: result.insertId });
  });
});



router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const query = `SELECT * FROM register WHERE email = ? AND password = ? AND role = 'superadmin' LIMIT 1`;

  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error("MySQL Error:", err.message);
      return res.status(500).json({ error: "Database query failed" });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = results[0];
    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        firstname: user.firstname,
        email: user.email
      },
    });
  });
});
router.get("/total-users", (req, res) => {
  const query = "SELECT COUNT(*) AS total FROM register";

  db.query(query, (err, results) => {
    if (err) {
      console.error("MySQL Error:", err.message);
      return res.status(500).json({ error: "Database query failed" });
    }

    const total = results[0].total;
    res.json({ total });
  });
});


router.post("/google-login", (req, res) => {
  const { email, googleid } = req.body;

  if (!email || !googleid) {
    return res.status(400).json({ error: "Email and Google ID are required" });
  }

  const query = `SELECT id, fullname, email, selfimage FROM users WHERE email = ? AND googleid = ? LIMIT 1`;

  db.query(query, [email, googleid], (err, results) => {
    if (err) {
      console.error("MySQL Error:", err.message);
      return res.status(500).json({ error: "Database query failed" });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Google account not registered" });
    }

    const user = results[0];
    res.json({
      message: "Google login successful",
      user: {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
      },
    });
  });
});


router.get("/user/:id", (req, res) => {
  const userId = req.params.id;

  const query = `SELECT id, fullname, email, phone, selfimage, password FROM users WHERE id = ? LIMIT 1`;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("MySQL Error:", err.message);
      return res.status(500).json({ error: "Database query failed" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = results[0];
    res.json({ user });
  });
});


module.exports = router;
