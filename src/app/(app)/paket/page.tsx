"use client";

import { useState } from "react";
import {
  Crown,
  Check,
  X,
  ShieldCheck,
  Sparkles,
  HeartHandshake,
  Zap,
} from "lucide-react";
import { useV2State, setPlanTier, type PlanTier } from "@/lib/store";

const PLANS: {
  id: PlanTier;
  name: string;
  badge: string;
  priceMonthly: string;
  priceYearly: string;
  desc: string;
  highlight?: boolean;
  features: { label: string; included: boolean }[];
}[] = [
  {
    id: "trial",
    name: "Perintis Lahan (Trial 30 Hari)",
    badge: "Coba 30 Hari Gratis",
    priceMonthly: "Gratis Rp0",
    priceYearly: "Akses Penuh Selama 30 Hari Pertama",
    desc: "Cocok untuk petani & pekebun perintis yang baru membiasakan pembukaan lahan tanpa bakar.",
    features: [
      { label: "Tracking Lahan Manual (Manfaat & Biaya)", included: true },
      { label: "Check-in Harian Bebas Api & Kumpulkan Benih Hijau", included: true },
      { label: "Pengingat Harian & Jadwal Mulsa Siaga Asap", included: true },
      { label: "Tabungan Alat Kebun (Maks. 2 Tabungan)", included: true },
      { label: "Ekspor Laporan PDF Resmi Zero-Burning", included: false },
      { label: "Smart Land & Smoke Scanner (AI Kamera)", included: false },
    ],
  },
  {
    id: "pro",
    name: "Paket Tani Mandiri",
    badge: "Paling Populer untuk Pekebun",
    priceMonthly: "Rp10.999 / bulan",
    priceYearly: "Rp109.000 / tahun (Hemat 17%)",
    desc: "Solusi mandiri pencatatan kebun tanpa batas, pembukaan reward Benih Hijau, dan ekspor Laporan PDF.",
    features: [
      { label: "Semua Fitur Paket Perintis Lahan Tanpa Batas Waktu", included: true },
      { label: "Ekspor Laporan PDF Resmi Standar GAP & Zero-Burning", included: true },
      { label: "Filter Riwayat & Grafik Analitik Pertanian Lengkap", included: true },
      { label: "Tabungan Alat Kebun Tanpa Batas Alokasi", included: true },
      { label: "Penukaran Benih Hijau ke Voucher Subsidi Saprotan", included: true },
      { label: "Smart Land & Smoke Scanner (AI Kamera)", included: false },
    ],
  },
  {
    id: "vip",
    name: "Paket Poktan Cerdas (AI)",
    badge: "Fitur Terlengkap + AI Scanner",
    priceMonthly: "Rp19.000 / bulan",
    priceYearly: "Rp190.000 / tahun (Hemat 17%)",
    desc: "Otomatisasi total dengan Smart Land & Smoke Scanner berbasis AI Vision untuk Poktan dan perkebunan produktif.",
    highlight: true,
    features: [
      { label: "Semua Fitur Paket Tani Mandiri Tanpa Batas", included: true },
      { label: "Smart Land & Smoke Scanner (AI Kamera Otomatis)", included: true },
      { label: "Deteksi Kompos (Kg) & Estimasi Hemat Pupuk (Rp) dari Foto", included: true },
      { label: "Pembersih Metadata Lokasi EXIF/GPS Otomatis (UU PDP)", included: true },
      { label: "Bonus +35 Benih Hijau Setiap Pemindaian Lahan AI", included: true },
      { label: "Prioritas Konsultasi Penyuluh & Koperasi Tani Desa", included: true },
    ],
  },
];

export default function PaketPage() {
  const state = useV2State();
  const [notice, setNotice] = useState<string | null>(null);

  const handleSelectPlan = (tier: PlanTier, name: string) => {
    setPlanTier(tier);
    setNotice(
      `Paket Anda berhasil diubah ke ${name}. Seluruh hak akses langsung diperbarui secara instan!`,
    );
    setTimeout(() => setNotice(null), 4000);
  };

  return (
    <div className="space-y-6 pb-10">
      {notice && (
        <div className="flex items-center gap-2.5 rounded-2xl bg-emerald-700 px-5 py-3.5 text-sm font-bold text-white shadow-md">
          <Sparkles className="h-4 w-4 text-amber-300" />
          <span>{notice}</span>
        </div>
      )}

      {/* Header */}
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-800">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800 dark:bg-amber-950/70 dark:text-amber-300">
          <Crown className="h-3.5 w-3.5" />
          Level Pengguna & Model Langganan Transparan
        </span>
        <h1 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
          Pilih Paket JagaLahan Sesuai Kebutuhan Kebunmu
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Tanpa jebakan biaya tersembunyi (*no dark patterns*). Setelah masa Perintis Lahan (Trial 30 Hari) berakhir,
          tidak ada pemotongan saldo otomatis tanpa persetujuan eksplisit Anda.
        </p>
      </div>

      {/* 3 Subscription Comparison Cards (Matching Page 9 of Nurul Hani's PDF) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {PLANS.map((plan) => {
          const isCurrent = state.plan === plan.id;
          return (
            <div
              key={plan.id}
              className={`relative flex flex-col justify-between rounded-3xl p-6 transition ${
                plan.highlight
                  ? "bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 text-white shadow-xl ring-2 ring-emerald-500"
                  : "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-900 dark:text-white dark:ring-slate-800"
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-extrabold ${
                      plan.highlight
                        ? "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/40"
                        : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300"
                    }`}
                  >
                    {plan.badge}
                  </span>
                  {isCurrent && (
                    <span className="rounded-full bg-amber-400 px-2.5 py-0.5 text-[11px] font-extrabold text-slate-950">
                      Paket Aktif
                    </span>
                  )}
                </div>

                <h2 className="mt-4 text-xl font-extrabold">{plan.name}</h2>
                <p
                  className={`mt-2 text-2xl font-extrabold ${
                    plan.highlight ? "text-emerald-400" : "text-emerald-600 dark:text-emerald-400"
                  }`}
                >
                  {plan.priceMonthly}
                </p>
                <p
                  className={`text-xs font-semibold ${
                    plan.highlight ? "text-slate-300" : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {plan.priceYearly}
                </p>

                <p
                  className={`mt-3 text-xs leading-relaxed ${
                    plan.highlight ? "text-slate-300" : "text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {plan.desc}
                </p>

                <div className="mt-5 space-y-2.5 border-t border-slate-200/20 pt-4">
                  {plan.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs">
                      {f.included ? (
                        <Check
                          className={`mt-0.5 h-4 w-4 shrink-0 ${
                            plan.highlight ? "text-emerald-400" : "text-emerald-600"
                          }`}
                        />
                      ) : (
                        <X className="mt-0.5 h-4 w-4 shrink-0 text-slate-400 opacity-50" />
                      )}
                      <span className={f.included ? "font-semibold" : "line-through opacity-50"}>
                        {f.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSelectPlan(plan.id, plan.name)}
                className={`mt-6 flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-xs font-extrabold transition ${
                  isCurrent
                    ? "bg-emerald-600/20 text-emerald-500 ring-1 ring-emerald-500/40"
                    : plan.highlight
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg hover:brightness-110"
                      : "bg-slate-900 text-white hover:bg-slate-800 dark:bg-emerald-600"
                }`}
              >
                <Zap className="h-4 w-4" />
                {isCurrent ? `Sedang Menggunakan ${plan.name}` : `Aktifkan ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>

      {/* Ethical Subscription Guarantee */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex items-start gap-3.5 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-800">
          <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600" />
          <div className="text-xs">
            <h3 className="font-extrabold text-slate-900 dark:text-white">
              Transparansi Langganan & Bebas Jebakan (No Forced Continuity)
            </h3>
            <p className="mt-1 leading-relaxed text-slate-600 dark:text-slate-400">
              Pengguna Perintis Lahan (Trial 30 Hari) tidak diminta memasukkan kartu kredit atau rekening di awal.
              Jika masa uji coba 30 hari selesai dan Anda memilih tidak berlangganan, seluruh data catatan lahan
              tetap aman, utuh, dan dapat diakses selamanya.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3.5 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-800">
          <HeartHandshake className="mt-0.5 h-6 w-6 shrink-0 text-amber-500" />
          <div className="text-xs">
            <h3 className="font-extrabold text-slate-900 dark:text-white">
              Subsidi Silang untuk Koperasi & Kelompok Tani Desa
            </h3>
            <p className="mt-1 leading-relaxed text-slate-600 dark:text-slate-400">
              Sebagian pendapatan langganan Paket Tani Mandiri dan Paket Poktan Cerdas dialokasikan kembali ke
              kas Benih Hijau Desa untuk subsidi dekomposer hayati EM4, dolomit, bibit sayuran gambut, dan paket tebas
              bagi pekebun perintis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

