const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["critical", "warning", "info"]
  },

  message: String,

  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department"
  },

  resolved: {
    type: Boolean,
    default: false
  },

  resolvedAt: Date
}, { timestamps: true });

module.exports = mongoose.model("Alert", alertSchema);