# 📊 Aplikasi Pelaporan PST - Ringkasan Fitur

## 🎯 Overview Sistem

```
┌─────────────────────────────────────────────────────────────┐
│         APLIKASI PELAPORAN PENGADUAN PST BOYOLALI           │
│         Sistem Terintegrasi Google Apps Script              │
└─────────────────────────────────────────────────────────────┘

    ┌──────────┐         ┌──────────┐         ┌──────────┐
    │  Login   │   →    │Dashboard │   →    │ Laporan  │
    │  Page    │        │  & Form  │        │ & Grafik │
    └──────────┘         └──────────┘         └──────────┘
         ↓                    ↓                    ↓
    [Verify]            [Input Data]         [View Stats]
    [Kode Akses]        [Simpan ke GS]       [Chart.js]
```

## 📄 HALAMAN 1: LOGIN

```
┌─────────────────────────────────┐
│  🔐 Aplikasi Pelaporan          │
│  Pusat Statistik Terpadu        │
│  BPS Boyolali                   │
├─────────────────────────────────┤
│                                 │
│  Kode Akses: [_______________]  │
│                                 │
│      [ Masuk ]                  │
│                                 │
│  💡 Hubungi admin untuk kode    │
└─────────────────────────────────┘

FITUR:
✓ Input kode akses
✓ Validasi input
✓ Loading indicator
✓ Alert success/error
✓ Responsive design
```

## 📊 HALAMAN 2: DASHBOARD (Utama)

```
┌─────────────────────────────────────────────┐
│ 📊 Aplikasi Pelaporan PST                   │
│ [Dashboard] [Laporan] [Keluar]              │
├─────────────────────────────────────────────┤
│                                             │
│  STATISTIK:                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │ Total    │ │ Pengaduan│ │ Pengaduan│   │
│  │ Laporan  │ │ Masuk    │ │ Selesai  │   │
│  │    42    │ │    15    │ │    27    │   │
│  └──────────┘ └──────────┘ └──────────┘   │
│                                             │
│  FORM PELAPORAN:                            │
│  ┌─────────────────────────────────────┐   │
│  │ Tanggal*: [01/12/2024]              │   │
│  │ Nama Pelapor*: [________________]   │   │
│  │ Email/Kontak: [________________]    │   │
│  │ No HP: [________________]           │   │
│  │ Jenis Pengaduan*: [dropdown]        │   │
│  │   - Non Layanan Statistik           │   │
│  │   - Layanan Statistik               │   │
│  │ Media Pengaduan*: [dropdown]        │   │
│  │   - Kotak Saran                     │   │
│  │   - Tatap Muka                      │   │
│  │   - Email / WhatsApp / Instagram    │   │
│  │   - Web BPS Boyolali                │   │
│  │ Isi Pengaduan*: [____________]      │   │
│  │                [____________]       │   │
│  │ Jawaban Petugas: [____________]     │   │
│  │ Nama Petugas: [dropdown]            │   │
│  │ [💾 Simpan] [🔄 Reset]             │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘

FITUR:
✓ Statistik real-time
✓ Form lengkap dengan validasi
✓ Dropdown dinamis (data dari GS)
✓ Tanggal default hari ini
✓ Save ke Google Sheets
✓ Alert success/error
✓ Responsive & mobile-friendly
```

## 📈 HALAMAN 3: LAPORAN & GRAFIK

```
┌───────────────────────────────────────────┐
│ 📈 Laporan & Statistik                    │
│ [Dashboard] [Laporan] [Keluar]            │
├───────────────────────────────────────────┤
│                                           │
│ Filter: [Tahun: 2024] [🔄 Perbarui]      │
│                                           │
│ RINGKASAN STATISTIK:                      │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│ │ Total: 42│ │Selesai:27│ │Masuk: 15 │   │
│ └──────────┘ └──────────┘ └──────────┘   │
│                                           │
│ GRAFIK 1:              │  GRAFIK 2:       │
│ Laporan Per Bulan      │  Per Media       │
│                        │                  │
│ ┌──────────────────┐   │ ┌──────────────┐ │
│ │      █            │   │ │   WhatsApp:  │ │
│ │      █ █          │   │ │   Email:     │ │
│ │    █ █ █ █        │   │ │   Instagram: │ │
│ │  █ █ █ █ █ █      │   │ │   Tatap Muka│ │
│ │ J F M A M J J A..  │   │ │   Web:       │ │
│ └──────────────────┘   │ └──────────────┘ │
│ (Bar Chart)            │ (Doughnut Chart) │
└───────────────────────────────────────────┘

FITUR:
✓ Filter tahun
✓ Grafik bar (laporan per bulan)
✓ Grafik pie/doughnut (per media)
✓ Statistik ringkasan
✓ Loading indicator
✓ Responsive grid layout
✓ Chart.js library
```

## 🔄 ALUR DATA

```
1. LOGIN
   User → Input Kode Akses → Backend (cekKodeAkses)
        ↓
   Sheet "Kode Akses" A1 → Verify ✓ → Dashboard

2. FORM PELAPORAN
   User Input → Validasi Frontend → Backend (simpanLaporan)
        ↓
   Sheet "Data Pengaduan" ← Append Row

3. STATISTIK
   Sheet "Data Pengaduan" → Backend (getStatistikLaporan)
        ↓
   Dashboard Card ← Display

4. DROPDOWN PETUGAS
   Sheet "Daftar Petugas" → Backend (getDaftarPetugas)
        ↓
   Form Select ← Populate

5. GRAFIK BULANAN
   Sheet "Data Pengaduan" → Backend (getLaporanPerBulan)
        ↓
   Chart.js ← Render Bar Chart

6. GRAFIK MEDIA
   Sheet "Data Pengaduan" → Backend (getLaporanPerMedia)
        ↓
   Chart.js ← Render Doughnut Chart
```

## 📱 RESPONSIVE DESIGN

```
DESKTOP (1200px+):
┌──────────────────────────────────────┐
│ Nav                                   │
├──────────────────┬────────────────────┤
│  Card 1          │      Card 2         │
├──────────────────┼────────────────────┤
│  Card 3          │      Form           │
└──────────────────┴────────────────────┘

TABLET (768px):
┌──────────────────────┐
│ Nav                  │
├──────────────────────┤
│  Card 1              │
├──────────────────────┤
│  Card 2              │
├──────────────────────┤
│  Form                │
└──────────────────────┘

MOBILE (480px):
┌──────────┐
│ Nav      │
├──────────┤
│ Card 1   │
├──────────┤
│ Card 2   │
├──────────┤
│ Card 3   │
├──────────┤
│ Form     │
└──────────┘
```

## 🎨 WARNA & STYLING

```
PRIMARY (Biru):
┌─────────────────────────────┐
│ #3b82f6 - Button Primary    │
│ #1e40af - Button Hover      │
│ #dbeafe - Background Info   │
└─────────────────────────────┘

SUCCESS (Hijau):
┌─────────────────────────────┐
│ #10b981 - Success Badge     │
│ #dcfce7 - Background        │
└─────────────────────────────┘

WARNING (Kuning):
┌─────────────────────────────┐
│ #f59e0b - Warning Badge     │
│ #fef3c7 - Background        │
└─────────────────────────────┘

DANGER (Merah):
┌─────────────────────────────┐
│ #ef4444 - Danger Badge      │
│ #fee2e2 - Background        │
└─────────────────────────────┘

NEUTRAL:
┌─────────────────────────────┐
│ #f3f4f6 - Background        │
│ #1f2937 - Text Primary      │
│ #6b7280 - Text Secondary    │
│ #e5e7eb - Border            │
└─────────────────────────────┘
```

## ✨ FITUR KHUSUS

### Smart Dropdowns
```javascript
// Dropdown Jenis Pengaduan
[Non Layanan Statistik]
[Layanan Statistik]

// Dropdown Media
[Kotak Saran dan Pengaduan]
[Pengaduan Tatap Muka]
[Email]
[WhatsApp]
[Instagram]
[Web BPS Boyolali]

// Dropdown Petugas (Dynamic)
Loaded from Google Sheets "Daftar Petugas"
```

### Form Validation
```
✓ Tanggal: Required (default today)
✓ Nama Pelapor: Required (text input)
✓ Email/Kontak: Optional
✓ No HP: Optional (tel format)
✓ Jenis Pengaduan: Required (dropdown)
✓ Media Pengaduan: Required (dropdown)
✓ Isi Pengaduan: Required (textarea)
✓ Jawaban: Optional
✓ Nama Petugas: Optional
```

### Real-time Statistics
```
Dashboard menampilkan:
- Total Laporan (semua record)
- Pengaduan Masuk (kosong jawaban)
- Pengaduan Selesai (ada jawaban)
- Update otomatis setelah form disimpan
```

### Chart Visualization
```
Laporan Per Bulan:
- Bar chart dengan 12 bulan
- Filter by tahun
- Auto-scale max value

Laporan Per Media:
- Doughnut/Pie chart
- Label dengan count
- Warna berbeda setiap media
```

## 🔐 Security Features

```
✓ Authentication via Kode Akses
✓ Google Sheets Permission Control
✓ Input Validation (Frontend + Backend)
✓ HTTPS via Google Apps Script
✓ CORS handled by GAS
✓ No API keys exposed in frontend
```

## 📊 Database Schema

```
Sheet "Kode Akses":
├─ A1: Kode akses string

Sheet "Data Pengaduan":
├─ A: Timestamp (auto)
├─ B: Tanggal (input)
├─ C: Nama Pelapor (input)
├─ D: No HP (input)
├─ E: Jenis Pengaduan (dropdown)
├─ F: Media Pengaduan (dropdown)
├─ G: Nama Petugas (dropdown)
├─ H: Isi Pengaduan (textarea)
└─ I: Jawaban Petugas (textarea)

Sheet "Daftar Petugas":
├─ A1: Header "Nama Petugas"
├─ A2+: Nama petugas (one per row)
```

---

**Setiap halaman dirancang untuk user-friendly, responsif, dan terintegrasi penuh dengan Google Apps Script.**
