const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { getAllRecordsWithUser } = require('../utils/dbHelpers');

// GET /patients
router.get('/', (req, res) => getAllRecordsWithUser('patient', res));

// GET /patients/:patientID
router.get('/:patientID', (req, res) => {
  const { patientID } = req.params;
  const query = `
    SELECT p.*, u.*
    FROM patient p
    JOIN user u ON p.userID = u.userID
    WHERE p.patientID = ?
  `;
  db.query(query, [patientID], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error', details: err });
    if (results.length === 0) return res.status(404).json({ error: 'Patient not found' });
    res.json(results[0]);
  });
});

// DELETE /patients/:patientID
router.delete('/:patientID', (req, res) => {
  const patientID = req.params.patientID;
  db.query('DELETE FROM patient WHERE patientID = ?', [patientID], (err, result) => {
    if (err) return res.status(500).json({ message: 'Failed to delete patient', error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Patient not found' });
    res.status(200).json({ message: 'Patient deleted successfully' });
  });
});

module.exports = router;
