"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  ArrowLeft,
  Check,
  Lock,
  Mail,
  MapPin,
  Sprout,
  User,
  Users,
  ShieldCheck,
} from "lucide-react";
import { registerUser, type UserRole, type PlanTier } from "@/lib/store";

const ROLES: {
  id: UserRole;
  code: string;
  title: string;
  desc: string;
  icon: React.ElementType;
}[] = [
  {
    id: "petani",
    code: "ROLE 01",
    title: "Petani / Pekebun Lahan",
    desc: "Kelola pembukaan lahan tanpa bakar, scan biomassa AI, catat surplus kas & klaim koin harian.",
    icon: Sprout,
  },
  {
    id: "kelompok_tani",
    code: "ROLE 02",
    title: "Pengurus Kelompok Tani / Koperasi",
    desc: "Koordinasi tabungan target alat mekanis bersama (mesin pencacah, pompa gambut) & kas kelompok.",
    icon: Users,
  },
  {
    id: "penyuluh",
    code: "ROLE 03",
    title: "Penyuluh / Relawan MPA",
    desc: "Pantau kesiagaan sekat bakar, tinggi muka air gambut, dan edukasi Masyarakat Peduli Api.",
    icon: ShieldCheck,
  },
];

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [village, setVillage] = useState("Desa Gohong, Pulang Pisau — Kalteng");
  const [landAreaHa, setLandAreaHa] = useState("2.0");
  const [role, setRole] = useState<UserRole>("petani");
  const [plan, setPlan] = useState<PlanTier>("trial");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setLoading(true);
    await registerUser({
      name: name.trim(),
      email: email.trim(),
      password,
      role,
      villageName: village.trim() || "Desa Gohong, Kalteng",
      landAreaHa: Math.max(0.5, parseFloat(landAreaHa) || 2.0),
      plan,
    });
    router.push("/beranda");
  };

  return (
    <div className="min-h-screen bg-[#050807] text-[#f4f4f0] selection:bg-emerald-500 selection:text-black flex flex-col justify-between relative overflow-hidden">
      {/* Subtle Ambient Glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-48 right-1/4 h-[440px] w-[440px] rounded-full bg-emerald-500/10 blur-[150px]" />
      </div>

      {/* Top Architectural Bar */}
      <header className="relative z-10 border-b border-white/[0.08] px-6 sm:px-10 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <img
            src="/logo-jagalahan.png"
            alt="JagaLahan"
            className="w-9 h-9 object-contain"
          />
          <div className="flex items-baseline gap-2.5">
            <span className="text-lg font-bold tracking-tight text-white">
              JagaLahan
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-400">
              REG / 02
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-xs font-mono uppercase tracking-[0.16em] text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            Sudah Punya Akun? Masuk →
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.16em] text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Index
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl w-full mx-auto my-8 border border-white/[0.08] bg-[#070b09]/90 backdrop-blur-xl">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left Column: Account & Land Identity */}
          <div className="lg:col-span-7 p-8 sm:p-12 border-b lg:border-b-0 lg:border-r border-white/[0.08] flex flex-col justify-between">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-emerald-400 mb-3">
                [01 / REGISTRASI LAHAN & PERAN]
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-white leading-[1.08]">
                Mulai 14 Hari Tanpa Bakar.
              </h1>
              <p className="mt-2.5 text-sm text-white/55 max-w-lg leading-relaxed">
                Daftarkan identitas lahan dan pilih peran Anda dalam ekosistem pencegahan Karhutla. Gratis 14 hari pertama tanpa syarat kartu.
              </p>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.18em] text-white/60 mb-2">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-white/35 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Contoh: Pak Rahmat Hidayat"
                      style={{ backgroundColor: "#0c1310", color: "#ffffff" }}
                      className="w-full pl-10 pr-3.5 py-3 text-sm border border-white/15 focus:border-emerald-400 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.18em] text-white/60 mb-2">
                    Alamat Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-white/35 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@desa.id"
                      style={{ backgroundColor: "#0c1310", color: "#ffffff" }}
                      className="w-full pl-10 pr-3.5 py-3 text-sm border border-white/15 focus:border-emerald-400 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.18em] text-white/60 mb-2">
                    Kata Sandi
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-white/35 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimal 6 karakter"
                      style={{ backgroundColor: "#0c1310", color: "#ffffff" }}
                      className="w-full pl-10 pr-3.5 py-3 text-sm border border-white/15 focus:border-emerald-400 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.18em] text-white/60 mb-2">
                    Estimasi Luas Lahan (Hektare)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="100"
                    required
                    value={landAreaHa}
                    onChange={(e) => setLandAreaHa(e.target.value)}
                    style={{ backgroundColor: "#0c1310", color: "#ffffff" }}
                    className="w-full px-3.5 py-3 text-sm border border-white/15 focus:border-emerald-400 focus:outline-none transition-colors font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-mono text-[10px] uppercase tracking-[0.18em] text-white/60 mb-2">
                    Lokasi Desa / Kecamatan Gambut
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-white/35 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                      placeholder="Desa, Kecamatan, Provinsi"
                      style={{ backgroundColor: "#0c1310", color: "#ffffff" }}
                      className="w-full pl-10 pr-3.5 py-3 text-sm border border-white/15 focus:border-emerald-400 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Paket Langganan Selector */}
            <div className="mt-8 pt-6 border-t border-white/[0.08]">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50 mb-3">
                [02 / PILIH PAKET AWAL]
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: "trial" as PlanTier, name: "TRIAL 14 HARI", price: "Rp 0" },
                  { id: "pro" as PlanTier, name: "PRO BULANAN", price: "Rp 9.900" },
                  { id: "vip" as PlanTier, name: "VIP KELOMPOK", price: "Rp 19.900" },
                ].map((tier) => {
                  const active = plan === tier.id;
                  return (
                    <button
                      type="button"
                      key={tier.id}
                      onClick={() => setPlan(tier.id)}
                      className={`p-3 text-left border transition-all ${
                        active
                          ? "border-emerald-400 bg-emerald-500/10"
                          : "border-white/10 bg-[#0b110e] hover:border-white/25"
                      }`}
                    >
                      <div className="font-mono text-[10px] uppercase tracking-wider text-emerald-400">
                        {tier.name}
                      </div>
                      <div className="text-sm font-bold text-white mt-0.5">
                        {tier.price}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Role Architecture Selection */}
          <div className="lg:col-span-5 p-8 sm:p-12 bg-[#080d0b] flex flex-col justify-between">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-amber-400 mb-3">
                [03 / ARSITEKTUR PERAN PENGGUNA]
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Pilih Peran Ekosistem Anda
              </h2>
              <p className="mt-1.5 text-xs text-white/50 leading-relaxed">
                Setiap peran menyesuaikan rekomendasi AI Tailoring dan metrik persuasi di dalam dashboard.
              </p>

              <div className="mt-6 space-y-3">
                {ROLES.map((item) => {
                  const Icon = item.icon;
                  const active = role === item.id;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setRole(item.id)}
                      className={`w-full text-left p-4 border transition-all ${
                        active
                          ? "border-emerald-400 bg-emerald-500/[0.08]"
                          : "border-white/10 bg-[#0b120e] hover:border-white/25"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-400 flex items-center gap-1.5">
                          <Icon className="w-3.5 h-3.5" />
                          {item.code}
                        </span>
                        {active && (
                          <span className="w-4 h-4 rounded-full bg-emerald-400 text-black flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </span>
                        )}
                      </div>
                      <div className="text-sm font-bold text-white">
                        {item.title}
                      </div>
                      <p className="text-xs text-white/55 mt-1 leading-relaxed">
                        {item.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/[0.08]">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-xs uppercase tracking-[0.18em] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? "Mengaktifkan Akun & Lahan..." : "Aktifkan Akun & Buka Dashboard"}
                <ArrowUpRight className="w-4 h-4" />
              </button>
              <div className="mt-4 flex items-center justify-between text-xs text-white/50">
                <span>Sudah terdaftar?</span>
                <Link
                  href="/login"
                  className="text-emerald-400 hover:text-emerald-300 font-mono uppercase tracking-wider"
                >
                  Masuk Akun →
                </Link>
              </div>
            </div>
          </div>
        </form>
      </main>

      {/* Bottom Status Bar */}
      <footer className="relative z-10 border-t border-white/[0.08] px-6 sm:px-10 h-14 flex items-center justify-between text-[11px] font-mono text-white/40">
        <span>JAGALAHAN.WEB.ID // ZERO-BURN ONBOARDING</span>
        <span>TRIAL 14 HARI GRATIS • TANPA KARTU KREDIT</span>
      </footer>
    </div>
  );
}
