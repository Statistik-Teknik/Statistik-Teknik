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

test_that("Soal 3: Fungsi analisis_regresi_linier terdefinisi dan menghasilkan output yang tepat", {
  expect_true(exists("analisis_regresi_linier"), info = "Fungsi analisis_regresi_linier harus didefinisikan")
  x <- c(1, 2, 3, 4, 5)
  y <- c(2, 4, 6, 8, 10)
  res <- analisis_regresi_linier(x, y)
  
  expect_true(is.list(res), info = "Output harus berupa list")
  required_names <- c("r", "r_squared", "intercept", "slope", "prediksi")
  expect_true(all(required_names %in% names(res)), info = "List harus memuat r, r_squared, intercept, slope, dan prediksi")
  expect_true(is.function(res$prediksi), info = "Komponen 'prediksi' harus berupa fungsi/closure")
})

test_that("Soal 3: Parameter regresi dan korelasi dihitung dengan benar", {
  x <- c(40, 50, 60, 70, 80)
  y <- c(1.2, 1.6, 2.1, 2.7, 3.2)
  
  res <- analisis_regresi_linier(x, y)
  model_asli <- lm(y ~ x)
  coef_asli <- coef(model_asli)
  r_asli <- cor(x, y)
  r2_asli <- summary(model_asli)$r.squared
  
  expect_equal(res$r, r_asli, tolerance = 1e-4)
  expect_equal(res$r_squared, r2_asli, tolerance = 1e-4)
  expect_equal(res$intercept, unname(coef_asli[1]), tolerance = 1e-4)
  expect_equal(res$slope, unname(coef_asli[2]), tolerance = 1e-4)
})

test_that("Soal 3: Fungsi prediksi menghasilkan nilai proyeksi yang tepat", {
  x <- c(10, 20, 30)
  y <- c(20, 40, 60) # y = 0 + 2*x
  res <- analisis_regresi_linier(x, y)
  
  pred_50 <- res$prediksi(50)
  expect_equal(pred_50, 100, tolerance = 1e-4)
  
  pred_vector <- res$prediksi(c(15, 25))
  expect_equal(pred_vector, c(30, 50), tolerance = 1e-4)
})
