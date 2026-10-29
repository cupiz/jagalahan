"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Calculator,
  CloudOff,
  Droplets,
  Home,
  ListChecks,
  Lock,
  RefreshCw,
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
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/beranda", label: "Beranda", icon: Home },
  { href: "/kalkulator", label: "Hitung", icon: Calculator },
  { href: "/panduan", label: "Panduan", icon: ListChecks },
  { href: "/muka-air", label: "Air Gambut", icon: Droplets },
  { href: "/kohort-desa", label: "Desa", icon: Users },
];

const ROLES: Role[] = ["pekebun_primer", "petani_sekunder", "penyuluh_tersier", "warga_penjaga"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const state = useAppState();
  const online = useOnline();
  const [roleOpen, setRoleOpen] = useState(false);
  const village = getVillage(state.profile.villageId);
  const pending = state.syncQueue.length;

  // Sinkronisasi otomatis saat sinyal kembali (hanya jika Supabase dikonfigurasi).
  useEffect(() => {
    if (online && isSupabaseConfigured && pending > 0) {
      void flushSyncQueue();
    }
  }, [online, pending]);

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-kertas shadow-[0_0_40px_rgba(20,38,28,0.12)]">
      <header className="sticky top-0 z-30 bg-gambut text-white">
        <div className="flex items-center gap-2.5 px-4 pb-2 pt-3">
          <Link href="/beranda" className="flex min-w-0 flex-1 items-center gap-2.5">
            <Image src="/icon-192.png" alt="Logo Jaga Lahan" width={38} height={38} className="rounded-xl bg-white/10" priority />
            <div className="min-w-0">
              <p className="text-base font-extrabold leading-tight tracking-tight">Jaga Lahan</p>
              <p className="truncate text-xs text-white/75">{village.name}, {village.district}</p>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => setRoleOpen(true)}
            className="flex max-w-[45%] items-center gap-1.5 rounded-full bg-white/12 px-3 py-1.5 text-left text-xs font-semibold ring-1 ring-white/25 hover:bg-white/20"
            aria-label="Ganti peran pengguna"
          >
            <UserRound className="size-4 shrink-0" />
            <span className="truncate">{ROLE_LABELS[state.profile.role]}</span>
          </button>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto bg-gambut-900/60 px-4 py-1.5 text-[11px] font-medium text-white/90 no-scrollbar">
          <span className="flex shrink-0 items-center gap-1">
            {online ? <Wifi className="size-3.5" /> : <CloudOff className="size-3.5" />}
            {online ? "Daring" : "Luring — data tetap tersimpan"}
          </span>
          <span className="text-white/40">•</span>
          <span className="flex shrink-0 items-center gap-1">
            <Lock className="size-3.5" /> Tanpa GPS · EXIF dibersihkan
          </span>
          <span className="text-white/40">•</span>
          <Link href="/profil" className="flex shrink-0 items-center gap-1 underline-offset-2 hover:underline">
            <RefreshCw className="size-3.5" />
            {isSupabaseConfigured ? `${pending} antre sinkron` : "Mode demo luring"}
          </Link>
        </div>
      </header>

      <main className="flex-1 px-4 pb-28 pt-4">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-md border-t border-gambut/10 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
        <ul className="grid grid-cols-5">
          {NAV.map(({ href, label, icon: Icon }) => {
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
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <Dialog
        open={roleOpen}
        onOpenChange={setRoleOpen}
        title="Pilih peran dalam kohort desa"
        description="Satu desa, empat peran. Ganti peran untuk melihat fitur yang relevan."
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
    </div>
  );
}

export function PageHeader({ title, subtitle, icon: Icon }: { title: string; subtitle?: string; icon?: React.ElementType }) {
  return (
    <div className="mb-4 flex items-start gap-3">
      {Icon && (
        <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-tunas text-gambut">
          <Icon className="size-6" />
        </span>
      )}
      <div>
        <h1 className="text-xl font-extrabold leading-tight text-arang">{title}</h1>
        {subtitle && <p className="mt-0.5 text-sm text-kabut">{subtitle}</p>}
      </div>
    </div>
  );
}

