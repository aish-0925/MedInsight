const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  admitPatient,
  getAllAdmissions,
  getAdmissionById,
  dischargePatient,
  transferPatient,
  getActiveAdmissionsCount
} = require("../controllers/admissionController");

// ADMIT PATIENT
router.post("/", authMiddleware, admitPatient);

// GET ALL ADMISSIONS
router.get("/", authMiddleware, getAllAdmissions);

// GET ACTIVE ADMISSIONS COUNT
router.get("/count/active", authMiddleware, getActiveAdmissionsCount);

// GET ADMISSION BY ID
router.get(":id", authMiddleware, getAdmissionById);

// DISCHARGE PATIENT
router.put(":id/discharge", authMiddleware, dischargePatient);

// TRANSFER PATIENT
router.put(":id/transfer", authMiddleware, transferPatient);

module.exports = router;