const express = require("express");
const BlogPost = require("../models/BlogPost");

const router = express.Router();

// GET /api/blog — list published posts, newest first
router.get("/", async (req, res) => {
  try {
    const posts = await BlogPost.find({ published: true }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch blog posts." });
  }
});

// GET /api/blog/:slug — single post by slug
router.get("/:slug", async (req, res) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug });
    if (!post) return res.status(404).json({ error: "Post not found." });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: "Server error." });
  }
});

// POST /api/blog — create a new post
router.post("/", async (req, res) => {
  try {
    const post = await BlogPost.create(req.body);
    res.status(201).json(post);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "A post with that slug already exists." });
    }
    if (err.name === "ValidationError") {
      const firstError = Object.values(err.errors)[0].message;
      return res.status(400).json({ error: firstError });
    }
    res.status(500).json({ error: "Server error. Please try again shortly." });
  }
});

// PUT /api/blog/:id — update a post
router.put("/:id", async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!post) return res.status(404).json({ error: "Post not found." });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: "Server error. Please try again shortly." });
  }
});

// DELETE /api/blog/:id — remove a post
router.delete("/:id", async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found." });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error. Please try again shortly." });
  }
});

module.exports = router;
