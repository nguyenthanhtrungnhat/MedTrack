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
      u.dob,
      b.bedNumber
    FROM patient p
    INNER JOIN bed b
      ON p.patientID = b.patientID
    INNER JOIN user u
      ON p.userID = u.userID
    WHERE b.roomID = ?
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
// GET beds for a specific room
router.get("/:roomID/beds", verifyToken, (req, res) => {
  const { roomID } = req.params;
  const sql = `
    SELECT b.*, p.image, u.fullName, u.dob, a.admissionDate, a.hospitalizationsDiagnosis 
    FROM bed b
    LEFT JOIN patient p ON b.patientID = p.patientID
    LEFT JOIN user u ON p.userID = u.userID
    LEFT JOIN admission a ON p.patientID = a.patientID AND a.status IN ('Paid', 'In-treatment')
    WHERE b.roomID = ?
    ORDER BY b.bedNumber ASC
  `;
  db.query(sql, [roomID], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error", details: err });
    res.json(results);
  });
});

// PUT assign patient to a bed
router.put("/beds/:bedID/assign", verifyToken, (req, res) => {
  const { bedID } = req.params;
  const { patientID, admissionID } = req.body;

  if (!patientID || !admissionID) return res.status(400).json({ message: "Missing patientID or admissionID" });

  db.beginTransaction(err => {
    if (err) return res.status(500).json({ message: "Transaction start failed", error: err });

    // Update bed
    db.query(`UPDATE bed SET status = 'In Use', patientID = ? WHERE bedID = ? AND status = 'Empty'`, [patientID, bedID], (err1, result1) => {
      if (err1 || result1.affectedRows === 0) {
        return db.rollback(() => res.status(400).json({ message: "Bed is not empty or error updating bed", err: err1 }));
      }

      // Update admission status
      db.query(`UPDATE admission SET status = 'In-treatment' WHERE admissionID = ? AND status = 'Paid'`, [admissionID], (err2, result2) => {
        if (err2 || result2.affectedRows === 0) {
          return db.rollback(() => res.status(400).json({ message: "Error updating admission status", err: err2 }));
        }

        db.commit(err3 => {
          if (err3) return db.rollback(() => res.status(500).json({ message: "Commit failed", err: err3 }));
          res.json({ message: "Patient successfully assigned to bed." });
        });
      });
    });
  });
});

module.exports = router;