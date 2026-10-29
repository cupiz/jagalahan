# 🌱 JagaLahan — Aplikasi Pintar Pencegahan Karhutla & Kelola Lahan Tanpa Bakar (`jagalahan.web.id`)

**JagaLahan** adalah aplikasi web progresif (*Progressive Web Application*) berbasis **Persuasive Technology** yang dirancang untuk membantu petani, pekebun, dan warga desa rawan Kebakaran Hutan dan Lahan (Karhutla) beralih ke metode **Pembukaan & Pengelolaan Lahan Tanpa Bakar (*Zero-Burning*)** secara mudah, terukur, dan menguntungkan.

Dirancang oleh **Iqbal Ahdagita Elbadra (NIM: 26MA41D022)** — Program Studi Magister Ilmu Komputer (S2), Universitas Amikom Purwokerto, di bawah bimbingan **Dr. Dhanar Intan Surya Saputra, M.Kom.**

---

## ✨ 6 Fitur Utama JagaLahan

1. **Beranda & Ringkasan Nilai Manfaat Tanpa Bakar (`/beranda`)**
   - Menampilkan kartu **Total Nilai Manfaat Tanpa Bakar** (`Rp4.250.000`), perbandingan nilai penghematan pupuk & kompos (`+Rp5.000.000`) terhadap biaya kelola (`-Rp750.000`), *Donut Chart* proporsi manfaat vs biaya, serta tombol sensor **Mode Privasi Nominal** (`Rp •••••••`).
2. **Smart Land & Smoke Scanner — Eksklusif VIP (`/scanner`)**
   - Pemindai kamera dan unggah foto kondisi semak/mulsa/tongkat air gambut berbasis AI Vision yang mengekstrak estimasi biomassa kompos (`Kg`), penghematan pupuk NPK (`Rp`), serta rekomendasi tindakan tanpa ketik manual. Dilengkapi **Pembersih Metadata Lokasi EXIF/GPS Otomatis** di sisi klien (kepatuhan UU PDP No. 27/2022) dan formulir verifikasi yang dapat diedit sebelum disimpan.
3. **Check-in Harian Bebas Api & JagaLahan Coins (`/koin`)**
   - Sistem apresiasi kebiasaan positif (*Positive Reinforcement*): pengguna klaim `+10 Koin` setiap hari memastikan lahan bebas api, melacak *streak* 7/14/30 hari dengan pesan suportif tanpa menyalahkan (*no guilt-tripping*), dan menukarkan `1.000 Koin = Rp10.000` menjadi voucher sarana tani (EM4, Dolomit, Bibit).
4. **Pengingat Lahan & Siaga Karhutla (`/pengingat`)**
   - Pengingat tepat waktu (*Suggestion* & *Trigger*) untuk pemeriksaan kebun sore hari (`16:30`), jadwal membalik tumpukan mulsa kompos, dan peringatan cuaca kering BMKG dengan tombol sakelar (*toggle switch*) penuh di tangan pengguna.
5. **Target Lahan Impian (`/target`)**
   - Perencanaan tujuan finansial (*Goal Setting* & *Self-Monitoring*) untuk mengubah akumulasi penghematan tanpa bakar menjadi tabungan alat pertanian modern seperti **Mesin Pencacah Semak Pribadi** (`65%`), **Pompa Air Siaga Kemarau** (`40%`), dan **Bibit Unggul** (`30%`) lengkap dengan *milestone* `25%`, `50%`, `75%`, dan `100%`.
6. **Tracking Lahan & Unduh Laporan PDF (`/tracking`)**
   - Pencatatan riwayat manfaat dan biaya kelola lahan dengan filter kategori (`Semua`, `Manfaat`, `Biaya`), rentang tanggal, serta fitur cetak/unduh **Laporan PDF Resmi Zero-Burning** untuk pengguna *Pro* dan *VIP*.

---

## 👑 Level Pengguna & Paket Langganan (`/paket`)

| Paket | Harga | Akses Utama |
| :--- | :--- | :--- |
| **Trial 14 Hari** | **Gratis** (14 Hari Pertama) | Tracking manual, Check-in Harian & Koin, Pengingat Lahan, Target Impian dasar |
| **Paket Pro** | **Rp9.900/bulan** atau **Rp99.900/tahun** | Semua fitur Trial tanpa batas + **Unduh Laporan PDF Resmi Zero-Burning** + Tukar Koin |
| **Paket VIP** | **Rp19.900/bulan** atau **Rp199.900/tahun** | Semua fitur Pro + **Smart Land & Smoke Scanner (AI Kamera Otomatis)** + Prioritas Koin |

---

## 🛠️ Tumpukan Teknologi (*Tech Stack*)

- **Framework**: Next.js 16.4 (App Router, TypeScript)
- **Styling & UI**: Tailwind CSS v4, Lucide Icons, Glassmorphism Startup Design System
- **Database & Backend Schema**: Supabase PostgreSQL (`supabase/migrations/001_initial_schema_and_seed.sql`) + Sinkronisasi Lokal *Offline-First* (`localStorage`)
- **Keamanan & Privasi**: Client-side HTML5 Canvas EXIF/GPS Stripper (`src/lib/privacy/exif-stripper.ts`) sesuai UU Pelindungan Data Pribadi (UU No. 27 Tahun 2022)
