const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { getAllRecords } = require('../utils/dbHelpers');
const verifyToken = require("../middleware/verifyToken");

// GET /news
router.get('/', (req, res) => getAllRecords('news', res));
module.exports = router;