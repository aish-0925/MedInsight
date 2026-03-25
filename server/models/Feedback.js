const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
  department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },

  rating: { type: Number, min: 1, max: 5 },

  review: String,

  sentiment: {
    type: String,
    enum: ["positive", "neutral", "negative"]
  },

  keywords: [String]

}, { timestamps: true });

module.exports = mongoose.model("Feedback", feedbackSchema);