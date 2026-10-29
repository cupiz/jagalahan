"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Camera,
  Upload,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Crown,
  Droplets,
  Sprout,
  AlertTriangle,
  FileCode2,
} from "lucide-react";
import { useV2State, saveScanResult, setPlanTier, type ScanRecord } from "@/lib/store";
import { stripExifAndCompress } from "@/lib/privacy/exif-stripper";
import { formatRupiah } from "@/lib/utils";

const PRESETS = [
  {
    id: "preset-1",
    label: "Semak Gambut Lembap (2,0 Ha)",
    landCondition: "Semak Belukar & Pakis Gambut Sedang (2,0 Ha)",
    fireRisk: "Aman (Lembap)" as const,
    waterDepthCm: 28,
    estimatedCompostKg: 480,
    estimatedFertilizerSavedRp: 1_650_000,
    recommendation:
      "Tebas & cacah 10–20 cm, susun di jalur rumpuk, taburkan 2 karung dolomit + larutan EM4.",
  },
  {
    id: "preset-2",
    label: "Tumpukan Mulsa & Serasah Siap Kompos",
    landCondition: "Rumpukan Serasah & Pelepah Tanpa Bakar (1,5 Ha)",
    fireRisk: "Aman (Lembap)" as const,
    waterDepthCm: 24,
    estimatedCompostKg: 620,
    estimatedFertilizerSavedRp: 2_100_000,
    recommendation:
      "Kelembapan mulsa optimal. Balik tumpukan pada hari ke-10 agar matang menjadi kompos organik.",
  },
  {
    id: "preset-3",
    label: "Lahan Gambut Agak Kering (Siaga Kemarau)",
    landCondition: "Semak Kering & Muka Air Menurun (1,0 Ha)",
    fireRisk: "Waspada (Agak Kering)" as const,
    waterDepthCm: 38,
    estimatedCompostKg: 310,
    estimatedFertilizerSavedRp: 1_100_000,
    recommendation:
      "Tutup rapat sekat kanal terdekat untuk menahan air. Cacah semak kering dan basahi jalur rumpuk.",
  },
];

export default function ScannerPage() {
  const state = useV2State();
  const [landCondition, setLandCondition] = useState(PRESETS[0].landCondition);
  const [fireRisk, setFireRisk] = useState<ScanRecord["fireRisk"]>(PRESETS[0].fireRisk);
  const [waterDepthCm, setWaterDepthCm] = useState(String(PRESETS[0].waterDepthCm));
  const [compostKg, setCompostKg] = useState(String(PRESETS[0].estimatedCompostKg));
  const [savedRp, setSavedRp] = useState(String(PRESETS[0].estimatedFertilizerSavedRp));
  const [recommendation, setRecommendation] = useState(PRESETS[0].recommendation);
  const [photoDataUrl, setPhotoDataUrl] = useState<string | undefined>(undefined);
  const [exifNotice, setExifNotice] = useState<string>(
    "Pembersih EXIF/GPS aktif di perangkat (UU PDP No. 27/2022)",
  );
  const [isScanning, setIsScanning] = useState(false);
  const [savedBanner, setSavedBanner] = useState(false);

  const isVip = state.plan === "vip";

  const handleSelectPreset = (preset: (typeof PRESETS)[number]) => {
    setIsScanning(true);
    setTimeout(() => {
      setLandCondition(preset.landCondition);
      setFireRisk(preset.fireRisk);
      setWaterDepthCm(String(preset.waterDepthCm));
      setCompostKg(String(preset.estimatedCompostKg));
      setSavedRp(String(preset.estimatedFertilizerSavedRp));
      setRecommendation(preset.recommendation);
      setIsScanning(false);
    }, 450);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsScanning(true);
    try {
      const stripped = await stripExifAndCompress(file);
      setPhotoDataUrl(stripped.record.dataUrl);
      setExifNotice(
        `Foto diproses (${Math.round(stripped.blob.size / 1024)} KB) • Tag GPS/EXIF berhasil dihapus 100% di browser.`,
      );
      setLandCondition(`Hasil Foto Lahan (${file.name.slice(0, 22)})`);
      setEstimatedValuesFromPhoto(file.size);
    } catch {
      setExifNotice("Gagal memproses gambar, pastikan format JPEG/PNG/WebP.");
    } finally {
      setIsScanning(false);
    }
  };

  const setEstimatedValuesFromPhoto = (seedSize: number) => {
    const kg = 350 + (seedSize % 300);
    const rp = Math.round((kg * 3400) / 50000) * 50000;
    setCompostKg(String(kg));
    setSavedRp(String(rp));
  };

  const handleConfirmAndSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isVip) return;
    saveScanResult({
      landCondition: landCondition.trim() || "Pemindaian Lahan Tanpa Bakar",
      fireRisk,
      waterDepthCm: Number(waterDepthCm) || 28,
      estimatedCompostKg: Number(compostKg) || 400,
      estimatedFertilizerSavedRp: Number(savedRp) || 1_500_000,
      recommendation: recommendation.trim(),
      photoDataUrl,
    });
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 4000);
  };

  const jsonPreview = {
    status: "success",
    scanner_engine: "JagaLahan-Vision-v2",
    privacy_exif_gps_stripped: true,
    extracted_data: {
      kondisi_lahan: landCondition,
      risiko_karhutla: fireRisk,
      tinggi_muka_air_cm: -Math.abs(Number(waterDepthCm) || 28),
      estimasi_kompos_kg: Number(compostKg) || 0,
      penghematan_pupuk_rp: Number(savedRp) || 0,
      auto_kategori_tracking: "Kompos & Mulsa",
    },
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-800 md:flex-row md:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300">
              <Crown className="h-3.5 w-3.5 text-amber-500" />
              Fitur Eksklusif VIP
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300">
              <ShieldCheck className="h-3.5 w-3.5" />
              Auto-Strip EXIF GPS (UU PDP)
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            Smart Land & Smoke Scanner
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Pindai foto semak, rumpukan mulsa, atau tongkat air gambut — AI mengekstrak potensi
            kompos & penghematan pupuk secara otomatis tanpa perlu mengetik manual.
          </p>
        </div>

        {!isVip && (
          <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950/40">
            <Lock className="h-4 w-4 text-amber-600" />
            <span className="text-xs font-bold text-amber-900 dark:text-amber-200">
              Mode {state.plan.toUpperCase()}: Pratinjau Aktif
            </span>
            <button
              type="button"
              onClick={() => setPlanTier("vip")}
              className="rounded-xl bg-amber-500 px-3 py-1.5 text-xs font-extrabold text-white hover:bg-amber-600"
            >
              Aktifkan VIP Instan
            </button>
          </div>
        )}
      </div>

      {savedBanner && (
        <div className="flex items-center justify-between rounded-2xl bg-emerald-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            <span>
              Hasil pemindaian berhasil disimpan ke Tracking Lahan! (+15 Koin Hijau ditambahkan)
            </span>
          </div>
          <Link href="/tracking" className="underline">
            Lihat di Tracking →
          </Link>
        </div>
      )}

      {/* Main Grid: Camera Viewfinder & Presets (Left) + Editable Confirmation Form (Right) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Viewfinder + Upload + JSON Output (6 cols) */}
        <div className="space-y-6 lg:col-span-6">
          <div className="overflow-hidden rounded-3xl bg-slate-900 p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                <Camera className="h-4 w-4" />
                Jendela Bidik AI Smart Scanner
              </span>
              <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-semibold text-slate-300">
                Resolusi Otomatis ≤ 960px
              </span>
            </div>

            {/* Simulated Viewfinder */}
            <div className="relative mt-4 flex h-56 flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-emerald-500/50 bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 p-4 text-center">
              {photoDataUrl ? (
                <img
                  src={photoDataUrl}
                  alt="Hasil Pindai Lahan Tanpa EXIF"
                  className="h-full w-full rounded-xl object-cover"
                />
              ) : (
                <div className="space-y-2">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40">
                    <Sparkles className="h-7 w-7" />
                  </div>
                  <p className="text-sm font-bold text-white">
                    {isScanning ? "Menganalisis Biomassa & Kelembapan..." : landCondition}
                  </p>
                  <p className="text-xs text-emerald-300">
                    Estimasi Biomassa: {compostKg} Kg Kompos • Hemat{" "}
                    {formatRupiah(Number(savedRp) || 0)}
                  </p>
                </div>
              )}

              {/* Viewfinder corner brackets */}
              <div className="pointer-events-none absolute left-3 top-3 h-5 w-5 border-l-2 border-t-2 border-emerald-400" />
              <div className="pointer-events-none absolute right-3 top-3 h-5 w-5 border-r-2 border-t-2 border-emerald-400" />
              <div className="pointer-events-none absolute bottom-3 left-3 h-5 w-5 border-b-2 border-l-2 border-emerald-400" />
              <div className="pointer-events-none absolute bottom-3 right-3 h-5 w-5 border-b-2 border-r-2 border-emerald-400" />
            </div>

            {/* Upload Photo or Choose Sample Preset */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-500">
                <Upload className="h-4 w-4" />
                Unggah Foto Lahan / Semak
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <span className="text-[11px] text-slate-300">{exifNotice}</span>
            </div>

            {/* Sample Presets */}
            <div className="mt-5 border-t border-white/10 pt-4">
              <p className="text-xs font-semibold text-slate-300">
                Atau uji coba dengan contoh skenario pemindaian lahan:
              </p>
              <div className="mt-2.5 grid grid-cols-1 gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectPreset(p)}
                    className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-xs font-semibold transition ${
                      landCondition === p.landCondition
                        ? "bg-emerald-600/30 text-emerald-200 ring-1 ring-emerald-400"
                        : "bg-white/5 text-slate-300 hover:bg-white/10"
                    }`}
                  >
                    <span>{p.label}</span>
                    <span className="font-bold text-emerald-400">
                      +{formatRupiah(p.estimatedFertilizerSavedRp)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* JSON Extraction Preview (like Fintrack AI JSON preview) */}
          <div className="rounded-3xl bg-slate-950 p-5 text-slate-200 shadow-sm ring-1 ring-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                <FileCode2 className="h-4 w-4" />
                Hasil Ekstraksi JSON Otomatis (AI Vision)
              </span>
              <span className="rounded-md bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                200 OK
              </span>
            </div>
            <pre className="mt-3 overflow-x-auto text-[11px] leading-relaxed text-emerald-300">
              {JSON.stringify(jsonPreview, null, 2)}
            </pre>
          </div>
        </div>

        {/* Right: Editable Confirmation Form before Saving (6 cols) */}
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-800 lg:col-span-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Verifikasi Pengguna (Otonomi Penuh)
              </span>
              <h2 className="mt-0.5 text-lg font-extrabold text-slate-900 dark:text-white">
                Periksa & Edit Hasil Pindai Sebelum Disimpan
              </h2>
            </div>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Sesuai prinsip etika teknologi persuasif, hasil AI tidak pernah disimpan sepihak. Anda
            dapat menyunting angka di bawah ini sebelum menekan tombol konfirmasi.
          </p>

          <form onSubmit={handleConfirmAndSave} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Kondisi Vegetasi / Lahan Terdeteksi
              </label>
              <input
                type="text"
                value={landCondition}
                onChange={(e) => setLandCondition(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Status Kerawanan Api
                </label>
                <select
                  value={fireRisk}
                  onChange={(e) => setFireRisk(e.target.value as ScanRecord["fireRisk"])}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold dark:border-slate-700 dark:bg-slate-800"
                >
                  <option value="Aman (Lembap)">Aman (Lembap)</option>
                  <option value="Waspada (Agak Kering)">Waspada (Agak Kering)</option>
                  <option value="Bahaya (Rawan Api)">Bahaya (Rawan Api)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Kedalaman Air Gambut (cm di bawah tanah)
                </label>
                <div className="relative mt-1">
                  <Droplets className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-cyan-600" />
                  <input
                    type="number"
                    value={waterDepthCm}
                    onChange={(e) => setWaterDepthCm(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 pl-9 pr-3.5 py-2.5 text-sm font-semibold dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Estimasi Biomassa Kompos (Kg)
                </label>
                <div className="relative mt-1">
                  <Sprout className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-emerald-600" />
                  <input
                    type="number"
                    value={compostKg}
                    onChange={(e) => setCompostKg(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 pl-9 pr-3.5 py-2.5 text-sm font-semibold dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Nilai Penghematan Pupuk NPK (Rp)
                </label>
                <input
                  type="number"
                  step={50000}
                  value={savedRp}
                  onChange={(e) => setSavedRp(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-extrabold text-emerald-700 dark:border-slate-700 dark:bg-slate-800 dark:text-emerald-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Rekomendasi Tindakan Tanpa Bakar (Tailoring)
              </label>
              <textarea
                rows={3}
                value={recommendation}
                onChange={(e) => setRecommendation(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-xs leading-relaxed dark:border-slate-700 dark:bg-slate-800"
              />
            </div>

            {isVip ? (
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3.5 text-sm font-extrabold text-white shadow-md transition hover:brightness-105"
              >
                <CheckCircle2 className="h-4 w-4" />
                Konfirmasi dan Simpan ke Tracking (+15 Koin)
              </button>
            ) : (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/40">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                  <div>
                    <p className="text-xs font-bold text-amber-900 dark:text-amber-200">
                      Penyimpanan Otomatis Smart Scanner Khusus Paket VIP
                    </p>
                    <p className="mt-0.5 text-[11px] text-amber-800/90 dark:text-amber-300/80">
                      Anda sedang menggunakan paket <strong>{state.plan.toUpperCase()}</strong>.
                      Beralih ke VIP untuk menyimpan hasil scan otomatis ke Tracking Lahan.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setPlanTier("vip")}
                        className="rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-bold text-white hover:bg-amber-600"
                      >
                        Coba Mode VIP Sekarang
                      </button>
                      <Link
                        href="/paket"
                        className="rounded-xl border border-amber-300 bg-white px-3.5 py-2 text-xs font-bold text-amber-900"
                      >
                        Lihat Perbandingan Paket
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </form>

          {/* Riwayat Scan Terakhir */}
          <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              Riwayat Pemindaian Tersimpan ({state.scans.length})
            </h3>
            <div className="mt-2.5 space-y-2">
              {state.scans.slice(0, 3).map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between rounded-2xl bg-slate-50 px-3.5 py-2.5 text-xs dark:bg-slate-800/60"
                >
                  <div>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{s.landCondition}</p>
                    <p className="text-[11px] text-slate-500">
                      {s.scannedAt} • Kompos {s.estimatedCompostKg} Kg • Air -{s.waterDepthCm} cm
                    </p>
                  </div>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                    +{formatRupiah(s.estimatedFertilizerSavedRp)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
