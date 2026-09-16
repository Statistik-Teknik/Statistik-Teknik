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

test_that("Soal 2: Fungsi uji_standar_kekuatan terdefinisi dan menghasilkan output list", {
  expect_true(exists("uji_standar_kekuatan"), info = "Fungsi uji_standar_kekuatan harus didefinisikan")
  dummy <- c(30, 31, 29, 30.5, 32)
  res <- uji_standar_kekuatan(dummy, mu_standar = 30)
  expect_true(is.list(res), info = "Output harus berupa list")
  required_names <- c("t_stat", "df", "p_value", "tolak_h0", "kesimpulan")
  expect_true(all(required_names %in% names(res)), info = "Elemen t_stat, df, p_value, tolak_h0, dan kesimpulan harus ada")
})

test_that("Soal 2: Nilai uji t dan derajat kebebasan akurat", {
  sampel <- c(32, 34, 31, 33, 35, 30, 33)
  mu_0 <- 30
  res <- uji_standar_kekuatan(sampel, mu_standar = mu_0, alpha = 0.05)
  
  expected_tt <- t.test(sampel, mu = mu_0, alternative = "two.sided")
  
  expect_equal(res$t_stat, unname(expected_tt$statistic), tolerance = 1e-4)
  expect_equal(res$df, unname(expected_tt$parameter), tolerance = 1e-4)
  expect_equal(res$p_value, expected_tt$p.value, tolerance = 1e-4)
})

test_that("Soal 2: Keputusan uji hipotesis sesuai nilai alpha", {
  # Kasus di mana H0 ditolak (sampel jauh berbeda dari mu = 10)
  sampel_tolak <- c(50, 52, 51, 49, 53)
  res_tolak <- uji_standar_kekuatan(sampel_tolak, mu_standar = 10, alpha = 0.05)
  expect_true(res_tolak$tolak_h0)
  expect_equal(res_tolak$kesimpulan, "Tolak H0")
  
  # Kasus di mana gagal tolak H0 (sampel sangat dekat dengan mu = 30)
  sampel_gagal <- c(30.1, 29.9, 30.0, 30.2, 29.8)
  res_gagal <- uji_standar_kekuatan(sampel_gagal, mu_standar = 30.0, alpha = 0.05)
  expect_false(res_gagal$tolak_h0)
  expect_equal(res_gagal$kesimpulan, "Gagal Tolak H0")
})
