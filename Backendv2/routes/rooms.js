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
    SELECT
      p.patientID,
      p.image,
      p.HI,
      u.fullName,
      u.CIC,
      u.gender,
      u.phone,
      u.email,
      u.dob
    FROM patient p
    INNER JOIN roompatient rp
      ON p.patientID = rp.patientID
    INNER JOIN user u
      ON p.userID = u.userID
    WHERE rp.roomID = ?
    ORDER BY u.fullName;
  `;

  db.query(query, [roomID], (err, results) => {
    if (err) {
      return res.status(500).json({
        error: "Database error",
        details: err
      });
    }

    res.json(results);
  });
});

// GET rooms by department
router.get("/department/:departmentID", verifyToken, (req, res) => {
  const { departmentID } = req.params;

  const sql = `
    SELECT 
      r.*,
      d.departmentName
    FROM room r
    JOIN department d ON r.departmentID = d.departmentID
    WHERE r.departmentID = ?
  `;

  db.query(sql, [departmentID], (err, results) => {
    if (err) {
      return res.status(500).json({
        error: "Database error",
        details: err
      });
    }

    res.json(results);
  });
});
module.exports = router;