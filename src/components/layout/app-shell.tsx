"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Bell,
  Coins,
  Crown,
  Eye,
  EyeOff,
  FileSpreadsheet,
  Globe,
  Home,
  LogOut,
  Menu,
  ScanLine,
  ShieldAlert,
  ShieldCheck,
  Target,
  UserCheck,
} from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import {
  logoutUser,
  ROLE_LABELS,
  setPlanTier,
  setUserRole,
  togglePrivacyMask,
  useHydrated,
  useV2State,
  type PlanTier,
  type UserRole,
} from "@/lib/store";
import { cn, formatNumber } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/beranda", label: "Dashboard (Beranda)", shortLabel: "Beranda", icon: Home, badge: "Utama" },
  { href: "/tracking", label: "Tracking & Laporan PDF", shortLabel: "Tracking", icon: FileSpreadsheet, badge: "Log" },
  { href: "/scanner", label: "Smart Land Scanner", shortLabel: "Scanner", icon: ScanLine, badge: "VIP AI" },
  { href: "/koin", label: "Check-in & Koin Hijau", shortLabel: "Koin", icon: Coins, badge: "+Reward" },
  { href: "/pengingat", label: "Pengingat Siaga", shortLabel: "Pengingat", icon: Bell, badge: "Trigger" },
  { href: "/target", label: "Target Lahan Impian", shortLabel: "Target", icon: Target, badge: "Goal" },
  { href: "/paket", label: "Paket Trial / Pro / VIP", shortLabel: "Paket", icon: Crown, badge: "Tier" },
  { href: "/profil", label: "Profil & Privasi UU PDP", shortLabel: "Profil", icon: ShieldCheck, badge: "Aman" },
  { href: "/admin", label: "Panel Super Admin", shortLabel: "Admin", icon: ShieldAlert, badge: "CRUD" },
];

const MOBILE_TABS = [
  NAV_ITEMS[0], // Beranda
  NAV_ITEMS[1], // Tracking
  NAV_ITEMS[2], // Scanner
  NAV_ITEMS[3], // Koin
  NAV_ITEMS[5], // Target
];

const PLAN_LABELS: Record<PlanTier, string> = {
  trial: "Trial 14 Hari",
  pro: "Paket Pro",
  vip: "Paket VIP",
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const state = useV2State();
  const hydrated = useHydrated();
  const [planDialogOpen, setPlanDialogOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Auth guard: semua halaman di dalam (app) wajib login terlebih dahulu.
  useEffect(() => {
    if (hydrated && !state.isAuthenticated) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [hydrated, state.isAuthenticated, pathname, router]);

  const handleLogout = async () => {
    await logoutUser();
    router.push("/login");
  };

  if (!hydrated || !state.isAuthenticated) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <Image src="/logo-jagalahan.png" alt="JagaLahan" width={44} height={44} className="animate-pulse object-contain" />
          <p className="font-mono text-[11px] uppercase tracking-[0.18em]">Memeriksa sesi login…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh w-full bg-slate-50 text-slate-900 lg:flex">
      {/* =====================================================================
          SIDEBAR DESKTOP (Tampil di layar >= 1024px)
         ===================================================================== */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-72 lg:flex-col lg:border-r lg:border-slate-200/80 lg:bg-white">
        {/* Brand Header */}
        <div className="border-b border-slate-100 p-5">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo-jagalahan.png"
              alt="Logo JagaLahan"
              width={42}
              height={42}
              className="object-contain"
              priority
            />
            <div>
              <p className="text-lg font-black tracking-tight text-slate-900">
                JagaLahan<span className="text-emerald-600">.</span>
              </p>
              <p className="text-[11px] font-semibold text-slate-500">Smart Land & Karhutla Tracker</p>
            </div>
          </Link>

          {/* Kartu Ringkas Koin & Streak di Sidebar */}
          <div className="mt-4 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-blue-600 p-3.5 text-white shadow-lg shadow-emerald-600/20">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-100">Saldo JagaLahan Coins</span>
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-extrabold">
                Streak {state.streakDays} Hari
              </span>
            </div>
            <p className="mt-1 text-xl font-black tabular-nums">{formatNumber(state.coins, 0)} Koin</p>
            <p className="mt-0.5 truncate text-[11px] text-emerald-100">
              {ROLE_LABELS[state.userRole]} • {state.villageName}
            </p>
          </div>
        </div>

        {/* Menu Navigasi */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          <div className="mb-2 px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            Menu Utama JagaLahan
          </div>
          {NAV_ITEMS.map(({ href, label, icon: Icon, badge }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold transition-all",
                  active
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20"
                    : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-800",
                )}
              >
                <span className="flex items-center gap-2.5">
                  <Icon className="size-4 shrink-0" />
                  <span>{label}</span>
                </span>
                <span
                  className={cn(
                    "rounded-md px-1.5 py-0.5 text-[10px] font-extrabold",
                    active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500",
                  )}
                >
                  {badge}
                </span>
              </Link>
            );
          })}

          <div className="pt-3 space-y-1.5">
            <Link
              href="/"
              className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/70 px-3 py-2.5 text-xs font-extrabold text-emerald-700 hover:bg-emerald-100"
            >
              <Globe className="size-4" />
              Halaman Depan (Landing Page)
            </Link>
          </div>
        </nav>

        {/* Pengaturan Level Paket & Logout di Bawah Sidebar */}
        <div className="border-t border-slate-100 bg-slate-50/60 p-4 space-y-2.5">
          <button
            type="button"
            onClick={() => setPlanDialogOpen(true)}
            className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-left shadow-xs transition hover:border-emerald-500"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600">
                Peran & Paket Aktif
              </span>
              <span className="text-[11px] font-bold text-emerald-600 underline">Ubah</span>
            </div>
            <p className="mt-0.5 flex items-center gap-1.5 text-sm font-black text-slate-900">
              <Crown className="size-4 text-amber-500" />
              {PLAN_LABELS[state.plan]}
            </p>
            <p className="text-[11px] font-semibold text-slate-600 truncate">
              {ROLE_LABELS[state.userRole]}
            </p>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/login"
              className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
            >
              <UserCheck className="size-3.5 text-emerald-600" />
              Ganti Akun
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 cursor-pointer"
            >
              <LogOut className="size-3.5" />
              Keluar
            </button>
          </div>
        </div>
      </aside>

      {/* =====================================================================
          AREA KONTEN UTAMA (Desktop & Mobile)
         ===================================================================== */}
      <div className="flex min-h-dvh flex-1 flex-col lg:pl-72">
        {/* Top Navbar Glassmorphism */}
        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/85 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2.5 lg:hidden">
                <Image src="/logo-jagalahan.png" alt="JagaLahan" width={34} height={34} className="object-contain" />
                <span className="text-base font-black tracking-tight text-slate-900">
                  JagaLahan<span className="text-emerald-600">.</span>
                </span>
              </Link>

              <div className="hidden lg:flex lg:items-center lg:gap-2">
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-700">
                  {state.userName} • {ROLE_LABELS[state.userRole]} ({formatNumber(state.landAreaHa)} Ha)
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {state.villageName}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Tombol Privacy Mode (Sembunyikan Nominal) */}
              <button
                type="button"
                onClick={togglePrivacyMask}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
                title="Privacy Mode: Sembunyikan/Tampilkan Nominal"
              >
                {state.privacyMask ? <EyeOff className="size-3.5 text-emerald-600" /> : <Eye className="size-3.5" />}
                <span className="hidden sm:inline">{state.privacyMask ? "Nominal Tersembunyi" : "Privacy Mode"}</span>
              </button>

              {/* Saldo Koin Cepat */}
              <Link
                href="/koin"
                className="inline-flex items-center gap-1.5 rounded-xl bg-amber-50 px-3 py-1.5 text-xs font-extrabold text-amber-800 ring-1 ring-amber-200 hover:bg-amber-100"
              >
                <Coins className="size-3.5 text-amber-600" />
                <span className="tabular-nums">{formatNumber(state.coins, 0)} Koin</span>
              </Link>

              {/* Pemilih Level Trial / Pro / VIP */}
              <button
                type="button"
                onClick={() => setPlanDialogOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-3 py-1.5 text-xs font-extrabold text-white shadow-sm hover:from-emerald-700 hover:to-teal-700"
              >
                <Crown className="size-3.5" />
                <span>{PLAN_LABELS[state.plan]}</span>
              </button>

              {/* Tombol Keluar Cepat */}
              <button
                type="button"
                onClick={handleLogout}
                title="Keluar Akun (Logout)"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 cursor-pointer"
              >
                <LogOut className="size-3.5" />
                <span>Keluar</span>
              </button>

              <button
                type="button"
                onClick={() => setMobileDrawerOpen(true)}
                className="flex size-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 lg:hidden"
                aria-label="Menu lengkap"
              >
                <Menu className="size-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Konten Utama */}
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-28 pt-5 sm:px-6 lg:px-8 lg:pb-12 lg:pt-7">
          {children}
        </main>

        {/* Bottom Navigation Bar untuk Mobile */}
        <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
          <ul className="mx-auto grid max-w-lg grid-cols-5">
            {MOBILE_TABS.map(({ href, shortLabel, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(`${href}/`);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      "flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-bold",
                      active ? "text-emerald-600" : "text-slate-400 hover:text-emerald-600",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-7 w-12 items-center justify-center rounded-full",
                        active && "bg-emerald-50 text-emerald-600",
                      )}
                    >
                      <Icon className="size-5" />
                    </span>
                    {shortLabel}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Dialog Simulasi Ganti Peran & Level Pengguna (Trial 14 Hari / Pro / VIP) */}
      <Dialog
        open={planDialogOpen}
        onOpenChange={setPlanDialogOpen}
        title="Simulasi Peran (Role) & Level Paket"
        description="Uji bagaimana JagaLahan menyesuaikan fitur persuasi berdasarkan Peran Pengguna dan Level Langganan."
      >
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              1. Pilih Peran Ekosistem (Role)
            </p>
            <div className="grid grid-cols-1 gap-2">
              {(
                [
                  ["admin", "Super Admin (Administrator Sistem)", "Akses penuh melihat, menambah, mengedit & menghapus seluruh data pengguna, transaksi, scan AI, target, pengingat & cloud."],
                  ["petani", "Petani / Pekebun Lahan", "Fokus pencatatan pembukaan lahan tanpa bakar, kalkulasi penghematan pupuk NPK, dan klaim koin harian."],
                  ["kelompok_tani", "Pengurus Kelompok Tani / Koperasi", "Fokus manajemen kas kolektif, progres tabungan alat mekanis bersama (pencacah/pompa), & audit PDF."],
                  ["penyuluh", "Penyuluh / Relawan MPA", "Fokus pemantauan tinggi muka air gambut, kesiagaan sekat bakar, dan mitigasi risiko titik panas desa."],
                ] as [UserRole, string, string][]
              ).map(([roleKey, roleTitle, roleDesc]) => (
                <button
                  key={roleKey}
                  type="button"
                  onClick={() => setUserRole(roleKey)}
                  className={cn(
                    "w-full rounded-xl border p-3 text-left transition",
                    state.userRole === roleKey
                      ? "border-emerald-600 bg-emerald-50/70"
                      : "border-slate-200 bg-white hover:border-emerald-300",
                  )}
                >
                  <p className="text-xs font-black text-slate-900">{roleTitle}</p>
                  <p className="mt-0.5 text-[11px] text-slate-600">{roleDesc}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              2. Pilih Level Langganan (Subscription Tier)
            </p>
            <div className="space-y-2">
              {(
                [
                  [
                    "trial",
                    "Trial 14 Hari (Gratis)",
                    "Akses Tracking Lahan, Pengingat Siaga, & Check-in Harian. Fitur Target Impian, Unduh PDF, & Smart Scanner terkunci.",
                  ],
                  [
                    "pro",
                    "Paket Pro (Rp9.900 / bulan)",
                    "Membuka Koin & Reward, Target Lahan Impian, serta Laporan & Unduh PDF.",
                  ],
                  [
                    "vip",
                    "Paket VIP (Rp19.900 / bulan)",
                    "Mencakup seluruh fitur Pro ditambah akses eksklusif ke Smart Land & Smoke Scanner berbasis AI.",
                  ],
                ] as const
              ).map(([tier, title, desc]) => (
                <button
                  key={tier}
                  type="button"
                  onClick={() => {
                    setPlanTier(tier);
                    setPlanDialogOpen(false);
                  }}
                  className={cn(
                    "w-full rounded-xl border-2 p-3 text-left transition",
                    state.plan === tier
                      ? "border-emerald-600 bg-emerald-50/70"
                      : "border-slate-200 bg-white hover:border-emerald-300",
                  )}
                >
                  <p className="text-xs font-black text-slate-900">{title}</p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-slate-600">{desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <Link
              href="/paket"
              onClick={() => setPlanDialogOpen(false)}
              className="text-xs font-extrabold text-emerald-600 hover:underline"
            >
              Tabel Perbandingan Paket →
            </Link>
            <Link
              href="/login"
              onClick={() => setPlanDialogOpen(false)}
              className="text-xs font-extrabold text-slate-600 hover:underline"
            >
              Halaman Login / Ganti Akun →
            </Link>
          </div>
        </div>
      </Dialog>

      {/* Drawer Menu Mobile */}
      <Dialog
        open={mobileDrawerOpen}
        onOpenChange={setMobileDrawerOpen}
        title="Menu Lengkap JagaLahan"
        description={`${state.userName} • ${ROLE_LABELS[state.userRole]}`}
      >
        <div className="space-y-1.5">
          {NAV_ITEMS.map(({ href, label, icon: Icon, badge }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileDrawerOpen(false)}
              className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-800 hover:bg-emerald-50"
            >
              <span className="flex items-center gap-2.5">
                <Icon className="size-4 text-emerald-600" />
                {label}
              </span>
              <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">{badge}</span>
            </Link>
          ))}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <Link
              href="/"
              onClick={() => setMobileDrawerOpen(false)}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-2.5 text-xs font-extrabold text-emerald-700"
            >
              <Globe className="size-4" /> Landing Page
            </Link>
            <button
              type="button"
              onClick={() => {
                setMobileDrawerOpen(false);
                handleLogout();
              }}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-rose-50 px-3 py-2.5 text-xs font-extrabold text-rose-700"
            >
              <LogOut className="size-4" /> Keluar Akun
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  icon: Icon,
  action,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ElementType;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3 border-b border-slate-200/80 pb-4">
      <div className="flex items-start gap-3.5">
        {Icon && (
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 shadow-xs">
            <Icon className="size-6" />
          </span>
        )}
        <div>
          <h1 className="text-xl font-black leading-tight text-slate-900 sm:text-2xl">{title}</h1>
          {subtitle && <p className="mt-0.5 text-sm font-medium text-slate-500">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  );
}
