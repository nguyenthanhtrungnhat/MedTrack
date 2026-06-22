const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require("../middleware/verifyToken");

// GET /beds
router.get('/', verifyToken, (req, res) => {
  const sql = `
    SELECT b.*, r.location, d.departmentName 
    FROM bed b
    JOIN room r ON b.roomID = r.roomID
    LEFT JOIN department d ON r.departmentID = d.departmentID
    ORDER BY r.departmentID, r.location, b.bedNumber
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "DB Error", details: err });
    res.json(results);
  });
});

// POST /beds
router.post('/', verifyToken, (req, res) => {
  const { roomID, bedNumber, status } = req.body;
  const sql = `INSERT INTO bed (roomID, bedNumber, status) VALUES (?, ?, ?)`;
  db.query(sql, [roomID, bedNumber, status || 'Empty'], (err, result) => {
    if (err) return res.status(500).json({ error: "DB Error", details: err });
    res.json({ message: "Bed created successfully", bedID: result.insertId });
  });
});

// PUT /beds/:id
router.put('/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const { roomID, bedNumber, status } = req.body;
  const sql = `UPDATE bed SET roomID = ?, bedNumber = ?, status = ? WHERE bedID = ?`;
  db.query(sql, [roomID, bedNumber, status, id], (err) => {
    if (err) return res.status(500).json({ error: "DB Error", details: err });
    res.json({ message: "Bed updated successfully" });
  });
});

// DELETE /beds/:id
router.delete('/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM bed WHERE bedID = ?`;
  db.query(sql, [id], (err) => {
    if (err) {
      if (err.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(400).json({ error: "Cannot delete bed because it is assigned to a patient or referenced elsewhere." });
      }
      return res.status(500).json({ error: "DB Error", details: err });
    }
    res.json({ message: "Bed deleted successfully" });
  });
});

module.exports = router;
