const express = require("express");
const router = express.Router();
const db = require("../db/db");
const multer = require("multer");
const path = require("path");

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "./uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["video/mp4", "image/jpeg", "image/png", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

const upload = multer({ storage, fileFilter });

router.post("/", upload.fields([
  { name: "video", maxCount: 1 },
  { name: "hosts", maxCount: 1 },
  { name: "members", maxCount: 1 }
]), (req, res) => {
  const { title, noOfLikes, noOfComments, dateTime, status } = req.body;

  const videoFile = req.files["video"] ? req.files["video"][0].filename : null;
  const hostImage = req.files["hosts"] ? req.files["hosts"][0].filename : null;
  const memberImage = req.files["members"] ? req.files["members"][0].filename : null;

  if (!videoFile || !title || !dateTime || !status || !hostImage || !memberImage) {
    return res.status(400).json({ error: "All fields including files are required" });
  }

  const query = `
    INSERT INTO podcasts (video, title, noOfLikes, noOfComments, dateTime, status, hostImage, memberImage)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [videoFile, title, noOfLikes || 0, noOfComments || 0, dateTime, status, hostImage, memberImage], (err, result) => {
    if (err) {
      console.error("MySQL Error:", err.message);
      return res.status(500).json({ error: "Database insert failed" });
    }

    res.status(201).json({ message: "Video post created", postId: result.insertId });
  });
});

router.post("/addnewpodcast", (req, res) => {
  const { channelname, url, type, price, creatorid } = req.body;

  if (!channelname || !url || !type || !price || !creatorid) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const query = `
    INSERT INTO podcast_videos (channelname, url, type, price, creatorid)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(query, [channelname, url, type, price, creatorid], (err, result) => {
    if (err) {
      console.error("MySQL Error:", err.message);
      return res.status(500).json({ error: "Database insert failed" });
    }

    res.status(201).json({ message: "Podcast video added", videoId: result.insertId });
  });
});
router.get("/getpodcast/:id", (req, res) => {
  const podcastId = req.params.id;

  const query = "SELECT * FROM podcast_videos WHERE id = ?";

  db.query(query, [podcastId], (err, results) => {
    if (err) {
      console.error("MySQL Error:", err.message);
      return res.status(500).json({ error: "Database query failed" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Podcast not found" });
    }

    res.status(200).json(results[0]);
  });
});



router.get("/", (req, res) => {
  const query = "SELECT * FROM podcasts ORDER BY id DESC";

  db.query(query, (err, results) => {
    if (err) {
      console.error("MySQL Error:", err.message);
      return res.status(500).json({ error: "Database fetch failed" });
    }

    res.status(200).json(results);
  });
});

router.get("/:id", (req, res) => {
  const podcastId = req.params.id;
  const query = "SELECT * FROM podcasts WHERE id = ?";

  db.query(query, [podcastId], (err, results) => {
    if (err) {
      console.error("MySQL Error:", err.message);
      return res.status(500).json({ error: "Database fetch failed" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Podcast not found" });
    }

    res.status(200).json(results[0]);
  });
});

module.exports = router;
