const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { getAllRecords } = require('../utils/dbHelpers');
const verifyToken = require("../middleware/verifyToken");

// GET /tesresult
router.get("/", verifyToken, (req, res) => {

  const sql = `
    SELECT
      tr.testResultID,
      tr.userID,
      u.username,

      tr.title,
      tr.datetime,
      tr.testResultCode,
      tr.status,

      tt.testTypeID,
      tt.typeName

    FROM testresult tr
    JOIN user u
      ON tr.userID = u.userID
    JOIN testtype tt
      ON tr.testTypeID = tt.testTypeID

    ORDER BY tr.datetime DESC
  `;

  db.query(sql, (err, result) => {

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
      u.username,
      tt.typeName
    FROM testresult tr
    JOIN user u
      ON tr.userID = u.userID
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