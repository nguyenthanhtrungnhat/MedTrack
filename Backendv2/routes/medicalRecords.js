const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require("../middleware/verifyToken");
const { getAllRecords } = require('../utils/dbHelpers');

// GET /medical-records
router.get('/',verifyToken, (req, res) => getAllRecords('medicalrecords', res));

// GET /medical-records/:patientID
router.get('/:patientID', verifyToken, (req, res) => {
    const { patientID } = req.params;

    // console.log("PatientID:", patientID);

    const sql = `
        SELECT *
        FROM medicalrecords mr
        WHERE mr.admissionID = (
            SELECT admissionID
            FROM admission
            WHERE patientID = ?
            ORDER BY admissionDate DESC
            LIMIT 1
        )
        ORDER BY mr.timeCreate DESC
    `;

    db.query(sql, [patientID], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }

        // console.log("Records found:", results.length);
        // console.log(results);

        res.json(results);
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

  const insertRecord = (admID) => {
    const sql = `
      INSERT INTO medicalrecords 
      (patientID, admissionID, heartRate, pulse, hurtScale, temperature,
       currentCondition, SP02, healthStatus, respiratoryRate, bloodPressure,
       urine, oxygenTherapy, sensorium) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [
      patientID, admID, heartRate, pulse, hurtScale, temperature,
      currentCondition, SP02, healthStatus, respiratoryRate, bloodPressure,
      urine, oxygenTherapy, sensorium,
    ], (err, result) => {
      if (err) return res.status(500).json({ message: 'Server error', error: err });
      res.status(201).json({ message: 'Medical record added successfully', recordID: result.insertId, addedBy: userID, roleID });
    });
  };

  if (!admissionID) {
    db.query('SELECT admissionID FROM admission WHERE patientID = ? ORDER BY admissionDate DESC LIMIT 1', [patientID], (err, results) => {
      if (err) return res.status(500).json({ message: 'Server error fetching admission', error: err });
      const latestAdmID = results.length > 0 ? results[0].admissionID : null;
      insertRecord(latestAdmID);
    });
  } else {
    insertRecord(admissionID);
  }
});

module.exports = router;
