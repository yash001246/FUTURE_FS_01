require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const leadRoutes = require('./routes/leadRoutes');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json({ limit: '100kb' }));

// Basic brute-force protection on login and public intake.
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });
const intakeLimiter = rateLimit({ windowMs: 60 * 1000, max: 30 });
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/leads/intake', intakeLimiter);

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

// Central error handler — keeps stack traces out of responses.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`CRM API running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });
