import pool from '@/lib/db';
import { NextResponse } from 'next/server';
import { logActivity } from '@/lib/activity';
import { getUserFromRequest } from '@/lib/auth-server';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const connection = await pool.getConnection();

        const [rows] = await connection.execute(
            `SELECT id, journal_id, journal_volume, title, abstract, keywords, category, file_url, status, date, revision_notes 
       FROM submissions WHERE id = ?`,
            [id]
        );

        connection.release();

        if (!Array.isArray(rows) || rows.length === 0) {
            return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
        }

        const submission = (rows as any[])[0];

        // Format date for frontend
        submission.date = new Date(submission.date).toLocaleDateString('id-ID', {
            day: '2-digit', month: 'short', year: 'numeric'
        });

        return NextResponse.json({ submission }, { status: 200 });

    } catch (error) {
        console.error('submission GET error', error);
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Unexpected error' }, { status: 500 });
    }
}

// ... PUT method remains unchanged ...

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { status, revision_notes } = body;

        if (!status) {
            return NextResponse.json({ error: 'Status is required' }, { status: 400 });
        }

        const connection = await pool.getConnection();

        let sql = 'UPDATE submissions SET status = ?';
        const values: any[] = [status];

        if (revision_notes !== undefined) {
            sql += ', revision_notes = ?';
            values.push(revision_notes);
        }

        sql += ' WHERE id = ?';
        values.push(id);

        await connection.execute(sql, values);
        connection.release();

        // Log Activity
        const user = getUserFromRequest(req);
        await logActivity(
            user?.id,
            user?.name || 'Unknown',
            user?.role || 'unknown',
            status === 'Revisi' ? 'REVISE_REQ' : 'REVIEW',
            `Updated status of ${id} to ${status}${revision_notes ? ' with notes' : ''}`
        );

        return NextResponse.json({ success: true, message: 'Status updated successfully' });

    } catch (error) {
        console.error('submission PATCH error', error);
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Unexpected error' }, { status: 500 });
    }
}
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const formData = await req.formData();

        const journalId = formData.get('journalId') as string;
        const journalVolume = formData.get('journalVolume') as string;
        const title = formData.get('title') as string;
        const abstract = formData.get('abstract') as string;
        const keywords = formData.get('keywords') as string;
        const category = formData.get('category') as string;

        // Check if new file is uploaded
        const file = formData.get('file') as File | null;
        let fileUrl = undefined;

        if (file) {
            const fs = require('fs/promises');
            const path = require('path');

            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadDir = path.join(process.cwd(), 'public', 'uploads');
            try { await fs.mkdir(uploadDir, { recursive: true }); } catch (e) { }

            const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
            const filePath = path.join(uploadDir, fileName);
            await fs.writeFile(filePath, buffer);

            fileUrl = `/uploads/${fileName}`;
        }

        const connection = await pool.getConnection();

        let sql = `UPDATE submissions SET 
               journal_id = ?, journal_volume = ?, title = ?, 
               abstract = ?, keywords = ?, category = ?`;
        const validStatuses = ['Menunggu Validasi', 'Review', 'Revisi', 'Disetujui', 'Ditolak', 'Dibatalkan'];
        const values: any[] = [journalId, journalVolume, title, abstract, keywords, category];

        if (fileUrl) {
            sql += `, file_url = ?`;
            values.push(fileUrl);
        }

        sql += ` WHERE id = ?`;
        values.push(id);

        await connection.execute(sql, values);
        connection.release();

        // Log Activity
        const user = getUserFromRequest(req);
        await logActivity(
            user?.id,
            user?.name || 'Unknown',
            user?.role || 'unknown',
            'REVISE',
            `Updated submission ${id}: ${title}`
        );

        return NextResponse.json({ success: true, message: 'Submission updated successfully' });

    } catch (error) {
        console.error('submission PUT error', error);
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Unexpected error' }, { status: 500 });
    }
}



export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const connection = await pool.getConnection();

        // 1. Get file path to delete
        const [rows] = await connection.execute('SELECT file_url, status, title FROM submissions WHERE id = ?', [id]);
        if (!Array.isArray(rows) || rows.length === 0) {
            connection.release();
            return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
        }

        const submission = (rows as any[])[0];

        // 2. Validate status (Only allow delete if Menunggu Validasi, Dibatalkan)
        // Adjust this list as per requirements. "Draft" logic effectively maps to "Menunggu Validasi" here as it's the initial state.
        const allowedStatuses = ['Menunggu Validasi', 'Dibatalkan', 'Draft']; 
        if (!allowedStatuses.includes(submission.status)) {
            connection.release();
            return NextResponse.json({ error: 'Data tidak dapat dihapus karena sedang diproses atau sudah selesai.' }, { status: 403 });
        }

        // 3. Delete File from FS
        if (submission.file_url) {
            const fs = require('fs/promises');
            const path = require('path');
            const filePath = path.join(process.cwd(), 'public', submission.file_url);
            try {
                await fs.unlink(filePath);
            } catch (e) {
                console.warn('Failed to delete file from disk:', e);
                // Continue identifying it as deleted in DB even if file unlinking fails
            }
        }

        // 4. Delete from DB
        await connection.execute('DELETE FROM submissions WHERE id = ?', [id]);
        connection.release();

        // 5. Log Activity
        const user = getUserFromRequest(req);
        await logActivity(
            user?.id,
            user?.name || 'Unknown',
            user?.role || 'unknown',
            'DELETE',
            `Permanently deleted submission ${id}: ${submission.title}`
        );

        return NextResponse.json({ success: true, message: 'Submission deleted permanently' });

    } catch (error) {
        console.error('submission DELETE error', error);
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Unexpected error' }, { status: 500 });
    }
}
