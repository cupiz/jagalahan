"use client";

import { useSyncExternalStore } from "react";
import {
  DEFAULT_PRICE_REF,
  ROLE_PERSONA,
  SEED_EQUIPMENT_REQUESTS,
  SEED_POST_FIRE_OBS,
  SEED_SMOKE_REPORTS,
  VILLAGES,
} from "@/lib/data/seed";
import { MAX_IGNORED } from "@/lib/reminders";
import type {
  AuditLog,
  Commitment,
  EquipmentRequest,
  EquipmentStatus,
  Harvest,
  PhotoRecord,
  PostFireObservation,
  PriceRef,
  Profile,
  Role,
  SmokeReport,
  SmokeStatus,
  StageProgress,
  StageSlug,
  SyncOp,
  VerificationDecision,
  VisitQueueItem,
  WaterLog,
} from "@/lib/types";
import { addDays, isoDaysFromToday, todayIso, uid } from "@/lib/utils";

/**
 * Penyimpanan lokal offline-first (localStorage) dengan antrean sinkronisasi ke Supabase.
 * Seluruh data tetap bisa dipakai tanpa sinyal; operasi tulis dicatat di syncQueue.
 */

export const STAGE_SLUGS: StageSlug[] = [
  "penilaian",
  "pencacahan",
  "penumpukan",
  "pengomposan",
  "kesiapan",
  "penanaman",
];

export interface AppState {
  version: number;
  onboarded: boolean;
  consent: boolean;
  profile: Profile;
  commitments: Commitment[];
  stages: StageProgress[];
  currentStage: number;
  waterLogs: WaterLog[];
  harvests: Harvest[];
  equipmentRequests: EquipmentRequest[];
  smokeReports: SmokeReport[];
  postFireObs: PostFireObservation[];
  priceRefs: Record<string, PriceRef>;
  auditLogs: AuditLog[];
  visitQueue: VisitQueueItem[];
  verificationDecisions: Record<string, VerificationDecision>;
  syncQueue: SyncOp[];
  lastSyncAt: string | null;
}

const STORAGE_KEY = "jagalahan:v1";

export function createInitialState(): AppState {
  return {
    version: 1,
    onboarded: false,
    consent: false,
    profile: {
      id: "me",
      displayName: ROLE_PERSONA.pekebun_primer,
      role: "pekebun_primer",
      villageId: "kalampangan",
      soil: "gambut",
      areaHa: 2,
      nextPlantingDate: isoDaysFromToday(13),
      ignoredReminders: 0,
      remindersPaused: false,
    },
    commitments: [],
    stages: STAGE_SLUGS.map((slug, i) => ({
      stage: i + 1,
      slug,
      status: "belum",
      mulchFlipped: false,
      verified: false,
    })),
    currentStage: 1,
    waterLogs: [
      { id: "w-seed-1", date: isoDaysFromToday(-21), depthCm: 24, canalClosed: false, penyuluhContacted: false },
      { id: "w-seed-2", date: isoDaysFromToday(-7), depthCm: 36, canalClosed: false, penyuluhContacted: false },
    ],
    harvests: [
      {
        id: "h-seed-1",
        season: "Musim 2025",
        commodity: "Jagung",
        areaHa: 2,
        tonPerHa: 3.8,
        sacks: 152,
        revenue: 34_960_000,
        cost: 15_200_000,
        zeroBurn: false,
      },
      {
        id: "h-seed-2",
        season: "Musim 2026",
        commodity: "Jagung",
        areaHa: 2,
        tonPerHa: 4.4,
        sacks: 176,
        revenue: 40_480_000,
        cost: 13_900_000,
        zeroBurn: true,
      },
    ],
    equipmentRequests: SEED_EQUIPMENT_REQUESTS,
    smokeReports: SEED_SMOKE_REPORTS,
    postFireObs: SEED_POST_FIRE_OBS,
    priceRefs: Object.fromEntries(VILLAGES.map((v) => [v.id, DEFAULT_PRICE_REF])),
    auditLogs: [
      {
        id: "a-seed-1",
        actor: "Mas Yudi (Penyuluh)",
        action: "Memperbarui acuan harga kalkulator",
        scope: "calculator_price_refs",
        at: "2026-09-15T09:00:00+07:00",
      },
    ],
    visitQueue: [],
    verificationDecisions: {},
    syncQueue: [],
    lastSyncAt: null,
  };
}

/* ------------------------------------------------------------------ */
/* Inti store                                                          */
/* ------------------------------------------------------------------ */

const serverSnapshot = createInitialState();
let state: AppState | null = null;
const listeners = new Set<() => void>();

function load(): AppState {
  if (state) return state;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    state = raw ? { ...createInitialState(), ...(JSON.parse(raw) as Partial<AppState>) } : createInitialState();
  } catch {
    state = createInitialState();
  }
  return state;
}

function persist(next: AppState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch (err) {
    console.warn("[JagaLahan] Penyimpanan lokal penuh/tidak tersedia:", err);
  }
}

export function getState(): AppState {
  return typeof window === "undefined" ? serverSnapshot : load();
}

export function setState(updater: (s: AppState) => AppState) {
  const next = updater(load());
  state = next;
  persist(next);
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      state = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useAppState(): AppState {
  return useSyncExternalStore(subscribe, getState, () => serverSnapshot);
}

/** true setelah hidrasi selesai (data localStorage sudah terbaca). */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

/* ------------------------------------------------------------------ */
/* Helper                                                              */
/* ------------------------------------------------------------------ */

function withSync(s: AppState, table: string, payload: Record<string, unknown>): AppState {
  return {
    ...s,
    syncQueue: [...s.syncQueue, { id: uid("op"), table, payload, createdAt: new Date().toISOString() }],
  };
}

function withAudit(s: AppState, action: string, scope: string): AppState {
  return {
    ...s,
    auditLogs: [
      { id: uid("audit"), actor: s.profile.displayName, action, scope, at: new Date().toISOString() },
      ...s.auditLogs,
    ],
  };
}

/* ------------------------------------------------------------------ */
/* Aksi: profil & onboarding                                           */
/* ------------------------------------------------------------------ */

export function completeOnboarding(patch: Partial<Profile>) {
  setState((s) => ({ ...s, onboarded: true, consent: true, profile: { ...s.profile, ...patch } }));
}

export function updateProfile(patch: Partial<Profile>) {
  setState((s) => ({ ...s, profile: { ...s.profile, ...patch } }));
}

export function switchRole(role: Role) {
  setState((s) => ({
    ...s,
    profile: {
      ...s.profile,
      role,
      displayName: ROLE_PERSONA[role],
      soil: role === "petani_sekunder" ? "mineral" : s.profile.soil === "mineral" && role === "pekebun_primer" ? "gambut" : s.profile.soil,
    },
  }));
}

export function resetAllData() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* abaikan */
  }
  state = createInitialState();
  listeners.forEach((l) => l());
}

/* ------------------------------------------------------------------ */
/* Aksi: pengingat pra-keputusan                                        */
/* ------------------------------------------------------------------ */

export function ignoreReminder() {
  setState((s) => {
    const ignored = Math.min(MAX_IGNORED, s.profile.ignoredReminders + 1);
    const paused = ignored >= MAX_IGNORED;
    let next: AppState = { ...s, profile: { ...s.profile, ignoredReminders: ignored, remindersPaused: paused } };
    // Gambut berisiko tinggi + 3x tanpa respons → antrean kunjungan penyuluh (bukan notifikasi tambahan).
    if (paused && s.profile.soil === "gambut" && !s.visitQueue.some((v) => v.farmer === s.profile.displayName && !v.done)) {
      next = {
        ...next,
        visitQueue: [
          {
            id: uid("visit"),
            farmer: s.profile.displayName,
            reason: "3 pengingat pra-musim tidak direspons — lahan gambut berisiko tinggi",
            at: new Date().toISOString(),
            done: false,
          },
          ...next.visitQueue,
        ],
      };
    }
    return next;
  });
}

export function respondReminder() {
  setState((s) => ({ ...s, profile: { ...s.profile, ignoredReminders: 0 } }));
}

export function resumeReminders() {
  setState((s) => ({ ...s, profile: { ...s.profile, ignoredReminders: 0, remindersPaused: false } }));
}

/* ------------------------------------------------------------------ */
/* Aksi: komitmen & panduan 6 tahap                                     */
/* ------------------------------------------------------------------ */

export function addCommitment(c: Omit<Commitment, "id" | "createdAt" | "status">) {
  setState((s) => {
    const commitment: Commitment = { ...c, id: uid("c"), status: "berjalan", createdAt: todayIso() };
    return withSync({ ...s, commitments: [commitment, ...s.commitments] }, "season_commitments", { ...commitment });
  });
}

export function setCommitmentVisibility(id: string, isPublic: boolean) {
  setState((s) => ({
    ...s,
    commitments: s.commitments.map((c) => (c.id === id ? { ...c, isPublic } : c)),
  }));
}

export function setCurrentStage(stage: number) {
  setState((s) => ({ ...s, currentStage: Math.max(1, Math.min(6, stage)) }));
}

export function updateStage(stage: number, patch: Partial<StageProgress>) {
  setState((s) => {
    const stages = s.stages.map((st) => {
      if (st.stage !== stage) return st;
      const next = { ...st, ...patch };
      if (patch.status === "sedang_dikerjakan" && !st.startedAt) {
        next.startedAt = todayIso();
        if (st.slug === "pengomposan") next.mulchFlipDue = addDays(todayIso(), 10);
      }
      if (patch.status === "selesai") next.completedAt = todayIso();
      return next;
    });
    const changed = stages.find((st) => st.stage === stage)!;
    return withSync({ ...s, stages }, "six_stage_progress", {
      stage_number: changed.stage,
      stage_slug: changed.slug,
      status: changed.status,
      started_at: changed.startedAt ?? null,
      mulch_flip_due_date: changed.mulchFlipDue ?? null,
      mulch_flipped: changed.mulchFlipped,
    });
  });
}

export function attachStagePhoto(stage: number, photo: PhotoRecord) {
  setState((s) => ({ ...s, stages: s.stages.map((st) => (st.stage === stage ? { ...st, photo } : st)) }));
}

/* ------------------------------------------------------------------ */
/* Aksi: muka air, panen, bantuan                                       */
/* ------------------------------------------------------------------ */

export function addWaterLog(log: Omit<WaterLog, "id">) {
  setState((s) => {
    const entry: WaterLog = { ...log, id: uid("w") };
    const waterLogs = [...s.waterLogs.filter((w) => w.date !== log.date), entry].sort((a, b) =>
      a.date.localeCompare(b.date),
    );
    return withSync({ ...s, waterLogs }, "water_table_logs", {
      measurement_date: entry.date,
      depth_cm: entry.depthCm,
      canal_block_closed_action: entry.canalClosed,
      penyuluh_contacted_action: entry.penyuluhContacted,
      exif_stripped_verified: true,
    });
  });
}

export function updateWaterLog(id: string, patch: Partial<WaterLog>) {
  setState((s) => ({ ...s, waterLogs: s.waterLogs.map((w) => (w.id === id ? { ...w, ...patch } : w)) }));
}

export function addHarvest(h: Omit<Harvest, "id">) {
  setState((s) => {
    const entry: Harvest = { ...h, id: uid("h") };
    return withSync({ ...s, harvests: [...s.harvests, entry] }, "harvest_journals", {
      season_label: entry.season,
      commodity: entry.commodity,
      land_area_ha: entry.areaHa,
      yield_ton_per_ha: entry.tonPerHa,
      yield_sacks_count: entry.sacks,
      gross_revenue_idr: entry.revenue,
      input_cost_idr: entry.cost,
      used_zero_burning: entry.zeroBurn,
    });
  });
}

export function removeHarvest(id: string) {
  setState((s) => ({ ...s, harvests: s.harvests.filter((h) => h.id !== id) }));
}

export function requestEquipment(r: Pick<EquipmentRequest, "type" | "areaHa" | "costGap">) {
  setState((s) => {
    const entry: EquipmentRequest = {
      ...r,
      id: uid("eq"),
      requester: s.profile.displayName,
      isMine: true,
      status: "menunggu",
      createdAt: todayIso(),
    };
    return withSync({ ...s, equipmentRequests: [entry, ...s.equipmentRequests] }, "equipment_requests", {
      request_type: entry.type,
      land_area_ha: entry.areaHa,
      estimated_cost_gap_idr: entry.costGap,
      status: entry.status,
    });
  });
}

/* ------------------------------------------------------------------ */
/* Aksi: warga penjaga                                                  */
/* ------------------------------------------------------------------ */

export function addSmokeReport(r: Pick<SmokeReport, "zone" | "intensity" | "wind" | "photo">) {
  setState((s) => {
    const entry: SmokeReport = {
      ...r,
      id: uid("smoke"),
      reporter: s.profile.displayName,
      status: "baru_dilaporkan",
      reportedAt: new Date().toISOString(),
    };
    return withSync({ ...s, smokeReports: [entry, ...s.smokeReports] }, "smoke_reports", {
      sub_village_zone: entry.zone,
      smoke_intensity: entry.intensity,
      wind_direction_note: entry.wind,
      status: entry.status,
      exif_stripped_verified: true,
    });
  });
}

export function addPostFireObservation(o: Omit<PostFireObservation, "id" | "observedAt">) {
  setState((s) => ({
    ...s,
    postFireObs: [
      ...s.postFireObs.filter((x) => !(x.plotId === o.plotId && x.month === o.month)),
      { ...o, id: uid("obs"), observedAt: todayIso() },
    ],
  }));
}

/* ------------------------------------------------------------------ */
/* Aksi: penyuluh tersier (semua tercatat di audit log)                 */
/* ------------------------------------------------------------------ */

export function decideVerification(id: string, decision: VerificationDecision, label: string) {
  setState((s) =>
    withAudit(
      { ...s, verificationDecisions: { ...s.verificationDecisions, [id]: decision } },
      `${decision === "diverifikasi" ? "Memverifikasi" : "Menjadwalkan kunjungan untuk"} ${label}`,
      "six_stage_progress",
    ),
  );
}

export function verifyOwnStage(stage: number) {
  setState((s) =>
    withAudit(
      { ...s, stages: s.stages.map((st) => (st.stage === stage ? { ...st, verified: true } : st)) },
      `Memverifikasi tahap ${stage} milik pengguna demo`,
      "six_stage_progress",
    ),
  );
}

export function setEquipmentStatus(id: string, status: EquipmentStatus, scheduledDate?: string) {
  setState((s) =>
    withAudit(
      {
        ...s,
        equipmentRequests: s.equipmentRequests.map((r) =>
          r.id === id ? { ...r, status, scheduledDate: scheduledDate ?? r.scheduledDate } : r,
        ),
      },
      `Mengubah status pengajuan alat menjadi "${status}"`,
      "equipment_requests",
    ),
  );
}

export function setSmokeStatus(id: string, status: SmokeStatus) {
  setState((s) =>
    withAudit(
      { ...s, smokeReports: s.smokeReports.map((r) => (r.id === id ? { ...r, status } : r)) },
      `Mengubah status laporan asap menjadi "${status}"`,
      "smoke_reports",
    ),
  );
}

export function updatePriceRef(villageId: string, patch: Partial<PriceRef>) {
  setState((s) =>
    withAudit(
      {
        ...s,
        priceRefs: {
          ...s.priceRefs,
          [villageId]: { ...s.priceRefs[villageId], ...patch, verifiedBy: s.profile.displayName, updatedAt: todayIso() },
        },
      },
      "Memperbarui acuan harga kalkulator",
      "calculator_price_refs",
    ),
  );
}

export function completeVisit(id: string) {
  setState((s) =>
    withAudit(
      { ...s, visitQueue: s.visitQueue.map((v) => (v.id === id ? { ...v, done: true } : v)) },
      "Menandai kunjungan pendampingan selesai",
      "visit_queue",
    ),
  );
}

/* ------------------------------------------------------------------ */
/* Sinkronisasi                                                         */
/* ------------------------------------------------------------------ */

export function markSynced(ids: string[]) {
  setState((s) => ({
    ...s,
    syncQueue: s.syncQueue.filter((op) => !ids.includes(op.id)),
    lastSyncAt: new Date().toISOString(),
  }));
}

