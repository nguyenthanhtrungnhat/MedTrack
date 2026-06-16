const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require("../middleware/verifyToken");
const { getAllRecords } = require('../utils/dbHelpers');

// GET /medical-records
router.get('/',verifyToken, (req, res) => getAllRecords('medicalrecords', res));

// GET /medical-records/:patientID
router.get('/:patientID',verifyToken, (req, res) => {
  const { patientID } = req.params;
  
  // Get active admissionID for this patient
  const admQuery = `SELECT admissionID FROM admission WHERE patientID = ? AND status IN ('Init', 'In-treatment') ORDER BY admissionDate DESC LIMIT 1`;
  
  db.query(admQuery, [patientID], (err, admResults) => {
    if (err) return res.status(500).json({ error: 'Database error', details: err });
    
    let query = 'SELECT * FROM medicalrecords WHERE patientID = ? ORDER BY timeCreate DESC';
    let params = [patientID];
    
    if (admResults.length > 0) {
      query = 'SELECT * FROM medicalrecords WHERE patientID = ? AND admissionID = ? ORDER BY timeCreate DESC';
      params = [patientID, admResults[0].admissionID];
    }
    
    db.query(query, params, (err2, results) => {
      if (err2) return res.status(500).json({ error: 'Database error', details: err2 });
      if (results.length === 0) return res.status(404).json({ error: 'No records found' });
      res.json(results);
    });
  });
});

// GET /medical-records/by-recordId/:recordID
router.get('/by-recordId/:recordID',verifyToken, (req, res) => {
  const recordID = parseInt(req.params.recordID);
  if (isNaN(recordID)) return res.status(400).json({ error: 'Invalid recordID' });

  db.query('SELECT * FROM medicalrecords WHERE recordID = ?', [recordID], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (results.length === 0) return res.status(404).json({ message: 'Record not found' });
    res.json(results[0]);
  });
});

// POST /post-medical-records
router.post('/', verifyToken, (req, res) => {
  const {
    patientID, admissionID, heartRate, pulse, hurtScale,
    temperature, currentCondition, SP02, healthStatus,
    respiratoryRate, bloodPressure, urine, oxygenTherapy, sensorium,
  } = req.body;

  const userID = req.user.userID;
  const roleID = req.user.roleID;

  const sql = `
    INSERT INTO medicalrecords 
    (patientID, admissionID, heartRate, pulse, hurtScale, temperature,
     currentCondition, SP02, healthStatus, respiratoryRate, bloodPressure,
     urine, oxygenTherapy, sensorium) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [
    patientID, admissionID, heartRate, pulse, hurtScale, temperature,
    currentCondition, SP02, healthStatus, respiratoryRate, bloodPressure,
    urine, oxygenTherapy, sensorium,
  ], (err, result) => {
    if (err) return res.status(500).json({ message: 'Server error', error: err });
    res.status(201).json({ message: 'Medical record added successfully', recordID: result.insertId, addedBy: userID, roleID });
  });
});

module.exports = router;
