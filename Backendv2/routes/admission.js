const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require("../middleware/verifyToken");

// GET /admission/pending  — Get all pending admission orders for Nurse
router.get('/pending', verifyToken, (req, res) => {
  const sql = `
    SELECT a.*, p.image, u.fullName, u.dob, u.phone, d.fullName as doctorName, dp.departmentName
    FROM admission a
    JOIN patient p ON a.patientID = p.patientID
    JOIN user u ON p.userID = u.userID
    JOIN doctor doc ON a.doctorID = doc.doctorID
    JOIN user d ON doc.userID = d.userID
    JOIN department dp ON a.departmentID = dp.departmentID
    WHERE a.status = 'Pending Payment'
    ORDER BY a.admissionDate DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'DB Error', details: err });
    res.json(results);
  });
});

// GET /admission/paid  — Get all paid admission orders (waiting for bed assignment)
router.get('/paid', verifyToken, (req, res) => {
  const sql = `
    SELECT a.*, p.image, u.fullName, u.dob, u.phone, d.fullName as doctorName, dp.departmentName
    FROM admission a
    JOIN patient p ON a.patientID = p.patientID
    JOIN user u ON p.userID = u.userID
    JOIN doctor doc ON a.doctorID = doc.doctorID
    JOIN user d ON doc.userID = d.userID
    JOIN department dp ON a.departmentID = dp.departmentID
    WHERE a.status = 'Paid' AND a.advanceFeeStatus = 'Paid'
    ORDER BY a.admissionDate ASC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'DB Error', details: err });
    res.json(results);
  });
});

// POST /admission  — Doctor creates Admission Order
router.post('/', verifyToken, (req, res) => {
  const { patientID, departmentID, priority, advanceFee, hospitalizationsDiagnosis, summaryCondition, expectedDate, examID } = req.body;
  const userID = req.user.userID;

  if (!patientID || !departmentID || !advanceFee) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Find doctorID from userID
  db.query(`SELECT doctorID FROM doctor WHERE userID = ?`, [userID], (errDoc, docRes) => {
    if (errDoc || docRes.length === 0) return res.status(403).json({ message: 'User is not a valid doctor' });

    const doctorID = docRes[0].doctorID;

    // Generate a random Admission Code
    const code = `BA-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

    const sql = `
      INSERT INTO admission 
      (patientID, doctorID, departmentID, admissionRecordCode, priority, advanceFee, advanceFeeStatus, admissionDate, hospitalizationsDiagnosis, summaryCondition, status) 
      VALUES (?, ?, ?, ?, ?, ?, 'Unpaid', ?, ?, ?, 'Pending Payment')
    `;

    db.query(sql, [patientID, doctorID, departmentID, code, priority || 'Normal', advanceFee, expectedDate || new Date(), hospitalizationsDiagnosis, summaryCondition], (err, result) => {
      if (err) return res.status(500).json({ message: 'DB Error: ' + err.message, details: err });

      const newAdmissionID = result.insertId;

      // If examID provided, link it to the admission
      if (examID) {
        db.query(`UPDATE clinical_examinations SET admissionID = ? WHERE examID = ?`, [newAdmissionID, examID], (errExam) => {
          if (errExam) console.error("Failed to link exam to admission:", errExam);
        });
      }

      res.status(201).json({ message: 'Admission Order Created', admissionID: newAdmissionID });
    });
  });
});

// PUT /admission/:id/advance-payment  — Nurse processes payment AND auto-assigns bed
router.put('/:id/advance-payment', verifyToken, (req, res) => {
  const admissionID = req.params.id;

  db.beginTransaction(err => {
    if (err) return res.status(500).json({ error: 'Transaction error', details: err });

    // 1. Check admission and get departmentID & patientID
    db.query(`SELECT departmentID, patientID, status FROM admission WHERE admissionID = ?`, [admissionID], (err1, results) => {
      if (err1 || results.length === 0) return db.rollback(() => res.status(404).json({ message: 'Admission not found' }));

      const adm = results[0];
      if (adm.status !== 'Pending Payment') return db.rollback(() => res.status(400).json({ message: 'Admission is already paid or in different state' }));

      // 2. Find an empty bed in the same department
      const bedQuery = `
        SELECT b.bedID, b.bedNumber, r.location as roomName 
        FROM bed b 
        JOIN room r ON b.roomID = r.roomID 
        WHERE r.departmentID = ? AND b.status = 'Empty' 
        ORDER BY r.roomID ASC, b.bedID ASC LIMIT 1
      `;
      db.query(bedQuery, [adm.departmentID], (err2, bedResults) => {
        if (err2) return db.rollback(() => res.status(500).json({ message: 'Error finding bed', details: err2 }));

        if (bedResults.length === 0) {
          // If no bed, we can't complete the flow.
          return db.rollback(() => res.status(400).json({ message: 'No empty beds available in this department. Cannot admit patient.' }));
        }

        const bed = bedResults[0];

        // 3. Update Bed
        db.query(`UPDATE bed SET status = 'In Use', patientID = ? WHERE bedID = ?`, [adm.patientID, bed.bedID], (err3) => {
          if (err3) return db.rollback(() => res.status(500).json({ message: 'Error updating bed', details: err3 }));

          // 4. Update Admission status to In-treatment
          db.query(`UPDATE admission SET advanceFeeStatus = 'Paid', status = 'In-treatment' WHERE admissionID = ?`, [admissionID], (err4) => {
            if (err4) return db.rollback(() => res.status(500).json({ message: 'Error updating admission', details: err4 }));

            db.commit(err5 => {
              if (err5) return db.rollback(() => res.status(500).json({ message: 'Commit failed', details: err5 }));
              res.json({ message: `Payment successful. Patient automatically assigned to ${bed.roomName} - Bed ${bed.bedNumber}.` });
            });
          });
        });
      });
    });
  });
});

// ================= DISCHARGE APIs =================

// PUT /admission/:id/discharge-order — Doctor creates discharge order
router.put('/:id/discharge-order', verifyToken, (req, res) => {
  const admissionID = req.params.id;
  const { diagnosisType, diagnosisText, summary } = req.body;
  const userID = req.user.userID;

  if (!diagnosisType || !diagnosisText) {
    return res.status(400).json({
      message: 'Missing discharge details'
    });
  }

  // Get doctorID from logged-in user
  db.query(
    `SELECT doctorID FROM doctor WHERE userID = ?`,
    [userID],
    (errDoc, docRes) => {

      if (errDoc) {
        return res.status(500).json({
          message: 'Database error',
          details: errDoc.message
        });
      }

      if (docRes.length === 0) {
        return res.status(403).json({
          message: 'Not a doctor'
        });
      }

      const doctorID = docRes[0].doctorID;

      // Create discharge WITHOUT icdCode first
      const insertDischarge = `
        INSERT INTO discharge
        (
          admissionID,
          doctorID,
          diagnosisType,
          diagnosisText,
          summary
        )
        VALUES (?, ?, ?, ?, ?)
      `;

      db.query(
        insertDischarge,
        [
          admissionID,
          doctorID,
          diagnosisType,
          diagnosisText,
          summary || null
        ],
        (errIns, insRes) => {

          if (errIns) {
            return res.status(500).json({
              message: 'Error inserting discharge',
              details: errIns.message
            });
          }

          const dischargeID = insRes.insertId;

          // Auto-generate unique ICD code
          const icdCode = `ICD-${String(dischargeID).padStart(6, '0')}`;

          // Save ICD code
          db.query(
            `UPDATE discharge SET icdCode = ? WHERE dischargeID = ?`,
            [icdCode, dischargeID],
            (errIcd) => {

              if (errIcd) {
                return res.status(500).json({
                  message: 'Failed to generate ICD code',
                  details: errIcd.message
                });
              }

              // Update admission status
              const updateAdmission = `
                UPDATE admission
                SET dischargeID = ?,
                    status = 'Pending Discharge Payment'
                WHERE admissionID = ?
                  AND status = 'In-treatment'
              `;

              db.query(
                updateAdmission,
                [dischargeID, admissionID],
                (errUpdate, result) => {

                  if (errUpdate) {
                    return res.status(500).json({
                      message: 'DB Error',
                      details: errUpdate.message
                    });
                  }

                  if (result.affectedRows === 0) {
                    return res.status(400).json({
                      message: 'Invalid admission status or admission not found'
                    });
                  }

                  res.json({
                    success: true,
                    message: 'Discharge Order Created',
                    dischargeID,
                    icdCode
                  });
                }
              );
            }
          );
        }
      );
    }
  );
});

// GET /admission/pending-discharge — Nurse views patients waiting to be discharged
router.get('/pending-discharge', verifyToken, (req, res) => {
  const sql = `
    SELECT a.*, p.image, u.fullName, u.dob, u.phone, d.fullName as doctorName, dp.departmentName, b.roomID, b.bedNumber, r.location as roomName
    FROM admission a
    JOIN patient p ON a.patientID = p.patientID
    JOIN user u ON p.userID = u.userID
    JOIN doctor doc ON a.doctorID = doc.doctorID
    JOIN user d ON doc.userID = d.userID
    JOIN department dp ON a.departmentID = dp.departmentID
    LEFT JOIN bed b ON p.patientID = b.patientID
    LEFT JOIN room r ON b.roomID = r.roomID
    WHERE a.status = 'Pending Discharge Payment'
    ORDER BY a.admissionDate ASC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'DB Error', details: err.message });
    res.json(results);
  });
});

// PUT /admission/:id/discharge-payment — Nurse processes discharge
router.put('/:id/discharge-payment', verifyToken, (req, res) => {
  const admissionID = req.params.id;

  db.beginTransaction(err => {
    if (err) return res.status(500).json({ error: 'Transaction error', details: err.message });

    db.query(`SELECT patientID FROM admission WHERE admissionID = ? AND status = 'Pending Discharge Payment'`, [admissionID], (err1, results) => {
      if (err1 || results.length === 0) return db.rollback(() => res.status(404).json({ message: 'Admission not found or invalid status' }));

      const patientID = results[0].patientID;

      // 1. Update Admission
      const updateAdm = `UPDATE admission SET status = 'Discharged' WHERE admissionID = ?`;
      db.query(updateAdm, [admissionID], (err2) => {
        if (err2) return db.rollback(() => res.status(500).json({ error: 'Update admission failed', details: err2.message }));

        // 2. Clear Bed and set to Cleaning
        const updateBed = `UPDATE bed SET status = 'Cleaning', patientID = NULL WHERE patientID = ?`;
        db.query(updateBed, [patientID], (err3, bedResult) => {
          if (err3) return db.rollback(() => res.status(500).json({ error: 'Update bed failed', details: err3.message }));

          db.commit(err4 => {
            if (err4) return db.rollback(() => res.status(500).json({ error: 'Commit failed', details: err4.message }));

            res.json({ message: 'Discharge successful. Bed is now Cleaning.' });

            // 3. Set a timeout to switch Bed from 'Cleaning' to 'Empty' after 10 minutes
            // Only if a bed was actually updated
            if (bedResult.affectedRows > 0) {
              setTimeout(() => {
                const cleanupSql = `UPDATE bed SET status = 'Empty' WHERE status = 'Cleaning' AND patientID IS NULL`;
                db.query(cleanupSql, (cleanupErr) => {
                  if (cleanupErr) console.error("Error auto-cleaning bed:", cleanupErr.message);
                  else console.log("Beds automatically set to Empty after 10 minutes.");
                });
              }, 10 * 60 * 1000); // 10 minutes
            }
          });
        });
      });
    });
  });
});

module.exports = router;
