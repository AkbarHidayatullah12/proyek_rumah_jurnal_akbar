# Proyek Rumah Jurnal Akbar

Aplikasi manajemen jurnal ilmiah "Rumah Jurnal" yang dibangun menggunakan Next.js. Aplikasi ini memungkinkan pengelolaan naskah jurnal, mulai dari submisi oleh penulis, review, hingga penerbitan.

## Fitur Utama

- **Autentikasi & Otorisasi**: Sistem login untuk berbagai peran (Penulis, Editor, Reviewer).
- **Manajemen Submisi**: Penulis dapat mengirimkan naskah dan memantau status revisi.
- **Workflow Editorial**: Editor dan Reviewer dapat memeriksa, menolak, atau menyetujui naskah.
- **Manajemen User**: Pengelolaan profil pengguna dan akses.
- **Notifikasi/Tracking**: Pemantauan status naskah secara real-time.

## Teknologi yang Digunakan

- **Frontend**: Next.js 14+ (App Router), Tailwind CSS
- **Backend/Database**: MySQL
- **Bahasa**: TypeScript / JavaScript
- **Version Control**: Git / GitHub

## Cara Menjalankan Proyek

Ikuti langkah-langkah berikut untuk menjalankan proyek di komputer lokal Anda:

### 1. Persiapan Awal
Pastikan Anda sudah menginstal:
- [Node.js](https://nodejs.org/) (versi LTS terbaru disarankan)
- [Git](https://git-scm.com/)
- Database MySQL

### 2. Instalasi Dependensi
Jalankan perintah berikut di terminal:

```bash
npm install
```

### 3. Konfigurasi Database
1. Pastikan server MySQL Anda berjalan (misal via XAMPP atau service MySQL).
2. Konfigurasikan file `.env.local` Anda dengan kredensial database yang sesuai (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME).
3. Jika perlu, jalankan skrip migrasi atau populasi database yang tersedia (contoh: `node repopulate_db.js`).

### 4. Menjalankan Server Development
Setelah semua terinstal, jalankan server:

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## Kontribusi
Silakan lakukan *Pull Request* jika ingin berkontribusi. Pastikan untuk selalu melakukan *git pull* sebelum memulai pekerjaan baru untuk menghindari konflik.

---
Ilmu Komputer - Proyek Rumah Jurnal
