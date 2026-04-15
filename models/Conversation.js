const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    // Only unlocked when follow is accepted
    isActive: { type: Boolean, default: true },
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
    lastMessageAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// One conversation per pair
conversationSchema.index({ participants: 1 });
module.exports = mongoose.model('Conversation', conversationSchema);
