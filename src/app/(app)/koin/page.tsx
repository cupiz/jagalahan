"use client";

import { useState } from "react";
import {
  Coins,
  Flame,
  Sparkles,
  Gift,
  CheckCircle2,
  CalendarCheck,
  HeartHandshake,
  ShieldCheck,
} from "lucide-react";
import { useV2State, performDailyCheckIn, redeemCoins } from "@/lib/store";
import { formatRupiah, todayIso } from "@/lib/utils";

const REWARD_OPTIONS = [
  {
    id: "rw-1",
    title: "Voucher Dekomposer EM4 & Molase (1 Liter)",
    coins: 1000,
    rupiah: 10_000,
    desc: "Mempercepat pembusukan serasah menjadi kompos dalam 14 hari tanpa bakar.",
  },
  {
    id: "rw-2",
    title: "Voucher Kapur Pertanian Dolomit (1 Sak)",
    coins: 1000,
    rupiah: 10_000,
    desc: "Menetralkan pH tanah gambut asam secara alami tanpa abu pembakaran.",
  },
  {
    id: "rw-3",
    title: "Voucher Bibit Tanaman Penutup Tanah / Sayur",
    coins: 2000,
    rupiah: 20_000,
    desc: "Subsidi benih unggul di Kios Tani Mitra Desa Bebas Asap.",
  },
];

export default function KoinPage() {
  const state = useV2State();
  const [message, setMessage] = useState<string | null>(null);

  const checkedInToday = state.lastCheckInDate === todayIso();

  const handleCheckIn = () => {
    const res = performDailyCheckIn();
    setMessage(res.message);
  };

  const handleRedeem = (title: string, coinsCost: number, rupiahValue: number) => {
    const ok = redeemCoins(title, coinsCost, rupiahValue);
    if (ok) {
      setMessage(`Berhasil menukar ${coinsCost.toLocaleString("id-ID")} Koin untuk ${title}!`);
    } else {
      setMessage("Saldo Koin Hijau belum mencukupi. Yuk rutin Check-in & catat aktivitas lahan!");
    }
  };

  const days = [1, 2, 3, 4, 5, 6, 7];
  const currentCycleDay = ((state.streakDays - 1) % 7) + 1;

  return (
    <div className="space-y-6 pb-10">
      {/* Feedback Banner */}
      {message && (
        <div className="flex items-center gap-2.5 rounded-2xl bg-emerald-700 px-5 py-3.5 text-sm font-bold text-white shadow-md">
          <Sparkles className="h-4 w-4 text-amber-300" />
          <span>{message}</span>
        </div>
      )}

      {/* Top Row: Coin Balance Card + Daily Check-in & Streak Card */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Coin Balance Card (5 cols) */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 p-6 text-white shadow-lg lg:col-span-5">
          <div className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-white/15 blur-2xl" />
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur-sm">
              <Coins className="h-3.5 w-3.5" />
              JagaLahan Coins
            </span>
            <span className="text-xs font-semibold text-amber-100">
              1.000 Koin = Rp10.000
            </span>
          </div>

          <div className="mt-5">
            <p className="text-xs font-medium text-amber-100">Saldo Koin Hijau Saat Ini</p>
            <h1 className="mt-1 text-4xl font-extrabold tracking-tight">
              {state.coins.toLocaleString("id-ID")}{" "}
              <span className="text-xl font-bold text-amber-100">Koin</span>
            </h1>
            <p className="mt-1 text-xs font-semibold text-amber-50">
              Nilai Tukar Setara:{" "}
              <strong>{formatRupiah(Math.floor(state.coins / 100) * 1000)}</strong>
            </p>
          </div>

          <div className="mt-6 rounded-2xl bg-white/15 p-3.5 text-xs leading-relaxed text-amber-50 backdrop-blur-sm">
            <strong>Transparansi Reward:</strong> Koin diperoleh dari konsistensi Check-in harian
            (+10 Koin), mencatat aktivitas lahan (+5 Koin), dan pemindaian Smart Scanner (+15 Koin).
          </div>
        </div>

        {/* Daily Check-in & Streak Card (7 cols) */}
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-800 lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-800 dark:bg-orange-950/70 dark:text-orange-300">
                  <Flame className="h-3.5 w-3.5 text-orange-500" />
                  Streak {state.streakDays} Hari Berturut-turut Bebas Api
                </span>
              </div>
              <h2 className="mt-2 text-xl font-extrabold text-slate-900 dark:text-white">
                Check-in Harian Jaga Lahan
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Klaim +10 Koin setiap hari & bonus +25 Koin setiap kelipatan 7 hari konsisten!
              </p>
            </div>

            <button
              type="button"
              onClick={handleCheckIn}
              className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-extrabold shadow-md transition ${
                checkedInToday
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300"
                  : "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:brightness-105"
              }`}
            >
              <CalendarCheck className="h-4 w-4" />
              {checkedInToday ? "Sudah Check-in Hari Ini ✓" : "Check-in Hari Ini (+10 Koin)"}
            </button>
          </div>

          {/* 7-Day Streak Visual Tracker */}
          <div className="mt-5 grid grid-cols-7 gap-2">
            {days.map((d) => {
              const done = d <= currentCycleDay;
              const isMilestone = d === 7;
              return (
                <div
                  key={d}
                  className={`flex flex-col items-center justify-center rounded-2xl border p-2.5 text-center transition ${
                    done
                      ? "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                      : "border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-800/40"
                  }`}
                >
                  <span className="text-[10px] font-bold">Hari {d}</span>
                  <div className="my-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-xs dark:bg-slate-900">
                    {done ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <Coins className="h-4 w-4 text-amber-500" />
                    )}
                  </div>
                  <span className="text-[10px] font-extrabold">
                    {isMilestone ? "+35" : "+10"}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Supportive Non-Guilt Principle Note */}
          <div className="mt-4 flex items-start gap-2.5 rounded-2xl bg-emerald-50/70 p-3.5 text-xs text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
            <HeartHandshake className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            <p>
              <strong>Pesan Suportif Tanpa Menyalahkan:</strong> Jika suatu hari Anda lupa Check-in
              karena sibuk di kebun, koin yang sudah terkumpul <strong>tidak akan pernah hangus</strong>.
              Kami hadir menyemangati, bukan menghukum!
            </p>
          </div>
        </div>
      </div>

      {/* Katalog Penukaran Koin (Reward Redemption) */}
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Tukar Koin Hijau dengan Voucher Sarana Tani Tanpa Bakar
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Nilai tukar transparan: 1.000 Koin = Rp10.000 (Tanpa biaya tersembunyi)
            </p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            Mitra Koperasi Tani Desa
          </span>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
          {REWARD_OPTIONS.map((rw) => {
            const affordable = state.coins >= rw.coins;
            return (
              <div
                key={rw.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200/80 p-5 transition hover:border-emerald-300 dark:border-slate-800"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 rounded-lg bg-amber-100 px-2.5 py-1 text-xs font-extrabold text-amber-800 dark:bg-amber-950/70 dark:text-amber-300">
                      <Gift className="h-3.5 w-3.5" />
                      {rw.coins.toLocaleString("id-ID")} Koin
                    </span>
                    <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                      Senilai {formatRupiah(rw.rupiah)}
                    </span>
                  </div>
                  <h3 className="mt-3 text-sm font-extrabold text-slate-900 dark:text-white">
                    {rw.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    {rw.desc}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={!affordable}
                  onClick={() => handleRedeem(rw.title, rw.coins, rw.rupiah)}
                  className={`mt-4 w-full rounded-xl py-2.5 text-xs font-extrabold transition ${
                    affordable
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-slate-800"
                  }`}
                >
                  {affordable ? "Tukar Koin Sekarang" : "Koin Belum Cukup"}
                </button>
              </div>
            );
          })}
        </div>

        {/* Riwayat Penukaran Koin */}
        <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
            Riwayat Penukaran Reward ({state.redemptions.length})
          </h3>
          <div className="mt-2.5 space-y-2">
            {state.redemptions.map((red) => (
              <div
                key={red.id}
                className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-2.5 text-xs dark:bg-slate-800/60"
              >
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{red.title}</p>
                  <p className="text-[11px] text-slate-500">Ditukar pada {red.date}</p>
                </div>
                <span className="font-extrabold text-amber-600">
                  -{red.coinsUsed.toLocaleString("id-ID")} Koin ({formatRupiah(red.rupiahValue)})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
