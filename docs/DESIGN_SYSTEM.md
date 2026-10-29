# Sistem Desain & Spesifikasi Antarmuka (UI/UX) — Jaga Lahan

**Proyek:** Jaga Lahan  
**Versi Dokumen:** 1.0.0  
**Target Konteks Lapangan:** Penggunaan di bawah terik matahari kebun/lahan gambut, pengoperasian satu tangan di ponsel Android, aksesibilitas buta warna merah-hijau, dan nada komunikasi non-menghakimi (*non-judgmental persuasive design*).

---

## 1. Filosofi Desain Lapangan (Field-Ready Persuasive UI)

Berbeda dari aplikasi perkotaan yang padat teks dan grafik rumit, antarmuka **Jaga Lahan** mengikuti 5 kaidah desain lapangan:

1. **Kontras Tinggi untuk Sinar Matahari (*Sunlight-Readable Contrast*):** Latar utama menggunakan warna krem-kertas hangat (`#F8FAF7`) dengan teks hijau-arang pekat (`#14261C`, rasio kontras $> 11:1$ standar WCAG AAA) agar tetap terbaca jelas di tepi kebun pada siang hari.
2. **Operasi Satu Tangan (*One-Handed Thumb Zone*):** Seluruh tombol aksi utama diletakkan di bagian bawah layar dengan tinggi sentuh minimal `48px` (`h-12` hingga `h-14`).
3. **Aksesibilitas Buta Warna (*Color + Icon + Pattern*):** Zona tinggi muka air tanah gambut dan status tahapan **tidak pernah hanya mengandalkan warna**. Setiap status wajib menggabungkan **Warna + Ikon Simbolik + Pola Latar/Garis Batas + Label Teks Eksplisit** sehingga aman bagi pengguna dengan buta warna merah-hijau (*deuteranopia/protanopia*).
4. **Palet Warna Non-Menghakimi (*Non-Judgmental Feedback*):**
   - Tidak ada warna merah menyala yang menuduh ketika petani melewatkan pencatatan mingguan.
   - Minggu yang terlewat ditampilkan dengan warna **Abu-Abu Netral (`#64748B`)** disertai pesan suportif: *"Minggu lalu belum tercatat — tidak apa-apa, bisa dimulai lagi minggu ini."*
5. **Transparansi & Kebebasan Memilih (*Anti-Coercion UI*):** Setiap layar rekomendasi menyertakan tautan *"Lihat cara hitung rumus ini"* dan setiap tahap panduan menyertakan tombol sekunder *"Lewati tahap ini / Kembali ke tahap sebelumnya"*.

---

## 2. Palet Warna & Token Desain

### 2.1 Warna Identitas & Permukaan

| Token | Kode Hex | Kelas Tailwind Setara | Penggunaan Utama |
| :--- | :--- | :--- | :--- |
| **Gambut Rimba (Primary)** | `#1B5E3A` | `bg-[#1B5E3A]` / `emerald-800` | Header aplikasi, tombol aksi utama (CTA), lencana kolektif desa |
| **Tunas Hijau (Secondary)** | `#E3F2EA` | `bg-[#E3F2EA]` / `emerald-50` | Latar kartu sorotan, header tabel, penanda tahap aktif |
| **Tanah Kertas (Surface)** | `#F8FAF7` | `bg-[#F8FAF7]` | Latar belakang utama layar yang nyaman di bawah sinar matahari |
| **Arang Hutan (Foreground)** | `#14261C` | `text-[#14261C]` | Teks utama kontras tinggi |
| **Kabut Netral (Missed/Muted)** | `#64748B` | `text-slate-500` / `bg-slate-100` | Status minggu terlewat (netral, tidak menghakimi) |

### 2.2 Sistem 3 Zona Muka Air Tanah Gambut (PP No. 57 Tahun 2016 — Ambang $0,4\text{ m}$ / $40\text{ cm}$)

Untuk menjamin aksesibilitas buta warna, ketiga zona kedalaman muka air tanah dipetakan dengan **4 penanda simultan**:

| Zona & Kedalaman | Warna & Kode Hex | Ikon (`lucide-react`) | Pola Visual & Garis Tepian | Pesan & Tindakan Konkret |
| :--- | :--- | :--- | :--- | :--- |
| **ZONA AMAN**<br/>$0 - 30\text{ cm}$ di bawah permukaan | **Biru-Hijau Air (`#0D9488`)**<br/>Latar: `#CCFBF1` | `Droplets` + `CheckCircle2` | Garis tepi utuh (*solid border* `2px`) + pola gelombang air halus | *"Gambut basah & aman (di atas batas 40 cm). Pertahankan sekat kanal tetap tertutup rapat."* |
| **ZONA WASPADA**<br/>$31 - 40\text{ cm}$ (Mendekati batas regulasi $0,4\text{ m}$) | **Kuning Amber (`#D97706`)**<br/>Latar: `#FEF3C7` | `AlertTriangle` + `Gauge` | Garis tepi putus-putus (*dashed border* `2px`) + pola garis diagonal renggang | *"Air mendekati batas kritis 40 cm (PP 57/2016). Segera periksa pintu sekat kanal & tunda penumpukan serasah kering."* |
| **ZONA BAHAYA**<br/>$> 40\text{ cm}$ (Melewati ambang kritis $0,4\text{ m}$) | **Jingga-Bata Terang (`#C2410C`)**<br/>Latar: `#FFEDD5` | `Flame` + `ShieldAlert` | Garis tepi ganda tebal (*double/thick border* `3px`) + pola titik/arsir silang | **Tampilkan 2 Tombol Tindakan Konkret:**<br/>1. *"Panduan Tutup Sekat Kanal Desa"*<br/>2. *"Hubungi Penyuluh / MPA Desa Sekarang"* |

---

## 3. Tipografi & Hierarki Informasi

- **Font Utama (`Sans`):** `Plus Jakarta Sans` atau `Inter` — keterbacaan angka dan huruf sangat tinggi pada layar resolusi rendah.
- **Font Angka & Kalkulator (`Mono/Tabular`):** `tabular-nums` aktif pada seluruh angka Rupiah, sentimeter tinggi air, dan tonase panen agar perbandingan dua kolom sejajar sempurna.
- **Ukuran Teks Minimum:**
  - Angka Utama (Selisih Biaya / Tinggi Air Tanah): `24px–32px` (`text-2xl` s.d. `text-3xl font-bold`)
  - Teks Isi & Langkah Panduan: `16px` (`text-base`, tinggi baris `leading-relaxed`)
  - Label Pendukung & Catatan Privasi: `13px–14px` (`text-xs` / `text-sm`, tidak pernah lebih kecil dari `12px`)

---

## 4. Spesifikasi 7 Layar Utama (Blueprint Implementasi & Tangkapan Layar Esai)

Ketujuh layar ini dirancang agar dapat dijalankan secara interaktif di aplikasi web sekaligus menghasilkan tangkapan layar (*UI screenshots*) beresolusi tinggi untuk **Bagian E** pada dokumen esai.

### Layar 1 — Onboarding 3 Langkah & Pemilih Peran Desa (`/`)
- **Komponen Utama:**
  - Logo resmi **Jaga Lahan** (`Gambar 1.1`) dengan slogan *"Buka Lahan Tanpa Bakar — Jaga Gambut, Jaga Panen Desa"*.
  - **3 Kartu Langkah Singkat:** (1) Pilih Desa & Jenis Tanah, (2) Pilih Luas Lahan Umum ($0,5\text{–}5\text{ ha}$), (3) Langsung Buka Kalkulator Biaya (tanpa paksaan verifikasi email).
  - **Pemilih Peran Interaktif (*Role Switcher*):** Memungkinkan pengguna/penguji beralih instan antara `Pekebun Primer`, `Petani Sekunder`, `Penyuluh Tersier`, dan `Warga Penjaga` dalam satu kohort desa (mis. *Desa Kalampangan, Kec. Sabangau, Kota Palangka Raya*).
  - **Kotak Persetujuan Privasi (UU PDP No. 27/2022):** Menjelaskan dalam bahasa sederhana bahwa Jaga Lahan tidak menyimpan titik GPS kebun dan foto otomatis dibersihkan dari koordinat lokasi.

### Layar 2 — Kalkulator Bakar vs. Tanpa Bakar (`/kalkulator`)
- **Komponen Utama:**
  - *Slider* / tombol cepat Luas Lahan (default `2,0 ha`), tombol pilih Jenis Tanah (`Gambut` / `Mineral`), dan Ketebalan Semak (`Ringan` / `Sedang` / `Tebal`).
  - **Tabel/Kartu Perbandingan 2 Kolom Sejajar (Musim 1 & Proyeksi Musim 2):**
    - Kolom Kiri (**Cara Bakar — 2 ha**): Upah tebas & bakar (`Rp1.500.000`) + penanganan sisa abu (`Rp700.000`) = **Total Musim 1: `Rp2.200.000`** *(Catatan risiko: unsur hara nitrogen menguap, gambut rawan terbakar ulang, biaya pupuk musim ke-2 naik)*.
    - Kolom Kanan (**Tanpa Bakar — 2 ha**): Upah tebas & cacah (`Rp1.100.000`) + sewa alat pencacah gilir desa (`Rp700.000`) + kapur dolomit & dekomposer (`Rp700.000`) = **Total Musim 1: `Rp2.500.000`**.
  - **Banner Kejujuran Selisih & Tombol Bantuan (*Reciprocity & Ability*):** Menampilkan secara jujur bahwa cara tanpa bakar pada musim pertama membutuhkan tambahan sekitar **`Rp300.000`**, diikuti tombol langsung: **"Ajukan Pinjam Alat Pencacah Desa & Bibit Penutup Tanah (Hemat Rp700.000)"** serta proyeksi penghematan pupuk musim kedua sebesar **`Rp800.000`**.
  - **Tombol Transparansi:** *"Lihat Rumus & Acuan Harga Desa (Diverifikasi Penyuluh)"*.

### Layar 3 — Panduan 6 Tahap Pembukaan Lahan Tanpa Bakar (`/panduan`)
- **Komponen Utama:**
  - Bilah progres 6 tahap (*Tunneling*):
    1. **Penilaian Biomassa & Semak**
    2. **Pencacahan Vegetasi** *(dilengkapi pemutar pratinjau video peragaan singkat 40 detik hemat kuota & bisa disimpan luring)*
    3. **Penumpukan Serasah Teratur (Jalur Rumpuk)**
    4. **Pengomposan & Mulsa Alami** *(dilengkapi kartu pengingat otomatis **Hari ke-10: Balik Tumpukan Mulsa**)*
    5. **Pemeriksaan Kesiapan Tanah**
    6. **Penanaman Komoditas**
  - Tombolunggah foto kemajuan tahap dengan indikator langsung: **"🔒 EXIF GPS Otomatis Dihapus di Perangkat Anda"**.
  - Tombol non-koersif di setiap tahap: *"Lewati Tahap Ini"* dan *"Kembali ke Tahap Sebelumnya"*.

### Layar 4 — Tongkat Ukur Muka Air Tanah Gambut (`/muka-air`)
- **Komponen Utama:**
  - **Visualisasi Tongkat Ukur 1 Meter (Skala per 10 cm):** Ilustrasi interaktif pipa PVC/bambu bertanda setiap $10\text{ cm}$ yang bergeser secara *real-time* saat petani menggeser angka kedalaman air (mis. dari $25\text{ cm}$ ke $42\text{ cm}$).
  - **Grafik Riwayat 4 Minggu Terakhir:** Menampilkan garis batas tegas pada **$40\text{ cm}$ ($0,4\text{ meter}$ — Ambang Batas PP No. 57 Tahun 2016)** dan membedakan 3 zona dengan warna + ikon + pola.
  - **Penanganan Minggu Terlewat Non-Menghakimi:** Jika Minggu ke-2 kosong, tampil titik abu-abu netral dengan keterangan ramah.
  - **Kotak Tindakan Darurat Saat $> 40\text{ cm}$:** Menampilkan tepat dua tindakan konkret (Tutup Sekat Kanal & Hubungi Penyuluh Desa).

### Layar 5 — Jurnal Hasil Panen & Perbandingan Agregat Desa (`/jurnal-panen`)
- **Komponen Utama:**
  - Formulir input dalam satuan lokal yang akrab bagi petani: **Karung**, **Ton/ha**, dan **Rupiah (Rp)**.
  - **Grafik Batang Perbandingan Diri vs. Rata-Rata Desa:** Membandingkan Musim Lalu vs. Musim Ini milik petani sendiri terhadap rata-rata agregat Desa (**tanpa daftar peringkat individu / *no leaderboard***).
  - **Simulasi Sakelar Ambang Privasi $N \ge 5$:** Menyediakan indikator transparan yang memperlihatkan bagaimana tampilan otomatis beralih ke rata-rata Kecamatan apabila jumlah petani pencatat di desa tersebut kurang dari 5 orang ($N < 5$).

### Layar 6 — Kohort Desa, Lencana Kolektif, & Kalender Pra-Keputusan (`/kohort-desa`)
- **Komponen Utama:**
  - **Papan Progres Kolektif Desa:** *"14 Pekebun & Petani di Desa Kalampangan sedang menjaga 28,5 Hektare Lahan Tanpa Bakar musim ini."*
  - **3 Lencana Kolektif Desa:** *Desa Bebas Bakar*, *Sepuluh Hektare Tanpa Bakar*, dan *Musim Kedua Berturut-turut*.
  - **Sakelar Privasi Komitmen (*Commitment Choice*):** Pilihan bebas apakah ingin menampilkan komitmen di Kohort Desa atau menyimpannya secara pribadi.
  - **Simulasi Kalender Musim & Pengingat Pra-Keputusan (H-21, H-14, H-7):** Menampilkan contoh pesan pengingat menjelang musim tanam serta indikator aturan berhenti otomatis setelah 3 kali diabaikan (*Unobtrusiveness Rule*).

### Layar 7 — Pantau Lahan Pasca-Kebakaran (6–12 Bulan), Lapor Asap Dini, & Panel Penyuluh (`/pantau-asap` & `/penyuluh`)
- **Komponen Utama:**
  - **Formulir Lapor Asap Dini (Peran Warga Penjaga):** Input blok/parit desa (tanpa koordinat GPS individu), kepekatan asap, dan foto bebas-EXIF yang langsung diteruskan ke Penyuluh/MPA Desa.
  - **Linimasa Pemantauan Lahan Pasca-Kebakaran (Bulan ke-1 s.d. ke-12):** Melacak pemulihan vegetasi dan kelembapan gambut pada petak bekas terbakar agar tidak terbakar berulang di musim kemarau berikutnya.
  - **Panel Verifikasi Penyuluh Tersier:** Antarmuka bagi penyuluh untuk memverifikasi penyelesaian tahap, mengatur jadwal gilir alat pencacah desa, dan memperbarui harga acuan kalkulator.

