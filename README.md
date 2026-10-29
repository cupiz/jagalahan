# 🌱 Jaga Lahan — Aplikasi Web Pendamping Pembukaan Lahan Tanpa Bakar

**Jaga Lahan** adalah Aplikasi Web Progresif (*Progressive Web App* / PWA) berorientasi lapangan yang dirancang menggunakan kerangka **Persuasive Technology** (*Functional Triad* & Model Perilaku Fogg $B = MAT$ serta Prinsip Persuasi Cialdini) untuk mendampingi petani kecil, pekebun gambut, penyuluh pertanian, dan warga desa beralih dari praktik membuka lahan dengan cara membakar menuju metode **pembukaan lahan tanpa bakar (*zero-burning*)**.

- **Pengembang:** Iqbal Ahdagita Elbadra (`NIM: 26MA41D022`)
- **Program Studi:** Magister Ilmu Komputer (S2), Universitas Amikom Purwokerto
- **Mata Kuliah:** Persuasive Technology — Dosen Pengampu: **Dr. Dhanar Intan Surya Saputra, M.Kom.**

---

## 📚 Dokumentasi Lengkap (`docs/`)

Seluruh dokumen spesifikasi produk, arsitektur, skema database, sistem desain, dan protokol etika tersedia di folder [`docs/`](./docs):

1. [`docs/README.md`](./docs/README.md) — Indeks Dokumentasi & Pemetaan Teori Persuasive Technology
2. [`docs/PRD.md`](./docs/PRD.md) — Product Requirements Document (8 Modul `F-01` s.d. `F-08` & 5 Lapis Evaluasi)
3. [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — Arsitektur Offline-First PWA & Client-Side EXIF Stripper
4. [`docs/DATABASE_SCHEMA.md`](./docs/DATABASE_SCHEMA.md) — ERD, 12 Tabel PostgreSQL (`Zero-GIS`), & View Agregasi $N \ge 5$
5. [`docs/DESIGN_SYSTEM.md`](./docs/DESIGN_SYSTEM.md) — Sistem Desain Kontras Matahari & 3 Zona Air Gambut Ramah Buta Warna
6. [`docs/ETHICS_AND_PRIVACY.md`](./docs/ETHICS_AND_PRIVACY.md) — Kepatuhan UU PDP No. 27/2022 & Anti-Dark Patterns
7. [`docs/ROADMAP.md`](./docs/ROADMAP.md) — Peta Jalan Pengembangan (Fase 0 – Fase 4)
8. [`docs/CHANGELOG.md`](./docs/CHANGELOG.md) — Catatan Perubahan Versi

---

## ✨ 8 Modul Fungsional Utama

1. **`F-01` Onboarding 3 Langkah (`/`)**: Pemilihan desa & peran kohort (`Pekebun Primer`, `Petani Sekunder`, `Penyuluh Tersier`, `Warga Penjaga`) tanpa verifikasi email rumit.
2. **`F-02` Kalkulator Bakar vs. Tanpa Bakar (`/kalkulator`)**: Perbandingan jujur 2 kolom (contoh 2 ha: `Rp2.200.000` vs. `Rp2.500.000` di musim pertama + penghematan pupuk musim ke-2 `Rp800.000`), modal transparansi rumus, dan pengajuan pinjam alat pencacah desa.
3. **`F-03` Panduan 6 Tahap Tanpa Bakar (`/panduan`)**: *Tunneling* & *Tailoring* (gambut/mineral), pratinjau video peragaan pencacahan 40 detik hemat kuota, pengingat otomatis Hari ke-10 balik mulsa, unggah foto bebas EXIF GPS, serta tombol non-koersif *Lewati/Kembali*.
4. **`F-04` Tongkat Ukur Muka Air Tanah Gambut (`/muka-air`)**: Visualisasi tongkat 1 meter (skala 10 cm) terhadap ambang batas **$0,4\text{ meter}$ ($40\text{ cm}$ — PP No. 57 Tahun 2016)** dalam 3 zona ramah buta warna (**Warna + Ikon + Pola**), tampilan minggu terlewat abu-abu netral non-menghakimi, serta 2 tindakan konkret saat $>40\text{ cm}$.
5. **`F-05` Jurnal Hasil Panen & Agregat Desa (`/jurnal-panen`)**: Input satuan lokal (`Karung`, `Ton/ha`, `Rupiah`), grafik perbandingan terhadap rata-rata desa (**tanpa *leaderboard* individu**), dan simulasi aturan privasi $N \ge 5$ (otomatis *fallback* ke Kecamatan bila $N < 5$).
6. **`F-06` & `F-07` Kohort Desa, Lencana Kolektif, & Kalender Pra-Keputusan (`/kohort-desa`)**: 3 lencana kolektif desa (*Desa Bebas Bakar*, *Sepuluh Hektare Tanpa Bakar*, *Musim Kedua Berturut-turut*), sakelar komitmen publik/pribadi, serta pemicu pengingat H-21, H-14, H-7 dengan aturan berhenti otomatis setelah 3 kali diabaikan.
7. **`F-08` Lapor Asap Dini & Pantau Lahan Pasca-Kebakaran (`/pantau-asap`)**: Laporan asap tingkat blok/parit desa (tanpa koordinat GPS individu) dan linimasa pemantauan pemulihan petak bekas terbakar selama 6–12 bulan.
8. **Panel Penyuluh (`/penyuluh`) & Privasi (`/profil`)**: Verifikasi tahapan, penjadwalan gilir alat pencacah desa, pembaruan harga acuan kalkulator, jejak audit (`audit_logs`), serta tombol *Unduh / Hapus Data Saya* sesuai UU PDP No. 27 Tahun 2022.

---

## 🚀 Cara Menjalankan Secara Lokal

```bash
npm install
npm run dev
```

Buka `http://localhost:3000` di peramban Anda. Aplikasi bekerja penuh dalam **Mode Demo Luring** secara langsung, atau dapat dihubungkan ke proyek **Supabase** dengan menyalin `.env.example` menjadi `.env.local` dan menjalankan skrip SQL pada [`supabase/migrations/001_initial_schema_and_seed.sql`](./supabase/migrations/001_initial_schema_and_seed.sql).
