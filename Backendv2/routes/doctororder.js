const express = require("express");
const router = express.Router();
const db = require("../config/db");
const verifyToken = require("../middleware/verifyToken");
router.get("/pending", verifyToken, (req, res) => {

    const sql = `
        SELECT
            o.orderID,
            o.userID,
            o.doctorID,
            o.testTypeID,
            o.diagnosisNote,
            o.status,
            o.orderDate,

            p.fullName AS patientName,
            p.CIC,

            d.fullName AS doctorName,

            tt.typeName

        FROM doctororder o

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


//Get all orders
router.get("/", verifyToken, (req, res) => {

    const sql = `
        SELECT
            o.*,

            p.fullName AS patientName,
            p.CIC,

            d.fullName AS doctorName,

            tt.typeName

        FROM doctororder o

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

//Get orders by doctor
router.get("/doctor/:doctorID", verifyToken, (req, res) => {

    const doctorID = req.params.doctorID;

    const sql = `
        SELECT
            o.*,

            p.fullName AS patientName,
            p.CIC,

            tt.typeName

        FROM doctororder o

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

//Get orders by patient
router.get("/patient/:userID", verifyToken, (req, res) => {

    const userID = req.params.userID;

    const sql = `
        SELECT
            o.*,

            d.fullName AS doctorName,

            tt.typeName

        FROM doctororder o

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

//Create new doctor order
router.post("/", verifyToken, (req, res) => {

    const {
        userID,
        doctorID,
        testTypeID,
        diagnosisNote
    } = req.body;

    const sql = `
        INSERT INTO doctororder
        (
            userID,
            doctorID,
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
            'Pending',
            NOW()
        )
    `;

    db.query(
        sql,
        [
            userID,
            doctorID,
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

//Update status
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

//Delete order
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