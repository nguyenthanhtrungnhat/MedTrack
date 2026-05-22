const db = require('../config/db');

// Fetch all rows from a table
const getAllRecords = (tableName, res) => {
  db.query(`SELECT * FROM ${tableName}`, (err, results) => {
    if (err) return res.status(500).send({ error: 'Failed to retrieve records from ' + tableName });
    res.status(200).json(results);
  });
};

// Fetch all rows with JOIN to user table
const getAllRecordsWithUser = (tableName, res) => {
  const query = `
    SELECT 
      n.*, 
      u.userID, u.username, u.fullName, u.dob,
      u.phone, u.email, u.CIC, u.address, u.gender
    FROM ${tableName} n
    JOIN user u ON n.userID = u.userID
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).send({ error: 'Failed to retrieve records from ' + tableName });
    res.status(200).json(results);
  });
};

module.exports = { getAllRecords, getAllRecordsWithUser };
