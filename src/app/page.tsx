"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ScanLine,
  Coins,
  Target,
  Bell,
  FileSpreadsheet,
  LayoutDashboard,
  Sprout,
  Users,
  ShieldCheck,
  Check,
  LogIn,
  UserPlus,
} from "lucide-react";

type StageMode = "scanner" | "surplus" | "target";

const SYSTEM_INDEX = [
  {
    idx: "01",
    code: "REDUCTION & SELF-MONITORING",
    title: "Beranda & Kas Lahan",
    desc: "Ringkasan finansial pembukaan lahan tanpa bakar vs penghematan pupuk NPK.",
    metric: "+Rp 2,70 Jt Surplus",
    href: "/beranda",
    icon: LayoutDashboard,
  },
  {
    idx: "02",
    code: "TAILORING & SUGGESTION",
    title: "Smart Land Scanner AI",
    desc: "Pindai foto semak gambut untuk takaran EM4, dolomit, dan nilai kompos.",
    metric: "480 Kg Biomassa",
    href: "/scanner",
    icon: ScanLine,
  },
  {
    idx: "03",
    code: "REWARD & SOCIAL PROOF",
    title: "Check-in & Koin Hijau",
    desc: "Klaim koin harian bebas asap dan tukar voucher pupuk organik di KUD.",
    metric: "18 Hari Streak",
    href: "/koin",
    icon: Coins,
  },
  {
    idx: "04",
    code: "TIMELY TRIGGER",
    title: "Pengingat Siaga Gambut",
    desc: "Jadwal patroli sekat bakar, tinggi muka air gambut, dan pembalikan kompos.",
    metric: "-28 cm Air Gambut",
    href: "/pengingat",
    icon: Bell,
  },
  {
    idx: "05",
    code: "TUNNELING & GOAL SETTING",
    title: "Target Alat Impian",
    desc: "Tabungan kolektif mesin pencacah semak dan pompa air gambut.",
    metric: "78% Terkumpul",
    href: "/target",
    icon: Target,
  },
  {
    idx: "06",
    code: "VERIFIABLE AUDIT",
    title: "Tracking & Ekspor PDF",
    desc: "Jurnal transaksi lahan tanpa bakar siap cetak untuk kredit KUR & koperasi.",
    metric: "PDF Siap Unduh",
    href: "/tracking",
    icon: FileSpreadsheet,
  },
];

const ROLES_FLOW = [
  {
    code: "ROLE 01",
    title: "Petani / Pekebun Lahan",
    focus: "Eksekusi Lahan Tanpa Bakar",
    flow: "Scan foto semak → terima resep EM4 & kompos → catat penghematan pupuk NPK → klaim Koin Hijau harian.",
    badge: "Pengguna Utama",
    icon: Sprout,
  },
  {
    code: "ROLE 02",
    title: "Pengurus Kelompok Tani / Koperasi",
    focus: "Manajemen Alat & Audit Kas",
    flow: "Kelola tabungan Target Alat Mekanis bersama (mesin pencacah/pompa) → unduh laporan PDF bebas bakar.",
    badge: "Koordinator Desa",
    icon: Users,
  },
  {
    code: "ROLE 03",
    title: "Penyuluh / Relawan MPA",
    focus: "Mitigasi Titik Panas & Air Gambut",
    flow: "Pantau pengingat sekat bakar, cek kedalaman air tanah gambut, dan verifikasi desa bebas asap.",
    badge: "Pengawas Siaga",
    icon: ShieldCheck,
  },
];

export default function LandingPage() {
  const [stageMode, setStageMode] = useState<StageMode>("scanner");
  const [hectares, setHectares] = useState<number>(2);

  const npkSavedRp = Math.round(hectares * 1650000);
  const biomassKg = Math.round(hectares * 240);
  const clearCostRp = Math.round(hectares * 210000);
  const netSurplusRp = npkSavedRp - clearCostRp;

  const formatIDR = (val: number) =>
    "Rp " + val.toLocaleString("id-ID", { maximumFractionDigits: 0 });

  return (
    <div className="min-h-screen bg-[#050807] text-[#f4f4f0] selection:bg-emerald-400 selection:text-black font-sans antialiased">
      {/* Subtle Ambient Light */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-56 left-1/3 h-[520px] w-[520px] rounded-full bg-emerald-500/[0.07] blur-[160px]" />
        <div className="absolute bottom-0 right-1/4 h-[420px] w-[420px] rounded-full bg-teal-500/[0.05] blur-[150px]" />
      </div>

      {/* =====================================================================
          TOP ARCHITECTURAL BAR (SWISS GRID HEADER)
         ===================================================================== */}
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#050807]/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3">
              <img
                src="/logo-jagalahan.png"
                alt="JagaLahan"
                className="w-9 h-9 object-contain"
              />
              <span className="text-lg font-bold tracking-tight text-white">
                JagaLahan
              </span>
            </Link>

            <div className="hidden xl:flex items-center gap-2 pl-6 border-l border-white/[0.08] font-mono text-[11px] uppercase tracking-[0.18em] text-white/45">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>02°12&apos;S 113°55&apos;E // ZERO-BURN SYSTEM</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-[0.16em] text-white/60">
            <a href="#kalkulasi" className="hover:text-white transition-colors">
              01. Kalkulasi
            </a>
            <a href="#sistem" className="hover:text-white transition-colors">
              02. Sistem
            </a>
            <a href="#peran" className="hover:text-white transition-colors">
              03. Alur & Role
            </a>
            <a href="#tarif" className="hover:text-white transition-colors">
              04. Tarif
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-white/15 hover:border-white/35 text-xs font-mono uppercase tracking-[0.14em] text-white transition-colors"
            >
              <LogIn className="w-3.5 h-3.5 text-emerald-400" />
              <span>Masuk</span>
            </Link>
            <Link
              href="/register"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 border border-emerald-400/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-xs font-mono uppercase tracking-[0.14em] text-emerald-300 transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Daftar</span>
            </Link>
            <Link
              href="/beranda"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-xs font-mono uppercase tracking-[0.14em] transition-colors"
            >
              <span>Buka App</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto border-x border-white/[0.08]">
        {/* =====================================================================
            00 / HERO SECTION — MONUMENTAL TYPOGRAPHY + INTERACTIVE STAGE
           ===================================================================== */}
        <section className="grid grid-cols-1 lg:grid-cols-12 border-b border-white/[0.08]">
          {/* Left Hero Column (7 Cols) */}
          <div className="lg:col-span-7 p-6 sm:p-12 lg:p-14 border-b lg:border-b-0 lg:border-r border-white/[0.08] flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-emerald-400 mb-6">
                <span>[00 / PERSUASIVE AGRO-FINTECH]</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-[4.4rem] font-bold tracking-[-0.04em] leading-[0.96] text-white">
                Tanpa Api.
                <br />
                Tanpa Asap.
                <br />
                <span className="text-emerald-400">Surplus Jutaan.</span>
              </h1>

              <p className="mt-6 text-base sm:text-lg text-white/60 max-w-xl leading-relaxed font-normal">
                Platform pembukaan lahan tanpa bakar yang mengubah semak gambut menjadi tabungan pupuk NPK, koin reward harian, dan alat mekanis kelompok tani.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link
                  href="/register"
                  className="px-6 py-4 bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-xs font-mono uppercase tracking-[0.18em] transition-all inline-flex items-center gap-2"
                >
                  <span>Mulai Trial 14 Hari</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/beranda"
                  className="px-6 py-4 border border-white/15 bg-white/[0.03] hover:bg-white/[0.08] text-white font-mono text-xs uppercase tracking-[0.18em] transition-all inline-flex items-center gap-2"
                >
                  <span>Live Dashboard</span>
                  <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                </Link>
                <Link
                  href="/login"
                  className="px-5 py-4 text-xs font-mono uppercase tracking-[0.18em] text-white/60 hover:text-white transition-colors"
                >
                  Masuk Akun →
                </Link>
              </div>
            </div>

            {/* Bottom Key Numbers Strip */}
            <div className="mt-12 pt-8 border-t border-white/[0.08] grid grid-cols-3 gap-6">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
                  HEMAT PUPUK / HA
                </div>
                <div className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-white tabular-nums">
                  Rp 1,65 Jt
                </div>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
                  BIOMASSA KOMPOS
                </div>
                <div className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-emerald-400 tabular-nums">
                  240 Kg/Ha
                </div>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
                  RISIKO PIDANA API
                </div>
                <div className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-white tabular-nums">
                  0%
                </div>
              </div>
            </div>
          </div>

          {/* Right Hero Column: Interactive 3-Mode Live Product Stage (5 Cols) */}
          <div className="lg:col-span-5 bg-[#070c0a] flex flex-col justify-between">
            {/* Mode Switcher Bar */}
            <div className="grid grid-cols-3 border-b border-white/[0.08] font-mono text-[10px] uppercase tracking-[0.16em]">
              {[
                { id: "scanner" as StageMode, label: "01 / AI SCAN" },
                { id: "surplus" as StageMode, label: "02 / SURPLUS" },
                { id: "target" as StageMode, label: "03 / TARGET" },
              ].map((tab) => {
                const active = stageMode === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setStageMode(tab.id)}
                    className={`py-4 px-3 text-center border-r last:border-r-0 border-white/[0.08] transition-colors cursor-pointer ${
                      active
                        ? "bg-emerald-400/15 text-emerald-300 font-bold"
                        : "text-white/45 hover:text-white/80"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Interactive Canvas Body */}
            <div className="p-6 sm:p-10 flex-1 flex flex-col justify-between">
              {stageMode === "scanner" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-400">
                      VISION TELEMETRY // VIP AI
                    </span>
                    <span className="font-mono text-[10px] px-2 py-0.5 border border-emerald-400/30 text-emerald-300">
                      AMAN • LEMBAP (-28 CM)
                    </span>
                  </div>

                  <div className="p-5 border border-white/10 bg-[#0a120e] space-y-4">
                    <div className="flex items-center justify-between border-b border-white/[0.07] pb-3">
                      <span className="text-xs text-white/50">Vegetasi Terdeteksi</span>
                      <span className="text-xs font-bold text-white">
                        Semak Pakis Gambut (2,0 Ha)
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="font-mono text-[10px] uppercase text-white/45">
                          POTENSI KOMPOS
                        </div>
                        <div className="text-2xl font-bold text-white mt-0.5">
                          480 Kg
                        </div>
                      </div>
                      <div>
                        <div className="font-mono text-[10px] uppercase text-white/45">
                          SUBSTITUSI NPK
                        </div>
                        <div className="text-2xl font-bold text-emerald-400 mt-0.5">
                          Rp 1.650.000
                        </div>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-white/[0.07] text-xs text-white/65 leading-relaxed">
                      <strong className="text-emerald-300">Resep Tailoring:</strong>{" "}
                      Tebas & cacah 15 cm, susun di jalur rumpuk, siram 4 liter EM4 + 2 karung dolomit.
                    </div>
                  </div>

                  <Link
                    href="/scanner"
                    className="w-full py-3.5 px-4 border border-emerald-400/40 bg-emerald-400/10 hover:bg-emerald-400/20 text-emerald-300 font-mono text-xs uppercase tracking-[0.16em] flex items-center justify-between transition-colors"
                  >
                    <span>Coba Smart Land Scanner</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              )}

              {stageMode === "surplus" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-400">
                      NERACA EKONOMI TANPA BAKAR
                    </span>
                    <span className="font-mono text-[10px] text-white/45">
                      OKTOBER 2026
                    </span>
                  </div>

                  <div className="p-5 border border-white/10 bg-[#0a120e] space-y-4">
                    <div>
                      <div className="font-mono text-[10px] uppercase text-white/45">
                        SURPLUS BERSIH LAHAN
                      </div>
                      <div className="text-3xl font-bold text-emerald-400 mt-1 tabular-nums">
                        +Rp 2.700.000
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/[0.07]">
                      <div className="p-3 bg-white/[0.02] border border-white/[0.06]">
                        <div className="font-mono text-[10px] text-white/45">
                          NILAI MANFAAT & NPK
                        </div>
                        <div className="text-sm font-bold text-emerald-300 mt-1">
                          Rp 3.120.000
                        </div>
                      </div>
                      <div className="p-3 bg-white/[0.02] border border-white/[0.06]">
                        <div className="font-mono text-[10px] text-white/45">
                          BIAYA EM4 & TEBAS
                        </div>
                        <div className="text-sm font-bold text-amber-300 mt-1">
                          Rp 420.000
                        </div>
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/beranda"
                    className="w-full py-3.5 px-4 border border-emerald-400/40 bg-emerald-400/10 hover:bg-emerald-400/20 text-emerald-300 font-mono text-xs uppercase tracking-[0.16em] flex items-center justify-between transition-colors"
                  >
                    <span>Buka Dashboard Kas Lahan</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              )}

              {stageMode === "target" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-400">
                      TUNNELING ALAT MEKANIS
                    </span>
                    <span className="font-mono text-[10px] text-emerald-300">
                      520 KOIN HIJAU
                    </span>
                  </div>

                  <div className="p-5 border border-white/10 bg-[#0a120e] space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-bold text-white">
                          Mesin Pencacah Semak (Wood Chipper)
                        </div>
                        <div className="text-xs text-white/50 mt-0.5">
                          Tabungan Kolektif Kelompok Tani
                        </div>
                      </div>
                      <span className="font-mono text-lg font-bold text-emerald-400">
                        78%
                      </span>
                    </div>

                    <div className="w-full h-2 bg-white/10 overflow-hidden">
                      <div className="h-full bg-emerald-400 w-[78%]" />
                    </div>

                    <div className="flex items-center justify-between font-mono text-xs text-white/60">
                      <span>Terkumpul: Rp 2.730.000</span>
                      <span>Target: Rp 3.500.000</span>
                    </div>
                  </div>

                  <Link
                    href="/target"
                    className="w-full py-3.5 px-4 border border-emerald-400/40 bg-emerald-400/10 hover:bg-emerald-400/20 text-emerald-300 font-mono text-xs uppercase tracking-[0.16em] flex items-center justify-between transition-colors"
                  >
                    <span>Lihat Target Alat Impian</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              )}

              <div className="pt-6 border-t border-white/[0.08] flex items-center justify-between font-mono text-[11px] text-white/40">
                <span>INTERACTIVE PREVIEW</span>
                <span>KLIK TAB DI ATAS UNTUK GANTI MODE</span>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            01 / KALKULASI PARADIGMA — MEMBAKAR VS JAGALAHAN
           ===================================================================== */}
        <section id="kalkulasi" className="border-b border-white/[0.08]">
          <div className="p-6 sm:p-12 border-b border-white/[0.08] flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-emerald-400 mb-2">
                [01 / SIMULASI EKONOMI LAHAN]
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-white">
                Membakar Lahan Adalah Kerugian Finansial.
              </h2>
            </div>

            {/* Hectare Selector */}
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/50 mr-2">
                LUAS LAHAN:
              </span>
              {[1, 2, 3, 5, 10].map((ha) => (
                <button
                  key={ha}
                  type="button"
                  onClick={() => setHectares(ha)}
                  className={`px-3.5 py-2 font-mono text-xs transition-colors cursor-pointer ${
                    hectares === ha
                      ? "bg-emerald-400 text-black font-bold"
                      : "border border-white/15 bg-white/[0.02] text-white/70 hover:border-white/35"
                  }`}
                >
                  {ha} Ha
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left: Cara Lama (Membakar) */}
            <div className="p-6 sm:p-12 border-b lg:border-b-0 lg:border-r border-white/[0.08] bg-rose-950/[0.08]">
              <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-rose-400">
                CARA LAMA // MEMBAKAR SEMAK ({hectares} HA)
              </div>
              <div className="mt-4 text-3xl sm:text-4xl font-bold text-rose-300 tracking-tight">
                Hilang Unsur Hara & Risiko Pidana
              </div>
              <div className="mt-8 space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between py-3 border-b border-white/[0.08]">
                  <span className="text-white/55">PUPUK KOMPOS TERBAKAR</span>
                  <span className="text-rose-400 font-bold">-{biomassKg} Kg Humus</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-white/[0.08]">
                  <span className="text-white/55">BELANJA PUPUK KIMIA TAMBAHAN</span>
                  <span className="text-rose-400 font-bold">-{formatIDR(npkSavedRp)}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-white/[0.08]">
                  <span className="text-white/55">SANKSI UU PPLH & KARHUTLA</span>
                  <span className="text-rose-400 font-bold">Ancaman Pidana & Denda</span>
                </div>
              </div>
            </div>

            {/* Right: Cara Baru (JagaLahan Tanpa Bakar) */}
            <div className="p-6 sm:p-12 bg-emerald-950/[0.12]">
              <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-emerald-400">
                METODE JAGALAHAN // TEBAS, CACAH & EM4 ({hectares} HA)
              </div>
              <div className="mt-4 text-3xl sm:text-4xl font-bold text-emerald-300 tracking-tight tabular-nums">
                +{formatIDR(netSurplusRp)} Surplus Bersih
              </div>
              <div className="mt-8 space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between py-3 border-b border-white/[0.08]">
                  <span className="text-white/55">BIOMASSA MULSA & KOMPOS</span>
                  <span className="text-emerald-400 font-bold">+{biomassKg} Kg Organik</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-white/[0.08]">
                  <span className="text-white/55">PENGHEMATAN PUPUK NPK</span>
                  <span className="text-emerald-400 font-bold">+{formatIDR(npkSavedRp)}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-white/[0.08]">
                  <span className="text-white/55">BIAYA BIO-DEKOMPOSER EM4</span>
                  <span className="text-amber-300 font-bold">-{formatIDR(clearCostRp)}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            02 / ARSITEKTUR 6 LAYAR PERSUASIF (SWISS GRID INDEX)
           ===================================================================== */}
        <section id="sistem" className="border-b border-white/[0.08]">
          <div className="p-6 sm:p-12 border-b border-white/[0.08] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-emerald-400 mb-2">
                [02 / ARSITEKTUR 6 MODUL PERSUASIF]
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-white">
                Enam Instrumen. Satu Ekosistem.
              </h2>
            </div>
            <Link
              href="/beranda"
              className="font-mono text-xs uppercase tracking-[0.18em] text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1.5"
            >
              <span>Buka Semua Modul</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {SYSTEM_INDEX.map((item, i) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.idx}
                  href={item.href}
                  className={`group p-8 border-b border-white/[0.08] ${
                    i % 3 !== 2 ? "lg:border-r" : ""
                  } ${
                    i % 2 !== 1 ? "md:border-r lg:border-r-0" : ""
                  } hover:bg-white/[0.03] transition-colors flex flex-col justify-between min-h-[250px]`}
                >
                  <div>
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="text-emerald-400 font-bold">/{item.idx}</span>
                      <span className="text-[10px] tracking-[0.16em] text-white/40">
                        {item.code}
                      </span>
                    </div>

                    <div className="mt-6 flex items-center gap-3">
                      <Icon className="w-5 h-5 text-emerald-400 shrink-0" />
                      <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {item.title}
                      </h3>
                    </div>

                    <p className="mt-2.5 text-sm text-white/55 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between font-mono text-xs">
                    <span className="text-white/80 font-semibold">{item.metric}</span>
                    <span className="text-emerald-400 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      BUKA <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* =====================================================================
            03 / KONSEP ALUR & 3 PERAN PENGGUNA (ROLE ARCHITECTURE)
           ===================================================================== */}
        <section id="peran" className="border-b border-white/[0.08]">
          <div className="p-6 sm:p-12 border-b border-white/[0.08] flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-amber-400 mb-2">
                [03 / ALUR KERJA & 3 PERAN EKOSISTEM]
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-white">
                Konsep Alur & Pembagian Role.
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-2.5 border border-white/15 hover:border-emerald-400 text-xs font-mono uppercase tracking-[0.16em] text-white transition-colors"
              >
                Simulasi Role di Login →
              </Link>
              <Link
                href="/register"
                className="px-4 py-2.5 bg-emerald-400 text-black font-bold text-xs font-mono uppercase tracking-[0.16em]"
              >
                Daftar Role Baru →
              </Link>
            </div>
          </div>

          {/* 3 Roles Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 border-b border-white/[0.08]">
            {ROLES_FLOW.map((r, idx) => {
              const Icon = r.icon;
              return (
                <div
                  key={r.code}
                  className={`p-8 ${
                    idx < 2 ? "border-b lg:border-b-0 lg:border-r border-white/[0.08]" : ""
                  } flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-center justify-between font-mono text-[11px]">
                      <span className="text-emerald-400 uppercase tracking-[0.2em]">
                        {r.code}
                      </span>
                      <span className="px-2 py-0.5 border border-white/15 text-white/60 text-[10px]">
                        {r.badge}
                      </span>
                    </div>

                    <div className="mt-5 flex items-center gap-3">
                      <Icon className="w-5 h-5 text-emerald-400" />
                      <h3 className="text-xl font-bold text-white">{r.title}</h3>
                    </div>

                    <div className="mt-2 font-mono text-xs text-amber-300">
                      Fokus: {r.focus}
                    </div>

                    <p className="mt-3 text-sm text-white/60 leading-relaxed">
                      {r.flow}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/[0.06]">
                    <Link
                      href="/login"
                      className="font-mono text-xs uppercase tracking-[0.16em] text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1.5"
                    >
                      <span>Masuk Sebagai {r.title.split(" ")[0]}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 4-Step End-to-End Flow Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-[#070b09]">
            {[
              {
                step: "STEP 01",
                title: "Registrasi & Pilih Peran",
                desc: "Daftar Trial 14 Hari gratis sebagai Petani, Kelompok Tani, atau Penyuluh MPA.",
              },
              {
                step: "STEP 02",
                title: "Scan Lahan Tanpa Bakar",
                desc: "Foto semak gambut di Smart Scanner untuk hitung biomassa kompos & dosis EM4.",
              },
              {
                step: "STEP 03",
                title: "Catat Kas & Klaim Koin",
                desc: "Rekam penghematan NPK di Tracking dan check-in harian bebas asap (+Koin).",
              },
              {
                step: "STEP 04",
                title: "Tebus Alat & Audit PDF",
                desc: "Kumpulkan tabungan mesin pencacah dan unduh laporan PDF resmi bebas bakar.",
              },
            ].map((st, idx) => (
              <div
                key={st.step}
                className={`p-6 sm:p-8 ${
                  idx < 3 ? "border-b sm:border-b-0 sm:border-r border-white/[0.08]" : ""
                }`}
              >
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-400">
                  {st.step}
                </div>
                <div className="mt-2 text-base font-bold text-white">{st.title}</div>
                <p className="mt-1.5 text-xs text-white/55 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* =====================================================================
            04 / MATRIKS TARIF & LANGGANAN (TRIAL / PRO / VIP)
           ===================================================================== */}
        <section id="tarif">
          <div className="p-6 sm:p-12 border-b border-white/[0.08] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-emerald-400 mb-2">
                [04 / SKEMA AKSES & LANGGANAN]
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-white">
                Transparan. Mulai dari Rp 0.
              </h2>
            </div>
            <Link
              href="/paket"
              className="font-mono text-xs uppercase tracking-[0.18em] text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1.5"
            >
              <span>Bandingkan Detail Paket</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3">
            {[
              {
                code: "TIER 01 // ONBOARDING",
                name: "Trial 14 Hari",
                price: "Rp 0",
                period: "14 hari pertama",
                features: [
                  "Dashboard Kas & Surplus Lahan",
                  "Jurnal Tracking Tanpa Bakar",
                  "Pengingat Siaga Gambut & EM4",
                  "Check-in Harian Bebas Asap",
                ],
                cta: "Mulai Trial Gratis",
                href: "/register",
                highlight: false,
              },
              {
                code: "TIER 02 // PETANI AKTIF",
                name: "Paket Pro",
                price: "Rp 9.900",
                period: "per bulan",
                features: [
                  "Semua fitur Trial 14 Hari",
                  "Klaim Koin Hijau & Voucher Pupuk KUD",
                  "Target Tabungan Alat Mekanis",
                  "Ekspor Laporan Audit PDF Resmi",
                ],
                cta: "Pilih Paket Pro",
                href: "/register",
                highlight: false,
              },
              {
                code: "TIER 03 // FULL AI VISION",
                name: "Paket VIP",
                price: "Rp 19.900",
                period: "per bulan",
                features: [
                  "Semua fitur Paket Pro",
                  "Smart Land & Smoke Scanner AI",
                  "Kalkulasi Otomatis Kompos & Dosis EM4",
                  "Prioritas Subsidi & Verifikasi Kelompok",
                ],
                cta: "Aktifkan VIP Sekarang",
                href: "/register",
                highlight: true,
              },
            ].map((tier, idx) => (
              <div
                key={tier.name}
                className={`p-8 sm:p-10 flex flex-col justify-between ${
                  idx < 2 ? "border-b lg:border-b-0 lg:border-r border-white/[0.08]" : ""
                } ${tier.highlight ? "bg-emerald-950/[0.16]" : ""}`}
              >
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-400">
                    {tier.code}
                  </div>
                  <div className="mt-3 text-2xl font-bold text-white">{tier.name}</div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-white tracking-tight">
                      {tier.price}
                    </span>
                    <span className="font-mono text-xs text-white/45">
                      / {tier.period}
                    </span>
                  </div>

                  <ul className="mt-8 space-y-3 text-xs text-white/70">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={tier.href}
                  className={`mt-10 w-full py-4 px-5 font-mono text-xs uppercase tracking-[0.18em] flex items-center justify-between transition-colors ${
                    tier.highlight
                      ? "bg-emerald-400 hover:bg-emerald-300 text-black font-bold"
                      : "border border-white/15 hover:border-white/40 text-white"
                  }`}
                >
                  <span>{tier.cta}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* =====================================================================
          ARCHITECTURAL FOOTER
         ===================================================================== */}
      <footer className="border-t border-white/[0.08] bg-[#050807]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img
              src="/logo-jagalahan.png"
              alt="JagaLahan"
              className="w-7 h-7 object-contain"
            />
            <span className="text-sm font-bold text-white">JagaLahan</span>
            <span className="font-mono text-[11px] text-white/40">
              // JAGALAHAN.WEB.ID — ZERO-BURN LAND MANAGEMENT
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-mono text-xs uppercase tracking-[0.16em] text-white/55">
            <Link href="/login" className="hover:text-white">
              Login
            </Link>
            <Link href="/register" className="hover:text-white">
              Register
            </Link>
            <Link href="/beranda" className="hover:text-white">
              Dashboard
            </Link>
            <Link href="/scanner" className="hover:text-white">
              AI Scanner
            </Link>
            <Link href="/profil" className="hover:text-white">
              Privasi UU PDP
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
