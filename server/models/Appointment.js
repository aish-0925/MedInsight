const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },

  time: Date,

  status: {
    type: String,
    enum: ["scheduled", "completed", "cancelled"]
  }

}, { timestamps: true });

module.exports = mongoose.model("Appointment", appointmentSchema);