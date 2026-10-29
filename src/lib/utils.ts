import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Penggabung className bergaya shadcn/ui. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

/** Format angka ke Rupiah tanpa desimal, mis. Rp2.200.000 */
export function formatRupiah(value: number): string {
  return rupiahFormatter.format(Math.round(value)).replace(/\s/g, "");
}

export function formatNumber(value: number, fractionDigits = 1): string {
  return new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function formatDate(iso: string | undefined | null): string {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return dateFormatter.format(d);
}

/** Tanggal ISO (YYYY-MM-DD) dengan offset hari dari hari ini. */
export function isoDaysFromToday(days: number): string {
  const d = typeof window === "undefined" ? new Date("2026-10-29T12:00:00+07:00") : new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function todayIso(): string {
  return isoDaysFromToday(0);
}

export function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T12:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Selisih hari (b - a) berdasarkan tanggal kalender. */
export function daysBetween(aIso: string, bIso: string): number {
  const a = new Date(`${aIso.slice(0, 10)}T12:00:00`).getTime();
  const b = new Date(`${bIso.slice(0, 10)}T12:00:00`).getTime();
  return Math.round((b - a) / 86_400_000);
}

export function uid(prefix = "id"): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`;
}

