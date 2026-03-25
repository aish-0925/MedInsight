// server/server.js

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const patientRoutes = require("./routes/patientRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const bedRoutes = require("./routes/bedRoutes");

const app = express();

// ============================================
// MIDDLEWARE
// ============================================

// CORS Configuration
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Body Parser
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// ============================================
// DATABASE CONNECTION
// ============================================
connectDB();

// ============================================
// API ROUTES
// ============================================

// Authentication Routes
app.use("/api/auth", authRoutes);

// Dashboard Route
app.use("/api/dashboard", dashboardRoutes);

// Patient Management Routes
app.use("/api/patients", patientRoutes);

// Appointment Routes
app.use("/api/appointments", appointmentRoutes);

// Inventory Routes
app.use("/api/inventory", inventoryRoutes);

// Feedback & Analytics Routes
app.use("/api/feedback", feedbackRoutes);

// Department Management Routes
app.use("/api/departments", departmentRoutes);

// Bed Management Routes
app.use("/api/beds", bedRoutes);

// ============================================
// HEALTH CHECK ENDPOINT
// ============================================
app.get("/", (req, res) => {
  res.status(200).json({
    message: "MedInsight API Running ✅",
    version: "1.0.0",
    status: "OK",
    timestamp: new Date()
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date()
  });
});

// ============================================
// ERROR HANDLING MIDDLEWARE
// ============================================

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.path,
    method: req.method
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Error:", err);

  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({
    success: false,
    status,
    message,
    timestamp: new Date()
  });
});

// ============================================
// SERVER STARTUP
// ============================================

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║    🏥 MedInsight Server Started        ║
╠════════════════════════════════════════╣
║ Port: ${PORT}                           
║ Environment: ${process.env.NODE_ENV || "development"}
║ Status: ✅ Running
╚════════════════════════════════════════╝
  `);
});

// Handle unhandled rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  process.exit(1);
});