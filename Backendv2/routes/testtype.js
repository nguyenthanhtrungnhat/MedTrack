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

module.exports = router;