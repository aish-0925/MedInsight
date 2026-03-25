const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  createBed,
  getAllBeds,
  getAvailableBeds,
  updateBedStatus,
  deleteBed,
  getBedStats
} = require("../controllers/bedController");

// CREATE BED
router.post("/", authMiddleware, createBed);

// GET ALL BEDS
router.get("/", authMiddleware, getAllBeds);

// GET BED STATS
router.get("/stats/all", authMiddleware, getBedStats);

// GET AVAILABLE BEDS BY DEPARTMENT
router.get("/available/:departmentId", authMiddleware, getAvailableBeds);

// UPDATE BED STATUS
router.put("/:id/status", authMiddleware, updateBedStatus);

// DELETE BED
router.delete("/:id", authMiddleware, deleteBed);

module.exports = router;