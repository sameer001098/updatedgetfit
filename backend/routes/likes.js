const express = require("express");
const router = express.Router();
const db = require("../db/db");

// POST /api/likes
router.post("/", (req, res) => {
  const { senderId, podcastId, status, liketype } = req.body;

  if (!senderId || !podcastId || typeof status === 'undefined') {
    return res.status(400).json({ error: "All fields are required" });
  }

  const query = "INSERT INTO podcast_likes (senderId, podcastId, status, liketype) VALUES (?, ?, ?, ? )";
  db.query(query, [senderId, podcastId, status, liketype], (err, result) => {
    if (err) {
      console.error("MySQL Error:", err.message);
      return res.status(500).json({ error: "Database insert failed" });
    }

    res.status(201).json({ message: "Like recorded", likeId: result.insertId });
  });
});

// GET /api/likes
router.get("/", (req, res) => {
  const query = "SELECT * FROM podcast_likes ORDER BY id DESC";

  db.query(query, (err, results) => {
    if (err) {
      console.error("MySQL Error:", err.message);
      return res.status(500).json({ error: "Database fetch failed" });
    }

    res.status(200).json(results);
  });
});


router.get("/check", (req, res) => {
  const { senderId, podcastId } = req.query;

  if (!senderId || !podcastId) {
    return res.status(400).json({ error: "senderId and podcastId are required" });
  }

  const query = "SELECT * FROM podcast_likes WHERE senderId = ? AND podcastId = ? LIMIT 1";

  db.query(query, [senderId, podcastId], (err, results) => {
    if (err) {
      console.error("MySQL Error:", err.message);
      return res.status(500).json({ error: "Database fetch failed" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No like found" });
    }

    res.status(200).json(results[0]);
  });
});


module.exports = router;
