const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const fs = require('fs');

async function fixAll() {
    let log = '';
    const db = await mysql.createConnection({
        host: '127.0.0.1', user: 'root', password: '', database: 'rumah_jurnal'
    });

    const seeds = [
        { email: 'admin@gmail.com', password: '123456', name: 'Admin', role: 'admin' },
        { email: 'author@gmail.com', password: '123456', name: 'Dr. Ahmad Sudrajat', role: 'author' }
    ];

    for (const s of seeds) {
        const [rows] = await db.query('SELECT id FROM users WHERE email = ?', [s.email]);
        if (rows.length === 0) {
            log += `Missing ${s.email}, inserting... `;
            const hash = await bcrypt.hash(s.password, 10);
            await db.query(
                'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
                [s.email, hash, s.name, s.role]
            );
            log += "Done.\n";
        } else {
            log += `${s.email} exists.\n`;
        }
    }

    fs.writeFileSync('fix_all_log.txt', log);
    await db.end();
}
fixAll();
