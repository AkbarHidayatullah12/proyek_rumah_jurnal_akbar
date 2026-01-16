import pool from '@/lib/db';

export async function logActivity(
    userId: number | undefined,
    userName: string,
    role: string,
    action: string,
    details: string
) {
    try {
        const connection = await pool.getConnection();
        await connection.execute(
            'INSERT INTO activity_logs (user_id, user_name, role, action, details) VALUES (?, ?, ?, ?, ?)',
            [userId || null, userName, role, action, details]
        );
        connection.release();
    } catch (error) {
        console.error('Failed to log activity:', error);
        // Don't throw error to prevent blocking the main action
    }
}
