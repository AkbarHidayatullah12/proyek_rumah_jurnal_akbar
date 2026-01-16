const mysql = require('mysql2/promise');

async function fixSub3() {
    try {
        const db = await mysql.createConnection({
            host: '127.0.0.1', user: 'root', password: '', database: 'rumah_jurnal'
        });

        // Find an author ID (e.g. from author@gmail.com)
        const [rows] = await db.query("SELECT id FROM users WHERE role = 'author' LIMIT 1");
        const authorId = rows[0]?.id;

        if (authorId) {
            console.log(`Fixing submission 3 with author_id: ${authorId}`);
            await db.query("UPDATE submissions SET author_id = ? WHERE id = 3", [authorId]);
            console.log("Done.");
        } else {
            console.log("No author found to assign.");
        }

        await db.end();
    } catch (e) {
        console.error("Error:", e);
    }
}
fixSub3();
