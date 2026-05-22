const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require("../middleware/verifyToken");

// POST /request  — submit shift change request
router.post('/',verifyToken, (req, res) => {
  const { scheduleID, newDate, reason } = req.body;

  if (!scheduleID || !newDate || !reason)
    return res.status(400).send({ message: 'Missing required fields' });

  const sql = `INSERT INTO scheduleRequest (scheduleID, newDate, reason) VALUES (?, ?, ?)`;
  db.query(sql, [scheduleID, newDate, reason], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ message: 'Shift request submitted', requestID: result.insertId });
  });
});

// GET /status/:nurseID  — requests by nurse
router.get('/status/:nurseID',verifyToken, (req, res) => {
  const nurseID = req.params.nurseID;
  const sql = `
    SELECT sr.requestID, sr.newDate, sr.reason, sr.status,
           sc.date AS oldDate, sc.start_at, sc.working_hours
    FROM scheduleRequest sr
    JOIN schedules sc ON sr.scheduleID = sc.scheduleID
    WHERE sc.nurseID = ?
    ORDER BY sr.requestID DESC
  `;
  db.query(sql, [nurseID], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send(result);
  });
});

// GET /schedule-request/pending/count
router.get('/pending/count', verifyToken,(req, res) => {
  db.query('SELECT COUNT(*) AS count FROM scheduleRequest WHERE status = 0', (err, result) => {
    if (err) return res.status(500).json({ message: 'DB error', err });
    res.json({ count: result[0].count });
  });
});

// PUT /schedule-request/:id  — simple status update
router.put('/:id',verifyToken, (req, res) => {
  const requestID = req.params.id;
  const { status } = req.body;

  db.query('UPDATE scheduleRequest SET status = ? WHERE requestID = ?', [status, requestID], (err, result) => {
    if (err) return res.status(500).json({ message: 'DB error', err });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Request not found' });
    res.json({ message: 'Status updated successfully' });
  });
});

// PATCH /schedule-request/:id/status  — approve / reject with schedule update
router.patch('/:id/status',verifyToken, (req, res) => {
  const requestID = req.params.id;
  const { status } = req.body; // 1 = approve, 2 = reject

  if (![1, 2].includes(status))
    return res.status(400).json({ message: 'Invalid status. Must be 1 or 2.' });

  db.query('SELECT scheduleID, newDate, status FROM scheduleRequest WHERE requestID = ?', [requestID], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error', err });
    if (result.length === 0) return res.status(404).json({ message: 'Request not found' });

    const request = result[0];
    if (request.status !== 0)
      return res.status(400).json({ message: 'Request is not pending' });

    const { scheduleID, newDate } = request;

    db.query('UPDATE scheduleRequest SET status = ? WHERE requestID = ?', [status, requestID], (err2) => {
      if (err2) return res.status(500).json({ message: 'Failed to update request', err2 });

      if (status === 1) {
        if (!newDate) return res.status(400).json({ message: 'Request newDate is null' });

        db.query('UPDATE schedules SET date = ? WHERE scheduleID = ?', [newDate, scheduleID], (err3) => {
          if (err3) return res.status(500).json({ message: 'Failed to update schedule', err3 });
          res.json({ message: 'Request approved and schedule date updated' });
        });
      } else {
        res.json({ message: 'Request rejected successfully' });
      }
    });
  });
});

module.exports = router;
