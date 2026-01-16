import pool from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { fullName, email, password } = await request.json();

    const name = String(fullName ?? '').trim();
    const normalizedEmail = String(email ?? '').trim();

    if (!name || !normalizedEmail || !password) {
      return Response.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    if (String(password).length < 6) {
      return Response.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const connection = await pool.getConnection();

    try {
      const [rows] = await connection.execute(
        'SELECT id FROM users WHERE LOWER(email) = LOWER(?)',
        [normalizedEmail]
      );

      const existing = rows as Array<{ id: number }>;

      if (existing.length > 0) {
        return Response.json({ error: 'Email already registered' }, { status: 409 });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await connection.execute(
        'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
        [normalizedEmail, hashedPassword, name, 'author']
      );

    } finally {
      connection.release();
    }

    return Response.json({ message: 'Registration successful' }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return Response.json(
      { error: error instanceof Error ? error.message : 'Registration failed' },
      { status: 500 }
    );
  }
}
