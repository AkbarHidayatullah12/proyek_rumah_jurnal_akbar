import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const limit = parseInt(url.searchParams.get('limit') || '50');

        // In a real app, we should verify Admin role here via token

        const connection = await pool.getConnection();

        // Check if table exists first (to avoid 500 if running before init)
        const [tables] = await connection.execute(`
      SELECT 1 FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'activity_logs' LIMIT 1
    `);

        if (!Array.isArray(tables) || (tables as any[]).length === 0) {
            connection.release();
            return NextResponse.json({ logs: [] });
        }

        const [rows] = await connection.execute(
            'SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT ?',
            [limit]
        );

        connection.release();

        return NextResponse.json({ logs: rows }, { status: 200 });

    } catch (error) {
        console.error('Logs API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
    }
}
