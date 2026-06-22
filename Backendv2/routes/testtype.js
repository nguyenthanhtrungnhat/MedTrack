const express = require("express");
const router = express.Router();
const db = require("../config/db");
const verifyToken = require("../middleware/verifyToken");

// GET ALL TEST TYPES
router.get("/", verifyToken, (req, res) => {
    const sql = `
        SELECT *
        FROM testtype
        ORDER BY typeName
    `;

    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

// GET ITEMS BY TEST TYPE (ONLY ONE ROUTE)
router.get("/:testTypeID/items", verifyToken, (req, res) => {
    const sql = `
        SELECT
            testTypeItemID,
            parameterName,
            unit,
            referenceRange
        FROM testtype_item
        WHERE testTypeID = ?
        ORDER BY testTypeItemID
    `;

    db.query(sql, [req.params.testTypeID], (err, rows) => {
        if (err) {
            return res.status(500).json({
                message: "Database error",
                error: err,
            });
        }

        res.json(rows);
    });
});

// POST /testtype (Admin create test type)
router.post('/', verifyToken, (req, res) => {
    const { typeName, description } = req.body;
    const sql = `INSERT INTO testtype (typeName, description) VALUES (?, ?)`;
    db.query(sql, [typeName, description], (err, result) => {
        if (err) return res.status(500).json({ error: "DB Error", details: err });
        res.json({ message: "Test type created successfully", testTypeID: result.insertId });
    });
});

// PUT /testtype/:id (Admin update test type)
router.put('/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    const { typeName, description } = req.body;
    const sql = `UPDATE testtype SET typeName = ?, description = ? WHERE testTypeID = ?`;
    db.query(sql, [typeName, description, id], (err) => {
        if (err) return res.status(500).json({ error: "DB Error", details: err });
        res.json({ message: "Test type updated successfully" });
    });
});

// DELETE /testtype/:id (Admin delete test type)
router.delete('/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM testtype WHERE testTypeID = ?`;
    db.query(sql, [id], (err) => {
        if (err) {
            if (err.code === 'ER_ROW_IS_REFERENCED_2') {
                return res.status(400).json({ error: "Cannot delete test type because it has test items or is referenced elsewhere." });
            }
            return res.status(500).json({ error: "DB Error", details: err });
        }
        res.json({ message: "Test type deleted successfully" });
    });
});

module.exports = router;