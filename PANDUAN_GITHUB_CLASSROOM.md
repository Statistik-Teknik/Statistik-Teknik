# Panduan Lengkap Konfigurasi GitHub Classroom
## Organisasi: `Statistik-Teknik` (https://github.com/Statistik-Teknik)

Dokumen ini berisi panduan langkah demi langkah bagi dosen / asisten pengampu untuk menyiapkan kelas dan tugas praktikum menggunakan **GitHub Classroom** dengan repositori template `Statistik-Teknik/Statistik-Teknik`.

---

## 📌 Prasyarat Awal
1. Anda memiliki akun GitHub dengan akses **Owner** atau **Admin** pada organisasi [Statistik-Teknik](https://github.com/Statistik-Teknik).
2. Repositori starter code ini telah dipush ke [https://github.com/Statistik-Teknik/Statistik-Teknik](https://github.com/Statistik-Teknik/Statistik-Teknik).
3. (Opsional) Mengajukan program [GitHub Global Campus for Teachers](https://education.github.com/teachers) jika ingin mendapatkan kuota GitHub Actions gratis tanpa batas untuk institusi pendidikan.

---

## 🛠️ Langkah 1: Siapkan Repositori Template di GitHub

1. Buka repositori utama yang sudah dipush:  
   👉 [https://github.com/Statistik-Teknik/Statistik-Teknik](https://github.com/Statistik-Teknik/Statistik-Teknik)
2. Klik tab **Settings** (Pengaturan repositori).
3. Pada bagian **General** > **Repository name**:
   - Centang opsi: **`Template repository`** (Jadikan repositori ini sebagai template).
   *(Hal ini memungkinkan GitHub Classroom menduplikasi starter code secara otomatis untuk setiap mahasiswa yang menerima tugas).*

---

## 🏫 Langkah 2: Buat Classroom di classroom.github.com

1. Buka peramban (*browser*) dan kunjungi:  
   👉 [https://classroom.github.com](https://classroom.github.com)
2. Masuk (*Sign in*) dengan akun GitHub Anda.
3. Klik tombol **New classroom** atau **Create classroom**.
4. Pilih organisasi GitHub:
   - Pilih organisasi **`Statistik-Teknik`**.
   - *Jika organisasi belum muncul, klik "Grant access" pada izin OAuth GitHub Classroom untuk organisasi Statistik-Teknik.*
5. Masukkan nama kelas, misalnya:
   - **Classroom name**: `Statistik Teknik - Semester Ganjil 2026`
6. (Opsional) Tambahkan TA / Asisten Dosen sebagai co-admin kelas.
7. Klik **Create classroom**.

---

## 👥 Langkah 3: Setup Roster Mahasiswa (Daftar Peserta)

1. Pada menu navigasi Classroom, pilih tab **Students** / **Roster**.
2. Anda dapat memasukkan daftar identitas mahasiswa berupa:
   - File CSV berisi kolom `identifier` (NIM atau Email Kampus).
   - Atau salin-tempel daftar NIM/Nama mahasiswa secara langsung.
3. Saat mahasiswa mengklik tautan tugas nanti, GitHub Classroom akan meminta mereka memilih NIM/identitas mereka, sehingga dosen mudah memetakan username GitHub ke nama asli mahasiswa.

---

## 📋 Langkah 4: Membuat Tugas Baru (Assignment)

1. Pada beranda Classroom, klik tombol **New assignment** atau **Create assignment**.
2. **Assignment Basics**:
   - **Assignment title**: `Praktikum 1 - Analisis Data Rekayasa dan Mutu`
   - **Assignment type**: `Individual assignment`
   - **Repository prefix**: `tugas-1-` *(repositori mahasiswa otomatis dinamai `tugas-1-<github_username>`)*
   - **Repository visibility**: Pilih **Private** *(agar pekerjaan mahasiswa tidak dapat dilihat atau disalin oleh rekan sekelas)*.
   - **Grant student admin access to their repository**: Kosongkan (uncheck), agar mahasiswa tidak dapat mengubah pengaturan repositori atau workflow autograding.
3. Klik **Continue**.

---

## 📦 Langkah 5: Hubungkan Starter Code & Autograding

1. **Add starter code to test repository**:
   - Pada kolom pencarian repositori starter code, ketik:  
     `Statistik-Teknik/Statistik-Teknik`
   - Pilih repositori tersebut.
2. **Configure Autograding**:
   - Karena starter code telah memuat file `.github/classroom/autograding.json` dan `.github/workflows/classroom.yml`, tes otomatis akan dimuat langsung dengan 4 soal (total bobot 100 poin):
     - **Test Soal 1 - Statistik Deskriptif**: 25 Poin
     - **Test Soal 2 - Uji Hipotesis t-Test**: 25 Poin
     - **Test Soal 3 - Korelasi dan Regresi Linier**: 25 Poin
     - **Test Soal 4 - Analisis Kapabilitas Proses**: 25 Poin
3. **Enable feedback pull requests**:
   - Centang opsi ini *(GitHub Classroom akan otomatis membuat Pull Request bernama "Feedback" di repositori mahasiswa untuk ruang diskusi dosen dan penilaian berkas R Markdown)*.
4. Klik **Create assignment**.

---

## 🔗 Langkah 6: Bagikan Invitation Link ke Mahasiswa

Setelah assignment berhasil dibuat, Anda akan mendapatkan tautan undangan khusus, contohnya:
```text
https://classroom.github.com/a/xxxxxxx
```
1. Bagikan link ini melalui LMS kampus (Google Classroom, Moodle, Teams, dsb.) atau grup kuliah.
2. Ketika mahasiswa mengklik link tersebut:
   - Mahasiswa memilih identitas (NIM) mereka di roster.
   - GitHub Classroom otomatis membuat repositori privat baru berisi kode awal di organisasi `Statistik-Teknik`.
   - Mahasiswa dapat langsung mengkloning dan mulai mengerjakan.

---

## 📊 Langkah 7: Memantau Nilai dan Pengumpulan

1. Masuk ke dashboard assignment di `classroom.github.com`.
2. Anda dapat melihat:
   - Daftar mahasiswa yang telah menerima tugas.
   - Waktu komit terakhir.
   - Status nilai Autograding secara langsung (misal: `100/100`, `75/100`).
   - Tautan langsung ke repositori dan Pull Request Feedback masing-masing mahasiswa.
3. Anda juga dapat mengunduh seluruh nilai dan rekap nilai akhir ke format CSV via tombol **Download grades**.
