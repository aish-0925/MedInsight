const mongoose = require("mongoose");

const bedSchema = new mongoose.Schema({
  bedNumber: String,

  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department"
  },

  status: {
    type: String,
    enum: ["available", "occupied", "maintenance"],
    default: "available"
  }
});

module.exports = mongoose.model("Bed", bedSchema);