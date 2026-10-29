"use client";

import { useState } from "react";
import {
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Flame,
  ShieldCheck,
  UserCheck,
  Wrench,
} from "lucide-react";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/form";
import { DEFAULT_PRICE_REF, getVillage, SEED_PENDING_VERIFICATIONS } from "@/lib/data/seed";
import {
  completeVisit,
  decideVerification,
  setEquipmentStatus,
  setSmokeStatus,
  updatePriceRef,
  useAppState,
  verifyOwnStage,
} from "@/lib/store";
import { formatDate, formatNumber, formatRupiah, isoDaysFromToday } from "@/lib/utils";

/**
 * Panel Penyuluh Tersier (Authority, Reciprocity, & Tata Kelola Data Independen).
 * - Memverifikasi penyelesaian tahapan petani tanpa menyimpan koordinat GPS.
 * - Menjadwalkan peminjaman alat pencacah gilir desa & bibit penutup tanah.
 * - Memperbarui acuan harga lokal untuk Kalkulator Bakar vs. Tanpa Bakar.
 * - Mencatat seluruh tindakan di Jejak Audit (audit_logs) yang transparan.
 */
export default function PenyuluhPage() {
  const state = useAppState();
  const village = getVillage(state.profile.villageId);
  const currentPrices = state.priceRefs[village.id] ?? DEFAULT_PRICE_REF;

  const [burnLabor, setBurnLabor] = useState<string>(String(currentPrices.burnLaborPerHa));
  const [chopLabor, setChopLabor] = useState<string>(String(currentPrices.chopLaborPerHa));
  const [chopperRental, setChopperRental] = useState<string>(String(currentPrices.chopperRentalPerHa));
  const [dolomite, setDolomite] = useState<string>(String(currentPrices.dolomitePerHa));
  const [savedBanner, setSavedBanner] = useState<string | null>(null);

  function handleSavePrices(e: React.FormEvent) {
    e.preventDefault();
    updatePriceRef(village.id, {
      burnLaborPerHa: Math.max(100_000, Number(burnLabor) || 750_000),
      chopLaborPerHa: Math.max(100_000, Number(chopLabor) || 550_000),
      chopperRentalPerHa: Math.max(50_000, Number(chopperRental) || 350_000),
      dolomitePerHa: Math.max(50_000, Number(dolomite) || 350_000),
    });
    setSavedBanner(`Acuan harga lokal ${village.name} berhasil diperbarui dan dicatat di Audit Log.`);
  }

  return (
    <div className="space-y-4">
      <PageHeader
        icon={ClipboardCheck}
        title="Panel Penyuluh & Kader Desa"
        subtitle={`Verifikasi tahapan, gilir alat cacah, & acuan harga ${village.name}`}
      />

      {savedBanner && (
        <div className="flex items-start gap-2 rounded-2xl border border-gambut bg-tunas p-3 text-xs font-medium text-arang">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-gambut" />
          <span>{savedBanner}</span>
        </div>
      )}

      {/* 1. Verifikasi Kemajuan 6 Tahap Petani */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <UserCheck className="size-5 text-gambut" />
            1. Verifikasi Tahapan Tanpa Bakar
          </CardTitle>
          <CardDescription>
            Verifikasi membuka prioritas peminjaman alat pencacah desa dan lencana kolektif desa.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2.5">
          {/* Verifikasi cepat untuk tahap milik pengguna demo sendiri */}
          <div className="rounded-xl border border-gambut/20 bg-tunas/50 p-3 text-xs">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="font-bold text-arang">
                  Akun Demo Aktif ({state.profile.displayName}) — Tahap {state.currentStage}
                </p>
                <p className="text-kabut">Klik untuk membubuhkan tanda &ldquo;Diverifikasi Penyuluh&rdquo; pada tahap aktif.</p>
              </div>
              <Button
                size="sm"
                onClick={() => {
                  verifyOwnStage(state.currentStage);
                  setSavedBanner(`Tahap ${state.currentStage} milik ${state.profile.displayName} telah diverifikasi.`);
                }}
              >
                Verifikasi Tahap {state.currentStage}
              </Button>
            </div>
          </div>

          {SEED_PENDING_VERIFICATIONS.map((item) => {
            const decision = state.verificationDecisions[item.id];
            return (
              <div
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-gambut/15 bg-white p-3 text-xs"
              >
                <div>
                  <p className="font-bold text-arang">
                    {item.farmer} · Tahap {item.stageSlug.toUpperCase()} ({formatNumber(item.areaHa)} ha)
                  </p>
                  <p className="text-kabut">Diajukan {formatDate(item.submittedAt)} · Foto bebas EXIF GPS</p>
                </div>
                {decision ? (
                  <Badge variant={decision === "diverifikasi" ? "aman" : "waspada"}>
                    {decision === "diverifikasi" ? "✓ Diverifikasi" : "Dijadwalkan Kunjungan"}
                  </Badge>
                ) : (
                  <div className="flex gap-1.5">
                    <Button
                      size="sm"
                      onClick={() =>
                        decideVerification(item.id, "diverifikasi", `${item.farmer} (${item.stageSlug})`)
                      }
                    >
                      Setujui
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        decideVerification(item.id, "perlu_kunjungan", `${item.farmer} (${item.stageSlug})`)
                      }
                    >
                      Kunjungi
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* 2. Penjadwalan Gilir Alat Pencacah & Bibit Penutup Tanah (Reciprocity) */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Wrench className="size-5 text-gambut" />
            2. Antrean Gilir Alat Pencacah & Bibit Desa
          </CardTitle>
          <CardDescription>
            Stok Balai Desa: <strong>{village.chopperUnits} unit alat cacah</strong> &{" "}
            <strong>{village.coverCropKg} kg benih penutup tanah</strong>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2.5">
          {state.equipmentRequests.map((req) => (
            <div
              key={req.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-gambut/15 bg-slate-50 p-3 text-xs"
            >
              <div>
                <p className="font-bold text-arang">
                  {req.requester} · {req.type.replaceAll("_", " ")} ({formatNumber(req.areaHa)} ha)
                </p>
                <p className="text-kabut">
                  Selisih kalkulator: {formatRupiah(req.costGap)} ·{" "}
                  {req.scheduledDate ? `Jadwal gilir: ${formatDate(req.scheduledDate)}` : "Belum dijadwalkan"}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <Badge
                  variant={
                    req.status === "selesai" || req.status === "dijadwalkan_gilir" ? "aman" : "waspada"
                  }
                >
                  {req.status.replaceAll("_", " ")}
                </Badge>
                {req.status === "menunggu" && (
                  <Button
                    size="sm"
                    onClick={() => setEquipmentStatus(req.id, "dijadwalkan_gilir", isoDaysFromToday(3))}
                  >
                    Jadwalkan Gilir
                  </Button>
                )}
                {req.status === "dijadwalkan_gilir" && (
                  <Button size="sm" variant="secondary" onClick={() => setEquipmentStatus(req.id, "selesai")}>
                    Selesai
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 3. Antrean Kunjungan Tatap Muka (Saat 3x Pengingat Diabaikan pada Lahan Gambut) & Tindak Lanjut Asap */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Flame className="size-5 text-bahaya" />
            3. Tindak Lanjut Laporan Asap & Kunjungan Pendampingan
          </CardTitle>
          <CardDescription>
            Petani gambut yang tidak merespons 3x pengingat tidak dikirim spam notifikasi, melainkan dikunjungi secara
            santun oleh penyuluh.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2.5 text-xs">
          {state.visitQueue.length === 0 ? (
            <p className="rounded-xl bg-slate-100 p-2.5 text-kabut">
              Belum ada antrean kunjungan khusus (coba klik &ldquo;Nanti Saja&rdquo; 3 kali di Beranda untuk menguji aturan
              eskalasi).
            </p>
          ) : (
            state.visitQueue.map((v) => (
              <div
                key={v.id}
                className="flex items-center justify-between gap-2 rounded-xl border border-waspada bg-waspada-bg/50 p-3"
              >
                <div>
                  <p className="font-bold text-arang">{v.farmer}</p>
                  <p className="text-kabut">{v.reason}</p>
                </div>
                {v.done ? (
                  <Badge variant="aman">Sudah Dikunjungi</Badge>
                ) : (
                  <Button size="sm" onClick={() => completeVisit(v.id)}>
                    Tandai Sudah Dikunjungi
                  </Button>
                )}
              </div>
            ))
          )}

          {state.smokeReports.map((sm) => (
            <div
              key={sm.id}
              className="flex items-center justify-between gap-2 rounded-xl border border-gambut/15 bg-white p-2.5"
            >
              <div>
                <p className="font-bold text-arang">Asap: {sm.zone}</p>
                <p className="text-kabut">{sm.intensity.replaceAll("_", " ")} · {sm.wind}</p>
              </div>
              {sm.status !== "tertangani" ? (
                <Button size="sm" variant="outline" onClick={() => setSmokeStatus(sm.id, "tertangani")}>
                  Tandai Tertangani MPA
                </Button>
              ) : (
                <Badge variant="aman">Tertangani</Badge>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 4. Pembaruan Acuan Harga Lokal Kalkulator (Authority) */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">4. Perbarui Acuan Harga Lokal Kalkulator ({village.name})</CardTitle>
          <CardDescription>
            Menjaga agar angka Kalkulator Bakar vs. Tanpa Bakar selalu sesuai upah harian di desa.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSavePrices} className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="p-burn">Upah Tebas & Bakar / ha (Rp)</Label>
                <Input
                  id="p-burn"
                  type="number"
                  step="50000"
                  value={burnLabor}
                  onChange={(e) => setBurnLabor(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="p-chop">Upah Tebas & Cacah / ha (Rp)</Label>
                <Input
                  id="p-chop"
                  type="number"
                  step="50000"
                  value={chopLabor}
                  onChange={(e) => setChopLabor(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="p-rent">Sewa Alat Cacah / ha (Rp)</Label>
                <Input
                  id="p-rent"
                  type="number"
                  step="50000"
                  value={chopperRental}
                  onChange={(e) => setChopperRental(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="p-dolo">Kapur Dolomit & Kompos / ha (Rp)</Label>
                <Input
                  id="p-dolo"
                  type="number"
                  step="50000"
                  value={dolomite}
                  onChange={(e) => setDolomite(e.target.value)}
                />
              </div>
            </div>
            <Button type="submit" variant="secondary" className="w-full">
              Simpan & Verifikasi Harga Acuan Desa
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* 5. Jejak Audit Transparan (Audit Logs) */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="size-5 text-gambut" />
            5. Jejak Audit Tata Kelola Data (`audit_logs`)
          </CardTitle>
          <CardDescription>
            Setiap tindakan penyuluh tercatat transparan; tidak ada fitur ekspor data individu untuk penegakan hukum.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-1.5 text-xs">
          {state.auditLogs.slice(0, 6).map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
            >
              <div>
                <p className="font-bold text-arang">{log.action}</p>
                <p className="text-[11px] text-kabut">
                  Oleh: {log.actor} · Tabel: <code>{log.scope}</code>
                </p>
              </div>
              <span className="shrink-0 text-[11px] text-kabut">{formatDate(log.at)}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5 pt-1 text-[11px] text-kabut">
            <ShieldCheck className="size-4 text-gambut" />
            Kepatuhan penuh terhadap UU Pelindungan Data Pribadi (UU No. 27 Tahun 2022).
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

