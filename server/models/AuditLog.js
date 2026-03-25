const mongoose = require("mongoose");

const auditSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  action: String,
  resource: String,
  ip: String
}, { timestamps: true });

// auto delete after 90 days
auditSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 });

module.exports = mongoose.model("AuditLog", auditSchema);