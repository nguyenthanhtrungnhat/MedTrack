const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { getAllRecords } = require('../utils/dbHelpers');
const verifyToken = require("../middleware/verifyToken");

// GET /doctors
router.get('/',verifyToken, (req, res) => getAllRecords('room', res));

// API to get patients by roomID
router.get("/:roomID/patients", (req, res) => {
  const { roomID } = req.params;
  const query = `
      SELECT p.*, u.fullName, u.email, u.phone
      FROM patient p
      JOIN roompatient rp ON p.patientID = rp.patientID
      JOIN user u ON p.userID = u.userID 
      WHERE rp.roomID = ?;
  `;
  db.query(query, [roomID], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error", details: err });
    res.json(results);
  });
});

module.exports = router;