# Aplikasi Lapor PST BPS Kabupaten Boyolali 📊

Aplikasi web pelaporan sederhana menggunakan arsitektur **Google Apps Script** dan **Google Sheets** sebagai database. Proyek ini dikerjakan secara kolaboratif selama masa magang di BPS Kabupaten Boyolali.

## 👥 Tim Pengembang (Jobdesk)

Proyek ini dibagi menjadi dua arsitektur utama:
1. **Frontend (UI/UX): Intan**
   - File: `Index.html`
   - Bertanggung jawab merancang tampilan, responsivitas (HTML/CSS), dan interaksi *client-side* (JavaScript) pada halaman Login dan Form Pelaporan.
2. **Backend (Database & Logic): Laili**
   - File: `Code.js` (di-deploy sebagai `Code.gs`)
   - Bertanggung jawab mengatur routing aplikasi, otentikasi kode akses, logika penyimpanan data (*CRUD*), serta manajemen database di Google Sheets.

## 🛠️ Teknologi yang Digunakan
- **Frontend:** HTML5, Vanilla CSS, Vanilla JavaScript.
- **Backend:** Google Apps Script (GAS).
- **Database:** Google Sheets.

## 🚀 Cara Instalasi & Deploy
1. Buat Spreadsheet baru di Google Sheets.
2. Buat sheet `Data Pengaduan` (untuk menyimpan laporan) dan `Kode Akses` (untuk menyimpan kode login).
3. Buka **Ekstensi > Apps Script** dari Spreadsheet tersebut.
4. Salin kode dari `Code.js` ke dalam `Code.gs`. Masukkan ID Spreadsheet Anda.
5. Buat file HTML baru di Apps Script dengan nama `Index.html` dan salin kode dari `Index.html` lokal ke dalamnya.
6. Klik **Terapkan (Deploy) > Deployment Baru > Aplikasi Web**.
