// ==========================================
// BAGIAN LAILI (BACKEND) - Google Apps Script
// ==========================================

// 1. Laili: Isi ID Spreadsheet ini nanti setelah kamu buat Google Sheet-nya!
// Cara cari ID: Buka Google Sheet > Copy teks panjang di URL antara /d/ dan /edit
const SHEET_ID = '19SM7gIz4PYk9WfJn-50jp4yUWcKMTPD7C-mf0YdEEAs';

/**
 * Fungsi wajib GAS untuk merender halaman HTML
 * Cukup render 1 file: Index.html (Semua sudah gabung disitu)
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
    return { success: false, message: "Error sistem: Cek ID Spreadsheet Laili!" };
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
      dataForm.isi,
      "" // Jawaban petugas kosong dulu
    ]);

    return { success: true, message: "Data berhasil disimpan ke Database!" };
  } catch (e) {
    return { success: false, message: "Gagal menyimpan! Laili: Cek ID Sheet ya." };
  }
}
