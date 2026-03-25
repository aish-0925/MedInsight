const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  floor: String,
  totalBeds: Number,
  location: String
}, { timestamps: true });

module.exports = mongoose.model("Department", departmentSchema);