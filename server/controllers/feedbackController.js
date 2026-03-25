const Feedback = require("../models/Feedback");
const Patient = require("../models/Patient");
const Department = require("../models/Department");

// CREATE FEEDBACK
exports.createFeedback = async (req, res) => {
  try {
    const { patient, department, rating, review, sentiment, keywords } = req.body;

    if (!rating || !department) {
      return res.status(400).json({ message: "Rating and department are required" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const feedback = await Feedback.create({
      patient,
      department,
      rating,
      review,
      sentiment: sentiment || "neutral",
      keywords: keywords || []
    });

    res.status(201).json({
      message: "Feedback submitted successfully",
      feedback: await feedback.populate([
        { path: "patient" },
        { path: "department" }
      ])
    });
  } catch (error) {
    console.error("CREATE FEEDBACK ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET ALL FEEDBACK
exports.getAllFeedback = async (req, res) => {
  try {
    const { department, sentiment, page = 1, limit = 10 } = req.query;

    let filter = {};
    if (department) filter.department = department;
    if (sentiment) filter.sentiment = sentiment;

    const feedback = await Feedback.find(filter)
      .populate([
        { path: "patient" },
        { path: "department" }
      ])
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Feedback.countDocuments(filter);

    res.json({
      feedback,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    console.error("GET FEEDBACK ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET FEEDBACK ANALYTICS
exports.getFeedbackAnalytics = async (req, res) => {
  try {
    const { departmentId } = req.params;

    let filter = {};
    if (departmentId) filter.department = departmentId;

    const allFeedback = await Feedback.find(filter);

    // Calculate average rating
    const avgRating = allFeedback.length > 0
      ? (allFeedback.reduce((sum, f) => sum + f.rating, 0) / allFeedback.length).toFixed(1)
      : 0;

    // Sentiment distribution
    const sentiments = {
      positive: allFeedback.filter(f => f.sentiment === "positive").length,
      neutral: allFeedback.filter(f => f.sentiment === "neutral").length,
      negative: allFeedback.filter(f => f.sentiment === "negative").length
    };

    // Rating distribution
    const ratingDistribution = {};
    for (let i = 1; i <= 5; i++) {
      ratingDistribution[i] = allFeedback.filter(f => f.rating === i).length;
    }

    // Top keywords
    const keywordCount = {};
    allFeedback.forEach(f => {
      f.keywords.forEach(keyword => {
        keywordCount[keyword] = (keywordCount[keyword] || 0) + 1;
      });
    });

    const topKeywords = Object.entries(keywordCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([keyword, count]) => ({ keyword, count }));

    res.json({
      totalFeedback: allFeedback.length,
      avgRating,
      sentiments,
      ratingDistribution,
      topKeywords
    });
  } catch (error) {
    console.error("GET FEEDBACK ANALYTICS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET DEPARTMENT FEEDBACK
exports.getDepartmentFeedback = async (req, res) => {
  try {
    const { departmentId } = req.params;

    const feedback = await Feedback.find({ department: departmentId })
      .populate("patient")
      .sort({ createdAt: -1 });

    const avgRating = feedback.length > 0
      ? (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1)
      : 0;

    res.json({
      departmentId,
      totalFeedback: feedback.length,
      avgRating,
      feedback
    });
  } catch (error) {
    console.error("GET DEPARTMENT FEEDBACK ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// DELETE FEEDBACK
exports.deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const feedback = await Feedback.findByIdAndDelete(id);

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    res.json({ message: "Feedback deleted successfully" });
  } catch (error) {
    console.error("DELETE FEEDBACK ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = exports;