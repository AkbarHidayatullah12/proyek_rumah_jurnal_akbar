const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const fs = require('fs');

async function fix() {
    try {
        const db = await mysql.createConnection({
            host: '127.0.0.1', user: 'root', password: '', database: 'rumah_jurnal'
        });

        // 1. Check if user exists
        const [rows] = await db.query("SELECT * FROM users WHERE email = 'editor@gmail.com'");
        let log = `User found: ${rows.length}\n`;

        // 2. Force update password
        const newHash = await bcrypt.hash('123456', 10);
        await db.query("DELETE FROM users WHERE email = 'editor@gmail.com'");
        await db.query("INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)",
            ['editor@gmail.com', newHash, 'Editor Team', 'editor']
        );
        log += "Re-inserted editor user with fresh hash.\n";

        // 3. Verify
        const isMatch = await bcrypt.compare('123456', newHash);
        log += `Immediate verification match: ${isMatch}\n`;

        fs.writeFileSync('fix_log.txt', log);
        await db.end();
    } catch (e) {
        fs.writeFileSync('fix_log.txt', `Error: ${e.message}`);
    }
}
fix();
