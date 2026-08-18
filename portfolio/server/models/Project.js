const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    stack: [{ type: String, trim: true }],
    status: {
      type: String,
      enum: ["Live", "In Progress", "Archived"],
      default: "In Progress",
    },
    github: { type: String, trim: true },
    demo: { type: String, trim: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
