# 📊 Aplikasi Pelaporan PST - Dokumentasi Lengkap

Sistem pelaporan pengaduan terintegrasi dengan Google Apps Script untuk BPS Boyolali.

## 📁 Struktur File

```
Lapor-PST/
├── index.html          # Halaman Login
├── dashboard.html      # Dashboard Utama + Form Pelaporan
├── report.html         # Halaman Laporan & Grafik
├── style.css           # Styling Global
├── script.js           # Helper Functions
├── Code.js             # Google Apps Script Backend
├── README.md           # Dokumentasi
└── Index.html          # Backup file lama
```

## 🚀 Fitur Utama

### 1. **Halaman Login** (`index.html`)
- Login menggunakan kode akses
- Design modern dan responsif
- Alert system untuk feedback pengguna
- Validasi input

### 2. **Dashboard Utama** (`dashboard.html`)
- Menampilkan statistik laporan:
  - **Total Laporan**: Jumlah semua laporan
  - **Pengaduan Masuk**: Laporan yang belum ditindaklanjuti
  - **Pengaduan Selesai**: Laporan yang sudah ditindaklanjuti

### 3. **Form Pelaporan** (di Dashboard)
Field yang tersedia:
- **Tanggal** (required, default hari ini)
- **Nama Pelapor** (required)
- **Email / Kontak Lainnya** (optional)
- **Nomor HP / WhatsApp** (optional)
- **Jenis Pengaduan** (required)
  - Non Layanan Statistik
  - Layanan Statistik
- **Media Pengaduan** (required)
  - Kotak Saran dan Pengaduan
  - Pengaduan Tatap Muka
  - Email
  - WhatsApp
  - Instagram
  - Web BPS Boyolali
- **Isi Pengaduan** (required, textarea)
- **Jawaban/Tindak Lanjut Petugas** (optional)
- **Nama Petugas** (dropdown, optional)
- Tombol Simpan & Reset

### 4. **Halaman Report** (`report.html`)
- Grafik laporan per bulan berdasarkan tahun
- Grafik jumlah laporan berdasarkan media pengaduan
- Statistik ringkasan
- Filter tahun untuk laporan per bulan
- Menggunakan Chart.js untuk visualisasi

## 🔧 Integrasi Google Apps Script

### Backend Functions di `Code.js`

#### 1. **cekKodeAkses(kodeInput)**
Memverifikasi kode akses login
```javascript
cekKodeAkses("1234") // Returns: {success: true/false, message: "..."}
```

#### 2. **simpanLaporan(dataForm)**
Menyimpan data laporan ke spreadsheet
```javascript
simpanLaporan({
  tanggal: "2024-01-15",
  nama: "John Doe",
  email: "john@example.com",
  noHp: "08123456789",
  jenis: "Layanan Statistik",
  media: "WhatsApp",
  petugas: "Budi",
  isi: "Laporan tentang...",
  jawaban: ""
})
```

#### 3. **getDaftarPetugas()**
Mengambil daftar nama petugas
```javascript
getDaftarPetugas() // Returns: ["Budi", "Ani", "Dian", ...]
```

#### 4. **getStatistikLaporan()**
Mengambil statistik laporan
```javascript
getStatistikLaporan() // Returns: {total: 15, masuk: 5, selesai: 10}
```

#### 5. **getLaporanPerBulan(tahun)**
Mengambil data laporan per bulan
```javascript
getLaporanPerBulan(2024) // Returns: [0, 5, 3, 2, 1, 0, ...]
```

#### 6. **getLaporanPerMedia()**
Mengambil data laporan berdasarkan media
```javascript
getLaporanPerMedia() // Returns: {WhatsApp: 5, Email: 3, ...}
```

## 📊 Struktur Database (Google Sheets)

### Sheet 1: "Kode Akses"
| Kolom | Isi |
|-------|-----|
| A1 | Kode akses |

### Sheet 2: "Data Pengaduan"
| No | Tanggal | Nama | No HP | Jenis | Media | Petugas | Isi | Jawaban |
|----|---------|------|-------|-------|-------|---------|-----|---------|
| Timestamp | Date | Text | Number | Text | Text | Text | Text | Text |

### Sheet 3: "Daftar Petugas"
| Kolom | Isi |
|-------|-----|
| A1 | Nama Petugas 1 |
| A2 | Nama Petugas 2 |
| ... | ... |

## 🎨 Styling & Design

### Warna Utama
- **Primary**: #3b82f6 (Biru)
- **Success**: #10b981 (Hijau)
- **Warning**: #f59e0b (Kuning)
- **Danger**: #ef4444 (Merah)

### Font
- Font Family: Inter
- Fallback: System fonts (-apple-system, BlinkMacSystemFont, Segoe UI)

### Responsive Design
- Mobile-first approach
- Breakpoints: 768px, 480px

## 📱 Kompatibilitas

- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## 🔐 Keamanan

- Kode akses disimpan di Google Sheets
- Data terenkripsi dalam transit
- Validasi input di frontend dan backend
- CSRF protection via Google Apps Script

## 🛠️ Helper Functions (script.js)

### Utilitas Umum
```javascript
// Format
formatDate(date)          // Format tanggal ke ID
formatDateShort(date)     // Format DD/MM/YYYY
formatTime(date)          // Format HH:MM:SS
formatCurrency(amount)    // Format mata uang
formatNumber(number)      // Format dengan separator

// Validasi
validateEmail(email)      // Validasi email
validatePhone(phone)      // Validasi telepon

// DOM
showAlert(msg, type)      // Tampil alert
scrollToElement(el)       // Scroll ke element
copyToClipboard(text)     // Copy ke clipboard

// Data
isEmpty(value)            // Cek nilai kosong
deepClone(obj)           // Clone object
mergeObjects(a, b)       // Merge objects

// Loading
showLoading(el)          // Tampil loading
hideLoading(el)          // Sembunyikan loading
setButtonLoading(btn)    // Set button loading
resetButton(btn)         // Reset button
```

## 📝 Cara Menggunakan

### 1. Setup Google Apps Script
1. Buka Google Sheet yang sudah dibuat
2. Buat sheet dengan nama: "Kode Akses", "Data Pengaduan", "Daftar Petugas"
3. Masukkan kode akses di A1 pada sheet "Kode Akses"
4. Masukkan nama petugas di kolom A pada sheet "Daftar Petugas"
5. Upload script di `Code.js` ke Apps Script Editor

### 2. Deploy sebagai Web App
1. Di Apps Script, klik "Deploy" → "New Deployment"
2. Pilih tipe "Web app"
3. Set execute as: Yourself
4. Set who has access: Anyone
5. Copy URL yang diberikan

### 3. Mengakses Aplikasi
1. Buka URL deployment
2. Masukkan kode akses
3. Isi form dan lihat laporan

## 🐛 Troubleshooting

### Problem: "Sheet 'Data Pengaduan' belum dibuat!"
**Solusi**: Buat sheet dengan nama yang tepat di Google Sheets

### Problem: Dropdown Petugas kosong
**Solusi**: Pastikan data di sheet "Daftar Petugas" sudah ada di kolom A mulai baris 2

### Problem: Grafik tidak muncul
**Solusi**: 
1. Pastikan Chart.js library terbuka (CDN aktif)
2. Refresh halaman
3. Check browser console untuk error

### Problem: Form tidak bisa disimpan
**Solusi**: 
1. Pastikan terhubung internet
2. Check Google Sheets permission
3. Cek error message di browser console

## 📈 Customization

### Mengubah Warna
Edit file `style.css` dan ubah variabel CSS:
```css
:root {
  --primary-color: #3b82f6;  /* Ubah ke warna favorite */
  --success-color: #10b981;
  --danger-color: #ef4444;
}
```

### Menambah Opsi Dropdown
Edit di `dashboard.html`:
```html
<option value="New Option">New Option</option>
```

### Mengubah Layout
Edit file HTML sesuai kebutuhan, tetap gunakan classes dari `style.css`

## 📚 Resources

- [Google Apps Script Documentation](https://developers.google.com/apps-script)
- [Chart.js Documentation](https://www.chartjs.org/)
- [MDN Web Docs](https://developer.mozilla.org/)

## 👥 Support

Untuk pertanyaan atau issue:
1. Check documentation ini
2. Check browser console (F12)
3. Cek Google Apps Script logs
4. Hubungi admin IT

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Made with ❤️ for BPS Boyolali**
