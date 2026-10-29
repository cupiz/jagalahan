import type { Density, PriceRef, SoilType } from "@/lib/types";

/**
 * Mesin Kalkulator Bakar vs. Tanpa Bakar (F-02).
 * Prinsip: transparan & jujur — selisih biaya musim pertama TIDAK disembunyikan.
 * Seluruh rumus ditampilkan ke pengguna melalui modal "Lihat cara hitung".
 */

export const DENSITY_LABOR_MULTIPLIER: Record<Density, number> = {
  ringan: 0.8,
  sedang: 1,
  tebal: 1.3,
};

export const SOIL_DOLOMITE_MULTIPLIER: Record<SoilType, number> = {
  gambut: 1,
  mineral: 0.4,
};

export const SOIL_ASH_MULTIPLIER: Record<SoilType, number> = {
  gambut: 1,
  mineral: 0.8,
};

export const SOIL_SEASON2_MULTIPLIER: Record<SoilType, number> = {
  gambut: 1,
  mineral: 0.75,
};

export interface CostInput {
  areaHa: number;
  soil: SoilType;
  density: Density;
  borrowVillageChopper: boolean;
  prices: PriceRef;
}

export interface CostLine {
  label: string;
  amount: number;
  formula: string;
  note?: string;
}

export interface CostResult {
  burn: { lines: CostLine[]; total: number; risks: string[] };
  zeroBurn: { lines: CostLine[]; total: number; benefits: string[] };
  /** Positif = tanpa bakar lebih mahal di musim pertama. */
  season1Gap: number;
  chopperRental: number;
  season2FertilizerSaving: number;
  /** Total dua musim (musim 1 + proyeksi musim 2). */
  twoSeason: { burn: number; zeroBurn: number; difference: number };
}

const rp = (n: number) => `Rp${Math.round(n).toLocaleString("id-ID")}`;

export function calculateCosts(input: CostInput): CostResult {
  const { areaHa, soil, density, borrowVillageChopper, prices } = input;
  const dm = DENSITY_LABOR_MULTIPLIER[density];
  const ha = Math.max(0.5, Math.min(5, areaHa));

  const burnLabor = prices.burnLaborPerHa * dm * ha;
  const burnAsh = prices.burnAshPerHa * SOIL_ASH_MULTIPLIER[soil] * ha;

  const chopLabor = prices.chopLaborPerHa * dm * ha;
  const chopperRental = prices.chopperRentalPerHa * dm * ha;
  const dolomite = prices.dolomitePerHa * SOIL_DOLOMITE_MULTIPLIER[soil] * ha;
  const season2Saving = prices.season2FertilizerSavingPerHa * SOIL_SEASON2_MULTIPLIER[soil] * ha;

  const burnLines: CostLine[] = [
    {
      label: "Upah tebas & bakar",
      amount: burnLabor,
      formula: `${rp(prices.burnLaborPerHa)}/ha × ${dm} (semak ${density}) × ${ha} ha`,
    },
    {
      label: "Penanganan sisa abu & sekat api",
      amount: burnAsh,
      formula: `${rp(prices.burnAshPerHa)}/ha × ${SOIL_ASH_MULTIPLIER[soil]} (tanah ${soil}) × ${ha} ha`,
    },
  ];

  const zeroLines: CostLine[] = [
    {
      label: "Upah tebas & cacah",
      amount: chopLabor,
      formula: `${rp(prices.chopLaborPerHa)}/ha × ${dm} (semak ${density}) × ${ha} ha`,
    },
    {
      label: borrowVillageChopper ? "Alat pencacah gilir desa (dipinjamkan)" : "Sewa alat pencacah",
      amount: borrowVillageChopper ? 0 : chopperRental,
      formula: borrowVillageChopper
        ? `Rp0 — dipinjam dari balai desa (hemat ${rp(chopperRental)})`
        : `${rp(prices.chopperRentalPerHa)}/ha × ${dm} × ${ha} ha`,
      note: borrowVillageChopper ? `Hemat ${rp(chopperRental)}` : undefined,
    },
    {
      label: "Kapur dolomit & dekomposer",
      amount: dolomite,
      formula: `${rp(prices.dolomitePerHa)}/ha × ${SOIL_DOLOMITE_MULTIPLIER[soil]} (tanah ${soil}) × ${ha} ha`,
    },
  ];

  const burnTotal = burnLines.reduce((s, l) => s + l.amount, 0);
  const zeroTotal = zeroLines.reduce((s, l) => s + l.amount, 0);

  // Proyeksi musim 2: biaya pembukaan diasumsikan sama, cara bakar butuh pupuk tambahan
  // karena unsur hara (nitrogen) ikut menguap saat dibakar.
  const twoBurn = burnTotal * 2 + season2Saving;
  const twoZero = zeroTotal * 2;

  return {
    burn: {
      lines: burnLines,
      total: burnTotal,
      risks: [
        "Nitrogen & bahan organik ikut menguap — pupuk musim ke-2 naik.",
        soil === "gambut"
          ? "Gambut kering bisa terbakar di bawah permukaan dan menyala ulang."
          : "Api dapat merambat ke lahan gambut tetangga saat kemarau.",
        "Asap berdampak pada kesehatan keluarga & sekolah desa.",
      ],
    },
    zeroBurn: {
      lines: zeroLines,
      total: zeroTotal,
      benefits: [
        "Serasah menjadi mulsa/kompos — tanah lebih lembap.",
        `Proyeksi hemat pupuk musim ke-2 sekitar ${rp(season2Saving)}.`,
        "Membuka akses prioritas alat cacah & benih penutup tanah desa.",
      ],
    },
    season1Gap: zeroTotal - burnTotal,
    chopperRental,
    season2FertilizerSaving: season2Saving,
    twoSeason: { burn: twoBurn, zeroBurn: twoZero, difference: twoBurn - twoZero },
  };
}

