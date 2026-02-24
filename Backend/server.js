const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();
const verifyToken = require("./verifyToken");
const axios = require("axios");
const path = require("path");
const multer = require("multer");


function isAdmin(req, res, next) {
  if (!req.user || req.user.roleID !== 666) {
    return res.status(403).json({ message: "Forbidden: Admin only" });
  }
  next();
}

require("dotenv").config({ path: "JWT.env" });
require('dotenv').config();

// Enable CORS
app.use(cors());

// Create MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  dateStrings: true,
  timezone: "+07:00",
});

// Connect to the database
db.connect(err => {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack);
    return;
  }
  console.log('Connected to the database');
});

// Middleware to parse JSON requests
app.use(express.json());
// Cho phép truy cập file trong thư mục /uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// thư mục lưu ảnh: Backend/uploads/news
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads/news"));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// cho phép client truy cập ảnh qua http://localhost:3000/uploads/...
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// Generic function to fetch all records from a table
const getAllRecords = (tableName, res) => {
  db.query(`SELECT * FROM ${tableName}`, (err, results) => {
    if (err) {
      res.status(500).send({ error: 'Failed to retrieve records from ' + tableName });
    } else {
      res.status(200).json(results);
    }
  });
};

// Generic function to fetch all records with join to user table
const getAllRecords2 = (tableName, res) => {
  const query = `
    SELECT 
    n.*, 
    u.userID,
    u.username,
    u.fullName,
    u.dob,
    u.phone,
    u.email,
    u.CIC,
    u.address,
    u.gender
    FROM ${tableName} n
    JOIN user u ON n.userID = u.userID;
  `;
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send({ error: 'Failed to retrieve records from ' + tableName });
    } else {
      res.status(200).json(results);
    }
  });
};

// API routes
app.get('/nurses', (req, res) => getAllRecords2('nurse', res));
app.get('/doctors', (req, res) => getAllRecords2('doctor', res));
app.get('/medical-records', (req, res) => getAllRecords('medicalrecords', res));
app.get('/patients', (req, res) => getAllRecords2('patient', res));
app.get('/rooms', (req, res) => getAllRecords('room', res));
app.get('/requests', (req, res) => getAllRecords('request', res));
app.get('/users', (req, res) => getAllRecords('user', res));
app.get('/appointments', (req, res) => getAllRecords('appointment', res));
app.get('/roles', (req, res) => getAllRecords('role', res));
app.get('/user-roles', (req, res) => getAllRecords('userrole', res));
app.get('/feedback', (req, res) => getAllRecords('feedback', res));
app.get('/nursepatient', (req, res) => getAllRecords('nursepatient', res));
app.get('/schedulerequest', (req, res) => getAllRecords('schedulerequest', res));
// app.get('/news', (req, res) => getAllRecords('news', res));

// ================= ADMIN: NEWS MANAGEMENT =================

// Admin: xem tất cả news (kể cả unactive)
app.get("/admin/news", verifyToken, isAdmin, (req, res) => {
  db.query("SELECT * FROM news", (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.json(results);
  });
});

// Public: chỉ show news đang active
app.get("/news", (req, res) => {
  const sql = "SELECT * FROM news WHERE isActive = 1";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to load news", details: err });
    res.json(results);
  });
});

// Get patient by nurseID
app.get("/nursepatient/:nurseID", (req, res) => {
  const { nurseID } = req.params;
  const query = `SELECT np.* FROM nursepatient np WHERE nurseID = ?;`;
  db.query(query, [nurseID], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error", details: err });
    if (results.length === 0) return res.status(404).json({ error: "No patients found for this nurse" });
    res.json(results);
  });
});

// Get nurse by ID
app.get("/nurses/:nurseID", (req, res) => {
  const { nurseID } = req.params;
  const query = `
    SELECT n.*, u.*
    FROM nurse n
    JOIN user u ON n.userID = u.userID
    WHERE n.nurseID = ?;
  `;
  db.query(query, [nurseID], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error", details: err });
    if (results.length === 0) return res.status(404).json({ error: "Nurse not found" });
    res.json(results[0]);
  });
});

// Get doctor by ID
app.get("/doctors/:doctorID", (req, res) => {
  const { doctorID } = req.params;
  const query = `
    SELECT d.*, u.*
    FROM doctor d
    JOIN user u ON d.userID = u.userID
    WHERE d.doctorID = ?;
  `;
  db.query(query, [doctorID], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error", details: err });
    if (results.length === 0) return res.status(404).json({ error: "Doctor not found" });
    res.json(results[0]);
  });
});

// Get full nurse details by userID
app.get("/nurses/by-user/:userID", (req, res) => {
  const { userID } = req.params;
  const query = `
    SELECT n.*, u.*
    FROM nurse n
    JOIN user u ON n.userID = u.userID
    WHERE n.userID = ?;
  `;
  db.query(query, [userID], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error", details: err });
    if (results.length === 0) return res.status(404).json({ error: "Nurse not found" });
    res.json(results[0]);
  });
});

// Get full doctor details by userID
app.get("/doctors/by-user/:userID", (req, res) => {
  const { userID } = req.params;
  const query = `
    SELECT d.*, u.*
    FROM doctor d
    JOIN user u ON d.userID = u.userID
    WHERE d.userID = ?;
  `;
  db.query(query, [userID], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error", details: err });
    if (results.length === 0) return res.status(404).json({ error: "Doctor not found" });
    res.json(results[0]);
  });
});

// API to get patients by roomID
app.get("/rooms/:roomID/patients", (req, res) => {
  const { roomID } = req.params;
  const query = `
      SELECT p.*, u.fullName, u.email, u.phone
      FROM patient p
      JOIN roompatient rp ON p.patientID = rp.patientID
      JOIN user u ON p.userID = u.userID 
      WHERE rp.roomID = ?;
  `;
  db.query(query, [roomID], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error", details: err });
    res.json(results);
  });
});

// Get patient by ID
app.get("/patients/:patientID", (req, res) => {
  const { patientID } = req.params;
  const query = `
    SELECT p.*, u.*
    FROM patient p
    JOIN user u ON p.userID = u.userID
    WHERE p.patientID = ?;
  `;
  db.query(query, [patientID], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error", details: err });
    if (results.length === 0) return res.status(404).json({ error: "Patient not found" });
    res.json(results[0]);
  });
});

// Get medical record by patientID
app.get("/medical-records/:patientID", (req, res) => {
  const { patientID } = req.params;
  const query = `SELECT * FROM medicalrecords WHERE patientID = ?;`;
  db.query(query, [patientID], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error", details: err });
    if (results.length === 0) return res.status(404).json({ error: "No records found" });
    res.json(results);
  });
});

// GET: Get medical record by recordID
app.get('/medical-records/by-recordId/:recordID', (req, res) => {
  const recordID = parseInt(req.params.recordID);
  if (isNaN(recordID)) return res.status(400).json({ error: 'Invalid recordID' });

  const query = 'SELECT * FROM medicalrecords WHERE recordID = ?';
  db.query(query, [recordID], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (results.length === 0) return res.status(404).json({ message: 'Record not found' });
    res.json(results[0]);
  });
});

// Login API
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required" });

  const query = "SELECT * FROM user WHERE email = ?";
  db.query(query, [email], (err, results) => {
    if (err) return res.status(500).json({ error: "Internal server error" });
    if (results.length === 0) return res.status(401).json({ error: "Invalid email or password" });

    const user = results[0];
    if (password !== user.password)
      return res.status(401).json({ error: "Invalid email or password" });

    db.query("SELECT roleID FROM userrole WHERE userID = ?", [user.userID], (err, roleResults) => {
      if (err) return res.status(500).json({ error: "Internal server error" });
      if (roleResults.length === 0) return res.status(401).json({ error: "Role not found" });

      const roleID = roleResults[0].roleID;
      const token = jwt.sign({ userID: user.userID, roleID }, "secretkey", { expiresIn: "1h" });

      let redirectPath;
      let roleName;

      switch (roleID) {
        case 1: redirectPath = "/doctor"; roleName = "Doctor"; break;
        case 2: redirectPath = "/home"; roleName = "Nurse"; break;
        case 3: redirectPath = "/patient"; roleName = "Patient"; break;
        case 666: redirectPath = "/admin"; roleName = "Admin"; break;
        default:
          return res.status(403).json({ error: "Unauthorized role. Please contact support." });
      }

      res.json({
        message: "Login successful",
        token,
        redirect: redirectPath,
        user: { userID: user.userID, email: user.email, roleID },
      });
    });
  });
});

// POST: Add medical record
app.post("/post-medical-records", verifyToken, (req, res) => {
  const {
    patientID,
    heartRate,
    pulse,
    height,
    weight,
    hurtScale,
    temperature,
    currentCondition,
    SP02,
    healthStatus,
    respiratoryRate,
    bloodPressure,
    urine,
    oxygenTherapy,
    sensorium
  } = req.body;

  const userID = req.user.userID;
  const roleID = req.user.roleID;

  const sql = `
      INSERT INTO medicalrecords 
      (patientID, heartRate, pulse, height, weight, hurtScale, temperature, currentCondition, SP02, healthStatus, respiratoryRate, bloodPressure, urine, oxygenTherapy, sensorium) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

  db.query(sql, [
    patientID, heartRate, pulse, height, weight, hurtScale, temperature,
    currentCondition, SP02, healthStatus, respiratoryRate, bloodPressure,
    urine, oxygenTherapy, sensorium
  ], (err, result) => {
    if (err) return res.status(500).json({ message: "Server error", error: err });

    res.status(201).json({
      message: "Medical record added successfully",
      recordID: result.insertId,
      addedBy: userID,
      roleID,
    });
  });
});

// Delete nurse
app.delete("/nurses/:nurseID", (req, res) => {
  const nurseID = req.params.nurseID;
  const sql = "DELETE FROM nurse WHERE nurseID = ?";
  db.query(sql, [nurseID], (err, result) => {
    if (err) return res.status(500).json({ message: "Failed to delete nurse", error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Nurse not found" });
    res.status(200).json({ message: "Nurse deleted successfully" });
  });
});

// Delete doctor
app.delete("/doctors/:doctorID", (req, res) => {
  const doctorID = req.params.doctorID;
  const sql = "DELETE FROM doctor WHERE doctorID = ?";
  db.query(sql, [doctorID], (err, result) => {
    if (err) return res.status(500).json({ message: "Failed to delete doctor", error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Doctor not found" });
    res.status(200).json({ message: "Doctor deleted successfully" });
  });
});

// Delete patient
app.delete("/patients/:patientID", (req, res) => {
  const patientID = req.params.patientID;
  const sql = "DELETE FROM patient WHERE patientID = ?";
  db.query(sql, [patientID], (err, result) => {
    if (err) return res.status(500).json({ message: "Failed to delete patient", error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Patient not found" });
    res.status(200).json({ message: "Patient deleted successfully" });
  });
});

// Get patient by userID
app.get('/api/patientByUserID/:userID', (req, res) => {
  const userID = req.params.userID;
  const query = `
    SELECT p.*, u.*
    FROM patient p
    JOIN user u ON p.userID = u.userID
    WHERE p.userID = ?;
  `;
  db.query(query, [userID], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Get schedule of nurse
app.get('/api/schedules/:nurseID', (req, res) => {
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

app.get("/api/all-appointment/doctor/:doctorID", (req, res) => {
  const doctorID = req.params.doctorID;

  const sql = `
        SELECT a.appointmentID, a.dateTime, a.location, a.appointmentStatus,
               d.doctorID, u.fullName AS patientName
        FROM appointment a
        LEFT JOIN user u ON a.userID = u.userID  -- lấy tên bệnh nhân
        LEFT JOIN doctor d ON a.doctorID = d.doctorID
        WHERE a.doctorID = ?
        ORDER BY a.dateTime DESC;
    `;

  db.query(sql, [doctorID], (err, result) => {
    if (err) return res.status(500).json({ message: "Query Failed", error: err });
    // console.log(result);
    res.json(result);
  });
});


app.get("/api/appointment/doctor/:doctorID", (req, res) => {
  const doctorID = req.params.doctorID;

  const sql = `
        SELECT a.appointmentID, a.dateTime, a.location, a.appointmentStatus,
               d.doctorID, u.fullName AS patientName
        FROM appointment a
        LEFT JOIN user u ON a.userID = u.userID
        LEFT JOIN doctor d ON a.doctorID = d.doctorID
        WHERE a.doctorID = ?
        AND DATE(a.dateTime) = CURDATE()   -- only today appointments
        ORDER BY a.dateTime DESC;
    `;

  db.query(sql, [doctorID], (err, result) => {
    if (err) return res.status(500).json({ message: "Query Failed", error: err });
    res.json(result);
  });
});

// GET total pending shift requests count
app.get("/schedule-request/pending/count", (req, res) => {
    const sql = `SELECT COUNT(*) AS count FROM scheduleRequest WHERE status = 0`; // 0 = Pending
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ message: "DB error", err });
        res.json({ count: result[0].count });
    });
});


//reject, approve schedule request
app.patch("/schedule-request/:id/status", (req, res) => {
    const requestID = req.params.id;
    const { status } = req.body; // 1 = approve, 2 = reject

    if (![1, 2].includes(status)) {
        return res.status(400).json({ message: "Invalid status. Must be 1 or 2." });
    }

    const getRequestSql = "SELECT scheduleID, newDate, status FROM scheduleRequest WHERE requestID = ?";
    db.query(getRequestSql, [requestID], (err, result) => {
        if (err) return res.status(500).json({ message: "Database error", err });
        if (result.length === 0) return res.status(404).json({ message: "Request not found" });

        const request = result[0];

        if (request.status !== 0) {
            return res.status(400).json({ message: "Request is not pending" });
        }

        const scheduleID = request.scheduleID;
        const newDate = request.newDate;

        // Update scheduleRequest.status
        const updateRequestSql = "UPDATE scheduleRequest SET status = ? WHERE requestID = ?";
        db.query(updateRequestSql, [status, requestID], (err2) => {
            if (err2) return res.status(500).json({ message: "Failed to update request", err2 });

            if (status === 1) { // approve → update schedule.date
                if (!newDate) return res.status(400).json({ message: "Request newDate is null" });

                const updateScheduleSql = "UPDATE schedules SET date = ? WHERE scheduleID = ?";
                db.query(updateScheduleSql, [newDate, scheduleID], (err3) => {
                    if (err3) return res.status(500).json({ message: "Failed to update schedule", err3 });
                    return res.json({ message: "Request approved and schedule date updated" });
                });
            } else { // reject
                return res.json({ message: "Request rejected successfully" });
            }
        });
    });
});

// POST: Add new schedule
app.post('/api/schedules', (req, res) => {
  const {
    scheduleID,
    subject,
    date,
    start_at,
    working_hours,
    color,
    roomID,
    room_location
  } = req.body;

  if (!subject || !date || !start_at || !working_hours || !roomID)
    return res.status(400).json({ message: "Missing required fields" });

  const sql = `
    INSERT INTO schedules 
    (scheduleID, name, date, start_at, working_hours, color, roomID, room_location)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [scheduleID, subject, date, start_at, working_hours, color, roomID, room_location], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.status(201).json({
      message: "Schedule added successfully",
      scheduleID: result.insertId || scheduleID,
      data: { scheduleID, subject, date, start_at, working_hours, color, roomID, room_location },
    });
  });
});

// PUT: Edit schedule
app.put('/api/schedules/:id', async (req, res) => {
  try {
    const scheduleID = req.params.id;
    const {
      subject,
      date,
      start_at,
      working_hours,
      color,
      roomID,
      room_location
    } = req.body;

    const [rows] = await db.execute('SELECT * FROM schedules WHERE scheduleID = ?', [scheduleID]);
    if (rows.length === 0) return res.status(404).json({ message: 'Schedule not found' });

    const sql = `
      UPDATE schedules
      SET subject = ?, date = ?, start_at = ?, working_hours = ?, color = ?, roomID = ?, room_location = ?
      WHERE scheduleID = ?
    `;

    await db.execute(sql, [subject, date, start_at, working_hours, color, roomID, room_location, scheduleID]);
    res.json({ message: '✅ Schedule updated successfully', schedule: { scheduleID, ...req.body } });
  } catch (err) {
    console.error('Error updating schedule:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// app.post("/register", async (req, res) => {
//   const { username, email, password, captchaToken } = req.body;
//   console.log("Register request received:", { username, email, password: password ? "******" : null, captchaToken });

//   if (!username || !email || !password) {
//     return res.status(400).json({ message: "All fields are required" });
//   }

//   if (!captchaToken) {
//     return res.status(400).json({ message: "Captcha verification required" });
//   }

//   try {
//     // Verify reCAPTCHA
//     const captchaVerify = await axios.post(
//       "https://www.google.com/recaptcha/api/siteverify",
//       {},
//       {
//         params: {
//           secret: process.env.RECAPTCHA_SECRET_KEY,
//           response: captchaToken,
//         },
//       }
//     );
//     console.log("Captcha verification response:", captchaVerify.data);

//     if (!captchaVerify.data.success || captchaVerify.data.score < 0.5) {
//       return res.status(403).json({ message: "Captcha failed — possible bot detected" });
//     }

//     // Check email
//     db.query("SELECT * FROM user WHERE email = ?", [email], (err, result) => {
//       if (err) {
//         console.error("Database SELECT error:", err);
//         return res.status(500).json({ message: "Database SELECT error" });
//       }

//       if (result.length > 0) {
//         return res.status(400).json({ message: "Email already registered" });
//       }

//       // Insert user
//       db.query("INSERT INTO user (username, email, password) VALUES (?, ?, ?)", [username, email, password], (err, result) => {
//         if (err) {
//           console.error("Database INSERT error:", err);
//           return res.status(500).json({ message: "Database INSERT error" });
//         }

//         const userID = result.insertId;
//         console.log("User created with ID:", userID);

//         // Assign role
//         db.query("INSERT INTO userrole (userID, roleID) VALUES (?, ?)", [userID, 3], (err) => {
//           if (err) {
//             console.error("Assign role error:", err);
//             return res.status(500).json({ message: "Assign role error" });
//           }

//           // Create patient
//           db.query("INSERT INTO patient (userID) VALUES (?)", [userID], (err) => {
//             if (err) {
//               console.error("Create patient error:", err);
//               return res.status(500).json({ message: "Create patient error" });
//             }

//             console.log("Patient record created for userID:", userID);
//             return res.json({ message: "Registration successful", userID });
//           });
//         });
//       });
//     });

//   } catch (error) {
//     console.error("reCAPTCHA / backend error:", error.response?.data || error);
//     return res.status(500).json({ message: "Captcha or server error" });
//   }
// });


app.post("/register", (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Step 1: Check if email already exists
  db.query("SELECT * FROM user WHERE email = ?", [email], (err, result) => {
    if (err) {
      console.error("Select error:", err);
      return res.status(500).json({ message: "Database error on SELECT" });
    }

    if (result.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Step 2: Insert new user
    db.query(
      "INSERT INTO user (username, email, password) VALUES (?, ?, ?)",
      [username, email, password],
      (err, result) => {
        if (err) {
          console.error("Insert user error:", err);
          return res.status(500).json({ message: "Error inserting user" });
        }

        const userID = result.insertId;

        // Step 3: Assign roleID = 3 (Patient)
        db.query(
          "INSERT INTO userrole (userID, roleID) VALUES (?, ?)",
          [userID, 3],
          (err2) => {
            if (err2) {
              console.error("Insert userRole error:", err2);
              return res.status(500).json({ message: "Error assigning role" });
            }

            // Step 4: Create an empty patient record linked to userID
            db.query(
              "INSERT INTO patient (userID) VALUES (?)",
              [userID],
              (err3) => {
                if (err3) {
                  console.error("Insert patient error:", err3);
                  return res.status(500).json({ message: "Error creating patient" });
                }

                console.log("✅ New patient registered with userID:", userID);
                res.json({ message: "User (Patient) created successfully", userID });
              }
            );
          }
        );
      }
    );
  });
});

// PUT: Update (edit) patient information (protected)
app.put("/api/patient/complete", verifyToken, (req, res) => {
  const {
    userID,
    fullName,
    gender,
    dob,
    phone,
    address,
    HI,
    relativeName,
    relativeNumber,
    CIC, // must match DB column name
  } = req.body;

  // ✅ Validate required fields
  if (!userID || !fullName || !gender || !dob || !phone || !address || !CIC) {
    console.log("❌ Missing field(s):", req.body);
    return res.status(400).json({ message: "Missing required fields" });
  }

  // ✅ Step 1: Update user info
  const updateUserSql = `
    UPDATE user
    SET fullName = ?, gender = ?, dob = ?, phone = ?, address = ?, CIC = ?
    WHERE userID = ?
  `;

  db.query(updateUserSql, [fullName, gender, dob, phone, address, CIC, userID], (err1, result1) => {
    if (err1) {
      console.error("❌ Error updating user:", err1);
      return res.status(500).json({ message: "Failed to update user info", error: err1 });
    }

    // ✅ Step 2: Ensure patient record exists
    const checkPatientSql = `SELECT patientID FROM patient WHERE userID = ? LIMIT 1`;

    db.query(checkPatientSql, [userID], (err2, rows) => {
      if (err2) {
        console.error("❌ Error checking patient:", err2);
        return res.status(500).json({ message: "Database error", error: err2 });
      }

      if (rows.length === 0) {
        console.warn(`⚠️ No patient record found for userID=${userID}`);
        return res.status(404).json({ message: "No patient record found for this user" });
      }

      const patientID = rows[0].patientID;

      // ✅ Step 3: Update patient record
      const updatePatientSql = `
        UPDATE patient
        SET HI = ?, relativeName = ?, relativeNumber = ?
        WHERE patientID = ?
      `;

      db.query(updatePatientSql, [HI, relativeName, relativeNumber, patientID], (err3) => {
        if (err3) {
          console.error("❌ Error updating patient:", err3);
          return res.status(500).json({ message: "Failed to update patient info", error: err3 });
        }

        return res.status(200).json({ message: "✅ Patient information updated successfully" });
      });
    });
  });
});

app.get("/appointments/:userID", (req, res) => {
  const sql = `
        SELECT a.*, u.fullName AS doctorName 
        FROM appointment a
        JOIN doctor d ON a.doctorID = d.doctorID
        JOIN user u ON d.userID = u.userID
        WHERE a.userID = ?
        ORDER BY a.dateTime DESC
    `;
  db.query(sql, [req.params.userID], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send(result);
  });
});
app.post("/appointments", (req, res) => {
  const { doctorID, userID, dateTime, location } = req.body;

  // 🔥 Check duplicate before insert
  db.query(
    "SELECT * FROM appointment WHERE doctorID=? AND userID=? AND dateTime=?",
    [doctorID, userID, dateTime],
    (err, result) => {

      if (err) return res.status(500).send(err);

      if (result.length > 0) {
        return res.status(400).json({
          message: "⚠ You already have an appointment with this doctor on this date."
        });
      }

      db.query(
        "INSERT INTO appointment (doctorID, userID, dateTime, location) VALUES (?,?,?,?)",
        [doctorID, userID, dateTime, location],
        (err2) => {
          if (err2) return res.status(500).send(err2);
          res.status(201).json({ message: "Appointment created successfully!" });
        }
      );
    }
  );
});

//appointments/check-overdue
app.get("/update-overdue", (req, res) => {
  const sql = `
    UPDATE appointment
    SET appointmentStatus = 1
    WHERE DATE(dateTime) < CURDATE() AND appointmentStatus = 0
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Overdue appointments updated", affectedRows: result.affectedRows });
  });
});

// PUT /appointments/check-overdue
app.put("/appointments/check-overdue", (req, res) => {
  const sql = `
    UPDATE appointment
    SET appointmentStatus = 1
    WHERE appointmentStatus = 0 AND dateTime < CURDATE();
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: "Database error", details: err });
    res.json({
      message: "Overdue appointments updated",
      updatedCount: result.affectedRows
    });
  });
});

// Create account for nurse
// Create account for nurse (dùng đúng field bảng user)
app.post("/admin/nurses", verifyToken, isAdmin, (req, res) => {
  const {
    username,
    password,
    fullName,
    dob,
    phone,
    email,
    CIC,
    address,
    gender,   // 0/1
    image,    // ảnh riêng của nurse (tùy, có thể null)
  } = req.body;

  if (!username || !password || !fullName || !email) {
    return res.status(400).json({ message: "Username, password, fullName, email are required" });
  }

  // 1. Kiểm tra email trùng
  db.query("SELECT * FROM user WHERE email = ?", [email], (err, existing) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    if (existing.length > 0) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // 2. Tạo user mới (đúng field trong bảng user)
    const insertUserSql = `
      INSERT INTO user
      (username, password, fullName, dob, phone, email, CIC, address, gender, isActive)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `;
    db.query(
      insertUserSql,
      [username, password, fullName, dob, phone, email, CIC, address, gender],
      (err2, resultUser) => {
        if (err2) return res.status(500).json({ message: "Insert user failed", error: err2 });

        const newUserID = resultUser.insertId;

        // 3. Gán role = 2 (Nurse)
        db.query(
          "INSERT INTO userrole (userID, roleID) VALUES (?, ?)",
          [newUserID, 2],
          (err3) => {
            if (err3) return res.status(500).json({ message: "Assign role failed", error: err3 });

            // 4. Tạo record trong bảng nurse (chỉ cần userID + image nếu có)
            const insertNurseSql = `
              INSERT INTO nurse (userID, image)
              VALUES (?, ?)
            `;
            db.query(
              insertNurseSql,
              [newUserID, image || null],
              (err4, resultNurse) => {
                if (err4)
                  return res.status(500).json({ message: "Insert nurse failed", error: err4 });

                return res.status(201).json({
                  message: "Nurse account created successfully",
                  userID: newUserID,
                  nurseID: resultNurse.insertId,
                });
              }
            );
          }
        );
      }
    );
  });
});



// Create account for doctor
app.post("/admin/doctors", verifyToken, isAdmin, (req, res) => {
  const {
    username,
    password,
    fullName,
    dob,
    phone,
    email,
    CIC,
    address,
    gender // 0/1
  } = req.body;

  if (!username || !password || !fullName || !email) {
    return res.status(400).json({ message: "Username, password, fullName, email are required" });
  }

  db.query("SELECT * FROM user WHERE email = ?", [email], (err, existing) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    if (existing.length > 0) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const insertUserSql = `
      INSERT INTO user 
      (username, password, fullName, dob, phone, email, CIC, address, gender, isActive)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `;
    db.query(
      insertUserSql,
      [username, password, fullName, dob, phone, email, CIC, address, gender],
      (err2, resultUser) => {
        if (err2) return res.status(500).json({ message: "Insert user failed", error: err2 });

        const newUserID = resultUser.insertId;

        // role = 1 (Doctor)
        db.query(
          "INSERT INTO userrole (userID, roleID) VALUES (?, ?)",
          [newUserID, 1],
          (err3) => {
            if (err3) return res.status(500).json({ message: "Assign role failed", error: err3 });

            // bảng doctor chỉ cần userID (các field khác để NULL)
            const insertDoctorSql = `INSERT INTO doctor (userID) VALUES (?)`;
            db.query(insertDoctorSql, [newUserID], (err4, resultDoctor) => {
              if (err4)
                return res.status(500).json({ message: "Insert doctor failed", error: err4 });

              return res.status(201).json({
                message: "Doctor account created successfully",
                userID: newUserID,
                doctorID: resultDoctor.insertId,
              });
            });
          }
        );
      }
    );
  });
});
// ==== UPLOAD ẢNH (ADMIN) ====
app.post("/upload/image", verifyToken, isAdmin, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const filePath = `/uploads/news/${req.file.filename}`;
  res.json({ filePath });
});

// ================= ADMIN: ACCOUNT MANAGEMENT =================

// Lấy danh sách account theo roleID (1=Doctor, 2=Nurse, 3=Patient)
// Không trả về Admin (666)
app.get("/admin/accounts/:roleID", verifyToken, isAdmin, (req, res) => {
  const roleID = parseInt(req.params.roleID, 10);

  if (![1, 2, 3].includes(roleID)) {
    return res.status(400).json({ message: "Invalid roleID" });
  }

  const sql = `
    SELECT 
      u.userID,
      u.username,
      u.fullName,
      u.email,
      u.phone,
      u.dob,
      u.isActive,
      r.roleID,
      r.nameRole
    FROM user u
    JOIN userrole ur ON u.userID = ur.userID
    JOIN role r ON ur.roleID = r.roleID
    WHERE r.roleID = ?
      AND r.roleID <> 666
  `;

  db.query(sql, [roleID], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.json(results);
  });
});

// Đổi trạng thái active / unactive cho 1 account
app.put("/admin/accounts/:userID/status", verifyToken, isAdmin, (req, res) => {
  const userID = parseInt(req.params.userID, 10);
  const { isActive } = req.body; // 1 hoặc 0

  if (isNaN(userID) || (isActive !== 0 && isActive !== 1)) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const sql = "UPDATE user SET isActive = ? WHERE userID = ? AND userID <> 4"; // không cập nhật admin

  db.query(sql, [isActive, userID], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found or is admin" });
    }
    res.json({ message: "Status updated", userID, isActive });
  });
});


// CRUD for news
// ADMIN: lấy tất cả news, kể cả active / inactive
app.get("/admin/news", verifyToken, isAdmin, (req, res) => {
  const sql = "SELECT * FROM news";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Failed to load news", error: err });
    res.json(results);
  });
});

//Post
// POST: Tạo news (cho phép upload file hoặc dùng URL)
app.post(
  "/admin/news",
  verifyToken,
  isAdmin,
  upload.single("image"),   // <-- quan trọng
  (req, res) => {
    const { title, body, date, author } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    // nếu có upload file => dùng đường dẫn file
    // nếu không, dùng trường image (URL) gửi kèm từ form
    let imagePath = null;
    if (req.file) {
      imagePath = `/uploads/news/${req.file.filename}`;
    } else if (req.body.image) {
      imagePath = req.body.image; // URL text
    }

    const sql = `
      INSERT INTO news (title, body, date, author, image)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.query(
      sql,
      [title, body || null, date || new Date(), author || null, imagePath],
      (err, result) => {
        if (err)
          return res.status(500).json({ message: "Insert news failed", error: err });

        res.status(201).json({
          message: "News created successfully",
          newID: result.insertId,
          image: imagePath,
        });
      }
    );
  }
);


//Put
app.put("/admin/news/:id", verifyToken, isAdmin, (req, res) => {
  const newID = req.params.id;
  const { title, body, date, author, image, isActive } = req.body;

  const sql = `
    UPDATE news
    SET title = ?, body = ?, date = ?, author = ?, image = ?, isActive = ?
    WHERE newID = ?
  `;

  db.query(sql, [title, body, date, author, image, isActive, newID], (err, result) => {
    if (err) return res.status(500).json({ message: "Update news failed", error: err });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "News not found" });
    }
    res.json({ message: "News updated successfully" });
  });
});

//Delete
app.delete("/admin/news/:id", verifyToken, isAdmin, (req, res) => {
  const newID = req.params.id;

  db.query("DELETE FROM news WHERE newID = ?", [newID], (err, result) => {
    if (err) return res.status(500).json({ message: "Delete news failed", error: err });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "News not found" });
    }
    res.json({ message: "News deleted successfully" });
  });
});

// Đổi trạng thái active / unactive của news
app.put("/admin/news/:newID/status", verifyToken, isAdmin, (req, res) => {
  const newID = parseInt(req.params.newID, 10);
  const { isActive } = req.body; // 0 hoặc 1

  if (isNaN(newID) || (isActive !== 0 && isActive !== 1)) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const sql = "UPDATE news SET isActive = ? WHERE newID = ?";
  db.query(sql, [isActive, newID], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "News not found" });
    }
    res.json({ message: "News status updated", newID, isActive });
  });
});
/**************** SHIFT CHANGE *****************/
// ================= CREATE SHIFT CHANGE REQUEST =================
app.post("/request", (req, res) => {
  const { scheduleID, newDate, reason } = req.body;

  if (!scheduleID || !newDate || !reason)
    return res.status(400).send({ message: "Missing required fields" });

  const sql = `
        INSERT INTO scheduleRequest (scheduleID, newDate, reason)
        VALUES (?, ?, ?)
    `;

  db.query(sql, [scheduleID, newDate, reason], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ message: "Shift request submitted", requestID: result.insertId });
  });
});


// ================= GET REQUESTS BY NURSE =================
// Here we JOIN schedules to find nurseID
app.get("/status/:nurseID", (req, res) => {
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

app.put("/schedule-request/:id", (req, res) => {
  const requestID = req.params.id;
  const { status } = req.body; // ví dụ nhận status để update

  const sql = "UPDATE scheduleRequest SET status = ? WHERE requestID = ?";
  db.query(sql, [status, requestID], (err, result) => {
    if (err) return res.status(500).json({ message: "DB error", err });

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Request not found" });

    res.json({ message: "Status updated successfully" });
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
