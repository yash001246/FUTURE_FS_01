const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    followUpDate: { type: Date, default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  },
  { timestamps: true }
);

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    message: { type: String, trim: true },
    source: {
      type: String,
      // Where the lead came from — the specific page/campaign, not just "website".
      required: true,
      trim: true,
      default: 'website contact form',
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'converted', 'lost'],
      default: 'new',
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', default: null },
    notes: [noteSchema],
  },
  { timestamps: true }
);

leadSchema.index({ email: 1, createdAt: -1 });
leadSchema.index({ status: 1 });
leadSchema.index({ name: 'text', email: 'text' });

module.exports = mongoose.model('Lead', leadSchema);
