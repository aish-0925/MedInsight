const Admission = require("../models/Admission");
const Bed = require("../models/Bed");
const Department = require("../models/Department");
const Alert = require("../models/Alert");
const Feedback = require("../models/Feedback");
const Inventory = require("../models/Inventory");

exports.getDashboardData = async (req, res) => {
  try {
    const user = req.user;

    // =============================
    // 🔐 ROLE-BASED FILTER
    // =============================
    let filter = {};
    if (user.role !== "admin" && user.department) {
      filter.department = user.department;
    }

    // =============================
    // 📊 1. TOTAL PATIENTS
    // =============================
    const totalPatients = await Admission.countDocuments({
      status: "admitted",
      ...filter
    });

    // =============================
    // 🛏️ 2. BED OCCUPANCY
    // =============================
    const totalBeds = await Bed.countDocuments(filter);
    const occupiedBeds = await Bed.countDocuments({
      status: "occupied",
      ...filter
    });

    const occupancyRate = totalBeds
      ? Math.round((occupiedBeds / totalBeds) * 100)
      : 0;

    // =============================
    // 🚨 3. CRITICAL ALERTS
    // =============================
    const criticalAlerts = await Alert.countDocuments({
      type: "critical",
      resolved: false,
      ...filter
    });

    // =============================
    // ⭐ 4. AVG SATISFACTION
    // =============================
    const feedbackList = await Feedback.find(filter);

    const avgSatisfaction =
      feedbackList.length > 0
        ? (
            feedbackList.reduce((sum, f) => sum + f.rating, 0) /
            feedbackList.length
          ).toFixed(1)
        : 0;

    // =============================
    // 📈 5. DEPARTMENT OCCUPANCY
    // =============================
    const departments = await Department.find();

    const departmentStats = await Promise.all(
      departments.map(async (dep) => {
        const total = await Bed.countDocuments({ department: dep._id });
        const occupied = await Bed.countDocuments({
          department: dep._id,
          status: "occupied"
        });

        return {
          name: dep.name,
          occupancy: total
            ? Math.round((occupied / total) * 100)
            : 0
        };
      })
    );

    // =============================
    // 📊 6. ADMISSIONS vs DISCHARGES
    // =============================
    const admissions = await Admission.countDocuments({
      status: "admitted",
      ...filter
    });

    const discharges = await Admission.countDocuments({
      status: "discharged",
      ...filter
    });

    const admissionsVsDischarges = [
      { name: "Admissions", value: admissions },
      { name: "Discharges", value: discharges }
    ];

    // =============================
    // 📦 7. INVENTORY STATUS
    // =============================
    const inventory = await Inventory.find();

    const inventoryStatus = inventory.map(item => {
      let status = "ok";

      if (item.quantity <= item.reorderThreshold / 2) {
        status = "critical";
      } else if (item.quantity <= item.reorderThreshold) {
        status = "low";
      }

      return {
        name: item.name,
        status
      };
    });

    // =============================
    // 🚨 8. RECENT ALERTS
    // =============================
    const recentAlerts = await Alert.find(filter)
      .sort({ createdAt: -1 })
      .limit(5);

    // =============================
    // 💬 9. RECENT FEEDBACK
    // =============================
    const feedback = await Feedback.find(filter)
      .sort({ createdAt: -1 })
      .limit(5);

    // =============================
    // ✅ FINAL RESPONSE
    // =============================
    res.json({
      totalPatients,
      occupancyRate,
      criticalAlerts,
      avgSatisfaction,

      departmentStats,
      admissionsVsDischarges,
      inventoryStatus,
      recentAlerts,
      feedback
    });

  } catch (error) {
    console.error("DASHBOARD ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};