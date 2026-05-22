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


module.exports = router;