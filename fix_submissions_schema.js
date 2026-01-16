const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function main() {
    console.log("Fixing submissions schema...");

    const db = await mysql.createConnection({
        host: '127.0.0.1', user: 'root', password: '', database: 'rumah_jurnal'
    });

    // 1. Drop existing table to clear bad schema/data
    await db.query("DROP TABLE IF EXISTS submissions");
    console.log("Dropped submissions table.");

    // 2. Create Table with INT AUTO_INCREMENT
    await db.query(`
      CREATE TABLE IF NOT EXISTS submissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
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
    console.log("Created submissions table (INT AUTO_INCREMENT).");

    // 3. Seed Data
    const [authorRows] = await db.query('SELECT id FROM users WHERE role = "author" LIMIT 1');
    const authorId = authorRows[0]?.id;

    if (authorId) {
        const submissionSeeds = [
            { title: 'Analisis Dampak AI terhadap Pendidikan', date: '2025-01-10', status: 'Menunggu Validasi', author_id: authorId },
            { title: 'Implementasi IoT pada Pertanian Modern', date: '2025-01-12', status: 'Revisi', author_id: authorId },
        ];
        for (const sub of submissionSeeds) {
            await db.query(
                'INSERT INTO submissions (title, date, status, author_id) VALUES (?, ?, ?, ?)',
                [sub.title, sub.date, sub.status, sub.author_id]
            );
        }
        console.log("Seeded sample submissions.");
    }

    // 4. Update init-db/route.ts to match (This script doesn't edit the file, but sets the standard)

    await db.end();
}

main().catch(err => {
    console.error("Error:", err);
});
