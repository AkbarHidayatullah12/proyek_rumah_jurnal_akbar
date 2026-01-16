const mysql = require('mysql2/promise');
const fs = require('fs');

async function debugSubId3() {
    try {
        const db = await mysql.createConnection({
            host: '127.0.0.1', user: 'root', password: '', database: 'rumah_jurnal'
        });

        const [rows] = await db.query("SELECT id, title, author_id FROM submissions WHERE id = 3");
        console.log("Submission 3:", rows);

        if (rows.length > 0) {
            const authorId = rows[0].author_id;
            console.log("Author ID:", authorId);
            if (authorId) {
                const [uRows] = await db.query("SELECT * FROM users WHERE id = ?", [authorId]);
                console.log("Author User:", uRows);
            } else {
                console.log("Author ID is NULL/Empty");
            }
        }

        await db.end();
    } catch (e) {
        console.error("Error:", e);
    }
}
debugSubId3();
