const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  createInventory,
  getAllInventory,
  getInventoryById,
  updateInventory,
  deleteInventory,
  updateQuantity,
  getLowStockItems,
  getInventoryStats
} = require("../controllers/inventoryController");

// CREATE INVENTORY
router.post("/", authMiddleware, createInventory);

// GET ALL INVENTORY
router.get("/", authMiddleware, getAllInventory);

// GET INVENTORY STATS
router.get("/stats/all", authMiddleware, getInventoryStats);

// GET LOW STOCK ITEMS
router.get("/low-stock/all", authMiddleware, getLowStockItems);

// GET INVENTORY BY ID
router.get(":id", authMiddleware, getInventoryById);

// UPDATE INVENTORY
router.put(":id", authMiddleware, updateInventory);

// UPDATE QUANTITY
router.put(":id/quantity", authMiddleware, updateQuantity);

// DELETE INVENTORY
router.delete(":id", authMiddleware, deleteInventory);

module.exports = router;