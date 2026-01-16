import pool from '@/lib/db';
import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { logActivity } from '@/lib/activity';
import { getUserFromRequest } from '@/lib/auth-server';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
    const perPage = Math.max(1, parseInt(url.searchParams.get('perPage') || '6'));
    const status = url.searchParams.get('status') || '';
    const q = (url.searchParams.get('q') || '').trim();

    const offset = (page - 1) * perPage;

    // Try to read from DB; if table not present, fall back to seeded sample data
    const connection = await pool.getConnection();

    // Check if table exists
    const [tables] = await connection.execute(`
      SELECT 1 FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'submissions' LIMIT 1
    `);

    const hasTable = Array.isArray(tables) && (tables as any[]).length > 0;

    if (hasTable) {
      // Build WHERE clauses
      const where: string[] = [];
      const params: Array<string | number> = [];
      if (status) {
        where.push('status = ?');
        params.push(status);
      }
      if (q) {
        where.push('LOWER(title) LIKE ?');
        params.push(`%${q.toLowerCase()}%`);
      }

      const whereSQL = where.length ? 'WHERE ' + where.join(' AND ') : '';

      // total count
      const [countRows] = await connection.execute(
        `SELECT COUNT(*) as cnt FROM submissions ${whereSQL}`,
        params
      );
      const total = (countRows as any[])[0].cnt || 0;

      // fetch items
      const [rows] = await connection.execute(
        `SELECT id, title, DATE_FORMAT(date, '%d %b %Y') as date, status, revision_notes FROM submissions ${whereSQL} ORDER BY date DESC LIMIT ? OFFSET ?`,
        [...params, perPage, offset]
      );

      connection.release();

      return NextResponse.json({ total, items: rows }, { status: 200 });
    }

    // fallback sample data
    const sample = [
      { id: '001', title: 'Pengajuan LOA Acara Workshop Digital Marketing', date: '08 Nov 2024', status: 'Menunggu Validasi' },
      { id: '002', title: 'Kolaborasi Penelitian: Pendidikan Inklusif', date: '02 Oct 2024', status: 'Revisi' },
      { id: '003', title: 'Seminar Nasional Kewirausahaan', date: '15 Sep 2024', status: 'Disetujui' },
      { id: '004', title: 'Rancangan Modul Pembelajaran Online', date: '22 Aug 2024', status: 'Draft' },
      { id: '005', title: 'Pengabdian Masyarakat - Pendidikan Anak', date: '12 Jul 2024', status: 'Menunggu Validasi' },
      { id: '006', title: 'Workshop Penulisan Jurnal untuk Dosen', date: '05 Jun 2024', status: 'Disetujui' },
      { id: '007', title: 'Pengembangan E-Learning', date: '20 May 2024', status: 'Draft' },
    ];

    let filtered = sample.slice();
    if (status) filtered = filtered.filter((s) => s.status === status);
    if (q) filtered = filtered.filter((s) => s.title.toLowerCase().includes(q.toLowerCase()));

    const total = filtered.length;
    const items = filtered.slice(offset, offset + perPage);

    return NextResponse.json({ total, items }, { status: 200 });
  } catch (error) {
    console.error('submissions GET error', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unexpected error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const journalId = formData.get('journalId') as string;
    const journalVolume = formData.get('journalVolume') as string;
    const title = formData.get('title') as string;
    const abstract = formData.get('abstract') as string;
    const keywords = formData.get('keywords') as string;
    const category = formData.get('category') as string;

    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 });
    }

    // save file to public/uploads
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure uploads directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {
      // ignore if exists
    }

    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/${fileName}`;

    const connection = await pool.getConnection();

    try {
      // Helper function to create table
      const createTable = async () => {
        await connection.execute(`
          CREATE TABLE IF NOT EXISTS submissions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            journal_id VARCHAR(50),
            journal_volume VARCHAR(100),
            title VARCHAR(255),
            abstract TEXT,
            keywords VARCHAR(255),
            category VARCHAR(50),
            file_url VARCHAR(255),
            status VARCHAR(50) DEFAULT 'Menunggu Validasi',
            date DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);
      };

      try {
        await createTable();
        const user = getUserFromRequest(req);
        const authorId = user?.id || null; // Fallback if auth fails (shouldn't if protected)

        await connection.execute(
          `INSERT INTO submissions (journal_id, journal_volume, title, abstract, keywords, category, file_url, status, author_id)
           VALUES (?, ?, ?, ?, ?, ?, ?, 'Menunggu Validasi', ?)`,
          [journalId, journalVolume, title, abstract, keywords, category, fileUrl, authorId]
        );
      } catch (err: any) {
        // Check for specific MySQL error "doesn't exist in engine" (Errcode: 1932)
        if (err.message?.includes("doesn't exist in engine") || err.code === 1932) {
          console.warn('Table corruption detected, attempting to recreate...');
          await connection.execute(`DROP TABLE IF EXISTS submissions`);
          await createTable();
          // Retry insert
          const user = getUserFromRequest(req);
          const authorId = user?.id || null;

          await connection.execute(
            `INSERT INTO submissions (journal_id, journal_volume, title, abstract, keywords, category, file_url, status, author_id)
             VALUES (?, ?, ?, ?, ?, ?, ?, 'Menunggu Validasi', ?)`,
            [journalId, journalVolume, title, abstract, keywords, category, fileUrl, authorId]
          );
        } else {
          throw err;
        }
      }
    } finally {
      connection.release();
    }

    // ... (after insertion)

    // Log Activity
    const user = getUserFromRequest(req);
    await logActivity(
      user?.id,
      user?.name || 'Unknown',
      user?.role || 'unknown',
      'SUBMIT',
      `New submission: ${title}`
    );

    return NextResponse.json({ success: true, message: 'Submission created successfully' });

  } catch (error) {
    console.error('submissions POST error', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unexpected error' }, { status: 500 });
  }
}
