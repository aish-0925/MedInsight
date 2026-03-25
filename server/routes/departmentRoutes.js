const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment
} = require("../controllers/departmentController");

// CREATE DEPARTMENT
router.post("/", authMiddleware, createDepartment);

// GET ALL DEPARTMENTS
router.get("/", authMiddleware, getAllDepartments);

// GET DEPARTMENT BY ID
router.get("/:id", authMiddleware, getDepartmentById);

// UPDATE DEPARTMENT
router.put("/:id", authMiddleware, updateDepartment);

// DELETE DEPARTMENT
router.delete("/:id", authMiddleware, deleteDepartment);

module.exports = router;