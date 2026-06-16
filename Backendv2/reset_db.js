const fs = require('fs');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: 'JWT.env' });
require('dotenv').config();

async function resetDB() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        multipleStatements: true
    });

    try {
        console.log("Dropping hospitaldb...");
        await connection.query("DROP DATABASE IF EXISTS hospitaldb;");
        console.log("Creating hospitaldb...");
        await connection.query("CREATE DATABASE hospitaldb;");
        await connection.query("USE hospitaldb;");

        console.log("Reading final.sql...");
        const finalSql = fs.readFileSync('../sql/final.sql', 'utf8');
        console.log("Executing final.sql...");
        await connection.query(finalSql);

        console.log("Reading insert.sql...");
        const insertSql = fs.readFileSync('../sql/insert.sql', 'utf8');
        console.log("Executing insert.sql...");
        await connection.query(insertSql);

        console.log("Database successfully reset!");
    } catch (err) {
        console.error("Error resetting database:", err);
    } finally {
        await connection.end();
    }
}

resetDB();
