// Populates the database with sample projects and blog posts so the
// site has content to show right after setup. Run with: npm run seed
require("dotenv").config();
const mongoose = require("mongoose");
const Project = require("../models/Project");
const BlogPost = require("../models/BlogPost");

// Update the github/demo URLs below with your actual ShopEase repo and live link.
const projects = [
  {
    title: "ShopEase",
    description:
      "Built a live MERN e-commerce website with authentication, cart, wishlist, admin panel, and Razorpay payment integration. Designed a responsive UI for desktop and mobile users. 🚀",
    stack: ["React", "Node.js", "Express", "MongoDB", "JWT", "Razorpay", "Responsive UI"],
    status: "Live",
    github: "https://github.com/yash001246/Ecommerce-webPage",
    demo: "https://ecommerce-webpage-bnw7.onrender.com",
    featured: true,
  },
];

const posts = [
  {
    title: "Integrating Razorpay into a MERN app",
    excerpt: "Notes from wiring up payments in ShopEase — order flow, webhooks, and things I got wrong the first time.",
    content:
      "Full write-up coming soon. The short version: verify payments server-side, never trust the client callback alone.",
    tags: ["razorpay", "node", "mern"],
  },
  {
    title: "Building an admin dashboard with JWT auth",
    excerpt: "How ShopEase separates admin and customer roles, and what I'd change next time.",
    content: "Full write-up coming soon. Short version: role checks belong in middleware, not in the frontend.",
    tags: ["jwt", "express", "security"],
  },
  {
    title: "Future Interns, task 3: the capstone",
    excerpt: "Building this portfolio site was the final task — here's what it forced me to learn.",
    content: "Full write-up coming soon.",
    tags: ["future-interns", "career"],
  },
];

async function seed() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("MONGO_URI not set — add it to server/.env first.");
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log("Connected. Seeding...");

  await Project.deleteMany({});
  await Project.insertMany(projects);
  console.log(`Inserted ${projects.length} projects.`);

  await BlogPost.deleteMany({});
  await BlogPost.insertMany(posts);
  console.log(`Inserted ${posts.length} blog posts.`);

  await mongoose.disconnect();
  console.log("Done.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
