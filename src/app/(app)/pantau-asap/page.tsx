"use client";

import { useState } from "react";
import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  Flame,
  PlusCircle,
  ShieldCheck,
  Sprout,
  Wind,
} from "lucide-react";
import { PageHeader } from "@/components/layout/app-shell";
import { PhotoUploader } from "@/components/shared/photo-uploader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Segmented, Select, Textarea } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { getVillage, SEED_POST_FIRE_PLOTS } from "@/lib/data/seed";
import { addPostFireObservation, addSmokeReport, useAppState } from "@/lib/store";
import type { PhotoRecord, Regrowth, SmokeIntensity } from "@/lib/types";
import { formatDate, formatNumber } from "@/lib/utils";

/**
 * F-08 — Lapor Asap Dini & Pantau Lahan Pasca-Kebakaran (6–12 Bulan).
 * - Peran Warga Penjaga melaporkan kemunculan asap berdasarkan nama blok/parit desa (BUKAN koordinat GPS kebun).
 * - Memantau petak lahan pasca-kebakaran selama 6–12 bulan (tinggi air, tutupan vegetasi kembali, tanda bara berulang).
 */
export default function PantauAsapPage() {
  const state = useAppState();
  const village = getVillage(state.profile.villageId);

  // State Lapor Asap Dini
  const [zone, setZone] = useState<string>(village.localBlocks[0] ?? "Blok Kanal Barat");
  const [intensity, setIntensity] = useState<SmokeIntensity>("tipis_putih");
  const [wind, setWind] = useState<string>("Angin pelan ke arah utara");
  const [photo, setPhoto] = useState<PhotoRecord | undefined>(undefined);
  const [notice, setNotice] = useState<string | null>(null);

  // State Observasi Pasca-Kebakaran 6–12 Bulan
  const plots = SEED_POST_FIRE_PLOTS;
  const [selectedPlotId, setSelectedPlotId] = useState<string>(plots[0].id);
  const [obsMonth, setObsMonth] = useState<number>(7);
  const [obsWaterCm, setObsWaterCm] = useState<string>("34");
  const [obsRegrowth, setObsRegrowth] = useState<Regrowth>("tertutup_semak_basah");
  const [obsRepeatFire, setObsRepeatFire] = useState<boolean>(false);
  const [obsNotes, setObsNotes] = useState<string>("");

  const activePlot = plots.find((p) => p.id === selectedPlotId) ?? plots[0];
  const plotObs = state.postFireObs
    .filter((o) => o.plotId === activePlot.id)
    .sort((a, b) => a.month - b.month);

  function handleReportSmoke(e: React.FormEvent) {
    e.preventDefault();
    addSmokeReport({
      zone,
      intensity,
      wind,
      photo,
    });
    setPhoto(undefined);
    setNotice(
      `Laporan asap dini di ${zone} berhasil dikirim ke Penyuluh & Masyarakat Peduli Api (MPA) ${village.name}.`,
    );
  }

  function handleSaveObservation(e: React.FormEvent) {
    e.preventDefault();
    addPostFireObservation({
      plotId: activePlot.id,
      month: obsMonth,
      waterDepthCm: Math.max(0, Math.min(150, Number(obsWaterCm) || 35)),
      regrowth: obsRegrowth,
      repeatFireSigns: obsRepeatFire,
      notes: obsNotes,
    });
    setObsNotes("");
    setNotice(`Catatan pemantauan Bulan ke-${obsMonth} untuk ${activePlot.label} berhasil disimpan.`);
  }

  return (
    <div className="space-y-4">
      <PageHeader
        icon={Flame}
        title="Lapor Asap Dini & Pantau Pasca-Bakar"
        subtitle="Kewaspadaan warga desa tanpa menyalahkan individu · Pemantauan pemulihan gambut 6–12 bulan"
      />

      {notice && (
        <div className="flex items-start gap-2 rounded-2xl border border-gambut bg-tunas p-3 text-xs font-medium text-arang">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-gambut" />
          <span>{notice}</span>
        </div>
      )}

      {/* Bagian 1: Formulir Lapor Asap Dini (Tingkat Blok/Parit Desa, Tanpa GPS Individu) */}
      <Card className="border-2 border-bahaya/30">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Wind className="size-5 text-bahaya" />
              1. Lapor Asap Dini Tingkat Blok Desa
            </CardTitle>
            <Badge variant="outline">Tanpa Titik GPS</Badge>
          </div>
          <CardDescription>
            Pilih nama blok/parit umum agar MPA & Penyuluh dapat segera membasahi lokasi sebelum api membesar.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleReportSmoke} className="space-y-3">
            <div>
              <Label htmlFor="smoke-zone">Blok / Parit Lokasi Asap ({village.name})</Label>
              <Select id="smoke-zone" value={zone} onChange={(e) => setZone(e.target.value)}>
                {village.localBlocks.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label>Kepekatan Asap</Label>
              <Segmented
                ariaLabel="Kepekatan asap"
                value={intensity}
                onChange={setIntensity}
                options={[
                  { value: "tipis_putih", label: "Tipis Putih", hint: "gejala awal" },
                  { value: "sedang_abu", label: "Sedang Abu", hint: "mulai meluas" },
                  { value: "pekat_hitam", label: "Pekat Hitam", hint: "butuh MPA segera" },
                ]}
              />
            </div>

            <div>
              <Label htmlFor="smoke-wind">Arah Angin & Catatan Singkat</Label>
              <Input
                id="smoke-wind"
                value={wind}
                onChange={(e) => setWind(e.target.value)}
                placeholder="Mis: Angin kencang ke arah timur dekat sekat kanal"
              />
            </div>

            <PhotoUploader
              label="Foto asap dari kejauhan (opsional, EXIF GPS dihapus)"
              value={photo}
              onChange={setPhoto}
            />

            <Button type="submit" variant="warning" className="w-full">
              <Flame /> Kirim Laporan Asap Dini ke MPA & Penyuluh Desa
            </Button>
          </form>

          {/* Daftar Laporan Asap Terkini */}
          <div className="mt-4 space-y-2 border-t border-gambut/10 pt-3">
            <p className="text-xs font-bold uppercase tracking-wider text-kabut">Status Laporan Asap Desa</p>
            {state.smokeReports.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between gap-2 rounded-xl border border-gambut/10 bg-slate-50 p-2.5 text-xs"
              >
                <div>
                  <p className="font-bold text-arang">
                    {r.zone} · <span className="font-normal text-kabut">{r.intensity.replace("_", " ")}</span>
                  </p>
                  <p className="text-[11px] text-kabut">
                    {r.wind} · {formatDate(r.reportedAt)}
                  </p>
                </div>
                <Badge
                  variant={
                    r.status === "tertangani"
                      ? "aman"
                      : r.status === "dicek_mpk_penyuluh"
                        ? "waspada"
                        : "bahaya"
                  }
                >
                  {r.status.replaceAll("_", " ")}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bagian 2: Pemantauan Lahan Pasca-Kebakaran (6–12 Bulan) */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarClock className="size-5 text-gambut" />
              2. Pantau Lahan Pasca-Kebakaran (6–12 Bulan)
            </CardTitle>
            <Badge variant="secondary">Cegah Bakar Ulang</Badge>
          </div>
          <CardDescription>
            Lahan gambut yang pernah terbakar rawan menyala kembali di musim kemarau berikutnya bila tidak dipantau
            selama 6–12 bulan.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="plot-select">Pilih Petak Pemantauan Pasca-Kebakaran</Label>
            <Select
              id="plot-select"
              value={selectedPlotId}
              onChange={(e) => setSelectedPlotId(e.target.value)}
            >
              {plots.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label} ({formatNumber(p.areaHa)} ha — Padam {formatDate(p.extinguishedDate)}, Pantau{" "}
                  {p.monitoringMonths} bln)
                </option>
              ))}
            </Select>
          </div>

          {/* Linimasa 12 Bulan */}
          <div>
            <p className="mb-1.5 text-xs font-bold text-arang">
              Linimasa Pemulihan ({plotObs.length} dari {activePlot.monitoringMonths} bulan tercatat)
            </p>
            <div className="grid grid-cols-6 gap-1.5">
              {Array.from({ length: activePlot.monitoringMonths }, (_, i) => i + 1).map((m) => {
                const found = plotObs.find((o) => o.month === m);
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setObsMonth(m)}
                    className={`flex flex-col items-center justify-center rounded-xl border p-2 text-xs font-bold tabular-nums ${
                      obsMonth === m
                        ? "border-2 border-gambut bg-gambut text-white"
                        : found?.repeatFireSigns
                          ? "border-bahaya bg-bahaya-bg text-[#9a3412]"
                          : found
                            ? "border-gambut/30 bg-tunas text-gambut-900"
                            : "border-slate-200 bg-slate-50 text-kabut"
                    }`}
                  >
                    <span>Bln {m}</span>
                    <span className="text-[10px] font-normal">
                      {found ? `${found.waterDepthCm}cm` : "—"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Riwayat Observasi Bulan Terpilih / Daftar */}
          <div className="space-y-1.5 rounded-2xl bg-slate-50 p-3 text-xs">
            <p className="font-bold text-arang">Catatan Bulan yang Sudah Diperiksa:</p>
            {plotObs.map((o) => (
              <div key={o.id} className="flex items-start justify-between gap-2 border-b border-slate-200 pb-1.5 last:border-none">
                <div>
                  <span className="font-bold text-arang">Bulan ke-{o.month}:</span>{" "}
                  <span>Air {o.waterDepthCm} cm · {o.regrowth.replaceAll("_", " ")}</span>
                  {o.notes && <p className="text-[11px] text-kabut">{o.notes}</p>}
                </div>
                {o.repeatFireSigns ? (
                  <Badge variant="bahaya">
                    <AlertTriangle /> Tanda Bara
                  </Badge>
                ) : (
                  <Badge variant="aman">
                    <Sprout /> Aman
                  </Badge>
                )}
              </div>
            ))}
          </div>

          {/* Form Input Observasi Bulanan */}
          <form onSubmit={handleSaveObservation} className="space-y-3 border-t border-gambut/10 pt-3">
            <p className="text-xs font-bold uppercase tracking-wider text-gambut">
              Isi / Perbarui Observasi Bulan ke-{obsMonth}
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="obs-water">Kedalaman Air (cm)</Label>
                <Input
                  id="obs-water"
                  type="number"
                  min="0"
                  max="150"
                  value={obsWaterCm}
                  onChange={(e) => setObsWaterCm(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="obs-regrowth">Kondisi Tumbuhan Kembali</Label>
                <Select
                  id="obs-regrowth"
                  value={obsRegrowth}
                  onChange={(e) => setObsRegrowth(e.target.value as Regrowth)}
                >
                  <option value="belum_tumbuh">Belum tumbuh</option>
                  <option value="tunas_awal">Tunas & pakis awal</option>
                  <option value="tertutup_semak_basah">Tertutup semak basah</option>
                  <option value="ditanami_kembali">Sudah ditanami kembali</option>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-slate-100 p-3 text-xs">
              <div>
                <p className="font-bold text-arang">Apakah ditemukan tanda bara / asap berulang?</p>
                <p className="text-kabut">Jika aktif, petak ditandai untuk pembasahan prioritas MPA.</p>
              </div>
              <Switch
                checked={obsRepeatFire}
                onCheckedChange={setObsRepeatFire}
                label="Tanda bara berulang ditemukan"
              />
            </div>

            <div>
              <Label htmlFor="obs-notes">Catatan Lapangan</Label>
              <Textarea
                id="obs-notes"
                value={obsNotes}
                onChange={(e) => setObsNotes(e.target.value)}
                placeholder="Mis: Sekat kanal masih rapat, bibit nanas gambut mulai tumbuh..."
              />
            </div>

            <Button type="submit" className="w-full">
              <PlusCircle /> Simpan Observasi Bulan ke-{obsMonth}
            </Button>
          </form>

          <div className="flex items-center gap-2 text-xs text-kabut">
            <ShieldCheck className="size-4 shrink-0 text-gambut" />
            Pemantauan berfokus pada pemulihan ekologis blok desa, bukan pengawasan individu.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

