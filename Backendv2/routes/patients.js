const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { getAllRecordsWithUser } = require('../utils/dbHelpers');
const verifyToken = require("../middleware/verifyToken");

// GET /patients
router.get('/',verifyToken, (req, res) => getAllRecordsWithUser('patient', res));
router.get("/forSearch", verifyToken, (req, res) => {
  const sql = `
    SELECT 
      p.patientID,
      p.HI,
      u.fullName AS relativeName
    FROM patient p
    LEFT JOIN user u ON p.userID = u.userID
    ORDER BY p.patientID DESC
  `;

  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});
// Get patient by userID
router.get('/patientByUserID/:userID', (req, res) => {
  const userID = req.params.userID;
  const query = `
    SELECT p.*, u.*, a.admissionID, a.status as admissionStatus, a.admissionDate, a.hospitalizationsDiagnosis, a.summaryCondition, b.roomID, b.bedNumber
    FROM patient p
    JOIN user u ON p.userID = u.userID
    LEFT JOIN admission a ON p.patientID = a.patientID AND a.status IN ('Init', 'In-treatment')
    LEFT JOIN bed b ON p.patientID = b.patientID
    WHERE p.userID = ?;
  `;
  db.query(query, [userID], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET /patients/:patientID
router.get('/:patientID', verifyToken,(req, res) => {
  const { patientID } = req.params;
  const query = `
    SELECT p.*, u.*, a.admissionID, a.status as admissionStatus, a.admissionDate, a.hospitalizationsDiagnosis, a.summaryCondition, b.roomID, b.bedNumber, d.diagnosisText as dischargeDiagnosis
    FROM patient p
    JOIN user u ON p.userID = u.userID
    LEFT JOIN admission a ON p.patientID = a.patientID AND a.status IN ('Init', 'In-treatment')
    LEFT JOIN bed b ON p.patientID = b.patientID
    LEFT JOIN discharge d ON a.dischargeID = d.dischargeID
    WHERE p.patientID = ?
  `;
  db.query(query, [patientID], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error', details: err });
    if (results.length === 0) return res.status(404).json({ error: 'Patient not found' });
    res.json(results[0]);
  });
});

// DELETE /patients/:patientID
router.delete('/:patientID',verifyToken, (req, res) => {
  const patientID = req.params.patientID;
  db.query('DELETE FROM patient WHERE patientID = ?', [patientID], (err, result) => {
    if (err) return res.status(500).json({ message: 'Failed to delete patient', error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Patient not found' });
    res.status(200).json({ message: 'Patient deleted successfully' });
  });
});

module.exports = router;
