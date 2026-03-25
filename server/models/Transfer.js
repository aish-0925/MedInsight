const mongoose = require("mongoose");

const transferSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },

  fromDepartment: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
  toDepartment: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },

  reason: String
}, { timestamps: true });

module.exports = mongoose.model("Transfer", transferSchema);