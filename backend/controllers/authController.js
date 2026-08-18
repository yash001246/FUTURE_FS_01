const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

function signToken(admin) {
  return jwt.sign(
    { id: admin._id, role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  );
}

// Public self-signup. New accounts get the limited "agent" role by
// default — the very first account ever created becomes "admin" so
// there's always at least one full-access user.
async function register(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters' });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existing = await Admin.findOne({ email: normalizedEmail });
  if (existing) {
    return res.status(409).json({ message: 'An account with that email already exists' });
  }

  const isFirstAccount = (await Admin.countDocuments({})) === 0;
  const passwordHash = await Admin.hashPassword(password);
  const admin = await Admin.create({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    role: isFirstAccount ? 'admin' : 'agent',
  });

  const token = signToken(admin);
  res.status(201).json({
    token,
    admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
  });
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
  if (!admin) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const valid = await admin.comparePassword(password);
  if (!valid) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = signToken(admin);
  res.json({
    token,
    admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
  });
}

async function me(req, res) {
  res.json({ admin: req.admin });
}

module.exports = { register, login, me };
