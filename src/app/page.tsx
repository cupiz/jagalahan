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
import { useHydrated, useV2State } from "@/lib/store";

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
  const state = useV2State();
  const hydrated = useHydrated();
  const isLoggedIn = hydrated && state.isAuthenticated;

  const npkSavedRp = Math.round(hectares * 1650000);
  const biomassKg = Math.round(hectares * 240);
  const clearCostRp = Math.round(hectares * 210000);
  const netSurplusRp = npkSavedRp - clearCostRp;

  const formatIDR = (val: number) =>
    "Rp " + val.toLocaleString("id-ID", { maximumFractionDigits: 0 });

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-emerald-200 selection:text-emerald-950 font-sans antialiased">
      {/* Subtle Ambient Light */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-56 left-1/3 h-[520px] w-[520px] rounded-full bg-emerald-100/50 blur-[160px]" />
        <div className="absolute bottom-0 right-1/4 h-[420px] w-[420px] rounded-full bg-teal-50/70 blur-[150px]" />
      </div>

      {/* =====================================================================
          TOP ARCHITECTURAL BAR (SWISS GRID HEADER)
         ===================================================================== */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3">
              <img
                src="/logo-jagalahan.png"
                alt="JagaLahan"
                className="w-9 h-9 object-contain"
              />
              <span className="text-lg font-black tracking-tight text-slate-900">
                JagaLahan<span className="text-emerald-600">.</span>
              </span>
            </Link>

            <div className="hidden xl:flex items-center gap-2 pl-6 border-l border-slate-200 font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>02°12&apos;S 113°55&apos;E // ZERO-BURN SYSTEM</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-[0.16em] text-slate-600">
            <a href="#kalkulasi" className="hover:text-emerald-700 transition-colors">
              01. Kalkulasi
            </a>
            <a href="#sistem" className="hover:text-emerald-700 transition-colors">
              02. Sistem
            </a>
            <a href="#peran" className="hover:text-emerald-700 transition-colors">
              03. Alur & Role
            </a>
            <a href="#tarif" className="hover:text-emerald-700 transition-colors">
              04. Tarif
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            {isLoggedIn ? (
              <>
                <span className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-full bg-emerald-50 text-xs font-bold text-emerald-700">
                  Halo, {state.userName}
                </span>
                <Link
                  href="/beranda"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs font-mono uppercase tracking-[0.14em] transition-colors rounded-xl shadow-sm shadow-emerald-600/20"
                >
                  <span>Buka Dasbor</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-slate-300 hover:border-emerald-600 bg-white text-xs font-mono font-bold uppercase tracking-[0.14em] text-slate-900 transition-colors rounded-xl"
                >
                  <LogIn className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Masuk</span>
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs font-mono uppercase tracking-[0.14em] transition-colors rounded-xl shadow-sm shadow-emerald-600/20"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Daftar Gratis</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto border-x border-slate-200 bg-white">
        {/* =====================================================================
            00 / HERO SECTION — MONUMENTAL TYPOGRAPHY + INTERACTIVE STAGE
           ===================================================================== */}
        <section className="grid grid-cols-1 lg:grid-cols-12 border-b border-slate-200">
          {/* Left Hero Column (7 Cols) */}
          <div className="lg:col-span-7 p-6 sm:p-12 lg:p-14 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col justify-between bg-white">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-emerald-700 mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span>PERSUASIVE AGRO-FINTECH</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-[4.4rem] font-black tracking-[-0.04em] leading-[0.96] text-slate-900">
                Tanpa Api.
                <br />
                Tanpa Asap.
                <br />
                <span className="text-emerald-600">Surplus Jutaan.</span>
              </h1>

              <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed font-normal">
                Platform pembukaan lahan tanpa bakar yang mengubah semak gambut menjadi tabungan pupuk NPK, koin reward harian, dan alat mekanis kelompok tani.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link
                  href="/register"
                  className="px-6 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs font-mono uppercase tracking-[0.18em] shadow-md shadow-emerald-600/20 transition-all inline-flex items-center gap-2"
                >
                  <span>Mulai Trial 14 Hari</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
                <Link
                  href={isLoggedIn ? "/beranda" : "/login"}
                  className="px-6 py-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-900 font-mono font-bold text-xs uppercase tracking-[0.18em] transition-all inline-flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4 text-emerald-600" />
                  <span>{isLoggedIn ? "Buka Dasbor Anda" : "Masuk ke Dasbor"}</span>
                </Link>
              </div>
            </div>

            {/* Bottom Key Numbers Strip */}
            <div className="mt-12 pt-8 border-t border-slate-200 grid grid-cols-3 gap-6">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
                  HEMAT PUPUK / HA
                </div>
                <div className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
                  Rp 1,65 Jt
                </div>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
                  BIOMASSA KOMPOS
                </div>
                <div className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-emerald-600 tabular-nums">
                  240 Kg/Ha
                </div>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
                  RISIKO PIDANA API
                </div>
                <div className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
                  0%
                </div>
              </div>
            </div>
          </div>

          {/* Right Hero Column: Interactive 3-Mode Live Product Stage (5 Cols) */}
          <div className="lg:col-span-5 bg-slate-50 flex flex-col justify-between">
            {/* Mode Switcher Bar */}
            <div className="grid grid-cols-3 border-b border-slate-200 bg-white font-mono text-[10px] uppercase tracking-[0.16em]">
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
                    className={`py-4 px-3 text-center border-r last:border-r-0 border-slate-200 transition-colors cursor-pointer ${
                      active
                        ? "bg-emerald-50 text-emerald-700 font-bold"
                        : "text-slate-500 hover:text-slate-900"
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
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-700 font-semibold">
                      VISION TELEMETRY // VIP AI
                    </span>
                    <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                      AMAN • LEMBAP (-28 CM)
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <span className="text-xs text-slate-500">Vegetasi Terdeteksi</span>
                      <span className="text-xs font-bold text-slate-900">
                        Semak Pakis Gambut (2,0 Ha)
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="font-mono text-[10px] uppercase text-slate-500">
                          POTENSI KOMPOS
                        </div>
                        <div className="text-2xl font-bold text-slate-900 mt-0.5">
                          480 Kg
                        </div>
                      </div>
                      <div>
                        <div className="font-mono text-[10px] uppercase text-slate-500">
                          SUBSTITUSI NPK
                        </div>
                        <div className="text-2xl font-bold text-emerald-600 mt-0.5">
                          Rp 1.650.000
                        </div>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 leading-relaxed">
                      <strong className="text-emerald-700">Resep Tailoring:</strong>{" "}
                      Tebas & cacah 15 cm, susun di jalur rumpuk, siram 4 liter EM4 + 2 karung dolomit.
                    </div>
                  </div>

                  <Link
                    href="/scanner"
                    className="w-full py-3.5 px-4 rounded-xl border border-emerald-600/30 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-mono font-bold text-xs uppercase tracking-[0.16em] flex items-center justify-between transition-colors"
                  >
                    <span>Coba Smart Land Scanner</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              )}

              {stageMode === "surplus" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-700 font-semibold">
                      NERACA EKONOMI TANPA BAKAR
                    </span>
                    <span className="font-mono text-[10px] text-slate-500">
                      OKTOBER 2026
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4">
                    <div>
                      <div className="font-mono text-[10px] uppercase text-slate-500">
                        SURPLUS BERSIH LAHAN
                      </div>
                      <div className="text-3xl font-bold text-emerald-600 mt-1 tabular-nums">
                        +Rp 2.700.000
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                        <div className="font-mono text-[10px] text-slate-500">
                          NILAI MANFAAT & NPK
                        </div>
                        <div className="text-sm font-bold text-emerald-700 mt-1">
                          Rp 3.120.000
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                        <div className="font-mono text-[10px] text-slate-500">
                          BIAYA EM4 & TEBAS
                        </div>
                        <div className="text-sm font-bold text-amber-700 mt-1">
                          Rp 420.000
                        </div>
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/beranda"
                    className="w-full py-3.5 px-4 rounded-xl border border-emerald-600/30 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-mono font-bold text-xs uppercase tracking-[0.16em] flex items-center justify-between transition-colors"
                  >
                    <span>Buka Dashboard Kas Lahan</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              )}

              {stageMode === "target" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-700 font-semibold">
                      TUNNELING ALAT MEKANIS
                    </span>
                    <span className="font-mono text-[10px] text-emerald-700 font-semibold">
                      520 KOIN HIJAU
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-bold text-slate-900">
                          Mesin Pencacah Semak (Wood Chipper)
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Tabungan Kolektif Kelompok Tani
                        </div>
                      </div>
                      <span className="font-mono text-lg font-bold text-emerald-600">
                        78%
                      </span>
                    </div>

                    <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full bg-emerald-600 w-[78%]" />
                    </div>

                    <div className="flex items-center justify-between font-mono text-xs text-slate-600">
                      <span>Terkumpul: Rp 2.730.000</span>
                      <span>Target: Rp 3.500.000</span>
                    </div>
                  </div>

                  <Link
                    href="/target"
                    className="w-full py-3.5 px-4 rounded-xl border border-emerald-600/30 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-mono font-bold text-xs uppercase tracking-[0.16em] flex items-center justify-between transition-colors"
                  >
                    <span>Lihat Target Alat Impian</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              )}

              <div className="pt-6 border-t border-slate-200 flex items-center justify-between font-mono text-[11px] text-slate-400">
                <span>INTERACTIVE PREVIEW</span>
                <span>KLIK TAB DI ATAS UNTUK GANTI MODE</span>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            01 / KALKULASI PARADIGMA — MEMBAKAR VS JAGALAHAN
           ===================================================================== */}
        <section id="kalkulasi" className="border-b border-slate-200 bg-white">
          <div className="p-6 sm:p-12 border-b border-slate-200 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-emerald-700 mb-2">
                [01 / SIMULASI EKONOMI LAHAN]
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-slate-900">
                Membakar Lahan Adalah Kerugian Finansial.
              </h2>
            </div>

            {/* Hectare Selector */}
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-slate-500 mr-2">
                LUAS LAHAN:
              </span>
              {[1, 2, 3, 5, 10].map((ha) => (
                <button
                  key={ha}
                  type="button"
                  onClick={() => setHectares(ha)}
                  className={`px-3.5 py-2 rounded-lg font-mono text-xs transition-colors cursor-pointer ${
                    hectares === ha
                      ? "bg-emerald-600 text-white font-bold"
                      : "border border-slate-300 bg-white text-slate-700 hover:border-slate-500"
                  }`}
                >
                  {ha} Ha
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left: Cara Lama (Membakar) */}
            <div className="p-6 sm:p-12 border-b lg:border-b-0 lg:border-r border-slate-200 bg-rose-50/50">
              <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-rose-600 font-semibold">
                CARA LAMA // MEMBAKAR SEMAK ({hectares} HA)
              </div>
              <div className="mt-4 text-3xl sm:text-4xl font-bold text-rose-700 tracking-tight">
                Hilang Unsur Hara & Risiko Pidana
              </div>
              <div className="mt-8 space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between py-3 border-b border-rose-200/70">
                  <span className="text-slate-600">PUPUK KOMPOS TERBAKAR</span>
                  <span className="text-rose-600 font-bold">-{biomassKg} Kg Humus</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-rose-200/70">
                  <span className="text-slate-600">BELANJA PUPUK KIMIA TAMBAHAN</span>
                  <span className="text-rose-600 font-bold">-{formatIDR(npkSavedRp)}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-rose-200/70">
                  <span className="text-slate-600">SANKSI UU PPLH & KARHUTLA</span>
                  <span className="text-rose-600 font-bold">Ancaman Pidana & Denda</span>
                </div>
              </div>
            </div>

            {/* Right: Cara Baru (JagaLahan Tanpa Bakar) */}
            <div className="p-6 sm:p-12 bg-emerald-50/50">
              <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-emerald-700 font-semibold">
                METODE JAGALAHAN // TEBAS, CACAH & EM4 ({hectares} HA)
              </div>
              <div className="mt-4 text-3xl sm:text-4xl font-bold text-emerald-700 tracking-tight tabular-nums">
                +{formatIDR(netSurplusRp)} Surplus Bersih
              </div>
              <div className="mt-8 space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between py-3 border-b border-emerald-200/70">
                  <span className="text-slate-600">BIOMASSA MULSA & KOMPOS</span>
                  <span className="text-emerald-700 font-bold">+{biomassKg} Kg Organik</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-emerald-200/70">
                  <span className="text-slate-600">PENGHEMATAN PUPUK NPK</span>
                  <span className="text-emerald-700 font-bold">+{formatIDR(npkSavedRp)}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-emerald-200/70">
                  <span className="text-slate-600">BIAYA BIO-DEKOMPOSER EM4</span>
                  <span className="text-amber-700 font-bold">-{formatIDR(clearCostRp)}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            02 / ARSITEKTUR 6 LAYAR PERSUASIF (SWISS GRID INDEX)
           ===================================================================== */}
        <section id="sistem" className="border-b border-slate-200 bg-white">
          <div className="p-6 sm:p-12 border-b border-slate-200 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-emerald-700 mb-2">
                [02 / ARSITEKTUR 6 MODUL PERSUASIF]
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-slate-900">
                Enam Instrumen. Satu Ekosistem.
              </h2>
            </div>
            <Link
              href={isLoggedIn ? "/beranda" : "/login"}
              className="font-mono text-xs uppercase tracking-[0.18em] text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1.5"
            >
              <span>{isLoggedIn ? "Buka Semua Modul" : "Login untuk Buka Modul"}</span>
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
                  className={`group p-8 border-b border-slate-200 bg-white ${
                    i % 3 !== 2 ? "lg:border-r" : ""
                  } ${
                    i % 2 !== 1 ? "md:border-r lg:border-r-0" : ""
                  } hover:bg-emerald-50/50 transition-colors flex flex-col justify-between min-h-[250px]`}
                >
                  <div>
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="text-emerald-700 font-bold">/{item.idx}</span>
                      <span className="text-[10px] tracking-[0.16em] text-slate-400">
                        {item.code}
                      </span>
                    </div>

                    <div className="mt-6 flex items-center gap-3">
                      <Icon className="w-5 h-5 text-emerald-600 shrink-0" />
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {item.title}
                      </h3>
                    </div>

                    <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between font-mono text-xs">
                    <span className="text-slate-700 font-semibold">{item.metric}</span>
                    <span className="text-emerald-700 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
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
        <section id="peran" className="border-b border-slate-200 bg-white">
          <div className="p-6 sm:p-12 border-b border-slate-200 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-amber-600 mb-2">
                [03 / ALUR KERJA & 3 PERAN EKOSISTEM]
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-slate-900">
                Konsep Alur & Pembagian Role.
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-2.5 rounded-xl border border-slate-300 hover:border-emerald-600 text-xs font-mono uppercase tracking-[0.16em] text-slate-900 transition-colors"
              >
                Simulasi Role di Login →
              </Link>
              <Link
                href="/register"
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs font-mono uppercase tracking-[0.16em]"
              >
                Daftar Role Baru →
              </Link>
            </div>
          </div>

          {/* 3 Roles Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 border-b border-slate-200">
            {ROLES_FLOW.map((r, idx) => {
              const Icon = r.icon;
              return (
                <div
                  key={r.code}
                  className={`p-8 bg-white ${
                    idx < 2 ? "border-b lg:border-b-0 lg:border-r border-slate-200" : ""
                  } flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-center justify-between font-mono text-[11px]">
                      <span className="text-emerald-700 uppercase tracking-[0.2em] font-semibold">
                        {r.code}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-semibold">
                        {r.badge}
                      </span>
                    </div>

                    <div className="mt-5 flex items-center gap-3">
                      <Icon className="w-5 h-5 text-emerald-600" />
                      <h3 className="text-xl font-bold text-slate-900">{r.title}</h3>
                    </div>

                    <div className="mt-2 font-mono text-xs text-amber-700 font-semibold">
                      Fokus: {r.focus}
                    </div>

                    <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                      {r.flow}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <Link
                      href="/login"
                      className="font-mono text-xs uppercase tracking-[0.16em] text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1.5"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-slate-50">
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
                  idx < 3 ? "border-b sm:border-b-0 sm:border-r border-slate-200" : ""
                }`}
              >
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-700 font-bold">
                  {st.step}
                </div>
                <div className="mt-2 text-base font-bold text-slate-900">{st.title}</div>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* =====================================================================
            04 / MATRIKS TARIF & LANGGANAN (TRIAL / PRO / VIP)
           ===================================================================== */}
        <section id="tarif" className="bg-white">
          <div className="p-6 sm:p-12 border-b border-slate-200 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-emerald-700 mb-2">
                [04 / SKEMA AKSES & LANGGANAN]
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-slate-900">
                Transparan. Mulai dari Rp 0.
              </h2>
            </div>
            <Link
              href="/paket"
              className="font-mono text-xs uppercase tracking-[0.18em] text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1.5"
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
                  idx < 2 ? "border-b lg:border-b-0 lg:border-r border-slate-200" : ""
                } ${tier.highlight ? "bg-emerald-50/50" : "bg-white"}`}
              >
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-700 font-semibold">
                    {tier.code}
                  </div>
                  <div className="mt-3 text-2xl font-bold text-slate-900">{tier.name}</div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-slate-900 tracking-tight">
                      {tier.price}
                    </span>
                    <span className="font-mono text-xs text-slate-500">
                      / {tier.period}
                    </span>
                  </div>

                  <ul className="mt-8 space-y-3 text-xs text-slate-700">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={tier.href}
                  className={`mt-10 w-full py-4 px-5 rounded-xl font-mono text-xs uppercase tracking-[0.18em] flex items-center justify-between transition-colors ${
                    tier.highlight
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm shadow-emerald-600/20"
                      : "border border-slate-300 hover:border-slate-500 bg-white text-slate-900 font-semibold"
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
      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img
              src="/logo-jagalahan.png"
              alt="JagaLahan"
              className="w-7 h-7 object-contain"
            />
            <span className="text-sm font-bold text-slate-900">JagaLahan</span>
            <span className="font-mono text-[11px] text-slate-400">
              // JAGALAHAN.WEB.ID — ZERO-BURN LAND MANAGEMENT
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-mono text-xs uppercase tracking-[0.16em] text-slate-600">
            <Link href="/login" className="hover:text-slate-900">
              Login
            </Link>
            <Link href="/register" className="hover:text-slate-900">
              Register
            </Link>
            <Link href="/beranda" className="hover:text-slate-900">
              Dashboard
            </Link>
            <Link href="/scanner" className="hover:text-slate-900">
              AI Scanner
            </Link>
            <Link href="/profil" className="hover:text-slate-900">
              Privasi UU PDP
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
