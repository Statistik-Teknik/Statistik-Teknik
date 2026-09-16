# ==============================================================================
# PRAKTIKUM STATISTIK TEKNIK
# LEMBAR KERJA MAHASISWA
# ==============================================================================
# Petunjuk:
# 1. Lengkapi fungsi-fungsi di bawah ini sesuai spesifikasi soal.
# 2. Jangan mengubah nama fungsi dan parameter yang telah ditentukan.
# 3. Anda dapat menguji fungsi secara lokal dengan menjalankan:
#    Rscript tests/run_tests.R
# 4. Lakukan commit dan push ke repositori Anda untuk penilaian autograding.
# ==============================================================================

# ------------------------------------------------------------------------------
# SOAL 1: Statistik Deskriptif & Deteksi Pencilan (Bobot: 25 Poin)
# ------------------------------------------------------------------------------
#' Hitung Statistik Deskriptif dan Deteksi Pencilan
#'
#' @param x Vektor numerik pengamatan (misal: data kuat tekan beton)
#' @return List berisi komponen:
#'   - mean     : Rata-rata sampel
#'   - median   : Nilai tengah (median)
#'   - sd       : Standar deviasi sampel
#'   - var      : Varians sampel
#'   - min      : Nilai minimum
#'   - max      : Nilai maksimum
#'   - iqr      : Interquartile range (Q3 - Q1)
#'   - outliers : Vektor numerik data yang berada di luar [Q1 - 1.5*IQR, Q3 + 1.5*IQR]
hitung_statistik_deskriptif <- function(x) {
  # TODO: Tuliskan kode Anda di sini
  # Petunjuk: gunakan fungsi mean(), median(), sd(), var(), min(), max(), quantile()
  
  NULL # Ganti NULL dengan list hasil perhitungan
}

# ------------------------------------------------------------------------------
# SOAL 2: Uji Hipotesis Kekuatan Material (Bobot: 25 Poin)
# ------------------------------------------------------------------------------
#' Uji Standar Kekuatan Material (One-Sample t-Test)
#'
#' @param sampel Vektor numerik data hasil pengujian material
#' @param mu_standar Nilai acuan/standar spesifikasi yang diuji (H0: mu = mu_standar)
#' @param alpha Tingkat signifikansi (default: 0.05)
#' @return List berisi komponen:
#'   - t_stat     : Nilai statistik uji t
#'   - df         : Derajat kebebasan (degrees of freedom)
#'   - p_value    : Nilai p-value hasil uji dua arah (two-sided)
#'   - tolak_h0   : Boolean (TRUE jika p_value < alpha, FALSE jika tidak)
#'   - kesimpulan : Karakter "Tolak H0" atau "Gagal Tolak H0"
uji_standar_kekuatan <- function(sampel, mu_standar, alpha = 0.05) {
  # TODO: Tuliskan kode Anda di sini
  # Petunjuk: gunakan fungsi t.test() dengan alternative = "two.sided"
  
  NULL # Ganti NULL dengan list hasil perhitungan
}

# ------------------------------------------------------------------------------
# SOAL 3: Analisis Korelasi & Regresi Linier Sederhana (Bobot: 25 Poin)
# ------------------------------------------------------------------------------
#' Analisis Regresi Linier Sederhana (Suhu vs Getaran Mesin)
#'
#' @param x Vektor numerik variabel independen (misal: suhu operasi)
#' @param y Vektor numerik variabel dependen (misal: getaran mesin)
#' @return List berisi komponen:
#'   - r         : Koefisien korelasi Pearson antara x dan y
#'   - r_squared : Koefisien determinasi R^2
#'   - intercept : Konstanta regresi (b0)
#'   - slope     : Kemiringan regresi (b1)
#'   - prediksi  : Fungsi (closure) dengan satu argumen x_new untuk memprediksi y_pred
analisis_regresi_linier <- function(x, y) {
  # TODO: Tuliskan kode Anda di sini
  # Petunjuk: gunakan cor() dan lm(y ~ x)
  
  NULL # Ganti NULL dengan list hasil perhitungan
}

# ------------------------------------------------------------------------------
# SOAL 4: Analisis Kapabilitas Proses Produksi (Bobot: 25 Poin)
# ------------------------------------------------------------------------------
#' Analisis Kapabilitas Proses (Process Capability Index)
#'
#' @param x Vektor numerik data pengukuran proses
#' @param usl Upper Specification Limit (Batas Spesifikasi Atas)
#' @param lsl Lower Specification Limit (Batas Spesifikasi Bawah)
#' @return List berisi komponen:
#'   - mean            : Rata-rata sampel
#'   - sd              : Standar deviasi sampel
#'   - cp              : Indeks kapabilitas proses Cp = (USL - LSL) / (6 * sd)
#'   - cpk             : Indeks Cpk = min((USL - mean)/(3*sd), (mean - LSL)/(3*sd))
#'   - shapiro_p_value : Nilai p-value uji normalitas Shapiro-Wilk
#'   - status_kapabel  : Boolean (TRUE jika cp >= 1.33, FALSE jika belum kapabel)
analisis_kapabilitas_proses <- function(x, usl, lsl) {
  # TODO: Tuliskan kode Anda di sini
  # Petunjuk: hitung Cp, Cpk, dan shapiro.test(x)
  
  NULL # Ganti NULL dengan list hasil perhitungan
}
