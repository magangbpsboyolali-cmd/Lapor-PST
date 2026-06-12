// Konfigurasi ID Spreadsheet Database Pelaporan PST
const SHEET_ID = '19SM7gIz4PYk9WfJn-50jp4yUWcKMTPD7C-mf0YdEEAs';

/**
 * Fungsi untuk menangani request GET (API) dari Vercel
 */
function doGet(e) {
  // Handle CORS and preflight
  if (!e || !e.parameter || !e.parameter.action) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, message: "No action specified" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const action = e.parameter.action;
  let result = {};

  try {
    if (action === "getDaftarPetugas") {
      result = getDaftarPetugas();
    } else if (action === "getStatistikLaporan") {
      result = getStatistikLaporan(e.parameter.tahun);
    } else if (action === "getLaporanPerBulan") {
      result = getLaporanPerBulan(e.parameter.tahun);
    } else if (action === "getLaporanPerMedia") {
      result = getLaporanPerMedia(e.parameter.tahun);
    } else if (action === "cekKodeAkses") {
      result = cekKodeAkses(e.parameter.kode);
    } else {
      result = { success: false, message: "Invalid GET action" };
    }
  } catch (error) {
    result = { success: false, message: error.toString() };
  }

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Fungsi untuk menangani request POST (Simpan Data)
 */
function doPost(e) {
  let result = {};
  try {
    const data = JSON.parse(e.postData.contents);
    if (data.action === "simpanLaporan") {
      result = simpanLaporan(data.formData);
    } else {
      result = { success: false, message: "Invalid POST action" };
    }
  } catch(error) {
    result = { success: false, message: error.toString() };
  }
  
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Fungsi untuk cek kode akses (Login)
 */
function cekKodeAkses(kodeInput) {
  try {
    Logger.log('Attempting login with code: ' + kodeInput);
    
    const ss = SpreadsheetApp.openById(SHEET_ID);
    if (!ss) {
      Logger.log('ERROR: Cannot open spreadsheet with ID: ' + SHEET_ID);
      return { success: false, message: "Tidak dapat mengakses database. Cek SHEET_ID!" };
    }

    const sheet = ss.getSheetByName("Kode Akses");
    if (!sheet) {
      Logger.log('ERROR: Sheet "Kode Akses" tidak ditemukan');
      return { success: false, message: "Sheet 'Kode Akses' belum dibuat! Buat sheet dengan nama 'Kode Akses'." };
    }

    const kodeAsli = sheet.getRange("A1").getValue();
    Logger.log('Code from sheet: ' + kodeAsli);
    Logger.log('Code match: ' + (kodeInput == kodeAsli));

    if (kodeInput == kodeAsli) {
      Logger.log('Login SUCCESS');
      return { success: true, message: "Login Berhasil!" };
    }

    Logger.log('Login FAILED - wrong code');
    return { success: false, message: "Kode Akses Salah!" };
  } catch (e) {
    Logger.log('ERROR: ' + e.toString());
    return { success: false, message: "Error: " + e.toString() };
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
    
    // Parse tanggal dengan benar
    let tanggalInput = new Date(dataForm.tanggal);
    
    // Pastikan format tanggal: YYYY-MM-DD
    const tahun = tanggalInput.getFullYear();
    const bulan = String(tanggalInput.getMonth() + 1).padStart(2, '0');
    const hari = String(tanggalInput.getDate()).padStart(2, '0');
    const tanggalFormatted = tahun + '-' + bulan + '-' + hari;

    sheet.appendRow([
      timestamp,
      tanggalFormatted,  // Simpan dalam format YYYY-MM-DD
      dataForm.nama,
      dataForm.noHp,
      dataForm.jenis,
      dataForm.media,
      dataForm.petugas,
      dataForm.isi,
      dataForm.jawaban || ""  // Jawaban petugas bisa kosong
    ]);

    Logger.log('Laporan berhasil disimpan - Tanggal: ' + tanggalFormatted);
    return { success: true, message: "Data berhasil disimpan ke Database!" };
  } catch (e) {
    Logger.log('Error in simpanLaporan: ' + e.toString());
    return { success: false, message: "Gagal menyimpan data ke spreadsheet: " + e.toString() };
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

/**
 * Fungsi untuk mendapatkan statistik laporan (dengan opsi filter tahun)
 */
function getStatistikLaporan(tahun) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName("Data Pengaduan");
    if (!sheet) return { total: 0, masuk: 0, selesai: 0 };

    const data = sheet.getDataRange().getValues();
    let totalLaporan = 0;
    let selesai = 0;

    // Jika tahun tidak diberikan, gunakan tahun sekarang
    const filterTahun = tahun || new Date().getFullYear();

    if (data.length > 1) {
      for (let i = 1; i < data.length; i++) {
        try {
          // Parse tanggal dari kolom B (index 1)
          let tanggalValue = data[i][1];
          let tanggal;

          if (tanggalValue instanceof Date) {
            tanggal = tanggalValue;
          } else if (typeof tanggalValue === 'string') {
            tanggal = new Date(tanggalValue);
          } else if (typeof tanggalValue === 'number') {
            tanggal = new Date((tanggalValue - 25569) * 86400 * 1000);
          } else {
            continue;
          }

          // Cek apakah tahun cocok
          if (tanggal.getFullYear() == filterTahun) {
            totalLaporan++;
            
            // Cek apakah jawaban (kolom I, index 8) tidak kosong = selesai
            if (data[i][8] && data[i][8] !== "") {
              selesai++;
            }
          }
        } catch(e) {
          continue;
        }
      }
    }

    return {
      total: totalLaporan,
      masuk: totalLaporan - selesai,  // Belum selesai
      selesai: selesai
    };
  } catch(e) {
    Logger.log('Error in getStatistikLaporan: ' + e.toString());
    return { total: 0, masuk: 0, selesai: 0 };
  }
}

/**
 * Fungsi untuk mendapatkan data laporan untuk grafik (per bulan)
 */
function getLaporanPerBulan(tahun) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName("Data Pengaduan");
    if (!sheet) return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    const data = sheet.getDataRange().getValues();
    const bulan = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // 12 bulan

    for (let i = 1; i < data.length; i++) {
      try {
        let tanggalValue = data[i][1]; // Kolom B - Tanggal (index 1)
        
        // Handle jika sudah Date object
        let tanggal;
        if (tanggalValue instanceof Date) {
          tanggal = tanggalValue;
        } else if (typeof tanggalValue === 'string') {
          tanggal = new Date(tanggalValue);
        } else if (typeof tanggalValue === 'number') {
          // Google Sheets serial date
          tanggal = new Date((tanggalValue - 25569) * 86400 * 1000);
        } else {
          continue;
        }

        // Cek apakah tahun cocok
        if (tanggal.getFullYear() == tahun) {
          const bulanIndex = tanggal.getMonth();
          bulan[bulanIndex]++;
        }
      } catch(e) {
        // Skip row yang error
        Logger.log('Error parsing row ' + i + ': ' + e.toString());
        continue;
      }
    }

    return bulan;
  } catch(e) {
    Logger.log('Error in getLaporanPerBulan: ' + e.toString());
    return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  }
}

/**
 * Fungsi untuk mendapatkan data laporan berdasarkan media (dengan filter tahun)
 */
function getLaporanPerMedia(tahun) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName("Data Pengaduan");
    if (!sheet) return {};

    // Default: semua media types dengan count 0
    const mediaCount = {
      "Kotak Saran dan Pengaduan": 0,
      "Pengaduan Tatap Muka": 0,
      "Email": 0,
      "WhatsApp": 0,
      "Instagram": 0,
      "Web BPS Boyolali": 0
    };

    const data = sheet.getDataRange().getValues();
    
    // Jika tahun tidak diberikan, gunakan tahun sekarang
    const filterTahun = tahun || new Date().getFullYear();

    for (let i = 1; i < data.length; i++) {
      try {
        // Parse tanggal dari kolom B (index 1)
        let tanggalValue = data[i][1];
        let tanggal;

        if (tanggalValue instanceof Date) {
          tanggal = tanggalValue;
        } else if (typeof tanggalValue === 'string') {
          tanggal = new Date(tanggalValue);
        } else if (typeof tanggalValue === 'number') {
          tanggal = new Date((tanggalValue - 25569) * 86400 * 1000);
        } else {
          continue;
        }

        // Cek apakah tahun cocok
        if (tanggal.getFullYear() == filterTahun) {
          const media = data[i][5]; // Kolom F - Media Pengaduan (index 5)
          if (media && mediaCount.hasOwnProperty(media)) {
            mediaCount[media]++;
          }
        }
      } catch(e) {
        continue;
      }
    }

    return mediaCount;
  } catch(e) {
    return {};
  }
}
