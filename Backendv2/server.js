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
app.use("/auth", require("./routes/auth"));
app.use("/users", require("./routes/users"));
app.use("/patients", require("./routes/patients"));
app.use("/doctors", require("./routes/doctors"));
app.use("/nurses", require("./routes/nurses"));
app.use("/appointments", require("./routes/appointments"));
app.use("/medical-records", require("./routes/medicalRecords"));
app.use("/schedules", require("./routes/schedules"));
app.use("/schedule-requests", require("./routes/scheduleRequests"));
app.use("/prescriptions", require("./routes/prescriptions"));
app.use("/admin", require("./routes/admin"));
app.use("/medicines", require("./routes/medicines"));
app.use("/news", require("./routes/news"));
app.use("/rooms", require("./routes/rooms"));
app.use("/testresult", require("./routes/testresult"));
app.use("/treatmenttimeline", require("./routes/treatmenttimeline"));
app.use("/departments", require("./routes/departments"));
app.use("/doctororder", require("./routes/doctororder"));
app.use("/testtype", require("./routes/testtype"));
app.use("/admission", require("./routes/admission"));
app.use("/clinical-exams", require("./routes/clinicalExams"));
// Test route
app.get("/", (req, res) => {
  res.send("Hospital Backend Running");
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});