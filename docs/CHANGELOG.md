# Catatan Perubahan (Changelog) — Jaga Lahan

Seluruh perubahan penting pada dokumentasi, skema basis data, dan kode sumber aplikasi **Jaga Lahan** dicatat di dalam berkas ini.

Format penulisan mengikuti standar [Keep a Changelog](https://keepachangelog.com/id/1.1.0/), dan penomoran versi mengikuti [Semantic Versioning (SemVer)](https://semver.org/lang/id/).

---

## [1.0.0] - 2026-10-29

### Ditambahkan (Added) — Fase 1 s.d. Fase 4: Implementasi Aplikasi Web Full-Stack Jaga Lahan
- **Fondasi Proyek Next.js & Sistem Desain (`src/app/globals.css`, `src/components/ui/*`):**
  - Implementasi token warna kontras matahari (`Gambut Rimba #1B5E3A`, `Tunas Hijau #E3F2EA`, `Tanah Kertas #F8FAF7`, `Arang Hutan #14261C`, `Kabut Netral #64748B`).
  - Pola visual ramah buta warna (`pattern-aman`, `pattern-waspada`, `pattern-bahaya`) dan konfigurasi PWA (`src/app/manifest.ts`).
- **Mesin Inti & Penjaga Privasi (`src/lib/*`):**
  - `src/lib/calculator/cost-engine.ts`: Perhitungan biaya 2 kolom Musim 1 & Proyeksi 2 Musim beserta rumus eksplisit.
  - `src/lib/privacy/exif-stripper.ts`: Pembersih otomatis metadata `EXIF GPS` di sisi klien menggunakan `HTML5 Canvas` (*fail-closed*).
  - `src/lib/privacy/aggregation-guard.ts`: Penjaga ambang batas privasi $N \ge 5$ petani dengan *fallback* otomatis ke tingkat Kecamatan.
  - `src/lib/offline/sync-queue.ts` & `src/lib/store.ts`: Penyimpanan *offline-first* berbasis `localStorage` dengan antrean sinkronisasi ke Supabase PostgreSQL.
- **8 Modul Fungsional (`src/app/page.tsx` & `src/app/(app)/*`):**
  - `/` (`F-01`): Onboarding 3 langkah tanpa verifikasi email rumit & persetujuan privasi UU PDP No. 27/2022.
  - `/beranda` (`F-07`): Ringkasan progres desa, pemicu pengingat pra-keputusan (H-21, H-14, H-7), dan aturan berhenti eskalasi otomatis setelah 3 kali diabaikan.
  - `/kalkulator` (`F-02`): Perbandingan biaya Bakar vs. Tanpa Bakar, modal transparansi rumus, dan pengajuan pinjam alat pencacah desa.
  - `/panduan` (`F-03`): Panduan 6 tahap dengan *tailoring* gambut/mineral, pratinjau video 40 detik hemat kuota, pengingat balik mulsa Hari ke-10, unggah foto bebas EXIF, dan tombol non-koersif *Lewati/Kembali*.
  - `/muka-air` (`F-04`): Visualisasi tongkat ukur 1 meter terhadap ambang batas $0,4\text{ m}$ ($40\text{ cm}$ — PP No. 57 Tahun 2016), 3 zona ramah buta warna, minggu terlewat non-menghakimi, dan 2 tindakan konkret saat $> 40\text{ cm}$.
  - `/jurnal-panen` (`F-05`): Input panen satuan lokal (`Karung`, `Ton/ha`, `Rupiah`), grafik perbandingan tanpa *leaderboard* individu, dan simulasi interaktif aturan privasi $N \ge 5$.
  - `/kohort-desa` (`F-06` & `F-07`): Papan progres desa, 3 lencana kolektif desa, sakelar komitmen publik/pribadi, dan kalender musim tanam.
  - `/pantau-asap` (`F-08`): Lapor asap dini tingkat blok/parit desa (tanpa GPS individu) dan linimasa pemantauan lahan pasca-kebakaran 6–12 bulan.
  - `/penyuluh` & `/profil`: Panel verifikasi penyuluh tersier, penjadwalan gilir alat cacah, jejak audit (`audit_logs`), serta hak unduh/hapus data pribadi.
- **Migrasi SQL Supabase (`supabase/migrations/001_initial_schema_and_seed.sql`):**
  - Skrip SQL siap pakai untuk 12 tabel bebas-koordinat (`Zero-GIS`), *View* `v_safe_harvest_aggregates`, dan *seed data* 3 desa percontohan.

---

## [0.1.0] - 2026-10-29

### Ditambahkan (Added) — Fase 0: Dokumentasi Fondasi & Spesifikasi Teknis (`docs/`)
- **[`docs/README.md`](file:///D:/S2%20Amikom/Persuasive%20Technology/JagaLahan/docs/README.md):** Indeks utama dokumentasi proyek, ringkasan visi produk, matriks pemetaan teori *Persuasive Technology* ke fitur teknis, dan daftar tumpukan teknologi (*Tech Stack*).
- **[`docs/PRD.md`](file:///D:/S2%20Amikom/Persuasive%20Technology/JagaLahan/docs/PRD.md):** Dokumen Kebutuhan Produk (*Product Requirements Document*) lengkap yang mencakup:
  - Latar belakang empiris karhutla Indonesia (data KLHK 2019–2023 & BNPB).
  - Definisi 4 segmen peran pengguna dalam satu kohort desa (`Pekebun Primer`, `Petani Sekunder`, `Penyuluh Tersier`, dan `Warga Penjaga`).
  - Matriks 3 jenis perubahan perilaku target dan analisis model perilaku Fogg ($B = MAT$).
  - Spesifikasi fungsional terperinci untuk 8 modul inti (`F-01` s.d. `F-08`) beserta kriteria penerimaan (*acceptance criteria*).
  - Matriks evaluasi keberhasilan 5 lapis (proksi langsung di aplikasi, kepatuhan perilaku, pengurangan hambatan, perubahan sikap, dan indikator kewaspadaan lingkungan).
- **[`docs/ARCHITECTURE.md`](file:///D:/S2%20Amikom/Persuasive%20Technology/JagaLahan/docs/ARCHITECTURE.md):** Spesifikasi arsitektur sistem *Offline-First PWA*, diagram alur sinkronisasi luring (`IndexedDB`), pipeline penghapusan metadata `EXIF GPS` di sisi peramban (*client-side HTML5 Canvas*), struktur direktori proyek Next.js, dan alur deployment GitHub $\rightarrow$ Vercel $\leftrightarrow$ Supabase.
- **[`docs/DATABASE_SCHEMA.md`](file:///D:/S2%20Amikom/Persuasive%20Technology/JagaLahan/docs/DATABASE_SCHEMA.md):** Diagram Hubungan Entitas (`erDiagram`), DDL SQL PostgreSQL lengkap untuk 12 tabel bebas-koordinat (`Zero-GIS Policy`), *View* `v_safe_harvest_aggregates` untuk menegakkan aturan privasi $N \ge 5$ dengan *fallback* ke tingkat Kecamatan, serta kebijakan *Row-Level Security (RLS)*.
- **[`docs/DESIGN_SYSTEM.md`](file:///D:/S2%20Amikom/Persuasive%20Technology/JagaLahan/docs/DESIGN_SYSTEM.md):** Panduan desain antarmuka lapangan berkontras tinggi untuk penggunaan di bawah sinar matahari, palet warna non-menghakimi, sistem indikator 3 zona muka air tanah gambut ramah buta warna (Warna + Ikon + Pola sesuai ambang batas $0,4\text{ m}$ PP No. 57 Tahun 2016), dan spesifikasi tata letak 7 layar utama.
- **[`docs/ETHICS_AND_PRIVACY.md`](file:///D:/S2%20Amikom/Persuasive%20Technology/JagaLahan/docs/ETHICS_AND_PRIVACY.md):** Audit 4 pertanyaan etika *Persuasive Technology* (Berdichevsky & Neuenschwander, 1999), alasan penolakan prinsip *Scarcity* dan *Fear Appeal*, daftar larangan *Dark Patterns*, serta 6 kontrol teknis kepatuhan terhadap **UU No. 27 Tahun 2022 (UU PDP)**.
- **[`docs/ROADMAP.md`](file:///D:/S2%20Amikom/Persuasive%20Technology/JagaLahan/docs/ROADMAP.md):** Peta jalan pengembangan bertahap dari Fase 0 (Dokumentasi) hingga Fase 4 (Deployment & Integrasi Screenshot Esai).

