"use client";

import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Droplets,
  Flame,
  Info,
  Lock,
  PhoneCall,
  PlusCircle,
  ShieldAlert,
} from "lucide-react";
import { PageHeader } from "@/components/layout/app-shell";
import { PhotoUploader } from "@/components/shared/photo-uploader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { addWaterLog, updateWaterLog, useAppState } from "@/lib/store";
import type { PhotoRecord } from "@/lib/types";
import { cn, formatDate, isoDaysFromToday, todayIso } from "@/lib/utils";
import { getZone, WATER_THRESHOLD_CM, ZONES } from "@/lib/water/zones";

const TICKS_CM = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

/**
 * F-04 — Tongkat Ukur Muka Air Tanah Gambut.
 * - Tongkat PVC/bambu 1 meter bertanda tiap 10 cm.
 * - Ambang kritis 0,4 m (40 cm) sesuai PP No. 57 Tahun 2016.
 * - 3 zona ramah buta warna (Warna + Ikon + Pola + Label).
 * - Minggu terlewat ditampilkan dengan abu-abu netral non-menghakimi (#64748B).
 * - Saat > 40 cm (Zona Bahaya), muncul tepat 2 tindakan konkret: Tutup Sekat Kanal & Hubungi Penyuluh Desa.
 */
export default function MukaAirPage() {
  const state = useAppState();
  const latest = state.waterLogs[state.waterLogs.length - 1];

  const [depthCm, setDepthCm] = useState<number>(latest?.depthCm ?? 36);
  const [photo, setPhoto] = useState<PhotoRecord | undefined>(undefined);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const currentZone = getZone(depthCm);

  // Susun 4 slot mingguan terakhir (M-3, M-2, M-1, Minggu Ini) untuk mendemonstrasikan minggu terlewat non-menghakimi
  const fourWeeks = [
    { label: "Minggu 1", targetIso: isoDaysFromToday(-21), log: state.waterLogs[0] ?? null },
    { label: "Minggu 2", targetIso: isoDaysFromToday(-14), log: null }, // sengaja kosong bila belum diisi untuk contoh minggu terlewat
    { label: "Minggu 3", targetIso: isoDaysFromToday(-7), log: state.waterLogs[1] ?? null },
    {
      label: "Minggu Ini",
      targetIso: todayIso(),
      log: state.waterLogs.length >= 3 ? state.waterLogs[state.waterLogs.length - 1] : null,
    },
  ];

  function handleSaveReading() {
    addWaterLog({
      date: todayIso(),
      depthCm,
      canalClosed: depthCm > WATER_THRESHOLD_CM ? false : false,
      penyuluhContacted: false,
      photo,
    });
    setPhoto(undefined);
    setSavedNotice(
      `Catatan kedalaman muka air ${depthCm} cm (${currentZone.label}) berhasil disimpan untuk minggu ini.`,
    );
  }

  function handleEmergencyAction(field: "canalClosed" | "penyuluhContacted") {
    if (latest) {
      updateWaterLog(latest.id, { [field]: true });
    } else {
      addWaterLog({
        date: todayIso(),
        depthCm,
        canalClosed: field === "canalClosed",
        penyuluhContacted: field === "penyuluhContacted",
      });
    }
    setSavedNotice(
      field === "canalClosed"
        ? "Tindakan 1 tercatat: Pintu sekat kanal desa telah ditutup untuk menahan air."
        : "Tindakan 2 tercatat: Permintaan bantuan pemadaman/pembasahan telah dikirim ke Penyuluh & MPA Desa.",
    );
  }

  return (
    <div className="space-y-4">
      <PageHeader
        icon={Droplets}
        title="Tongkat Ukur Muka Air Gambut"
        subtitle="Pantau ambang kritis 0,4 meter (40 cm — PP No. 57 Tahun 2016) dengan tongkat 1 meter"
      />

      {savedNotice && (
        <div className="flex items-start gap-2 rounded-2xl border border-gambut bg-tunas p-3 text-xs font-medium text-arang">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-gambut" />
          <span>{savedNotice}</span>
        </div>
      )}

      {/* Visualisasi Interaktif Tongkat Ukur 1 Meter (Skala per 10 cm) */}
      <Card className={cn(currentZone.border, currentZone.pattern)} style={{ borderColor: currentZone.color }}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-2">
            <Badge variant={currentZone.zone}>
              {currentZone.zone === "aman" && <CheckCircle2 />}
              {currentZone.zone === "waspada" && <AlertTriangle />}
              {currentZone.zone === "bahaya" && <Flame />}
              {currentZone.label} ({currentZone.range})
            </Badge>
            <span className="text-xs font-bold text-kabut">Batas PP 57/2016: 40 cm</span>
          </div>
          <CardTitle className="mt-1 text-2xl font-extrabold tabular-nums">
            {depthCm} cm <span className="text-sm font-normal text-kabut">di bawah permukaan tanah</span>
          </CardTitle>
          <CardDescription className="text-arang">{currentZone.message}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Ilustrasi Tongkat Ukur PVC/Bambu 100 cm */}
          <div className="flex items-stretch gap-4 rounded-2xl bg-white/95 p-3.5 shadow-inner">
            {/* Batang Tongkat Vertikal */}
            <div className="relative flex h-56 w-20 shrink-0 flex-col justify-between rounded-xl border-2 border-arang/30 bg-amber-50 px-2 py-2">
              {/* Air tanah naik dari bawah sesuai kedalaman */}
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 rounded-b-lg bg-teal-500/30 transition-all"
                style={{ height: `${Math.max(0, 100 - depthCm)}%` }}
              />
              {/* Garis merah batas kritis 40 cm */}
              <div
                className="pointer-events-none absolute inset-x-0 border-t-2 border-dashed border-bahaya"
                style={{ top: "40%" }}
              />
              {TICKS_CM.filter((t) => t % 20 === 0).map((tick) => (
                <div key={tick} className="relative z-10 flex items-center justify-between text-[10px] font-bold tabular-nums text-arang">
                  <span>—</span>
                  <span>{tick} cm</span>
                </div>
              ))}
            </div>

            {/* Kontrol Geser & Tombol Cepat */}
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <p className="text-xs font-bold text-arang">Geser sesuai batas basah pada tongkat ukur (0–100 cm):</p>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={2}
                  value={depthCm}
                  onChange={(e) => setDepthCm(Number(e.target.value))}
                  className="mt-2 w-full accent-[#1B5E3A]"
                  aria-label="Kedalaman muka air tanah dalam sentimeter"
                />
                <div className="mt-2 grid grid-cols-3 gap-1.5">
                  {[
                    { cm: 22, label: "22 cm (Aman)" },
                    { cm: 36, label: "36 cm (Waspada)" },
                    { cm: 48, label: "48 cm (Bahaya)" },
                  ].map((preset) => (
                    <button
                      key={preset.cm}
                      type="button"
                      onClick={() => setDepthCm(preset.cm)}
                      className={cn(
                        "rounded-lg border px-2 py-1.5 text-[11px] font-bold tabular-nums",
                        depthCm === preset.cm
                          ? "border-gambut bg-gambut text-white"
                          : "border-gambut/20 bg-white text-arang hover:bg-tunas",
                      )}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-3">
                <PhotoUploader
                  label="Foto tongkat ukur (opsional)"
                  value={photo}
                  onChange={setPhoto}
                />
                <Button className="w-full" onClick={handleSaveReading}>
                  <PlusCircle /> Simpan Catatan Minggu Ini ({depthCm} cm)
                </Button>
              </div>
            </div>
          </div>

          {/* Keterangan 3 Zona Ramah Buta Warna (Warna + Ikon + Pola + Label) */}
          <div className="grid grid-cols-3 gap-2 text-[11px]">
            {(["aman", "waspada", "bahaya"] as const).map((key) => {
              const z = ZONES[key];
              return (
                <div
                  key={key}
                  className={cn("rounded-xl p-2", z.border, z.pattern)}
                  style={{ borderColor: z.color, backgroundColor: z.bg }}
                >
                  <p className="flex items-center gap-1 font-extrabold text-arang">
                    {key === "aman" && <CheckCircle2 className="size-3.5 shrink-0 text-[#0D9488]" />}
                    {key === "waspada" && <AlertTriangle className="size-3.5 shrink-0 text-[#B45309]" />}
                    {key === "bahaya" && <ShieldAlert className="size-3.5 shrink-0 text-[#C2410C]" />}
                    {z.label}
                  </p>
                  <p className="mt-0.5 font-semibold tabular-nums text-arang">{z.range}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Kotak 2 Tindakan Konkret Saat Berada di Zona Bahaya (> 40 cm) */}
      {depthCm > WATER_THRESHOLD_CM && (
        <Card className="border-[3px] border-double border-bahaya bg-bahaya-bg/80">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base text-[#9a3412]">
              <Flame className="size-5" />
              Zona Bahaya (&gt; 40 cm): 2 Tindakan Konkret Segera
            </CardTitle>
            <CardDescription className="text-arang">
              Permukaan gambut sangat kering dan rawan terbakar. Lakukan dua langkah praktis berikut:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5">
            <Button
              variant="warning"
              className="w-full justify-start"
              onClick={() => handleEmergencyAction("canalClosed")}
            >
              <Lock /> 1. Tutup Pintu Sekat Kanal Desa Sekarang
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start border-bahaya text-[#9a3412]"
              onClick={() => handleEmergencyAction("penyuluhContacted")}
            >
              <PhoneCall /> 2. Hubungi Penyuluh / MPA Desa untuk Pembasahan
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Grafik Riwayat 4 Minggu Terakhir (Termasuk Contoh Minggu Terlewat Non-Menghakimi) */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Riwayat 4 Minggu Musim Kering</CardTitle>
          <CardDescription>
            Garis putus-putus menunjukkan ambang batas <strong>40 cm (PP No. 57 Tahun 2016)</strong>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-4 gap-2 pt-1">
            {fourWeeks.map((w) => {
              if (!w.log) {
                return (
                  <div
                    key={w.label}
                    className="flex flex-col items-center justify-between rounded-xl border border-dashed border-slate-300 bg-slate-100 p-2.5 text-center"
                  >
                    <span className="text-[11px] font-bold text-kabut">{w.label}</span>
                    <span className="my-3 rounded-lg bg-slate-200 px-2 py-1 text-[10px] font-semibold text-kabut">
                      Belum tercatat
                    </span>
                    <span className="text-[10px] text-kabut">Tidak apa-apa</span>
                  </div>
                );
              }
              const z = getZone(w.log.depthCm);
              return (
                <div
                  key={w.label}
                  className={cn("flex flex-col items-center justify-between rounded-xl p-2.5 text-center", z.border, z.pattern)}
                  style={{ borderColor: z.color, backgroundColor: z.bg }}
                >
                  <span className="text-[11px] font-bold text-arang">{w.label}</span>
                  <span className="my-2 text-lg font-extrabold tabular-nums text-arang">{w.log.depthCm} cm</span>
                  <span className="text-[10px] font-bold text-arang">{z.label.replace("Zona ", "")}</span>
                </div>
              );
            })}
          </div>

          {/* Pesan Non-Menghakimi untuk Minggu yang Terlewat */}
          <div className="flex items-start gap-2 rounded-xl bg-slate-100 p-3 text-xs text-kabut">
            <Info className="mt-0.5 size-4 shrink-0 text-kabut" />
            <span>
              <strong>Desain Non-Menghakimi:</strong> Minggu ke-2 yang belum tercatat ditampilkan dengan warna abu-abu
              netral (bukan merah menyala). <em>Tidak apa-apa jika terlewat, bisa dimulai lagi minggu ini.</em>
            </span>
          </div>

          {/* Daftar Catatan Tersimpan */}
          <div className="space-y-1.5 pt-1">
            <p className="text-xs font-bold uppercase tracking-wider text-kabut">Semua Log Tersimpan</p>
            {state.waterLogs
              .slice()
              .reverse()
              .map((log) => {
                const z = getZone(log.depthCm);
                return (
                  <div
                    key={log.id}
                    className="flex items-center justify-between rounded-xl border border-gambut/10 bg-white px-3 py-2 text-xs"
                  >
                    <div>
                      <span className="font-bold text-arang">{formatDate(log.date)}</span>
                      <span className="ml-2 text-kabut">
                        {log.canalClosed ? "· Sekat ditutup" : ""}
                        {log.penyuluhContacted ? " · Penyuluh dihubungi" : ""}
                      </span>
                    </div>
                    <Badge variant={z.zone} className="tabular-nums">
                      {log.depthCm} cm · {z.label}
                    </Badge>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

