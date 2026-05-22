const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require('../verifyToken');
const { isAdmin } = require('../middleware/auth');
const upload = require('../config/upload');

// ================= ACCOUNTS =================

// GET /admin/accounts/:roleID
router.get('/accounts/:roleID', verifyToken, isAdmin, (req, res) => {
  const roleID = parseInt(req.params.roleID, 10);
  if (![1, 2, 3].includes(roleID))
    return res.status(400).json({ message: 'Invalid roleID' });

  const sql = `
    SELECT u.userID, u.username, u.fullName, u.email, u.phone, u.dob, u.isActive,
           r.roleID, r.nameRole
    FROM user u
    JOIN userrole ur ON u.userID = ur.userID
    JOIN role r      ON ur.roleID = r.roleID
    WHERE r.roleID = ? AND r.roleID <> 666
  `;
  db.query(sql, [roleID], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    res.json(results);
  });
});

// PUT /admin/accounts/:userID/status
router.put('/accounts/:userID/status', verifyToken, isAdmin, (req, res) => {
  const userID = parseInt(req.params.userID, 10);
  const { isActive } = req.body;

  if (isNaN(userID) || (isActive !== 0 && isActive !== 1))
    return res.status(400).json({ message: 'Invalid input' });

  db.query(
    'UPDATE user SET isActive = ? WHERE userID = ? AND userID <> 4',
    [isActive, userID],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Database error', error: err });
      if (result.affectedRows === 0)
        return res.status(404).json({ message: 'User not found or is admin' });
      res.json({ message: 'Status updated', userID, isActive });
    }
  );
});

// POST /admin/nurses
router.post('/nurses', verifyToken, isAdmin, (req, res) => {
  const { username, password, fullName, dob, phone, email, CIC, address, gender, image } = req.body;

  if (!username || !password || !fullName || !email)
    return res.status(400).json({ message: 'Username, password, fullName, email are required' });

  db.query('SELECT * FROM user WHERE email = ?', [email], (err, existing) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    if (existing.length > 0) return res.status(400).json({ message: 'Email already in use' });

    const insertUserSql = `
      INSERT INTO user (username, password, fullName, dob, phone, email, CIC, address, gender, isActive)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `;
    db.query(insertUserSql, [username, password, fullName, dob, phone, email, CIC, address, gender], (err2, resultUser) => {
      if (err2) return res.status(500).json({ message: 'Insert user failed', error: err2 });

      const newUserID = resultUser.insertId;

      db.query('INSERT INTO userrole (userID, roleID) VALUES (?, ?)', [newUserID, 2], (err3) => {
        if (err3) return res.status(500).json({ message: 'Assign role failed', error: err3 });

        db.query('INSERT INTO nurse (userID, image) VALUES (?, ?)', [newUserID, image || null], (err4, resultNurse) => {
          if (err4) return res.status(500).json({ message: 'Insert nurse failed', error: err4 });
          res.status(201).json({ message: 'Nurse account created successfully', userID: newUserID, nurseID: resultNurse.insertId });
        });
      });
    });
  });
});

// POST /admin/doctors
router.post('/doctors', verifyToken, isAdmin, (req, res) => {
  const { username, password, fullName, dob, phone, email, CIC, address, gender } = req.body;

  if (!username || !password || !fullName || !email)
    return res.status(400).json({ message: 'Username, password, fullName, email are required' });

  db.query('SELECT * FROM user WHERE email = ?', [email], (err, existing) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    if (existing.length > 0) return res.status(400).json({ message: 'Email already in use' });

    const insertUserSql = `
      INSERT INTO user (username, password, fullName, dob, phone, email, CIC, address, gender, isActive)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `;
    db.query(insertUserSql, [username, password, fullName, dob, phone, email, CIC, address, gender], (err2, resultUser) => {
      if (err2) return res.status(500).json({ message: 'Insert user failed', error: err2 });

      const newUserID = resultUser.insertId;

      db.query('INSERT INTO userrole (userID, roleID) VALUES (?, ?)', [newUserID, 1], (err3) => {
        if (err3) return res.status(500).json({ message: 'Assign role failed', error: err3 });

        db.query('INSERT INTO doctor (userID) VALUES (?)', [newUserID], (err4, resultDoctor) => {
          if (err4) return res.status(500).json({ message: 'Insert doctor failed', error: err4 });
          res.status(201).json({ message: 'Doctor account created successfully', userID: newUserID, doctorID: resultDoctor.insertId });
        });
      });
    });
  });
});

// ================= NEWS =================

// GET /admin/news
router.get('/news', verifyToken, isAdmin, (req, res) => {
  db.query('SELECT * FROM news', (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    res.json(results);
  });
});

// POST /admin/news
router.post('/news', verifyToken, isAdmin, upload.single('image'), (req, res) => {
  const { title, body, date, author } = req.body;

  if (!title) return res.status(400).json({ message: 'Title is required' });

  let imagePath = null;
  if (req.file) {
    imagePath = `/uploads/news/${req.file.filename}`;
  } else if (req.body.image) {
    imagePath = req.body.image;
  }

  const sql = `INSERT INTO news (title, body, date, author, image) VALUES (?, ?, ?, ?, ?)`;
  db.query(sql, [title, body || null, date || new Date(), author || null, imagePath], (err, result) => {
    if (err) return res.status(500).json({ message: 'Insert news failed', error: err });
    res.status(201).json({ message: 'News created successfully', newID: result.insertId, image: imagePath });
  });
});

// PUT /admin/news/:id
router.put('/news/:id', verifyToken, isAdmin, (req, res) => {
  const newID = req.params.id;
  const { title, body, date, author, image, isActive } = req.body;

  const sql = `UPDATE news SET title=?, body=?, date=?, author=?, image=?, isActive=? WHERE newID=?`;
  db.query(sql, [title, body, date, author, image, isActive, newID], (err, result) => {
    if (err) return res.status(500).json({ message: 'Update news failed', error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'News not found' });
    res.json({ message: 'News updated successfully' });
  });
});

// DELETE /admin/news/:id
router.delete('/news/:id', verifyToken, isAdmin, (req, res) => {
  const newID = req.params.id;
  db.query('DELETE FROM news WHERE newID = ?', [newID], (err, result) => {
    if (err) return res.status(500).json({ message: 'Delete news failed', error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'News not found' });
    res.json({ message: 'News deleted successfully' });
  });
});

// PUT /admin/news/:newID/status
router.put('/news/:newID/status', verifyToken, isAdmin, (req, res) => {
  const newID = parseInt(req.params.newID, 10);
  const { isActive } = req.body;

  if (isNaN(newID) || (isActive !== 0 && isActive !== 1))
    return res.status(400).json({ message: 'Invalid input' });

  db.query('UPDATE news SET isActive = ? WHERE newID = ?', [isActive, newID], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'News not found' });
    res.json({ message: 'News status updated', newID, isActive });
  });
});

// ================= MEDICINES =================

// GET /admin/medicines
router.get('/medicines', (req, res) => {
  db.query('SELECT * FROM medicines ORDER BY medicineName', (err, results) => {
    if (err) return res.status(500).json({ message: 'Failed to load medicines' });
    res.json(results);
  });
});

// POST /admin/medicines
router.post('/medicines', (req, res) => {
  const { medicineName, genericName, dosageForm, strength, description } = req.body;
  if (!medicineName) return res.status(400).json({ message: 'Medicine name required' });

  db.query(
    'INSERT INTO medicines (medicineName, genericName, dosageForm, strength, description) VALUES (?,?,?,?,?)',
    [medicineName, genericName, dosageForm, strength, description],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Create failed' });
      res.json({ message: 'Medicine created', medicineID: result.insertId });
    }
  );
});

// PUT /admin/medicines/:id
router.put('/medicines/:id', (req, res) => {
  const id = req.params.id;
  const { isActive } = req.body;
  db.query('UPDATE medicines SET isActive=? WHERE medicineID=?', [isActive, id], (err) => {
    if (err) return res.status(500).json({ message: 'Update failed' });
    res.json({ message: 'Status updated' });
  });
});

// ================= IMAGE UPLOAD =================

// POST /upload/image
router.post('/upload/image', verifyToken, isAdmin, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  res.json({ filePath: `/uploads/news/${req.file.filename}` });
});

module.exports = router;
