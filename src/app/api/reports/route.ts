import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const year = searchParams.get('year');

        const connection = await pool.getConnection();

        // 1. Total Users (Users are usually all-time, or we could filter by created_at if needed. 
        // For now, let's keep users as global stats, but filter submissions strictly.)
        let userStats = { total: 0, authors: 0, editors: 0 };
        try {
            const [userRows] = await connection.execute(
                `SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN role = 'author' THEN 1 ELSE 0 END) as authors,
            SUM(CASE WHEN role = 'editor' THEN 1 ELSE 0 END) as editors
           FROM users`
            );
            const res = (userRows as any[])[0];
            userStats = {
                total: res.total || 0,
                authors: res.authors || 0,
                editors: res.editors || 0
            };
        } catch (e) { }

        // 2. Submissions Stats with Year Filter
        let whereClause = '';
        const params: any[] = [];

        if (year) {
            whereClause = 'WHERE YEAR(date) = ?';
            params.push(year);
        }

        const [submissionRows] = await connection.execute(
            `SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status IN ('Menunggu Validasi', 'Menunggu', 'Review', 'Sedang Direview') THEN 1 ELSE 0 END) as waiting,
        SUM(CASE WHEN status = 'Revisi' THEN 1 ELSE 0 END) as revision,
        SUM(CASE WHEN status IN ('Disetujui', 'Ditetapkan', 'Selesai') THEN 1 ELSE 0 END) as approved,
        SUM(CASE WHEN status = 'Draft' THEN 1 ELSE 0 END) as draft
       FROM submissions ${whereClause}`,
            params
        );
        const subStats = (submissionRows as any[])[0];

        // 3. Recent Submissions (Last 5) - also filtered by year if selected
        const [recentRows] = await connection.execute(
            `SELECT id, title, date, status 
       FROM submissions
       ${whereClause}
       ORDER BY date DESC 
       LIMIT 5`,
            params
        );

        // Map recent rows
        const recent = (recentRows as any[]).map(row => ({
            id: String(row.id),
            title: row.title,
            date: row.date,
            status: row.status,
            author_name: 'Author'
        }));

        connection.release();

        return NextResponse.json({
            users: userStats,
            submissions: {
                total: subStats.total || 0,
                waiting: subStats.waiting || 0,
                revision: subStats.revision || 0,
                approved: subStats.approved || 0,
                draft: subStats.draft || 0
            },
            recent: recent
        });

    } catch (error) {
        console.error('Fetch reports error:', error);
        return NextResponse.json(
            { error: 'Gagal mengambil data laporan' },
            { status: 500 }
        );
    }
}
