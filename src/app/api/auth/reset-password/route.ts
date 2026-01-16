import pool from '@/lib/db';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        const { token, newPassword } = await req.json();

        if (!token || !newPassword) {
            return NextResponse.json({ error: 'Token and new password are required' }, { status: 400 });
        }

        const connection = await pool.getConnection();

        // 1. Find user by token and check expiry
        const [rows] = await connection.execute(
            'SELECT id FROM users WHERE reset_token = ? AND reset_token_expiry > NOW()',
            [token]
        );

        if ((rows as any[]).length === 0) {
            connection.release();
            return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
        }

        const userId = (rows as any[])[0].id;

        // 2. Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // 3. Update password and clear token
        await connection.execute(
            'UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?',
            [hashedPassword, userId]
        );

        connection.release();

        return NextResponse.json({ message: 'Password updated successfully' });

    } catch (error) {
        console.error('Reset Password API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
