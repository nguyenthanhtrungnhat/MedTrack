const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { getAllRecordsWithUser } = require('../utils/dbHelpers');
const verifyToken = require("../middleware/verifyToken");

// GET /nurses
router.get('/', (req, res) => getAllRecordsWithUser('nurse', res));

// Get full nurse details by userID
router.get("/by-user/:userID", (req, res) => {
  const { userID } = req.params;
  const query = `
    SELECT n.*, u.*
    FROM nurse n
    JOIN user u ON n.userID = u.userID
    WHERE n.userID = ?;
  `;
  db.query(query, [userID], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error", details: err });
    if (results.length === 0) return res.status(404).json({ error: "Nurse not found" });
    res.json(results[0]);
  });
});

// GET /nurses/:nurseID
router.get('/:nurseID',verifyToken, (req, res) => {
  const { nurseID } = req.params;
  const query = `
    SELECT n.*, u.*
    FROM nurse n
    JOIN user u ON n.userID = u.userID
    WHERE n.nurseID = ?
  `;
  db.query(query, [nurseID], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error', details: err });
    if (results.length === 0) return res.status(404).json({ error: 'Nurse not found' });
    res.json(results[0]);
  });
});

// GET /nurses/by-user/:userID
router.get('/by-user/:userID',verifyToken, (req, res) => {
  const { userID } = req.params;
  const query = `
    SELECT n.*, u.*
    FROM nurse n
    JOIN user u ON n.userID = u.userID
    WHERE n.userID = ?
  `;
  db.query(query, [userID], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error', details: err });
    if (results.length === 0) return res.status(404).json({ error: 'Nurse not found' });
    res.json(results[0]);
  });
});

// DELETE /nurses/:nurseID
router.delete('/:nurseID',verifyToken, (req, res) => {
  const nurseID = req.params.nurseID;
  db.query('DELETE FROM nurse WHERE nurseID = ?', [nurseID], (err, result) => {
    if (err) return res.status(500).json({ message: 'Failed to delete nurse', error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Nurse not found' });
    res.status(200).json({ message: 'Nurse deleted successfully' });
  });
});

module.exports = router;
