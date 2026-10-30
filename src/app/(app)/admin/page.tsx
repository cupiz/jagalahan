"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ShieldAlert,
  Users,
  FileSpreadsheet,
  Camera,
  Target,
  Bell,
  Coins,
  Database,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  UserCheck,
  RefreshCw,
  Download,
  RotateCcw,
  Search,
  Sparkles,
  Crown,
} from "lucide-react";
import {
  useV2State,
  setUserRole,
  setPlanTier,
  ROLE_LABELS,
  PLAN_LABELS,
  addManagedUser,
  updateManagedUser,
  deleteManagedUser,
  impersonateManagedUser,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  saveScanResult,
  updateScanRecord,
  deleteScanRecord,
  addDreamTarget,
  updateDreamTarget,
  deleteDreamTarget,
  addReminder,
  updateReminder,
  toggleReminder,
  deleteReminder,
  addRedemption,
  updateRedemption,
  deleteRedemption,
  adminSetCoinsAndStreak,
  resetV2Data,
  type ManagedUser,
  type UserRole,
  type PlanTier,
  type LandTransaction,
  type TxCategory,
  type TxType,
  type ScanRecord,
  type DreamTarget,
  type LandReminder,
  type RewardRedemption,
} from "@/lib/store";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { formatNumber, formatRupiah, todayIso } from "@/lib/utils";

type AdminTab = "users" | "transactions" | "scans" | "targets" | "reminders" | "cloud";

const TX_CATEGORIES: TxCategory[] = [
  "Kompos & Mulsa",
  "Hemat Pupuk",
  "Tebas & Cacah",
  "Bantuan & Insentif",
  "Sekat Kanal & Air",
  "Lainnya",
];

export default function SuperAdminPage() {
  const state = useV2State();
  const [activeTab, setActiveTab] = useState<AdminTab>("users");
  const [toast, setToast] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  /* ------------------------------------------------------------------------ */
  /* 1. State Modal Edit / Tambah Pengguna (ManagedUser)                       */
  /* ------------------------------------------------------------------------ */
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [uName, setUName] = useState("");
  const [uEmail, setUEmail] = useState("");
  const [uRole, setURole] = useState<UserRole>("petani");
  const [uVillage, setUVillage] = useState("");
  const [uArea, setUArea] = useState("2.0");
  const [uPlan, setUPlan] = useState<PlanTier>("vip");
  const [uCoins, setUCoins] = useState("1000");
  const [uStreak, setUStreak] = useState("7");
  const [uStatus, setUStatus] = useState<"Aktif" | "Nonaktif">("Aktif");

  const openAddUser = () => {
    setEditingUserId(null);
    setUName("");
    setUEmail("");
    setURole("petani");
    setUVillage("Desa Kalampangan, Palangka Raya");
    setUArea("2.0");
    setUPlan("trial");
    setUCoins("500");
    setUStreak("1");
    setUStatus("Aktif");
    setUserModalOpen(true);
  };

  const openEditUser = (u: ManagedUser) => {
    setEditingUserId(u.id);
    setUName(u.name);
    setUEmail(u.email);
    setURole(u.role);
    setUVillage(u.villageName);
    setUArea(String(u.landAreaHa));
    setUPlan(u.plan);
    setUCoins(String(u.coins));
    setUStreak(String(u.streakDays));
    setUStatus(u.status);
    setUserModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: uName.trim() || "Pengguna JagaLahan",
      email: uEmail.trim() || "user@jagalahan.web.id",
      role: uRole,
      villageName: uVillage.trim() || "Desa Kalampangan",
      landAreaHa: Math.max(0.5, Number(uArea) || 1.0),
      plan: uPlan,
      coins: Math.max(0, Number(uCoins) || 0),
      streakDays: Math.max(0, Number(uStreak) || 0),
      status: uStatus,
      joinedAt: todayIso(),
    };
    if (editingUserId) {
      updateManagedUser(editingUserId, payload);
      notify(`Data pengguna "${payload.name}" berhasil diperbarui!`);
    } else {
      addManagedUser(payload);
      notify(`Pengguna baru "${payload.name}" berhasil ditambahkan!`);
    }
    setUserModalOpen(false);
  };

  /* ------------------------------------------------------------------------ */
  /* 2. State Modal Edit / Tambah Transaksi Lahan                              */
  /* ------------------------------------------------------------------------ */
  const [txModalOpen, setTxModalOpen] = useState(false);
  const [editingTxId, setEditingTxId] = useState<string | null>(null);
  const [tTitle, setTTitle] = useState("");
  const [tCategory, setTCategory] = useState<TxCategory>("Kompos & Mulsa");
  const [tType, setTType] = useState<TxType>("manfaat");
  const [tAmount, setTAmount] = useState("500000");
  const [tDate, setTDate] = useState(todayIso());
  const [tNote, setTNote] = useState("");

  const openAddTx = () => {
    setEditingTxId(null);
    setTTitle("");
    setTCategory("Kompos & Mulsa");
    setTType("manfaat");
    setTAmount("500000");
    setTDate(todayIso());
    setTNote("");
    setTxModalOpen(true);
  };

  const openEditTx = (tx: LandTransaction) => {
    setEditingTxId(tx.id);
    setTTitle(tx.title);
    setTCategory(tx.category);
    setTType(tx.type);
    setTAmount(String(tx.amount));
    setTDate(tx.date);
    setTNote(tx.note ?? "");
    setTxModalOpen(true);
  };

  const handleSaveTx = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: tTitle.trim() || "Catatan Lahan",
      category: tCategory,
      type: tType,
      amount: Math.max(0, Number(tAmount) || 0),
      date: tDate || todayIso(),
      note: tNote.trim() || undefined,
    };
    if (editingTxId) {
      updateTransaction(editingTxId, payload);
      notify(`Transaksi "${payload.title}" berhasil diperbarui!`);
    } else {
      addTransaction(payload);
      notify(`Transaksi baru "${payload.title}" berhasil ditambahkan!`);
    }
    setTxModalOpen(false);
  };

  /* ------------------------------------------------------------------------ */
  /* 3. State Modal Edit / Tambah Rekaman Smart Scanner AI                     */
  /* ------------------------------------------------------------------------ */
  const [scanModalOpen, setScanModalOpen] = useState(false);
  const [editingScanId, setEditingScanId] = useState<string | null>(null);
  const [sCond, setSCond] = useState("");
  const [sRisk, setSRisk] = useState<ScanRecord["fireRisk"]>("Aman (Lembap)");
  const [sWater, setSWater] = useState("28");
  const [sCompost, setSCompost] = useState("450");
  const [sSavedRp, setSSavedRp] = useState("1500000");
  const [sRec, setSRec] = useState("");

  const openAddScan = () => {
    setEditingScanId(null);
    setSCond("Semak Gambut Lembap Terkelola (2,0 Ha)");
    setSRisk("Aman (Lembap)");
    setSWater("30");
    setSCompost("400");
    setSSavedRp("1200000");
    setSRec("Tebas & cacah 15 cm, aplikasikan dekomposer EM4 di jalur tanam.");
    setScanModalOpen(true);
  };

  const openEditScan = (sc: ScanRecord) => {
    setEditingScanId(sc.id);
    setSCond(sc.landCondition);
    setSRisk(sc.fireRisk);
    setSWater(String(sc.waterDepthCm));
    setSCompost(String(sc.estimatedCompostKg));
    setSSavedRp(String(sc.estimatedFertilizerSavedRp));
    setSRec(sc.recommendation);
    setScanModalOpen(true);
  };

  const handleSaveScan = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      landCondition: sCond.trim() || "Lahan Gambut",
      fireRisk: sRisk,
      waterDepthCm: Number(sWater) || 25,
      estimatedCompostKg: Number(sCompost) || 300,
      estimatedFertilizerSavedRp: Number(sSavedRp) || 1_000_000,
      recommendation: sRec.trim() || "Jaga kelembapan gambut & kelola tanpa bakar.",
    };
    if (editingScanId) {
      updateScanRecord(editingScanId, payload);
      notify("Data hasil pemindaian AI berhasil diperbarui!");
    } else {
      saveScanResult(payload);
      notify("Rekaman pemindaian AI baru berhasil ditambahkan!");
    }
    setScanModalOpen(false);
  };

  /* ------------------------------------------------------------------------ */
  /* 4. State Modal Edit / Tambah Target Lahan Impian                          */
  /* ------------------------------------------------------------------------ */
  const [targetModalOpen, setTargetModalOpen] = useState(false);
  const [editingTargetId, setEditingTargetId] = useState<string | null>(null);
  const [gTitle, setGTitle] = useState("");
  const [gSub, setGSub] = useState("");
  const [gTargetRp, setGTargetRp] = useState("8000000");
  const [gSavedRp, setGSavedRp] = useState("4000000");
  const [gMonthlyRp, setGMonthlyRp] = useState("500000");
  const [gDeadline, setGDeadline] = useState("Desember 2026");
  const [gIcon, setGIcon] = useState<DreamTarget["icon"]>("chopper");

  const openAddTarget = () => {
    setEditingTargetId(null);
    setGTitle("");
    setGSub("Tabungan kolektif dari penghematan pembukaan lahan tanpa bakar");
    setGTargetRp("5000000");
    setGSavedRp("1000000");
    setGMonthlyRp("500000");
    setGDeadline("Agustus 2027");
    setGIcon("chopper");
    setTargetModalOpen(true);
  };

  const openEditTarget = (tgt: DreamTarget) => {
    setEditingTargetId(tgt.id);
    setGTitle(tgt.title);
    setGSub(tgt.subtitle);
    setGTargetRp(String(tgt.targetAmount));
    setGSavedRp(String(tgt.savedAmount));
    setGMonthlyRp(String(tgt.monthlySaving));
    setGDeadline(tgt.deadline);
    setGIcon(tgt.icon);
    setTargetModalOpen(true);
  };

  const handleSaveTarget = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: gTitle.trim() || "Alat Pertanian Tanpa Bakar",
      subtitle: gSub.trim() || "Target penghematan lahan",
      targetAmount: Math.max(100_000, Number(gTargetRp) || 1_000_000),
      savedAmount: Math.max(0, Number(gSavedRp) || 0),
      monthlySaving: Math.max(0, Number(gMonthlyRp) || 0),
      deadline: gDeadline.trim() || "2027",
      icon: gIcon,
    };
    if (editingTargetId) {
      updateDreamTarget(editingTargetId, payload);
      notify(`Target "${payload.title}" berhasil diperbarui!`);
    } else {
      addDreamTarget(payload);
      notify(`Target baru "${payload.title}" berhasil ditambahkan!`);
    }
    setTargetModalOpen(false);
  };

  /* ------------------------------------------------------------------------ */
  /* 5. State Modal Edit / Tambah Pengingat & Koin                             */
  /* ------------------------------------------------------------------------ */
  const [remModalOpen, setRemModalOpen] = useState(false);
  const [editingRemId, setEditingRemId] = useState<string | null>(null);
  const [rTitle, setRTitle] = useState("");
  const [rSub, setRSub] = useState("");
  const [rTime, setRTime] = useState("16:30");
  const [rKind, setRKind] = useState<LandReminder["kind"]>("harian");

  const [redModalOpen, setRedModalOpen] = useState(false);
  const [editingRedId, setEditingRedId] = useState<string | null>(null);
  const [vTitle, setVTitle] = useState("");
  const [vCoins, setVCoins] = useState("1000");
  const [vRp, setVRp] = useState("10000");
  const [vDate, setVDate] = useState(todayIso());

  const [quickCoins, setQuickCoins] = useState(String(state.coins));
  const [quickStreak, setQuickStreak] = useState(String(state.streakDays));

  useEffect(() => {
    setQuickCoins(String(state.coins));
    setQuickStreak(String(state.streakDays));
  }, [state.coins, state.streakDays]);

  const openAddRem = () => {
    setEditingRemId(null);
    setRTitle("");
    setRSub("Pastikan sekat kanal & kebun aman dari potensi api.");
    setRTime("08:00");
    setRKind("harian");
    setRemModalOpen(true);
  };

  const openEditRem = (r: LandReminder) => {
    setEditingRemId(r.id);
    setRTitle(r.title);
    setRSub(r.subtitle);
    setRTime(r.timeOrDate);
    setRKind(r.kind);
    setRemModalOpen(true);
  };

  const handleSaveRem = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: rTitle.trim() || "Pengingat Siaga Lahan",
      subtitle: rSub.trim() || "Cek kondisi kebun harian",
      timeOrDate: rTime.trim() || "16:00",
      kind: rKind,
    };
    if (editingRemId) {
      updateReminder(editingRemId, payload);
      notify(`Pengingat "${payload.title}" berhasil diperbarui!`);
    } else {
      addReminder(payload);
      notify(`Pengingat baru "${payload.title}" berhasil ditambahkan!`);
    }
    setRemModalOpen(false);
  };

  const openAddRed = () => {
    setEditingRedId(null);
    setVTitle("Voucher Dekomposer EM4 & Dolomit 10 Kg");
    setVCoins("1000");
    setVRp("10000");
    setVDate(todayIso());
    setRedModalOpen(true);
  };

  const openEditRed = (red: RewardRedemption) => {
    setEditingRedId(red.id);
    setVTitle(red.title);
    setVCoins(String(red.coinsUsed));
    setVRp(String(red.rupiahValue));
    setVDate(red.date);
    setRedModalOpen(true);
  };

  const handleSaveRed = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: vTitle.trim() || "Voucher Pertanian Organik",
      coinsUsed: Math.max(100, Number(vCoins) || 1000),
      rupiahValue: Math.max(1000, Number(vRp) || 10_000),
      date: vDate || todayIso(),
    };
    if (editingRedId) {
      updateRedemption(editingRedId, payload);
      notify(`Riwayat voucher "${payload.title}" berhasil diperbarui!`);
    } else {
      addRedemption(payload);
      notify(`Riwayat voucher "${payload.title}" berhasil ditambahkan!`);
    }
    setRedModalOpen(false);
  };

  /* ------------------------------------------------------------------------ */
  /* 6. Supabase Cloud Live Inspector                                          */
  /* ------------------------------------------------------------------------ */
  const [cloudLoading, setCloudLoading] = useState(false);
  const [cloudCounts, setCloudCounts] = useState<Record<string, number>>({});
  const [cloudProfiles, setCloudProfiles] = useState<Record<string, unknown>[]>([]);

  const fetchCloudStatus = useCallback(async () => {
    const sb = getSupabase();
    if (!sb) return;
    setCloudLoading(true);
    try {
      const tables = [
        "v2_user_profiles",
        "v2_land_transactions",
        "v2_smart_scans",
        "v2_reminders",
        "v2_dream_targets",
        "v2_reward_redemptions",
      ];
      const counts: Record<string, number> = {};
      await Promise.all(
        tables.map(async (t) => {
          const { count } = await sb.from(t).select("*", { count: "exact", head: true });
          counts[t] = count ?? 0;
        }),
      );
      const { data: profs } = await sb.from("v2_user_profiles").select("*").limit(10);
      setCloudCounts(counts);
      setCloudProfiles(profs ?? []);
    } catch {
      /* ignore network errors */
    } finally {
      setCloudLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "cloud") {
      fetchCloudStatus();
    }
  }, [activeTab, fetchCloudStatus]);

  /* ------------------------------------------------------------------------ */
  /* Kalkulasi Ringkasan Ekosistem                                             */
  /* ------------------------------------------------------------------------ */
  const totalLandHa = state.managedUsers.reduce((acc, u) => acc + Number(u.landAreaHa || 0), 0);
  const totalCoinsAll = state.managedUsers.reduce((acc, u) => acc + Number(u.coins || 0), 0);
  const totalManfaat = state.transactions
    .filter((t) => t.type === "manfaat")
    .reduce((acc, t) => acc + t.amount, 0);
  const totalBiaya = state.transactions
    .filter((t) => t.type === "biaya")
    .reduce((acc, t) => acc + t.amount, 0);
  const netBenefit = totalManfaat - totalBiaya;

  const filteredUsers = state.managedUsers.filter((u) => {
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    const q = searchQuery.toLowerCase();
    const matchQuery =
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.villageName.toLowerCase().includes(q);
    return matchRole && matchQuery;
  });

  const handleExportAllJson = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `jagalahan-superadmin-dump-${todayIso()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    notify("Seluruh database aplikasi berhasil diekspor ke JSON!");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-20 right-4 z-50 flex items-center gap-2.5 rounded-2xl bg-slate-900 px-4 py-3 text-xs font-extrabold text-white shadow-xl ring-1 ring-emerald-500/40 md:bottom-6">
          <Sparkles className="h-4 w-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Banner Peringatan Jika Belum Berstatus Role Admin */}
      {state.userRole !== "admin" && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-amber-950">
          <div className="flex items-center gap-3">
            <ShieldAlert className="h-5 w-5 shrink-0 text-amber-600" />
            <div className="text-xs">
              <p className="font-extrabold">
                Anda sedang mengakses halaman ini dengan role: {ROLE_LABELS[state.userRole]}
              </p>
              <p className="text-amber-800">
                Aktifkan role <strong>Super Admin (Administrator)</strong> untuk mendapatkan hak penuh
                mengedit seluruh data aplikasi.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setUserRole("admin");
              setPlanTier("vip");
              notify("Role Super Admin (Full Access) berhasil diaktifkan!");
            }}
            className="rounded-xl bg-amber-600 px-4 py-2 text-xs font-extrabold text-white shadow-xs hover:bg-amber-700 cursor-pointer"
          >
            Aktifkan Role Super Admin Sekarang
          </button>
        </div>
      )}

      {/* Header Super Admin Command Center */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 via-emerald-900 to-emerald-700 text-white shadow-md">
              <ShieldAlert className="h-7 w-7 text-emerald-300" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-emerald-100 px-3 py-0.5 font-mono text-[10px] font-extrabold uppercase tracking-wider text-emerald-800">
                  SUPER ADMIN PANEL • FULL CRUD ACCESS
                </span>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-mono text-[10px] font-bold text-slate-700">
                  {state.userEmail}
                </span>
              </div>
              <h1 className="mt-1.5 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                Pusat Kendali Data & Pengguna JagaLahan
              </h1>
              <p className="mt-0.5 text-xs font-medium text-slate-500 sm:text-sm">
                Lihat, tambah, edit, dan hapus seluruh data pengguna, transaksi lahan, hasil scan AI,
                target alat, pengingat, hingga sinkronisasi database cloud.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleExportAllJson}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-extrabold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              <Download className="h-4 w-4 text-emerald-600" />
              Dump JSON
            </button>
            <button
              type="button"
              onClick={() => {
                resetV2Data();
                setUserRole("admin");
                notify("Seluruh data aplikasi dikembalikan ke setelan awal (Default Seed)!");
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-extrabold text-rose-700 hover:bg-rose-100 cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Default
            </button>
          </div>
        </div>

        {/* 4 Global KPI Cards */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>TOTAL PENGGUNA & LAHAN</span>
              <Users className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="mt-1.5 text-2xl font-black text-slate-900">
              {state.managedUsers.length} Akun
            </p>
            <p className="mt-0.5 text-xs font-semibold text-emerald-700">
              Total {formatNumber(totalLandHa)} Ha Lahan Bebas Api
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>TRANSAKSI & MANFAAT BERSIH</span>
              <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="mt-1.5 text-2xl font-black text-emerald-700">
              {formatRupiah(netBenefit)}
            </p>
            <p className="mt-0.5 text-xs font-semibold text-slate-600">
              {state.transactions.length} Catatan Manfaat & Biaya
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>SMART SCAN AI & TARGET</span>
              <Camera className="h-4 w-4 text-indigo-600" />
            </div>
            <p className="mt-1.5 text-2xl font-black text-slate-900">
              {state.scans.length} Scan • {state.targets.length} Target
            </p>
            <p className="mt-0.5 text-xs font-semibold text-indigo-700">
              EXIF GPS Stripped (UU PDP)
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>BENIH HIJAU & PENGINGAT</span>
              <Coins className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="mt-1.5 text-2xl font-black text-emerald-700">
              {formatNumber(totalCoinsAll, 0)} Benih
            </p>
            <p className="mt-0.5 text-xs font-semibold text-slate-600">
              {state.reminders.length} Pengingat • {state.redemptions.length} Penukaran
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xs">
        {(
          [
            ["users", "1. Data Pengguna & Role", Users, state.managedUsers.length],
            ["transactions", "2. Data Transaksi Lahan", FileSpreadsheet, state.transactions.length],
            ["scans", "3. Data Smart Scanner AI", Camera, state.scans.length],
            ["targets", "4. Data Target Impian", Target, state.targets.length],
            ["reminders", "5. Pengingat & Benih Hijau", Bell, state.reminders.length + state.redemptions.length],
            ["cloud", "6. Database Cloud Supabase", Database, 6],
          ] as [AdminTab, string, React.ElementType, number][]
        ).map(([tabKey, label, Icon, count]) => {
          const active = activeTab === tabKey;
          return (
            <button
              key={tabKey}
              type="button"
              onClick={() => setActiveTab(tabKey)}
              className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-extrabold transition cursor-pointer ${
                active
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
              <span
                className={`rounded-md px-1.5 py-0.5 text-[10px] font-black ${
                  active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* =====================================================================
          TAB 1: MANAJEMEN PENGGUNA & ROLE (FULL CRUD + IMPERSONATE)
         ===================================================================== */}
      {activeTab === "users" && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                Manajemen Pengguna, Role & Paket Langganan
              </h2>
              <p className="text-xs text-slate-500">
                Super Admin dapat mengubah role, paket edukatif (Perintis Lahan / Tani Mandiri / Poktan Cerdas), luas lahan, saldo Benih Hijau, atau
                masuk sebagai pengguna tertentu.
              </p>
            </div>
            <button
              type="button"
              onClick={openAddUser}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-extrabold text-white shadow-xs hover:bg-emerald-700 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Tambah Pengguna Baru
            </button>
          </div>

          {/* Filter & Search Bar */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
            <div className="relative sm:col-span-7">
              <Search className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama petani, email, atau nama desa..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-900 outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>
            <div className="sm:col-span-5">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-emerald-600 focus:bg-white"
              >
                <option value="all">Semua Role ({state.managedUsers.length})</option>
                <option value="admin">Super Admin (Administrator)</option>
                <option value="petani">Petani / Pekebun</option>
                <option value="kelompok_tani">Pengurus Kelompok Tani</option>
                <option value="penyuluh">Penyuluh / Relawan MPA</option>
              </select>
            </div>
          </div>

          {/* Tabel Pengguna */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                <tr>
                  <th className="px-4 py-3.5">Pengguna & Email</th>
                  <th className="px-4 py-3.5">Role Ekosistem</th>
                  <th className="px-4 py-3.5">Wilayah & Lahan</th>
                  <th className="px-4 py-3.5">Paket Langganan</th>
                  <th className="px-4 py-3.5">Benih & Streak</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5 text-right">Aksi Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredUsers.map((u) => {
                  const isCurrent = u.email.toLowerCase() === state.userEmail.toLowerCase();
                  return (
                    <tr key={u.id} className={isCurrent ? "bg-emerald-50/40" : "hover:bg-slate-50/80"}>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900">{u.name}</span>
                          {isCurrent && (
                            <span className="rounded-md bg-emerald-600 px-1.5 py-0.5 text-[10px] font-extrabold text-white">
                              Sesi Aktif
                            </span>
                          )}
                        </div>
                        <p className="font-mono text-[11px] text-slate-500">{u.email}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex rounded-lg px-2.5 py-1 text-[11px] font-extrabold ${
                            u.role === "admin"
                              ? "bg-slate-900 text-emerald-300"
                              : u.role === "kelompok_tani"
                                ? "bg-indigo-50 text-indigo-700"
                                : u.role === "penyuluh"
                                  ? "bg-cyan-50 text-cyan-800"
                                  : "bg-emerald-50 text-emerald-800"
                          }`}
                        >
                          {ROLE_LABELS[u.role]}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="font-bold text-slate-800">{u.villageName}</p>
                        <p className="text-[11px] text-slate-500">{formatNumber(u.landAreaHa)} Hektare</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-extrabold ${
                            u.plan === "vip"
                              ? "bg-amber-100 text-amber-900"
                              : u.plan === "pro"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          <Crown className="h-3 w-3" />
                          {PLAN_LABELS[u.plan]}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="font-extrabold text-emerald-700">
                          {formatNumber(u.coins, 0)} Benih
                        </p>
                        <p className="text-[11px] text-slate-500">Streak {u.streakDays} hari</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-extrabold ${
                            u.status === "Aktif"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditUser(u)}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-bold text-slate-700 hover:border-emerald-500 hover:text-emerald-700 cursor-pointer"
                            title="Edit Data Pengguna"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              impersonateManagedUser(u.id);
                              notify(`Sesi aktif sekarang beralih ke "${u.name}" (${ROLE_LABELS[u.role]})`);
                            }}
                            className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-[11px] font-bold text-emerald-800 hover:bg-emerald-100 cursor-pointer"
                            title="Gunakan Akun Ini (Impersonate)"
                          >
                            <UserCheck className="h-3.5 w-3.5" />
                            Pakai
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              deleteManagedUser(u.id);
                              notify(`Pengguna "${u.name}" telah dihapus.`);
                            }}
                            className="inline-flex items-center rounded-lg border border-rose-200 bg-rose-50 p-1.5 text-rose-700 hover:bg-rose-100 cursor-pointer"
                            title="Hapus Pengguna"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 2: MANAJEMEN TRANSAKSI LAHAN (FULL CRUD)
         ===================================================================== */}
      {activeTab === "transactions" && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                Manajemen Catatan Manfaat & Biaya Kelola Lahan
              </h2>
              <p className="text-xs text-slate-500">
                Edit nominal penghematan pupuk, nilai kompos, maupun biaya tebas-cacah di aplikasi.
              </p>
            </div>
            <button
              type="button"
              onClick={openAddTx}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-extrabold text-white shadow-xs hover:bg-emerald-700 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Tambah Transaksi Lahan
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                <tr>
                  <th className="px-4 py-3.5">Tanggal</th>
                  <th className="px-4 py-3.5">Judul Aktivitas & Catatan</th>
                  <th className="px-4 py-3.5">Kategori</th>
                  <th className="px-4 py-3.5">Jenis</th>
                  <th className="px-4 py-3.5">Nominal (Rp)</th>
                  <th className="px-4 py-3.5 text-right">Aksi Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {state.transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3.5 font-mono text-[11px] text-slate-600">{tx.date}</td>
                    <td className="px-4 py-3.5">
                      <p className="font-extrabold text-slate-900">{tx.title}</p>
                      {tx.note && <p className="text-[11px] text-slate-500">{tx.note}</p>}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700">
                        {tx.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`rounded-lg px-2.5 py-1 text-[11px] font-extrabold uppercase ${
                          tx.type === "manfaat"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td
                      className={`px-4 py-3.5 font-extrabold ${
                        tx.type === "manfaat" ? "text-emerald-700" : "text-rose-700"
                      }`}
                    >
                      {tx.type === "manfaat" ? "+" : "-"}
                      {formatRupiah(tx.amount)}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditTx(tx)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-bold text-slate-700 hover:border-emerald-500 hover:text-emerald-700 cursor-pointer"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            deleteTransaction(tx.id);
                            notify(`Transaksi "${tx.title}" berhasil dihapus.`);
                          }}
                          className="inline-flex items-center rounded-lg border border-rose-200 bg-rose-50 p-1.5 text-rose-700 hover:bg-rose-100 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: MANAJEMEN DATA SMART SCANNER AI (FULL CRUD)
         ===================================================================== */}
      {activeTab === "scans" && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                Manajemen Rekaman Smart Land & Smoke Scanner AI
              </h2>
              <p className="text-xs text-slate-500">
                Lihat dan edit hasil pemindaian kondisi lahan, tinggi muka air gambut, serta estimasi kompos.
              </p>
            </div>
            <button
              type="button"
              onClick={openAddScan}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-extrabold text-white shadow-xs hover:bg-emerald-700 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Tambah Data Scan
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                <tr>
                  <th className="px-4 py-3.5">Waktu Scan</th>
                  <th className="px-4 py-3.5">Kondisi Lahan & Rekomendasi</th>
                  <th className="px-4 py-3.5">Risiko Api & Air</th>
                  <th className="px-4 py-3.5">Potensi Kompos</th>
                  <th className="px-4 py-3.5">Hemat Pupuk</th>
                  <th className="px-4 py-3.5 text-right">Aksi Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {state.scans.map((sc) => (
                  <tr key={sc.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3.5 font-mono text-[11px] text-slate-600">
                      {sc.scannedAt}
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-extrabold text-slate-900">{sc.landCondition}</p>
                      <p className="text-[11px] text-slate-500">{sc.recommendation}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex rounded-lg px-2 py-0.5 text-[11px] font-extrabold ${
                          sc.fireRisk.includes("Aman")
                            ? "bg-emerald-100 text-emerald-800"
                            : sc.fireRisk.includes("Waspada")
                              ? "bg-amber-100 text-amber-800"
                              : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {sc.fireRisk}
                      </span>
                      <p className="mt-0.5 text-[11px] text-slate-500">
                        Tinggi Air: -{sc.waterDepthCm} cm
                      </p>
                    </td>
                    <td className="px-4 py-3.5 font-extrabold text-slate-800">
                      {sc.estimatedCompostKg} Kg
                    </td>
                    <td className="px-4 py-3.5 font-extrabold text-emerald-700">
                      {formatRupiah(sc.estimatedFertilizerSavedRp)}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditScan(sc)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-bold text-slate-700 hover:border-emerald-500 hover:text-emerald-700 cursor-pointer"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            deleteScanRecord(sc.id);
                            notify("Rekaman pemindaian berhasil dihapus.");
                          }}
                          className="inline-flex items-center rounded-lg border border-rose-200 bg-rose-50 p-1.5 text-rose-700 hover:bg-rose-100 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 4: MANAJEMEN TARGET LAHAN IMPIAN (FULL CRUD)
         ===================================================================== */}
      {activeTab === "targets" && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                Manajemen Target Lahan Impian (Goal Setting)
              </h2>
              <p className="text-xs text-slate-500">
                Edit target harga alat pertanian, jumlah tabungan terkumpul, maupun tenggat waktu.
              </p>
            </div>
            <button
              type="button"
              onClick={openAddTarget}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-extrabold text-white shadow-xs hover:bg-emerald-700 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Tambah Target Baru
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {state.targets.map((t) => {
              const pct = Math.min(100, Math.round((t.savedAmount / t.targetAmount) * 100));
              return (
                <div
                  key={t.id}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200 p-5"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-extrabold text-emerald-700">
                        Progres {pct}%
                      </span>
                      <span className="font-mono text-[11px] text-slate-500">{t.deadline}</span>
                    </div>
                    <h3 className="mt-3 text-base font-extrabold text-slate-900">{t.title}</h3>
                    <p className="mt-1 text-xs text-slate-500">{t.subtitle}</p>

                    <div className="mt-4 space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Terkumpul:</span>
                        <strong className="text-emerald-700">{formatRupiah(t.savedAmount)}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Target Total:</span>
                        <strong className="text-slate-900">{formatRupiah(t.targetAmount)}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Rencana/Bulan:</span>
                        <strong className="text-slate-700">{formatRupiah(t.monthlySaving)}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
                    <button
                      type="button"
                      onClick={() => openEditTarget(t)}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:border-emerald-500 hover:text-emerald-700 cursor-pointer"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit Target
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        deleteDreamTarget(t.id);
                        notify(`Target "${t.title}" berhasil dihapus.`);
                      }}
                      className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 5: MANAJEMEN PENGINGAT SIAGA & BENIH HIJAU (FULL CRUD)
         ===================================================================== */}
      {activeTab === "reminders" && (
        <div className="space-y-6">
          {/* Quick Editor Saldo Benih & Streak Akun Aktif */}
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50/60 p-6">
            <h2 className="text-base font-black text-slate-900">
              Kendali Cepat Saldo Benih Hijau & Streak (Akun Aktif: {state.userName})
            </h2>
            <p className="text-xs text-slate-600">
              Ubah langsung jumlah Benih Hijau atau Streak Hari Bebas Api untuk pengujian reward dan gamifikasi.
            </p>
            <div className="mt-4 flex flex-wrap items-end gap-3">
              <div>
                <label className="block text-[11px] font-extrabold uppercase text-slate-600">
                  Saldo Benih Hijau
                </label>
                <input
                  type="number"
                  min={0}
                  value={quickCoins}
                  onChange={(e) => setQuickCoins(e.target.value)}
                  className="mt-1 w-40 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm font-extrabold text-slate-900"
                />
              </div>
              <div>
                <label className="block text-[11px] font-extrabold uppercase text-slate-600">
                  Streak Hari Bebas Api
                </label>
                <input
                  type="number"
                  min={0}
                  value={quickStreak}
                  onChange={(e) => setQuickStreak(e.target.value)}
                  className="mt-1 w-36 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm font-extrabold text-slate-900"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  adminSetCoinsAndStreak({
                    coins: Number(quickCoins) || 0,
                    streakDays: Number(quickStreak) || 0,
                  });
                  notify("Saldo Benih & Streak berhasil diperbarui oleh Super Admin!");
                }}
                className="rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-extrabold text-white hover:bg-emerald-700 cursor-pointer"
              >
                Terapkan Benih & Streak
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Daftar Pengingat Siaga */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Daftar Pengingat Siaga ({state.reminders.length})
                  </h3>
                  <p className="text-xs text-slate-500">Trigger harian, musiman & siaga asap</p>
                </div>
                <button
                  type="button"
                  onClick={openAddRem}
                  className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-extrabold text-white hover:bg-emerald-700 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Tambah
                </button>
              </div>

              <div className="space-y-2.5">
                {state.reminders.map((rem) => (
                  <div
                    key={rem.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 p-3.5"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-700">
                          {rem.timeOrDate}
                        </span>
                        <span className="text-xs font-extrabold text-slate-900 truncate">
                          {rem.title}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-slate-500 truncate">{rem.subtitle}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => toggleReminder(rem.id)}
                        className={`rounded-lg px-2 py-1 text-[10px] font-extrabold cursor-pointer ${
                          rem.enabled
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {rem.enabled ? "Aktif" : "Off"}
                      </button>
                      <button
                        type="button"
                        onClick={() => openEditRem(rem)}
                        className="rounded-lg border border-slate-200 p-1.5 text-slate-700 hover:border-emerald-500 cursor-pointer"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          deleteReminder(rem.id);
                          notify("Pengingat berhasil dihapus.");
                        }}
                        className="rounded-lg border border-rose-200 bg-rose-50 p-1.5 text-rose-700 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Daftar Penukaran Voucher Benih Hijau */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Riwayat Penukaran Voucher ({state.redemptions.length})
                  </h3>
                  <p className="text-xs text-slate-500">Log penukaran Benih Hijau petani</p>
                </div>
                <button
                  type="button"
                  onClick={openAddRed}
                  className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-extrabold text-white hover:bg-emerald-700 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Tambah
                </button>
              </div>

              <div className="space-y-2.5">
                {state.redemptions.map((red) => (
                  <div
                    key={red.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 p-3.5"
                  >
                    <div>
                      <p className="text-xs font-extrabold text-slate-900">{red.title}</p>
                      <p className="mt-0.5 text-[11px] text-slate-500">
                        {red.date} •{" "}
                        <strong className="text-emerald-700">-{red.coinsUsed} Benih</strong> (Senilai{" "}
                        {formatRupiah(red.rupiahValue)})
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEditRed(red)}
                        className="rounded-lg border border-slate-200 p-1.5 text-slate-700 hover:border-emerald-500 cursor-pointer"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          deleteRedemption(red.id);
                          notify("Data penukaran voucher dihapus.");
                        }}
                        className="rounded-lg border border-rose-200 bg-rose-50 p-1.5 text-rose-700 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 6: DATABASE CLOUD SUPABASE & SINKRONISASI
         ===================================================================== */}
      {activeTab === "cloud" && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900">
                  Inspeksi Tabel PostgreSQL Supabase Cloud
                </h2>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${
                    isSupabaseConfigured
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {isSupabaseConfigured ? "CLOUD CONNECTED" : "OFFLINE MODE"}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Pantau jumlah baris (rows) langsung dari 6 tabel produksi di Supabase Cloud.
              </p>
            </div>
            <button
              type="button"
              onClick={fetchCloudStatus}
              disabled={cloudLoading}
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-extrabold text-white hover:bg-slate-800 cursor-pointer"
            >
              <RefreshCw className={`h-4 w-4 ${cloudLoading ? "animate-spin" : ""}`} />
              {cloudLoading ? "Memuat Cloud..." : "Refresh Tabel Cloud"}
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["v2_user_profiles", "Tabel Profil & Role Pengguna"],
              ["v2_land_transactions", "Tabel Transaksi Manfaat & Biaya"],
              ["v2_smart_scans", "Tabel Smart Scanner AI (EXIF Stripped)"],
              ["v2_reminders", "Tabel Pengingat Siaga Karhutla"],
              ["v2_dream_targets", "Tabel Target Lahan Impian"],
              ["v2_reward_redemptions", "Tabel Penukaran Voucher Benih Hijau"],
            ].map(([tableName, desc]) => (
              <div
                key={tableName}
                className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-extrabold text-emerald-700">
                    public.{tableName}
                  </span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                </div>
                <p className="mt-1 text-xs text-slate-500">{desc}</p>
                <p className="mt-3 text-xl font-black text-slate-900">
                  {cloudCounts[tableName] !== undefined ? `${cloudCounts[tableName]} Baris` : "Siap"}
                </p>
              </div>
            ))}
          </div>

          {cloudProfiles.length > 0 && (
            <div>
              <h3 className="mb-2 text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Data Live dari Tabel public.v2_user_profiles (Supabase Cloud)
              </h3>
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-extrabold uppercase text-slate-600">
                    <tr>
                      <th className="px-4 py-3">Display Name</th>
                      <th className="px-4 py-3">Role</th>
                      <th className="px-4 py-3">Desa / Wilayah</th>
                      <th className="px-4 py-3">Luas (Ha)</th>
                      <th className="px-4 py-3">Paket</th>
                      <th className="px-4 py-3">Benih</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {cloudProfiles.map((row, idx) => (
                      <tr key={String(row.id ?? idx)}>
                        <td className="px-4 py-3 font-bold text-slate-900">
                          {String(row.display_name ?? "-")}
                        </td>
                        <td className="px-4 py-3 font-mono text-[11px] text-emerald-700">
                          {String(row.user_role ?? "-")}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {String(row.village_name ?? "-")}
                        </td>
                        <td className="px-4 py-3 font-bold">
                          {String(row.land_area_ha ?? "-")} Ha
                        </td>
                        <td className="px-4 py-3 uppercase font-extrabold text-amber-700">
                          {String(row.plan_tier ?? "-")}
                        </td>
                        <td className="px-4 py-3 font-bold text-emerald-700">
                          {String(row.coins_balance ?? 0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          MODAL 1: EDIT / TAMBAH PENGGUNA
         ===================================================================== */}
      {userModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-black text-slate-900">
              {editingUserId ? "Edit Data Pengguna & Role" : "+ Tambah Pengguna Baru"}
            </h3>
            <form onSubmit={handleSaveUser} className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="font-bold text-slate-700">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={uName}
                    onChange={(e) => setUName(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Email</label>
                  <input
                    type="email"
                    required
                    value={uEmail}
                    onChange={(e) => setUEmail(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="font-bold text-slate-700">Role Pengguna</label>
                  <select
                    value={uRole}
                    onChange={(e) => setURole(e.target.value as UserRole)}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-900"
                  >
                    <option value="petani">Petani / Pekebun</option>
                    <option value="kelompok_tani">Pengurus Kelompok Tani</option>
                    <option value="penyuluh">Penyuluh / Relawan MPA</option>
                    <option value="admin">Super Admin (Administrator)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700">Paket Langganan</label>
                  <select
                    value={uPlan}
                    onChange={(e) => setUPlan(e.target.value as PlanTier)}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-900"
                  >
                    <option value="trial">Perintis Lahan (Trial 30 Hari)</option>
                    <option value="pro">Paket Tani Mandiri (Rp10.999/bln)</option>
                    <option value="vip">Paket Poktan Cerdas (AI) (Rp19.000/bln)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700">Desa / Wilayah Kelola</label>
                  <input
                    type="text"
                    required
                    value={uVillage}
                    onChange={(e) => setUVillage(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Luas Lahan (Ha)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    value={uArea}
                    onChange={(e) => setUArea(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Saldo Benih Hijau</label>
                  <input
                    type="number"
                    min={0}
                    value={uCoins}
                    onChange={(e) => setUCoins(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Streak (Hari)</label>
                  <input
                    type="number"
                    min={0}
                    value={uStreak}
                    onChange={(e) => setUStreak(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Status Akun</label>
                  <select
                    value={uStatus}
                    onChange={(e) => setUStatus(e.target.value as "Aktif" | "Nonaktif")}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-900"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setUserModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 font-bold text-slate-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 px-5 py-2.5 font-extrabold text-white hover:bg-emerald-700 cursor-pointer"
                >
                  Simpan Data Pengguna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 2: EDIT / TAMBAH TRANSAKSI LAHAN
         ===================================================================== */}
      {txModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-black text-slate-900">
              {editingTxId ? "Edit Transaksi Lahan" : "+ Tambah Transaksi Lahan"}
            </h3>
            <form onSubmit={handleSaveTx} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700">Judul Catatan Aktivitas</label>
                <input
                  type="text"
                  required
                  value={tTitle}
                  onChange={(e) => setTTitle(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Jenis</label>
                  <select
                    value={tType}
                    onChange={(e) => setTType(e.target.value as TxType)}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-900"
                  >
                    <option value="manfaat">Manfaat (+)</option>
                    <option value="biaya">Biaya (-)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700">Kategori</label>
                  <select
                    value={tCategory}
                    onChange={(e) => setTCategory(e.target.value as TxCategory)}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-900"
                  >
                    {TX_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Nominal (Rp)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={tAmount}
                    onChange={(e) => setTAmount(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Tanggal</label>
                  <input
                    type="date"
                    value={tDate}
                    onChange={(e) => setTDate(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700">Catatan Tambahan</label>
                <input
                  type="text"
                  value={tNote}
                  onChange={(e) => setTNote(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setTxModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 font-bold text-slate-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 px-5 py-2.5 font-extrabold text-white hover:bg-emerald-700 cursor-pointer"
                >
                  Simpan Transaksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 3: EDIT / TAMBAH DATA SCAN AI
         ===================================================================== */}
      {scanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-black text-slate-900">
              {editingScanId ? "Edit Rekaman Smart Scanner" : "+ Tambah Data Scan AI"}
            </h3>
            <form onSubmit={handleSaveScan} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700">Kondisi Lahan Terdeteksi</label>
                <input
                  type="text"
                  required
                  value={sCond}
                  onChange={(e) => setSCond(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Status Risiko Api</label>
                  <select
                    value={sRisk}
                    onChange={(e) => setSRisk(e.target.value as ScanRecord["fireRisk"])}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-900"
                  >
                    <option value="Aman (Lembap)">Aman (Lembap)</option>
                    <option value="Waspada (Agak Kering)">Waspada (Agak Kering)</option>
                    <option value="Bahaya (Rawan Api)">Bahaya (Rawan Api)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700">Kedalaman Air Gambut (cm)</label>
                  <input
                    type="number"
                    value={sWater}
                    onChange={(e) => setSWater(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Estimasi Kompos (Kg)</label>
                  <input
                    type="number"
                    value={sCompost}
                    onChange={(e) => setSCompost(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Hemat Pupuk (Rp)</label>
                  <input
                    type="number"
                    value={sSavedRp}
                    onChange={(e) => setSSavedRp(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700">Rekomendasi Penanganan</label>
                <input
                  type="text"
                  required
                  value={sRec}
                  onChange={(e) => setSRec(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setScanModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 font-bold text-slate-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 px-5 py-2.5 font-extrabold text-white hover:bg-emerald-700 cursor-pointer"
                >
                  Simpan Data Scan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 4: EDIT / TAMBAH TARGET LAHAN IMPIAN
         ===================================================================== */}
      {targetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-black text-slate-900">
              {editingTargetId ? "Edit Target Lahan Impian" : "+ Tambah Target Baru"}
            </h3>
            <form onSubmit={handleSaveTarget} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700">Nama Alat / Target Impian</label>
                <input
                  type="text"
                  required
                  value={gTitle}
                  onChange={(e) => setGTitle(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-900"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700">Deskripsi Singkat</label>
                <input
                  type="text"
                  required
                  value={gSub}
                  onChange={(e) => setGSub(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Target Nominal (Rp)</label>
                  <input
                    type="number"
                    required
                    value={gTargetRp}
                    onChange={(e) => setGTargetRp(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Terkumpul Saat Ini (Rp)</label>
                  <input
                    type="number"
                    required
                    value={gSavedRp}
                    onChange={(e) => setGSavedRp(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-900"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Tabungan / Bulan (Rp)</label>
                  <input
                    type="number"
                    value={gMonthlyRp}
                    onChange={(e) => setGMonthlyRp(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Target Waktu</label>
                  <input
                    type="text"
                    value={gDeadline}
                    onChange={(e) => setGDeadline(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-900"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setTargetModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 font-bold text-slate-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 px-5 py-2.5 font-extrabold text-white hover:bg-emerald-700 cursor-pointer"
                >
                  Simpan Target
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 5: EDIT / TAMBAH PENGINGAT SIAGA
         ===================================================================== */}
      {remModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-black text-slate-900">
              {editingRemId ? "Edit Pengingat Siaga" : "+ Tambah Pengingat Siaga"}
            </h3>
            <form onSubmit={handleSaveRem} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700">Judul Pengingat</label>
                <input
                  type="text"
                  required
                  value={rTitle}
                  onChange={(e) => setRTitle(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-900"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700">Pesan Subjudul</label>
                <input
                  type="text"
                  required
                  value={rSub}
                  onChange={(e) => setRSub(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Jam / Tanggal</label>
                  <input
                    type="text"
                    required
                    value={rTime}
                    onChange={(e) => setRTime(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Kategori</label>
                  <select
                    value={rKind}
                    onChange={(e) => setRKind(e.target.value as LandReminder["kind"])}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-900"
                  >
                    <option value="harian">Harian</option>
                    <option value="musiman">Musiman</option>
                    <option value="siaga_asap">Siaga Asap</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setRemModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 font-bold text-slate-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 px-5 py-2.5 font-extrabold text-white hover:bg-emerald-700 cursor-pointer"
                >
                  Simpan Pengingat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 6: EDIT / TAMBAH PENUKARAN VOUCHER KOIN
         ===================================================================== */}
      {redModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-black text-slate-900">
              {editingRedId ? "Edit Riwayat Penukaran Voucher" : "+ Tambah Penukaran Voucher"}
            </h3>
            <form onSubmit={handleSaveRed} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700">Nama Voucher / Reward</label>
                <input
                  type="text"
                  required
                  value={vTitle}
                  onChange={(e) => setVTitle(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-900"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Benih Hijau Terpakai</label>
                  <input
                    type="number"
                    required
                    value={vCoins}
                    onChange={(e) => setVCoins(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Nilai (Rp)</label>
                  <input
                    type="number"
                    required
                    value={vRp}
                    onChange={(e) => setVRp(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Tanggal</label>
                  <input
                    type="date"
                    value={vDate}
                    onChange={(e) => setVDate(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-900"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setRedModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 font-bold text-slate-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 px-5 py-2.5 font-extrabold text-white hover:bg-emerald-700 cursor-pointer"
                >
                  Simpan Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

