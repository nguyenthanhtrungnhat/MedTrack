const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require("../middleware/verifyToken");

// GET /clinical-exams/pending
// Gets all clinical exams that are not yet admitted (admissionID IS NULL)
router.get('/pending', verifyToken, (req, res) => {
  const sql = `
    SELECT ce.*, p.patientID, u.fullName, u.dob, u.phone, p.image, u.CIC
    FROM clinical_examinations ce
    JOIN patient p ON ce.patientID = p.patientID
    JOIN user u ON p.userID = u.userID
    WHERE ce.admissionID IS NULL
    ORDER BY ce.examDate DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'DB Error', details: err.message });
    res.json(results);
  });
});

// GET /clinical-exams/patient/:patientID
router.get('/patient/:patientID', verifyToken, (req, res) => {
  const patientID = req.params.patientID;
  const sql = `
    SELECT * FROM clinical_examinations WHERE patientID = ? ORDER BY examDate DESC
  `;
  db.query(sql, [patientID], (err, results) => {
    if (err) return res.status(500).json({ error: 'DB Error', details: err.message });
    res.json(results);
  });
});

// POST /clinical-exams
router.post('/', verifyToken, (req, res) => {
  const {
    patientID, height, weight, bloodPressure, heartRate, temperature,
    generalCondition, symptoms, diagnosis
  } = req.body;
  const doctorID = req.user.userID; // Assuming whoever logged in (nurse/doctor) is the creator

  const sql = `
    INSERT INTO clinical_examinations 
    (patientID, doctorID, height, weight, bloodPressure, heartRate, temperature, generalCondition, symptoms, diagnosis) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, [
    patientID, doctorID, height, weight, bloodPressure, heartRate, temperature, generalCondition, symptoms, diagnosis
  ], (err, result) => {
    if (err) return res.status(500).json({ error: 'DB Error', details: err.message });
    res.status(201).json({ message: 'Clinical examination created', examID: result.insertId });
  });
});
// GET pending clinical exam count by doctor
router.get("/pending-count/:doctorID", verifyToken, (req, res) => {
    const { doctorID } = req.params;

    const sql = `
        SELECT COUNT(*) AS total
        FROM clinical_exams
        WHERE doctorID = ?
          AND status = 'Pending'
    `;

    db.query(sql, [doctorID], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Database error"
            });
        }

        res.json({
            count: result[0].total
        });
    });
});
module.exports = router;
