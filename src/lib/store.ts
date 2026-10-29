"use client";

import { useSyncExternalStore } from "react";
import { todayIso, uid } from "@/lib/utils";

/**
 * JagaLahan v2 Store — Penyimpanan lokal interaktif untuk:
 * 1. Tracking Lahan Tanpa Bakar (Manfaat & Biaya Kelola) + Unduh Laporan PDF
 * 2. Smart Land & Smoke Scanner (AI Kamera Pemindai Lahan/Semak/Asap)
 * 3. Check-in Harian Bebas Api, Streak, & JagaLahan Coins (Koin Hijau + Tukar Reward)
 * 4. Pengingat Siaga Karhutla & Jadwal Lahan
 * 5. Target Lahan Impian (Goal Setting & Progress Bar)
 * 6. Level Pengguna & Paket Langganan (Trial 14 Hari, Pro, VIP)
 */

export type PlanTier = "trial" | "pro" | "vip";
export type TxType = "manfaat" | "biaya";
export type TxCategory =
  | "Kompos & Mulsa"
  | "Hemat Pupuk"
  | "Tebas & Cacah"
  | "Bantuan & Insentif"
  | "Sekat Kanal & Air"
  | "Lainnya";

export interface LandTransaction {
  id: string;
  title: string;
  category: TxCategory;
  type: TxType;
  amount: number;
  date: string;
  note?: string;
  fromScanner?: boolean;
}

export interface LandReminder {
  id: string;
  title: string;
  subtitle: string;
  timeOrDate: string;
  kind: "harian" | "musiman" | "siaga_asap";
  enabled: boolean;
  doneToday?: boolean;
}

export interface DreamTarget {
  id: string;
  title: string;
  subtitle: string;
  targetAmount: number;
  savedAmount: number;
  monthlySaving: number;
  deadline: string;
  icon: "chopper" | "pump" | "seeds";
}

export interface RewardRedemption {
  id: string;
  title: string;
  coinsUsed: number;
  rupiahValue: number;
  date: string;
}

export interface ScanRecord {
  id: string;
  landCondition: string;
  fireRisk: "Aman (Lembap)" | "Waspada (Agak Kering)" | "Bahaya (Rawan Api)";
  waterDepthCm: number;
  estimatedCompostKg: number;
  estimatedFertilizerSavedRp: number;
  recommendation: string;
  scannedAt: string;
  photoDataUrl?: string;
  exifStripped: true;
}

export interface JagaLahanV2State {
  userName: string;
  villageName: string;
  landAreaHa: number;
  plan: PlanTier;
  privacyMask: boolean;
  darkMode: boolean;
  coins: number;
  streakDays: number;
  lastCheckInDate: string | null;
  transactions: LandTransaction[];
  reminders: LandReminder[];
  targets: DreamTarget[];
  redemptions: RewardRedemption[];
  scans: ScanRecord[];
}

const STORAGE_KEY = "jagalahan:v2";

export function createInitialV2State(): JagaLahanV2State {
  return {
    userName: "Iqbal",
    villageName: "Desa Kalampangan, Palangka Raya",
    landAreaHa: 2.0,
    plan: "vip",
    privacyMask: false,
    darkMode: false,
    coins: 1250,
    streakDays: 12,
    lastCheckInDate: null,
    transactions: [
      {
        id: "tx-1",
        title: "Penghematan Pupuk NPK dari Mulsa Tanpa Bakar (2 Ha)",
        category: "Hemat Pupuk",
        type: "manfaat",
        amount: 3_500_000,
        date: "2026-10-28",
        note: "Unsur hara nitrogen terjaga karena semak tidak dibakar",
      },
      {
        id: "tx-2",
        title: "Nilai Kompos Organik Hasil Cacahan Semak (450 Kg)",
        category: "Kompos & Mulsa",
        type: "manfaat",
        amount: 1_500_000,
        date: "2026-10-25",
        fromScanner: true,
      },
      {
        id: "tx-3",
        title: "Upah Tebas & Cacah Semak Ringan",
        category: "Tebas & Cacah",
        type: "biaya",
        amount: 450_000,
        date: "2026-10-22",
      },
      {
        id: "tx-4",
        title: "Kapur Dolomit & Dekomposer EM4",
        category: "Kompos & Mulsa",
        type: "biaya",
        amount: 200_000,
        date: "2026-10-20",
      },
      {
        id: "tx-5",
        title: "Perawatan Pintu Sekat Kanal & Tongkat Air",
        category: "Sekat Kanal & Air",
        type: "biaya",
        amount: 100_000,
        date: "2026-10-18",
      },
    ],
    reminders: [
      {
        id: "rem-1",
        title: "Catat kondisi lahan & bebas api harian",
        subtitle: "Jangan lupa pastikan kebun bebas api & puntung rokok hari ini ya!",
        timeOrDate: "16:30",
        kind: "harian",
        enabled: true,
      },
      {
        id: "rem-2",
        title: "Jadwal Balik Mulsa Kompos (Hari ke-10)",
        subtitle: "Saatnya membalik tumpukan serasah agar cepat menjadi kompos subur",
        timeOrDate: "25 Okt 2026",
        kind: "musiman",
        enabled: true,
      },
      {
        id: "rem-3",
        title: "Siaga Cuaca Panas & Kering BMKG",
        subtitle: "Pastikan sekat kanal tertutup rapat & tinggi air gambut tetap ≤ 40 cm",
        timeOrDate: "28 Okt 2026",
        kind: "siaga_asap",
        enabled: true,
      },
    ],
    targets: [
      {
        id: "tgt-1",
        title: "Mesin Pencacah Semak Pribadi",
        subtitle: "Ayo terus kumpulkan penghematan tanpa bakar, alat impianmu pasti tercapai!",
        targetAmount: 8_000_000,
        savedAmount: 5_200_000,
        monthlySaving: 500_000,
        deadline: "Desember 2026",
        icon: "chopper",
      },
      {
        id: "tgt-2",
        title: "Pompa Air & Pipa Siaga Kemarau",
        subtitle: "Cadangan pembasahan lahan gambut saat puncak kemarau El Niño",
        targetAmount: 4_000_000,
        savedAmount: 1_600_000,
        monthlySaving: 300_000,
        deadline: "Maret 2027",
        icon: "pump",
      },
      {
        id: "tgt-3",
        title: "Bibit Unggul & Pupuk Organik Musim Depan",
        subtitle: "Modal tanam mandiri dari hasil penghematan pembukaan lahan tanpa bakar",
        targetAmount: 10_000_000,
        savedAmount: 3_000_000,
        monthlySaving: 700_000,
        deadline: "Juni 2027",
        icon: "seeds",
      },
    ],
    redemptions: [
      {
        id: "red-1",
        title: "Voucher Bibit Penutup Tanah & Dekomposer EM4",
        coinsUsed: 1000,
        rupiahValue: 10_000,
        date: "2026-10-15",
      },
    ],
    scans: [
      {
        id: "scan-1",
        landCondition: "Semak Belukar Gambut Sedang (2,0 Ha)",
        fireRisk: "Aman (Lembap)",
        waterDepthCm: 28,
        estimatedCompostKg: 450,
        estimatedFertilizerSavedRp: 1_500_000,
        recommendation: "Tebas & cacah 10–20 cm, susun di jalur rumpuk, taburkan dolomit.",
        scannedAt: "2026-10-25 14:23",
        exifStripped: true,
      },
    ],
  };
}

const serverSnapshot = createInitialV2State();
let currentState: JagaLahanV2State | null = null;
const listeners = new Set<() => void>();

function loadState(): JagaLahanV2State {
  if (currentState) return currentState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    currentState = raw
      ? { ...createInitialV2State(), ...(JSON.parse(raw) as Partial<JagaLahanV2State>) }
      : createInitialV2State();
  } catch {
    currentState = createInitialV2State();
  }
  return currentState;
}

function saveState(next: JagaLahanV2State) {
  currentState = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* ignore quota errors */
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useV2State(): JagaLahanV2State {
  return useSyncExternalStore(
    subscribe,
    () => (typeof window === "undefined" ? serverSnapshot : loadState()),
    () => serverSnapshot,
  );
}

/* -------------------------------------------------------------------------- */
/* Actions                                                                     */
/* -------------------------------------------------------------------------- */

export function setPlanTier(plan: PlanTier) {
  saveState({ ...loadState(), plan });
}

export function togglePrivacyMask() {
  const s = loadState();
  saveState({ ...s, privacyMask: !s.privacyMask });
}

export function toggleDarkMode() {
  const s = loadState();
  const nextDark = !s.darkMode;
  if (typeof document !== "undefined") {
    document.documentElement.classList.toggle("dark", nextDark);
  }
  saveState({ ...s, darkMode: nextDark });
}

export function updateUserProfile(patch: Partial<Pick<JagaLahanV2State, "userName" | "villageName" | "landAreaHa">>) {
  saveState({ ...loadState(), ...patch });
}

export function addTransaction(tx: Omit<LandTransaction, "id">) {
  const s = loadState();
  const entry: LandTransaction = { ...tx, id: uid("tx") };
  saveState({
    ...s,
    coins: s.coins + 5, // +5 koin untuk pencatatan rutin
    transactions: [entry, ...s.transactions],
  });
}

export function deleteTransaction(id: string) {
  const s = loadState();
  saveState({ ...s, transactions: s.transactions.filter((t) => t.id !== id) });
}

export function performDailyCheckIn(): { ok: boolean; bonusCoins: number; message: string } {
  const s = loadState();
  const today = todayIso();
  if (s.lastCheckInDate === today) {
    return { ok: false, bonusCoins: 0, message: "Kamu sudah Check-in hari ini! Kembali lagi besok ya 🌱" };
  }
  const nextStreak = s.streakDays + 1;
  const milestoneBonus = nextStreak % 7 === 0 ? 25 : 0;
  const earned = 10 + milestoneBonus;
  saveState({
    ...s,
    coins: s.coins + earned,
    streakDays: nextStreak,
    lastCheckInDate: today,
  });
  return {
    ok: true,
    bonusCoins: earned,
    message:
      milestoneBonus > 0
        ? `Check-in Hari ke-${nextStreak} berhasil! +10 Koin + Bonus Streak ${milestoneBonus} Koin!`
        : `Check-in berhasil! Kamu mendapatkan +10 Koin Hijau (Streak ${nextStreak} hari).`,
  };
}

export function redeemCoins(title: string, coinsCost = 1000, rupiahValue = 10_000): boolean {
  const s = loadState();
  if (s.coins < coinsCost) return false;
  saveState({
    ...s,
    coins: s.coins - coinsCost,
    redemptions: [
      { id: uid("red"), title, coinsUsed: coinsCost, rupiahValue, date: todayIso() },
      ...s.redemptions,
    ],
  });
  return true;
}

export function addReminder(rem: Omit<LandReminder, "id" | "enabled">) {
  const s = loadState();
  saveState({
    ...s,
    reminders: [{ ...rem, id: uid("rem"), enabled: true }, ...s.reminders],
  });
}

export function toggleReminder(id: string) {
  const s = loadState();
  saveState({
    ...s,
    reminders: s.reminders.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)),
  });
}

export function deleteReminder(id: string) {
  const s = loadState();
  saveState({ ...s, reminders: s.reminders.filter((r) => r.id !== id) });
}

export function addSavingToTarget(id: string, amount: number) {
  const s = loadState();
  saveState({
    ...s,
    coins: s.coins + 10,
    targets: s.targets.map((t) =>
      t.id === id ? { ...t, savedAmount: Math.min(t.targetAmount, t.savedAmount + amount) } : t,
    ),
  });
}

export function addDreamTarget(target: Omit<DreamTarget, "id">) {
  const s = loadState();
  saveState({
    ...s,
    targets: [{ ...target, id: uid("tgt") }, ...s.targets],
  });
}

export function saveScanResult(scan: Omit<ScanRecord, "id" | "scannedAt" | "exifStripped">) {
  const s = loadState();
  const entry: ScanRecord = {
    ...scan,
    id: uid("scan"),
    scannedAt: new Date().toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    exifStripped: true,
  };
  const autoTx: LandTransaction = {
    id: uid("tx"),
    title: `[Smart Scanner] ${scan.landCondition} — Potensi Kompos ${scan.estimatedCompostKg} Kg`,
    category: "Kompos & Mulsa",
    type: "manfaat",
    amount: scan.estimatedFertilizerSavedRp,
    date: todayIso(),
    note: scan.recommendation,
    fromScanner: true,
  };
  saveState({
    ...s,
    coins: s.coins + 15,
    scans: [entry, ...s.scans],
    transactions: [autoTx, ...s.transactions],
  });
}

export function resetV2Data() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
  saveState(createInitialV2State());
}
