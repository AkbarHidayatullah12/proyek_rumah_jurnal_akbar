const mysql = require('mysql2/promise');
const fs = require('fs');

async function main() {
    try {
        const db = await mysql.createConnection({
            host: '127.0.0.1', user: 'root', password: '', database: 'rumah_jurnal'
        });
        const [rows] = await db.query("SHOW TABLES");
        fs.writeFileSync('verification.txt', `Success. Tables: ${JSON.stringify(rows)}`);
        await db.end();
    } catch (e) {
        // If DB doesn't exist, this will verify that repopulate didn't run
        fs.writeFileSync('verification.txt', `Error: ${e.message}`);
    }
}
main();
