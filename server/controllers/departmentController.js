const Department = require("../models/Department");
const Bed = require("../models/Bed");

// CREATE DEPARTMENT
exports.createDepartment = async (req, res) => {
  try {
    const { name, floor, totalBeds, location } = req.body;

    if (!name || !totalBeds) {
      return res.status(400).json({ message: "Name and totalBeds are required" });
    }

    const department = await Department.create({
      name,
      floor,
      totalBeds,
      location
    });

    res.status(201).json({
      message: "Department created successfully",
      department
    });
  } catch (error) {
    console.error("CREATE DEPARTMENT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET ALL DEPARTMENTS
exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({ createdAt: -1 });

    // Get bed statistics for each department
    const deptWithStats = await Promise.all(
      departments.map(async (dept) => {
        const totalBeds = await Bed.countDocuments({ department: dept._id });
        const occupiedBeds = await Bed.countDocuments({
          department: dept._id,
          status: "occupied"
        });
        const availableBeds = totalBeds - occupiedBeds;

        return {
          ...dept.toObject(),
          stats: {
            totalBeds,
            occupiedBeds,
            availableBeds,
            occupancyRate: totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0
          }
        };
      })
    );

    res.json(deptWithStats);
  } catch (error) {
    console.error("GET DEPARTMENTS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET DEPARTMENT BY ID
exports.getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findById(id);

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    const beds = await Bed.find({ department: id });
    const occupiedBeds = beds.filter(b => b.status === "occupied").length;

    res.json({
      ...department.toObject(),
      stats: {
        totalBeds: beds.length,
        occupiedBeds,
        availableBeds: beds.length - occupiedBeds,
        beds
      }
    });
  } catch (error) {
    console.error("GET DEPARTMENT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// UPDATE DEPARTMENT
exports.updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, floor, totalBeds, location } = req.body;

    const department = await Department.findByIdAndUpdate(
      id,
      { name, floor, totalBeds, location },
      { new: true }
    );

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.json({
      message: "Department updated successfully",
      department
    });
  } catch (error) {
    console.error("UPDATE DEPARTMENT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// DELETE DEPARTMENT
exports.deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findByIdAndDelete(id);

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.json({ message: "Department deleted successfully" });
  } catch (error) {
    console.error("DELETE DEPARTMENT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = exports;