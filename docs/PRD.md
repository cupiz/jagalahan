# Product Requirements Document (PRD) — JagaLahan

**Nama Produk:** JagaLahan (Smart Land & Zero-Burning Tracker — `https://jagalahan.web.id`)  
**Penyusun:** Iqbal Ahdagita Elbadra (`26MA41D022`)  
**Mata Kuliah:** Persuasive Technology — Magister Ilmu Komputer, Universitas Amikom Purwokerto  
**Dosen Pengampu:** Dr. Dhanar Intan Surya Saputra, M.Kom.

---

## 1. Ringkasan Eksekutif & Latar Belakang Masalah
Kebakaran Hutan dan Lahan (Karhutla) masih menjadi krisis tahunan di Indonesia akibat tingginya godaan pembukaan lahan dengan cara membakar (*slash-and-burn*) yang dipersepsikan cepat dan murah dalam jangka pendek. Pendekatan konvensional yang hanya mengandalkan ancaman pidana atau spanduk larangan sering kali gagal membentuk kebiasaan harian (*habit*) karena petani tidak melihat **nilai manfaat ekonomi nyata** dari metode tanpa bakar (*Zero-Burning*).

**JagaLahan** hadir sebagai aplikasi web persuasif bergaya *consumer-startup* futuristik yang mengubah pencegahan Karhutla menjadi aktivitas harian yang **mudah (*Reduction*)**, **terukur nilai rupiahnya (*Self-Monitoring*)**, **memberikan apresiasi instan (*Rewards*)**, dan **memiliki tujuan finansial jangka panjang (*Goal Setting*)**.

---

## 2. Pemetaan 6 Fitur Utama & Prinsip Persuasi (PSD & FBM)

| No | Fitur Utama JagaLahan | Rute Aplikasi | Prinsip Persuasi (Oinas-Kukkonen / FBM) | Tujuan Perubahan Perilaku |
| :-: | :--- | :--- | :--- | :--- |
| 1 | **Beranda & Ringkasan Manfaat Tanpa Bakar** | `/beranda` | *Self-Monitoring*, *Reduction*, *Tailoring* | Menampilkan surplus bersih (`Rp4.250.000`) antara nilai penghematan pupuk/kompos vs biaya kelola tanpa bakar |
| 2 | **Smart Land & Smoke Scanner (VIP)** | `/scanner` | *Reduction*, *Tunneling*, *Surface Credibility* | Memotong beban ketik manual: cukup foto semak/mulsa, AI menghitung estimasi kompos (`Kg`) & hemat pupuk (`Rp`) |
| 3 | **Check-in Harian & JagaLahan Coins** | `/koin` | *Rewards*, *Praise*, *Intrinsic/Extrinsic Motivation* | Membangun *habit* cek lahan bebas api setiap hari (`+10 Koin`) & tukar `1.000 Koin = Rp10.000` voucher tani |
| 4 | **Pengingat Lahan & Siaga Karhutla** | `/pengingat` | *Suggestion*, *Reminders*, *Facilitator/Spark Trigger* | Mengingatkan jam cek kebun sore (`16:30`), jadwal balik mulsa kompos, dan peringatan cuaca kering BMKG |
| 5 | **Target Lahan Impian** | `/target` | *Goal Setting*, *Self-Monitoring*, *Praise* | Mengarahkan penghematan tanpa bakar menjadi tabungan alat tani modern (*Mesin Pencacah Semak*, *Pompa Air*) |
| 6 | **Tracking Lahan & Unduh Laporan PDF** | `/tracking` | *Self-Monitoring*, *Verifiability* | Menyediakan riwayat transparan & laporan PDF resmi Zero-Burning untuk kelompok tani / koperasi desa |

---

## 3. Model Langganan & Level Pengguna (`/paket`)
1. **Trial 14 Hari (Gratis):** Akses fitur dasar (*Tracking Manual*, *Check-in & Koin*, *Pengingat*, dan *Target Lahan Impian*) selama 14 hari pertama tanpa perlu kartu kredit dan tanpa pemotongan otomatis (*no forced continuity*).
2. **Paket Pro (`Rp9.900/bulan` atau `Rp99.900/tahun`):** Seluruh fitur dasar tanpa batas + **Unduh Laporan PDF Resmi Zero-Burning** + penukaran voucher koin.
3. **Paket VIP (`Rp19.900/bulan` atau `Rp199.900/tahun`):** Seluruh fitur Pro + akses eksklusif **Smart Land & Smoke Scanner (AI Kamera Otomatis)** dan prioritas bonus koin.
