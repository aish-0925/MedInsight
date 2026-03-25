const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  rescheduleAppointment,
  cancelAppointment,
  getDoctorAppointments
} = require("../controllers/appointmentController");

// CREATE APPOINTMENT
router.post("/", authMiddleware, createAppointment);

// GET ALL APPOINTMENTS
router.get("/", authMiddleware, getAllAppointments);

// GET APPOINTMENT BY ID
router.get("/:id", authMiddleware, getAppointmentById);

// UPDATE APPOINTMENT STATUS
router.put("/:id/status", authMiddleware, updateAppointmentStatus);

// RESCHEDULE APPOINTMENT
router.put("/:id/reschedule", authMiddleware, rescheduleAppointment);

// CANCEL APPOINTMENT
router.put("/:id/cancel", authMiddleware, cancelAppointment);

// GET DOCTOR APPOINTMENTS
router.get("/doctor/:doctorId", authMiddleware, getDoctorAppointments);

module.exports = router;