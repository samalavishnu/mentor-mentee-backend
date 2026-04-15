const mongoose = require('mongoose');

const followSchema = new mongoose.Schema(
  {
    follower: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    following: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // 'pending' = request sent, 'accepted' = mentor accepted, chat unlocked
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  },
  { timestamps: true }
);

followSchema.index({ follower: 1, following: 1 }, { unique: true });
module.exports = mongoose.model('Follow', followSchema);
