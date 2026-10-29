"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BookOpen,
  Calculator,
  ClipboardCheck,
  CloudOff,
  Droplets,
  Flame,
  Globe,
  Home,
  ListChecks,
  Lock,
  Menu,
  RefreshCw,
  ShieldCheck,
  Sprout,
  UserRound,
  Users,
  Wifi,
} from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { getVillage, ROLE_DESCRIPTIONS, ROLE_LABELS, ROLE_PERSONA } from "@/lib/data/seed";
import { useOnline } from "@/lib/hooks/use-online";
import { flushSyncQueue } from "@/lib/offline/sync-queue";
import { switchRole, useAppState } from "@/lib/store";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import type { Role } from "@/lib/types";
import { cn, formatNumber } from "@/lib/utils";

const ALL_NAV = [
  { href: "/beranda", label: "Beranda Dasbor", shortLabel: "Beranda", icon: Home, badge: "Utama" },
  { href: "/kalkulator", label: "Kalkulator Biaya", shortLabel: "Hitung", icon: Calculator, badge: "F-02" },
  { href: "/panduan", label: "Panduan 6 Tahap", shortLabel: "Panduan", icon: ListChecks, badge: "F-03" },
  { href: "/muka-air", label: "Tongkat Air Gambut", shortLabel: "Air Gambut", icon: Droplets, badge: "F-04" },
  { href: "/jurnal-panen", label: "Jurnal Panen (N≥5)", shortLabel: "Panen", icon: BookOpen, badge: "F-05" },
  { href: "/kohort-desa", label: "Kohort & Lencana Desa", shortLabel: "Desa", icon: Users, badge: "F-06/07" },
  { href: "/pantau-asap", label: "Lapor Asap & Pasca-Bakar", shortLabel: "Asap", icon: Flame, badge: "F-08" },
  { href: "/penyuluh", label: "Panel Penyuluh Desa", shortLabel: "Penyuluh", icon: ClipboardCheck, badge: "Verifikasi" },
  { href: "/profil", label: "Profil & Privasi UU PDP", shortLabel: "Profil", icon: ShieldCheck, badge: "Zero-GIS" },
];

const MOBILE_BOTTOM_NAV = ALL_NAV.slice(0, 5);
const ROLES: Role[] = ["pekebun_primer", "petani_sekunder", "penyuluh_tersier", "warga_penjaga"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const state = useAppState();
  const online = useOnline();
  const [roleOpen, setRoleOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const village = getVillage(state.profile.villageId);
  const pending = state.syncQueue.length;

  useEffect(() => {
    if (online && isSupabaseConfigured && pending > 0) {
      void flushSyncQueue();
    }
  }, [online, pending]);

  return (
    <div className="min-h-dvh w-full bg-kertas text-arang lg:flex">
      {/* =====================================================================
          SIDEBAR DESKTOP (Tampil pada layar >= 1024px / lg)
         ===================================================================== */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-72 lg:flex-col lg:border-r lg:border-gambut/15 lg:bg-white">
        {/* Brand Header */}
        <div className="bg-gambut px-5 py-5 text-white">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/icon-192.png"
              alt="Logo Jaga Lahan"
              width={44}
              height={44}
              className="rounded-2xl bg-white/10 shadow-sm"
              priority
            />
            <div>
              <p className="text-lg font-extrabold leading-tight tracking-tight">Jaga Lahan</p>
              <p className="text-xs text-white/80">Buka Lahan Tanpa Bakar</p>
            </div>
          </Link>

          <div className="mt-4 rounded-xl bg-gambut-900/60 p-3 text-xs">
            <p className="font-bold text-white">{village.name}</p>
            <p className="text-white/75">
              {village.district}, {village.regency}
            </p>
            <div className="mt-2 flex items-center justify-between border-t border-white/15 pt-2 text-[11px] text-white/90">
              <span>Lahan: {formatNumber(state.profile.areaHa)} ha ({state.profile.soil})</span>
              <span className="rounded bg-white/15 px-1.5 py-0.5 font-semibold">
                {village.chopperUnits} alat desa
              </span>
            </div>
          </div>
        </div>

        {/* Daftar Menu Navigasi Lengkap */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          <div className="mb-2 px-3 text-[11px] font-extrabold uppercase tracking-wider text-kabut">
            Menu Aplikasi
          </div>
          {ALL_NAV.map(({ href, label, icon: Icon, badge }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
                  active
                    ? "bg-gambut text-white shadow-sm"
                    : "text-arang hover:bg-tunas/80 hover:text-gambut-900",
                )}
              >
                <span className="flex items-center gap-2.5">
                  <Icon className="size-4 shrink-0" />
                  <span>{label}</span>
                </span>
                <span
                  className={cn(
                    "rounded-md px-1.5 py-0.5 text-[10px] font-bold",
                    active ? "bg-white/20 text-white" : "bg-slate-100 text-kabut",
                  )}
                >
                  {badge}
                </span>
              </Link>
            );
          })}

          <div className="pt-3">
            <Link
              href="/"
              className="flex items-center gap-2.5 rounded-xl border border-gambut/20 bg-tunas/40 px-3 py-2.5 text-xs font-bold text-gambut hover:bg-tunas"
            >
              <Globe className="size-4" />
              Halaman Depan (Landing Page)
            </Link>
          </div>
        </nav>

        {/* Kartu Peran Aktif & Privasi di Bawah Sidebar */}
        <div className="border-t border-gambut/15 bg-slate-50/70 p-4">
          <button
            type="button"
            onClick={() => setRoleOpen(true)}
            className="w-full rounded-xl border border-gambut/20 bg-white p-3 text-left shadow-xs transition hover:border-gambut"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gambut">Peran Aktif</span>
              <span className="text-[11px] font-semibold text-gambut underline">Ganti Peran</span>
            </div>
            <p className="mt-0.5 text-sm font-extrabold text-arang">{state.profile.displayName}</p>
            <p className="text-xs text-kabut">{ROLE_LABELS[state.profile.role]}</p>
          </button>

          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-kabut">
            <Lock className="size-3.5 shrink-0 text-gambut" />
            <span>Zero-GIS · EXIF GPS Dihapus Otomatis</span>
          </div>
        </div>
      </aside>

      {/* =====================================================================
          AREA KONTEN UTAMA (Desktop + Mobile)
         ===================================================================== */}
      <div className="flex min-h-dvh flex-1 flex-col lg:pl-72">
        {/* Header Atas Responsif */}
        <header className="sticky top-0 z-20 border-b border-gambut/15 bg-gambut text-white lg:bg-white/95 lg:text-arang lg:backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
            {/* Identitas di Mobile / Breadcrumb di Desktop */}
            <div className="flex min-w-0 items-center gap-2.5">
              <Link href="/" className="flex items-center gap-2.5 lg:hidden">
                <Image
                  src="/icon-192.png"
                  alt="Logo Jaga Lahan"
                  width={36}
                  height={36}
                  className="rounded-xl bg-white/10"
                />
                <div className="min-w-0">
                  <p className="text-base font-extrabold leading-tight">Jaga Lahan</p>
                  <p className="truncate text-xs text-white/75">
                    {village.name}, {village.district}
                  </p>
                </div>
              </Link>

              <div className="hidden lg:flex lg:items-center lg:gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-tunas px-3 py-1 text-xs font-bold text-gambut-900">
                  <Sprout className="size-3.5 text-gambut" />
                  {village.name} ({village.regency})
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-arang">
                  <Lock className="size-3.5 text-gambut" />
                  Zero-GIS · Tanpa Pelacakan GPS Kebun
                </span>
              </div>
            </div>

            {/* Kanan: Status Koneksi, Sinkronisasi, & Pemilih Peran */}
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "hidden items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold sm:inline-flex",
                  online
                    ? "bg-emerald-100 text-emerald-900"
                    : "bg-amber-100 text-amber-900",
                )}
              >
                {online ? <Wifi className="size-3.5" /> : <CloudOff className="size-3.5" />}
                {online ? "Daring" : "Luring (Data Aman)"}
              </span>

              <Link
                href="/profil"
                className="hidden items-center gap-1.5 rounded-full border border-gambut/20 bg-white px-3 py-1 text-xs font-semibold text-arang hover:bg-tunas md:inline-flex"
              >
                <RefreshCw className="size-3.5 text-gambut" />
                {isSupabaseConfigured ? `${pending} antre sinkron` : "Mode Demo Luring"}
              </Link>

              <button
                type="button"
                onClick={() => setRoleOpen(true)}
                className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold text-white ring-1 ring-white/30 hover:bg-white/25 lg:bg-gambut lg:text-white lg:ring-0 lg:hover:bg-gambut-700"
              >
                <UserRound className="size-3.5 shrink-0" />
                <span className="max-w-[130px] truncate">{ROLE_LABELS[state.profile.role]}</span>
              </button>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="flex size-9 items-center justify-center rounded-xl bg-white/15 text-white hover:bg-white/25 lg:hidden"
                aria-label="Buka semua modul"
              >
                <Menu className="size-5" />
              </button>
            </div>
          </div>

          {/* Sub-bar Status Privasi khusus Mobile */}
          <div className="flex items-center gap-2 overflow-x-auto bg-gambut-900/60 px-4 py-1.5 text-[11px] font-medium text-white/90 no-scrollbar lg:hidden">
            <span className="flex shrink-0 items-center gap-1">
              {online ? <Wifi className="size-3.5" /> : <CloudOff className="size-3.5" />}
              {online ? "Daring" : "Luring — data tetap tersimpan"}
            </span>
            <span className="text-white/40">•</span>
            <span className="flex shrink-0 items-center gap-1">
              <Lock className="size-3.5" /> Tanpa GPS · EXIF dibersihkan
            </span>
            <span className="text-white/40">•</span>
            <Link href="/" className="flex shrink-0 items-center gap-1 underline">
              Landing Page
            </Link>
          </div>
        </header>

        {/* Konten Halaman (Lebar penuh hingga max-w-7xl di Desktop) */}
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-28 pt-5 sm:px-6 lg:px-8 lg:pb-12 lg:pt-7">
          {children}
        </main>

        {/* Navigasi Bawah Khusus Mobile (< lg) */}
        <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-gambut/15 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
          <ul className="mx-auto grid max-w-lg grid-cols-5">
            {MOBILE_BOTTOM_NAV.map(({ href, shortLabel, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(`${href}/`);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      "flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-semibold",
                      active ? "text-gambut" : "text-kabut hover:text-gambut",
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    <span className={cn("flex h-7 w-12 items-center justify-center rounded-full", active && "bg-tunas")}>
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

      {/* Dialog Ganti Peran Kohort Desa */}
      <Dialog
        open={roleOpen}
        onOpenChange={setRoleOpen}
        title="Pilih Peran dalam Kohort Desa"
        description="Satu desa, empat peran. Ganti peran untuk mencoba alur fitur yang berbeda."
      >
        <div className="space-y-2">
          {ROLES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => {
                switchRole(r);
                setRoleOpen(false);
              }}
              className={cn(
                "w-full rounded-2xl border-2 p-3 text-left transition-colors",
                state.profile.role === r ? "border-gambut bg-tunas" : "border-gambut/10 hover:bg-tunas/60",
              )}
            >
              <p className="font-bold text-arang">
                {ROLE_LABELS[r]} <span className="font-normal text-kabut">· {ROLE_PERSONA[r]}</span>
              </p>
              <p className="text-sm text-kabut">{ROLE_DESCRIPTIONS[r]}</p>
            </button>
          ))}
        </div>
      </Dialog>

      {/* Dialog Menu Lengkap di Mobile */}
      <Dialog
        open={mobileMenuOpen}
        onOpenChange={setMobileMenuOpen}
        title="Semua Modul Jaga Lahan"
        description="Pilih halaman yang ingin dibuka"
      >
        <div className="grid grid-cols-1 gap-1.5">
          {ALL_NAV.map(({ href, label, icon: Icon, badge }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between rounded-xl border border-gambut/15 bg-white px-3.5 py-2.5 text-sm font-semibold text-arang hover:bg-tunas"
            >
              <span className="flex items-center gap-2.5">
                <Icon className="size-4 text-gambut" />
                {label}
              </span>
              <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-kabut">{badge}</span>
            </Link>
          ))}
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-tunas px-3.5 py-2.5 text-sm font-bold text-gambut"
          >
            <Globe className="size-4" /> Buka Halaman Depan (Landing Page)
          </Link>
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
    <div className="mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-gambut/10 pb-4">
      <div className="flex items-start gap-3.5">
        {Icon && (
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-tunas text-gambut shadow-xs">
            <Icon className="size-6" />
          </span>
        )}
        <div>
          <h1 className="text-xl font-extrabold leading-tight text-arang sm:text-2xl">{title}</h1>
          {subtitle && <p className="mt-0.5 text-sm text-kabut">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  );
}
