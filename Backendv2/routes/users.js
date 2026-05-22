const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require("../middleware/verifyToken");
const { getAllRecords } = require('../utils/dbHelpers');

// GET /users
router.get('/', (req, res) => getAllRecords('user', res));

// GET /api/users/basic/:userID  (sidebar data)
router.get('/basic/:userID',verifyToken, (req, res) => {
  const { userID } = req.params;
  db.query('SELECT fullName, phone FROM user WHERE userID = ?', [userID], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (result.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(result[0]);
  });
});

// GET /api/patientByUserID/:userID
router.get('/patientByUserID/:userID',verifyToken,(req, res) => {
  const userID = req.params.userID;
  const query = `
    SELECT p.*, u.*
    FROM patient p
    JOIN user u ON p.userID = u.userID
    WHERE p.userID = ?
  `;
  db.query(query, [userID], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// PUT /api/patient/complete  (update patient info)
router.put('/patient/complete', verifyToken, (req, res) => {
  const { userID, fullName, gender, dob, phone, address, HI, relativeName, relativeNumber, CIC } = req.body;

  if (!userID || !fullName || !gender || !dob || !phone || !address || !CIC)
    return res.status(400).json({ message: 'Missing required fields' });

  const updateUserSql = `
    UPDATE user SET fullName=?, gender=?, dob=?, phone=?, address=?, CIC=? WHERE userID=?
  `;
  db.query(updateUserSql, [fullName, gender, dob, phone, address, CIC, userID], (err1) => {
    if (err1) return res.status(500).json({ message: 'Failed to update user info', error: err1 });

    db.query('SELECT patientID FROM patient WHERE userID = ? LIMIT 1', [userID], (err2, rows) => {
      if (err2) return res.status(500).json({ message: 'Database error', error: err2 });
      if (rows.length === 0) return res.status(404).json({ message: 'No patient record found for this user' });

      const patientID = rows[0].patientID;
      const updatePatientSql = `
        UPDATE patient SET HI=?, relativeName=?, relativeNumber=? WHERE patientID=?
      `;
      db.query(updatePatientSql, [HI, relativeName, relativeNumber, patientID], (err3) => {
        if (err3) return res.status(500).json({ message: 'Failed to update patient info', error: err3 });
        res.status(200).json({ message: '✅ Patient information updated successfully' });
      });
    });
  });
});

module.exports = router;
