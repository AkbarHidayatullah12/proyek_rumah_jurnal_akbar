import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { logActivity } from '@/lib/activity';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const normalizedEmail = String(email ?? '').trim();

    if (!normalizedEmail || !password) {
      return Response.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();

    const [rows] = await connection.execute(
      'SELECT id, email, password, name, role FROM users WHERE LOWER(email) = LOWER(?)',
      [normalizedEmail]
    );

    connection.release();

    const users = rows as Array<{ id: number; email: string; password: string; name: string; role: string }>;

    if (users.length === 0) {
      console.log('[login] user not found for email:', normalizedEmail);
      return Response.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log('[login] invalid password for email:', normalizedEmail, 'userId:', user.id);
      return Response.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    // Log the login activity
    await logActivity(user.id, user.name, user.role, 'LOGIN', 'User logged in successfully');

    return Response.json(
      { token, user: { id: user.id, email: user.email, name: user.name, role: user.role } },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Login error:', error);

    // Provide helpful message when DB/table not initialized
    if (error && (error.code === 'ER_NO_SUCH_TABLE' || String(error.message).toLowerCase().includes("doesn't exist") || String(error.message).toLowerCase().includes('no such table'))) {
      return Response.json({ error: 'Database not initialized. Call GET /api/init-db to create tables (or check DB connection).' }, { status: 500 });
    }

    return Response.json(
      { error: error instanceof Error ? error.message : 'Login failed' },
      { status: 500 }
    );
  }
}
