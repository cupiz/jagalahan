export type Role =
  | "pekebun_primer"
  | "petani_sekunder"
  | "penyuluh_tersier"
  | "warga_penjaga";

export type SoilType = "gambut" | "mineral";
export type Density = "ringan" | "sedang" | "tebal";

export interface Village {
  id: string;
  code: string;
  name: string;
  district: string;
  regency: string;
  province: string;
  targetZeroBurnHa: number;
  consecutiveZeroBurnSeasons: number;
  chopperUnits: number;
  coverCropKg: number;
  localBlocks: string[];
}

export interface Profile {
  id: string;
  displayName: string;
  role: Role;
  villageId: string;
  soil: SoilType;
  areaHa: number;
  nextPlantingDate: string;
  ignoredReminders: number;
  remindersPaused: boolean;
}

export type CommitmentStatus = "berjalan" | "tuntas_tanpa_bakar" | "butuh_pendampingan";

export interface Commitment {
  id: string;
  season: string;
  areaHa: number;
  soil: SoilType;
  density: Density;
  isPublic: boolean;
  status: CommitmentStatus;
  createdAt: string;
}

export type StageSlug =
  | "penilaian"
  | "pencacahan"
  | "penumpukan"
  | "pengomposan"
  | "kesiapan"
  | "penanaman";

export type StageStatus = "belum" | "sedang_dikerjakan" | "selesai" | "dilewati";

/** Foto yang sudah melewati pembersih EXIF di perangkat. */
export interface PhotoRecord {
  dataUrl: string;
  hadExif: boolean;
  hadGps: boolean;
  exifStrippedVerified: true;
  bytesBefore: number;
  bytesAfter: number;
}

export interface StageProgress {
  stage: number;
  slug: StageSlug;
  status: StageStatus;
  startedAt?: string;
  completedAt?: string;
  mulchFlipDue?: string;
  mulchFlipped: boolean;
  photo?: PhotoRecord;
  verified: boolean;
  notes?: string;
}

export interface WaterLog {
  id: string;
  date: string;
  depthCm: number;
  canalClosed: boolean;
  penyuluhContacted: boolean;
  photo?: PhotoRecord;
}

export interface Harvest {
  id: string;
  season: string;
  commodity: string;
  areaHa: number;
  tonPerHa: number;
  sacks: number;
  revenue: number;
  cost: number;
  zeroBurn: boolean;
}

export type EquipmentType = "alat_pencacah" | "bibit_penutup_tanah" | "kapur_dolomit_kompos";
export type EquipmentStatus = "menunggu" | "disetujui_penyuluh" | "dijadwalkan_gilir" | "selesai";

export interface EquipmentRequest {
  id: string;
  requester: string;
  isMine: boolean;
  type: EquipmentType;
  areaHa: number;
  costGap: number;
  status: EquipmentStatus;
  scheduledDate?: string;
  createdAt: string;
}

export type SmokeIntensity = "tipis_putih" | "sedang_abu" | "pekat_hitam";
export type SmokeStatus = "baru_dilaporkan" | "dicek_mpk_penyuluh" | "tertangani";

export interface SmokeReport {
  id: string;
  reporter: string;
  zone: string;
  intensity: SmokeIntensity;
  wind: string;
  status: SmokeStatus;
  photo?: PhotoRecord;
  reportedAt: string;
}

export type Regrowth = "belum_tumbuh" | "tunas_awal" | "tertutup_semak_basah" | "ditanami_kembali";

export interface PostFirePlot {
  id: string;
  villageId: string;
  label: string;
  areaHa: number;
  extinguishedDate: string;
  monitoringMonths: number;
}

export interface PostFireObservation {
  id: string;
  plotId: string;
  month: number;
  waterDepthCm: number;
  regrowth: Regrowth;
  repeatFireSigns: boolean;
  notes: string;
  observedAt: string;
}

export interface PriceRef {
  burnLaborPerHa: number;
  burnAshPerHa: number;
  chopLaborPerHa: number;
  chopperRentalPerHa: number;
  dolomitePerHa: number;
  season2FertilizerSavingPerHa: number;
  verifiedBy: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  actor: string;
  action: string;
  scope: string;
  at: string;
}

export interface VisitQueueItem {
  id: string;
  farmer: string;
  reason: string;
  at: string;
  done: boolean;
}

export interface PendingVerification {
  id: string;
  farmer: string;
  stageSlug: StageSlug;
  areaHa: number;
  submittedAt: string;
}

export type VerificationDecision = "diverifikasi" | "perlu_kunjungan";

export interface SyncOp {
  id: string;
  table: string;
  payload: Record<string, unknown>;
  createdAt: string;
}

