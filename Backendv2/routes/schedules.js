const express = require("express");
const router = express.Router();

const db = require("../config/db");
const verifyToken = require("../middleware/verifyToken");


// =================================================
// GET ALL SCHEDULES
// =================================================
router.get("/", verifyToken, (req, res) => {
  const sql = `
    SELECT
      s.scheduleID,
      s.name,
      s.date,
      s.start_at,
      s.working_hours,
      s.color,
      s.nurseID,
      s.roomID,

      u.fullName,

      r.location

    FROM schedules s

    JOIN nurse n
      ON s.nurseID = n.nurseID

    JOIN user u
      ON n.userID = u.userID

    LEFT JOIN room r
      ON s.roomID = r.roomID

    ORDER BY s.date, s.start_at
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }

    res.json(rows);
  });
});


// =================================================
// GET ALL NURSES
// =================================================
router.get("/nurses", verifyToken, (req, res) => {
  const sql = `
    SELECT
      n.nurseID,
      u.fullName

    FROM nurse n

    JOIN user u
      ON n.userID = u.userID

    ORDER BY u.fullName
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }

    res.json(rows);
  });
});


// =================================================
// GET SCHEDULES OF ONE NURSE
// =================================================
router.get("/nurse/:nurseID", verifyToken, (req, res) => {
  const nurseID = req.params.nurseID;

  const sql = `
    SELECT
      s.scheduleID,
      s.name,
      s.date,
      s.start_at,
      s.working_hours,
      s.color,
      s.roomID,

      r.location

    FROM schedules s

    LEFT JOIN room r
      ON s.roomID = r.roomID

    WHERE s.nurseID = ?

    ORDER BY s.date, s.start_at
  `;

  db.query(sql, [nurseID], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }

    res.json(rows);
  });
});


// =================================================
// CREATE SCHEDULE
// =================================================
router.post("/", verifyToken, (req, res) => {
  const {
    name,
    date,
    start_at,
    working_hours,
    nurseID,
    roomID,
    color
  } = req.body;

  if (
    !name ||
    !date ||
    !start_at ||
    !working_hours ||
    !nurseID ||
    !roomID
  ) {
    return res.status(400).json({
      message: "Missing required fields",
    });
  }

  const sql = `
    INSERT INTO schedules
    (
      name,
      date,
      start_at,
      working_hours,
      nurseID,
      roomID,
      color
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      name,
      date,
      start_at,
      working_hours,
      nurseID,
      roomID,
      color || "#3174ad",
    ],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json(err);
      }

      res.status(201).json({
        success: true,
        scheduleID: result.insertId,
      });
    }
  );
});


// =================================================
// UPDATE SCHEDULE
// =================================================
router.put("/:id", verifyToken, (req, res) => {
  const scheduleID = req.params.id;

  const {
    name,
    date,
    start_at,
    working_hours,
    nurseID,
    roomID,
    color
  } = req.body;

  const sql = `
    UPDATE schedules
    SET
      name = ?,
      date = ?,
      start_at = ?,
      working_hours = ?,
      nurseID = ?,
      roomID = ?,
      color = ?
    WHERE scheduleID = ?
  `;

  db.query(
    sql,
    [
      name,
      date,
      start_at,
      working_hours,
      nurseID,
      roomID,
      color,
      scheduleID
    ],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json(err);
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Schedule not found",
        });
      }

      res.json({
        success: true,
        message: "Schedule updated",
      });
    }
  );
});


// =================================================
// DELETE SCHEDULE
// =================================================
router.delete("/:id", verifyToken, (req, res) => {
  const scheduleID = req.params.id;

  db.query(
    `
    DELETE FROM schedules
    WHERE scheduleID = ?
    `,
    [scheduleID],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json(err);
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Schedule not found",
        });
      }

      res.json({
        success: true,
        message: "Schedule deleted",
      });
    }
  );
});

module.exports = router;