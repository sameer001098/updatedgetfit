const express = require("express");
const router = express.Router();
const db = require("../db/db");


router.post("/", (req, res) => {
  const { senderId, podcastId, comment, commenttype, username } = req.body;

  if (!senderId || !podcastId || !comment) {
    return res.status(400).json({ error: "All fields are required" } );
  }

  const query = "INSERT INTO live_comments (senderId, podcastId, comment, commenttype, username) VALUES (?, ?, ?, ?, ?)";
  db.query(query, [senderId, podcastId, comment, commenttype, username], (err, result) => {
    if (err) {
      console.error("MySQL Error:", err.message);
      return res.status(500).json({ error: "Database insert failed" });
    }

    res.status(201).json({ message: "Comment added", commentId: result.insertId });
  });
});
router.get("/", (req, res) => {
  const query = "SELECT * FROM live_comments ORDER BY id DESC";

  db.query(query, (err, results) => {
    if (err) {
      console.error("MySQL Error:", err.message);
      return res.status(500).json({ error: "Database fetch failed" });
    }

    res.status(200).json(results);
  });
});
router.get("/:podcastId", (req, res) => {
  const { podcastId } = req.params;

  if (!podcastId) {
    return res.status(400).json({ error: "podcastId parameter is required" });
  }

  const query = "SELECT * FROM live_comments WHERE podcastId = ? ORDER BY id DESC";

  db.query(query, [podcastId], (err, results) => {
    if (err) {
      console.error("MySQL Error:", err.message);
      return res.status(500).json({ error: "Database fetch failed" });
    }

    res.status(200).json(results);
  });
});

router.get("/questionid/:podcastId", (req, res) => {
  const { podcastId } = req.params;

  if (!podcastId) {
    return res.status(400).json({ error: "podcastId parameter is required" });
  }

  const query = `
    SELECT * 
    FROM live_comments 
    WHERE podcastId = ? AND commenttype = 'questions' 
    ORDER BY id DESC
  `;

  db.query(query, [podcastId], (err, results) => {
    if (err) {
      console.error("MySQL Error:", err.message);
      return res.status(500).json({ error: "Database fetch failed" });
    }

    res.status(200).json(results);
  });
});


module.exports = router;
