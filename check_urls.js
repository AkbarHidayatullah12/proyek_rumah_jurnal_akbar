const mysql = require('mysql2/promise');

async function checkSubmissions() {
    try {
        const db = await mysql.createConnection({
            host: '127.0.0.1', user: 'root', password: '', database: 'rumah_jurnal'
        });

        const [rows] = await db.query("SELECT id, title FROM submissions");
        const fs = require('fs');

        let output = "Submissions URLs should be:\n";
        rows.forEach(r => output += `/editor/submission/${r.id}\n`);
        fs.writeFileSync('urls.txt', output);

        await db.end();
    } catch (e) {
        const fs = require('fs');
        fs.writeFileSync('urls.txt', "Error: " + e.message);
    }
}
checkSubmissions();
