import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { name, email, role, password } = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'ID tidak valid' }, { status: 400 });
        }

        const connection = await pool.getConnection();
        const updates: string[] = [];
        const values: any[] = [];

        if (name) {
            updates.push('name = ?');
            values.push(name);
        }
        if (email) {
            updates.push('email = ?');
            values.push(email);
        }
        if (role) {
            updates.push('role = ?');
            values.push(role);
        }
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updates.push('password = ?');
            values.push(hashedPassword);
        }

        if (updates.length === 0) {
            connection.release();
            return NextResponse.json(
                { message: 'Tidak ada perubahan data' },
                { status: 200 }
            );
        }

        values.push(id);

        await connection.execute(
            `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
            values
        );

        connection.release();

        return NextResponse.json(
            { message: 'Pengguna berhasil diperbarui' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Update user error:', error);
        return NextResponse.json(
            { error: 'Gagal memperbarui pengguna' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: 'ID tidak valid' }, { status: 400 });
        }

        const connection = await pool.getConnection();

        await connection.execute('DELETE FROM users WHERE id = ?', [id]);

        connection.release();

        return NextResponse.json(
            { message: 'Pengguna berhasil dihapus' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Delete user error:', error);
        return NextResponse.json(
            { error: 'Gagal menghapus pengguna' },
            { status: 500 }
        );
    }
}
