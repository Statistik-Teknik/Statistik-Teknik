#!/usr/bin/env bash
# ==============================================================================
# Script Otomasi Inisialisasi & Push ke GitHub
# Target: https://github.com/Statistik-Teknik/Statistik-Teknik
# ==============================================================================

set -e

REPO_ORG="Statistik-Teknik"
REPO_NAME="Statistik-Teknik"
REMOTE_HTTPS="https://github.com/${REPO_ORG}/${REPO_NAME}.git"
REMOTE_SSH="git@github.com:${REPO_ORG}/${REPO_NAME}.git"

echo "=================================================================="
echo "  INISIALISASI & PUSH STARTER REPOSITORI GITHUB CLASSROOM"
echo "  Target: ${REMOTE_HTTPS}"
echo "=================================================================="

# 1. Inisialisasi Git jika belum ada
if [ ! -d ".git" ]; then
    echo "[+] Menginisialisasi git repository lokal..."
    git init -b main
else
    echo "[i] Git repository lokal sudah terinisialisasi."
    git branch -M main
fi

# 2. Pastikan konfigurasi git user ada
GIT_NAME=$(git config user.name || true)
GIT_EMAIL=$(git config user.email || true)
if [ -z "$GIT_NAME" ] || [ -z "$GIT_EMAIL" ]; then
    echo "[!] Konfigurasi user.name atau user.email belum terpasang."
    echo "    Silakan tentukan nama & email untuk commit:"
    git config user.name "Andy Haryoko"
    git config user.email "turnback2ubuntu@gmail.com"
fi

# 3. Tambahkan seluruh berkas
echo "[+] Menambahkan berkas ke staging area..."
git add .

# 4. Buat initial commit jika belum ada commit
if git rev-parse --verify HEAD >/dev/null 2>&1; then
    echo "[i] Melakukan commit pembaruan..."
    git commit -m "feat: inisialisasi starter code praktikum statistik teknik dengan autograder R" || echo "[i] Tidak ada perubahan untuk dikomit."
else
    echo "[+] Membuat initial commit..."
    git commit -m "feat: inisialisasi starter code praktikum statistik teknik dengan autograder R"
fi

# 5. Konfigurasi Remote
if git remote get-url origin >/dev/null 2>&1; then
    echo "[i] Memperbarui remote URL origin ke: ${REMOTE_HTTPS}"
    git remote set-url origin "${REMOTE_HTTPS}"
else
    echo "[+] Menambahkan remote origin: ${REMOTE_HTTPS}"
    git remote add origin "${REMOTE_HTTPS}"
fi

echo ""
echo "------------------------------------------------------------------"
echo "Metode Push ke GitHub:"
echo "1) Menggunakan GitHub CLI (gh) - otomatis membuat repo di org jika belum ada"
echo "2) Menggunakan Git Push biasa (HTTPS)"
echo "3) Menggunakan Git Push dengan SSH Key"
echo "------------------------------------------------------------------"

if command -v gh >/dev/null 2>&1 && gh auth status >/dev/null 2>&1; then
    echo "[i] GitHub CLI terdeteksi dan sudah terautentikasi."
    echo "[+] Memeriksa apakah repositori ${REPO_ORG}/${REPO_NAME} sudah ada..."
    if ! gh repo view "${REPO_ORG}/${REPO_NAME}" >/dev/null 2>&1; then
        echo "[+] Membuat repositori baru di organisasi ${REPO_ORG} via gh..."
        gh repo create "${REPO_ORG}/${REPO_NAME}" --public --source=. --remote=origin --push
        echo "[✓] Repositori berhasil dibuat dan dipush ke GitHub!"
        exit 0
    else
        echo "[+] Melakukan push ke repositori yang sudah ada..."
        git push -u origin main
        echo "[✓] Push berhasil!"
        exit 0
    fi
fi

echo ""
echo "[i] GitHub CLI belum login. Anda dapat melakukan salah satu langkah berikut:"
echo ""
echo "A. Jika ingin login GitHub CLI terlebih dahulu (paling mudah):"
echo "   gh auth login"
echo "   ./setup_and_push.sh"
echo ""
echo "B. Jika repositori sudah dibuat manual di https://github.com/organizations/Statistik-Teknik/repositories/new :"
echo "   git push -u origin main"
echo ""
echo "C. Jika menggunakan SSH:"
echo "   git remote set-url origin ${REMOTE_SSH}"
echo "   git push -u origin main"
echo ""
