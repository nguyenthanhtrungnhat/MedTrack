const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/prescriptions
router.get('/', (req, res) => {
  const sql = `
    SELECT 
      p.prescriptionID, p.diagnosis, p.notes, p.createdAt,
      pt.patientID, pu.fullName AS patientName,
      d.doctorID,  du.fullName AS doctorName
    FROM prescriptions p
    LEFT JOIN patient pt ON p.patientID = pt.patientID
    LEFT JOIN user pu   ON pt.userID = pu.userID
    LEFT JOIN doctor d  ON p.doctorID = d.doctorID
    LEFT JOIN user du   ON d.userID = du.userID
    ORDER BY p.createdAt DESC
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ message: 'Error fetching prescriptions' });
    res.json(result);
  });
});

// GET /api/prescriptions/:id
router.get('/:id', (req, res) => {
  const prescriptionID = req.params.id;
  const sql = `
    SELECT 
      p.prescriptionID, p.diagnosis, p.notes, p.createdAt,
      pu.fullName AS patientName,
      du.fullName AS doctorName,
      m.medicineID, m.medicineName, m.genericName, m.dosageForm, m.strength,
      pi.dosage, pi.frequency, pi.durationDays, pi.quantity, pi.instructions
    FROM prescriptions p
    LEFT JOIN patient pt         ON p.patientID = pt.patientID
    LEFT JOIN user pu            ON pt.userID = pu.userID
    LEFT JOIN doctor d           ON p.doctorID = d.doctorID
    LEFT JOIN user du            ON d.userID = du.userID
    LEFT JOIN prescription_items pi ON p.prescriptionID = pi.prescriptionID
    LEFT JOIN medicines m        ON pi.medicineID = m.medicineID
    WHERE p.prescriptionID = ?
  `;
  db.query(sql, [prescriptionID], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json(result);
  });
});

// POST /make-prescriptions
router.post('/', (req, res) => {
  const { patientID, doctorID, diagnosis, notes, medicines } = req.body;

  db.query(
    'INSERT INTO prescriptions (patientID, doctorID, diagnosis, notes) VALUES (?, ?, ?, ?)',
    [patientID, doctorID, diagnosis, notes],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Error creating prescription' });

      const prescriptionID = result.insertId;

      if (!medicines || medicines.length === 0)
        return res.json({ message: 'Prescription created without medicines', prescriptionID });

      const sqlItems = `
        INSERT INTO prescription_items
        (prescriptionID, medicineID, dosage, frequency, durationDays, quantity, instructions)
        VALUES ?
      `;
      const values = medicines.map((m) => [
        prescriptionID, m.medicineID, m.dosage, m.frequency, m.durationDays, m.quantity, m.instructions,
      ]);

      db.query(sqlItems, [values], (err2) => {
        if (err2) return res.status(500).json({ message: 'Error adding medicines' });
        res.json({ message: 'Prescription created successfully', prescriptionID });
      });
    }
  );
});

module.exports = router;
