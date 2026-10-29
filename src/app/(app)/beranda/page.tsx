"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Award,
  Bell,
  BellOff,
  BookOpen,
  Calculator,
  CheckCircle2,
  ClipboardCheck,
  Droplets,
  Flame,
  ListChecks,
  ShieldCheck,
  Sprout,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/form";
import { getVillage, OTHER_COMMITMENTS, ROLE_DESCRIPTIONS, ROLE_LABELS } from "@/lib/data/seed";
import { getReminderStatus, MAX_IGNORED, REMINDER_MESSAGES } from "@/lib/reminders";
import { ignoreReminder, respondReminder, resumeReminders, useAppState } from "@/lib/store";
import { formatDate, formatNumber } from "@/lib/utils";
import { getZone } from "@/lib/water/zones";

export default function BerandaPage() {
  const state = useAppState();
  const village = getVillage(state.profile.villageId);
  const reminder = getReminderStatus(state.profile.nextPlantingDate);
  const activeReminder = reminder.active ? REMINDER_MESSAGES[reminder.active] : null;

  const completedStages = state.stages.filter((s) => s.status === "selesai").length;
  const stagePct = (completedStages / 6) * 100;

  const latestWater = state.waterLogs[state.waterLogs.length - 1];
  const waterZone = latestWater ? getZone(latestWater.depthCm) : null;

  const others = OTHER_COMMITMENTS[village.id] ?? [];
  const totalCommittedHa =
    others.reduce((sum, c) => sum + c.areaHa, 0) +
    state.commitments.reduce((sum, c) => sum + c.areaHa, 0) +
    (state.commitments.length === 0 ? state.profile.areaHa : 0);
  const totalFarmers = others.length + 1;

  return (
    <div className="space-y-4">
      <PageHeader
        icon={Sprout}
        title={`Halo, ${state.profile.displayName}`}
        subtitle={`${ROLE_LABELS[state.profile.role]} · ${village.name} (${formatNumber(state.profile.areaHa)} ha lahan ${state.profile.soil})`}
      />

      {/* Kartu Peran Aktif & Pintasan Peran */}
      <Card className="border-gambut/20 bg-tunas/60">
        <CardContent className="p-3.5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <Badge variant="default" className="mb-1">
                Peran Aktif: {ROLE_LABELS[state.profile.role]}
              </Badge>
              <p className="text-xs leading-relaxed text-arang">{ROLE_DESCRIPTIONS[state.profile.role]}</p>
            </div>
            <Link
              href="/profil"
              className="shrink-0 rounded-lg bg-white px-2.5 py-1.5 text-xs font-bold text-gambut shadow-sm hover:bg-white/90"
            >
              Profil & Privasi
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* F-07: Pengingat Pra-Keputusan (H-21, H-14, H-7) dengan aturan berhenti 3x */}
      <Card className="border-2 border-gambut/25">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="flex items-center gap-2 text-base">
              {state.profile.remindersPaused ? (
                <BellOff className="size-5 text-kabut" />
              ) : (
                <Bell className="size-5 text-gambut" />
              )}
              Pengingat Pra-Keputusan Musim Tanam
            </CardTitle>
            <Badge variant={state.profile.remindersPaused ? "muted" : "secondary"}>
              {reminder.daysLeft >= 0 ? `H-${reminder.daysLeft}` : "Musim berjalan"}
            </Badge>
          </div>
          <CardDescription>
            Rencana buka lahan: <strong>{formatDate(state.profile.nextPlantingDate)}</strong> · Diabaikan:{" "}
            <strong>
              {state.profile.ignoredReminders}/{MAX_IGNORED}x
            </strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {state.profile.remindersPaused ? (
            <div className="rounded-xl bg-slate-100 p-3 text-xs leading-relaxed text-arang">
              <p className="font-bold text-arang">
                Pengingat otomatis dihentikan (Aturan Unobtrusiveness — 3x tanpa respons).
              </p>
              <p className="mt-1 text-kabut">
                Kami menghormati waktu Anda dan tidak mengirim notifikasi berulang tanpa henti. Untuk lahan gambut
                berisiko tinggi, penyuluh desa telah dijadwalkan melakukan pendampingan tatap muka.
              </p>
              <Button variant="outline" size="sm" className="mt-2.5" onClick={resumeReminders}>
                Aktifkan Kembali Pengingat
              </Button>
            </div>
          ) : activeReminder ? (
            <div className="rounded-xl bg-tunas p-3.5">
              <p className="text-sm font-bold text-gambut-900">{activeReminder.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-arang">{activeReminder.body}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link href={activeReminder.href} onClick={respondReminder} className="flex-1">
                  <Button size="sm" className="w-full">
                    {activeReminder.cta} <ArrowRight />
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={ignoreReminder}>
                  Nanti Saja ({state.profile.ignoredReminders + 1}/{MAX_IGNORED})
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-kabut">
              Pengingat aktif otomatis pada H-21, H-14, dan H-7 sebelum tanggal rencana buka lahan.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Ringkasan Cepat 2 Kartu: Progres 6 Tahap & Tinggi Muka Air Tanah */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardHeader className="p-3.5 pb-2">
            <CardDescription className="text-xs font-semibold">Panduan 6 Tahap</CardDescription>
            <CardTitle className="text-lg tabular-nums">{completedStages}/6 Selesai</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 p-3.5 pt-0">
            <Progress value={stagePct} />
            <Link href="/panduan" className="inline-flex items-center gap-1 text-xs font-bold text-gambut hover:underline">
              Lanjutkan tahap {state.currentStage} <ArrowRight className="size-3.5" />
            </Link>
          </CardContent>
        </Card>

        <Card className={waterZone ? waterZone.pattern : undefined}>
          <CardHeader className="p-3.5 pb-1">
            <CardDescription className="text-xs font-semibold">Muka Air Gambut</CardDescription>
            <CardTitle className="text-lg tabular-nums">
              {latestWater ? `${latestWater.depthCm} cm` : "Belum diukur"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1.5 p-3.5 pt-0">
            {waterZone && (
              <Badge variant={waterZone.zone}>
                {waterZone.zone === "aman" && <CheckCircle2 />}
                {waterZone.zone === "waspada" && <AlertTriangle />}
                {waterZone.zone === "bahaya" && <Flame />}
                {waterZone.label}
              </Badge>
            )}
            <div>
              <Link href="/muka-air" className="inline-flex items-center gap-1 text-xs font-bold text-gambut hover:underline">
                Catat tongkat ukur <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ringkasan Kohort Desa (Social Proof tanpa leaderboard individu) */}
      <Card>
        <CardContent className="flex items-center justify-between gap-3 p-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gambut">
              <Award className="size-4" /> Kohort {village.name}
            </div>
            <p className="text-sm font-bold text-arang">
              {totalFarmers} petani menjaga {formatNumber(totalCommittedHa)} ha tanpa bakar
            </p>
            <p className="text-xs text-kabut">
              Target desa: {village.targetZeroBurnHa} ha · Alat cacah gilir: {village.chopperUnits} unit
            </p>
          </div>
          <Link href="/kohort-desa">
            <Button variant="secondary" size="sm">
              Lihat Desa
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Menu Lengkap 8 Modul Fungsional */}
      <div>
        <h2 className="mb-2.5 text-sm font-extrabold uppercase tracking-wider text-kabut">
          Modul Lengkap Jaga Lahan
        </h2>
        <div className="grid grid-cols-2 gap-2.5">
          {[
            {
              href: "/kalkulator",
              title: "Kalkulator Biaya",
              desc: "Bakar vs. Tanpa Bakar (2 musim) & ajukan alat desa",
              icon: Calculator,
              tag: "F-02 · Reduction",
            },
            {
              href: "/panduan",
              title: "Panduan 6 Tahap",
              desc: "Video 40 dtk, pengingat mulsa H+10 & foto bebas EXIF",
              icon: ListChecks,
              tag: "F-03 · Tunneling",
            },
            {
              href: "/muka-air",
              title: "Tongkat Air Gambut",
              desc: "3 zona PP 57/2016 (40 cm) ramah buta warna",
              icon: Droplets,
              tag: "F-04 · Self-Monitoring",
            },
            {
              href: "/jurnal-panen",
              title: "Jurnal Hasil Panen",
              desc: "Satuan karung/ton/Rp & agregat aman N ≥ 5",
              icon: BookOpen,
              tag: "F-05 · Social Proof",
            },
            {
              href: "/kohort-desa",
              title: "Kohort & Lencana Desa",
              desc: "3 lencana kolektif desa & opsi komitmen pribadi",
              icon: Users,
              tag: "F-06 · Commitment",
            },
            {
              href: "/pantau-asap",
              title: "Lapor Asap & Pasca-Bakar",
              desc: "Lapor asap dini blok desa & pantau pemulihan 6–12 bln",
              icon: Flame,
              tag: "F-08 · Warga Penjaga",
            },
            {
              href: "/penyuluh",
              title: "Panel Penyuluh Tersier",
              desc: "Verifikasi tahap, gilir alat cacah & audit log",
              icon: ClipboardCheck,
              tag: "Authority · Reciprocity",
            },
            {
              href: "/profil",
              title: "Privasi & Sinkronisasi",
              desc: "UU PDP No. 27/2022, hak hapus data & status Supabase",
              icon: ShieldCheck,
              tag: "Zero-GIS · UU PDP",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col justify-between rounded-2xl border border-gambut/15 bg-white p-3.5 shadow-sm transition hover:border-gambut hover:bg-tunas/40"
              >
                <div>
                  <div className="mb-2 flex items-center justify-between gap-1">
                    <span className="flex size-9 items-center justify-center rounded-xl bg-tunas text-gambut">
                      <Icon className="size-5" />
                    </span>
                    <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-kabut">
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-arang">{item.title}</p>
                  <p className="mt-0.5 text-xs leading-snug text-kabut">{item.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

