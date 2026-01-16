# User Manual - Sistem Informasi E-LOA Rumah Jurnal

## BAB I - PENDAHULUAN

### 1.1 Umum
Sistem Informasi E-LOA (Electronic Letter of Acceptance) Rumah Jurnal adalah aplikasi berbasis web yang dirancang untuk mendigitalisasi proses pengelolaan penerbitan surat penerimaan naskah (LOA) di lingkungan Rumah Jurnal Politeknik Negeri Padang. Aplikasi ini dibangun untuk mengatasi kendala proses manual, seperti kesulitan pelacakan status dan ketidakefisienan alur kerja, menjadi sistem yang terpusat, transparan, dan real-time.

### 1.2 Tujuan Pembuatan Dokumen
Dokumen User Manual ini disusun dengan tujuan sebagai berikut:
1. Memberikan panduan lengkap mengenai tata cara penggunaan aplikasi E-LOA.
2. Menjelaskan fungsi dari setiap fitur yang tersedia pada aplikasi.
3. Memudahkan pengguna (user) dalam memahami alur kerja sistem dari awal hingga akhir.
4. Menjadi acuan teknis apabila pengguna mengalami kesulitan dalam mengoperasikan sistem.

### 1.3 Deskripsi Sistem
Aplikasi E-LOA dikembangkan menggunakan teknologi web modern dengan framework Next.js dan basis data MySQL. Sistem ini memiliki karakteristik sebagai berikut:
- **Berbasis Web**: Dapat diakses melalui peramban (browser) tanpa perlu instalasi khusus di perangkat pengguna.
- **Terintegrasi**: Menguhubungkan alur kerja antara Author, Admin, dan Editor dalam satu platform.
- **Otomatisasi**: Mampu menghasilkan dokumen LOA dalam format PDF secara otomatis setelah disetujui.

### 1.4 Pengguna Sistem
Terdapat tiga jenis pengguna (role) yang dapat mengakses sistem ini, yaitu:
- **Author (Penulis/Mahasiswa)**: Pengguna yang mengajukan permohonan LOA, mengunggah dokumen, dan memantau status pengajuan.
- **Admin**: Pengguna yang bertugas memvalidasi kelengkapan administrasi pengajuan dan mengelola akun pengguna.
- **Editor**: Pengguna yang bertugas meninjau konten pengajuan dan memberikan keputusan akhir (Disetujui/Ditolak/Revisi).

---

## BAB II - KEBUTUHAN SISTEM

Untuk dapat menggunakan aplikasi E-LOA dengan optimal, pengguna disarankan untuk memenuhi spesifikasi kebutuhan sistem sebagai berikut:

### 2.1 Perangkat Keras (Hardware)
Aplikasi ini dapat diakses menggunakan berbagai perangkat komputasi, antara lain:
- **Komputer Desktop/Laptop**: Disarankan memiliki resolusi layar minimal 1366 x 768 piksel untuk kenyamanan tampilan.
- **Smartphone/Tablet**: Aplikasi telah mendukung tampilan responsif (mobile-friendly).
- **Koneksi Internet**: Diperlukan koneksi internet yang stabil untuk mengakses aplikasi dan mengunggah dokumen.

### 2.2 Perangkat Lunak (Software)
Pengguna hanya memerlukan peramban web (web browser) modern yang mendukung standar web terkini. Beberapa browser yang direkomendasikan:
- Google Chrome (Versi terbaru)
- Mozilla Firefox
- Microsoft Edge
- Safari

---

## BAB III - PANDUAN PENGGUNAAN (LOGIN & DASHBOARD)

Bab ini menjelaskan tata cara masuk ke dalam sistem dan pengenalan antarmuka utama (Dashboard), khususnya untuk pengguna dengan peran **Author**.

### 3.1 Login (Masuk ke Sistem)
Halaman Login adalah gerbang utama untuk mengakses fitur-fitur E-LOA.
1. **Akses URL**: Buka alamat website E-LOA melalui browser Anda.
2. **Tampilan Halaman**: Anda akan melihat halaman login dengan desain split-screen; sisi kiri menampilkan logo dan informasi aplikasi, sisi kanan menampilkan formulir login.
3. **Isi Kredensial**:
   - **Email**: Masukkan alamat email yang terdaftar.
   - **Password**: Masukkan kata sandi akun Anda.
   - **Show Password**: Klik ikon mata untuk melihat password yang diketik.
4. **Opsi Tambahan**:
   - **Ingat Saya**: Centang kotak ini jika ingin sistem mengingat sesi login Anda di perangkat tersebut.
   - **Lupa Password**: Klik tautan ini jika Anda tidak dapat mengingat kata sandi Anda.
5. **Tombol Masuk**: Klik tombol **"Masuk"** untuk memproses otentikasi.
   - Jika berhasil, Anda akan diarahkan ke Dashboard sesuai peran (Author/Admin/Editor).
   - Jika gagal, notifikasi kesalahan akan muncul.
6. **Daftar Akun**: Jika belum memiliki akun, klik tombol **"Daftar Akun Baru"** untuk melakukan registrasi.

### 3.2 Dashboard Author
Setelah berhasil login sebagai Author, Anda akan diarahkan ke halaman Dashboard. Halaman ini berfungsi sebagai pusat informasi dan kontrol untuk pengajuan naskah Anda.

#### A. Banner Selamat Datang
Di bagian atas dashboard terdapat banner yang menyapa pengguna dengan nama Anda (sesuai akun). Bagian ini juga menyediakan akses cepat (Quick Action):
- **Buat Pengajuan Baru**: Tombol pintas untuk memulai proses pengajuan LOA baru.
- **Lihat Semua Naskah**: Tombol pintas untuk melihat daftar seluruh pengajuan yang pernah Anda buat.

#### B. Statistik Pengajuan (Stat Cards)
Terdapat empat kartu statistik yang memberikan ringkasan status pengajuan Anda secara real-time:
1. **Menunggu Validasi** (Kuning): Jumlah naskah yang baru diajukan dan sedang dalam tahap pemeriksaan administratif.
2. **Dalam Review** (Biru): Jumlah naskah yang sedang ditinjau oleh reviewer/mitra bestari.
3. **Perlu Revisi** (Merah): Jumlah naskah yang memerlukan perbaikan dari penulis.
4. **Diterbitkan** (Hijau): Jumlah naskah yang telah disetujui dan LOA-nya terbit.

#### C. Riwayat Pengajuan Terbaru (Recent Activity)
Bagian ini menampilkan daftar singkat dari pengajuan terakhir Anda.
- Setiap item menampilkan Judul Naskah, Tanggal Pengajuan, dan Status Terkini.
- Klik pada judul naskah untuk melihat detail lengkap pengajuan tersebut.
- Status ditandai dengan label berwarna (Badge) untuk memudahkan identifikasi visual.

#### D. Tips Penulis (Sidebar)
Di sisi kanan, terdapat informasi panduan singkat atau tips untuk penulis, seperti:
- Ketentuan penulisan abstrak.
- Saran penggunaan referensi.
- Tombol **Download Template Jurnal** untuk mengunduh template naskah standar.
