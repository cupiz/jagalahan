import { SEED_HARVESTS, VILLAGES, getVillage } from "@/lib/data/seed";
import type { Harvest } from "@/lib/types";

/**
 * Penjaga agregasi privasi N ≥ 5 (cermin dari view SQL v_safe_harvest_aggregates).
 * - Tidak pernah mengembalikan baris individu petani lain.
 * - Jika petani unik di desa < 5, beralih ke rata-rata kecamatan.
 * - Jika kecamatan pun < 5, angka disembunyikan sepenuhnya.
 */

export const PRIVACY_MIN_N = 5;

export type AggregationLevel = "desa" | "kecamatan_fallback" | "disembunyikan";

export interface SafeAggregate {
  level: AggregationLevel;
  villageFarmerCount: number;
  districtFarmerCount: number;
  scopeLabel: string;
  avgTonPerHa: number | null;
  avgRevenuePerHa: number | null;
  avgCostPerHa: number | null;
}

interface Row {
  farmerId: string;
  villageId: string;
  tonPerHa: number;
  revenue: number;
  cost: number;
  areaHa: number;
}

function average(rows: Row[]) {
  const n = rows.length;
  if (!n) return { ton: null, rev: null, cost: null };
  return {
    ton: Math.round((rows.reduce((s, r) => s + r.tonPerHa, 0) / n) * 100) / 100,
    rev: Math.round(rows.reduce((s, r) => s + r.revenue / r.areaHa, 0) / n),
    cost: Math.round(rows.reduce((s, r) => s + r.cost / r.areaHa, 0) / n),
  };
}

export function getSafeHarvestAggregate(params: {
  villageId: string;
  season: string;
  commodity: string;
  myHarvests: Harvest[];
  /** Untuk demo: paksa jumlah petani desa (mis. mensimulasikan N < 5). */
  simulateVillageCount?: number;
}): SafeAggregate {
  const { villageId, season, commodity, myHarvests, simulateVillageCount } = params;
  const village = getVillage(villageId);

  const rows: Row[] = SEED_HARVESTS.filter(
    (h) => h.season === season && h.commodity === commodity && h.zeroBurn,
  ).map((h) => ({ ...h }));

  // Catatan milik pengguna sendiri ikut dihitung (pengguna adalah salah satu petani desa).
  for (const h of myHarvests) {
    if (h.season === season && h.commodity === commodity && h.zeroBurn) {
      rows.push({ ...h, farmerId: "me", villageId });
    }
  }

  let villageRows = rows.filter((r) => r.villageId === villageId);
  if (simulateVillageCount !== undefined) {
    villageRows = villageRows.slice(0, simulateVillageCount);
  }
  const villageN = new Set(villageRows.map((r) => r.farmerId)).size;

  const districtVillageIds = VILLAGES.filter((v) => v.district === village.district).map((v) => v.id);
  const districtRows = rows.filter((r) => districtVillageIds.includes(r.villageId));
  const districtN = new Set(districtRows.map((r) => `${r.villageId}:${r.farmerId}`)).size;

  if (villageN >= PRIVACY_MIN_N) {
    const a = average(villageRows);
    return {
      level: "desa",
      villageFarmerCount: villageN,
      districtFarmerCount: districtN,
      scopeLabel: `Rata-rata ${village.name}`,
      avgTonPerHa: a.ton,
      avgRevenuePerHa: a.rev,
      avgCostPerHa: a.cost,
    };
  }

  if (districtN >= PRIVACY_MIN_N) {
    const a = average(districtRows);
    return {
      level: "kecamatan_fallback",
      villageFarmerCount: villageN,
      districtFarmerCount: districtN,
      scopeLabel: `Rata-rata ${village.district}`,
      avgTonPerHa: a.ton,
      avgRevenuePerHa: a.rev,
      avgCostPerHa: a.cost,
    };
  }

  return {
    level: "disembunyikan",
    villageFarmerCount: villageN,
    districtFarmerCount: districtN,
    scopeLabel: "Belum cukup data",
    avgTonPerHa: null,
    avgRevenuePerHa: null,
    avgCostPerHa: null,
  };
}

