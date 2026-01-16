import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const connection = await pool.getConnection();

        // 1. Fetch Submission Data
        const [rows] = await connection.execute(
            `SELECT s.id, s.title, s.date, s.status, u.name as author_name, u.institution 
             FROM submissions s
             JOIN users u ON s.author_id = u.id
             WHERE s.id = ?`,
            [id]
        );
        connection.release();

        if (!Array.isArray(rows) || rows.length === 0) {
            return new NextResponse('Submission not found', { status: 404 });
        }

        const sub = (rows as any[])[0];

        // 2. Security Check: Only 'Disetujui' or 'Selesai' status
        if (sub.status !== 'Disetujui' && sub.status !== 'Selesai') {
            return new NextResponse('Letter of Acceptance is only available for Approved submissions.', { status: 403 });
        }

        // 3. Generate HTML Template
        const currentDate = new Date().toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric'
        });

        const html = `
        <!DOCTYPE html>
        <html lang="id">
        <head>
            <meta charset="UTF-8">
            <title>Letter of Acceptance - ${sub.id}</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Times+New+Roman&display=swap');
                body {
                    font-family: 'Times New Roman', serif;
                    line-height: 1.6;
                    color: #000;
                    margin: 0;
                    padding: 40px;
                    background: #fff;
                }
                .container {
                    max-width: 210mm; /* A4 width */
                    margin: 0 auto;
                    padding: 20px;
                }
                .header {
                    text-align: center;
                    border-bottom: 3px double #000;
                    padding-bottom: 10px;
                    margin-bottom: 30px;
                }
                .header h1 {
                    margin: 0;
                    font-size: 24px;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                }
                .header p {
                    margin: 5px 0 0;
                    font-size: 14px;
                }
                .loa-title {
                    text-align: center;
                    font-weight: bold;
                    text-decoration: underline;
                    font-size: 18px;
                    margin: 30px 0;
                }
                .content {
                    text-align: justify;
                }
                .details {
                    margin: 20px 0;
                    padding-left: 20px;
                }
                .details table {
                    width: 100%;
                }
                .details td {
                    vertical-align: top;
                    padding: 5px;
                }
                .details td:first-child {
                    width: 150px;
                    font-weight: bold;
                }
                .footer {
                    margin-top: 60px;
                    text-align: right;
                    padding-right: 40px;
                }
                .signature-box {
                    display: inline-block;
                    text-align: center;
                    width: 200px;
                }
                .sign-space {
                    height: 80px;
                }
                .print-btn {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    padding: 10px 20px;
                    background: #00BDBB;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-family: sans-serif;
                    font-weight: bold;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                }
                @media print {
                    .print-btn { display: none; }
                    body { padding: 0; }
                    .container { width: 100%; max-width: none; }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>RUMAH JURNAL</h1>
                    <p>Pusat Publikasi Ilmiah dan Pengelolaan Jurnal</p>
                    <p>Jalan Pendidikan No. 1, Kota Akademik, Indonesia | www.rumahjurnal.id</p>
                </div>

                <div class="loa-title">LETTER OF ACCEPTANCE</div>

                <div class="content">
                    <p>Dear <strong>${sub.author_name}</strong>,</p>
                    
                    <p>We are pleased to inform you that your manuscript entitled:</p>

                    <div class="details">
                        <table>
                            <tr>
                                <td>Title</td>
                                <td>: ${sub.title}</td>
                            </tr>
                            <tr>
                                <td>Submission ID</td>
                                <td>: ${sub.id}</td>
                            </tr>
                            <tr>
                                <td>Author(s)</td>
                                <td>: ${sub.author_name}</td>
                            </tr>
                            <tr>
                                <td>Affiliation</td>
                                <td>: ${sub.institution || '-'}</td>
                            </tr>
                        </table>
                    </div>

                    <p>Has been <strong>ACCEPTED</strong> for publication in <strong>Rumah Jurnal</strong>. Your article has successfully reviewed by our reviewers and approved by the Editorial Board.</p>

                    <p>Thank you for choosing Rumah Jurnal as your publication venue. We look forward to receiving further contributions from you.</p>
                </div>

                <div class="footer">
                    <div class="signature-box">
                        <p>${currentDate}</p>
                        <p>Editor in Chief,</p>
                        <div class="sign-space"></div>
                        <p><strong>Dr. Editor Chief, M.Kom</strong></p>
                        <p>NIP. 19800101 200501 1 001</p>
                    </div>
                </div>
            </div>

            <button onclick="window.print()" class="print-btn">🖨️ Cetak / Simpan PDF</button>

            <script>
                // Auto-print on load setup
                setTimeout(() => {
                    // window.print(); // Optional: Auto trigger
                }, 1000);
            </script>
        </body>
        </html>
        `;

        return new NextResponse(html, {
            headers: { 'Content-Type': 'text/html' }
        });

    } catch (error) {
        console.error('LoA generation error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
