import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const connection = await pool.getConnection();

    await connection.execute(`
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

    // Create Activity Logs Table
    await connection.execute(`
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

    // Ensure submissions table exists
    await connection.execute(`
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

    // Migration for existing tables: Add revision_notes if not exists
    try {
      await connection.execute(`ALTER TABLE submissions ADD COLUMN IF NOT EXISTS revision_notes TEXT`);
    } catch (e) {
      // Ignore
    }

    // Migration: Add loa_file_url
    try {
      await connection.execute(`ALTER TABLE submissions ADD COLUMN IF NOT EXISTS loa_file_url VARCHAR(500)`);
    } catch (e) {
      // Ignore
    }

    // CRITICAL FIX: Ensure author_id exists
    try {
      await connection.execute(`ALTER TABLE submissions ADD COLUMN IF NOT EXISTS author_id INT`);

      // DATA CLEANUP: Backfill NULL author_ids with the first found author
      // This fixes the issue where old submissions don't show up on dashboard
      await connection.execute(`
            UPDATE submissions 
            SET author_id = (SELECT id FROM users WHERE role = 'author' LIMIT 1) 
            WHERE author_id IS NULL
        `);

    } catch (e) {
      console.log('author_id migration note:', e);
    }

    // Migration for Users table (Profile fields)
    const userCols = [
      'institution VARCHAR(255)',
      'phone VARCHAR(50)',
      'sinta_id VARCHAR(50)',
      'scopus_id VARCHAR(50)',
      'orcid_id VARCHAR(50)',
      'google_scholar_id VARCHAR(255)',
      'avatar VARCHAR(500)'
    ];

    for (const col of userCols) {
      try {
        await connection.execute(`ALTER TABLE users ADD COLUMN IF NOT EXISTS ${col}`);
      } catch (e) {
        try {
          // Fallback for older MySQL/MariaDB
          await connection.execute(`ALTER TABLE users ADD COLUMN ${col}`);
        } catch (ex) { /* Column likely exists */ }
      }
    }

    // --- Seeding Logic (simplified) ---
    // 1. Users
    const seeds = [
      { email: 'admin@gmail.com', password: '123456', name: 'Admin', role: 'admin' },
      { email: 'author@gmail.com', password: '123456', name: 'Dr. Ahmad Sudrajat', role: 'author' },
      { email: 'editor@gmail.com', password: '123456', name: 'Editor Team', role: 'editor' },
    ];

    for (const s of seeds) {
      const [rows] = await connection.execute('SELECT id FROM users WHERE LOWER(email) = LOWER(?)', [s.email]);
      if ((rows as any[]).length === 0) {
        const hashedPassword = await bcrypt.hash(s.password, 10);
        await connection.execute(
          'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
          [s.email, hashedPassword, s.name, s.role]
        );
      }
    }

    // 2. Submissions (Wrapped safely)
    try {
      const [subRows] = await connection.execute('SELECT COUNT(*) as count FROM submissions');
      const subCount = (subRows as any[])[0].count; // mysql2 normally returns numbers here

      if (subCount == 0) {
        const [authorRows] = await connection.execute('SELECT id FROM users WHERE role = "author" LIMIT 1');
        const authorId = (authorRows as any[])[0]?.id; // Fixed access

        if (authorId) {
          const submissionSeeds = [
            { title: 'Analisis Dampak AI terhadap Pendidikan', date: '2025-01-10', status: 'waiting', author_id: authorId },
            { title: 'Implementasi IoT pada Pertanian Modern', date: '2025-01-12', status: 'revision', author_id: authorId },
          ];
          for (const sub of submissionSeeds) {
            await connection.execute(
              'INSERT INTO submissions (title, date, status, author_id) VALUES (?, ?, ?, ?)',
              [sub.title, sub.date, sub.status, sub.author_id]
            );
          }
        }
      }
    } catch (err) {
      console.error('Seeding submissions failed:', err);
    }

    connection.release();

    return NextResponse.json({ message: 'Database initialized successfully' });
  } catch (error: any) {
    console.error('Database initialization error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to initialize database' },
      { status: 500 }
    );
  }
}
