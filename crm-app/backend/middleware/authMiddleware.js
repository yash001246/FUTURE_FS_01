const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Protects admin dashboard routes. Requires a valid JWT issued at login.
async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(payload.id).select('-passwordHash');
    if (!admin) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    req.admin = admin;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired session' });
  }
}

// Separate, narrower gate for the public lead-intake endpoint your
// website's contact form posts to. It never sees an admin JWT.
function requireIntakeKey(req, res, next) {
  const key = req.headers['x-intake-key'];
  if (!key || key !== process.env.LEAD_INTAKE_KEY) {
    return res.status(401).json({ message: 'Invalid intake key' });
  }
  next();
}

module.exports = { requireAuth, requireIntakeKey };
