const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  name: String,
  category: String,

  quantity: Number,
  reorderThreshold: Number,

  supplier: String,
  lastRestocked: Date
}, { timestamps: true });

module.exports = mongoose.model("Inventory", inventorySchema);