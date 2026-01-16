import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute(
            'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
        );
        connection.release();

        return NextResponse.json(rows);
    } catch (error) {
        console.error('Fetch users error:', error);
        return NextResponse.json(
            { error: 'Gagal mengambil data pengguna' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const { name, email, password, role } = await request.json();

        if (!name || !email || !password || !role) {
            return NextResponse.json(
                { error: 'Semua field (nama, email, password, role) wajib diisi' },
                { status: 400 }
            );
        }

        const connection = await pool.getConnection();

        // Check existing
        const [existing] = await connection.execute(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if ((existing as any[]).length > 0) {
            connection.release();
            return NextResponse.json(
                { error: 'Email sudah terdaftar' },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await connection.execute(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, role]
        );

        connection.release();

        return NextResponse.json(
            { message: 'Pengguna berhasil ditambahkan' },
            { status: 201 }
        );
    } catch (error) {
        console.error('Create user error:', error);
        return NextResponse.json(
            { error: 'Gagal membuat pengguna' },
            { status: 500 }
        );
    }
}
