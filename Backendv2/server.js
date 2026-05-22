const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const path = require("path");
const multer = require("multer");
const Tesseract = require("tesseract.js");
const { exec } = require("child_process");
const fs = require("fs");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Static uploads folder
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + path.extname(file.originalname)
    );
  }
});

const upload = multer({ storage });

// MySQL connection
const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "trungnhat",
  database: process.env.DB_NAME || "hospitaldb"
});

// JWT middleware
const verifyToken = require("./middleware/auth").verifyToken;

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/patients", require("./routes/patients"));
app.use("/api/doctors", require("./routes/doctors"));
app.use("/api/nurses", require("./routes/nurses"));
app.use("/api/appointments", require("./routes/appointments"));
app.use("/api/medical-records", require("./routes/medicalRecords"));
app.use("/api/schedules", require("./routes/schedules"));
app.use("/api/schedule-requests", require("./routes/scheduleRequests"));
app.use("/api/prescriptions", require("./routes/prescriptions"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/medicines", require("./routes/medicines"));

// Test route
app.get("/", (req, res) => {
  res.send("Hospital Backend Running");
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});