const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { getAllRecordsWithUser } = require('../utils/dbHelpers');
const verifyToken = require("../middleware/verifyToken");

// GET /doctors
router.get('/',verifyToken, (req, res) => getAllRecordsWithUser('doctor', res));

// GET /doctors/:doctorID
router.get('/:doctorID',verifyToken, (req, res) => {
  const { doctorID } = req.params;
  const query = `
    SELECT d.*, u.*
    FROM doctor d
    JOIN user u ON d.userID = u.userID
    WHERE d.doctorID = ?
  `;
  db.query(query, [doctorID], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error', details: err });
    if (results.length === 0) return res.status(404).json({ error: 'Doctor not found' });
    res.json(results[0]);
  });
});

// GET /doctors/by-user/:userID
router.get('/by-user/:userID',verifyToken, (req, res) => {
  const { userID } = req.params;
  const query = `
    SELECT d.*, u.*
    FROM doctor d
    JOIN user u ON d.userID = u.userID
    WHERE d.userID = ?
  `;
  db.query(query, [userID], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error', details: err });
    if (results.length === 0) return res.status(404).json({ error: 'Doctor not found' });
    res.json(results[0]);
  });
});

// DELETE /doctors/:doctorID
router.delete('/:doctorID',verifyToken, (req, res) => {
  const doctorID = req.params.doctorID;
  db.query('DELETE FROM doctor WHERE doctorID = ?', [doctorID], (err, result) => {
    if (err) return res.status(500).json({ message: 'Failed to delete doctor', error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Doctor not found' });
    res.status(200).json({ message: 'Doctor deleted successfully' });
  });
});

// GET /api/appointment/doctor/:doctorID  (today only)
router.get('/:doctorID/appointments/today', verifyToken,(req, res) => {
  const doctorID = req.params.doctorID;
  const sql = `
    SELECT a.appointmentID, a.dateTime, a.location, a.appointmentStatus,
           d.doctorID, u.fullName AS patientName
    FROM appointment a
    LEFT JOIN user u ON a.userID = u.userID
    LEFT JOIN doctor d ON a.doctorID = d.doctorID
    WHERE a.doctorID = ?
      AND DATE(a.dateTime) = CURDATE()
    ORDER BY a.dateTime DESC
  `;
  db.query(sql, [doctorID], (err, result) => {
    if (err) return res.status(500).json({ message: 'Query Failed', error: err });
    res.json(result);
  });
});

// GET /api/all-appointment/doctor/:doctorID  (all)
router.get('/:doctorID/appointments',verifyToken, (req, res) => {
  const doctorID = req.params.doctorID;
  const sql = `
    SELECT a.appointmentID, a.dateTime, a.location, a.appointmentStatus,
           d.doctorID, u.fullName AS patientName
    FROM appointment a
    LEFT JOIN user u ON a.userID = u.userID
    LEFT JOIN doctor d ON a.doctorID = d.doctorID
    WHERE a.doctorID = ?
    ORDER BY a.dateTime DESC
  `;
  db.query(sql, [doctorID], (err, result) => {
    if (err) return res.status(500).json({ message: 'Query Failed', error: err });
    res.json(result);
  });
});

module.exports = router;
