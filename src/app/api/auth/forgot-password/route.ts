import pool from '@/lib/db';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const connection = await pool.getConnection();

        // 1. Check if user exists
        const [rows] = await connection.execute('SELECT id FROM users WHERE email = ?', [email]);

        if ((rows as any[]).length === 0) {
            connection.release();
            // Return success even if email not found to prevent enumeration
            return NextResponse.json({ message: 'If that email exists, we sent a link.' });
        }

        // 2. Generate Token
        const token = crypto.randomBytes(32).toString('hex');
        const expiry = new Date(Date.now() + 3600000); // 1 hour

        // 3. Save to DB
        await connection.execute(
            'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?',
            [token, expiry, email]
        );
        connection.release();

        // 4. "Send" Email (Log to Console)
        // In production, use nodemailer here.
        const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/reset-password?token=${token}`;

        console.log('===========================================================');
        console.log('                 RESET PASSWORD LINK                       ');
        console.log('===========================================================');
        console.log(`Email: ${email}`);
        console.log(`Link : ${resetLink}`);
        console.log('===========================================================');

        return NextResponse.json({ message: 'Reset link sent to console.' });

    } catch (error) {
        console.error('Forgot Password API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
