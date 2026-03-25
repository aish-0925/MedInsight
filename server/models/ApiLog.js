const mongoose = require("mongoose");

const apiLogSchema = new mongoose.Schema({
  endpoint: String,
  method: String,
  statusCode: Number,
  responseTime: Number
}, { timestamps: true });

// auto delete after 30 days
apiLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 });

module.exports = mongoose.model("ApiLog", apiLogSchema);