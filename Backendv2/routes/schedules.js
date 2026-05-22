const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require("../middleware/verifyToken");

// GET /api/schedules/:nurseID
router.get('/:nurseID',verifyToken, (req, res) => {
  const nurseID = req.params.nurseID;
  const query = `
    SELECT 
      s.scheduleID,
      s.name AS subject,
      s.date,
      s.start_at,
      s.working_hours,
      s.color,
      r.roomID,
      r.location AS room_location
    FROM schedules s
    JOIN room r ON s.roomID = r.roomID
    WHERE s.nurseID = ?
    ORDER BY s.date, s.start_at
  `;
  db.query(query, [nurseID], (err, results) => {
    if (err) return res.status(500).json({ error: 'Internal Server Error' });
    res.json(results);
  });
});

// POST /api/schedules
router.post('/',verifyToken, (req, res) => {
  const { scheduleID, subject, date, start_at, working_hours, color, roomID, room_location } = req.body;

  if (!subject || !date || !start_at || !working_hours || !roomID)
    return res.status(400).json({ message: 'Missing required fields' });

  const sql = `
    INSERT INTO schedules (scheduleID, name, date, start_at, working_hours, color, roomID, room_location)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, [scheduleID, subject, date, start_at, working_hours, color, roomID, room_location], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    res.status(201).json({
      message: 'Schedule added successfully',
      scheduleID: result.insertId || scheduleID,
      data: { scheduleID, subject, date, start_at, working_hours, color, roomID, room_location },
    });
  });
});

// PUT /api/schedules/:id
router.put('/:id',verifyToken, async (req, res) => {
  try {
    const scheduleID = req.params.id;
    const { subject, date, start_at, working_hours, color, roomID, room_location } = req.body;

    const [rows] = await db.execute('SELECT * FROM schedules WHERE scheduleID = ?', [scheduleID]);
    if (rows.length === 0) return res.status(404).json({ message: 'Schedule not found' });

    const sql = `
      UPDATE schedules
      SET subject=?, date=?, start_at=?, working_hours=?, color=?, roomID=?, room_location=?
      WHERE scheduleID=?
    `;
    await db.execute(sql, [subject, date, start_at, working_hours, color, roomID, room_location, scheduleID]);
    res.json({ message: '✅ Schedule updated successfully', schedule: { scheduleID, ...req.body } });
  } catch (err) {
    console.error('Error updating schedule:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
