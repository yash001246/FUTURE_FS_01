// One-off script to create the first admin user.
// Usage: node scripts/createAdmin.js "Jane Doe" jane@example.com "StrongPassword123"
require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

async function main() {
  const [, , name, email, password] = process.argv;
  if (!name || !email || !password) {
    console.error('Usage: node scripts/createAdmin.js "Name" email password');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);

  const existing = await Admin.findOne({ email: email.toLowerCase() });
  if (existing) {
    console.error('An admin with that email already exists.');
    process.exit(1);
  }

  const passwordHash = await Admin.hashPassword(password);
  const admin = await Admin.create({ name, email: email.toLowerCase(), passwordHash, role: 'admin' });
  console.log(`Admin created: ${admin.email}`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
