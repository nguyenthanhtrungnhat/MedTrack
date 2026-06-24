const express = require("express");
const router = express.Router();

const db = require("../config/db");
const verifyToken = require("../middleware/verifyToken");

/* ================= GET ALL SHEETS ================= */
router.get("/all", verifyToken, (req, res) => {
  db.query(
    `
    SELECT 
        ts.sheetID,
        ts.admissionNumber,
        ts.patientCode,
        ts.diagnosis,
        ts.createdAt,
        u.fullName AS patientName,
        p.HI
    FROM treatment_sheet ts
    LEFT JOIN patient p ON ts.patientID = p.patientID
    LEFT JOIN user u ON p.userID = u.userID
    ORDER BY ts.createdAt DESC
    `,
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});
router.get("/all/:patientID", verifyToken, (req, res) => {
  const { patientID } = req.params;

  db.query(
    `
    SELECT 
        ts.sheetID,
        ts.admissionNumber,
        ts.patientCode,
        ts.diagnosis,
        ts.createdAt,
        u.fullName AS patientName,
        p.HI
    FROM treatment_sheet ts
    LEFT JOIN patient p ON ts.patientID = p.patientID
    LEFT JOIN user u ON p.userID = u.userID
    WHERE ts.patientID = ?
    ORDER BY ts.createdAt DESC
    `,
    [patientID],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json(rows);
    }
  );
});
/* ================= GET LOGS ================= */
router.get("/logs/:sheetID", verifyToken, (req, res) => {
  db.query(
    `
    SELECT 
        tl.*,
        du.fullName AS doctorName
    FROM treatment_logs tl
    LEFT JOIN doctor d ON tl.doctorID = d.doctorID
    LEFT JOIN user du ON d.userID = du.userID
    WHERE tl.sheetID = ?
    ORDER BY tl.logTime ASC
    `,
    [req.params.sheetID],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

/* ================= GET SINGLE SHEET ================= */
router.get("/:id", verifyToken, (req, res) => {
  const sql = `
    SELECT
        ts.sheetID,
        ts.admissionNumber,
        ts.patientCode,
        ts.diagnosis,
        ts.createdAt,

        p.patientID,
        p.HI,
        u.fullName AS patientName,

        tl.logID,
        tl.doctorID,
        du.fullName AS doctorName,
        tl.logTime,
        tl.subjective,
        tl.objective,
        tl.assessment,
        tl.plan,
        tl.instruction

    FROM treatment_sheet ts
    LEFT JOIN patient p ON ts.patientID = p.patientID
    LEFT JOIN user u ON p.userID = u.userID
    LEFT JOIN treatment_logs tl ON ts.sheetID = tl.sheetID
    LEFT JOIN doctor d ON tl.doctorID = d.doctorID
    LEFT JOIN user du ON d.userID = du.userID
    WHERE ts.sheetID = ?
    ORDER BY tl.logTime ASC
  `;

  db.query(sql, [req.params.id], (err, rows) => {
    if (err) return res.status(500).json(err);
    if (!rows.length) return res.status(404).json({ error: "Not found" });

    const base = {
      sheetID: rows[0].sheetID,
      admissionNumber: rows[0].admissionNumber,
      patientCode: rows[0].patientCode,
      diagnosis: rows[0].diagnosis,
      createdAt: rows[0].createdAt,
      patientID: rows[0].patientID,
      patientName: rows[0].patientName,
      HI: rows[0].HI,
      logs: rows
        .filter((r) => r.logID)
        .map((r) => ({
          logID: r.logID,
          doctorID: r.doctorID,
          doctorName: r.doctorName,
          logTime: r.logTime,
          subjective: r.subjective,
          objective: r.objective,
          assessment: r.assessment,
          plan: r.plan,
          instruction: r.instruction,
        })),
    };

    res.json(base);
  });
});

/* ================= MANUAL CREATE LOG (FIXED) ================= */
router.post("/manual", verifyToken, (req, res) => {
  const { cic, diagnosis, log, doctorID } = req.body;

  if (!doctorID) {
    return res.status(400).json({ error: "Missing doctorID from UI" });
  }

  if (!cic) {
    return res.status(400).json({ error: "Missing CIC" });
  }

  db.beginTransaction((err) => {
    if (err) return res.status(500).json({ error: "Transaction error" });

    db.query(
      `SELECT patientID FROM patient WHERE HI = ?`,
      [cic],
      (err, patientRows) => {
        if (err) return rollback(err);
        if (!patientRows.length) return rollback("Patient not found", 404);

        const patientID = patientRows[0].patientID;

        db.query(
          `
          SELECT sheetID
          FROM treatment_sheet
          WHERE patientID = ?
          ORDER BY createdAt DESC
          LIMIT 1
          `,
          [patientID],
          (err, sheetRows) => {
            if (err) return rollback(err);

            let sheetID = sheetRows.length ? sheetRows[0].sheetID : null;

            const createSheet = (cb) => {
              db.query(
                `
                INSERT INTO treatment_sheet
                (patientID, admissionID, admissionNumber, patientCode, diagnosis)
                VALUES (?, NULL, NULL, ?, ?)
                `,
                [patientID, cic, diagnosis || ""],
                (err, result) => {
                  if (err) return rollback(err);
                  sheetID = result.insertId;
                  cb();
                }
              );
            };

            const insertLog = () => {
              if (!log) {
                return db.commit(() =>
                  res.json({
                    success: true,
                    sheetID,
                    logsInserted: 0,
                  })
                );
              }

              db.query(
                `
                INSERT INTO treatment_logs
                (sheetID, doctorID, logTime, subjective, objective, assessment, plan, instruction)
                VALUES (?, ?, NOW(), ?, ?, ?, ?, ?)
                `,
                [
                  sheetID,
                  doctorID, // ⭐ FROM UI
                  log.subjective || "",
                  log.objective || "",
                  log.assessment || "",
                  log.plan || "",
                  log.instruction || "",
                ],
                (err) => {
                  if (err) return rollback(err);

                  db.commit(() =>
                    res.json({
                      success: true,
                      sheetID,
                      logsInserted: 1,
                    })
                  );
                }
              );
            };

            if (!sheetID) return createSheet(insertLog);
            insertLog();
          }
        );
      }
    );
  });

  function rollback(err, status = 500) {
    db.rollback(() => {
      console.error(err);
      res.status(status).json({
        error: typeof err === "string" ? err : "Database error",
      });
    });
  }
});

router.post("/:sheetID/log", verifyToken, (req, res) => {
  const { sheetID } = req.params;

  // ✅ lấy từ UI (frontend gửi lên)
  const doctorID = req.body.doctorID;

  const {
    subjective = "",
    objective = "",
    assessment = "",
    plan = "",
    instruction = "",
  } = req.body.log || {};

  if (!doctorID) {
    return res.status(400).json({ error: "Missing doctorID from UI" });
  }

  if (!sheetID) {
    return res.status(400).json({ error: "Missing sheetID" });
  }

  db.query(
    `INSERT INTO treatment_logs
     (sheetID, doctorID, logTime, subjective, objective, assessment, plan, instruction)
     VALUES (?, ?, NOW(), ?, ?, ?, ?, ?)`,
    [
      sheetID,
      doctorID,
      subjective,
      objective,
      assessment,
      plan,
      instruction,
    ],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json({
        success: true,
        logID: result.insertId,
      });
    }
  );
});

module.exports = router;