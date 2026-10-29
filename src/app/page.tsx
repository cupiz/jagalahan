"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bell,
  Check,
  ChevronDown,
  Coins,
  Crown,
  EyeOff,
  FileSpreadsheet,
  Lock,
  PlayCircle,
  ScanLine,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Sprout,
  Target,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import { setPlanTier, useV2State } from "@/lib/store";
import { formatNumber } from "@/lib/utils";

export default function LandingPage() {
  const state = useV2State();

  return (
    <div className="min-h-dvh overflow-x-hidden bg-slate-50 text-slate-800 selection:bg-emerald-600 selection:text-white">
      {/* =====================================================================
          1. NAVBAR (GLASSMORPHISM) — Gaya Modern seperti FinTrack
         ===================================================================== */}
      <header className="glass-card fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 transition-all">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
          <Link href="/" className="group flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-blue-600 text-white shadow-lg shadow-emerald-500/25 transition-transform group-hover:scale-105">
              <Image src="/icon-192.png" alt="JagaLahan" width={36} height={36} className="rounded-xl" priority />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">
              JagaLahan<span className="text-emerald-600">.</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-xs font-bold text-slate-600 md:flex">
            <a href="#fitur" className="transition-colors hover:text-emerald-600">
              Fitur Utama
            </a>
            <a href="#ai-scanner" className="flex items-center gap-1.5 transition-colors hover:text-emerald-600">
              <Sparkles className="size-3.5 text-emerald-600" />
              Smart Scanner AI
            </a>
            <a href="#preview-6-layar" className="transition-colors hover:text-emerald-600">
              6 Layar Aplikasi
            </a>
            <a href="#paket" className="transition-colors hover:text-emerald-600">
              Paket Langganan
            </a>
            <a href="#faq" className="transition-colors hover:text-emerald-600">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            <Link
              href="/beranda"
              className="hidden rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-200 sm:inline-flex"
            >
              Masuk Dasbor
            </Link>
            <Link
              href="/beranda"
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-emerald-500/25 transition hover:from-emerald-700 hover:to-teal-700 active:scale-95"
            >
              <span>Mulai Gratis</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* =====================================================================
          2. HERO SECTION DENGAN FLOATING LIVE DASHBOARD MOCKUP
         ===================================================================== */}
      <section className="relative overflow-hidden pb-16 pt-28 sm:pb-24 sm:pt-36">
        <div className="pointer-events-none absolute left-1/2 top-1/4 h-[380px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-emerald-500/15 via-teal-500/15 to-blue-500/15 blur-[120px] sm:h-[460px] sm:w-[820px]" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/90 px-4 py-1.5 text-xs font-bold text-emerald-700 shadow-xs backdrop-blur-md">
            <Sparkles className="size-3.5 animate-pulse text-emerald-600" />
            <span>JagaLahan v2.0 • Smart Land & Karhutla Prevention App</span>
          </div>

          {/* Headline */}
          <h1 className="mx-auto max-w-4xl text-3xl font-black leading-[1.15] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Kelola Lahan Tanpa Bakar & Target Impian{" "}
            <span className="text-gradient">Otomatis Tanpa Ribet.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm font-medium leading-relaxed text-slate-600 sm:text-base lg:text-lg">
            Solusi cerdas pencegahan kebakaran hutan dan lahan (Karhutla) dengan{" "}
            <strong>Smart Land Scanner AI</strong>, pencatatan manfaat kompos & penghematan pupuk,{" "}
            <strong>Check-in Harian berhadiah Koin Hijau</strong>, serta alokasi <strong>Target Alat Impian</strong>.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
            <Link
              href="/beranda"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-4 text-xs font-extrabold text-white shadow-xl shadow-emerald-500/25 transition-all hover:from-emerald-700 hover:to-teal-700 active:scale-95 sm:w-auto sm:text-sm"
            >
              <span>Buka Aplikasi Sekarang — Gratis</span>
              <ArrowRight className="size-4" />
            </Link>
            <a
              href="#preview-6-layar"
              className="glass-card flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 px-8 py-4 text-xs font-bold text-slate-700 transition-all hover:bg-slate-100/80 sm:w-auto sm:text-sm"
            >
              <PlayCircle className="size-4 text-emerald-600" />
              <span>Lihat 6 Layar & Paket</span>
            </a>
          </div>

          {/* Trust Badges */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-[11px] font-semibold text-slate-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-emerald-500" /> Privasi Aman & Bebas Pelacakan GPS (UU PDP)
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="size-4 text-amber-500" /> Scan Lahan & Semak Dalam 3 Detik
            </span>
            <span className="flex items-center gap-1.5">
              <Smartphone className="size-4 text-blue-500" /> Responsif di HP & Desktop
            </span>
          </div>

          {/* FLOATING LIVE DASHBOARD MOCKUP WINDOW */}
          <div className="animate-float relative mx-auto mt-12 max-w-5xl">
            <div className="glow-effect rounded-3xl border border-slate-200/80 bg-gradient-to-b from-slate-200/90 to-slate-100/40 p-2 shadow-2xl backdrop-blur-md sm:p-3">
              <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-4 text-left shadow-inner sm:p-6">
                {/* Top Browser Bar */}
                <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="inline-block size-3 rounded-full bg-rose-500" />
                    <span className="inline-block size-3 rounded-full bg-amber-500" />
                    <span className="inline-block size-3 rounded-full bg-emerald-500" />
                    <span className="ml-2 font-mono text-[10px] text-slate-400">
                      jagalahan.vercel.app/beranda
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-700">
                      🪙 {formatNumber(state.coins, 0)} Koin · 🔥 Streak {state.streakDays} Hari
                    </span>
                    <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-600">
                      <span className="size-1.5 animate-ping rounded-full bg-emerald-500" /> Live Dashboard
                    </span>
                  </div>
                </div>

                {/* Mini 3 KPI Cards inside Mockup */}
                <div className="mb-6 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
                  <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Total Nilai Manfaat Tanpa Bakar
                    </span>
                    <h3 className="mt-1 text-lg font-black text-slate-900">Rp 4.250.000</h3>
                    <span className="mt-1 flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                      <TrendingUp className="size-3" /> +Rp5.000.000 Pupuk & Kompos Dihemat
                    </span>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Target Alat Impian
                    </span>
                    <h3 className="mt-1 text-lg font-black text-emerald-600">Rp 5.200.000</h3>
                    <span className="mt-1 block text-[10px] font-bold text-emerald-600">
                      Mesin Pencacah Semak: 65% Tercapai
                    </span>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Biaya Kelola Terkendali
                    </span>
                    <h3 className="mt-1 text-lg font-black text-slate-900">Rp 750.000</h3>
                    <span className="mt-1 block text-[10px] text-slate-400">
                      Status Lahan: 100% Bebas Api & Asap
                    </span>
                  </div>
                </div>

                {/* Banner AI Scanner inside Mockup */}
                <div className="flex flex-col items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 p-3.5 text-white shadow-lg sm:flex-row">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/20">
                      <ScanLine className="size-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold sm:text-sm">
                        AI Smart Land & Smoke Scanner (Eksklusif VIP)
                      </h4>
                      <p className="text-[10px] text-emerald-100">
                        Foto semak belukar, kondisi gambut, atau nota sarana tani — AI langsung menghitung potensi
                        kompos & risiko api otomatis.
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/scanner"
                    className="shrink-0 rounded-xl bg-white px-3.5 py-1.5 text-[10px] font-extrabold text-emerald-700 shadow-xs hover:bg-emerald-50"
                  >
                    Coba Smart Scanner
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. STATS COUNTER BAR
         ===================================================================== */}
      <section className="border-y border-slate-200/80 bg-slate-100/60 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 text-center md:grid-cols-4">
            <div>
              <h3 className="text-2xl font-black text-slate-900 sm:text-3xl">&lt; 3 Detik</h3>
              <p className="mt-1 text-xs font-semibold text-slate-500">Kecepatan Smart Scanner AI</p>
            </div>
            <div>
              <h3 className="text-2xl font-black text-emerald-600 sm:text-3xl">100% Tanpa Api</h3>
              <p className="mt-1 text-xs font-semibold text-slate-500">Ubah Semak Jadi Kompos & Mulsa</p>
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 sm:text-3xl">+10 Koin/Hari</h3>
              <p className="mt-1 text-xs font-semibold text-slate-500">Check-in Rutin & Tukar Reward</p>
            </div>
            <div>
              <h3 className="text-2xl font-black text-blue-600 sm:text-3xl">UU PDP Safe</h3>
              <p className="mt-1 text-xs font-semibold text-slate-500">EXIF Lokasi Dihapus Otomatis</p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          4. ENAM FITUR UTAMA PERSUASIVE TECHNOLOGY (#fitur)
         ===================================================================== */}
      <section id="fitur" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-emerald-600">
              Semua Fitur Dalam Satu Genggaman
            </span>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Dirancang dengan Persuasive Technology untuk Membangun Kebiasaan Lahan Bebas Bakar
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                href: "/tracking",
                icon: FileSpreadsheet,
                color: "bg-emerald-100 text-emerald-600 hover:border-emerald-500",
                principle: "Self-Monitoring & Reduction",
                title: "1. Tracking Lahan & Unduh Laporan PDF",
                desc: "Catat nilai manfaat kompos/penghematan pupuk dan biaya kelola lahan tanpa bakar secara ringkas. Tersedia grafik ringkasan dan unduh laporan PDF.",
              },
              {
                href: "/scanner",
                icon: ScanLine,
                color: "bg-blue-100 text-blue-600 hover:border-blue-500",
                principle: "Reduction & Perceived Usefulness (VIP)",
                title: "2. Smart Land & Smoke Scanner",
                desc: "Fitur eksklusif VIP untuk memotret tumpukan semak, kondisi tanah gambut, atau nota sarana tani. Sistem mengekstrak estimasi kompos & status risiko api untuk dikonfirmasi.",
              },
              {
                href: "/koin",
                icon: Coins,
                color: "bg-amber-100 text-amber-600 hover:border-amber-500",
                principle: "Commitment, Consistency & Reward",
                title: "3. Check-in Harian, Streak & Koin Hijau",
                desc: "Lakukan check-in harian memastikan lahan bebas api (+10 Koin), bangun streak 7/14/30 hari dengan pesan suportif, dan tukar 1.000 Koin menjadi Rp10.000 voucher bibit/pupuk.",
              },
              {
                href: "/pengingat",
                icon: Bell,
                color: "bg-purple-100 text-purple-600 hover:border-purple-500",
                principle: "Trigger / Reminder (Fogg Behavior Model)",
                title: "4. Pengingat Siaga Karhutla & Jadwal Lahan",
                desc: "Atur pengingat cek kelembapan lahan sore hari, jadwal balik mulsa kompos, dan peringatan cuaca kering. Singkat, tidak mengganggu, dan bebas dinonaktifkan.",
              },
              {
                href: "/target",
                icon: Target,
                color: "bg-teal-100 text-teal-600 hover:border-teal-500",
                principle: "Goal Setting, Personalization & Feedback",
                title: "5. Target Lahan Impian (Progress Bar)",
                desc: "Tetapkan target konkret seperti Mesin Pencacah Semak, Pompa Air Siaga Kemarau, atau Bibit Unggul. Pantau milestone 25%, 50%, 75%, hingga 100%.",
              },
              {
                href: "/paket",
                icon: Crown,
                color: "bg-indigo-100 text-indigo-600 hover:border-indigo-500",
                principle: "Transparency & Otonomi Pengguna",
                title: "6. Level Pengguna Transparan (Trial, Pro, VIP)",
                desc: "Perbandingan jelas antara Trial 14 Hari (Gratis), Pro (Rp9.900/bln), dan VIP (Rp19.900/bln) tanpa biaya tersembunyi atau hitung mundur palsu.",
              },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <Link
                  key={f.title}
                  href={f.href}
                  className="group rounded-3xl border border-slate-200/80 bg-slate-50/80 p-6 transition-all hover:-translate-y-1 hover:border-emerald-500 hover:bg-white hover:shadow-xl sm:p-7"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div
                      className={`flex size-12 items-center justify-center rounded-2xl transition-transform group-hover:scale-110 ${f.color.split(" ").slice(0, 2).join(" ")}`}
                    >
                      <Icon className="size-6" />
                    </div>
                    <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-extrabold text-emerald-700 ring-1 ring-slate-200">
                      {f.principle}
                    </span>
                  </div>
                  <h3 className="mb-2 text-base font-extrabold text-slate-900 group-hover:text-emerald-600">
                    {f.title}
                  </h3>
                  <p className="text-xs font-medium leading-relaxed text-slate-500">{f.desc}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================================
          5. SECTION AI SMART LAND SCANNER DETAIL (#ai-scanner)
         ===================================================================== */}
      <section id="ai-scanner" className=" border-y border-slate-200/80 bg-slate-100/60 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="mb-4 inline-block rounded-full border border-emerald-200 bg-emerald-100 px-3 py-1 text-[10px] font-black uppercase text-emerald-700">
                Teknologi Vision AI • Eksklusif VIP
              </span>
              <h2 className="mb-4 text-2xl font-black leading-snug tracking-tight text-slate-900 sm:text-4xl">
                Arahkan Kamera ke Lahan atau Semak, Biarkan AI Menghitung Manfaat Tanpa Bakar.
              </h2>
              <p className="mb-6 text-xs font-medium leading-relaxed text-slate-600 sm:text-sm">
                Banyak petani dan pengelola lahan merasa kerepotan memperkirakan berapa banyak kompos yang dihasilkan
                dari tebasan semak atau mencatat bukti biaya sarana tani. <strong>Smart Land Scanner</strong> memangkas
                hambatan tersebut (<em>Reduction</em>) dalam hitungan detik.
              </p>

              <ul className="space-y-3 text-xs font-semibold text-slate-700">
                {[
                  "Mendeteksi jenis vegetasi semak, kelembapan tanah gambut, atau gejala asap secara instan.",
                  "Menghitung estimasi berat kompos (Kg) dan nilai penghematan pupuk (Rp) secara otomatis.",
                  "Menampilkan formulir pemeriksaan agar pengguna selalu mengonfirmasi data sebelum disimpan.",
                  "Menghapus metadata lokasi (EXIF GPS) otomatis di perangkat demi melindungi privasi petani.",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                      <Check className="size-3" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-7">
                <Link
                  href="/scanner"
                  className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3.5 text-xs font-extrabold text-white shadow-lg hover:bg-slate-800"
                >
                  <ScanLine className="size-4 text-emerald-400" />
                  <span>Coba Simulasi Smart Land Scanner</span>
                </Link>
              </div>
            </div>

            {/* Preview AI Extraction JSON Card */}
            <div className="relative">
              <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6 text-white shadow-2xl">
                <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-4 text-emerald-400" />
                    <span className="text-xs font-bold">Smart Land Scanner — AI Extraction Result</span>
                  </div>
                  <span className="font-mono text-[10px] font-bold text-emerald-400">
                    Status: Verified (EXIF Stripped)
                  </span>
                </div>
                <pre className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900 p-4 font-mono text-xs leading-relaxed text-emerald-300">{`{
  "objek_pindai": "Semak Belukar Gambut (2,0 Ha)",
  "status_kelembapan": "AMAN - Lembap (28 cm)",
  "potensi_kompos_mulsa_kg": 450,
  "nilai_hemat_pupuk_rp": 1500000,
  "kategori": "Kompos & Mulsa Tanpa Bakar",
  "tanggal_pindai": "2026-10-29"
}`}</pre>
                <p className="mt-3 text-[11px] font-medium text-slate-400">
                  Hasil pembacaan ditampilkan sebagai saran yang dapat dikoreksi pengguna sebelum menekan tombol{" "}
                  <strong className="text-white">Konfirmasi dan Simpan</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          6. SHOWCASE 6 LAYAR ANTARMUKA MOBILE (Persis Komposisi Halaman 8 Esai!)
         ===================================================================== */}
      <section id="preview-6-layar" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-emerald-600">
              Desain Antarmuka Aplikasi (Bagian E Esai)
            </span>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-4xl">
              6 Layar Antarmuka Mobile JagaLahan
            </h2>
            <p className="mt-2 text-xs font-medium text-slate-500 sm:text-sm">
              Setiap layar di bawah ini dapat diklik untuk membuka halaman interaktif penuhnya.
            </p>
          </div>

          {/* Grid 3 Atas + 3 Bawah Phone Frame Mockups */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* PHONE 1: BERANDA (DASHBOARD) */}
            <Link
              href="/beranda"
              className="group mx-auto w-full max-w-[310px] rounded-[38px] border-[7px] border-slate-900 bg-slate-50 p-3.5 shadow-xl transition hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="mb-2 flex items-center justify-between px-1 text-[10px] font-bold text-slate-500">
                <span>9:41</span>
                <span className="h-3 w-16 rounded-full bg-slate-900" />
                <span>100%</span>
              </div>
              <div className="space-y-2.5 text-left">
                <div>
                  <p className="text-sm font-black text-slate-900">Halo, Iqbal 🌱</p>
                  <p className="text-[10px] text-slate-500">Semangat terus jaga lahan bebas asap!</p>
                </div>
                <div className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 p-2.5 text-white">
                  <p className="text-[11px] font-extrabold">📷 Smart Land Scanner</p>
                  <p className="text-[9px] text-emerald-100">Scan semak/lahan, hitung kompos otomatis</p>
                </div>
                <div className="rounded-xl bg-slate-900 p-3 text-white">
                  <p className="text-[9px] text-slate-300">Total Nilai Manfaat Tanpa Bakar</p>
                  <p className="text-lg font-black tabular-nums">Rp4.250.000</p>
                  <div className="mt-2 grid grid-cols-2 gap-1.5 text-[9px]">
                    <div className="rounded-lg bg-white/10 p-1.5">
                      <span className="block text-emerald-300">↑ Manfaat</span>
                      <strong className="tabular-nums">Rp5.000.000</strong>
                    </div>
                    <div className="rounded-lg bg-white/10 p-1.5">
                      <span className="block text-rose-300">↓ Biaya Kelola</span>
                      <strong className="tabular-nums">Rp750.000</strong>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-2.5">
                  <p className="text-[10px] font-extrabold text-slate-800">Ringkasan Manfaat Lahan</p>
                  <div className="mt-1.5 flex items-center gap-3">
                    <div className="flex size-14 shrink-0 items-center justify-center rounded-full border-[6px] border-emerald-500 border-r-teal-400 border-b-amber-400 text-[9px] font-black">
                      100%
                    </div>
                    <div className="space-y-0.5 text-[9px] text-slate-600">
                      <p>🟢 Kompos Mulsa: 45%</p>
                      <p>🔵 Hemat Pupuk: 25%</p>
                      <p>🟡 Insentif Desa: 16%</p>
                      <p>⚪ Lainnya: 14%</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl bg-emerald-600 py-2 text-center text-[10px] font-extrabold text-white">
                  + Catat Aktivitas Lahan
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-2.5">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span>🎯 Mesin Pencacah Semak</span>
                    <span className="text-emerald-600">65%</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-slate-100">
                    <div className="h-2 w-[65%] rounded-full bg-emerald-500" />
                  </div>
                </div>
              </div>
            </Link>

            {/* PHONE 2: TRACKING LAHAN & LAPORAN */}
            <Link
              href="/tracking"
              className="group mx-auto w-full max-w-[310px] rounded-[38px] border-[7px] border-slate-900 bg-slate-50 p-3.5 shadow-xl transition hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="mb-2 flex items-center justify-between px-1 text-[10px] font-bold text-slate-500">
                <span>9:41</span>
                <span className="h-3 w-16 rounded-full bg-slate-900" />
                <span>100%</span>
              </div>
              <div className="space-y-2.5 text-left">
                <p className="text-center text-xs font-black text-slate-900">Tracking Lahan Tanpa Bakar</p>
                <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-200/70 p-1 text-center text-[9px] font-bold">
                  <span className="rounded-lg bg-emerald-600 py-1 text-white">Semua</span>
                  <span className="py-1 text-slate-600">Manfaat</span>
                  <span className="py-1 text-slate-600">Biaya</span>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-[9px] font-semibold text-slate-600">
                  📅 1 – 31 Oktober 2026 (Musim Tanam)
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-[9px]">
                  <div className="rounded-xl bg-emerald-50 p-2 text-emerald-800">
                    <span className="block">↑ Total Manfaat</span>
                    <strong className="text-xs font-black tabular-nums">Rp5.000.000</strong>
                  </div>
                  <div className="rounded-xl bg-rose-50 p-2 text-rose-800">
                    <span className="block">↓ Total Biaya</span>
                    <strong className="text-xs font-black tabular-nums">Rp750.000</strong>
                  </div>
                </div>
                <div className="space-y-1.5 rounded-xl border border-slate-200 bg-white p-2.5 text-[9px]">
                  <p className="font-extrabold text-slate-800">Daftar Aktivitas Lahan</p>
                  {[
                    ["🌱 Hemat Pupuk dari Mulsa", "+Rp3.500.000", "text-emerald-600"],
                    ["♻️ Nilai Kompos Semak 450Kg", "+Rp1.500.000", "text-emerald-600"],
                    ["🪓 Tebas & Cacah Semak", "-Rp450.000", "text-rose-600"],
                    ["🧪 Kapur Dolomit & EM4", "-Rp200.000", "text-rose-600"],
                    ["💧 Perawatan Sekat Kanal", "-Rp100.000", "text-rose-600"],
                  ].map(([t, val, cls]) => (
                    <div key={t} className="flex items-center justify-between border-b border-slate-100 pb-1 last:border-none">
                      <span className="font-semibold text-slate-700">{t}</span>
                      <span className={`font-extrabold tabular-nums ${cls}`}>{val}</span>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl bg-emerald-600 py-2 text-center text-[10px] font-extrabold text-white">
                  ⬇ Unduh Laporan PDF
                </div>
              </div>
            </Link>

            {/* PHONE 3: JAGALAHAN COINS & CHECK-IN */}
            <Link
              href="/koin"
              className="group mx-auto w-full max-w-[310px] rounded-[38px] border-[7px] border-slate-900 bg-slate-50 p-3.5 shadow-xl transition hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="mb-2 flex items-center justify-between px-1 text-[10px] font-bold text-slate-500">
                <span>9:41</span>
                <span className="h-3 w-16 rounded-full bg-slate-900" />
                <span>100%</span>
              </div>
              <div className="space-y-2.5 text-left">
                <p className="text-center text-xs font-black text-slate-900">JagaLahan Coins</p>
                <div className="rounded-2xl bg-gradient-to-tr from-emerald-700 via-teal-600 to-blue-600 p-3.5 text-white">
                  <p className="text-[10px] text-emerald-100">🪙 Saldo Koin Hijau</p>
                  <p className="text-xl font-black tabular-nums">1.250 Koin</p>
                  <p className="mt-1 text-[9px] text-emerald-100">
                    Kumpulkan koin dari aksi jaga lahan tanpa bakar dan tukarkan dengan voucher bibit/pupuk!
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <p className="text-[11px] font-extrabold text-slate-900">📅 Check-in Bebas Api Hari Ini</p>
                  <p className="text-[10px] font-bold text-emerald-600">Dapatkan +10 Koin (Streak 12 Hari 🔥)</p>
                  <p className="mt-1 text-[9px] text-slate-500">
                    Setiap hari kamu memastikan kebun bebas api & asap, kamu mendapatkan koin!
                  </p>
                  <div className="mt-2 rounded-xl bg-emerald-600 py-2 text-center text-[10px] font-extrabold text-white">
                    ✓ Check-in Sekarang
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <p className="text-[11px] font-extrabold text-slate-900">🎁 Tukar Reward</p>
                  <p className="text-[10px] font-bold text-amber-600">
                    Tukar 1.000 Koin = Rp10.000 Voucher Sarana Tani
                  </p>
                  <div className="mt-2 rounded-xl border border-emerald-600 py-1.5 text-center text-[10px] font-extrabold text-emerald-600">
                    Tukar Reward
                  </div>
                </div>
              </div>
            </Link>

            {/* PHONE 4: PENGINGAT SIAGA KARHUTLA */}
            <Link
              href="/pengingat"
              className="group mx-auto w-full max-w-[310px] rounded-[38px] border-[7px] border-slate-900 bg-slate-50 p-3.5 shadow-xl transition hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="mb-2 flex items-center justify-between px-1 text-[10px] font-bold text-slate-500">
                <span>9:41</span>
                <span className="h-3 w-16 rounded-full bg-slate-900" />
                <span>100%</span>
              </div>
              <div className="space-y-2.5 text-left">
                <p className="text-center text-xs font-black text-slate-900">Pengingat Siaga Lahan</p>
                {[
                  ["🔔 Catat kondisi lahan harian", "Jangan lupa cek kebun bebas api sore ini ya!", "🕒 16:30"],
                  ["♻️ Jadwal Balik Mulsa Kompos", "Balik tumpukan serasah hari ke-10 agar subur", "📅 25 Okt 2026"],
                  ["🔥 Siaga Cuaca Panas BMKG", "Pastikan sekat kanal tertutup & gambut lembap", "📅 28 Okt 2026"],
                ].map(([t, s, d]) => (
                  <div key={t} className="rounded-xl border border-slate-200 bg-white p-3">
                    <p className="text-[11px] font-extrabold text-slate-900">{t}</p>
                    <p className="mt-0.5 text-[9px] text-slate-500">{s}</p>
                    <span className="mt-1.5 inline-block rounded-md bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
                      {d}
                    </span>
                  </div>
                ))}
                <div className="rounded-xl bg-emerald-600 py-2 text-center text-[10px] font-extrabold text-white">
                  + Tambah Pengingat
                </div>
              </div>
            </Link>

            {/* PHONE 5: TARGET LAHAN IMPIAN */}
            <Link
              href="/target"
              className="group mx-auto w-full max-w-[310px] rounded-[38px] border-[7px] border-slate-900 bg-slate-50 p-3.5 shadow-xl transition hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="mb-2 flex items-center justify-between px-1 text-[10px] font-bold text-slate-500">
                <span>9:41</span>
                <span className="h-3 w-16 rounded-full bg-slate-900" />
                <span>100%</span>
              </div>
              <div className="space-y-2.5 text-left">
                <p className="text-center text-xs font-black text-slate-900">Target Lahan Impian</p>
                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <p className="text-xs font-extrabold text-slate-900">🚜 Mesin Pencacah Semak</p>
                  <p className="text-[9px] text-slate-500">Ayo terus sisihkan penghematan, alat impianmu pasti tercapai!</p>
                  <div className="mt-2 flex justify-between text-[9px]">
                    <span>Target Dana</span>
                    <strong className="tabular-nums">Rp8.000.000</strong>
                  </div>
                  <div className="flex justify-between text-[9px]">
                    <span>Sudah Terkumpul</span>
                    <strong className="text-emerald-600 tabular-nums">Rp5.200.000 (65%)</strong>
                  </div>
                  <div className="mt-1.5 h-2 rounded-full bg-slate-100">
                    <div className="h-2 w-[65%] rounded-full bg-emerald-500" />
                  </div>
                  <p className="mt-2 rounded-lg bg-emerald-50 p-1.5 text-[9px] font-bold text-emerald-700">
                    + Alokasi rutin Rp500.000 / bulan
                  </p>
                </div>
                <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-3 text-[9px]">
                  <p className="font-extrabold text-slate-800">Target Lainnya</p>
                  <div>
                    <div className="flex justify-between font-bold">
                      <span>💧 Pompa Air Siaga Kemarau (Rp4 Jt)</span>
                      <span>40%</span>
                    </div>
                    <div className="mt-1 h-1.5 rounded-full bg-slate-100">
                      <div className="h-1.5 w-[40%] rounded-full bg-teal-500" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between font-bold">
                      <span>🌱 Bibit Unggul Kebun (Rp10 Jt)</span>
                      <span>30%</span>
                    </div>
                    <div className="mt-1 h-1.5 rounded-full bg-slate-100">
                      <div className="h-1.5 w-[30%] rounded-full bg-blue-500" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            {/* PHONE 6: SMART LAND SCANNER */}
            <Link
              href="/scanner"
              className="group mx-auto w-full max-w-[310px] rounded-[38px] border-[7px] border-slate-900 bg-slate-900 p-3.5 text-white shadow-xl transition hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="mb-2 flex items-center justify-between px-1 text-[10px] font-bold text-slate-400">
                <span>9:41</span>
                <span className="h-3 w-16 rounded-full bg-black" />
                <span>100%</span>
              </div>
              <div className="space-y-2.5 text-left">
                <p className="text-center text-xs font-black text-white">Smart Land Scanner</p>
                <div className="rounded-2xl border-2 border-dashed border-emerald-400 bg-slate-800 p-3 text-slate-100">
                  <p className="text-center text-[10px] font-black uppercase tracking-wider text-emerald-300">
                    HASIL PINDAI LAHAN & SEMAK
                  </p>
                  <div className="mt-2 space-y-1 border-y border-slate-700 py-2 font-mono text-[9px]">
                    <div className="flex justify-between">
                      <span>Kondisi Semak</span>
                      <span>2,0 Ha (Sedang)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tinggi Air Gambut</span>
                      <span className="text-emerald-300">28 cm (Aman)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Potensi Kompos</span>
                      <span>450 Kg Mulsa</span>
                    </div>
                    <div className="flex justify-between font-bold text-emerald-300">
                      <span>Nilai Hemat Pupuk</span>
                      <span>Rp1.500.000</span>
                    </div>
                  </div>
                  <p className="mt-1.5 text-center text-[8px] text-slate-400">
                    29 Okt 2026 14:23 · EXIF GPS Dihapus
                  </p>
                </div>
                <div className="rounded-xl bg-white p-2.5 text-center text-slate-900">
                  <p className="text-[10px] font-bold text-emerald-600">⟳ Memindai kondisi lahan & semak...</p>
                  <div className="mt-2 inline-flex size-9 items-center justify-center rounded-full bg-emerald-600 text-white">
                    📷
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================================
          7. TIGA KARTU PAKET LANGGANAN (Trial 14 Hari, Pro, VIP — Halaman 9 Esai!)
         ===================================================================== */}
      <section id="paket" className="border-t border-slate-200/80 bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-emerald-600">
              Level Pengguna dan Model Langganan
            </span>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Pilihan Paket yang Jelas, Jujur, dan Transparan
            </h2>
            <p className="mt-2 text-xs font-medium text-slate-500 sm:text-sm">
              Tanpa biaya tersembunyi dan tanpa hitung mundur palsu. Pilih sesuai kebutuhan pengelolaan lahan Anda.
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
            {/* KARTU 1: TRIAL 14 HARI */}
            <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div>
                <div className="rounded-2xl bg-slate-100 p-4">
                  <p className="text-base font-black text-slate-900">Trial 14 Hari</p>
                  <p className="text-xs text-slate-500">Coba fungsi dasar selama 14 hari</p>
                </div>
                <div className="my-5">
                  <p className="text-3xl font-black text-slate-900">Gratis</p>
                  <p className="text-xs font-semibold text-slate-400">Masa uji coba 14 hari</p>
                </div>
                <p className="mb-2 text-xs font-bold text-slate-700">Fitur yang tersedia:</p>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-emerald-600" /> Tracking manfaat & biaya lahan
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-emerald-600" /> Fitur pengingat siaga lahan
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-emerald-600" /> Check-in harian bebas api
                  </li>
                </ul>
                <p className="mb-2 mt-5 border-t border-slate-100 pt-4 text-xs font-bold text-slate-400">
                  Fitur yang tidak tersedia:
                </p>
                <ul className="space-y-1.5 text-xs text-slate-400">
                  <li className="flex items-center gap-2">
                    <X className="size-4" /> Koin & penukaran reward
                  </li>
                  <li className="flex items-center gap-2">
                    <X className="size-4" /> Target lahan impian
                  </li>
                  <li className="flex items-center gap-2">
                    <X className="size-4" /> Laporan dan unduh PDF
                  </li>
                  <li className="flex items-center gap-2">
                    <X className="size-4" /> Smart Land Scanner
                  </li>
                </ul>
              </div>
              <Link
                href="/beranda"
                onClick={() => setPlanTier("trial")}
                className="mt-6 block rounded-2xl border border-slate-300 py-3 text-center text-xs font-extrabold text-slate-700 hover:bg-slate-100"
              >
                Coba Mode Trial 14 Hari
              </Link>
            </div>

            {/* KARTU 2: PAKET PRO */}
            <div className="flex flex-col justify-between rounded-3xl border-2 border-emerald-500/60 bg-white p-6 shadow-md">
              <div>
                <div className="rounded-2xl bg-emerald-50 p-4">
                  <p className="text-base font-black text-emerald-900">Pro</p>
                  <p className="text-xs text-emerald-700">Kelola lahan tanpa bakar lebih lengkap</p>
                </div>
                <div className="my-5 flex items-baseline justify-between">
                  <div>
                    <p className="text-2xl font-black text-slate-900">
                      Rp 9.900 <span className="text-xs font-normal text-slate-500">/ bulan</span>
                    </p>
                    <p className="text-xs font-semibold text-slate-500">Rp 99.900 / tahun</p>
                  </div>
                  <span className="rounded-lg bg-emerald-100 px-2 py-1 text-[10px] font-extrabold text-emerald-700">
                    Hemat ~17%
                  </span>
                </div>
                <p className="mb-2 text-xs font-bold text-slate-700">Fitur yang tersedia:</p>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-emerald-600" /> Tracking manfaat & biaya lahan
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-emerald-600" /> Fitur pengingat siaga lahan
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-emerald-600" /> Check-in harian bebas api
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-emerald-600" /> Koin & penukaran reward
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-emerald-600" /> Target lahan impian
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-emerald-600" /> Laporan dan unduh PDF
                  </li>
                </ul>
                <p className="mb-2 mt-5 border-t border-slate-100 pt-4 text-xs font-bold text-slate-400">
                  Fitur yang tidak tersedia:
                </p>
                <ul className="space-y-1.5 text-xs text-slate-400">
                  <li className="flex items-center gap-2">
                    <X className="size-4" /> Smart Land Scanner
                  </li>
                </ul>
              </div>
              <Link
                href="/beranda"
                onClick={() => setPlanTier("pro")}
                className="mt-6 block rounded-2xl bg-emerald-600 py-3 text-center text-xs font-extrabold text-white hover:bg-emerald-700"
              >
                Pilih Paket Pro
              </Link>
            </div>

            {/* KARTU 3: PAKET VIP */}
            <div className="flex flex-col justify-between rounded-3xl border-2 border-teal-600 bg-white p-6 shadow-xl">
              <div>
                <div className="rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 p-4 text-white">
                  <p className="flex items-center gap-1.5 text-base font-black">
                    <Crown className="size-4 text-amber-300" /> VIP
                  </p>
                  <p className="text-xs text-emerald-100">Pengalaman lengkap + Smart Land Scanner AI</p>
                </div>
                <div className="my-5 flex items-baseline justify-between">
                  <div>
                    <p className="text-2xl font-black text-slate-900">
                      Rp 19.900 <span className="text-xs font-normal text-slate-500">/ bulan</span>
                    </p>
                    <p className="text-xs font-semibold text-slate-500">Rp 199.900 / tahun</p>
                  </div>
                  <span className="rounded-lg bg-teal-100 px-2 py-1 text-[10px] font-extrabold text-teal-800">
                    Hemat ~17%
                  </span>
                </div>
                <p className="mb-2 text-xs font-bold text-slate-700">Fitur yang tersedia:</p>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-emerald-600" /> Tracking manfaat & biaya lahan
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-emerald-600" /> Fitur pengingat siaga lahan
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-emerald-600" /> Check-in harian bebas api
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-emerald-600" /> Koin & penukaran reward
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-emerald-600" /> Target lahan impian
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-emerald-600" /> Laporan dan unduh PDF
                  </li>
                  <li className="flex items-center gap-2 font-bold text-emerald-700">
                    <Check className="size-4 text-emerald-600" /> Smart Land & Smoke Scanner (Eksklusif VIP)
                  </li>
                </ul>
              </div>
              <Link
                href="/beranda"
                onClick={() => setPlanTier("vip")}
                className="mt-6 block rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3 text-center text-xs font-extrabold text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-700 hover:to-teal-700"
              >
                Aktifkan Paket VIP Sekarang
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          8. KEUNGGULAN TAMBAHAN & FAQ (#faq)
         ===================================================================== */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-6 shadow-xs">
              <EyeOff className="mb-3 size-6 text-emerald-600" />
              <h3 className="mb-1 text-sm font-bold text-slate-900">Privacy Mode</h3>
              <p className="text-[11px] font-medium text-slate-500">
                Sembunyikan nominal nilai lahan & tabungan target saat membuka aplikasi di tempat umum.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-6 shadow-xs">
              <Lock className="mb-3 size-6 text-teal-600" />
              <h3 className="mb-1 text-sm font-bold text-slate-900">Pembersih EXIF Lokasi</h3>
              <p className="text-[11px] font-medium text-slate-500">
                Foto lahan pada Smart Scanner otomatis dibersihkan dari koordinat GPS sesuai UU PDP No. 27/2022.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-6 shadow-xs">
              <Sprout className="mb-3 size-6 text-amber-600" />
              <h3 className="mb-1 text-sm font-bold text-slate-900">Suportif & Non-Koersif</h3>
              <p className="text-[11px] font-medium text-slate-500">
                Tidak ada pesan yang mempermalukan pengguna ketika streak terputus atau melewati satu hari.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-6 shadow-xs">
              <BarChart3 className="mb-3 size-6 text-blue-600" />
              <h3 className="mb-1 text-sm font-bold text-slate-900">Laporan Grafik & PDF</h3>
              <p className="text-[11px] font-medium text-slate-500">
                Visualisasi proporsi manfaat kompos, penghematan pupuk, dan biaya kelola lahan secara berkala.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="border-t border-slate-200/80 bg-slate-100/50 py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-emerald-600">
              Pertanyaan Umum
            </span>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Sering Ditanyakan (FAQ)
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            {[
              [
                "Apakah JagaLahan bisa digunakan secara gratis?",
                "Ya! Pengguna baru mendapatkan Trial 14 Hari tanpa biaya untuk menggunakan fitur Tracking lahan tanpa bakar, pengingat siaga, dan check-in harian. Jika tidak berlangganan setelah Trial berakhir, Anda tetap dapat mencatat secara manual.",
              ],
              [
                "Bagaimana cara kerja fitur Smart Land & Smoke Scanner?",
                "Cukup ambil atau unggah foto kondisi semak/lahan atau bukti pembelian sarana tani pada menu Smart Scanner (VIP). Sistem mengekstrak estimasi berat kompos, status risiko api, dan nilai penghematan pupuk ke dalam formulir pemeriksaan agar Anda dapat mengonfirmasi sebelum disimpan.",
              ],
              [
                "Apakah foto lahan dan data saya aman sesuai UU Pelindungan Data Pribadi?",
                "Sangat aman. JagaLahan menerapkan minimisasi data sesuai UU No. 27 Tahun 2022, menghapus metadata lokasi (EXIF GPS) pada foto secara otomatis, dan mengisolasi data setiap akun sehingga tidak dapat dilihat oleh pengguna lain.",
              ],
            ].map(([q, a]) => (
              <details
                key={q}
                className="group cursor-pointer rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs"
              >
                <summary className="flex items-center justify-between text-sm font-bold text-slate-800">
                  <span>{q}</span>
                  <ChevronDown className="size-4 text-slate-400 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 font-medium leading-relaxed text-slate-600">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          9. BANNER CTA FOOTER & FOOTER
         ===================================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-tr from-emerald-600 via-teal-600 to-blue-700 py-16 text-center text-white">
        <div className="relative z-10 mx-auto max-w-4xl px-4">
          <h2 className="mb-3 text-2xl font-black tracking-tight sm:text-4xl">
            Siap Mengelola Lahan Tanpa Bakar Hari Ini?
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-xs font-medium text-emerald-100 sm:text-sm">
            Bangun kebiasaan kelola lahan bebas asap, kumpulkan Koin Hijau, dan wujudkan alat pertanian impianmu.
          </p>
          <Link
            href="/beranda"
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-xs font-extrabold text-emerald-700 shadow-xl transition-all hover:bg-slate-100 active:scale-95 sm:text-sm"
          >
            <span>Buka Dashboard JagaLahan Sekarang</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-800 bg-slate-950 py-10 text-xs text-slate-400">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-center sm:flex-row sm:px-6 sm:text-left lg:px-8">
          <div className="flex items-center gap-2 font-bold text-white">
            <Image src="/icon-192.png" alt="JagaLahan" width={26} height={26} className="rounded-lg" />
            <span className="text-sm font-black">JagaLahan v2.0 — Persuasive Technology</span>
          </div>
          <p className="text-[11px] font-medium text-slate-500">
            &copy; 2026 Iqbal Ahdagita Elbadra (NIM: 26MA41D022) · Magister Ilmu Komputer, Universitas Amikom Purwokerto
          </p>
          <div className="flex items-center gap-4 text-[11px] font-semibold">
            <Link href="/beranda" className=" transition-colors hover:text-white">
              Dashboard
            </Link>
            <Link href="/scanner" className="transition-colors hover:text-white">
              Smart Scanner
            </Link>
            <Link href="/paket" className="transition-colors hover:text-white">
              Paket VIP
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
