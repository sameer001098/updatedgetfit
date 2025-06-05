const express = require("express");
const router = express.Router();
const db = require("../db/db");

router.post("/", (req, res) => {
  const { title, body, tags, userId } = req.body;

  if (!title || !body || !tags || !userId) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const query = "INSERT INTO questions (title, body, tags, userId) VALUES (?, ?, ?, ?)";
  db.query(query, [title, body, JSON.stringify(tags), userId], (err, result) => {
    if (err) {
      console.error("MySQL Error:", err.message);
      return res.status(500).json({ error: "Failed to insert question" });
    }
    res.status(201).json({ message: "Question submitted successfully", questionId: result.insertId });
  });
});

router.get("/", (req, res) => {
  const query = "SELECT * FROM questions ORDER BY id DESC";

  db.query(query, (err, results) => {
    if (err) {
      console.error("MySQL Error:", err.message);
      return res.status(500).json({ error: "Database fetch failed" });
    }

    // Parse tags from string back to array
    const formattedResults = results.map(q => ({
      ...q,
      tags: JSON.parse(q.tags || "[]")
    }));

    res.status(200).json(formattedResults);
  });
});

// GET /api/questions/:id - Get a single question by ID
router.get("/:id", (req, res) => {
  const { id } = req.params;

  const query = "SELECT * FROM questions WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("MySQL Error:", err.message);
      return res.status(500).json({ error: "Database fetch failed" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Question not found" });
    }

    const question = results[0];
    question.tags = JSON.parse(question.tags || "[]");

    res.status(200).json(question);
  });
});

module.exports = router;
