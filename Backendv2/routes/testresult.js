const express = require("express");
const router = express.Router();
const db = require("../config/db");
const verifyToken = require("../middleware/verifyToken");


// ======================================================
// GET ALL TEST RESULTS BY DOCTOR
// ======================================================
router.get("/", verifyToken, (req, res) => {

    const doctorID = req.query.doctorID;

    let sql = `
        SELECT
            tr.testResultID,
            tr.orderID,
            tr.title,
            tr.datetime,
            tr.testResultCode,
            tr.remarks,

            o.userID,
            o.doctorID,
            o.status,

            p.fullName AS patientName,
            p.CIC AS patientCIC,

            d.fullName AS doctorName,

            tt.testTypeID,
            tt.typeName

        FROM testresult tr
        JOIN doctororder o ON tr.orderID = o.orderID
        JOIN user p ON o.userID = p.userID
        JOIN doctor doc ON o.doctorID = doc.doctorID
        JOIN user d ON doc.userID = d.userID
        JOIN testtype tt ON o.testTypeID = tt.testTypeID
    `;

    const params = [];
    if (doctorID && doctorID !== 'null' && doctorID !== 'undefined') {
        sql += ` WHERE o.doctorID = ? `;
        params.push(doctorID);
    }

    sql += ` ORDER BY tr.datetime DESC `;

    db.query(sql, params, (err, rows) => {
        if (err) return res.status(500).json(err);
        res.json(rows);
    });
});


// ======================================================
// GET TEST RESULT DETAIL
// ======================================================
router.get("/:id", verifyToken, (req, res) => {

    const id = req.params.id;

    const sql = `
        SELECT
            tr.*,
            o.userID,
            o.doctorID,
            o.testTypeID,
            o.diagnosisNote,

            p.fullName AS patientName,
            p.CIC AS patientCIC,

            d.fullName AS doctorName,
            tt.typeName

        FROM testresult tr
        JOIN doctororder o ON tr.orderID = o.orderID
        JOIN user p ON o.userID = p.userID
        JOIN doctor doc ON o.doctorID = doc.doctorID
        JOIN user d ON doc.userID = d.userID
        JOIN testtype tt ON o.testTypeID = tt.testTypeID

        WHERE tr.testResultID = ?
    `;

    db.query(sql, [id], (err, headerRows) => {

        if (err) return res.status(500).json(err);

        if (headerRows.length === 0)
            return res.status(404).json({ message: "Test result not found" });

        const detailSql = `
            SELECT
                tri.itemID,
                tri.testResultID,
                tri.testTypeItemID,
                tri.resultValue,
                tri.unit,
                tri.referenceRange,
                tri.abnormalFlag,
                ti.parameterName

            FROM testresult_item tri
            JOIN testtype_item ti
                ON tri.testTypeItemID = ti.testTypeItemID

            WHERE tri.testResultID = ?
            ORDER BY tri.itemID
        `;

        db.query(detailSql, [id], (err2, detailRows) => {

            if (err2) return res.status(500).json(err2);

            res.json({
                ...headerRows[0],
                items: detailRows
            });
        });
    });
});


// ======================================================
// CREATE TEST RESULT
// ======================================================
router.post("/", verifyToken, (req, res) => {

    const { orderID, title, remarks, items } = req.body;

    // 1. CHECK IF ORDER ALREADY COMPLETED
    const checkSql = `
        SELECT status
        FROM doctororder
        WHERE orderID = ?
    `;

    db.query(checkSql, [orderID], (err, rows) => {

        if (err) return res.status(500).json(err);

        if (rows.length === 0)
            return res.status(404).json({ message: "Order not found" });

        // ❌ BLOCK IF COMPLETED
        if (rows[0].status === "Completed") {
            return res.status(400).json({
                message: "This order already has a test result"
            });
        }

        // 2. CONTINUE CREATE TEST RESULT
        const datetime = new Date()
            .toISOString()
            .slice(0, 19)
            .replace("T", " ");

        const testResultCode = "TR-" + Date.now();

        const insertSql = `
            INSERT INTO testresult
            (orderID, title, datetime, testResultCode, remarks)
            VALUES (?, ?, ?, ?, ?)
        `;

        db.query(insertSql,
            [orderID, title, datetime, testResultCode, remarks],
            (err2, result) => {

                if (err2) return res.status(500).json(err2);

                const testResultID = result.insertId;

                const values = items.map(i => [
                    testResultID,
                    i.testTypeItemID,
                    i.resultValue || "",
                    i.unit || "",
                    i.referenceRange || "",
                    i.abnormalFlag || "Normal"
                ]);

                db.query(
                    `INSERT INTO testresult_item
                    (testResultID, testTypeItemID, resultValue, unit, referenceRange, abnormalFlag)
                    VALUES ?`,
                    [values],
                    (err3) => {

                        if (err3) return res.status(500).json(err3);

                        // 3. MARK ORDER AS COMPLETED
                        db.query(
                            `UPDATE doctororder SET status = 'Completed' WHERE orderID = ?`,
                            [orderID]
                        );

                        res.json({
                            success: true,
                            testResultID
                        });
                    }
                );
            }
        );
    });
});

module.exports = router;