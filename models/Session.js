const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
  {
    mentor:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mentee:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title:       { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    scheduledAt: { type: Date, required: true },
    duration:    { type: Number, default: 60, min: 15 },
    status:      { type: String, enum: ['pending','accepted','rejected','completed','cancelled'], default: 'pending' },
    meetingLink: { type: String, default: '' },
    notes:       { type: String, default: '' },
    // Payment tracking
    payment: {
      upiId:       { type: String, default: '' },
      amount:      { type: Number, default: 0 },
      utrNumber:   { type: String, default: '' }, // mentee enters UTR after paying
      status:      { type: String, enum: ['pending','paid','waived'], default: 'pending' },
      screenshot:  { type: String, default: '' },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Session', sessionSchema);
