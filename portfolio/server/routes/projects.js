const express = require("express");
const Project = require("../models/Project");

const router = express.Router();

// GET /api/projects — list all projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch projects." });
  }
});

// GET /api/projects/:id — single project
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found." });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: "Server error." });
  }
});

// POST /api/projects — add a new project
router.post("/", async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (err) {
    if (err.name === "ValidationError") {
      const firstError = Object.values(err.errors)[0].message;
      return res.status(400).json({ error: firstError });
    }
    res.status(500).json({ error: "Server error. Please try again shortly." });
  }
});

// PUT /api/projects/:id — update a project (e.g. status change, new links)
router.put("/:id", async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!project) return res.status(404).json({ error: "Project not found." });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: "Server error. Please try again shortly." });
  }
});

// DELETE /api/projects/:id — remove a project
router.delete("/:id", async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found." });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error. Please try again shortly." });
  }
});

module.exports = router;
