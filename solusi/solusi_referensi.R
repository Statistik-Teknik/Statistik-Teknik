# ==============================================================================
# PRAKTIKUM STATISTIK TEKNIK - KUNCI JAWABAN REFERENSI
# ==============================================================================
# File ini merupakan referensi implementasi untuk dosen dan asisten pengampu.
# ==============================================================================

#' Hitung Statistik Deskriptif dan Deteksi Pencilan
#' @param x Vektor numerik data pengamatan
#' @return List berisi mean, median, sd, var, min, max, iqr, dan outliers
hitung_statistik_deskriptif <- function(x) {
  if (!is.numeric(x) || length(x) == 0) {
    stop("Input harus berupa vektor numerik tidak kosong")
  }
  
  mean_val <- mean(x, na.rm = TRUE)
  median_val <- median(x, na.rm = TRUE)
  sd_val <- sd(x, na.rm = TRUE)
  var_val <- var(x, na.rm = TRUE)
  min_val <- min(x, na.rm = TRUE)
  max_val <- max(x, na.rm = TRUE)
  
  # Perhitungan IQR dan deteksi outlier
  q1 <- unname(quantile(x, 0.25, na.rm = TRUE))
  q3 <- unname(quantile(x, 0.75, na.rm = TRUE))
  iqr_val <- q3 - q1
  lower_bound <- q1 - 1.5 * iqr_val
  upper_bound <- q3 + 1.5 * iqr_val
  
  outliers <- x[x < lower_bound | x > upper_bound]
  
  list(
    mean = as.numeric(mean_val),
    median = as.numeric(median_val),
    sd = as.numeric(sd_val),
    var = as.numeric(var_val),
    min = as.numeric(min_val),
    max = as.numeric(max_val),
    iqr = as.numeric(iqr_val),
    outliers = as.numeric(outliers)
  )
}

#' Uji Standar Kekuatan Material (One-Sample t-Test)
#' @param sampel Vektor numerik sampel data hasil pengujian
#' @param mu_standar Nilai acuan/standar spesifikasi yang diuji (H0: mu = mu_standar)
#' @param alpha Tingkat signifikansi (default = 0.05)
#' @return List berisi t_stat, df, p_value, tolak_h0, dan kesimpulan
uji_standar_kekuatan <- function(sampel, mu_standar, alpha = 0.05) {
  if (!is.numeric(sampel) || length(sampel) < 2) {
    stop("Sampel harus berupa vektor numerik dengan ukuran minimal 2")
  }
  
  test_res <- t.test(sampel, mu = mu_standar, alternative = "two.sided")
  t_stat <- unname(test_res$statistic)
  df_val <- unname(test_res$parameter)
  p_val <- as.numeric(test_res$p.value)
  
  tolak <- p_val < alpha
  kesimpulan <- if (tolak) "Tolak H0" else "Gagal Tolak H0"
  
  list(
    t_stat = as.numeric(t_stat),
    df = as.numeric(df_val),
    p_value = as.numeric(p_val),
    tolak_h0 = tolak,
    kesimpulan = kesimpulan
  )
}

#' Analisis Regresi Linier Sederhana
#' @param x Vektor numerik variabel independen (misal: suhu)
#' @param y Vektor numerik variabel dependen (misal: getaran)
#' @return List berisi r (korelasi), r_squared, intercept, slope, dan fungsi prediksi
analisis_regresi_linier <- function(x, y) {
  if (length(x) != length(y) || length(x) < 2) {
    stop("Vektor x dan y harus memiliki panjang sama dan minimal 2 elemen")
  }
  
  r_val <- cor(x, y)
  model <- lm(y ~ x)
  coefs <- coef(model)
  b0 <- unname(coefs[1])
  b1 <- unname(coefs[2])
  r2 <- unname(summary(model)$r.squared)
  
  prediksi_func <- function(x_new) {
    b0 + b1 * x_new
  }
  
  list(
    r = as.numeric(r_val),
    r_squared = as.numeric(r2),
    intercept = as.numeric(b0),
    slope = as.numeric(b1),
    prediksi = prediksi_func
  )
}

#' Analisis Kapabilitas Proses (Process Capability Index)
#' @param x Vektor numerik data pengukuran proses
#' @param usl Upper Specification Limit (Batas Spesifikasi Atas)
#' @param lsl Lower Specification Limit (Batas Spesifikasi Bawah)
#' @return List berisi mean, sd, cp, cpk, shapiro_p_value, dan status_kapabel
analisis_kapabilitas_proses <- function(x, usl, lsl) {
  if (!is.numeric(x) || length(x) < 3) {
    stop("Data harus berupa vektor numerik minimal 3 pengamatan")
  }
  if (usl <= lsl) {
    stop("USL harus lebih besar dari LSL")
  }
  
  mean_val <- mean(x, na.rm = TRUE)
  sd_val <- sd(x, na.rm = TRUE)
  
  cp_val <- (usl - lsl) / (6 * sd_val)
  cpu <- (usl - mean_val) / (3 * sd_val)
  cpl <- (mean_val - lsl) / (3 * sd_val)
  cpk_val <- min(cpu, cpl)
  
  # Uji normalitas Shapiro-Wilk
  norm_test <- shapiro.test(x)
  p_norm <- as.numeric(norm_test$p.value)
  
  status <- cp_val >= 1.33
  
  list(
    mean = as.numeric(mean_val),
    sd = as.numeric(sd_val),
    cp = as.numeric(cp_val),
    cpk = as.numeric(cpk_val),
    shapiro_p_value = as.numeric(p_norm),
    status_kapabel = status
  )
}
