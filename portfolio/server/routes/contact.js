const express = require("express");
const rateLimit = require("express-rate-limit");
const Message = require("../models/Message");

const router = express.Router();

// Basic abuse protection: 5 submissions per 15 minutes per IP
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: "Too many messages sent. Please try again later." },
});

// POST /api/contact — submit a new message
router.post("/", contactLimiter, async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email, and message are all required." });
    }

    const doc = await Message.create({ name, email, message });

    res.status(201).json({
      success: true,
      id: doc._id,
      message: "Message received — thanks for reaching out!",
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const firstError = Object.values(err.errors)[0].message;
      return res.status(400).json({ error: firstError });
    }
    console.error("Contact submission error:", err);
    res.status(500).json({ error: "Server error. Please try again shortly." });
  }
});

// GET /api/contact — list messages (for a future admin view)
router.get("/", async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch messages." });
  }
});

module.exports = router;
