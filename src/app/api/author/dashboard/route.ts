import pool from '@/lib/db';
import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth-server';

export async function GET(req: Request) {
    try {
        const user = getUserFromRequest(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const connection = await pool.getConnection();

        // 1. Get Stats Counts
        // Returns counts grouped by status
        const [statsRows] = await connection.execute(
            `SELECT status, COUNT(*) as count 
             FROM submissions 
             WHERE author_id = ? 
             GROUP BY status`,
            [user.id]
        );

        // Process stats into a cleaner object
        const statsMap: Record<string, number> = {
            'Menunggu Validasi': 0,
            'Review': 0,
            'Revisi': 0,
            'Disetujui': 0,
            'Ditolak': 0,
            'Dibatalkan': 0
        };

        (statsRows as any[]).forEach((row: any) => {
            if (statsMap.hasOwnProperty(row.status)) {
                statsMap[row.status] = row.count;
            }
        });

        // 2. Get Recent Submissions (Limit 5)
        const [recentRows] = await connection.execute(
            `SELECT id, title, DATE_FORMAT(date, '%d %b %Y') as date, status 
             FROM submissions 
             WHERE author_id = ? 
             ORDER BY date DESC 
             LIMIT 5`,
            [user.id]
        );

        connection.release();

        return NextResponse.json({
            stats: statsMap,
            recent: recentRows
        });

    } catch (error) {
        console.error('Author Dashboard API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
