"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Bell,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  Coins,
  Cpu,
  Crown,
  Droplets,
  Eye,
  EyeOff,
  FileDown,
  Flame,
  Layers,
  Lock,
  Radar,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Sprout,
  Target,
  TrendingDown,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import { formatRupiah } from "@/lib/utils";

const SCAN_SCENARIOS = [
  {
    id: "gambut-lembap",
    badge: "Skenario 01 • Lahan Gambut Lembap",
    condition: "Semak Belukar & Pakis Gambut Sedang (2,0 Ha)",
    risk: "Aman (Lembap)",
    waterCm: -28,
    compostKg: 450,
    savedRp: 1_500_000,
    action: "Tebas & cacah 10–20 cm, susun di jalur rumpuk, taburkan dolomit + larutan EM4.",
  },
  {
    id: "mulsa-kompos",
    badge: "Skenario 02 • Rumpukan Serasah Matang",
    condition: "Mulsa Serasah & Pelepah Tanpa Bakar (2,5 Ha)",
    risk: "Aman (Lembap)",
    waterCm: -24,
    compostKg: 680,
    savedRp: 2_350_000,
    action: "Balik tumpukan mulsa pada hari ke-10 agar humifikasi nitrogen berjalan optimal.",
  },
  {
    id: "siaga-kemarau",
    badge: "Skenario 03 • Siaga Cuaca Kering BMKG",
    condition: "Semak Mengering & Muka Air Turun (1,5 Ha)",
    risk: "Waspada (Agak Kering)",
    waterCm: -38,
    compostKg: 320,
    savedRp: 1_100_000,
    action: "Tutup rapat pintu sekat kanal desa, basahi jalur rumpuk & tunda penebasan terbuka.",
  },
];

const FAQ_ITEMS = [
  {
    q: "Mengapa JagaLahan lebih efektif mencegah Karhutla dibanding sekadar spanduk larangan?",
    a: "Karena petani membakar lahan akibat persepsi bahwa metode tanpa bakar itu rumit dan mahal. JagaLahan menerapkan Persuasive Technology (Fogg Behavior Model & PSD) untuk menyederhanakan langkah kerja lewat kamera AI (Reduction), memvisualisasikan nilai penghematan pupuk jutaan rupiah (Self-Monitoring), dan memberi apresiasi Koin Hijau harian (Positive Reinforcement).",
  },
  {
    q: "Bagaimana cara kerja Smart Land & Smoke Scanner pada Paket VIP?",
    a: "Cukup arahkan kamera atau unggah foto semak, tumpukan mulsa, atau tongkat air gambut. Sistem AI Vision secara otomatis menghitung estimasi biomassa kompos (Kg), nilai penghematan pupuk NPK (Rp), dan tingkat kerawanan api. Seluruh angka ditampilkan pada formulir verifikasi yang dapat Anda sunting sebelum disimpan ke Tracking Lahan.",
  },
  {
    q: "Apakah foto kebun saya aman dan tidak membocorkan lokasi GPS pribadi?",
    a: "Sangat aman. Sesuai prinsip minimisasi data UU Pelindungan Data Pribadi (UU No. 27 Tahun 2022), JagaLahan menghapus seluruh metadata lokasi EXIF/GPS (tag GPSInfo) langsung di peramban perangkat Anda sebelum foto diproses, serta menyediakan Mode Privasi Nominal (Rp •••••••).",
  },
  {
    q: "Apakah Paket Trial 14 Hari akan memotong saldo otomatis setelah masa uji coba habis?",
    a: "Tidak pernah. JagaLahan bebas dari jebakan langganan (No Forced Continuity). Anda tidak diminta kartu kredit saat memulai Trial 14 Hari, dan koin maupun catatan lahan Anda tidak akan pernah hangus.",
  },
];

export default function FuturisticLandingPage() {
  const [simHectares, setSimHectares] = useState(2.0);
  const [privacyPreview, setPrivacyPreview] = useState(false);
  const [activeScenarioIdx, setActiveScenarioIdx] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const activeScenario = SCAN_SCENARIOS[activeScenarioIdx];
  const simCompostKg = Math.round(simHectares * 225);
  const simSavedFertilizer = Math.round(simHectares * 2_500_000);
  const simManageCost = Math.round(simHectares * 375_000);
  const simNetSurplus = simSavedFertilizer - simManageCost;

  const maskVal = (val: string) => (privacyPreview ? "Rp •••••••" : val);

  return (
    <div className="min-h-screen bg-[#030b09] text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
      {/* =====================================================================
          1. FLOATING FUTURISTIC PILL NAVBAR
         ===================================================================== */}
      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-emerald-500/20 bg-[#051410]/80 px-4 py-3 shadow-2xl shadow-emerald-950/50 backdrop-blur-xl sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/icon-192.png"
              alt="Logo JagaLahan"
              width={40}
              height={40}
              className="h-10 w-10 shrink-0 object-contain drop-shadow-[0_0_12px_rgba(16,185,129,0.35)]"
              priority
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-white">
                  JagaLahan<span className="text-emerald-400">.</span>
                </span>
                <span className="hidden rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-extrabold text-emerald-300 sm:inline-block">
                  jagalahan.web.id
                </span>
              </div>
              <p className="text-[11px] font-medium text-emerald-200/70">
                Zero-Burning Smart Land Intelligence
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 text-xs font-bold text-slate-300 md:flex">
            <a href="#arsitektur-bento" className="transition hover:text-emerald-400">
              Ekosistem Fitur
            </a>
            <a href="#ai-scanner" className="transition hover:text-emerald-400">
              AI Bio-Scanner
            </a>
            <a href="#galeri-layar" className="transition hover:text-emerald-400">
              Antarmuka 6 Layar
            </a>
            <a href="#paket-langganan" className="transition hover:text-emerald-400">
              Paket Langganan
            </a>
            <a href="#faq" className="transition hover:text-emerald-400">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            <Link
              href="/scanner"
              className="hidden items-center gap-1.5 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3.5 py-2 text-xs font-extrabold text-emerald-300 transition hover:bg-emerald-500/20 sm:inline-flex"
            >
              <ScanLine className="h-3.5 w-3.5" />
              Coba AI Scanner
            </Link>
            <Link
              href="/beranda"
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 px-4 py-2 text-xs font-black text-slate-950 shadow-lg shadow-emerald-500/25 transition hover:brightness-110"
            >
              Buka Dashboard
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* =====================================================================
          2. BIOLUMINESCENT FUTURISTIC HERO + LIVE HOLOGRAPHIC COMMAND DECK
         ===================================================================== */}
      <section className="relative overflow-hidden pt-28 pb-20 sm:pt-36 lg:pb-28">
        {/* Artistic Aurora & Cyber Grid Background */}
        <div className="futuristic-grid pointer-events-none absolute inset-0 opacity-60" />
        <div className="animate-pulse-slow pointer-events-none absolute -top-32 left-1/4 h-[32rem] w-[32rem] rounded-full bg-emerald-500/20 blur-[130px]" />
        <div className="animate-pulse-slow pointer-events-none absolute top-40 right-10 h-[26rem] w-[26rem] rounded-full bg-cyan-500/15 blur-[130px]" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-40 w-full -translate-x-1/2 bg-gradient-to-t from-[#030b09] to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            {/* Left Column: Artistic Startup Narrative + Interactive Land Value Simulator (7 cols) */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-950/70 px-3.5 py-1.5 text-xs font-extrabold text-emerald-300 shadow-inner">
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                <span>PERSUASIVE ECO-TECH • ZERO-BURNING SMART TRACKER</span>
              </div>

              <h1 className="mt-5 text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
                Ubah Semak Rawan Api Menjadi{" "}
                <span className="text-gradient">Aset Kompos & Tabungan Alat Tani.</span>
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
                JagaLahan menggabungkan <strong>AI Smart Land & Smoke Scanner</strong>, pencatatan
                surplus ekonomi tanpa bakar, apresiasi <strong>Koin Hijau harian</strong>, serta
                perencanaan <strong>Target Lahan Impian</strong> untuk menghentikan krisis Karhutla
                dari akarnya—tanpa paksaan dan tanpa ribet ketik manual.
              </p>

              {/* Interactive Live Simulator Card right on the Hero */}
              <div className="mt-7 rounded-3xl border border-emerald-500/25 bg-[#071a14]/90 p-5 shadow-2xl backdrop-blur-xl sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-emerald-300">
                    <Radar className="h-4 w-4 text-emerald-400" />
                    Simulasi Instan Nilai Ekonomi Tanpa Bakar
                  </span>
                  <span className="rounded-xl bg-emerald-500/20 px-3 py-1 text-xs font-black text-emerald-300 ring-1 ring-emerald-400/30">
                    Luas Kebun: {simHectares.toFixed(1)} Hektare
                  </span>
                </div>

                <div className="mt-4">
                  <input
                    type="range"
                    min={0.5}
                    max={10}
                    step={0.5}
                    value={simHectares}
                    onChange={(e) => setSimHectares( parseFloat(e.target.value) )}
                    aria-label="Pilih Luas Lahan Hektare"
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-emerald-950 accent-emerald-400"
                  />
                  <div className="mt-1.5 flex justify-between text-[11px] font-semibold text-slate-400">
                    <span>0,5 Ha (Kebun Kecil)</span>
                    <span>2,0 Ha (Rata-rata Petani)</span>
                    <span>5,0 Ha</span>
                    <span>10,0 Ha (Kelompok Tani)</span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3.5">
                    <p className="text-[11px] font-semibold text-slate-400">Potensi Biomassa Mulsa</p>
                    <p className="mt-0.5 text-lg font-black text-white">
                      {simCompostKg.toLocaleString("id-ID")} Kg Kompos
                    </p>
                    <p className="text-[10px] text-emerald-400">Hara nitrogen utuh tanpa bakar</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3.5">
                    <p className="text-[11px] font-semibold text-slate-400">Hemat Belanja Pupuk NPK</p>
                    <p className="mt-0.5 text-lg font-black text-emerald-400">
                      +{formatRupiah(simSavedFertilizer)}
                    </p>
                    <p className="text-[10px] text-slate-400">Biaya EM4 & tebas: -{formatRupiah(simManageCost)}</p>
                  </div>
                  <div className="rounded-2xl border border-emerald-400/30 bg-gradient-to-br from-emerald-500/20 to-teal-500/10 p-3.5">
                    <p className="text-[11px] font-semibold text-emerald-200">Surplus Bersih Petani</p>
                    <p className="mt-0.5 text-lg font-black text-white">
                      {formatRupiah(simNetSurplus)}
                    </p>
                    <p className="text-[10px] text-amber-300">Siap ditabung ke Mesin Pencacah</p>
                  </div>
                </div>
              </div>

              {/* Hero CTA Buttons */}
              <div className="mt-7 flex flex-wrap items-center gap-3.5">
                <Link
                  href="/beranda"
                  className="inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 px-6 py-4 text-sm font-black text-slate-950 shadow-xl shadow-emerald-500/25 transition hover:scale-[1.02] hover:brightness-110"
                >
                  <span>Mulai Kelola Lahan Gratis</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/scanner"
                  className="inline-flex items-center gap-2 rounded-2xl border border-emerald-400/30 bg-white/5 px-5 py-4 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/10"
                >
                  <Camera className="h-4 w-4 text-emerald-400" />
                  <span>Uji Kamera Smart Scanner</span>
                </Link>
                <Link
                  href="/paket"
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-emerald-300 hover:text-emerald-200"
                >
                  <Crown className="h-4 w-4 text-amber-400" />
                  <span>Lihat Paket Trial / Pro / VIP →</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Artistic 3D Holographic Command Deck (5 cols) */}
            <div className="relative lg:col-span-5">
              <div className="animate-float relative rounded-[2rem] border border-emerald-400/30 bg-gradient-to-b from-[#08221b] via-[#051612] to-[#030d0a] p-5 shadow-[0_0_80px_-15px_rgba(16,185,129,0.4)]">
                {/* Top Window Bar */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-teal-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                    <span className="ml-1 text-[11px] font-extrabold tracking-wider text-emerald-300">
                      JAGALAHAN COMMAND DECK
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPrivacyPreview(!privacyPreview)}
                    className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 text-[10px] font-bold text-slate-300 hover:bg-white/10"
                  >
                    {privacyPreview ? <EyeOff className="h-3 w-3 text-emerald-400" /> : <Eye className="h-3 w-3" />}
                    {privacyPreview ? "Sensor Aktif" : "Privacy Mode"}
                  </button>
                </div>

                {/* Card 1: Total Nilai Manfaat Tanpa Bakar */}
                <div className="mt-4 rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 p-5 text-white shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-100">
                      Total Nilai Manfaat Tanpa Bakar
                    </span>
                    <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-extrabold">
                      Zero-Burning Aktif
                    </span>
                  </div>
                  <p className="mt-1 text-3xl font-black tracking-tight">
                    {maskVal("Rp4.250.000")}
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-2.5 text-xs">
                    <div className="rounded-xl bg-black/20 p-2.5">
                      <span className="text-[10px] text-emerald-200">Manfaat Kompos & Pupuk</span>
                      <p className="font-black text-emerald-300">+{maskVal("Rp5.000.000")}</p>
                    </div>
                    <div className="rounded-xl bg-black/20 p-2.5">
                      <span className="text-[10px] text-rose-200">Biaya Kelola Tanpa Bakar</span>
                      <p className="font-black text-rose-200">-{maskVal("Rp750.000")}</p>
                    </div>
                  </div>
                </div>

                {/* Card 2: Holographic Smart Land Scanner Telemetry */}
                <div className="mt-3.5 rounded-2xl border border-emerald-500/25 bg-black/40 p-4">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-300">
                      <ScanLine className="h-4 w-4 text-emerald-400" />
                      AI Smart Land & Smoke Scanner
                    </span>
                    <span className="rounded-md bg-amber-500/20 px-2 py-0.5 text-[10px] font-extrabold text-amber-300">
                      VIP VISION
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5">
                      <p className="text-[10px] text-slate-400">Muka Air</p>
                      <p className="mt-0.5 font-black text-cyan-300">-28 cm</p>
                      <p className="text-[9px] text-emerald-400">Aman Lembap</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5">
                      <p className="text-[10px] text-slate-400">Estimasi Mulsa</p>
                      <p className="mt-0.5 font-black text-white">450 Kg</p>
                      <p className="text-[9px] text-emerald-400">Siap Kompos</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5">
                      <p className="text-[10px] text-slate-400">EXIF GPS</p>
                      <p className="mt-0.5 font-black text-amber-300">Dihapus</p>
                      <p className="text-[9px] text-slate-400">UU PDP Aman</p>
                    </div>
                  </div>
                </div>

                {/* Card 3: Target Lahan Impian & Koin Hijau Bar */}
                <div className="mt-3.5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-200">Mesin Pencacah</span>
                      <span className="font-black text-emerald-400">65%</span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-[65%] rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400" />
                    </div>
                    <p className="mt-1.5 text-[10px] text-slate-400">
                      {maskVal("Rp5.200.000")} / {maskVal("Rp8.000.000")}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-amber-400/25 bg-gradient-to-br from-amber-500/20 to-orange-500/10 p-3.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-amber-200">JagaLahan Coins</span>
                      <Flame className="h-4 w-4 text-orange-400" />
                    </div>
                    <p className="mt-1 text-lg font-black text-white">1.250 Koin</p>
                    <p className="text-[10px] text-amber-200/90">Streak 12 Hari Bebas Api (+10/hr)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. ARTISTIC BENTO GRID — 6 SISTEM PERSUASIF UTAMA
         ===================================================================== */}
      <section id="arsitektur-bento" className="relative border-t border-white/10 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-extrabold text-emerald-300">
              <Layers className="h-3.5 w-3.5" />
              ARSITEKTUR PERSUASIVE SYSTEMS DESIGN (PSD)
            </span>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Enam Instrumen Pintar dalam Satu Ekosistem Tanpa Asap
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400 sm:text-base">
              Dirancang menggunakan kombinasi <em>Fogg Behavior Model (B = MAP)</em> dan{" "}
              <em>Persuasive Systems Design</em> agar kebiasaan menjaga lahan bebas api terbentuk
              secara alami, terukur, dan menguntungkan petani.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-12">
            {/* Bento 1: Smart Land Scanner (7 cols) */}
            <div className="group relative overflow-hidden rounded-3xl border border-emerald-500/25 bg-gradient-to-br from-[#07211a] via-[#051511] to-[#040f0c] p-7 transition hover:border-emerald-400/50 md:col-span-7">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-extrabold text-amber-300 ring-1 ring-amber-400/30">
                  <Crown className="h-3.5 w-3.5" /> Fitur Eksklusif VIP • Prinsip Reduction
                </span>
                <span className="text-xs font-bold text-emerald-400">Auto-Strip EXIF GPS</span>
              </div>
              <h3 className="mt-4 text-2xl font-black text-white">
                1. Smart Land & Smoke Scanner Berbasis AI Vision
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                Memangkas beban ketik manual di kebun. Cukup foto kondisi semak belukar, tumpukan
                mulsa serasah, atau tongkat ukur air gambut—AI langsung mengekstrak estimasi kompos
                (Kg), nilai penghematan pupuk NPK (Rp), dan menyimpannya ke Tracking setelah Anda
                konfirmasi.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/40 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-300">
                    <Camera className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-white">
                      Deteksi Biomassa & Kelembapan Gambut Instan
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Otonomi penuh: hasil AI dapat diedit sebelum disimpan (+15 Koin)
                    </p>
                  </div>
                </div>
                <Link
                  href="/scanner"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-black text-slate-950 transition hover:bg-emerald-400"
                >
                  Buka Scanner <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Bento 2: Beranda & Ringkasan Manfaat (5 cols) */}
            <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition hover:border-emerald-500/30 md:col-span-5">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-extrabold text-emerald-300">
                  <TrendingUp className="h-3.5 w-3.5" /> Self-Monitoring Visual
                </span>
                <h3 className="mt-4 text-xl font-black text-white">
                  2. Beranda Surplus Manfaat Tanpa Bakar
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  Menampilkan kontras nyata antara nilai penghematan pupuk & kompos (
                  <strong className="text-emerald-400">+Rp5.000.000</strong>) terhadap biaya kelola
                  tanpa bakar (<strong className="text-rose-400">-Rp750.000</strong>) dalam Donut
                  Chart interaktif.
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                <span className="text-xs font-semibold text-slate-400">
                  Dilengkapi Mode Privasi Nominal (Rp •••••••)
                </span>
                <Link href="/beranda" className="text-xs font-extrabold text-emerald-400 hover:underline">
                  Lihat Beranda →
                </Link>
              </div>
            </div>

            {/* Bento 3: Check-in Harian & Koin Hijau (4 cols) */}
            <div className="flex flex-col justify-between rounded-3xl border border-amber-500/25 bg-gradient-to-b from-amber-500/10 to-transparent p-6 md:col-span-4">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-extrabold text-amber-300">
                  <Coins className="h-3.5 w-3.5" /> Positive Reinforcement
                </span>
                <h3 className="mt-4 text-lg font-black text-white">
                  3. Check-in Harian & JagaLahan Coins
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-300">
                  Klaim <strong>+10 Koin Hijau</strong> setiap hari memastikan kebun bebas api.
                  Tukar <strong>1.000 Koin = Rp10.000</strong> voucher EM4, dolomit, dan bibit di
                  koperasi desa. Koin dijamin tidak pernah hangus!
                </p>
              </div>
              <Link
                href="/koin"
                className="mt-5 inline-flex items-center gap-1 text-xs font-extrabold text-amber-300 hover:underline"
              >
                Klaim Koin Harian <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Bento 4: Pengingat Lahan & Siaga Karhutla (4 cols) */}
            <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:col-span-4">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/15 px-3 py-1 text-xs font-extrabold text-cyan-300">
                  <Bell className="h-3.5 w-3.5" /> Suggestion & Kairos Trigger
                </span>
                <h3 className="mt-4 text-lg font-black text-white">
                  4. Pengingat Lahan & Siaga Cuaca BMKG
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-300">
                  Pengingat tepat waktu pukul <strong>16:30</strong> sebelum pulang dari kebun,
                  jadwal balik mulsa kompos hari ke-10, dan peringatan cuaca kering dengan sakelar
                  penuh di tangan petani.
                </p>
              </div>
              <Link
                href="/pengingat"
                className="mt-5 inline-flex items-center gap-1 text-xs font-extrabold text-cyan-300 hover:underline"
              >
                Atur Jadwal Pengingat <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Bento 5: Target Lahan Impian (4 cols) */}
            <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:col-span-4">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-extrabold text-emerald-300">
                  <Target className="h-3.5 w-3.5" /> Goal Setting & Milestone
                </span>
                <h3 className="mt-4 text-lg font-black text-white">
                  5. Target Lahan Impian (Alat Tani Modern)
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-300">
                  Wujudkan kepemilikan <strong>Mesin Pencacah Semak Pribadi (65%)</strong> dan{" "}
                  <strong>Pompa Air Siaga Kemarau (40%)</strong> lewat milestone bertahap 25%, 50%,
                  75%, hingga 100%.
                </p>
              </div>
              <Link
                href="/target"
                className="mt-5 inline-flex items-center gap-1 text-xs font-extrabold text-emerald-400 hover:underline"
              >
                Kelola Target Impian <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Bento 6: Tracking & Unduh Laporan PDF Resmi (12 cols banner) */}
            <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-emerald-500/20 bg-gradient-to-r from-[#071d17] via-[#061813] to-[#08221b] p-7 md:col-span-12 md:flex-row md:items-center">
              <div className="max-w-3xl">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-extrabold text-emerald-300">
                  <FileDown className="h-3.5 w-3.5" /> Verifiability & Credibility Support
                </span>
                <h3 className="mt-3 text-xl font-black text-white sm:text-2xl">
                  6. Tracking Riwayat Lahan & Unduh Laporan PDF Resmi Zero-Burning
                </h3>
                <p className="mt-1.5 text-sm text-slate-300">
                  Saring seluruh catatan manfaat kompos dan biaya kelola berdasarkan rentang
                  tanggal, lalu cetak <strong>Laporan PDF Resmi Zero-Burning</strong> sebagai bukti
                  kepatuhan lingkungan untuk kelompok tani, koperasi desa, maupun penyuluh.
                </p>
              </div>
              <Link
                href="/tracking"
                className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-white px-5 py-3.5 text-xs font-black text-slate-950 shadow-lg transition hover:bg-emerald-300"
              >
                <FileDown className="h-4 w-4" />
                Buka Tracking & Laporan PDF
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          4. INTERACTIVE AI BIO-SCANNER TELEMETRY & JSON EXTRACTION PREVIEW
         ===================================================================== */}
      <section id="ai-scanner" className="relative border-t border-white/10 bg-[#020806] py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-extrabold text-emerald-300">
                <Cpu className="h-3.5 w-3.5" /> JAGALAHAN VISION ENGINE
              </span>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
                Dari Foto Semak Kebun Menjadi Data Ekonomi Terstruktur.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                Pilih salah satu skenario pemindaian di bawah ini untuk melihat bagaimana AI
                mengekstrak parameter biofisik lahan menjadi nilai rupiah penghematan pupuk secara
                otomatis:
              </p>

              <div className="mt-6 space-y-2.5">
                {SCAN_SCENARIOS.map((sc, idx) => (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => setActiveScenarioIdx(idx)}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      activeScenarioIdx === idx
                        ? "border-emerald-400 bg-emerald-500/15 shadow-lg shadow-emerald-950/50"
                        : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold text-emerald-300">{sc.badge}</span>
                      <span className="text-xs font-black text-white">
                        +{formatRupiah(sc.savedRp)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-bold text-white">{sc.condition}</p>
                    <p className="mt-0.5 text-xs text-slate-400">{sc.action}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="overflow-hidden rounded-3xl border border-emerald-500/30 bg-[#05120e] shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 bg-black/40 px-5 py-3.5">
                  <span className="text-xs font-extrabold text-emerald-400">
                    POST /api/vision/land-scanner • 200 OK
                  </span>
                  <span className="rounded-lg bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                    EXIF GPS Stripped (UU PDP)
                  </span>
                </div>

                <div className="p-6">
                  <pre className="overflow-x-auto rounded-2xl border border-white/10 bg-black/60 p-4 text-xs leading-relaxed text-emerald-300">
{JSON.stringify(
  {
    status: "verified_ready",
    engine: "JagaLahan-Vision-AI",
    privacy_protection: {
      client_side_exif_stripped: true,
      gps_coordinates_removed: true,
      uu_pdp_compliant: true,
    },
    telemetry: {
      kondisi_vegetasi: activeScenario.condition,
      status_kerawanan_api: activeScenario.risk,
      muka_air_gambut_cm: activeScenario.waterCm,
      estimasi_kompos_kg: activeScenario.compostKg,
      nilai_penghematan_pupuk_rp: activeScenario.savedRp,
      rekomendasi_tailoring: activeScenario.action,
    },
  },
  null,
  2,
)}
                  </pre>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs text-slate-400">
                      Hasil ekstraksi dapat diedit kembali oleh petani sebelum disimpan.
                    </span>
                    <Link
                      href="/scanner"
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-black text-slate-950 hover:bg-emerald-400"
                    >
                      <Camera className="h-4 w-4" />
                      Uji Langsung di Halaman Scanner
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          5. SHOWCASE 6 LAYAR ANTARMUKA UTAMA
         ===================================================================== */}
      <section id="galeri-layar" className="border-t border-white/10 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-extrabold text-emerald-300">
              DESAIN ANTARMUKA PENGGUNA (UI/UX)
            </span>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Enam Layar Interaktif yang Ramah Petani & Tajam di Bawah Sinar Matahari
            </h2>
            <p className="mt-3 text-sm text-slate-400 sm:text-base">
              Klik salah satu kartu layar di bawah ini untuk langsung mencoba fitur interaktifnya.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                num: "01",
                title: "Beranda & Ringkasan Manfaat",
                href: "/beranda",
                badge: "Self-Monitoring",
                metric: "Rp4.250.000 Surplus Bersih",
                desc: "Sapaan personal, kartu Total Nilai Manfaat Tanpa Bakar (+Rp5,0 Jt manfaat vs -Rp750 Rb biaya), Donut Chart 87%, dan Mode Privasi.",
              },
              {
                num: "02",
                title: "Smart Land Scanner (VIP)",
                href: "/scanner",
                badge: "Reduction & AI Vision",
                metric: "450 Kg Kompos • +Rp1,5 Jt",
                desc: "Kamera pemindai semak & mulsa dengan pembersih EXIF/GPS otomatis serta formulir konfirmasi yang dapat diedit penuh.",
              },
              {
                num: "03",
                title: "Check-in & JagaLahan Coins",
                href: "/koin",
                badge: "Positive Reinforcement",
                metric: "1.250 Koin • Streak 12 Hari",
                desc: "Klaim +10 Koin setiap hari, bonus konsistensi 7 hari, pesan suportif tanpa menyalahkan, & tukar 1.000 Koin = Rp10.000 voucher tani.",
              },
              {
                num: "04",
                title: "Pengingat Lahan & Siaga",
                href: "/pengingat",
                badge: "Suggestion & Trigger",
                metric: "16:30 Cek Kebun • BMKG Alert",
                desc: "Pengingat sore hari, jadwal balik mulsa kompos hari ke-10, dan peringatan cuaca kering dengan sakelar toggle on/off.",
              },
              {
                num: "05",
                title: "Target Lahan Impian",
                href: "/target",
                badge: "Goal Setting",
                metric: "Mesin Pencacah 65% Tercapai",
                desc: "Tabungan hasil penghematan tanpa bakar untuk Mesin Pencacah Semak (Rp5,2 Jt / Rp8 Jt), Pompa Air (40%), dan Bibit Unggul (30%).",
              },
              {
                num: "06",
                title: "Tracking & Laporan PDF",
                href: "/tracking",
                badge: "Verifiability",
                metric: "Ekspor PDF Resmi Zero-Burning",
                desc: "Filter Semua / Manfaat / Biaya, rentang tanggal kalender, dan cetak Laporan PDF Resmi Zero-Burning untuk kelompok tani.",
              },
            ].map((item) => (
              <Link
                key={item.num}
                href={item.href}
                className="group flex flex-col justify-between rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-6 transition hover:-translate-y-1 hover:border-emerald-400/50 hover:shadow-2xl hover:shadow-emerald-950/60"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-400">LAYAR {item.num}</span>
                    <span className="rounded-full border border-emerald-400/25 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="mt-3 text-lg font-black text-white group-hover:text-emerald-300">
                    {item.title}
                  </h3>
                  <div className="mt-2.5 rounded-xl border border-emerald-500/20 bg-emerald-950/40 px-3 py-2 text-xs font-extrabold text-emerald-300">
                    {item.metric}
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-slate-300">{item.desc}</p>
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-3 text-xs font-extrabold text-emerald-400">
                  <span>Buka Layar Interaktif</span>
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          6. LEVEL PENGGUNA & PAKET LANGGANAN (TRIAL 14 HARI, PRO, VIP)
         ===================================================================== */}
      <section id="paket-langganan" className="border-t border-white/10 bg-[#020806] py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-500/10 px-3.5 py-1 text-xs font-extrabold text-amber-300">
              <Crown className="h-3.5 w-3.5" /> MODEL LANGGANAN TRANSPARAN (NO DARK PATTERNS)
            </span>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Pilih Level Pengguna Sesuai Kebutuhan Kebun & Kelompok Tani
            </h2>
            <p className="mt-3 text-sm text-slate-400 sm:text-base">
              Tanpa jebakan pemotongan saldo otomatis setelah masa Trial 14 Hari berakhir.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Trial 14 Hari */}
            <div className="flex flex-col justify-between rounded-3xl border border-white/15 bg-white/[0.03] p-7">
              <div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-extrabold text-slate-200">
                  COBA GRATIS
                </span>
                <h3 className="mt-4 text-2xl font-black text-white">Trial 14 Hari</h3>
                <p className="mt-2 text-3xl font-black text-emerald-400">Gratis</p>
                <p className="text-xs font-semibold text-slate-400">Selama 14 Hari Pertama</p>
                <ul className="mt-6 space-y-3 border-t border-white/10 pt-5 text-xs">
                  <li className="flex items-center gap-2.5 text-slate-200">
                    <Check className="h-4 w-4 text-emerald-400" /> Tracking Lahan Manual (Manfaat & Biaya)
                  </li>
                  <li className="flex items-center gap-2.5 text-slate-200">
                    <Check className="h-4 w-4 text-emerald-400" /> Check-in Harian Bebas Api (+10 Koin)
                  </li>
                  <li className="flex items-center gap-2.5 text-slate-200">
                    <Check className="h-4 w-4 text-emerald-400" /> Pengingat Jam Cek Kebun & Mulsa
                  </li>
                  <li className="flex items-center gap-2.5 text-slate-200">
                    <Check className="h-4 w-4 text-emerald-400" /> Target Lahan Impian (Maks. 2 Target)
                  </li>
                  <li className="flex items-center gap-2.5 text-slate-500 line-through">
                    <X className="h-4 w-4" /> Unduh Laporan PDF Resmi Zero-Burning
                  </li>
                  <li className="flex items-center gap-2.5 text-slate-500 line-through">
                    <X className="h-4 w-4" /> Smart Land & Smoke Scanner (AI Kamera)
                  </li>
                </ul>
              </div>
              <Link
                href="/paket"
                className="mt-7 flex w-full items-center justify-center rounded-2xl border border-white/20 bg-white/10 py-3.5 text-xs font-black text-white transition hover:bg-white/20"
              >
                Mulai Trial 14 Hari
              </Link>
            </div>

            {/* Paket Pro */}
            <div className="flex flex-col justify-between rounded-3xl border border-emerald-400/40 bg-white/[0.04] p-7">
              <div>
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-[11px] font-extrabold text-emerald-300">
                  POPULER KELOMPOK TANI
                </span>
                <h3 className="mt-4 text-2xl font-black text-white">Paket Pro</h3>
                <p className="mt-2 text-3xl font-black text-emerald-400">Rp9.900 / bulan</p>
                <p className="text-xs font-semibold text-slate-400">
                  Atau Rp99.900 / tahun (Hemat 16%)
                </p>
                <ul className="mt-6 space-y-3 border-t border-white/10 pt-5 text-xs">
                  <li className="flex items-center gap-2.5 text-slate-200">
                    <Check className="h-4 w-4 text-emerald-400" /> Semua Fitur Trial 14 Hari Tanpa Batas
                  </li>
                  <li className="flex items-center gap-2.5 font-bold text-white">
                    <Check className="h-4 w-4 text-emerald-400" /> Unduh Laporan PDF Resmi Zero-Burning
                  </li>
                  <li className="flex items-center gap-2.5 text-slate-200">
                    <Check className="h-4 w-4 text-emerald-400" /> Filter Riwayat & Grafik Ringkasan Lengkap
                  </li>
                  <li className="flex items-center gap-2.5 text-slate-200">
                    <Check className="h-4 w-4 text-emerald-400" /> Target Lahan Impian Tanpa Batas
                  </li>
                  <li className="flex items-center gap-2.5 text-slate-200">
                    <Check className="h-4 w-4 text-emerald-400" /> Penukaran Koin ke Voucher Sarana Tani
                  </li>
                  <li className="flex items-center gap-2.5 text-slate-500 line-through">
                    <X className="h-4 w-4" /> Smart Land & Smoke Scanner (AI Kamera)
                  </li>
                </ul>
              </div>
              <Link
                href="/paket"
                className="mt-7 flex w-full items-center justify-center rounded-2xl bg-emerald-500 py-3.5 text-xs font-black text-slate-950 transition hover:bg-emerald-400"
              >
                Pilih Paket Pro
              </Link>
            </div>

            {/* Paket VIP */}
            <div className="relative flex flex-col justify-between rounded-3xl border-2 border-amber-400/70 bg-gradient-to-b from-[#092920] via-[#061b15] to-[#04100d] p-7 shadow-[0_0_60px_-15px_rgba(16,185,129,0.4)]">
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-amber-400/20 px-3 py-1 text-[11px] font-extrabold text-amber-300 ring-1 ring-amber-400/40">
                    EKSKLUSIF + AI SCANNER
                  </span>
                  <span className="text-[11px] font-extrabold text-emerald-300">Terlengkap</span>
                </div>
                <h3 className="mt-4 text-2xl font-black text-white">Paket VIP</h3>
                <p className="mt-2 text-3xl font-black text-amber-300">Rp19.900 / bulan</p>
                <p className="text-xs font-semibold text-emerald-200/80">
                  Atau Rp199.900 / tahun (Hemat 16%)
                </p>
                <ul className="mt-6 space-y-3 border-t border-white/15 pt-5 text-xs">
                  <li className="flex items-center gap-2.5 text-white">
                    <Check className="h-4 w-4 text-emerald-400" /> Semua Fitur Paket Pro Tanpa Batas
                  </li>
                  <li className="flex items-center gap-2.5 font-extrabold text-amber-300">
                    <Check className="h-4 w-4 text-amber-300" /> Smart Land & Smoke Scanner (AI Kamera)
                  </li>
                  <li className="flex items-center gap-2.5 text-white">
                    <Check className="h-4 w-4 text-emerald-400" /> Deteksi Kompos (Kg) & Hemat Pupuk (Rp)
                  </li>
                  <li className="flex items-center gap-2.5 text-white">
                    <Check className="h-4 w-4 text-emerald-400" /> Auto-Strip Metadata Lokasi EXIF/GPS
                  </li>
                  <li className="flex items-center gap-2.5 text-white">
                    <Check className="h-4 w-4 text-emerald-400" /> Bonus +15 Koin Setiap Pemindaian Lahan
                  </li>
                  <li className="flex items-center gap-2.5 text-white">
                    <Check className="h-4 w-4 text-emerald-400" /> Prioritas Dukungan Penyuluh & Koperasi
                  </li>
                </ul>
              </div>
              <Link
                href="/paket"
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-400 py-3.5 text-xs font-black text-slate-950 shadow-lg transition hover:brightness-110"
              >
                <Zap className="h-4 w-4" />
                Aktifkan Paket VIP
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          7. PERTANYAAN UMUM (FAQ)
         ===================================================================== */}
      <section id="faq" className="border-t border-white/10 py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-black text-white">Pertanyaan yang Sering Diajukan</h2>
            <p className="mt-2 text-sm text-slate-400">
              Transparansi cara kerja, keamanan privasi UU PDP, dan etika persuasi JagaLahan
            </p>
          </div>

          <div className="mt-10 space-y-3.5">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left text-sm font-bold text-white hover:bg-white/[0.02]"
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-emerald-400 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="border-t border-white/10 px-6 py-4 text-xs leading-relaxed text-slate-300">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================================
          8. FOOTER RESMI JAGALAHAN.WEB.ID
         ===================================================================== */}
      <footer className="border-t border-white/10 bg-[#010504] py-12 text-xs text-slate-400">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 sm:px-6 md:flex-row lg:px-8">
          <div className="flex items-center gap-3">
            <Image
              src="/icon-192.png"
              alt="Logo JagaLahan"
              width={36}
              height={36}
              className="h-9 w-9 object-contain"
            />
            <div>
              <p className="text-sm font-black text-white">
                JagaLahan<span className="text-emerald-400">.</span> — jagalahan.web.id
              </p>
              <p className="text-[11px] text-slate-400">
                Smart Land & Zero-Burning Tracker • Pencegahan Karhutla Berbasis Persuasive Technology
              </p>
            </div>
          </div>

          <div className="text-center md:text-right">
            <p className="font-bold text-slate-200">
              Disusun oleh: Iqbal Ahdagita Elbadra (NIM: 26MA41D022)
            </p>
            <p className="mt-0.5 text-[11px] text-slate-400">
              Magister Ilmu Komputer • Universitas Amikom Purwokerto • Dosen Pengampu: Dr. Dhanar
              Intan Surya Saputra, M.Kom.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
