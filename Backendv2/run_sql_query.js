const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

async function queryData() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'medtrack'
    });

    try {
        const query = process.argv[2];
        if (!query) throw new Error("No query provided!");
        const [rows] = await connection.query(query);
        console.table(rows);
    } catch (e) {
        console.error("DB Error:", e);
    } finally {
        await connection.end();
    }
}
queryData();
