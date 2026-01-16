const mysql = require('mysql2/promise');
const fs = require('fs');

async function main() {
    try {
        const db = await mysql.createConnection({
            host: '127.0.0.1', user: 'root', password: '', database: 'rumah_jurnal'
        });
        const [users] = await db.query("SELECT email, role FROM users");
        const [submissions] = await db.query("SELECT id, title FROM submissions");

        const output = `Users: ${JSON.stringify(users)}\nSubmissions: ${JSON.stringify(submissions)}`;
        fs.writeFileSync('verification_data.txt', output);
        await db.end();
    } catch (e) {
        fs.writeFileSync('verification_data.txt', `Error: ${e.message}`);
    }
}
main();
