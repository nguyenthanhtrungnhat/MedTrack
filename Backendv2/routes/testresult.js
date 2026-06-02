const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { getAllRecords } = require('../utils/dbHelpers');
const verifyToken = require("../middleware/verifyToken");

// GET /tesresult
router.get('/',verifyToken, (req, res) => {
    const userID = req.params.userID;
    const query = `
    SELECT 
    tr.*,
    u.* 
    FROM testresult tr
    JOIN user u ON tr.userID = u.userID;
  `;
    db.query(query, [userID], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

router.get("/:id", verifyToken, (req, res) => {
  const sql = `
    SELECT
      t.*,
      u.username
    FROM testresult t
    JOIN user u
      ON t.userID = u.userID
    WHERE t.testResultID = ?
  `;

  db.query(
    sql,
    [req.params.id],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      if (result.length === 0) {
        return res.status(404).json({
          message: "Not found",
        });
      }

      res.json(result[0]);
    }
  );
});
module.exports = router;