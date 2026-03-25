const Admission = require("../models/Admission");
const Bed = require("../models/Bed");
const Patient = require("../models/Patient");
const Department = require("../models/Department");

// ADMIT PATIENT
exports.admitPatient = async (req, res) => {
  try {
    const { patient, department, bed, doctor } = req.body;

    if (!patient || !department || !bed || !doctor) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if patient exists
    const patientExists = await Patient.findById(patient);
    if (!patientExists) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Check if bed is available
    const bedDoc = await Bed.findById(bed);
    if (!bedDoc || bedDoc.status !== "available") {
      return res.status(400).json({ message: "Bed is not available" });
    }

    // Create admission
    const admission = await Admission.create({
      patient,
      department,
      bed,
      doctor,
      status: "admitted",
      admittedAt: new Date()
    });

    // Update bed status
    await Bed.findByIdAndUpdate(bed, { status: "occupied" });

    res.status(201).json({
      message: "Patient admitted successfully",
      admission: await admission.populate([
        { path: "patient" },
        { path: "department" },
        { path: "bed" },
        { path: "doctor", select: "name email role" }
      ])
    });
  } catch (error) {
    console.error("ADMIT PATIENT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET ALL ADMISSIONS
exports.getAllAdmissions = async (req, res) => {
  try {
    const { status, department, page = 1, limit = 10 } = req.query;

    let filter = {};
    if (status) filter.status = status;
    if (department) filter.department = department;

    const admissions = await Admission.find(filter)
      .populate([
        { path: "patient" },
        { path: "department" },
        { path: "bed" },
        { path: "doctor", select: "name email role" }
      ])
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ admittedAt: -1 });

    const total = await Admission.countDocuments(filter);

    res.json({
      admissions,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    console.error("GET ADMISSIONS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET ADMISSION BY ID
exports.getAdmissionById = async (req, res) => {
  try {
    const { id } = req.params;
    const admission = await Admission.findById(id).populate([
      { path: "patient" },
      { path: "department" },
      { path: "bed" },
      { path: "doctor", select: "name email role" }
    ]);

    if (!admission) {
      return res.status(404).json({ message: "Admission not found" });
    }

    res.json(admission);
  } catch (error) {
    console.error("GET ADMISSION ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// DISCHARGE PATIENT
exports.dischargePatient = async (req, res) => {
  try {
    const { id } = req.params;

    const admission = await Admission.findById(id);
    if (!admission) {
      return res.status(404).json({ message: "Admission not found" });
    }

    // Update admission status
    admission.status = "discharged";
    admission.dischargedAt = new Date();
    await admission.save();

    // Free the bed
    if (admission.bed) {
      await Bed.findByIdAndUpdate(admission.bed, { status: "available" });
    }

    const updatedAdmission = await admission.populate([
      { path: "patient" },
      { path: "department" },
      { path: "bed" },
      { path: "doctor", select: "name email role" }
    ]);

    res.json({
      message: "Patient discharged successfully",
      admission: updatedAdmission
    });
  } catch (error) {
    console.error("DISCHARGE PATIENT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// TRANSFER PATIENT
exports.transferPatient = async (req, res) => {
  try {
    const { id } = req.params;
    const { newDepartment, newBed } = req.body;

    if (!newDepartment || !newBed) {
      return res.status(400).json({ message: "New department and bed are required" });
    }

    const admission = await Admission.findById(id);
    if (!admission) {
      return res.status(404).json({ message: "Admission not found" });
    }

    if (admission.status !== "admitted") {
      return res.status(400).json({ message: "Only admitted patients can be transferred" });
    }

    // Check if new bed is available
    const newBedDoc = await Bed.findById(newBed);
    if (!newBedDoc || newBedDoc.status !== "available") {
      return res.status(400).json({ message: "New bed is not available" });
    }

    // Free old bed
    await Bed.findByIdAndUpdate(admission.bed, { status: "available" });

    // Update admission
    admission.department = newDepartment;
    admission.bed = newBed;
    await admission.save();

    // Occupy new bed
    await Bed.findByIdAndUpdate(newBed, { status: "occupied" });

    const updatedAdmission = await admission.populate([
      { path: "patient" },
      { path: "department" },
      { path: "bed" },
      { path: "doctor", select: "name email role" }
    ]);

    res.json({
      message: "Patient transferred successfully",
      admission: updatedAdmission
    });
  } catch (error) {
    console.error("TRANSFER PATIENT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET ACTIVE ADMISSIONS COUNT
exports.getActiveAdmissionsCount = async (req, res) => {
  try {
    const count = await Admission.countDocuments({ status: "admitted" });

    res.json({
      activeAdmissions: count
    });
  } catch (error) {
    console.error("GET COUNT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = exports;