const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { getAllRecords } = require('../utils/dbHelpers');
const verifyToken = require("../middleware/verifyToken");

// GET /appointments
router.get('/',verifyToken, (req, res) => getAllRecords('appointment', res));

// GET /appointments/:userID  (by patient userID)
router.get('/:userID', (req, res) => {
  const sql = `
    SELECT a.*, u.fullName AS doctorName
    FROM appointment a
    JOIN doctor d ON a.doctorID = d.doctorID
    JOIN user u ON d.userID = u.userID
    WHERE a.userID = ?
    ORDER BY a.dateTime DESC
  `;
  db.query(sql, [req.params.userID], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send(result);
  });
});

// POST /appointments
router.post('/',verifyToken, (req, res) => {
  const { doctorID, userID, dateTime, location } = req.body;

  db.query(
    'SELECT * FROM appointment WHERE doctorID=? AND userID=? AND dateTime=?',
    [doctorID, userID, dateTime],
    (err, result) => {
      if (err) return res.status(500).send(err);
      if (result.length > 0) {
        return res.status(400).json({ message: '⚠ You already have an appointment with this doctor on this date.' });
      }

      db.query(
        'INSERT INTO appointment (doctorID, userID, dateTime, location) VALUES (?,?,?,?)',
        [doctorID, userID, dateTime, location],
        (err2) => {
          if (err2) return res.status(500).send(err2);
          res.status(201).json({ message: 'Appointment created successfully!' });
        }
      );
    }
  );
});

// PUT /appointments/check-overdue
router.put('/check-overdue',verifyToken, (req, res) => {
  const sql = `
    UPDATE appointment
    SET appointmentStatus = 1
    WHERE appointmentStatus = 0 AND dateTime < CURDATE()
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error', details: err });
    res.json({ message: 'Overdue appointments updated', updatedCount: result.affectedRows });
  });
});

// GET /update-overdue  (legacy endpoint — kept for compatibility)
router.get('/update-overdue',verifyToken, (req, res) => {
  const sql = `
    UPDATE appointment
    SET appointmentStatus = 1
    WHERE DATE(dateTime) < CURDATE() AND appointmentStatus = 0
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Overdue appointments updated', affectedRows: result.affectedRows });
  });
});

module.exports = router;
