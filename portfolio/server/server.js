require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const connectDB = require("./config/db");
const contactRoutes = require("./routes/contact");
const projectRoutes = require("./routes/projects");
const blogRoutes = require("./routes/blog");

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// Middleware
app.use(cors({ origin: CLIENT_URL }));
app.use(express.json());

// DB connection
connectDB();

// API routes
app.get("/api", (req, res) => {
  res.json({ status: "ok", message: "Portfolio API is running." });
});
app.use("/api/contact", contactRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/blog", blogRoutes);

// Optionally serve the static frontend from this same server.
// Handy for simple deployment: one process, one port.
const clientDir = path.join(__dirname, "..", "public");
app.use(express.static(clientDir));
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(clientDir, "index.html"));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong on the server." });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
