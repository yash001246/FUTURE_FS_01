const Lead = require('../models/Lead');

const ALLOWED_STATUSES = ['new', 'contacted', 'converted', 'lost'];

// GET /api/leads?status=new&search=jane&page=1&limit=20
async function listLeads(req, res) {
  const { status, search, page = 1, limit = 20 } = req.query;
  const query = {};

  if (status && ALLOWED_STATUSES.includes(status)) {
    query.status = status;
  }
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);

  const [leads, total] = await Promise.all([
    Lead.find(query)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .populate('assignedTo', 'name email'),
    Lead.countDocuments(query),
  ]);

  res.json({
    leads,
    pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
  });
}

async function getLead(req, res) {
  const lead = await Lead.findById(req.params.id).populate('assignedTo', 'name email');
  if (!lead) return res.status(404).json({ message: 'Lead not found' });
  res.json({ lead });
}

// Public endpoint — your website's contact form posts here directly.
// Guarded by requireIntakeKey, not admin auth.
async function createLead(req, res) {
  const { name, email, phone, message, source } = req.body;
  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required' });
  }

  const lead = await Lead.create({ name, email, phone, message, source });
  res.status(201).json({ lead });
}

async function updateStatus(req, res) {
  const { status } = req.body;
  if (!ALLOWED_STATUSES.includes(status)) {
    return res.status(400).json({ message: `Status must be one of: ${ALLOWED_STATUSES.join(', ')}` });
  }

  const lead = await Lead.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );
  if (!lead) return res.status(404).json({ message: 'Lead not found' });
  res.json({ lead });
}

async function addNote(req, res) {
  const { text, followUpDate } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ message: 'Note text is required' });
  }

  const lead = await Lead.findById(req.params.id);
  if (!lead) return res.status(404).json({ message: 'Lead not found' });

  lead.notes.push({
    text: text.trim(),
    followUpDate: followUpDate || null,
    createdBy: req.admin._id,
  });
  await lead.save();
  res.status(201).json({ lead });
}

async function deleteLead(req, res) {
  const lead = await Lead.findByIdAndDelete(req.params.id);
  if (!lead) return res.status(404).json({ message: 'Lead not found' });
  res.json({ message: 'Lead deleted' });
}

module.exports = { listLeads, getLead, createLead, updateStatus, addNote, deleteLead };
