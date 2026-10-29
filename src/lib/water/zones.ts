/**
 * Zona muka air tanah gambut berdasarkan PP No. 57 Tahun 2016
 * (batas kritis 0,4 m = 40 cm di bawah permukaan tanah).
 * Setiap zona memakai Warna + Ikon + Pola + Label (aman untuk buta warna).
 */

export type WaterZone = "aman" | "waspada" | "bahaya";

export const WATER_THRESHOLD_CM = 40;

export interface ZoneInfo {
  zone: WaterZone;
  label: string;
  range: string;
  message: string;
  color: string;
  bg: string;
  border: string;
  pattern: string;
}

export const ZONES: Record<WaterZone, ZoneInfo> = {
  aman: {
    zone: "aman",
    label: "Zona Aman",
    range: "0–30 cm",
    message: "Gambut basah & aman (di atas batas 40 cm). Pertahankan sekat kanal tetap tertutup.",
    color: "#0D9488",
    bg: "#CCFBF1",
    border: "border-2 border-solid",
    pattern: "pattern-aman",
  },
  waspada: {
    zone: "waspada",
    label: "Zona Waspada",
    range: "31–40 cm",
    message:
      "Air mendekati batas kritis 40 cm (PP 57/2016). Periksa pintu sekat kanal & tunda penumpukan serasah kering.",
    color: "#B45309",
    bg: "#FEF3C7",
    border: "border-2 border-dashed",
    pattern: "pattern-waspada",
  },
  bahaya: {
    zone: "bahaya",
    label: "Zona Bahaya",
    range: "> 40 cm",
    message: "Air sudah di bawah batas kritis 40 cm. Gambut mudah terbakar — lakukan dua tindakan di bawah ini.",
    color: "#C2410C",
    bg: "#FFEDD5",
    border: "border-[3px] border-double",
    pattern: "pattern-bahaya",
  },
};

export function getZone(depthCm: number): ZoneInfo {
  if (depthCm <= 30) return ZONES.aman;
  if (depthCm <= WATER_THRESHOLD_CM) return ZONES.waspada;
  return ZONES.bahaya;
}

