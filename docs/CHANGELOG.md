# Changelog — JagaLahan Web Application

Seluruh perubahan penting pada proyek **JagaLahan** didokumentasikan dalam berkas ini menggunakan format [Keep a Changelog](https://keepachangelog.com/id-ID/1.0.0/).

---

## [2.0.0] — 2026-10-29 (JagaLahan v2 — Smart Land & Zero-Burning Tracker)

### Added (Fitur Baru v2)
- **Modern Consumer-Startup Landing Page (`/`)**:
  - Glassmorphism navbar, glowing hero section dengan jendela pratinjau aplikasi interaktif, statistik dampak pencegahan Karhutla, 6 fitur persuasif utama, pratinjau ekstraksi JSON *Smart Land & Smoke Scanner*, galeri 6 layar antarmuka ponsel, perbandingan 3 paket langganan (*Trial 14 Hari*, *Pro*, *VIP*), akordeon FAQ, dan footer CTA.
- **6 Fitur Persuasif Inti JagaLahan v2**:
  1. **Beranda & Ringkasan Nilai Manfaat Tanpa Bakar (`/beranda`)**: Kartu *Total Nilai Manfaat Tanpa Bakar* (`Rp4.250.000`), pemisahan nilai penghematan pupuk/kompos (`+Rp5.000.000`) terhadap biaya kelola (`-Rp750.000`), *Donut Chart* proporsi manfaat vs biaya, *Mode Privasi Nominal* (`Rp •••••••`), dan pratinjau *Target Lahan Impian*.
  2. **Smart Land & Smoke Scanner — Eksklusif VIP (`/scanner`)**: Pemindai kamera & unggah foto lahan/semak/tongkat air gambut dengan pembersih metadata EXIF/GPS otomatis di sisi klien (UU PDP No. 27/2022), ekstraksi JSON AI Vision (estimasi biomassa kompos Kg & penghematan pupuk Rp), serta formulir verifikasi yang dapat diedit sebelum disimpan ke *Tracking*.
  3. **Check-in Harian Bebas Api & JagaLahan Coins (`/koin`)**: Klaim `+10 Koin` setiap hari dengan visualisasi *streak* 7 hari, bonus konsistensi `+25 Koin`, pesan suportif tanpa menyalahkan (*non-guilt*), dan penukaran transparan `1.000 Koin = Rp10.000` voucher sarana tani (EM4, Dolomit, Bibit).
  4. **Pengingat Lahan & Siaga Karhutla (`/pengingat`)**: Pengingat jam cek kebun sore hari (`16:30`), jadwal balik mulsa kompos, dan peringatan cuaca kering BMKG dengan sakelar (*toggle switch*) penuh di tangan pengguna.
  5. **Target Lahan Impian (`/target`)**: Perencanaan tabungan hasil penghematan tanpa bakar untuk membeli *Mesin Pencacah Semak Pribadi* (`65%`), *Pompa Air Siaga Kemarau* (`40%`), dan *Bibit Unggul* (`30%`) lengkap dengan *milestone* `25%`, `50%`, `75%`, `100%`.
  6. **Tracking Lahan & Unduh Laporan PDF (`/tracking`)**: Filter riwayat (`Semua`, `Manfaat`, `Biaya`), rentang tanggal, tambah/hapus catatan, dan cetak/unduh **Laporan PDF Resmi Zero-Burning** untuk pengguna *Pro* dan *VIP*.
- **Level Pengguna & Paket Langganan Transparan (`/paket`)**:
  - Perbandingan 3 tingkat akses: **Trial 14 Hari (Gratis)**, **Pro (Rp9.900/bulan atau Rp99.900/tahun)**, dan **VIP (Rp19.900/bulan atau Rp199.900/tahun)** tanpa perpanjangan paksa otomatis (*no forced continuity*).

---

## [1.0.0] — 2026-10-29 (Rilis Awal)
- Implementasi purwarupa awal modul Kalkulator Ekonomi Tanpa Bakar, Panduan Mulsa 3 Langkah, Pantau Muka Air Gambut, Kohort Desa, dan Peta Asap.
