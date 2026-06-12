// Konfigurasi ID Spreadsheet Database Pelaporan PST
const SHEET_ID = '19SM7gIz4PYk9WfJn-50jp4yUWcKMTPD7C-mf0YdEEAs';

/**
 * Fungsi wajib GAS untuk merender halaman HTML
 */
function doGet() {
  let html = HtmlService.createHtmlOutputFromFile('Index');
  return html.setTitle('Aplikasi Pelaporan PST')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * Fungsi untuk cek kode akses (Login)
 */
function cekKodeAkses(kodeInput) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName("Kode Akses");
    if (!sheet) return { success: false, message: "Sheet 'Kode Akses' belum dibuat!" };

    const kodeAsli = sheet.getRange("A1").getValue();

    if (kodeInput == kodeAsli) {
      return { success: true, message: "Login Berhasil!" };
    }

    return { success: false, message: "Kode Akses Salah!" };
  } catch (e) {
    return { success: false, message: "Terjadi kesalahan sistem saat memverifikasi kode akses." };
  }
}

/**
 * Fungsi untuk menyimpan laporan baru
 */
function simpanLaporan(dataForm) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName("Data Pengaduan");
    if (!sheet) return { success: false, message: "Sheet 'Data Pengaduan' belum dibuat!" };

    const timestamp = new Date();

    sheet.appendRow([
      timestamp,
      dataForm.tanggal,
      dataForm.nama,
      dataForm.noHp,
      dataForm.jenis,
      dataForm.media,
      dataForm.petugas, // Kolom baru untuk Petugas
      dataForm.isi,
      "" // Jawaban petugas kosong dulu
    ]);

    return { success: true, message: "Data berhasil disimpan ke Database!" };
  } catch (e) {
    return { success: false, message: "Gagal menyimpan data ke spreadsheet." };
  }
}

/**
 * Fungsi untuk mengambil daftar nama petugas dari Google Sheets
 */
function getDaftarPetugas() {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName("Daftar Petugas");
    if (!sheet) return [];
    
    // Mengambil semua data di Kolom A (mulai dari baris ke-2 ke bawah)
    const data = sheet.getRange("A2:A").getValues();
    
    // Membersihkan baris yang kosong
    const petugas = data.map(row => row[0]).filter(nama => nama !== "");
    return petugas;
  } catch(e) {
    return [];
  }
}
