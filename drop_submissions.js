const mysql = require('mysql2/promise');

async function dropAndRepopulate() {
    console.log("Dropping submissions table to reset schema...");
    const db = await mysql.createConnection({
        host: '127.0.0.1', user: 'root', password: '', database: 'rumah_jurnal'
    });

    await db.query("DROP TABLE IF EXISTS submissions");
    console.log("Table dropped.");
    await db.end();
}
dropAndRepopulate();
