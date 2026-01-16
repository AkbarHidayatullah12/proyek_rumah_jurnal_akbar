const mysql = require('mysql2/promise');
const fs = require('fs');

async function debugSubmissions() {
    try {
        const db = await mysql.createConnection({
            host: '127.0.0.1', user: 'root', password: '', database: 'rumah_jurnal'
        });

        const [rows] = await db.query("SELECT id, title, date, status FROM submissions");
        const output = JSON.stringify(rows, null, 2);
        console.log("Submissions Data:", output);
        fs.writeFileSync('debug_ids_v2.txt', output);

        await db.end();
    } catch (e) {
        console.error("Error:", e);
        fs.writeFileSync('debug_ids_v2.txt', `Error: ${e.message}`);

    }
}
debugSubmissions();
