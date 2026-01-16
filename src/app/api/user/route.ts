import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'secret'
    ) as { id: number; email: string; role: string };

    const connection = await pool.getConnection();

    const [rows] = await connection.execute(
      'SELECT id, email, name, role FROM users WHERE id = ?',
      [decoded.id]
    );

    connection.release();

    const users = rows as Array<{ id: number; email: string; name: string; role: string }>;

    if (users.length === 0) {
      return Response.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const user = users[0];

    return Response.json(
      { user },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return Response.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
    console.error('User fetch error:', error);
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch user' },
      { status: 500 }
    );
  }
}
