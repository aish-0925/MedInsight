const Patient = require("../models/Patient");

// CREATE PATIENT
exports.createPatient = async (req, res) => {
  try {
    const { name, age, gender, contact, bloodGroup, allergies, medicalHistory } = req.body;

    if (!name || !age || !gender || !contact) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const patient = await Patient.create({
      name,
      age,
      gender,
      contact,
      bloodGroup,
      allergies: allergies || [],
      medicalHistory: medicalHistory || []
    });

    res.status(201).json({
      message: "Patient created successfully",
      patient
    });
  } catch (error) {
    console.error("CREATE PATIENT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET ALL PATIENTS
exports.getAllPatients = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    
    let filter = {};
    if (search) {
      filter = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { contact: { $regex: search, $options: "i" } }
        ]
      };
    }

    const patients = await Patient.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Patient.countDocuments(filter);

    res.json({
      patients,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    console.error("GET PATIENTS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET PATIENT BY ID
exports.getPatientById = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findById(id);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json(patient);
  } catch (error) {
    console.error("GET PATIENT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// UPDATE PATIENT
exports.updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, gender, contact, bloodGroup, allergies, medicalHistory } = req.body;

    const patient = await Patient.findByIdAndUpdate(
      id,
      {
        name,
        age,
        gender,
        contact,
        bloodGroup,
        allergies,
        medicalHistory
      },
      { new: true }
    );

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json({
      message: "Patient updated successfully",
      patient
    });
  } catch (error) {
    console.error("UPDATE PATIENT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// DELETE PATIENT
exports.deletePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findByIdAndDelete(id);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json({ message: "Patient deleted successfully" });
  } catch (error) {
    console.error("DELETE PATIENT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ADD MEDICAL HISTORY
exports.addMedicalHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const { history } = req.body;

    if (!history) {
      return res.status(400).json({ message: "History is required" });
    }

    const patient = await Patient.findByIdAndUpdate(
      id,
      { $push: { medicalHistory: history } },
      { new: true }
    );

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json({
      message: "Medical history added successfully",
      patient
    });
  } catch (error) {
    console.error("ADD HISTORY ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ADD ALLERGY
exports.addAllergy = async (req, res) => {
  try {
    const { id } = req.params;
    const { allergy } = req.body;

    if (!allergy) {
      return res.status(400).json({ message: "Allergy is required" });
    }

    const patient = await Patient.findByIdAndUpdate(
      id,
      { $push: { allergies: allergy } },
      { new: true }
    );

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json({
      message: "Allergy added successfully",
      patient
    });
  } catch (error) {
    console.error("ADD ALLERGY ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = exports;