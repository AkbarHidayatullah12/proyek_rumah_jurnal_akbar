const mysql = require('mysql2/promise');

async function debugSubmissions() {
    try {
        const db = await mysql.createConnection({
            host: '127.0.0.1', user: 'root', password: '', database: 'rumah_jurnal'
        });

        // 1. Check Table Info
        const [columns] = await db.query("SHOW COLUMNS FROM submissions");
        console.log("--- TABLE STRUCTURE ---");
        console.log(columns.map(c => `${c.Field} (${c.Type})`).join('\n'));

        // 2. Check Data
        const [rows] = await db.query("SELECT id, title, date, status FROM submissions");
        console.log("\n--- DATA ---");
        console.log(JSON.stringify(rows, null, 2));

        await db.end();
    } catch (e) {
        console.error("Error:", e);
    }
}
debugSubmissions();
