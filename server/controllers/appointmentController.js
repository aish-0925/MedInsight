'use strict';

const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const User = require("../models/User");
const Department = require("../models/Department");

// CREATE APPOINTMENT
exports.createAppointment = async (req, res) => {
  try {
    const { patient, doctor, department, time } = req.body;

    if (!patient || !doctor || !department || !time) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if patient exists
    const patientExists = await Patient.findById(patient);
    if (!patientExists) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Check if doctor exists
    const doctorExists = await User.findById(doctor);
    if (!doctorExists || doctorExists.role !== "doctor") {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const appointment = await Appointment.create({
      patient,
      doctor,
      department,
      time: new Date(time),
      status: "scheduled"
    });

    const populatedAppointment = await appointment.populate([
      { path: "patient" },
      { path: "doctor", select: "name email role" },
      { path: "department" }
    ]);

    res.status(201).json({
      message: "Appointment scheduled successfully",
      appointment: populatedAppointment
    });
  } catch (error) {
    console.error("CREATE APPOINTMENT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET ALL APPOINTMENTS
exports.getAllAppointments = async (req, res) => {
  try {
    const { status, doctor, patient, page = 1, limit = 10 } = req.query;

    let filter = {};
    if (status) filter.status = status;
    if (doctor) filter.doctor = doctor;
    if (patient) filter.patient = patient;

    const appointments = await Appointment.find(filter)
      .populate([
        { path: "patient" },
        { path: "doctor", select: "name email role" },
        { path: "department" }
      ])
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ time: 1 });

    const total = await Appointment.countDocuments(filter);

    res.json({
      appointments,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    console.error("GET APPOINTMENTS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET APPOINTMENT BY ID
exports.getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id).populate([
      { path: "patient" },
      { path: "doctor", select: "name email role" },
      { path: "department" }
    ]);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json(appointment);
  } catch (error) {
    console.error("GET APPOINTMENT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// UPDATE APPOINTMENT STATUS
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["scheduled", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate([
      { path: "patient" },
      { path: "doctor", select: "name email role" },
      { path: "department" }
    ]);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({
      message: "Appointment status updated successfully",
      appointment
    });
  } catch (error) {
    console.error("UPDATE APPOINTMENT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// RESCHEDULE APPOINTMENT
exports.rescheduleAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { time } = req.body;

    if (!time) {
      return res.status(400).json({ message: "New time is required" });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { time: new Date(time) },
      { new: true }
    ).populate([
      { path: "patient" },
      { path: "doctor", select: "name email role" },
      { path: "department" }
    ]);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({
      message: "Appointment rescheduled successfully",
      appointment
    });
  } catch (error) {
    console.error("RESCHEDULE APPOINTMENT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// CANCEL APPOINTMENT
exports.cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status: "cancelled" },
      { new: true }
    ).populate([
      { path: "patient" },
      { path: "doctor", select: "name email role" },
      { path: "department" }
    ]);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({
      message: "Appointment cancelled successfully",
      appointment
    });
  } catch (error) {
    console.error("CANCEL APPOINTMENT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET DOCTOR'S APPOINTMENTS
exports.getDoctorAppointments = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { status } = req.query;

    let filter = { doctor: doctorId };
    if (status) filter.status = status;

    const appointments = await Appointment.find(filter)
      .populate([
        { path: "patient" },
        { path: "department" }
      ])
      .sort({ time: 1 });

    res.json(appointments);
  } catch (error) {
    console.error("GET DOCTOR APPOINTMENTS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = exports;