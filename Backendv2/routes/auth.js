const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const verifyToken = require("../middleware/verifyToken");

// POST /login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email and password are required' });

  const query = 'SELECT * FROM user WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) return res.status(500).json({ error: 'Internal server error' });
    if (results.length === 0) return res.status(401).json({ error: 'Invalid email or password' });

    const user = results[0];
    if (password !== user.password)
      return res.status(401).json({ error: 'Invalid email or password' });

    db.query('SELECT roleID FROM userrole WHERE userID = ?', [user.userID], (err, roleResults) => {
      if (err) return res.status(500).json({ error: 'Internal server error' });
      if (roleResults.length === 0) return res.status(401).json({ error: 'Role not found' });

      const roleID = roleResults[0].roleID;
      const token = jwt.sign({ userID: user.userID, roleID }, 'secretkey', { expiresIn: '1h' });

      let redirectPath, roleName;
      switch (roleID) {
        case 1: redirectPath = '/doctor';  roleName = 'Doctor';  break;
        case 2: redirectPath = '/home';    roleName = 'Nurse';   break;
        case 3: redirectPath = '/patient'; roleName = 'Patient'; break;
        case 666: redirectPath = '/admin'; roleName = 'Admin';   break;
        default:
          return res.status(403).json({ error: 'Unauthorized role. Please contact support.' });
      }

      res.json({
        message: 'Login successful',
        token,
        redirect: redirectPath,
        user: { userID: user.userID, email: user.email, roleID },
      });
    });
  });
});

// POST /register
router.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password)
    return res.status(400).json({ message: 'All fields are required' });

  db.query('SELECT * FROM user WHERE email = ?', [email], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error on SELECT' });
    if (result.length > 0) return res.status(400).json({ message: 'Email already registered' });

    db.query(
      'INSERT INTO user (username, email, password) VALUES (?, ?, ?)',
      [username, email, password],
      (err, result) => {
        if (err) return res.status(500).json({ message: 'Error inserting user' });

        const userID = result.insertId;

        db.query('INSERT INTO userrole (userID, roleID) VALUES (?, ?)', [userID, 3], (err2) => {
          if (err2) return res.status(500).json({ message: 'Error assigning role' });

          db.query('INSERT INTO patient (userID) VALUES (?)', [userID], (err3) => {
            if (err3) return res.status(500).json({ message: 'Error creating patient' });

            console.log('✅ New patient registered with userID:', userID);
            res.json({ message: 'User (Patient) created successfully', userID });
          });
        });
      }
    );
  });
});

module.exports = router;
