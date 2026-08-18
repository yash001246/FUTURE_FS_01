const mongoose = require("mongoose");

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Title is required"], trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    excerpt: { type: String, trim: true, maxlength: 300 },
    content: { type: String, required: [true, "Content is required"], trim: true },
    tags: [{ type: String, trim: true }],
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Auto-generate a URL slug from the title if one wasn't provided.
blogPostSchema.pre("validate", function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

module.exports = mongoose.model("BlogPost", blogPostSchema);
