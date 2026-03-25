const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  addMedicalHistory,
  addAllergy
} = require("../controllers/patientController");

// CREATE PATIENT
router.post("/", authMiddleware, createPatient);

// GET ALL PATIENTS
router.get("/", authMiddleware, getAllPatients);

// GET PATIENT BY ID
router.get(":id", authMiddleware, getPatientById);

// UPDATE PATIENT
router.put(":id", authMiddleware, updatePatient);

// DELETE PATIENT
router.delete(":id", authMiddleware, deletePatient);

// ADD MEDICAL HISTORY
router.post(":id/medical-history", authMiddleware, addMedicalHistory);

// ADD ALLERGY
router.post(":id/allergy", authMiddleware, addAllergy);

module.exports = router;