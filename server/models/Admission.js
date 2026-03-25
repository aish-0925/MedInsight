const mongoose = require("mongoose");

const admissionSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient"
  },

  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department"
  },

  bed: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bed"
  },

  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  status: {
    type: String,
    enum: ["admitted", "discharged", "transferred"],
    default: "admitted"
  },

  admittedAt: {
    type: Date,
    default: Date.now
  },

  dischargedAt: Date
}, { timestamps: true });

module.exports = mongoose.model("Admission", admissionSchema);