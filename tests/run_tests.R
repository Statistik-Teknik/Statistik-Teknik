# ==============================================================================
# LOCAL AUTOGRADER RUNNER - PRAKTIKUM STATISTIK TEKNIK
# ==============================================================================
# Skrip ini digunakan untuk menguji tugas mahasiswa secara lokal.
# Cara menjalankan dari terminal:
# Rscript tests/run_tests.R
# ==============================================================================

suppressPackageStartupMessages({
  if (!require("testthat", quietly = TRUE)) {
    stop("Paket 'testthat' belum terinstall. Install dengan: install.packages('testthat')")
  }
})

cat("\n================================================================\n")
cat("   PENGUJIAN TUGAS PRAKTIKUM STATISTIK TEKNIK (LOCAL AUTOGRADER)\n")
cat("================================================================\n\n")

# Konfigurasi daftar soal dan bobot
soal_list <- list(
  list(file = "tests/test_soal1.R", nama = "Soal 1: Statistik Deskriptif", bobot = 25),
  list(file = "tests/test_soal2.R", nama = "Soal 2: Uji Hipotesis t-Test", bobot = 25),
  list(file = "tests/test_soal3.R", nama = "Soal 3: Korelasi & Regresi Linier", bobot = 25),
  list(file = "tests/test_soal4.R", nama = "Soal 4: Analisis Kapabilitas Proses", bobot = 25)
)

total_skor <- 0
skor_maksimal <- 100

for (item in soal_list) {
  cat(sprintf("[*] Menjalankan %s (Bobot: %d Poin)...\n", item$nama, item$bobot))
  
  test_res <- tryCatch({
    test_results <- testthat::test_file(item$file, reporter = "silent")
    as.data.frame(test_results)
  }, error = function(e) {
    cat(sprintf("    [ERROR] Terjadi kegagalan eksekusi test: %s\n", e$message))
    NULL
  })
  
  if (is.null(test_res) || nrow(test_res) == 0) {
    cat("    Status : [FAIL] Tidak ada test yang berhasil dilewati.\n")
    cat("    Skor   : 0 / ", item$bobot, "\n\n")
    next
  }
  
  failed_tests <- sum(test_res$failed)
  error_tests <- sum(test_res$error)
  passed_tests <- sum(test_res$passed)
  total_subtests <- nrow(test_res)
  
  if (failed_tests == 0 && error_tests == 0) {
    total_skor <- total_skor + item$bobot
    cat(sprintf("    Status : [PASS] Semua %d subtest berhasil!\n", passed_tests))
    cat(sprintf("    Skor   : %d / %d Poin\n\n", item$bobot, item$bobot))
  } else {
    prop_pass <- max(0, passed_tests / total_subtests)
    sub_skor <- round(prop_pass * item$bobot)
    total_skor <- total_skor + sub_skor
    cat(sprintf("    Status : [PARTIAL/FAIL] %d lulus, %d gagal, %d error\n", passed_tests, failed_tests, error_tests))
    cat(sprintf("    Skor   : %d / %d Poin\n\n", sub_skor, item$bobot))
  }
}

cat("================================================================\n")
cat(sprintf("RINGKASAN SKOR AKHIR: %d / %d\n", total_skor, skor_maksimal))
if (total_skor == 100) {
  cat("HASIL: SEMPURNA! Kode Anda lulus semua pengujian unit test.\n")
} else {
  cat("HASIL: Beberapa pengujian belum berhasil. Silakan periksa pesan error di atas.\n")
}
cat("================================================================\n\n")
