# Panduan Praktikum Statistik Teknik
## Organisasi: `Statistik-Teknik` (https://github.com/Statistik-Teknik)

> [!WARNING]
> **Pemberitahuan Resmi GitHub:**
> Layanan **GitHub Classroom (`classroom.github.com`) telah resmi dipensiunkan (*retired/sunset*) oleh GitHub per 28 Agustus 2026**. Kunjungan ke `https://classroom.github.com` dialihkan secara otomatis ke pengumuman komunitas GitHub [Discussion #205975](https://github.com/orgs/community/discussions/205975).
>
> Sebagai gantinya, distribusi tugas dan autograding kini dilakukan melalui **Model GitHub Template Repository (Standar Industri)** atau solusi open-source resmi **Classroom 50**.

---

## 🎯 Model 1: Distribusi via GitHub Template Repository (Direkomendasikan & Paling Praktis)

Repositori [https://github.com/Statistik-Teknik/Statistik-Teknik](https://github.com/Statistik-Teknik/Statistik-Teknik) telah berhasil diinisialisasi dan diaktifkan fiturnya sebagai **Template Repository** (`is_template: true`).

### Alur untuk Dosen / Asisten:
1. Pastikan repositori ini diatur sebagai **Template Repository** di menu Settings GitHub (`[✓] Template repository`).
2. Minta mahasiswa mengakses materi dan modul praktikum di Web E-Book: [https://statistik-teknik.github.io/Statistik-Teknik/](https://statistik-teknik.github.io/Statistik-Teknik/).
3. Minta mahasiswa mengklik tombol hijau **`Use this template`** > **`Create a new repository`**.
4. Buat slot pengumpulan link tugas di LMS kampus (Moodle, Google Classroom, Teams, atau Google Form).

### Alur untuk Mahasiswa:
1. Buka [https://github.com/Statistik-Teknik/Statistik-Teknik](https://github.com/Statistik-Teknik/Statistik-Teknik).
2. Klik tombol **`Use this template`** -> **`Create a new repository`**.
3. Beri nama repositori: `praktikum-1-<NIM>-<Nama>` (misal: `praktikum-1-202601001-Budi`).
4. Pilih visibilitas repositori (**Public** atau **Private** dengan mengundang Dosen/TA sebagai collaborator).
5. Kloning repositori tersebut ke laptop/komputer masing-masing:
   ```bash
   git clone https://github.com/<username-mahasiswa>/praktikum-1-<NIM>-<Nama>.git
   cd praktikum-1-<NIM>-<Nama>
   ```
6. Kerjakan tugas pada file [`tugas_mahasiswa.R`](tugas_mahasiswa.R).
7. Lakukan pengujian mandiri (*Local Autograder*):
   ```bash
   Rscript tests/run_tests.R
   ```
8. Commit dan push pekerjaan:
   ```bash
   git add tugas_mahasiswa.R assignment.Rmd
   git commit -m "feat: menyelesaikan tugas praktikum 1"
   git push origin main
   ```
9. Salin tautan repositori mahasiswa dan kumpulkan ke LMS kampus.

---

## 🚀 Model 2: Menggunakan Classroom 50 (Pengganti Resmi GitHub Classroom)

GitHub telah bermitra dengan **Fifty Foundation** (pengembang Harvard CS50) untuk merilis **Classroom 50** sebagai penerus resmi GitHub Classroom yang 100% gratis dan open-source.

- **Dokumentasi Wiki**: [https://github.com/foundation50/classroom50/wiki](https://github.com/foundation50/classroom50/wiki)
- **Teacher Guide**: [https://github.com/foundation50/classroom50/wiki/Teacher-Guide](https://github.com/foundation50/classroom50/wiki/Teacher-Guide)
- **Fitur**:
  - Web UI & CLI untuk mendistribusikan assignment ke organisasi mahasiswa.
  - Penarikan (*pull*) berkas seluruh mahasiswa sekaligus untuk penilaian massal.
  - Kompatibel penuh dengan template repositori [Statistik-Teknik/Statistik-Teknik](https://github.com/Statistik-Teknik/Statistik-Teknik).

---

## 📊 Penilaian & Evaluasi Dosen

Dosen dan asisten pengampu dapat menguji dan menilai tugas mahasiswa secara massal menggunakan skrip autograder yang telah disediakan:
```bash
# Menguji tugas mahasiswa tertentu
TARGET_FILE=/path/ke/tugas_mahasiswa_peserta.R Rscript tests/run_tests.R
```
Hasil skor akhir (0 - 100) dan rincian subtest yang lulus/gagal akan tercetak secara instan.
