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

test_that("Soal 4: Fungsi analisis_kapabilitas_proses terdefinisi dan menghasilkan output list", {
  expect_true(exists("analisis_kapabilitas_proses"), info = "Fungsi analisis_kapabilitas_proses harus didefinisikan")
  x <- c(20.1, 20.2, 19.9, 20.0, 20.3)
  res <- analisis_kapabilitas_proses(x, usl = 22, lsl = 18)
  
  expect_true(is.list(res), info = "Output harus berupa list")
  required_names <- c("mean", "sd", "cp", "cpk", "shapiro_p_value", "status_kapabel")
  expect_true(all(required_names %in% names(res)), info = "Komponen mean, sd, cp, cpk, shapiro_p_value, status_kapabel harus ada")
})

test_that("Soal 4: Perhitungan nilai Cp, Cpk, dan uji normalitas tepat", {
  x <- c(10.2, 9.8, 10.0, 10.1, 9.9, 10.3, 9.7, 10.0)
  usl <- 12.0
  lsl <- 8.0
  
  res <- analisis_kapabilitas_proses(x, usl = usl, lsl = lsl)
  
  s_mean <- mean(x)
  s_sd <- sd(x)
  expected_cp <- (usl - lsl) / (6 * s_sd)
  expected_cpk <- min((usl - s_mean) / (3 * s_sd), (s_mean - lsl) / (3 * s_sd))
  expected_shapiro <- shapiro.test(x)$p.value
  
  expect_equal(res$mean, s_mean, tolerance = 1e-4)
  expect_equal(res$sd, s_sd, tolerance = 1e-4)
  expect_equal(res$cp, expected_cp, tolerance = 1e-4)
  expect_equal(res$cpk, expected_cpk, tolerance = 1e-4)
  expect_equal(res$shapiro_p_value, expected_shapiro, tolerance = 1e-4)
})

test_that("Soal 4: Evaluasi status_kapabel sesuai ambang batas industri (Cp >= 1.33)", {
  x_presisi <- c(10.01, 10.02, 9.99, 10.00, 10.01, 9.98)
  res_presisi <- analisis_kapabilitas_proses(x_presisi, usl = 11.0, lsl = 9.0)
  expect_true(res_presisi$status_kapabel)
  
  x_lebar <- c(15, 5, 12, 8, 14, 6)
  res_lebar <- analisis_kapabilitas_proses(x_lebar, usl = 11.0, lsl = 9.0)
  expect_false(res_lebar$status_kapabel)
})
