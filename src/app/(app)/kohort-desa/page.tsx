"use client";

import {
  Award,
  Bell,
  Calendar,
  CheckCircle2,
  EyeOff,
  ShieldCheck,
  Sprout,
  Users,
  Wrench,
} from "lucide-react";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Progress } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { CURRENT_SEASON, getVillage, OTHER_COMMITMENTS } from "@/lib/data/seed";
import { getReminderStatus, MAX_IGNORED, REMINDER_MESSAGES } from "@/lib/reminders";
import {
  addCommitment,
  resumeReminders,
  setCommitmentVisibility,
  updateProfile,
  useAppState,
} from "@/lib/store";
import { formatDate, formatNumber } from "@/lib/utils";

/**
 * F-06 & F-07 — Kohort Desa, Lencana Kolektif, & Kalender Pengingat Pra-Keputusan.
 * - Menampilkan 3 lencana kolektif tingkat desa (Desa Bebas Bakar, Sepuluh Hektare Tanpa Bakar, Musim Kedua Berturut-turut).
 * - Opsi komitmen sukarela: tampil di Kohort Desa atau simpan Pribadi.
 * - Kalender Musim Tanam dengan pemicu H-21, H-14, H-7 dan aturan berhenti eskalasi 3x.
 */
export default function KohortDesaPage() {
  const state = useAppState();
  const village = getVillage(state.profile.villageId);
  const others = OTHER_COMMITMENTS[village.id] ?? [];

  const myLatestCommitment = state.commitments[0];
  const myHa = myLatestCommitment ? myLatestCommitment.areaHa : state.profile.areaHa;
  const totalHa = others.reduce((sum, c) => sum + c.areaHa, 0) + myHa;
  const publicFarmersCount = others.filter((c) => c.isPublic).length + (myLatestCommitment?.isPublic ?? true ? 1 : 0);
  const privateFarmersCount = others.filter((c) => !c.isPublic).length + (myLatestCommitment?.isPublic === false ? 1 : 0);
  const targetPct = Math.min(100, (totalHa / village.targetZeroBurnHa) * 100);

  const reminderStatus = getReminderStatus(state.profile.nextPlantingDate);

  const badges = [
    {
      code: "sepuluh_hektare_tanpa_bakar",
      title: "Sepuluh Hektare Tanpa Bakar",
      desc: "Total lahan komitmen tanpa bakar di desa melampaui 10 ha pada musim berjalan.",
      achieved: totalHa >= 10,
      progressLabel: `${formatNumber(totalHa)} / 10 ha`,
    },
    {
      code: "desa_bebas_bakar",
      title: "Desa Bebas Bakar",
      desc: `Mencapai target kolektif ${village.targetZeroBurnHa} ha tanpa kejadian kebakaran lahan di desa.`,
      achieved: totalHa >= village.targetZeroBurnHa,
      progressLabel: `${formatNumber(totalHa)} / ${village.targetZeroBurnHa} ha`,
    },
    {
      code: "musim_kedua_berturut",
      title: "Musim Kedua Berturut-turut",
      desc: "Komunitas desa mempertahankan pembukaan lahan tanpa bakar selama ≥ 2 musim beruntun.",
      achieved: village.consecutiveZeroBurnSeasons >= 2,
      progressLabel: `${village.consecutiveZeroBurnSeasons} / 2 musim berturut`,
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        icon={Users}
        title={`Kohort ${village.name}`}
        subtitle={`${village.district}, ${village.regency} · Capaian bersama tanpa papan peringkat individu`}
      />

      {/* Papan Progres Kolektif Desa */}
      <Card className="border-2 border-gambut bg-tunas/60">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <Badge variant="default">{CURRENT_SEASON}</Badge>
            <span className="text-xs font-bold text-gambut tabular-nums">
              {Math.round(targetPct)}% dari target desa
            </span>
          </div>
          <CardTitle className="mt-1 text-xl font-extrabold tabular-nums">
            {formatNumber(totalHa)} ha <span className="text-sm font-normal text-kabut">dari {village.targetZeroBurnHa} ha</span>
          </CardTitle>
          <CardDescription className="text-arang">
            Dijaga bersama oleh <strong>{publicFarmersCount} petani publik</strong> dan{" "}
            <strong>{privateFarmersCount} komitmen pribadi (anonim)</strong>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Progress value={targetPct} />
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 rounded-xl bg-white p-2.5">
              <Wrench className="size-4 shrink-0 text-gambut" />
              <div>
                <p className="font-bold text-arang">{village.chopperUnits} Unit Alat Cacah</p>
                <p className="text-[11px] text-kabut">Tersedia gilir di balai desa</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-white p-2.5">
              <Sprout className="size-4 shrink-0 text-gambut" />
              <div>
                <p className="font-bold text-arang">{village.coverCropKg} kg Bibit Penutup</p>
                <p className="text-[11px] text-kabut">Stok benih komunal desa</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3 Lencana Kolektif Desa (Bukan Peringkat Individu) */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Award className="size-5 text-gambut" />
            Lencana Kolektif Desa (Bukan Peringkat Individu)
          </CardTitle>
          <CardDescription>
            Seluruh penghargaan diberikan kepada desa sebagai kesatuan agar membangun gotong royong.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2.5">
          {badges.map((b) => (
            <div
              key={b.code}
              className={`flex items-start justify-between gap-3 rounded-2xl border-2 p-3 ${
                b.achieved ? "border-gambut bg-tunas/60" : "border-slate-200 bg-slate-50"
              }`}
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-base" aria-hidden>
                    {b.achieved ? "🏅" : "🌱"}
                  </span>
                  <p className="text-sm font-bold text-arang">{b.title}</p>
                </div>
                <p className="text-xs text-kabut">{b.desc}</p>
              </div>
              <Badge variant={b.achieved ? "default" : "muted"} className="shrink-0 tabular-nums">
                {b.achieved ? "Diraih" : b.progressLabel}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Sakelar Privasi Komitmen Saya (Commitment & Consistency tanpa paksaan) */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <ShieldCheck className="size-5 text-gambut" />
            Pengaturan Komitmen Musim Tanam Saya
          </CardTitle>
          <CardDescription>
            Anda dapat mengubah visibilitas komitmen kapan saja tanpa kehilangan akses ke panduan maupun bantuan desa.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {myLatestCommitment ? (
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-gambut/20 bg-tunas/40 p-3.5">
              <div>
                <p className="text-sm font-bold text-arang">
                  {myLatestCommitment.season} · {formatNumber(myLatestCommitment.areaHa)} ha ({myLatestCommitment.soil})
                </p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-kabut">
                  {myLatestCommitment.isPublic ? (
                    <>
                      <CheckCircle2 className="size-3.5 text-gambut" /> Ditampilkan di Kohort Desa
                    </>
                  ) : (
                    <>
                      <EyeOff className="size-3.5 text-kabut" /> Disimpan Pribadi (Anonim di Desa)
                    </>
                  )}
                </p>
              </div>
              <Switch
                checked={myLatestCommitment.isPublic}
                onCheckedChange={(checked) => setCommitmentVisibility(myLatestCommitment.id, checked)}
                label="Tampilkan komitmen di Kohort Desa"
              />
            </div>
          ) : (
            <div className="space-y-2 rounded-2xl bg-slate-50 p-3 text-xs text-kabut">
              <p>Anda belum menyimpan komitmen eksplisit musim ini (luas profil: {formatNumber(state.profile.areaHa)} ha).</p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() =>
                    addCommitment({
                      season: CURRENT_SEASON,
                      areaHa: state.profile.areaHa,
                      soil: state.profile.soil,
                      density: "sedang",
                      isPublic: true,
                    })
                  }
                >
                  Ikut Kohort Desa ({formatNumber(state.profile.areaHa)} ha)
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    addCommitment({
                      season: CURRENT_SEASON,
                      areaHa: state.profile.areaHa,
                      soil: state.profile.soil,
                      density: "sedang",
                      isPublic: false,
                    })
                  }
                >
                  Simpan Pribadi
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* F-07: Kalender Musim & Jadwal Pengingat Pra-Keputusan (H-21, H-14, H-7) */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="size-5 text-gambut" />
            Kalender Musim & Pengingat Pra-Keputusan (F-07)
          </CardTitle>
          <CardDescription>
            Pengingat dikirim tepat sebelum keputusan membakar diambil (H-21, H-14, H-7) dan berhenti otomatis setelah{" "}
            {MAX_IGNORED} kali diabaikan.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label htmlFor="planting-date">Tanggal Rencana Buka Lahan / Tanam</Label>
            <Input
              id="planting-date"
              type="date"
              value={state.profile.nextPlantingDate}
              onChange={(e) => updateProfile({ nextPlantingDate: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            {reminderStatus.schedule.map((item) => {
              const msg = REMINDER_MESSAGES[item.offset];
              return (
                <div
                  key={item.offset}
                  className={`flex items-start justify-between gap-2 rounded-xl border p-3 text-xs ${
                    item.state === "aktif"
                      ? "border-gambut bg-tunas"
                      : item.state === "lewat"
                        ? "border-slate-200 bg-slate-50 text-kabut"
                        : "border-gambut/15 bg-white"
                  }`}
                >
                  <div>
                    <p className="font-bold text-arang">
                      {msg.title} <span className="font-normal text-kabut">({formatDate(item.date)})</span>
                    </p>
                    <p className="mt-0.5 text-kabut">{msg.body}</p>
                  </div>
                  <Badge
                    variant={
                      item.state === "aktif" ? "default" : item.state === "lewat" ? "muted" : "secondary"
                    }
                  >
                    {item.state === "aktif" ? "Aktif" : item.state === "lewat" ? "Lewat" : "Terjadwal"}
                  </Badge>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between rounded-xl bg-slate-100 p-3 text-xs">
            <div className="flex items-center gap-2">
              <Bell className="size-4 text-gambut" />
              <span>
                Status eskalasi: <strong>{state.profile.ignoredReminders}/{MAX_IGNORED} kali diabaikan</strong>
              </span>
            </div>
            {state.profile.ignoredReminders > 0 && (
              <Button size="sm" variant="outline" onClick={resumeReminders}>
                Reset Hitungan
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

