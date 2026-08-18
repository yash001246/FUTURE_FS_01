const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.warn("  MONGO_URI not set. Add it to server/.env — see .env.example.");
    return;
  }

  try {
    await mongoose.connect(uri);
    console.log(" MongoDB connected");
  } catch (err) {
    console.error(" MongoDB connection error:", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
