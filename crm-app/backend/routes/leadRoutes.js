const express = require('express');
const {
  listLeads,
  getLead,
  createLead,
  updateStatus,
  addNote,
  deleteLead,
} = require('../controllers/leadController');
const { requireAuth, requireIntakeKey } = require('../middleware/authMiddleware');

const router = express.Router();

// Public: website contact form submits new leads here (intake-key protected).
router.post('/intake', requireIntakeKey, createLead);

// Everything below requires an authenticated admin/agent session.
router.use(requireAuth);

router.get('/', listLeads);
router.get('/:id', getLead);
router.post('/', createLead); // manual lead entry from the dashboard
router.patch('/:id/status', updateStatus);
router.post('/:id/notes', addNote);
router.delete('/:id', deleteLead);

module.exports = router;
