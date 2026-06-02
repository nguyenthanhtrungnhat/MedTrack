const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Tesseract = require("tesseract.js");

const db = require("../config/db");

const {
  convertPdfToImage,
  parseForm,
  parseLogs,
} = require("../utils/ocrHelpers");
const verifyToken = require("../middleware/verifyToken");

/* ================= MULTER ================= */
const upload = multer({
  dest: "uploads/temp/",
});

/* ================= OCR ================= */
router.post("/ocr", upload.single("file"),verifyToken, async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      error: "No file uploaded",
    });
  }

  let filePath = req.file.path;
  let convertedPath = null;

  try {
    // PDF -> IMAGE
    if (req.file.mimetype === "application/pdf") {
      convertedPath = await convertPdfToImage(filePath);
      filePath = convertedPath;
    }

    // OCR
    const result = await Tesseract.recognize(filePath, "eng");

    const text = result.data.text;

    const form = parseForm(text);
    const logs = parseLogs(text);

    res.json({
      form,
      logs,
    });
  } catch (err) {
    console.error("OCR error:", err);

    res.status(500).json({
      error: "OCR failed",
    });
  } finally {
    try {
      if (req.file?.path) {
        fs.unlink(req.file.path, () => {});
      }

      if (convertedPath) {
        fs.unlink(convertedPath, () => {});
      }
    } catch (e) {
      console.error("Cleanup error:", e);
    }
  }
});

/* ================= SAVE TREATMENT ================= */
router.post("/",verifyToken, (req, res) => {
  const {
    admissionNumber,
    patientCode,
    diagnosis,
    doctorID,
    logs,
  } = req.body;

  if (!patientCode) {
    return res.status(400).json({
      error: "Missing patient code",
    });
  }

  // FIND PATIENT
  db.query(
    "SELECT patientID FROM patient WHERE HI = ?",
    [patientCode],
    (err, rows) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          error: "Database error",
        });
      }

      if (!rows.length) {
        return res.status(404).json({
          error: "Patient not found",
        });
      }

      const patientID = rows[0].patientID;

      // INSERT SHEET
      db.query(
        `
        INSERT INTO treatment_sheet
        (
          patientID,
          doctorID,
          admissionNumber,
          patientCode,
          diagnosis
        )
        VALUES (?, ?, ?, ?, ?)
        `,
        [
          patientID,
          doctorID,
          admissionNumber,
          patientCode,
          diagnosis,
        ],
        (err2, result) => {
          if (err2) {
            console.error(err2);

            return res.status(500).json({
              error: "Insert sheet failed",
            });
          }

          const sheetID = result.insertId;

          // NO LOGS
          if (!Array.isArray(logs) || logs.length === 0) {
            return res.json({
              success: true,
              sheetID,
              logsInserted: 0,
            });
          }

          let inserted = 0;

          logs.forEach((log) => {
            db.query(
              `
              INSERT INTO treatment_logs
              (
                sheetID,
                logTime,
                subjective,
                objective,
                assessment,
                plan,
                instruction
              )
              VALUES (?, ?, ?, ?, ?, ?, ?)
              `,
              [
                sheetID,
                log.logTime || null,
                log.subjective || "",
                log.objective || "",
                log.assessment || "",
                log.plan || "",
                log.instruction || "",
              ],
              (err3) => {
                if (err3) {
                  console.error(err3);

                  return res.status(500).json({
                    error: "Insert logs failed",
                  });
                }

                inserted++;

                if (inserted === logs.length) {
                  return res.json({
                    success: true,
                    sheetID,
                    logsInserted: inserted,
                  });
                }
              }
            );
          });
        }
      );
    }
  );
});

/* ================= GET ALL SHEETS ================= */
router.get("/all",verifyToken, (req, res) => {
  db.query(
    `
    SELECT *
    FROM treatment_sheet
    ORDER BY createdAt DESC
    `,
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          error: err.message,
        });
      }

      res.json(rows);
    }
  );
});

/* ================= GET LOGS ================= */
router.get("/logs/:sheetID",verifyToken, (req, res) => {
  db.query(
    `
    SELECT *
    FROM treatment_logs
    WHERE sheetID = ?
    ORDER BY logTime ASC
    `,
    [req.params.sheetID],
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          error: err.message,
        });
      }

      res.json(rows);
    }
  );
});

/* ================= GET SINGLE SHEET ================= */
router.get("/:id",verifyToken, (req, res) => {
  const id = req.params.id;

  const sql = `
    SELECT
      ts.*,
      tl.logTime,
      tl.subjective,
      tl.objective,
      tl.assessment,
      tl.plan,
      tl.instruction
    FROM treatment_sheet ts
    LEFT JOIN treatment_logs tl
      ON ts.sheetID = tl.sheetID
    WHERE ts.sheetID = ?
    ORDER BY tl.logTime ASC
  `;

  db.query(sql, [id], (err, rows) => {
    if (err) {
      return res.status(500).json(err);
    }

    if (!rows.length) {
      return res.status(404).json({
        error: "Not found",
      });
    }

    const base = {
      sheetID: rows[0].sheetID,
      admissionNumber: rows[0].admissionNumber,
      patientCode: rows[0].patientCode,
      diagnosis: rows[0].diagnosis,
      createdAt: rows[0].createdAt,
      logs: [],
    };

    base.logs = rows.map((r) => ({
      logTime: r.logTime,
      subjective: r.subjective,
      objective: r.objective,
      assessment: r.assessment,
      plan: r.plan,
      instruction: r.instruction,
    }));

    res.json(base);
  });
});

module.exports = router;