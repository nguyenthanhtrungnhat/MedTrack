const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require("../middleware/verifyToken");

// GET /testitems
router.get('/', verifyToken, (req, res) => {
  const sql = `
    SELECT i.*, t.typeName 
    FROM testtype_item i
    JOIN testtype t ON i.testTypeID = t.testTypeID
    ORDER BY t.typeName, i.parameterName
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "DB Error", details: err });
    res.json(results);
  });
});

// POST /testitems
router.post('/', verifyToken, (req, res) => {
  const { testTypeID, parameterName, unit, referenceRange } = req.body;
  const sql = `INSERT INTO testtype_item (testTypeID, parameterName, unit, referenceRange) VALUES (?, ?, ?, ?)`;
  db.query(sql, [testTypeID, parameterName, unit, referenceRange], (err, result) => {
    if (err) return res.status(500).json({ error: "DB Error", details: err });
    res.json({ message: "Test item created successfully", testTypeItemID: result.insertId });
  });
});

// PUT /testitems/:id
router.put('/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const { testTypeID, parameterName, unit, referenceRange } = req.body;
  const sql = `UPDATE testtype_item SET testTypeID = ?, parameterName = ?, unit = ?, referenceRange = ? WHERE testTypeItemID = ?`;
  db.query(sql, [testTypeID, parameterName, unit, referenceRange, id], (err) => {
    if (err) return res.status(500).json({ error: "DB Error", details: err });
    res.json({ message: "Test item updated successfully" });
  });
});

// DELETE /testitems/:id
router.delete('/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM testtype_item WHERE testTypeItemID = ?`;
  db.query(sql, [id], (err) => {
    if (err) {
      if (err.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(400).json({ error: "Cannot delete test item because it is referenced in test results." });
      }
      return res.status(500).json({ error: "DB Error", details: err });
    }
    res.json({ message: "Test item deleted successfully" });
  });
});

module.exports = router;
