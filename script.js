// ==================== VERCEL / EXTERNAL API CONFIGURATION ====================
// GANTI URL INI DENGAN URL WEB APP GOOGLE APPS SCRIPT KAMU SETELAH DEPLOY!
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby31CPo9SmLfcvhyJr9Vi4h_hz4GUtTf8Id2AzWpwo-D0XBY2Ncq5wxegFiE4V-tVu55g/exec';

// Polyfill ajaib untuk mensimulasikan google.script.run menggunakan fetch API!
// Ini memungkinkan web di-hosting di Vercel/Netlify tanpa mengubah kode JS di bawahnya.
if (typeof google === 'undefined') {
  window.google = {};
}

if (!google.script) {
  window.google.script = {
    run: new Proxy({}, {
      get: function (target, prop) {
        if (prop === 'withSuccessHandler') {
          return function (handler) {
            target._successHandler = handler;
            return window.google.script.run;
          };
        }
        if (prop === 'withFailureHandler') {
          return function (handler) {
            target._failureHandler = handler;
            return window.google.script.run;
          };
        }

        // Eksekusi pemanggilan fungsi backend (misal: simpanLaporan, cekKodeAkses)
        return function (...args) {
          const successHandler = target._successHandler;
          const failureHandler = target._failureHandler;

          // Reset handlers untuk panggilan berikutnya
          target._successHandler = null;
          target._failureHandler = null;

          // Tentukan Method: POST khusus untuk simpan data, sisanya GET
          const isPost = prop === 'simpanLaporan';
          let url = SCRIPT_URL + "?action=" + prop;
          let options = { method: isPost ? 'POST' : 'GET' };

          if (isPost) {
            options.body = JSON.stringify({ action: prop, formData: args[0] });
            options.headers = { 'Content-Type': 'text/plain;charset=utf-8' }; // Hindari CORS Preflight
          } else {
            // Parsing argumen ke URL query string untuk metode GET
            if (prop === 'cekKodeAkses') url += '&kode=' + encodeURIComponent(args[0] || '');
            if (prop === 'getStatistikLaporan' || prop === 'getLaporanPerBulan' || prop === 'getLaporanPerMedia') {
              if (args[0]) url += '&tahun=' + encodeURIComponent(args[0]);
            }
          }

          fetch(url, options)
            .then(response => response.json())
            .then(result => {
              if (successHandler) successHandler(result);
            })
            .catch(error => {
              if (failureHandler) failureHandler(error);
              console.error("API Error:", error);
            });
        };
      }
    })
  };
}

let chartPerBulan = null;
let chartPerMedia = null;

// ==================== PAGE MANAGEMENT ====================
function showPage(pageName) {
  // Hide all pages
  document.getElementById('dashboardPage').classList.remove('show');
  document.getElementById('reportPage').classList.remove('show');

  // Show selected page
  if (pageName === 'dashboard') {
    document.getElementById('dashboardPage').classList.add('show');
    loadStatistik();
    document.getElementById('tanggal').valueAsDate = new Date();
  } else if (pageName === 'report') {
    document.getElementById('reportPage').classList.add('show');
    const tahun = parseInt(document.getElementById('tahunFilter').value);
    document.getElementById('tahunDisplay').textContent = tahun;
    // Delay sedikit untuk memastikan DOM sudah siap
    setTimeout(() => {
      loadCharts();
      loadSummary();
    }, 100);
  }
}

function logout() {
  if (confirm('Apakah Anda yakin ingin keluar?')) {
    // Hide all content
    document.getElementById('loginPage').classList.remove('hidden');
    document.getElementById('navbar').classList.add('hidden');
    document.getElementById('dashboardPage').classList.remove('show');
    document.getElementById('reportPage').classList.remove('show');

    // Reset login form
    document.getElementById('loginForm').reset();
    document.getElementById('kodeAkses').focus();
  }
}

function showAlert(message, type, container) {
  container.innerHTML = `<div class="alert alert-${type} show">${message}</div>`;
  setTimeout(() => {
    container.innerHTML = '';
  }, 5000);
}

// ==================== LOGIN HANDLER ====================
document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const kodeAkses = document.getElementById('kodeAkses').value.trim();
  const loginBtn = document.getElementById('loginBtn');
  const loading = document.getElementById('loadingLogin');
  const alertContainer = document.getElementById('loginAlert');

  if (!kodeAkses) {
    showAlert('❌ Kode akses tidak boleh kosong!', 'danger', alertContainer);
    return;
  }

  loginBtn.disabled = true;
  loading.classList.add('show');

  try {
    google.script.run
      .withSuccessHandler(function (result) {
        if (result.success) {
          showAlert('✅ ' + result.message, 'success', alertContainer);
          setTimeout(() => {
            // Show dashboard
            document.getElementById('loginPage').classList.add('hidden');
            document.getElementById('navbar').classList.remove('hidden');
            showPage('dashboard');
            loadDaftarPetugas();
          }, 800);
        } else {
          showAlert('❌ ' + result.message, 'danger', alertContainer);
          loginBtn.disabled = false;
          loading.classList.remove('show');
        }
      })
      .withFailureHandler(function (error) {
        showAlert('❌ Terjadi kesalahan: ' + error, 'danger', alertContainer);
        loginBtn.disabled = false;
        loading.classList.remove('show');
      })
      .cekKodeAkses(kodeAkses);
  } catch (error) {
    showAlert('❌ Terjadi kesalahan sistem', 'danger', alertContainer);
    loginBtn.disabled = false;
    loading.classList.remove('show');
  }
});

// ==================== DASHBOARD HANDLER ====================
document.getElementById('reportForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const formData = {
    tanggal: document.getElementById('tanggal').value,
    nama: document.getElementById('namaPelapor').value,
    email: document.getElementById('emailKontak').value,
    noHp: document.getElementById('nomorHp').value,
    jenis: document.getElementById('jenisPengaduan').value,
    media: document.getElementById('mediaPengaduan').value,
    petugas: document.getElementById('namaPetugas').value,
    isi: document.getElementById('isiPengaduan').value,
    jawaban: document.getElementById('jawabanPetugas').value
  };

  const alertContainer = document.getElementById('formAlert');
  const loading = document.getElementById('loadingForm');
  const submitBtn = document.querySelector('#reportForm .btn-primary');

  submitBtn.disabled = true;
  loading.classList.add('show');

  try {
    google.script.run
      .withSuccessHandler(function (result) {
        if (result.success) {
          showAlert('✅ ' + result.message, 'success', alertContainer);
          document.getElementById('reportForm').reset();
          document.getElementById('tanggal').valueAsDate = new Date();
          setTimeout(() => {
            loadStatistik();
          }, 1000);
        } else {
          showAlert('❌ ' + result.message, 'danger', alertContainer);
        }
        submitBtn.disabled = false;
        loading.classList.remove('show');
      })
      .withFailureHandler(function (error) {
        showAlert('❌ Terjadi kesalahan: ' + error, 'danger', alertContainer);
        submitBtn.disabled = false;
        loading.classList.remove('show');
      })
      .simpanLaporan(formData);
  } catch (error) {
    showAlert('❌ Terjadi kesalahan sistem', 'danger', alertContainer);
    submitBtn.disabled = false;
    loading.classList.remove('show');
  }
});

// ==================== REPORT HANDLERS ====================
document.getElementById('tahunFilter').addEventListener('change', function () {
  document.getElementById('tahunDisplay').textContent = this.value;
  loadCharts();
  loadSummary();
});

function loadCharts() {
  const tahun = parseInt(document.getElementById('tahunFilter').value);

  document.getElementById('loadingMonthly').classList.add('show');
  google.script.run
    .withSuccessHandler(function (data) {
      document.getElementById('loadingMonthly').classList.remove('show');
      renderChartBulan(data, tahun);
      renderTableBulan(data);
    })
    .getLaporanPerBulan(tahun);

  document.getElementById('loadingMedia').classList.add('show');
  google.script.run
    .withSuccessHandler(function (data) {
      document.getElementById('loadingMedia').classList.remove('show');
      renderChartMedia(data);
      renderTableMedia(data);
    })
    .getLaporanPerMedia(tahun);
}

function loadSummary() {
  const tahun = parseInt(document.getElementById('tahunFilter').value);

  google.script.run
    .withSuccessHandler(function (data) {
      document.getElementById('summaryTotal').textContent = data.total;
      document.getElementById('summaryMasuk').textContent = data.masuk;
    })
    .getStatistikLaporan(tahun);
}

function renderChartBulan(data, tahun) {
  const ctx = document.getElementById('chartPerBulan').getContext('2d');

  if (chartPerBulan) {
    chartPerBulan.destroy();
  }

  const labels = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  chartPerBulan = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Jumlah Laporan',
        data: data,
        backgroundColor: [
          '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe',
          '#dbeafe', '#eff6ff', '#3b82f6', '#60a5fa',
          '#93c5fd', '#bfdbfe', '#dbeafe', '#eff6ff'
        ],
        borderColor: '#1e40af',
        borderWidth: 1,
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: Math.max(...data) + 5,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });
}

function renderChartMedia(data) {
  const ctx = document.getElementById('chartPerMedia').getContext('2d');

  if (chartPerMedia) {
    chartPerMedia.destroy();
  }

  const labels = Object.keys(data);
  const values = Object.values(data);

  const colors = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
    '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'
  ];

  chartPerMedia = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: colors.slice(0, labels.length),
        borderColor: 'white',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}

function renderTableBulan(data) {
  const labels = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  let tableHTML = '';
  data.forEach((count, index) => {
    tableHTML += `
          <tr>
            <td>${labels[index]}</td>
            <td class="text-right"><strong>${count}</strong></td>
          </tr>
        `;
  });

  document.getElementById('tablePerBulanBody').innerHTML = tableHTML;
}

function renderTableMedia(data) {
  let tableHTML = '';
  let total = 0;

  Object.entries(data).forEach(([media, count]) => {
    total += count;
    tableHTML += `
          <tr>
            <td>${media}</td>
            <td class="text-right"><strong>${count}</strong></td>
          </tr>
        `;
  });

  // Tambah total row
  if (total > 0) {
    tableHTML += `
          <tr style="background: var(--bg-color); font-weight: bold; border-top: 2px solid var(--border-color);">
            <td>TOTAL</td>
            <td class="text-right">${total}</td>
          </tr>
        `;
  }

  document.getElementById('tablePerMediaBody').innerHTML = tableHTML || '<tr><td colspan="2" class="text-center">Tidak ada data</td></tr>';
}

// ==================== DATA LOADERS ====================
function loadStatistik() {
  google.script.run
    .withSuccessHandler(function (data) {
      document.getElementById('totalLaporan').textContent = data.total;
      document.getElementById('pengaduanMasuk').textContent = data.masuk;
    })
    .getStatistikLaporan();
}

function loadDaftarPetugas() {
  google.script.run
    .withSuccessHandler(function (petugas) {
      const select = document.getElementById('namaPetugas');
      petugas.forEach(nama => {
        const option = document.createElement('option');
        option.value = nama;
        option.textContent = nama;
        select.appendChild(option);
      });
    })
    .getDaftarPetugas();
}