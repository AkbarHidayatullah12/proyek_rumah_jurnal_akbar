import pool from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth-server';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    try {
        const user = getUserFromRequest(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const connection = await pool.getConnection();
        const [rows] = await connection.execute(
            'SELECT id, name, email, role, institution, phone, sinta_id, scopus_id, orcid_id, google_scholar_id, avatar FROM users WHERE id = ?',
            [user.id]
        );
        connection.release();

        if ((rows as any[]).length === 0) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const userData = (rows as any[])[0];

        // Map DB columns to frontend camelCase keys
        const profile = {
            name: userData.name,
            email: userData.email,
            role: userData.role,
            institution: userData.institution || '',
            phone: userData.phone || '',
            sintaId: userData.sinta_id || '',
            scopusId: userData.scopus_id || '',
            orcidId: userData.orcid_id || '',
            googleScholar: userData.google_scholar_id || '',
            avatar: userData.avatar || ''
        };

        return NextResponse.json({ profile });
    } catch (error) {
        console.error('Error fetching profile:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const user = getUserFromRequest(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { name, institution, phone, sintaId, scopusId, orcidId, googleScholar, avatar } = body;

        const connection = await pool.getConnection();
        await connection.execute(
            `UPDATE users SET 
        name = ?, 
        institution = ?, 
        phone = ?, 
        sinta_id = ?, 
        scopus_id = ?, 
        orcid_id = ?, 
        google_scholar_id = ?,
        avatar = ?
       WHERE id = ?`,
            [
                name,
                institution || null,
                phone || null,
                sintaId || null,
                scopusId || null,
                orcidId || null,
                googleScholar || null,
                avatar || null,
                user.id
            ]
        );
        connection.release();

        return NextResponse.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating profile:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
