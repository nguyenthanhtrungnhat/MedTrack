const express = require("express");
const router = express.Router();

const db = require("../config/db");

const verifyToken = require("../middleware/verifyToken");
const { isAdmin } = require("../middleware/auth");

//
// GET all medicines
// GET /api/medicines
//
router.get("/", verifyToken, (req, res) => {

  const sql =
    "SELECT * FROM medicines ORDER BY medicineName";

  db.query(sql, (err, results) => {

    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to load medicines"
      });
    }

    res.json(results);
  });
});

//
// GET medicine by ID
// GET /api/medicines/:id
//
router.get("/:id", verifyToken, (req, res) => {

  const id = req.params.id;

  const sql =
    "SELECT * FROM medicines WHERE medicineID = ?";

  db.query(sql, [id], (err, result) => {

    if (err) {

      return res.status(500).json({
        message: "Error retrieving medicine",
        error: err
      });
    }

    if (result.length === 0) {

      return res.status(404).json({
        message: "Medicine not found"
      });
    }

    res.json(result[0]);
  });
});

//
// CREATE medicine
// POST /api/medicines
//
router.post(
  "/",
  verifyToken,
  isAdmin,
  (req, res) => {

    const {
      medicineName,
      genericName,
      dosageForm,
      strength,
      description
    } = req.body;

    if (!medicineName) {

      return res.status(400).json({
        message: "Medicine name required"
      });
    }

    const sql = `
      INSERT INTO medicines
      (
        medicineName,
        genericName,
        dosageForm,
        strength,
        description
      )
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [
        medicineName,
        genericName,
        dosageForm,
        strength,
        description
      ],
      (err, result) => {

        if (err) {

          console.error(err);

          return res.status(500).json({
            message: "Create failed"
          });
        }

        res.json({
          message: "Medicine created",
          medicineID: result.insertId
        });
      }
    );
  }
);

//
// UPDATE medicine active status
// PUT /api/medicines/:id
//
router.put(
  "/:id",
  verifyToken,
  isAdmin,
  (req, res) => {

    const id = req.params.id;

    const { isActive } = req.body;

    const sql =
      "UPDATE medicines SET isActive=? WHERE medicineID=?";

    db.query(
      sql,
      [isActive, id],
      (err) => {

        if (err) {

          console.error(err);

          return res.status(500).json({
            message: "Update failed"
          });
        }

        res.json({
          message: "Status updated"
        });
      }
    );
  }
);

module.exports = router;