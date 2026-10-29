"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, Lock, Mail, ShieldCheck, UserCheck } from "lucide-react";
import { loginUser, type PlanTier, type UserRole } from "@/lib/store";
import { isSupabaseConfigured } from "@/lib/supabase/client";


/** Halaman tujuan setelah login (dari ?next=...), hanya path internal yang diizinkan. */
function getNextPath(): string {
  const next = new URLSearchParams(window.location.search).get("next");
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/beranda";
}

const DEMO_ACCOUNTS: {
  label: string;
  sub: string;
  name: string;
  email: string;
  role: UserRole;
  plan: PlanTier;
  villageName: string;
  landAreaHa: number;
}[] = [
  {
    label: "Iqbal — Petani Mandiri (VIP)",
    sub: "Akses penuh: Smart Land Scanner AI + Laporan PDF + Koin",
    name: "Iqbal",
    email: "iqbal@jagalahan.web.id",
    role: "petani",
    plan: "vip",
    villageName: "Desa Kalampangan, Palangka Raya",
    landAreaHa: 2.0,
  },
  {
    label: "Pak Hendra — Ketua Kelompok Tani (Pro)",
    sub: "Koordinator koperasi desa, verifikasi PDF & penukaran voucher koin",
    name: "Pak Hendra",
    email: "hendra.poktan@jagalahan.web.id",
    role: "kelompok_tani",
    plan: "pro",
    villageName: "Koperasi Tani Sabangau Hijau",
    landAreaHa: 15.0,
  },
  {
    label: "Budi Santoso — Petani Baru (Trial 14 Hari)",
    sub: "Uji coba gratis 14 hari tanpa kartu kredit (Tracking, Koin, Pengingat)",
    name: "Budi Santoso",
    email: "budi.tani@jagalahan.web.id",
    role: "petani",
    plan: "trial",
    villageName: "Desa Tumbang Nusa, Pulang Pisau",
    landAreaHa: 1.5,
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("iqbal@jagalahan.web.id");
  const [password, setPassword] = useState("••••••••••••");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await loginUser({ email, password });
    router.push(getNextPath());
  };

  const handleQuickDemo = async (preset: (typeof DEMO_ACCOUNTS)[number]) => {
    setLoading(true);
    await loginUser({
      email: preset.email,
      name: preset.name,
      role: preset.role,
      plan: preset.plan,
      villageName: preset.villageName,
      landAreaHa: preset.landAreaHa,
    });
    router.push(getNextPath());
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-200 selection:text-emerald-950">
      {/* Architectural Top Bar */}
      <header className="border-b border-slate-200">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/icon-192.png"
              alt="JagaLahan"
              width={34}
              height={34}
              className="h-8 w-8 object-contain"
              priority
            />
            <span className="text-base font-bold tracking-[-0.03em] text-slate-900">
              JagaLahan
            </span>
          </Link>
          <Link
            href="/register"
            className="text-xs font-medium text-slate-600 transition hover:text-slate-900"
          >
            Belum punya akun? <span className="text-emerald-700 underline underline-offset-4">Daftar Gratis</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl grid-cols-1 lg:grid-cols-12">
        {/* Left Editorial Column (6 cols) */}
        <div className="flex flex-col justify-between border-b border-slate-200 p-8 sm:p-12 lg:col-span-6 lg:border-b-0 lg:border-r">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-emerald-700">
              [ PORTAL AKSES — JAGALAHAN.WEB.ID ]
            </p>
            <h1 className="mt-6 text-4xl font-semibold leading-[1.02] tracking-[-0.04em] text-slate-900 sm:text-5xl">
              Masuk ke buku kas lahan tanpa bakar.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-600">
              Pantau nilai kompos, pindai kelembapan gambut dengan kamera AI, dan kelola tabungan
              alat pertanian Anda.
            </p>
          </div>

          {/* Quick Role Demo Switcher */}
          <div className="mt-10">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate-600">
                UJI AKSES INSTAN (PILIH ROLE & LEVEL)
              </span>
              <span className="font-mono text-[10px] text-emerald-700">1-KLIK MASUK</span>
            </div>
            <div className="mt-3 space-y-2.5">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleQuickDemo(acc)}
                  className="group flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-left transition hover:border-emerald-500 hover:bg-emerald-50"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-700">
                      {acc.label}
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-600">{acc.sub}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-slate-500 transition group-hover:translate-x-1 group-hover:text-emerald-700" />
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 flex items-center justify-between border-t border-slate-200 pt-5 font-mono text-[11px] text-slate-500">
            <span>UU PDP NO. 27/2022 COMPLIANT</span>
            <span>{isSupabaseConfigured ? "SUPABASE CLOUD READY" : "OFFLINE-FIRST SYNC"}</span>
          </div>
        </div>

        {/* Right Form Column (6 cols) */}
        <div className="flex items-center justify-center p-8 sm:p-12 lg:col-span-6">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold tracking-[-0.03em] text-slate-900">
                Masuk dengan Email
              </h2>
              <p className="mt-1 text-xs text-slate-600">
                Masukkan kredensial akun JagaLahan Anda untuk melanjutkan ke dashboard.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-[0.12em] text-slate-600">
                  Alamat Email
                </label>
                <div className="relative mt-2">
                  <Mail className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@jagalahan.web.id"
                    style={{ backgroundColor: "#ffffff", color: "#0f172a" }}
                    className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 text-sm font-medium text-slate-900 outline-none transition focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block font-mono text-[11px] uppercase tracking-[0.12em] text-slate-600">
                    Kata Sandi
                  </label>
                  <span className="text-[11px] text-emerald-700">Terenkripsi</span>
                </div>
                <div className="relative mt-2">
                  <Lock className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ backgroundColor: "#ffffff", color: "#0f172a" }}
                    className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 text-sm font-medium text-slate-900 outline-none transition focus:border-emerald-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-xs font-bold uppercase tracking-[0.1em] text-white transition hover:bg-emerald-700"
              >
                <span>{loading ? "Memverifikasi Sesi..." : "Masuk ke Dashboard"}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-8 rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-600">
              <div className="flex items-center gap-2 font-semibold text-slate-800">
                <ShieldCheck className="h-4 w-4 text-emerald-700" />
                <span>Arsitektur 3 Peran Pengguna (Roles)</span>
              </div>
              <p className="mt-1.5 leading-relaxed">
                Akun Anda menyesuaikan tampilan untuk <strong>Petani/Pekebun</strong>,{" "}
                <strong>Pengurus Kelompok Tani</strong>, atau <strong>Penyuluh MPA</strong>. Belum
                memiliki akun?{" "}
                <Link href="/register" className="font-bold text-emerald-700 hover:underline">
                  Daftar Trial 14 Hari Gratis →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

