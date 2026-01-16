const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function main() {
    console.log("Starting database reconstruction...");

    // 1. Connect to MySQL server (no database selected)
    const serverConnection = await mysql.createConnection({
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: '',
    });

    console.log("Connected to MySQL server.");

    // 2. Create Database
    await serverConnection.query("CREATE DATABASE IF NOT EXISTS rumah_jurnal");
    console.log("Database 'rumah_jurnal' verified.");

    await serverConnection.end();

    // 3. Connect to the database
    const db = await mysql.createConnection({
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: '',
        database: 'rumah_jurnal'
    });

    console.log("Connected to 'rumah_jurnal' database.");

    // 4. Create Tables
    // Users table with ALL columns
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        institution VARCHAR(255),
        phone VARCHAR(50),
        sinta_id VARCHAR(50),
        scopus_id VARCHAR(50),
        orcid_id VARCHAR(50),
        google_scholar_id VARCHAR(255),
        avatar VARCHAR(500),
        reset_token VARCHAR(255),
        reset_token_expiry DATETIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log("Table 'users' verified.");

    // Activity Logs
    await db.query(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        user_name VARCHAR(255),
        role VARCHAR(50),
        action VARCHAR(50) NOT NULL,
        details TEXT,
        ip_address VARCHAR(45),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);
    console.log("Table 'activity_logs' verified.");

    // Submissions
    await db.query(`
      CREATE TABLE IF NOT EXISTS submissions (
        id VARCHAR(50) PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        date DATE NOT NULL,
        status VARCHAR(50) NOT NULL,
        author_id INT,
        revision_notes TEXT,
        file_url VARCHAR(500),
        loa_file_url VARCHAR(500),
        journal_id VARCHAR(100),
        journal_volume VARCHAR(100),
        abstract TEXT,
        keywords VARCHAR(500),
        category VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);
    console.log("Table 'submissions' verified.");

    // 5. Seed Users
    const seeds = [
        { email: 'admin@gmail.com', password: '123456', name: 'Admin', role: 'admin' },
        { email: 'author@gmail.com', password: '123456', name: 'Dr. Ahmad Sudrajat', role: 'author' },
        { email: 'editor@gmail.com', password: '123456', name: 'Editor Team', role: 'editor' },
    ];

    for (const s of seeds) {
        const [rows] = await db.query('SELECT id FROM users WHERE email = ?', [s.email]);
        if (rows.length === 0) {
            const hash = await bcrypt.hash(s.password, 10);
            await db.query(
                'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
                [s.email, hash, s.name, s.role]
            );
            console.log(`Seeded user: ${s.email}`);
        } else {
            console.log(`User already exists: ${s.email}`);
        }
    }

    // 6. Seed Submissions
    const [subRows] = await db.query('SELECT COUNT(*) as count FROM submissions');
    const subCount = subRows[0].count;

    if (subCount == 0) {
        const [authorRows] = await db.query('SELECT id FROM users WHERE role = "author" LIMIT 1');
        const authorId = authorRows[0]?.id;

        if (authorId) {
            const submissionSeeds = [
                { id: 'SUB-001', title: 'Analisis Dampak AI terhadap Pendidikan', date: '2025-01-10', status: 'waiting', author_id: authorId },
                { id: 'SUB-002', title: 'Implementasi IoT pada Pertanian Modern', date: '2025-01-12', status: 'revision', author_id: authorId },
            ];
            for (const sub of submissionSeeds) {
                await db.query(
                    'INSERT INTO submissions (id, title, date, status, author_id) VALUES (?, ?, ?, ?, ?)',
                    [sub.id, sub.title, sub.date, sub.status, sub.author_id]
                );
            }
            console.log("Seeded sample submissions.");
        }
    }

    console.log("Database reconstruction complete!");
    await db.end();
}

main().catch((err) => {
    console.error("Error:", err);
    process.exit(1);
});
