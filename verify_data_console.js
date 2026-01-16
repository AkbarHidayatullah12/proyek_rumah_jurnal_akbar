const mysql = require('mysql2/promise');

async function main() {
    try {
        const db = await mysql.createConnection({
            host: '127.0.0.1', user: 'root', password: '', database: 'rumah_jurnal'
        });
        const [users] = await db.query("SELECT email, role FROM users");
        const [submissions] = await db.query("SELECT id, title FROM submissions");

        console.log("Users:", JSON.stringify(users, null, 2));
        console.log("Submissions:", JSON.stringify(submissions, null, 2));

        await db.end();
    } catch (e) {
        console.error("Error:", e);
    }
}
main();
