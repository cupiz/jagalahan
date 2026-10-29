# Protokol Etika, Privasi Data, & Anti-Manipulasi — Jaga Lahan

**Proyek:** Jaga Lahan  
**Versi Dokumen:** 1.0.0  
**Landasan Regulasi & Akademik:**  
- **UU No. 27 Tahun 2022** tentang Pelindungan Data Pribadi (UU PDP)  
- **PP No. 57 Tahun 2016** tentang Perlindungan dan Pengelolaan Ekosistem Gambut  
- **Berdichevsky & Neuenschwander (1999)** — *Toward an Ethics of Persuasive Technology* (8 Prinsip & 4 Pertanyaan Uji Etika)  
- **Fogg (2002)** — Batas tegas antara *Persuasion* (sukarela), *Coercion* (pemaksaan), dan *Manipulation* (tipu daya/asimetri informasi)

---

## 1. Mengapa Etika Adalah Persyaratan Fungsional Utama di Jaga Lahan?

Dalam konteks pembukaan lahan di wilayah gambut Indonesia, petani kecil berada pada posisi rentan secara hukum dan ekonomi. Berdasarkan **UU No. 32 Tahun 2009** tentang Perlindungan dan Pengelolaan Lingkungan Hidup, pembakaran lahan memiliki konsekuensi pidana berat. Apabila sebuah aplikasi pendamping pertanian mengumpulkan koordinat GPS petak lahan petani, menyimpan foto ber-geotag, atau mengekspor catatan individu kepada aparat penegak hukum, maka aplikasi tersebut **berubah dari alat persuasi menjadi instrumen pengawasan (*surveillance*) dan pemaksaan (*coercion*)**.

Dampak langsungnya adalah hilangnya kepercayaan petani: petani akan menolak menginstal aplikasi atau memasukkan data palsu. Oleh karena itu, seluruh batasan etika dalam dokumen ini diimplementasikan sebagai **fitur perangkat lunak yang dapat diverifikasi (*verifiable ethical controls*)**.

---

## 2. Audit 4 Pertanyaan Etika Persuasive Technology

Sebelum setiap fitur **Jaga Lahan** dirancang dan dikodekan, fitur tersebut diuji menggunakan empat pertanyaan etika dari materi perkuliahan Pertemuan 1 & Berdichevsky & Neuenschwander (1999):

| No | Pertanyaan Uji Etika | Evaluasi & Implementasi Konkret pada **Jaga Lahan** | Status |
| :-: | :--- | :--- | :-: |
| **1** | **Apakah tujuan akhirnya menguntungkan pengguna sendiri?** | **Ya.** Selain mencegah bencana kabut asap bagi masyarakat luas, pembukaan lahan tanpa bakar mempertahankan unsur hara tanah, menurunkan biaya pupuk pada musim kedua, menjaga kelembapan gambut di sekitar kebun petani sendiri, dan membuka akses ke alat pencacah komunal serta bibit penutup tanah desa. | **LULUS** |
| **2** | **Apakah informasi yang disajikan jujur dan tidak menyesatkan?** | **Ya.** *Kalkulator Bakar vs. Tanpa Bakar* **tidak memanipulasi angka** agar metode tanpa bakar selalu tampak lebih murah di musim pertama. Pada lahan semak tebal, kalkulator secara jujur menampilkan selisih biaya awal (mis. Rp300.000 lebih tinggi untuk 2 ha) dan membuka rumus perhitungannya secara transparan, lalu membantu petani menutup selisih tersebut lewat peminjaman alat desa. | **LULUS** |
| **3** | **Apakah pengguna tetap memiliki kebebasan penuh untuk memilih?** | **Ya.** Petani dapat menggunakan kalkulator dan panduan tanpa wajib mengunggah foto, dapat memilih menyimpan komitmen secara pribadi (*tidak ditampilkan di Kohort Desa*), dapat melewati atau kembali ke tahap mana pun pada *Panduan 6 Tahap*, serta dapat mematikan pengingat kapan saja. | **LULUS** |
| **4** | **Apakah kita sendiri nyaman jika menjadi sasaran teknik persuasi ini?** | **Ya (*The Golden Rule*).** Seluruh pengingat dikirim hanya pada jendela waktu yang relevan (H-21, H-14, H-7), berhenti otomatis setelah 3 kali diabaikan, menggunakan bahasa yang menghormati kearifan lokal petani, dan menjamin privasi lokasi kebun. | **LULUS** |

---

## 3. Prinsip Persuasi yang Ditolak Secara Eksplisit

Meskipun Cialdini (2007) merumuskan enam prinsip persuasi dan literatur kampanye publik sering menggunakan rasa takut, **Jaga Lahan secara sadar menolak dua pendekatan berikut**:

### 3.1 Penolakan terhadap Prinsip *Scarcity* (Kelangkaan Buatan)
- **Mengapa Ditolak:** Membuat hitung mundur palsu (*"Tinggal 2 slot bantuan alat pencacah, daftar dalam 10 menit!"*) pada sumber daya pertanian dasar yang menyangkut mata pencaharian petani adalah bentuk manipulasi emosional (*Dark Pattern: Fake Urgency*) yang memicu kepanikan dan merusak rasa keadilan di dalam desa.
- **Pengganti yang Etis:** Ketersediaan unit alat pencacah desa dan stok benih penutup tanah ditampilkan secara apa adanya sesuai stok riil di balai desa, dan dijadwalkan secara transparan melalui antrean gilir yang dikelola oleh Penyuluh Tersier.

### 3.2 Penolakan terhadap *Fear Appeal* (Ancaman Pidana & Ketakutan Berulang)
- **Mengapa Ditolak:** Menampilkan *pop-up* ancaman penjara, borgol, atau denda miliaran rupiah setiap kali petani membuka aplikasi terbukti memicu reaksi defensif (*psychological reactance*): petani merasa dituduh sebagai pelaku kriminal dan langsung menghapus aplikasi.
- **Pengganti yang Etis:** Fokus diarahkan pada peningkatan **Kemampuan (*Ability*)** melalui peminjaman alat pencacah, panduan praktis 6 tahap, dan perbandingan ekonomi jangka panjang yang konstruktif.

---

## 4. Daftar Larangan *Dark Patterns* dalam Antarmuka Jaga Lahan

Berikut adalah daftar pola desain manipulatif (*Dark Patterns*) yang **dilarang keras** muncul di kode sumber maupun antarmuka **Jaga Lahan**:

| Jenis *Dark Pattern* | Bentuk yang Dilarang di Jaga Lahan | Aturan Desain Pengganti yang Wajib Diterapkan |
| :--- | :--- | :--- |
| **1. *Confirmshaming* / *Public Shaming*** | Tombol penolakan berbunyi *"Saya tidak peduli desa berasap"* atau memajang daftar nama petani yang belum selesai / terlambat mencatat di papan desa. | Gunakan bahasa netral: *"Simpan untuk Diri Sendiri Dulu"* atau *"Lewati Tahap Ini"*. Hanya tampilkan jumlah kolektif desa yang positif, **tanpa papan peringkat individu (*no leaderboard*)**. |
| **2. *Roach Motel* / *Forced Continuity*** | Memudahkan petani bergabung ke Kohort Desa tetapi menyembunyikan tombol untuk beralih ke mode pribadi atau menghapus data. | Sediakan sakelar **"Tampilkan di Kohort Desa / Simpan Pribadi"** dan tombol **"Unduh / Hapus Seluruh Catatan Saya"** langsung di layar Profil dengan satu ketukan. |
| **3. *Hidden Costs / Deceptive Calculations*** | Menyembunyikan biaya sewa alat cacah atau biaya kapur dolomit agar angka metode tanpa bakar terlihat palsu lebih murah. | Tampilkan seluruh komponen biaya secara berdampingan dan sediakan tombol **"Lihat Cara Hitung & Acuan Harga Desa"** di setiap hasil kalkulator. |
| **4. *Nagging* (Gangguan Berulang Tanpa Henti)** | Mengirim notifikasi terus-menerus setiap hari ketika petani belum memperbarui tahap atau tinggi muka air tanah. | Terapkan **Aturan Berhenti Eskalasi 3 Kali**: jika 3 pengingat berturut-turut tidak direspons, sistem otomatis menghentikan notifikasi aplikasi. |

---

## 5. Enam Kontrol Teknis Pelindungan Data Pribadi (Kepatuhan UU PDP No. 27 Tahun 2022)

1. **Resolusi Lokasi Maksimal Tingkat Desa (`Zero-GIS`):**
   - Sistem hanya mencatat `village_id` dan luas lahan umum dalam hektare (mis. `2,0 ha`). Tidak ada pemetaan poligon batas kebun maupun pengambilan titik `navigator.geolocation` pada modul petani.
2. **Pembersihan Otomatis Metadata EXIF GPS di Sisi Klien (`exif-stripper.ts`):**
   - Setiap foto yang dipilih pengguna diproses ulang menggunakan elemen `HTML5 Canvas` di memori peramban sebelum diunggah, sehingga seluruh tag `EXIF` (termasuk koordinat `GPSLatitude`, `GPSLongitude`, dan seri perangkat) terhapus 100% sebelum meninggalkan ponsel petani.
3. **Aturan Ambang Batas Privasi Agregat $N \ge 5$ (`v_safe_harvest_aggregates`):**
   - Rata-rata hasil panen dan biaya di tingkat desa hanya ditampilkan jika terdapat minimal **5 petani unik ($N \ge 5$)** yang mencatat komoditas tersebut di desa yang sama. Jika $N < 5$, sistem secara otomatis menampilkan rata-rata tingkat **Kecamatan** agar tidak ada petani yang dapat ditebak hasil panennya melalui pengurangan sederhana.
4. **Larangan Mutlak Ekspor Data Individu untuk Penegakan Hukum:**
   - Basis data tidak menyediakan fitur ekspor data individu bagi pihak eksternal. Laporan yang dapat diakses oleh tingkat desa/kecamatan hanya berupa agregat luas lahan tanpa bakar dan tren rata-rata zona muka air tanah desa.
5. **Pengelola Data Independen & Jejak Audit (`audit_logs`):**
   - Setiap tindakan verifikasi atau perubahan acuan harga oleh penyuluh tercatat di tabel `audit_logs` yang transparan dan dapat ditinjau oleh komunitas desa.
6. **Persetujuan Berbasis Bahasa Sederhana & Hak Menghapus Data (*Right to Erasure*):**
   - Pada layar *Onboarding*, penjelasan privasi ditulis dengan kalimat sederhana (bukan jargon hukum berlembar-lembar), dan pengguna dapat menghapus profil beserta seluruh jurnal panennya kapan saja sesuai hak subjek data pada UU No. 27 Tahun 2022.

