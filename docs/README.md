# Dokumentasi Proyek Jaga Lahan

<div align="center">
  <img src="../JagaLahan Logo.png" alt="Logo Aplikasi Jaga Lahan" width="140" />
  <h3>JAGA LAHAN: Persuasi pada Keputusan yang Diambil Sekali Setahun</h3>
  <p><i>Aplikasi Perlindungan Ekosistem Gambut Berbasis Komunitas Desa</i></p>
</div>

---

## Tentang Proyek

**Jaga Lahan** adalah aplikasi web *mobile-first* (*Progressive Web App*) berbasis **Persuasive Technology** yang dirancang untuk melindungi ekosistem gambut di tingkat desa. Aplikasi ini membantu pekebun rakyat beralih dari praktik pembukaan lahan dengan cara membakar ke metode olah lahan tanpa bakar (pencacahan biomassa, mulsa, dan pengomposan), memfasilitasi pemantauan mingguan tinggi muka air tanah gambut sesuai ambang batas $0{,}4\text{ meter}$ (PP Nomor 57 Tahun 2016), serta memberdayakan warga desa dalam deteksi dini asap dan pemantauan pemulihan plot pasca-kebakaran.

Proyek ini dikembangkan sebagai implementasi nyata dari rancangan akademik pada mata kuliah **Persuasive Technology** (Program Studi Magister Ilmu Komputer, Fakultas Ilmu Komputer, Universitas Amikom Purwokerto) yang diampu oleh **Dr. Dhanar Intan Surya Saputra, M.Kom.**

- **Pengembang / Penulis:** Iqbal Ahdagita Elbadra (`26MA41D022`)
- **Model Layanan:** *Business-to-Government* (B2G) untuk Dinas Pertanian Kabupaten/Kota & Pemerintah Desa (100% gratis bagi petani dan warga desa).
- **Stack Teknologi:** Next.js (App Router, TypeScript), Tailwind CSS, Shadcn UI, Recharts, Supabase (PostgreSQL, Auth, Storage), dan Vercel.

---

## Daftar Isi Dokumentasi (`docs/`)

Seluruh dokumen spesifikasi di bawah ini menjadi acuan tunggal (*Single Source of Truth*) sebelum dan selama pembangunan kode aplikasi:

| No. | Dokumen | Deskripsi Isi |
| :-- | :--- | :--- |
| 1 | [**PRD.md**](./PRD.md) | **Product Requirements Document:** Latar belakang masalah empiris, 4 segmen pengguna satu desa, 3 jenis perilaku target (episodik, penjaga, kolektif), analisis *Fogg Behavior Model ($B=MAT$)*, spesifikasi fungsional 8 fitur utama, pemetaan prinsip persuasi, dan matriks evaluasi 5 lapis. |
| 2 | [**ARCHITECTURE.md**](./ARCHITECTURE.md) | **Arsitektur Sistem & Teknis:** Diagram arsitektur *end-to-end*, struktur folder Next.js App Router, mekanisme *offline-first* di ladang tanpa sinyal, pipeline penghapusan koordinat EXIF di sisi klien, serta alur CI/CD GitHub $\rightarrow$ Vercel $\leftrightarrow$ Supabase. |
| 3 | [**DATABASE_SCHEMA.md**](./DATABASE_SCHEMA.md) | **Skema Database & Kebijakan RLS:** Diagram relasi entitas (ERD), definisi tabel PostgreSQL Supabase, fungsi agregasi minimal 5 pekebun untuk perbandingan hasil panen desa, dan aturan *Row-Level Security* (RLS). |
| 4 | [**DESIGN_SYSTEM.md**](./DESIGN_SYSTEM.md) | **Design System & Panduan UI/UX Lapangan:** Palet warna nir-penghakiman (tanpa merah tuduhan), tipografi kontras tinggi bawah sinar matahari, aksesibilitas buta warna pada grafik muka air $0{,}4\text{ m}$, serta spesifikasi *wireframe* setiap layar berdasarkan peran. |
| 5 | [**ETHICS_AND_PRIVACY.md**](./ETHICS_AND_PRIVACY.md) | **Protokol Etika Persuasi & Privasi Data:** Enam kendali risiko etis (anti-kriminalisasi petani, anti-sengketa koordinat batas lahan, penolakan *scarcity* semu & *fear appeal*, audit kalkulator terbuka), larangan 4 *dark patterns*, dan kepatuhan UU PDP No. 27 Tahun 2022. |
| 6 | [**ROADMAP.md**](./ROADMAP.md) | **Peta Jalan Pengembangan:** Tahapan implementasi dari Fase 0 (Dokumentasi) hingga Fase 4 (Pengujian Lapangan, PWA Offline, & Deployment Produksi). |
| 7 | [**CHANGELOG.md**](./CHANGELOG.md) | **Catatan Perubahan (Changelog):** Riwayat pembaruan spesifikasi, fitur, dan rilis versi aplikasi mengikuti standar *Keep a Changelog*. |

---

## Prinsip Utama Pembangunan Aplikasi

1. **Kejujuran atas Sifat Perilaku:** Menggabungkan pendampingan intensif selama 6 minggu menjelang musim tanam (**perilaku utama/episodik**) dengan pencatatan tinggi muka air tanah setiap minggu selama musim kering (**perilaku penjaga/berulang**).
2. **Transparansi Ekonomi Tanpa Manipulasi:** Kalkulator biaya menampilkan perbandingan *Membakar vs. Tanpa Bakar* secara jujur (termasuk selisih biaya musim pertama sebagai dasar pengajuan bantuan alat pencacah ke dinas pertanian).
3. **Solidaritas Satu Desa di Atas Kompetisi Individu:** Menolak *leaderboard* individu yang berpotensi memicu konflik batas lahan atau mempermalukan petani kecil, dan menggantinya dengan **Kohort & Lencana Kolektif Desa** serta perbandingan rata-rata agregat (minimal 5 pekebun).
4. **Perlindungan Petani lewat Minimisasi Data:** Tidak pernah menyimpan poligon koordinat batas lahan individu dan selalu menghapus metadata lokasi (*EXIF GPS*) secara otomatis di perangkat pengguna sebelum foto bukti diunggah ke server.

