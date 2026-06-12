const express = require("express");
const router = express.Router();
const db = require("../config/db");
const verifyToken = require("../middleware/verifyToken");

// ======================================================
// GET ALL (ADMIN / DEBUG)
// ======================================================
router.get("/", verifyToken, (req, res) => {
  const sql = `
    SELECT *
    FROM appointment
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});


// ======================================================
// GET BY USER (PATIENT VIEW)
// ======================================================
router.get("/:userID", verifyToken, (req, res) => {
  const sql = `
    SELECT 
      a.*,
      u.fullName AS doctorName
    FROM appointment a
    JOIN doctor d ON a.doctorID = d.doctorID
    JOIN user u ON d.userID = u.userID
    WHERE a.userID = ?
    ORDER BY a.dateTime DESC
  `;

  db.query(sql, [req.params.userID], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});


// ======================================================
// CREATE APPOINTMENT
// ======================================================
router.post("/", verifyToken, (req, res) => {
  const { doctorID, userID, dateTime, location } = req.body;

  const checkSql = `
    SELECT * FROM appointment
    WHERE doctorID=? AND userID=? AND dateTime=?
  `;

  db.query(checkSql, [doctorID, userID, dateTime], (err, result) => {
    if (err) return res.status(500).send(err);

    if (result.length > 0) {
      return res.status(400).json({
        message: "⚠ Appointment already exists"
      });
    }

    const insertSql = `
      INSERT INTO appointment
      (doctorID, userID, dateTime, location, attendanceStatus)
      VALUES (?,?,?,?,0)
    `;

    db.query(
      insertSql,
      [doctorID, userID, dateTime, location],
      (err2) => {
        if (err2) return res.status(500).send(err2);
        res.status(201).json({ message: "Appointment created!" });
      }
    );
  });
});


// ======================================================
// AUTO MARK MISSED (PAST + NOT DONE)
// ======================================================
router.put("/check-missed", verifyToken, (req, res) => {
  const sql = `
    UPDATE appointment
    SET attendanceStatus = 2
    WHERE attendanceStatus = 0
    AND dateTime < CURDATE()
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({
      message: "Missed updated",
      updatedCount: result.affectedRows
    });
  });
});


// ======================================================
// NURSE MARK AS DONE (CHECK-IN)
// ======================================================
router.put("/check-in/:id", verifyToken, (req, res) => {
  const sql = `
    UPDATE appointment
    SET attendanceStatus = 1
    WHERE appointmentID = ?
  `;

  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "Marked as Done" });
  });
});


// ======================================================
// GET TODAY (DOCTOR VIEW)
// ======================================================
router.get("/doctor/:doctorID", verifyToken, (req, res) => {
  const sql = `
    SELECT 
      a.appointmentID,
      a.dateTime,
      a.location,
      a.attendanceStatus,
      u.fullName AS patientName
    FROM appointment a
    LEFT JOIN user u ON a.userID = u.userID
    WHERE a.doctorID = ?
      AND DATE(a.dateTime) = CURDATE()
    ORDER BY a.dateTime ASC
  `;

  db.query(sql, [req.params.doctorID], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});


// ======================================================
// GET ALL BY DOCTOR (NURSE VIEW)
// ======================================================
router.get("/all-appointment/doctor/:doctorID", verifyToken, (req, res) => {
  const sql = `
    SELECT 
      a.appointmentID,
      a.dateTime,
      a.location,
      a.attendanceStatus,
      a.userID,
      u.fullName AS patientName
    FROM appointment a
    LEFT JOIN user u ON a.userID = u.userID
    WHERE a.doctorID = ?
    ORDER BY a.dateTime DESC
  `;

  db.query(sql, [req.params.doctorID], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

module.exports = router;