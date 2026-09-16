# Praktikum Statistik Teknik: Analisis Data Rekayasa & Pengendalian Mutu

[![GitHub Classroom Autograding](../../actions/workflows/classroom.yml/badge.svg)](../../actions/workflows/classroom.yml)

Selamat datang di repositori tugas praktikum mata kuliah **Statistik Teknik** (*Engineering Statistics*). Praktikum ini dirancang untuk melatih pemahaman konsep statistika terapan di bidang rekayasa dan manufaktur menggunakan bahasa pemrograman **R**.

---

## 🎯 Tujuan Praktikum
Setelah menyelesaikan praktikum ini, mahasiswa diharapkan mampu:
1. Melakukan komputasi **statistika deskriptif** dan **deteksi pencilan (*outliers*)** dengan metode IQR pada data pengujian kekuatan material.
2. Melakukan **uji hipotesis satu sampel (*one-sample t-test*)** untuk menguji kesesuaian produk terhadap standar mutu teknis.
3. Membangun model **korelasi Pearson** dan **regresi linier sederhana** untuk menganalisis hubungan antar variabel fisik mesin (suhu vs getaran).
4. Menghitung **indeks kapabilitas proses ($C_p$ dan $C_{pk}$)** serta melakukan uji asumsi normalitas distribusi (*Shapiro-Wilk Test*).

---

## 📁 Struktur Direktori Repositori
```text
.
├── .github/
│   ├── classroom/
│   │   └── autograding.json       # Konfigurasi uji GitHub Classroom
│   └── workflows/
│       └── classroom.yml          # GitHub Actions workflow untuk autograding otomatis
├── data/
│   ├── uji_beton.csv              # Dataset kuat tekan silinder beton (MPa)
│   └── suhu_getaran_mesin.csv     # Dataset suhu operasi (°C) dan getaran mesin (RMS)
├── tests/
│   ├── test_soal1.R               # Unit test Soal 1 (25 Poin)
│   ├── test_soal2.R               # Unit test Soal 2 (25 Poin)
│   ├── test_soal3.R               # Unit test Soal 3 (25 Poin)
│   ├── test_soal4.R               # Unit test Soal 4 (25 Poin)
│   └── run_tests.R                # Skrip local autograder untuk pengujian mandiri
├── assignment.Rmd                 # Template Laporan Praktikum (R Markdown)
├── tugas_mahasiswa.R              # File kerja utama (Lengkapi fungsi di sini!)
├── PANDUAN_GITHUB_CLASSROOM.md    # Panduan konfigurasi GitHub Classroom bagi Dosen/Asisten
├── setup_and_push.sh              # Skrip inisialisasi git & push repository
└── README.md                      # Petunjuk praktikum ini
```

---

## 📝 Deskripsi Tugas & Rubrik Penilaian (Total: 100 Poin)

Seluruh fungsi yang harus dikerjakan berada di dalam file [`tugas_mahasiswa.R`](tugas_mahasiswa.R).

### Soal 1: Statistik Deskriptif & Deteksi Pencilan (25 Poin)
- **Nama Fungsi**: `hitung_statistik_deskriptif(x)`
- **Input**: Vektor numerik `x`.
- **Output**: `list` dengan atribut:
  - `mean`: Nilai rata-rata sampel.
  - `median`: Nilai median.
  - `sd`: Simpangan baku sampel ($s$).
  - `var`: Varians sampel ($s^2$).
  - `min`: Nilai minimum.
  - `max`: Nilai maksimum.
  - `iqr`: Rentang interkuartil ($IQR = Q_3 - Q_1$).
  - `outliers`: Vektor numerik data yang berada di luar rentang $[Q_1 - 1.5 \times IQR, \; Q_3 + 1.5 \times IQR]$.

### Soal 2: Uji Hipotesis Standar Mutu Produk (25 Poin)
- **Nama Fungsi**: `uji_standar_kekuatan(sampel, mu_standar, alpha = 0.05)`
- **Input**: Vektor data `sampel`, nilai acuan spesifikasi `mu_standar`, dan ambang signifikansi `alpha`.
- **Output**: `list` dengan atribut:
  - `t_stat`: Nilai $t$-hitung.
  - `df`: Derajat kebebasan (*degrees of freedom*, $n - 1$).
  - `p_value`: Nilai $p$-value uji dua arah (*two-sided*).
  - `tolak_h0`: Boolean (`TRUE` jika $p\text{-value} < \alpha$, sebaliknya `FALSE`).
  - `kesimpulan`: Karakter `"Tolak H0"` atau `"Gagal Tolak H0"`.

### Soal 3: Korelasi dan Regresi Linier Sederhana (25 Poin)
- **Nama Fungsi**: `analisis_regresi_linier(x, y)`
- **Input**: Vektor variabel independen `x` (suhu operasi) dan variabel dependen `y` (getaran).
- **Output**: `list` dengan atribut:
  - `r`: Koefisien korelasi Pearson.
  - `r_squared`: Koefisien determinasi ($R^2$).
  - `intercept`: Nilai intersep/titik potong sumbu-Y ($b_0$).
  - `slope`: Nilai koefisien kemiringan regresi ($b_1$).
  - `prediksi`: Fungsi penaksir yang menerima parameter `x_new` dan mengembalikan nilai estimasi $y_{\text{pred}} = b_0 + b_1 \cdot x_{\text{new}}$.

### Soal 4: Analisis Kapabilitas Proses Produksi (25 Poin)
- **Nama Fungsi**: `analisis_kapabilitas_proses(x, usl, lsl)`
- **Input**: Vektor data proses `x`, Upper Specification Limit `usl`, Lower Specification Limit `lsl`.
- **Output**: `list` dengan atribut:
  - `mean`: Rata-rata sampel ($\bar{x}$).
  - `sd`: Standar deviasi sampel ($s$).
  - `cp`: Indeks kapabilitas proses:
    $$C_p = \frac{\text{USL} - \text{LSL}}{6s}$$
  - `cpk`: Indeks kapabilitas terpusat:
    $$C_{pk} = \min\left(\frac{\text{USL} - \bar{x}}{3s}, \; \frac{\bar{x} - \text{LSL}}{3s}\right)$$
  - `shapiro_p_value`: Nilai $p$-value uji kenormalan data metode Shapiro-Wilk.
  - `status_kapabel`: Boolean (`TRUE` jika $C_p \ge 1.33$, sebaliknya `FALSE`).

---

## 🚀 Alur Kerja Mahasiswa

### 1. Kloning Repositori
Setelah menerima tautan undangan GitHub Classroom dari Dosen/Asisten, kloning repositori pribadi Anda:
```bash
git clone https://github.com/Statistik-Teknik/<nama-repo-tugas-anda>.git
cd <nama-repo-tugas-anda>
```

### 2. Mengerjakan Kode Tugas
Buka file [`tugas_mahasiswa.R`](tugas_mahasiswa.R) menggunakan RStudio, VS Code, atau editor pilihan Anda. Lengkapi kode di dalam blok fungsi yang memiliki komentar `# TODO`.

### 3. Pengujian Mandiri (Local Autograder)
Sebelum melakukan pengumpulan, uji kode Anda di komputer lokal untuk melihat perolehan skor awal:
```bash
Rscript tests/run_tests.R
```
Jika seluruh pengujian berhasil, skor lokal akan menampilkan:
```text
================================================================
RINGKASAN SKOR AKHIR: 100 / 100
HASIL: SEMPURNA! Kode Anda lulus semua pengujian unit test.
================================================================
```

### 4. Mengisi Laporan Praktikum (Opsional / Penugasan Laporan)
Buka [`assignment.Rmd`](assignment.Rmd) pada RStudio lalu klik tombol **Knit** (atau jalankan `rmarkdown::render("assignment.Rmd")`) untuk membuat laporan berformat HTML berisi visualisasi grafik dan interpretasi rekayasa.

### 5. Mengumpulkan Tugas (Commit & Push)
Simpan perubahan dan kirim (*push*) ke GitHub:
```bash
git add tugas_mahasiswa.R assignment.Rmd
git commit -m "feat: implementasi fungsi praktikum statistik teknik"
git push origin main
```
Sistem **GitHub Classroom Autograding** akan otomatis mengeksekusi tes di GitHub Actions dan memberikan umpan balik nilai secara langsung.

---

## 💡 Ketentuan & Integritas Akademik
1. Dilarang mengganti nama fungsi dan struktur parameter input/output yang telah ditentukan.
2. Seluruh mahasiswa diwajibkan menuliskan kode secara mandiri.
3. Autograder akan memeriksa keakuratan perhitungan, toleransi galat numerik, tipe data kembalian, dan kelengkapan elemen list.
