const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    actor:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    actorRole:  { type: String },
    action:     { type: String, required: true },   // e.g. 'CREATE_ADMIN', 'BAN_USER'
    target:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    targetEmail:{ type: String },
    details:    { type: String },
    ip:         { type: String },
  },
  { timestamps: true }
);

auditLogSchema.index({ actor: 1, createdAt: -1 });
module.exports = mongoose.model('AuditLog', auditLogSchema);
