const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  createFeedback,
  getAllFeedback,
  getFeedbackAnalytics,
  getDepartmentFeedback,
  deleteFeedback
} = require("../controllers/feedbackController");

// CREATE FEEDBACK
router.post("/", authMiddleware, createFeedback);

// GET ALL FEEDBACK
router.get("/", authMiddleware, getAllFeedback);

// GET FEEDBACK ANALYTICS
router.get("/analytics/:departmentId", authMiddleware, getFeedbackAnalytics);

// GET DEPARTMENT FEEDBACK
router.get("/department/:departmentId", authMiddleware, getDepartmentFeedback);

// DELETE FEEDBACK
router.delete(":id", authMiddleware, deleteFeedback);

module.exports = router;