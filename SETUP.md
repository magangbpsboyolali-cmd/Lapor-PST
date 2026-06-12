# 🚀 PANDUAN SETUP CEPAT

## Langkah 1: Siapkan Google Sheet

1. Buat Google Sheet baru atau gunakan yang sudah ada
2. Catat **ID Spreadsheet** (dari URL)
3. Buat 3 sheet:
   - `Kode Akses`
   - `Data Pengaduan`
   - `Daftar Petugas`

### Setup Sheet "Kode Akses"
- Di cell **A1**, masukkan kode akses (contoh: `BPS123`)

### Setup Sheet "Data Pengaduan"
**Header row** (baris 1):
```
Timestamp | Tanggal | Nama | No HP | Jenis | Media | Petugas | Isi | Jawaban
```

### Setup Sheet "Daftar Petugas"
- Baris 1: Header "Nama Petugas"
- Baris 2+: Nama petugas
```
Nama Petugas
Budi
Ani
Dian
```

## Langkah 2: Upload Google Apps Script

1. Buka Google Sheet
2. Klik menu **Extensions** → **Apps Script**
3. Copy-paste isi file `Code.js` ke editor
4. Update variable `SHEET_ID` dengan ID spreadsheet Anda:
```javascript
const SHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
```
5. Simpan (Ctrl+S)

## Langkah 3: Deploy sebagai Web App

1. Di Apps Script editor, klik **Deploy** (tombol di atas)
2. Pilih **New Deployment**
3. Pilih tipe: **Web app**
4. Pengaturan:
   - Execute as: **Your email**
   - Who has access: **Anyone**
5. Klik **Deploy**
6. Akan muncul dialog, klik **Authorize** dan login
7. Copy URL yang diberikan (itulah alamat aplikasi)

## Langkah 4: Upload File HTML/CSS/JS

1. Di Apps Script editor, buat file baru:
   - Klik **+ Create new file** → **Html**
   - Beri nama: `index`
2. Copy-paste isi dari `index.html`
3. Lakukan hal yang sama untuk:
   - `dashboard.html` → `dashboard`
   - `report.html` → `report`
4. Untuk CSS dan JS, upload sebagai file terpisah atau sisipkan di HTML

## Langkah 5: Update File doGet() (Opsional)

Jika ingin bisa mengakses dari multiple URL, update di `Code.js`:

```javascript
function doGet(e) {
  let page = e.parameter.page || 'index';
  let html = HtmlService.createHtmlOutputFromFile(page);
  return html.setTitle('Aplikasi Pelaporan PST')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}
```

Maka URL menjadi:
- Login: `https://your-url/usercontent.googleusercontent.com/...?page=index`
- Dashboard: `https://your-url/usercontent.googleusercontent.com/...?page=dashboard`
- Report: `https://your-url/usercontent.googleusercontent.com/...?page=report`

## Langkah 6: Test

1. Buka URL deployment
2. Masukkan kode akses yang sudah dibuat (contoh: `BPS123`)
3. Klik "Masuk"
4. Seharusnya muncul Dashboard
5. Isi form dan klik "Simpan Laporan"
6. Cek Sheet "Data Pengaduan" apakah data masuk

## 📋 Checklist

- [ ] Google Sheet dibuat dengan 3 sheet
- [ ] Kode akses di A1 sheet "Kode Akses"
- [ ] Nama petugas di sheet "Daftar Petugas"
- [ ] Apps Script sudah diupload
- [ ] Variabel SHEET_ID sudah diupdate
- [ ] Apps Script sudah di-deploy
- [ ] File HTML sudah diupload
- [ ] URL deployment terbuka dan bisa diakses
- [ ] Login berhasil dengan kode akses
- [ ] Dashboard bisa muncul
- [ ] Form bisa disimpan ke sheet
- [ ] Grafik di halaman report muncul

## 🆘 Common Issues

**Q: Error "Kode Akses tidak sesuai"**
A: Pastikan nilai di A1 sheet "Kode Akses" sesuai dengan yang diinput

**Q: Dropdown petugas kosong**
A: Pastikan data di sheet "Daftar Petugas" mulai dari A2 (bukan A1)

**Q: Grafik tidak muncul**
A: Pastikan data sudah ada di sheet "Data Pengaduan" minimal 1 baris

**Q: Tombol tidak bisa diklik**
A: Mungkin masih loading, tunggu sebentar atau refresh halaman

## 📞 Need Help?

1. Check DOKUMENTASI.md untuk penjelasan detail
2. Lihat browser console (F12) untuk error message
3. Check Google Apps Script logs

---

**Happy deploying! 🎉**
