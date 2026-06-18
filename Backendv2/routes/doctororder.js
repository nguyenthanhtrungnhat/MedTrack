const express = require("express");
const router = express.Router();
const db = require("../config/db");
const verifyToken = require("../middleware/verifyToken");

// ======================================================
// GET ACTIVE ADMISSION BY PATIENT
// ======================================================
router.get(
    "/active-admission/:patientID",
    verifyToken,
    (req, res) => {

        const sql = `
            SELECT *
            FROM admission
            WHERE patientID = ?
              AND status IN ('Init','In-treatment')
            ORDER BY admissionDate DESC
            LIMIT 1
        `;

        db.query(
            sql,
            [req.params.patientID],
            (err, rows) => {

                if (err)
                    return res.status(500).json(err);

                if (!rows.length)
                    return res.status(404).json({
                        message: "No active admission found"
                    });

                res.json(rows[0]);
            }
        );
    }
);

// ======================================================
// GET PENDING ORDERS
// ======================================================
router.get("/pending", verifyToken, (req, res) => {

    const sql = `
        SELECT
            o.orderID,
            o.userID,
            o.doctorID,
            o.admissionID,
            o.testTypeID,
            o.diagnosisNote,
            o.status,
            o.orderDate,

            a.admissionRecordCode,
            a.priority,

            p.fullName AS patientName,
            p.CIC,

            d.fullName AS doctorName,

            tt.typeName

        FROM doctororder o

        JOIN admission a
            ON o.admissionID = a.admissionID

        JOIN user p
            ON o.userID = p.userID

        JOIN doctor doc
            ON o.doctorID = doc.doctorID

        JOIN user d
            ON doc.userID = d.userID

        JOIN testtype tt
            ON o.testTypeID = tt.testTypeID

        WHERE o.status = 'Pending'

        ORDER BY o.orderDate DESC
    `;

    db.query(sql, (err, result) => {

        if (err)
            return res.status(500).json(err);

        res.json(result);
    });

});

// ======================================================
// FIND PATIENT BY CIC
// ======================================================
router.get("/cic/:cic", verifyToken, (req, res) => {

    const sql = `
        SELECT
            p.patientID,
            p.userID,
            u.fullName,
            u.CIC
        FROM patient p
        JOIN user u
            ON p.userID = u.userID
        WHERE u.CIC = ?
    `;

    db.query(
        sql,
        [req.params.cic],
        (err, rows) => {

            if (err)
                return res.status(500).json(err);

            if (rows.length === 0)
                return res.status(404).json({
                    message: "Patient not found"
                });

            res.json(rows[0]);
        }
    );
});

// ======================================================
// GET ALL ORDERS
// ======================================================
router.get("/", verifyToken, (req, res) => {

    const sql = `
        SELECT
            o.*,

            a.admissionRecordCode,
            a.priority,
            a.status AS admissionStatus,

            p.fullName AS patientName,
            p.CIC,

            d.fullName AS doctorName,

            tt.typeName

        FROM doctororder o

        JOIN admission a
            ON o.admissionID = a.admissionID

        JOIN user p
            ON o.userID = p.userID

        JOIN doctor doc
            ON o.doctorID = doc.doctorID

        JOIN user d
            ON doc.userID = d.userID

        JOIN testtype tt
            ON o.testTypeID = tt.testTypeID

        ORDER BY o.orderDate DESC
    `;

    db.query(sql, (err, rows) => {

        if (err)
            return res.status(500).json(err);

        res.json(rows);

    });

});

// ======================================================
// GET ORDERS BY DOCTOR
// ======================================================
router.get("/doctor/:doctorID", verifyToken, (req, res) => {

    const doctorID = req.params.doctorID;

    const sql = `
        SELECT
            o.*,

            a.admissionRecordCode,
            a.priority,

            p.fullName AS patientName,
            p.CIC,

            tt.typeName

        FROM doctororder o

        JOIN admission a
            ON o.admissionID = a.admissionID

        JOIN user p
            ON o.userID = p.userID

        JOIN testtype tt
            ON o.testTypeID = tt.testTypeID

        WHERE o.doctorID = ?

        ORDER BY o.orderDate DESC
    `;

    db.query(sql, [doctorID], (err, rows) => {

        if (err)
            return res.status(500).json(err);

        res.json(rows);

    });

});

// ======================================================
// GET ORDERS BY PATIENT
// ======================================================
router.get("/patient/:userID", verifyToken, (req, res) => {

    const userID = req.params.userID;

    const sql = `
        SELECT
            o.*,

            a.admissionRecordCode,
            a.priority,

            d.fullName AS doctorName,

            tt.typeName

        FROM doctororder o

        JOIN admission a
            ON o.admissionID = a.admissionID

        JOIN doctor doc
            ON o.doctorID = doc.doctorID

        JOIN user d
            ON doc.userID = d.userID

        JOIN testtype tt
            ON o.testTypeID = tt.testTypeID

        WHERE o.userID = ?

        ORDER BY o.orderDate DESC
    `;

    db.query(sql, [userID], (err, rows) => {

        if (err)
            return res.status(500).json(err);

        res.json(rows);

    });

});

// ======================================================
// CREATE ORDER
// ======================================================
router.post("/", verifyToken, (req, res) => {

    const {
        userID,
        doctorID,
        admissionID,
        testTypeID,
        diagnosisNote
    } = req.body;

    if (!admissionID) {
        return res.status(400).json({
            message: "Admission is required"
        });
    }

    const sql = `
        INSERT INTO doctororder
        (
            userID,
            doctorID,
            admissionID,
            testTypeID,
            diagnosisNote,
            status,
            orderDate
        )
        VALUES
        (
            ?,
            ?,
            ?,
            ?,
            ?,
            'Pending',
            NOW()
        )
    `;

    db.query(
        sql,
        [
            userID,
            doctorID,
            admissionID,
            testTypeID,
            diagnosisNote
        ],
        (err, result) => {

            if (err)
                return res.status(500).json(err);

            res.status(201).json({
                message: "Doctor order created",
                orderID: result.insertId
            });

        }
    );

});

// ======================================================
// UPDATE STATUS
// ======================================================
router.put("/:id/status", verifyToken, (req, res) => {

    const { status } = req.body;

    db.query(
        "UPDATE doctororder SET status=? WHERE orderID=?",
        [status, req.params.id],
        (err) => {

            if (err)
                return res.status(500).json(err);

            res.json({
                message: "Status updated"
            });

        }
    );

});

// ======================================================
// DELETE ORDER
// ======================================================
router.delete("/:id", verifyToken, (req, res) => {

    db.query(
        "DELETE FROM doctororder WHERE orderID=?",
        [req.params.id],
        (err) => {

            if (err)
                return res.status(500).json(err);

            res.json({
                message: "Deleted"
            });

        }
    );

});

module.exports = router;