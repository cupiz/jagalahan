import type {
  Harvest,
  PendingVerification,
  PostFireObservation,
  PostFirePlot,
  PriceRef,
  Role,
  SmokeReport,
  EquipmentRequest,
  Village,
} from "@/lib/types";

/**
 * Data contoh (seed) untuk mode demo luring.
 * Struktur data mengikuti docs/DATABASE_SCHEMA.md — tanpa koordinat GPS (Zero-GIS).
 */

export const VILLAGES: Village[] = [
  {
    id: "kalampangan",
    code: "6271011005",
    name: "Desa Kalampangan",
    district: "Kec. Sabangau",
    regency: "Kota Palangka Raya",
    province: "Kalimantan Tengah",
    targetZeroBurnHa: 40,
    consecutiveZeroBurnSeasons: 1,
    chopperUnits: 2,
    coverCropKg: 150,
    localBlocks: ["Blok Kanal Barat RT 03", "Blok Parit Lima", "Blok Tanjung Taruna", "Sekitar Sekat Kanal 2"],
  },
  {
    id: "rantau-panjang",
    code: "1408032004",
    name: "Desa Rantau Panjang",
    district: "Kec. Koto Gasib",
    regency: "Kab. Siak",
    province: "Riau",
    targetZeroBurnHa: 15,
    consecutiveZeroBurnSeasons: 0,
    chopperUnits: 1,
    coverCropKg: 60,
    localBlocks: ["Blok Sungai Rawa", "Blok Parit Haji", "Pinggir Kanal Primer"],
  },
  {
    id: "buatan-baru",
    code: "1408032007",
    name: "Desa Buatan Baru",
    district: "Kec. Koto Gasib",
    regency: "Kab. Siak",
    province: "Riau",
    targetZeroBurnHa: 20,
    consecutiveZeroBurnSeasons: 2,
    chopperUnits: 2,
    coverCropKg: 90,
    localBlocks: ["Blok Kebun Plasma", "Blok Parit Tiga"],
  },
];

export function getVillage(id: string): Village {
  return VILLAGES.find((v) => v.id === id) ?? VILLAGES[0];
}

export const ROLE_LABELS: Record<Role, string> = {
  pekebun_primer: "Pekebun Primer",
  petani_sekunder: "Petani Sekunder",
  penyuluh_tersier: "Penyuluh Tersier",
  warga_penjaga: "Warga Penjaga",
};

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  pekebun_primer: "Pekebun sawit/karet rakyat di lahan gambut (0,5–5 ha).",
  petani_sekunder: "Petani tanaman pangan di lahan kering pinggiran gambut.",
  penyuluh_tersier: "Penyuluh/kader desa: verifikasi tahap & penyaluran bantuan alat.",
  warga_penjaga: "Warga desa: pantau air kanal, lapor asap dini, pantau lahan pasca-kebakaran.",
};

export const ROLE_PERSONA: Record<Role, string> = {
  pekebun_primer: "Pak Darto",
  petani_sekunder: "Bu Sari",
  penyuluh_tersier: "Mas Yudi (Penyuluh)",
  warga_penjaga: "Mbak Rina",
};

export const COMMODITIES = ["Jagung", "Sawit Rakyat (TBS)", "Karet", "Nanas Gambut", "Cabai"] as const;
export const SEASONS = ["Musim 2025", "Musim 2026"] as const;
export const CURRENT_SEASON = "Kemarau 2026";

/** Acuan harga lokal per hektare (diverifikasi penyuluh) — basis gambut, semak sedang. */
export const DEFAULT_PRICE_REF: PriceRef = {
  burnLaborPerHa: 750_000,
  burnAshPerHa: 350_000,
  chopLaborPerHa: 550_000,
  chopperRentalPerHa: 350_000,
  dolomitePerHa: 350_000,
  season2FertilizerSavingPerHa: 400_000,
  verifiedBy: "Mas Yudi (Penyuluh Desa)",
  updatedAt: "2026-09-15",
};

/** Komitmen petani lain per desa (anonim; hanya luas & visibilitas). */
export const OTHER_COMMITMENTS: Record<string, { areaHa: number; isPublic: boolean }[]> = {
  kalampangan: [
    { areaHa: 2, isPublic: true },
    { areaHa: 1.5, isPublic: true },
    { areaHa: 3, isPublic: true },
    { areaHa: 2.5, isPublic: false },
    { areaHa: 1, isPublic: true },
    { areaHa: 2, isPublic: true },
    { areaHa: 4, isPublic: true },
    { areaHa: 1.5, isPublic: false },
    { areaHa: 2, isPublic: true },
    { areaHa: 2.5, isPublic: true },
    { areaHa: 1, isPublic: true },
    { areaHa: 2, isPublic: false },
    { areaHa: 1.5, isPublic: true },
  ],
  "rantau-panjang": [
    { areaHa: 2, isPublic: true },
    { areaHa: 1.5, isPublic: false },
  ],
  "buatan-baru": [
    { areaHa: 2, isPublic: true },
    { areaHa: 2.5, isPublic: true },
    { areaHa: 1, isPublic: true },
    { areaHa: 1.5, isPublic: false },
    { areaHa: 2, isPublic: true },
  ],
};

/** Generator deterministik agar data contoh selalu sama di server & klien. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

interface SeedHarvest extends Harvest {
  villageId: string;
  farmerId: string;
}

function buildHarvests(): SeedHarvest[] {
  const rows: SeedHarvest[] = [];
  const plan: { villageId: string; farmers: number }[] = [
    { villageId: "kalampangan", farmers: 13 },
    { villageId: "rantau-panjang", farmers: 2 },
    { villageId: "buatan-baru", farmers: 6 },
  ];
  const rnd = seeded(42);
  for (const { villageId, farmers } of plan) {
    for (let f = 0; f < farmers; f++) {
      for (const season of SEASONS) {
        for (const commodity of ["Jagung", "Sawit Rakyat (TBS)"]) {
          const isJagung = commodity === "Jagung";
          const areaHa = Math.round((1 + rnd() * 3) * 2) / 2;
          const baseTon = isJagung ? 4.2 : 11.5;
          const seasonBoost = season === "Musim 2026" ? 1.06 : 1;
          const tonPerHa = Math.round(baseTon * seasonBoost * (0.85 + rnd() * 0.3) * 10) / 10;
          const pricePerTon = isJagung ? 4_600_000 : 2_300_000;
          rows.push({
            id: `seed-${villageId}-${f}-${season}-${commodity}`,
            villageId,
            farmerId: `${villageId}-farmer-${f}`,
            season,
            commodity,
            areaHa,
            tonPerHa,
            sacks: Math.round((tonPerHa * areaHa * 1000) / 50),
            revenue: Math.round(tonPerHa * areaHa * pricePerTon),
            cost: Math.round(areaHa * (isJagung ? 6_800_000 : 9_500_000) * (0.9 + rnd() * 0.2)),
            zeroBurn: true,
          });
        }
      }
    }
  }
  return rows;
}

export const SEED_HARVESTS: SeedHarvest[] = buildHarvests();

export const SEED_SMOKE_REPORTS: SmokeReport[] = [
  {
    id: "smoke-1",
    reporter: "Warga (anonim)",
    zone: "Blok Parit Lima",
    intensity: "tipis_putih",
    wind: "Angin ke arah timur, pelan",
    status: "tertangani",
    reportedAt: "2026-09-02T07:15:00+07:00",
  },
  {
    id: "smoke-2",
    reporter: "Warga (anonim)",
    zone: "Sekitar Sekat Kanal 2",
    intensity: "sedang_abu",
    wind: "Angin kencang ke utara",
    status: "dicek_mpk_penyuluh",
    reportedAt: "2026-10-21T16:40:00+07:00",
  },
];

export const SEED_POST_FIRE_PLOTS: PostFirePlot[] = [
  {
    id: "plot-1",
    villageId: "kalampangan",
    label: "Blok Kanal Barat RT 03",
    areaHa: 3.5,
    extinguishedDate: "2026-03-10",
    monitoringMonths: 12,
  },
  {
    id: "plot-2",
    villageId: "rantau-panjang",
    label: "Pinggir Kanal Primer",
    areaHa: 1.2,
    extinguishedDate: "2026-06-01",
    monitoringMonths: 6,
  },
];

export const SEED_POST_FIRE_OBS: PostFireObservation[] = [
  { id: "o1", plotId: "plot-1", month: 1, waterDepthCm: 46, regrowth: "belum_tumbuh", repeatFireSigns: false, notes: "Abu masih tebal, kanal belum disekat.", observedAt: "2026-04-10" },
  { id: "o2", plotId: "plot-1", month: 2, waterDepthCm: 38, regrowth: "tunas_awal", repeatFireSigns: false, notes: "Sekat kanal ditutup gotong royong.", observedAt: "2026-05-10" },
  { id: "o3", plotId: "plot-1", month: 3, waterDepthCm: 31, regrowth: "tunas_awal", repeatFireSigns: false, notes: "Pakis mulai tumbuh.", observedAt: "2026-06-10" },
  { id: "o4", plotId: "plot-1", month: 4, waterDepthCm: 35, regrowth: "tertutup_semak_basah", repeatFireSigns: false, notes: "", observedAt: "2026-07-10" },
  { id: "o5", plotId: "plot-1", month: 5, waterDepthCm: 42, regrowth: "tertutup_semak_basah", repeatFireSigns: true, notes: "Bara kecil di tepi blok, segera dibasahi.", observedAt: "2026-08-10" },
  { id: "o6", plotId: "plot-1", month: 6, waterDepthCm: 36, regrowth: "tertutup_semak_basah", repeatFireSigns: false, notes: "", observedAt: "2026-09-10" },
  { id: "o7", plotId: "plot-2", month: 1, waterDepthCm: 44, regrowth: "belum_tumbuh", repeatFireSigns: false, notes: "", observedAt: "2026-07-01" },
];

export const SEED_PENDING_VERIFICATIONS: PendingVerification[] = [
  { id: "pv-1", farmer: "Pekebun #07", stageSlug: "pencacahan", areaHa: 2, submittedAt: "2026-10-24" },
  { id: "pv-2", farmer: "Pekebun #11", stageSlug: "pengomposan", areaHa: 1.5, submittedAt: "2026-10-25" },
  { id: "pv-3", farmer: "Petani #03", stageSlug: "penanaman", areaHa: 1, submittedAt: "2026-10-27" },
];

export const SEED_EQUIPMENT_REQUESTS: EquipmentRequest[] = [
  {
    id: "eq-1",
    requester: "Pekebun #04",
    isMine: false,
    type: "alat_pencacah",
    areaHa: 3,
    costGap: 450_000,
    status: "dijadwalkan_gilir",
    scheduledDate: "2026-11-03",
    createdAt: "2026-10-20",
  },
  {
    id: "eq-2",
    requester: "Petani #09",
    isMine: false,
    type: "bibit_penutup_tanah",
    areaHa: 1,
    costGap: 150_000,
    status: "menunggu",
    createdAt: "2026-10-26",
  },
];

