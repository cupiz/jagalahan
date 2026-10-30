"use client";

import { useSyncExternalStore } from "react";
import { todayIso, uid } from "@/lib/utils";
import { getSupabase } from "@/lib/supabase/client";

/**
 * JagaLahan Store — Penyimpanan interaktif (Offline-First + Supabase Sync) untuk:
 * 1. Autentikasi & Peran Pengguna (Petani, Pengurus Kelompok Tani, Penyuluh MPA)
 * 2. Tracking Lahan Tanpa Bakar (Manfaat & Biaya Kelola) + Unduh Laporan PDF
 * 3. Smart Land & Smoke Scanner (AI Kamera Pemindai Lahan/Semak/Asap)
 * 4. Check-in Harian Bebas Api, Streak, & JagaLahan Benih Hijau (Reward Edukatif Saprotan)
 * 5. Pengingat Siaga Karhutla & Jadwal Lahan
 * 6. Tabungan Alat Kebun (Goal Setting Celengan Tani & Progress Bar)
 * 7. Level Pengguna & Paket Langganan (Perintis Lahan Trial 30 Hari, Tani Mandiri, Poktan Cerdas)
 */

export type PlanTier = "trial" | "pro" | "vip";
export type UserRole = "petani" | "kelompok_tani" | "penyuluh" | "admin";
export type TxType = "manfaat" | "biaya";
export type TxCategory =
  | "Kompos & Mulsa"
  | "Hemat Pupuk"
  | "Tebas & Cacah"
  | "Bantuan & Insentif"
  | "Sekat Kanal & Air"
  | "Lainnya";

export const ROLE_LABELS: Record<UserRole, string> = {
  petani: "Petani / Pekebun",
  kelompok_tani: "Pengurus Kelompok Tani",
  penyuluh: "Penyuluh / Relawan MPA",
  admin: "Super Admin (Administrator)",
};

export const PLAN_LABELS: Record<PlanTier, string> = {
  trial: "Perintis Lahan (Trial 30 Hari)",
  pro: "Paket Tani Mandiri (Rp10.999/bln)",
  vip: "Paket Poktan Cerdas (AI) (Rp19.000/bln)",
};

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  villageName: string;
  landAreaHa: number;
  plan: PlanTier;
  coins: number;
  streakDays: number;
  status: "Aktif" | "Nonaktif";
  joinedAt: string;
}

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
  isAuthenticated: boolean;
  userName: string;
  userEmail: string;
  userRole: UserRole;
  villageName: string;
  landAreaHa: number;
  plan: PlanTier;
  privacyMask: boolean;
  darkMode: boolean;
  coins: number;
  streakDays: number;
  lastCheckInDate: string | null;
  managedUsers: ManagedUser[];
  transactions: LandTransaction[];
  reminders: LandReminder[];
  targets: DreamTarget[];
  redemptions: RewardRedemption[];
  scans: ScanRecord[];
}

const STORAGE_KEY = "jagalahan:state";
/** Sesi login disimpan terpisah dari data lahan agar default-nya selalu "belum login". */
const SESSION_KEY = "jagalahan:session";

export function createInitialV2State(): JagaLahanV2State {
  return {
    isAuthenticated: false,
    userName: "Iqbal",
    userEmail: "iqbal@jagalahan.web.id",
    userRole: "petani",
    villageName: "Desa Kalampangan, Palangka Raya",
    landAreaHa: 2.0,
    plan: "vip",
    privacyMask: false,
    darkMode: false,
    coins: 680,
    streakDays: 9,
    lastCheckInDate: null,
    managedUsers: [
      {
        id: "usr-admin",
        name: "Super Admin JagaLahan",
        email: "admin@jagalahan.web.id",
        role: "admin",
        villageName: "Pusat Komando Karhutla Kalteng",
        landAreaHa: 50.0,
        plan: "vip",
        coins: 5000,
        streakDays: 30,
        status: "Aktif",
        joinedAt: "2026-10-01",
      },
      {
        id: "usr-1",
        name: "Iqbal",
        email: "iqbal@jagalahan.web.id",
        role: "petani",
        villageName: "Desa Kalampangan, Palangka Raya",
        landAreaHa: 2.0,
        plan: "vip",
        coins: 680,
        streakDays: 9,
        status: "Aktif",
        joinedAt: "2026-10-10",
      },
      {
        id: "usr-2",
        name: "Pak Hendra",
        email: "hendra.poktan@jagalahan.web.id",
        role: "kelompok_tani",
        villageName: "Koperasi Tani Sabangau Hijau",
        landAreaHa: 15.0,
        plan: "pro",
        coins: 1850,
        streakDays: 18,
        status: "Aktif",
        joinedAt: "2026-10-12",
      },
      {
        id: "usr-3",
        name: "Budi Santoso",
        email: "budi.tani@jagalahan.web.id",
        role: "petani",
        villageName: "Desa Tumbang Nusa, Pulang Pisau",
        landAreaHa: 1.5,
        plan: "trial",
        coins: 195,
        streakDays: 4,
        status: "Aktif",
        joinedAt: "2026-10-18",
      },
      {
        id: "usr-4",
        name: "Siti Aminah",
        email: "siti.mpa@jagalahan.web.id",
        role: "penyuluh",
        villageName: "Posko MPA Gohong, Pulang Pisau",
        landAreaHa: 8.5,
        plan: "vip",
        coins: 1120,
        streakDays: 15,
        status: "Aktif",
        joinedAt: "2026-10-14",
      },
    ],
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
        subtitle: "Ayo terus kumpulkan penghematan tanpa bakar, alat kebun idamanmu segera terbeli!",
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
        title: "Voucher Subsidi Dekomposer Hayati EM4 1 Liter",
        coinsUsed: 450,
        rupiahValue: 18_000,
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
    const base = raw
      ? { ...createInitialV2State(), ...(JSON.parse(raw) as Partial<JagaLahanV2State>) }
      : createInitialV2State();
    currentState = { ...base, isAuthenticated: window.localStorage.getItem(SESSION_KEY) === "1" };
  } catch {
    currentState = createInitialV2State();
  }
  return currentState;
}

function saveState(next: JagaLahanV2State) {
  currentState = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    if (next.isAuthenticated) window.localStorage.setItem(SESSION_KEY, "1");
    else window.localStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore quota errors */
  }
  listeners.forEach((l) => l());
}

const noopSubscribe = () => () => {};

/** `false` saat SSR/hidrasi, `true` setelah berjalan di browser (state localStorage sudah terbaca). */
export function useHydrated(): boolean {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
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
/* Auth & Role Actions                                                         */
/* -------------------------------------------------------------------------- */

export async function loginUser(params: {
  email: string;
  password?: string;
  name?: string;
  role?: UserRole;
  plan?: PlanTier;
  villageName?: string;
  landAreaHa?: number;
}) {
  const sb = getSupabase();
  if (sb && params.password) {
    try {
      await sb.auth.signInWithPassword({
        email: params.email,
        password: params.password,
      });
    } catch {
      /* fallback ke sesi lokal jika belum terdaftar di cloud */
    }
  }
  const s = loadState();
  const isEmailAdmin = params.email.toLowerCase().includes("admin");
  const matchedUser = s.managedUsers.find(
    (u) => u.email.toLowerCase() === params.email.trim().toLowerCase(),
  );
  const inferredName =
    params.name ||
    matchedUser?.name ||
    (isEmailAdmin ? "Super Admin JagaLahan" : "") ||
    params.email
      .split("@")[0]
      .replace(/[._-]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()) ||
    "Iqbal";
  const resolvedRole: UserRole =
    params.role ?? matchedUser?.role ?? (isEmailAdmin ? "admin" : s.userRole);
  const resolvedPlan: PlanTier =
    params.plan ?? matchedUser?.plan ?? (isEmailAdmin ? "vip" : s.plan);

  saveState({
    ...s,
    isAuthenticated: true,
    userEmail: params.email,
    userName: inferredName,
    userRole: resolvedRole,
    plan: resolvedPlan,
    villageName: params.villageName ?? matchedUser?.villageName ?? s.villageName,
    landAreaHa: params.landAreaHa ?? matchedUser?.landAreaHa ?? s.landAreaHa,
    coins: matchedUser?.coins ?? s.coins,
    streakDays: matchedUser?.streakDays ?? s.streakDays,
  });
}

export async function registerUser(params: {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  villageName: string;
  landAreaHa: number;
  plan?: PlanTier;
}) {
  const sb = getSupabase();
  if (sb && params.password) {
    try {
      await sb.auth.signUp({
        email: params.email,
        password: params.password,
        options: {
          data: {
            display_name: params.name,
            role: params.role,
            village_name: params.villageName,
            land_area_ha: params.landAreaHa,
          },
        },
      });
    } catch {
      /* fallback ke penyimpanan lokal */
    }
  }
  const s = loadState();
  const cleanName = params.name.trim() || "Petani JagaLahan";
  const cleanEmail = params.email.trim() || "petani@jagalahan.web.id";
  const cleanVillage = params.villageName.trim() || "Desa Kalampangan, Palangka Raya";
  const cleanArea = params.landAreaHa || 2.0;
  const cleanPlan = params.plan ?? "trial";

  const exists = s.managedUsers.some((u) => u.email.toLowerCase() === cleanEmail.toLowerCase());
  const nextUsers: ManagedUser[] = exists
    ? s.managedUsers
    : [
        {
          id: uid("usr"),
          name: cleanName,
          email: cleanEmail,
          role: params.role,
          villageName: cleanVillage,
          landAreaHa: cleanArea,
          plan: cleanPlan,
          coins: 100,
          streakDays: 1,
          status: "Aktif",
          joinedAt: todayIso(),
        },
        ...s.managedUsers,
      ];

  saveState({
    ...s,
    isAuthenticated: true,
    userName: cleanName,
    userEmail: cleanEmail,
    userRole: params.role,
    villageName: cleanVillage,
    landAreaHa: cleanArea,
    plan: cleanPlan,
    managedUsers: nextUsers,
  });
}

export async function logoutUser() {
  const sb = getSupabase();
  if (sb) {
    try {
      await sb.auth.signOut();
    } catch {
      /* ignore */
    }
  }
  const s = loadState();
  saveState({
    ...s,
    isAuthenticated: false,
  });
}

export function setPlanTier(plan: PlanTier) {
  saveState({ ...loadState(), plan });
}

export function setUserRole(userRole: UserRole) {
  saveState({ ...loadState(), userRole });
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

export function updateUserProfile(
  patch: Partial<Pick<JagaLahanV2State, "userName" | "userEmail" | "userRole" | "villageName" | "landAreaHa">>,
) {
  saveState({ ...loadState(), ...patch });
}

export function addTransaction(tx: Omit<LandTransaction, "id">) {
  const s = loadState();
  const entry: LandTransaction = { ...tx, id: uid("tx") };
  saveState({
    ...s,
    coins: s.coins + 10,
    transactions: [entry, ...s.transactions],
  });
}

export function deleteTransaction(id: string) {
  const s = loadState();
  saveState({ ...s, transactions: s.transactions.filter((t) => t.id !== id) });
}

export function updateTransaction(id: string, patch: Partial<Omit<LandTransaction, "id">>) {
  const s = loadState();
  saveState({
    ...s,
    transactions: s.transactions.map((t) => (t.id === id ? { ...t, ...patch } : t)),
  });
}

export function performDailyCheckIn(): { ok: boolean; bonusCoins: number; message: string } {
  const s = loadState();
  const today = todayIso();
  if (s.lastCheckInDate === today) {
    return { ok: false, bonusCoins: 0, message: "Kamu sudah Check-in hari ini! Kembali lagi besok ya." };
  }
  const nextStreak = s.streakDays + 1;
  const milestoneBonus = nextStreak % 7 === 0 ? 50 : 0;
  const earned = 15 + milestoneBonus;
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
        ? `Check-in Hari ke-${nextStreak} berhasil! +15 Benih Hijau + Bonus Konsistensi ${milestoneBonus} Benih!`
        : `Check-in berhasil! Kamu mendapatkan +15 Benih Hijau (Streak ${nextStreak} hari bebas api).`,
  };
}

export function redeemCoins(title: string, coinsCost = 450, rupiahValue = 18_000): boolean {
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

export function addRedemption(entry: Omit<RewardRedemption, "id">) {
  const s = loadState();
  saveState({
    ...s,
    redemptions: [{ ...entry, id: uid("red") }, ...s.redemptions],
  });
}

export function updateRedemption(id: string, patch: Partial<Omit<RewardRedemption, "id">>) {
  const s = loadState();
  saveState({
    ...s,
    redemptions: s.redemptions.map((r) => (r.id === id ? { ...r, ...patch } : r)),
  });
}

export function deleteRedemption(id: string) {
  const s = loadState();
  saveState({
    ...s,
    redemptions: s.redemptions.filter((r) => r.id !== id),
  });
}

export function addReminder(rem: Omit<LandReminder, "id" | "enabled">) {
  const s = loadState();
  saveState({
    ...s,
    reminders: [{ ...rem, id: uid("rem"), enabled: true }, ...s.reminders],
  });
}

export function updateReminder(id: string, patch: Partial<Omit<LandReminder, "id">>) {
  const s = loadState();
  saveState({
    ...s,
    reminders: s.reminders.map((r) => (r.id === id ? { ...r, ...patch } : r)),
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
    coins: s.coins + 20,
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

export function updateDreamTarget(id: string, patch: Partial<Omit<DreamTarget, "id">>) {
  const s = loadState();
  saveState({
    ...s,
    targets: s.targets.map((t) => (t.id === id ? { ...t, ...patch } : t)),
  });
}

export function deleteDreamTarget(id: string) {
  const s = loadState();
  saveState({
    ...s,
    targets: s.targets.filter((t) => t.id !== id),
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
    coins: s.coins + 35,
    scans: [entry, ...s.scans],
    transactions: [autoTx, ...s.transactions],
  });
}

export function updateScanRecord(id: string, patch: Partial<Omit<ScanRecord, "id" | "exifStripped">>) {
  const s = loadState();
  saveState({
    ...s,
    scans: s.scans.map((sc) => (sc.id === id ? { ...sc, ...patch } : sc)),
  });
}

export function deleteScanRecord(id: string) {
  const s = loadState();
  saveState({
    ...s,
    scans: s.scans.filter((sc) => sc.id !== id),
  });
}

/* -------------------------------------------------------------------------- */
/* Super Admin Actions (Manajemen Pengguna, Saldo Koin & Impersonasi)          */
/* -------------------------------------------------------------------------- */

export function addManagedUser(user: Omit<ManagedUser, "id">) {
  const s = loadState();
  saveState({
    ...s,
    managedUsers: [{ ...user, id: uid("usr") }, ...s.managedUsers],
  });
}

export function updateManagedUser(id: string, patch: Partial<Omit<ManagedUser, "id">>) {
  const s = loadState();
  const updatedList = s.managedUsers.map((u) => (u.id === id ? { ...u, ...patch } : u));
  const target = updatedList.find((u) => u.id === id);
  const isCurrentUser =
    target && target.email.toLowerCase() === s.userEmail.toLowerCase();

  saveState({
    ...s,
    managedUsers: updatedList,
    ...(isCurrentUser && target
      ? {
          userName: target.name,
          userEmail: target.email,
          userRole: target.role,
          villageName: target.villageName,
          landAreaHa: target.landAreaHa,
          plan: target.plan,
          coins: target.coins,
          streakDays: target.streakDays,
        }
      : {}),
  });
}

export function deleteManagedUser(id: string) {
  const s = loadState();
  saveState({
    ...s,
    managedUsers: s.managedUsers.filter((u) => u.id !== id),
  });
}

export function impersonateManagedUser(id: string) {
  const s = loadState();
  const target = s.managedUsers.find((u) => u.id === id);
  if (!target) return;
  saveState({
    ...s,
    isAuthenticated: true,
    userName: target.name,
    userEmail: target.email,
    userRole: target.role,
    villageName: target.villageName,
    landAreaHa: target.landAreaHa,
    plan: target.plan,
    coins: target.coins,
    streakDays: target.streakDays,
  });
}

export function adminSetCoinsAndStreak(params: { coins: number; streakDays: number }) {
  const s = loadState();
  const nextCoins = Math.max(0, Math.round(params.coins));
  const nextStreak = Math.max(0, Math.round(params.streakDays));
  saveState({
    ...s,
    coins: nextCoins,
    streakDays: nextStreak,
    managedUsers: s.managedUsers.map((u) =>
      u.email.toLowerCase() === s.userEmail.toLowerCase()
        ? { ...u, coins: nextCoins, streakDays: nextStreak }
        : u,
    ),
  });
}

export function resetV2Data() {
  const wasAuthenticated = loadState().isAuthenticated;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
  saveState({ ...createInitialV2State(), isAuthenticated: wasAuthenticated });
}
