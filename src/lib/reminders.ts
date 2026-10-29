import { addDays, daysBetween, todayIso } from "@/lib/utils";

/**
 * Kalender Musim & Pengingat Pra-Keputusan (F-07).
 * Pemicu H-21, H-14, H-7 sebelum tanggal rencana buka lahan.
 * Aturan unobtrusive: berhenti otomatis setelah 3 kali diabaikan.
 */

export const REMINDER_OFFSETS = [21, 14, 7] as const;
export const MAX_IGNORED = 3;

export const REMINDER_MESSAGES: Record<(typeof REMINDER_OFFSETS)[number], { title: string; body: string; cta: string; href: string }> = {
  21: {
    title: "H-21: Waktunya menghitung biaya",
    body: "Tiga minggu lagi musim buka lahan. Bandingkan biaya bakar vs. tanpa bakar untuk lahan Anda — hanya butuh 1 menit.",
    cta: "Buka Kalkulator",
    href: "/kalkulator",
  },
  14: {
    title: "H-14: Pesan alat cacah gilir desa",
    body: "Jadwal alat pencacah desa cepat penuh menjelang musim. Ajukan pinjam sekarang agar tidak perlu sewa.",
    cta: "Ajukan Pinjam Alat",
    href: "/kalkulator#bantuan",
  },
  7: {
    title: "H-7: Siapkan tahap 1 & 2",
    body: "Seminggu lagi. Mulai penilaian biomassa dan rencanakan pencacahan — lihat video peragaan 40 detik.",
    cta: "Buka Panduan 6 Tahap",
    href: "/panduan",
  },
};

export interface ReminderStatus {
  daysLeft: number;
  active: (typeof REMINDER_OFFSETS)[number] | null;
  schedule: { offset: (typeof REMINDER_OFFSETS)[number]; date: string; state: "lewat" | "aktif" | "akan_datang" }[];
}

export function getReminderStatus(plantingDate: string, today = todayIso()): ReminderStatus {
  const daysLeft = daysBetween(today, plantingDate);
  let active: ReminderStatus["active"] = null;
  for (const o of REMINDER_OFFSETS) {
    if (daysLeft <= o && daysLeft >= 0) active = o;
  }
  const schedule = REMINDER_OFFSETS.map((offset) => {
    const date = addDays(plantingDate, -offset);
    let state: "lewat" | "aktif" | "akan_datang" = "akan_datang";
    if (active === offset) state = "aktif";
    else if (daysLeft < offset) state = "lewat";
    return { offset, date, state };
  });
  return { daysLeft, active, schedule };
}

