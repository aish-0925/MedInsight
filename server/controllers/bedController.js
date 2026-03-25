const Bed = require("../models/Bed");
const Department = require("../models/Department");
const Admission = require("../models/Admission");

// CREATE BED
exports.createBed = async (req, res) => {
  try {
    const { bedNumber, department, status } = req.body;

    if (!bedNumber || !department) {
      return res.status(400).json({ message: "Bed number and department are required" });
    }

    const bed = await Bed.create({
      bedNumber,
      department,
      status: status || "available"
    });

    res.status(201).json({
      message: "Bed created successfully",
      bed: await bed.populate("department")
    });
  } catch (error) {
    console.error("CREATE BED ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET ALL BEDS
exports.getAllBeds = async (req, res) => {
  try {
    const { department, status } = req.query;

    let filter = {};
    if (department) filter.department = department;
    if (status) filter.status = status;

    const beds = await Bed.find(filter)
      .populate("department")
      .sort({ bedNumber: 1 });

    res.json(beds);
  } catch (error) {
    console.error("GET BEDS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET AVAILABLE BEDS BY DEPARTMENT
exports.getAvailableBeds = async (req, res) => {
  try {
    const { departmentId } = req.params;

    const beds = await Bed.find({
      department: departmentId,
      status: "available"
    }).populate("department");

    res.json({
      departmentId,
      availableBeds: beds.length,
      beds
    });
  } catch (error) {
    console.error("GET AVAILABLE BEDS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// UPDATE BED STATUS
exports.updateBedStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["available", "occupied", "maintenance"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const bed = await Bed.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate("department");

    if (!bed) {
      return res.status(404).json({ message: "Bed not found" });
    }

    res.json({
      message: "Bed status updated successfully",
      bed
    });
  } catch (error) {
    console.error("UPDATE BED STATUS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// DELETE BED
exports.deleteBed = async (req, res) => {
  try {
    const { id } = req.params;
    const bed = await Bed.findByIdAndDelete(id);

    if (!bed) {
      return res.status(404).json({ message: "Bed not found" });
    }

    res.json({ message: "Bed deleted successfully" });
  } catch (error) {
    console.error("DELETE BED ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET BED OCCUPANCY STATS
exports.getBedStats = async (req, res) => {
  try {
    const totalBeds = await Bed.countDocuments();
    const occupiedBeds = await Bed.countDocuments({ status: "occupied" });
    const availableBeds = await Bed.countDocuments({ status: "available" });
    const maintenanceBeds = await Bed.countDocuments({ status: "maintenance" });

    const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

    res.json({
      totalBeds,
      occupiedBeds,
      availableBeds,
      maintenanceBeds,
      occupancyRate
    });
  } catch (error) {
    console.error("GET BED STATS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = exports;
