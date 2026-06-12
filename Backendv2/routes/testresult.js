const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { getAllRecords } = require('../utils/dbHelpers');
const verifyToken = require("../middleware/verifyToken");

// GET /tesresult by doctorID
router.get("/", verifyToken, (req, res) => {

  const doctorID = req.query.doctorID;

  const sql = `
    SELECT
      tr.testResultID,
      tr.userID,
      p.fullName AS patientName,
      p.CIC AS patientCIC,

      tr.doctorID,
      d.fullName AS doctorName,

      tr.title,
      tr.datetime,
      tr.testResultCode,

      tt.testTypeID,
      tt.typeName

    FROM testresult tr

    JOIN user p
      ON tr.userID = p.userID

    JOIN doctor doc
      ON tr.doctorID = doc.doctorID

    JOIN user d
      ON doc.userID = d.userID

    JOIN testtype tt
      ON tr.testTypeID = tt.testTypeID

    WHERE tr.doctorID = ?

    ORDER BY tr.datetime DESC
  `;

  db.query(sql, [doctorID], (err, result) => {

    if (err)
      return res.status(500).json(err);

    res.json(result);

  });

});

router.get("/:id", verifyToken, (req, res) => {

  const id = req.params.id;

  const headerSql = `
SELECT
  tr.*,

  p.fullName AS patientName,
  p.CIC AS patientCIC,

  d.fullName AS doctorName,

  tt.typeName

FROM testresult tr

JOIN user p
  ON tr.userID = p.userID

JOIN doctor doc
  ON tr.doctorID = doc.doctorID

JOIN user d
  ON doc.userID = d.userID

JOIN testtype tt
  ON tr.testTypeID = tt.testTypeID

WHERE tr.testResultID = ?
`;

  db.query(headerSql, [id], (err, headerRows) => {

    if (err)
      return res.status(500).json(err);

    if (headerRows.length === 0)
      return res.status(404).json({
        message: "Not found"
      });

    const detailSql = `
      SELECT *
      FROM testresult_item
      WHERE testResultID = ?
      ORDER BY itemID
    `;

    db.query(detailSql, [id], (err2, detailRows) => {

      if (err2)
        return res.status(500).json(err2);

      const result = {
        ...headerRows[0],
        items: detailRows
      };

      res.json(result);

    });

  });

});
module.exports = router;