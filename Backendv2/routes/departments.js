const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require("../middleware/verifyToken");

// ======================================================
// GET ALL DEPARTMENTS
// ======================================================
router.get("/", verifyToken, (req, res) => {
    const sql = "SELECT * FROM department ORDER BY departmentID DESC";

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }
        res.json(results);
    });
});


// ======================================================
// GET DEPARTMENT BY ID
// ======================================================
router.get("/:id", verifyToken, (req, res) => {
    const sql = "SELECT * FROM department WHERE departmentID = ?";

    db.query(sql, [req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Department not found" });
        }

        res.json(results[0]);
    });
});

module.exports = router;