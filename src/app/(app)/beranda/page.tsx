"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Camera,
  Lock,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Plus,
  Coins,
  Bell,
  Target,
  FileSpreadsheet,
  Crown,
  CheckCircle2,
  Flame,
  Sprout,
  Droplets,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  useV2State,
  addTransaction,
  performDailyCheckIn,
  togglePrivacyMask,
  type TxCategory,
  type TxType,
} from "@/lib/store";
import { formatRupiah, todayIso } from "@/lib/utils";

const CATEGORIES: TxCategory[] = [
  "Kompos & Mulsa",
  "Hemat Pupuk",
  "Tebas & Cacah",
  "Bantuan & Insentif",
  "Sekat Kanal & Air",
  "Lainnya",
];

export default function BerandaPage() {
  const state = useV2State();
  const [showAddModal, setShowAddModal] = useState(false);
  const [txTitle, setTxTitle] = useState("");
  const [txCategory, setTxCategory] = useState<TxCategory>("Kompos & Mulsa");
  const [txType, setTxType] = useState<TxType>("manfaat");
  const [txAmount, setTxAmount] = useState("250000");
  const [txNote, setTxNote] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const totalManfaat = state.transactions
    .filter((t) => t.type === "manfaat")
    .reduce((acc, t) => acc + t.amount, 0);
  const totalBiaya = state.transactions
    .filter((t) => t.type === "biaya")
    .reduce((acc, t) => acc + t.amount, 0);
  const netBenefit = totalManfaat - totalBiaya;
  const totalVolume = Math.max(1, totalManfaat + totalBiaya);
  const manfaatPct = Math.round((totalManfaat / totalVolume) * 100);
  const biayaPct = 100 - manfaatPct;

  const mask = (val: string) => (state.privacyMask ? "Rp •••••••" : val);

  const handleQuickCheckIn = () => {
    const res = performDailyCheckIn();
    setToast(res.message);
    setTimeout(() => setToast(null), 4000);
  };

  const handleAddTx = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = Number(txAmount.replace(/[^0-9]/g, "")) || 0;
    if (!txTitle.trim() || amountNum <= 0) return;
    addTransaction({
      title: txTitle.trim(),
      category: txCategory,
      type: txType,
      amount: amountNum,
      date: todayIso(),
      note: txNote.trim() || undefined,
    });
    setTxTitle("");
    setTxNote("");
    setShowAddModal(false);
    setToast("Catatan lahan berhasil disimpan! (+5 Koin Hijau)");
    setTimeout(() => setToast(null), 3500);
  };

  const checkedInToday = state.lastCheckInDate === todayIso();

  return (
    <div className="space-y-6 pb-10">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-20 right-4 z-50 flex items-center gap-2.5 rounded-2xl bg-emerald-900 px-4 py-3 text-sm font-semibold text-white shadow-xl md:bottom-6">
          <Sparkles className="h-4 w-4 text-amber-300" />
          <span>{toast}</span>
        </div>
      )}

      {/* Top Greeting & Quick Check-in Banner */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-800 md:flex-row md:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300">
              <Sprout className="h-3.5 w-3.5" />
              Zero-Burning Smart Tracker
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800 dark:bg-amber-950/70 dark:text-amber-300">
              <Flame className="h-3.5 w-3.5 text-orange-500" />
              Streak {state.streakDays} Hari Bebas Api
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-3xl">
            Selamat Pagi, {state.userName}! 👋
          </h1>
          <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">
            {state.villageName} • Luas Lahan Kelola:{" "}
            <strong className="text-slate-800 dark:text-slate-200">{state.landAreaHa} Ha</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleQuickCheckIn}
            className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition shadow-sm ${
              checkedInToday
                ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300"
                : "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:brightness-105"
            }`}
          >
            <Coins className="h-4 w-4" />
            {checkedInToday ? "Sudah Check-in Hari Ini (+10 Koin)" : "Check-in Bebas Api (+10 Koin)"}
          </button>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" />
            Catat Aktivitas Lahan
          </button>
        </div>
      </div>

      {/* Row 1: Smart Land Scanner VIP Banner + Total Nilai Manfaat Card */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Total Nilai Manfaat Tanpa Bakar Card (7 cols) */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 p-6 text-white shadow-lg lg:col-span-7">
          <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-100">
                Total Nilai Manfaat Tanpa Bakar (Bersih)
              </p>
              <div className="mt-1 flex items-center gap-3">
                <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
                  {mask(formatRupiah(netBenefit))}
                </h2>
                <button
                  type="button"
                  onClick={() => togglePrivacyMask()}
                  className="rounded-xl bg-white/15 p-2 text-white/90 transition hover:bg-white/25"
                  title="Sembunyikan / Tampilkan Nominal"
                >
                  {state.privacyMask ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <span className="hidden rounded-2xl bg-white/15 px-3.5 py-2 text-xs font-bold backdrop-blur-sm sm:inline-flex sm:items-center sm:gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-200" />
              Zero-Burning Aktif
            </span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/15 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-100">
                <TrendingUp className="h-4 w-4 text-emerald-200" />
                <span>Nilai Penghematan & Kompos</span>
              </div>
              <p className="mt-1 text-lg font-extrabold md:text-xl">
                +{mask(formatRupiah(totalManfaat))}
              </p>
            </div>
            <div className="rounded-2xl bg-white/15 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-1.5 text-xs font-medium text-rose-100">
                <TrendingDown className="h-4 w-4 text-rose-200" />
                <span>Biaya Kelola Tanpa Bakar</span>
              </div>
              <p className="mt-1 text-lg font-extrabold md:text-xl">
                -{mask(formatRupiah(totalBiaya))}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-white/15 pt-3 text-xs text-emerald-50">
            <span>Dibandingkan membakar lahan: risiko denda Rp0 & hara tanah tetap utuh</span>
            <Link
              href="/tracking"
              className="inline-flex items-center gap-1 font-bold text-white underline-offset-4 hover:underline"
            >
              Lihat Detail & Unduh PDF <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Smart Land & Smoke Scanner VIP Banner Card (5 cols) */}
        <div className="flex flex-col justify-between rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-800 lg:col-span-5">
          <div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300">
                <Crown className="h-3.5 w-3.5 text-amber-500" />
                Fitur Eksklusif VIP
              </span>
              {state.plan === "vip" ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300">
                  Aktif (VIP)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-800 dark:bg-amber-950/70 dark:text-amber-300">
                  <Lock className="h-3 w-3" /> Terkunci ({state.plan.toUpperCase()})
                </span>
              )}
            </div>

            <div className="mt-4 flex items-start gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md">
                <Camera className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Smart Land & Smoke Scanner
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  Foto kondisi semak, mulsa, atau tinggi air gambut. AI otomatis menghitung estimasi
                  kompos (Kg), penghematan pupuk (Rp), dan mencatatnya ke Tracking tanpa ketik manual!
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Total Scan Tersimpan: <strong className="text-slate-800 dark:text-slate-200">{state.scans.length}x</strong>
            </div>
            {state.plan === "vip" ? (
              <Link
                href="/scanner"
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:brightness-105"
              >
                <Camera className="h-4 w-4" />
                Pindai Lahan Sekarang
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/scanner"
                  className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                >
                  Pratinjau
                </Link>
                <Link
                  href="/paket"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-amber-600"
                >
                  <Lock className="h-3.5 w-3.5" />
                  Buka VIP
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Row 2: Ringkasan Donut Chart + Target Lahan Impian Preview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Donut Chart Ringkasan Manfaat & Biaya (5 cols) */}
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-800 lg:col-span-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Ringkasan Manfaat & Biaya Lahan
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Proporsi nilai ekonomi kelola lahan tanpa bakar
              </p>
            </div>
            <Link
              href="/tracking"
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
            >
              Detail →
            </Link>
          </div>

          <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row">
            {/* SVG Donut Chart */}
            <div className="relative flex h-36 w-36 shrink-0 items-center justify-center">
              <svg className="h-36 w-36 -rotate-90 transform" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="transparent"
                  stroke="#f43f5e"
                  strokeWidth="4.2"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="transparent"
                  stroke="#10b981"
                  strokeWidth="4.2"
                  strokeDasharray={`${manfaatPct} ${100 - manfaatPct}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  Rasio Manfaat
                </span>
                <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  {manfaatPct}%
                </span>
              </div>
            </div>

            <div className="w-full space-y-3">
              <div className="rounded-2xl bg-emerald-50/80 p-3 dark:bg-emerald-950/40">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-800 dark:text-emerald-300">
                    ● Nilai Manfaat ({manfaatPct}%)
                  </span>
                  <span className="font-extrabold text-emerald-700 dark:text-emerald-300">
                    {mask(formatRupiah(totalManfaat))}
                  </span>
                </div>
                <p className="mt-0.5 text-[11px] text-emerald-700/80 dark:text-emerald-400/80">
                  Penghematan pupuk NPK & hasil kompos serasah
                </p>
              </div>

              <div className="rounded-2xl bg-rose-50/80 p-3 dark:bg-rose-950/40">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-rose-800 dark:text-rose-300">
                    ● Biaya Kelola ({biayaPct}%)
                  </span>
                  <span className="font-extrabold text-rose-700 dark:text-rose-300">
                    {mask(formatRupiah(totalBiaya))}
                  </span>
                </div>
                <p className="mt-0.5 text-[11px] text-rose-700/80 dark:text-rose-400/80">
                  Upah tebas-cacah, dolomit, EM4 & sekat kanal
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Target Lahan Impian Preview (7 cols) */}
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-800 lg:col-span-7">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Target Lahan Impian
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Wujudkan alat pertanian tanpa bakar dari akumulasi penghematan lahanmu
              </p>
            </div>
            <Link
              href="/target"
              className="inline-flex items-center gap-1 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300"
            >
              <Target className="h-3.5 w-3.5" />
              Kelola Target
            </Link>
          </div>

          <div className="mt-4 space-y-3.5">
            {state.targets.map((t) => {
              const pct = Math.min(100, Math.round((t.savedAmount / t.targetAmount) * 100));
              return (
                <div
                  key={t.id}
                  className="rounded-2xl border border-slate-200/80 p-4 transition hover:border-emerald-300 dark:border-slate-800"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Terkumpul{" "}
                        <strong className="text-emerald-700 dark:text-emerald-400">
                          {mask(formatRupiah(t.savedAmount))}
                        </strong>{" "}
                        dari {mask(formatRupiah(t.targetAmount))} • Target: {t.deadline}
                      </p>
                    </div>
                    <span className="rounded-xl bg-emerald-100 px-2.5 py-1 text-xs font-extrabold text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                      {pct}%
                    </span>
                  </div>
                  <div className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 3: Recent Transactions + Quick Shortcuts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Aktivitas Lahan Terbaru (8 cols) */}
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-800 lg:col-span-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Catatan Aktivitas & Nilai Lahan Terbaru
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Riwayat manfaat kompos, penghematan pupuk, dan biaya kelola
              </p>
            </div>
            <Link
              href="/tracking"
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
            >
              Semua Catatan <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
            {state.transactions.slice(0, 4).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between gap-4 py-3.5">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-xs font-bold ${
                      tx.type === "manfaat"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300"
                        : "bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300"
                    }`}
                  >
                    {tx.type === "manfaat" ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{tx.title}</p>
                      {tx.fromScanner && (
                        <span className="rounded-md bg-indigo-50 px-1.5 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300">
                          AI Scan
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {tx.category} • {tx.date}
                    </p>
                  </div>
                </div>
                <span
                  className={`shrink-0 text-sm font-extrabold ${
                    tx.type === "manfaat"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {tx.type === "manfaat" ? "+" : "-"}
                  {mask(formatRupiah(tx.amount))}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pengingat & Koin Shortcut (4 cols) */}
        <div className="space-y-6 lg:col-span-4">
          <div className="rounded-3xl bg-gradient-to-br from-amber-500 to-orange-500 p-5 text-white shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-100">
                JagaLahan Coins
              </span>
              <Coins className="h-5 w-5 text-amber-100" />
            </div>
            <p className="mt-1 text-2xl font-extrabold">{state.coins.toLocaleString("id-ID")} Koin</p>
            <p className="mt-1 text-xs text-amber-50">
              Setara Rp{((state.coins / 1000) * 10000).toLocaleString("id-ID")} voucher bibit/pupuk organik
            </p>
            <Link
              href="/koin"
              className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-2xl bg-white px-4 py-2.5 text-xs font-bold text-amber-700 shadow-sm transition hover:bg-amber-50"
            >
              Tukar Koin & Check-in <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-800">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Pengingat Aktif ({state.reminders.filter((r) => r.enabled).length})
              </h4>
              <Link
                href="/pengingat"
                className="text-xs font-bold text-emerald-600 hover:underline dark:text-emerald-400"
              >
                Atur
              </Link>
            </div>
            <div className="mt-3 space-y-2.5">
              {state.reminders.slice(0, 2).map((rem) => (
                <div
                  key={rem.id}
                  className="flex items-start gap-2.5 rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/60"
                >
                  <Bell className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-slate-800 dark:text-slate-200">
                      {rem.title}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{rem.timeOrDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Tambah Catatan Aktivitas Lahan */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                + Catat Aktivitas Lahan
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-xl px-2.5 py-1 text-xs font-bold text-slate-500 hover:bg-slate-100"
              >
                Tutup
              </button>
            </div>

            <form onSubmit={handleAddTx} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1 dark:bg-slate-800">
                <button
                  type="button"
                  onClick={() => setTxType("manfaat")}
                  className={`rounded-xl py-2 text-xs font-bold transition ${
                    txType === "manfaat"
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-300"
                  }`}
                >
                  + Nilai Manfaat / Hemat
                </button>
                <button
                  type="button"
                  onClick={() => setTxType("biaya")}
                  className={`rounded-xl py-2 text-xs font-bold transition ${
                    txType === "biaya"
                      ? "bg-rose-600 text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-300"
                  }`}
                >
                  - Biaya Kelola Lahan
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Judul Catatan Aktivitas
                </label>
                <input
                  type="text"
                  required
                  value={txTitle}
                  onChange={(e) => setTxTitle(e.target.value)}
                  placeholder="Contoh: Penghematan Pupuk dari Mulsa Blok B"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Kategori
                  </label>
                  <select
                    value={txCategory}
                    onChange={(e) => setTxCategory(e.target.value as TxCategory)}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Nominal (Rp)
                  </label>
                  <input
                    type="number"
                    required
                    min={1000}
                    step={1000}
                    value={txAmount}
                    onChange={(e) => setTxAmount(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Catatan Tambahan (Opsional)
                </label>
                <input
                  type="text"
                  value={txNote}
                  onChange={(e) => setTxNote(e.target.value)}
                  placeholder="Contoh: 200 Kg serasah dicacah dengan EM4"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-700"
                >
                  Simpan Catatan (+5 Koin)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
