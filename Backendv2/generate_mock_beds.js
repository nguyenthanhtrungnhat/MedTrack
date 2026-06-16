const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

async function run() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'medtrack'
    });

    try {
        console.log("Checking departments...");
        const [depts] = await connection.query("SELECT * FROM department");
        // Ensure we have 3 departments
        if (depts.length < 3) {
            console.log("Adding missing departments...");
            await connection.query("INSERT IGNORE INTO department (departmentID, departmentName, description) VALUES (1, 'Cardiology', 'Heart department'), (2, 'Neurology', 'Brain department'), (3, 'Orthopedics', 'Bone department')");
        }

        console.log("Ensuring 3 rooms per department and 6 beds per room...");
        for (let d = 1; d <= 3; d++) {
            for (let r = 1; r <= 3; r++) {
                const roomName = `Room ${d}0${r}`;
                // Insert room
                await connection.query("INSERT IGNORE INTO room (location, departmentID) VALUES (?, ?)", [roomName, d]);
                const [rooms] = await connection.query("SELECT roomID FROM room WHERE location = ? AND departmentID = ?", [roomName, d]);
                if (rooms.length > 0) {
                    const roomID = rooms[0].roomID;
                    // Insert beds
                    for (let b = 1; b <= 6; b++) {
                        const bedNumber = `B${b}`;
                        await connection.query("INSERT IGNORE INTO bed (roomID, bedNumber, status) VALUES (?, ?, 'Empty')", [roomID, bedNumber]);
                    }
                }
            }
        }
        console.log("Data generation complete.");
    } catch (e) {
        console.error(e);
    } finally {
        await connection.end();
    }
}
run();
