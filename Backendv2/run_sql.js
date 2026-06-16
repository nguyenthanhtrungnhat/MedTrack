const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

async function runSQLFile(connection, filePath) {
    const sql = fs.readFileSync(filePath, 'utf8');
    // Split by semicolons, but this is a bit dangerous if there are semicolons inside strings
    // A better approach is to use the multipleStatements: true option in the connection pool.
    await connection.query(sql);
    console.log(`Executed: ${filePath}`);
}

async function main() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            multipleStatements: true
        });

        console.log("Connected to MySQL.");

        // First execute final.sql (which has DROP DATABASE IF EXISTS hospitaldb)
        await runSQLFile(connection, path.join(__dirname, '../sql/final.sql'));
        
        // Ensure we switch to hospitaldb
        await connection.query('USE hospitaldb');

        // Then execute insert.sql
        await runSQLFile(connection, path.join(__dirname, '../sql/insert.sql'));

        console.log("Database successfully updated.");
        process.exit(0);
    } catch (err) {
        console.error("Failed to update database:", err);
        process.exit(1);
    }
}

main();
