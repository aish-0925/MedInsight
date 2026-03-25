const Inventory = require("../models/Inventory");

// CREATE INVENTORY ITEM
exports.createInventory = async (req, res) => {
  try {
    const { name, category, quantity, reorderThreshold, supplier, lastRestocked } = req.body;

    if (!name || !category || quantity === undefined || !reorderThreshold) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const inventory = await Inventory.create({
      name,
      category,
      quantity,
      reorderThreshold,
      supplier,
      lastRestocked: lastRestocked || new Date()
    });

    res.status(201).json({
      message: "Inventory item created successfully",
      inventory
    });
  } catch (error) {
    console.error("CREATE INVENTORY ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET ALL INVENTORY
exports.getAllInventory = async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;

    let filter = {};
    if (category) filter.category = category;

    const inventory = await Inventory.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Inventory.countDocuments(filter);

    res.json({
      inventory,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    console.error("GET INVENTORY ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET INVENTORY ITEM BY ID
exports.getInventoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const inventory = await Inventory.findById(id);

    if (!inventory) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    res.json(inventory);
  } catch (error) {
    console.error("GET INVENTORY ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// UPDATE INVENTORY
exports.updateInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, quantity, reorderThreshold, supplier, lastRestocked } = req.body;

    const inventory = await Inventory.findByIdAndUpdate(
      id,
      { name, category, quantity, reorderThreshold, supplier, lastRestocked },
      { new: true }
    );

    if (!inventory) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    res.json({
      message: "Inventory updated successfully",
      inventory
    });
  } catch (error) {
    console.error("UPDATE INVENTORY ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// DELETE INVENTORY
exports.deleteInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const inventory = await Inventory.findByIdAndDelete(id);

    if (!inventory) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    res.json({ message: "Inventory item deleted successfully" });
  } catch (error) {
    console.error("DELETE INVENTORY ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// UPDATE QUANTITY
exports.updateQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined) {
      return res.status(400).json({ message: "Quantity is required" });
    }

    const inventory = await Inventory.findByIdAndUpdate(
      id,
      { quantity, lastRestocked: new Date() },
      { new: true }
    );

    if (!inventory) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    res.json({
      message: "Quantity updated successfully",
      inventory
    });
  } catch (error) {
    console.error("UPDATE QUANTITY ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET LOW STOCK ITEMS
exports.getLowStockItems = async (req, res) => {
  try {
    const lowStockItems = await Inventory.find({
      $expr: { $lte: ["$quantity", "$reorderThreshold"] }
    }).sort({ quantity: 1 });

    const criticalItems = lowStockItems.filter(
      item => item.quantity <= item.reorderThreshold / 2
    );

    const warningItems = lowStockItems.filter(
      item => item.quantity > item.reorderThreshold / 2
    );

    res.json({
      total: lowStockItems.length,
      critical: criticalItems,
      warning: warningItems
    });
  } catch (error) {
    console.error("GET LOW STOCK ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET INVENTORY STATISTICS
exports.getInventoryStats = async (req, res) => {
  try {
    const allItems = await Inventory.find();
    
    const lowStockItems = allItems.filter(item => item.quantity <= item.reorderThreshold);
    const criticalItems = allItems.filter(item => item.quantity <= item.reorderThreshold / 2);

    const categories = {};
    allItems.forEach(item => {
      if (!categories[item.category]) {
        categories[item.category] = 0;
      }
      categories[item.category]++;
    });

    res.json({
      totalItems: allItems.length,
      lowStockCount: lowStockItems.length,
      criticalCount: criticalItems.length,
      categories
    });
  } catch (error) {
    console.error("GET INVENTORY STATS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = exports;