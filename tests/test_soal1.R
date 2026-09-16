library(testthat)

find_target_file <- function() {
  env_file <- Sys.getenv("TARGET_FILE", "")
  candidates <- c(
    env_file,
    file.path("..", env_file),
    "tugas_mahasiswa.R",
    "../tugas_mahasiswa.R",
    "../../tugas_mahasiswa.R"
  )
  for (c_file in candidates) {
    if (nzchar(c_file) && file.exists(c_file)) {
      return(normalizePath(c_file))
    }
  }
  stop("File sumber tugas mahasiswa tidak ditemukan!")
}

source(find_target_file())

test_that("Soal 1: Fungsi hitung_statistik_deskriptif terdefinisi dan menghasilkan output list", {
  expect_true(exists("hitung_statistik_deskriptif"), info = "Fungsi hitung_statistik_deskriptif harus didefinisikan")
  dummy <- c(10, 20, 30, 40, 50)
  res <- hitung_statistik_deskriptif(dummy)
  expect_true(is.list(res), info = "Output harus berupa list")
  required_names <- c("mean", "median", "sd", "var", "min", "max", "iqr", "outliers")
  expect_true(all(required_names %in% names(res)), info = "List harus memuat seluruh nama elemen yang dipersyaratkan")
})

test_that("Soal 1: Perhitungan nilai statistik deskriptif dasar akurat", {
  data_uji <- c(24, 28, 30, 32, 36)
  res <- hitung_statistik_deskriptif(data_uji)
  
  expect_equal(res$mean, 30, tolerance = 1e-4)
  expect_equal(res$median, 30, tolerance = 1e-4)
  expect_equal(res$min, 24, tolerance = 1e-4)
  expect_equal(res$max, 36, tolerance = 1e-4)
  expect_equal(res$var, var(data_uji), tolerance = 1e-4)
  expect_equal(res$sd, sd(data_uji), tolerance = 1e-4)
})

test_that("Soal 1: Deteksi pencilan/outlier dengan metode IQR berfungsi tepat", {
  data_dengan_outlier <- c(12, 14, 15, 15, 16, 17, 18, 19, 100)
  res <- hitung_statistik_deskriptif(data_dengan_outlier)
  
  expect_true(length(res$outliers) > 0, info = "Harus terdeteksi minimal 1 outlier")
  expect_true(100 %in% res$outliers, info = "Nilai 100 harus terdeteksi sebagai outlier")
  
  data_normal <- c(10, 11, 12, 13, 14, 15)
  res_bersih <- hitung_statistik_deskriptif(data_normal)
  expect_equal(length(res_bersih$outliers), 0, info = "Data normal tidak boleh menghasilkan outlier")
})
