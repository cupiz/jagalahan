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
  Wrench,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/form";
import { calculateCosts } from "@/lib/calculator/cost-engine";
import { DEFAULT_PRICE_REF, getVillage, OTHER_COMMITMENTS, ROLE_DESCRIPTIONS, ROLE_LABELS } from "@/lib/data/seed";
import { getReminderStatus, MAX_IGNORED, REMINDER_MESSAGES } from "@/lib/reminders";
import { ignoreReminder, respondReminder, resumeReminders, setCurrentStage, useAppState } from "@/lib/store";
import { cn, formatDate, formatNumber, formatRupiah } from "@/lib/utils";
import { getZone } from "@/lib/water/zones";

const STAGE_LABELS = [
  "1. Penilaian Biomassa",
  "2. Pencacahan Semak",
  "3. Jalur Rumpuk",
  "4. Kompos & Mulsa (H+10)",
  "5. Kesiapan Tanah",
  "6. Penanaman",
];

export default function BerandaPage() {
  const state = useAppState();
  const village = getVillage(state.profile.villageId);
  const prices = state.priceRefs[village.id] ?? DEFAULT_PRICE_REF;

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
  const villagePct = Math.min(100, (totalCommittedHa / village.targetZeroBurnHa) * 100);

  const quickCostWithAid = calculateCosts({
    areaHa: state.profile.areaHa,
    soil: state.profile.soil,
    density: "sedang",
    borrowVillageChopper: true,
    prices,
  });

  return (
    <div className="space-y-6">
      {/* =====================================================================
          1. HERO BANNER DASBOR (Responsif Desktop & Mobile)
         ===================================================================== */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-gambut-900 via-gambut to-[#164d30] p-6 text-white shadow-md sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-white/5" />
        <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">Peran Aktif: {ROLE_LABELS[state.profile.role]}</Badge>
              <span className="rounded-full bg-white/15 px-3 py-0.5 text-xs font-semibold text-emerald-100">
                {village.name} · {village.district}, {village.regency}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Selamat Datang, {state.profile.displayName}
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-white/85">
              {ROLE_DESCRIPTIONS[state.profile.role]} Saat ini profil lahan Anda diatur pada{" "}
              <strong className="text-white">
                {formatNumber(state.profile.areaHa)} hektare tanah {state.profile.soil}
              </strong>{" "}
              dengan jadwal rencana buka lahan pada{" "}
              <strong className="text-emerald-200">{formatDate(state.profile.nextPlantingDate)}</strong>.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Link href="/kalkulator">
              <Button className="bg-white text-gambut-900 hover:bg-emerald-50">
                <Calculator /> Hitung Biaya Lahan
              </Button>
            </Link>
            <Link href="/panduan">
              <Button variant="outline" className="border-white/35 bg-white/10 text-white hover:bg-white/20">
                <ListChecks /> Panduan Tahap {state.currentStage}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* =====================================================================
          2. EMPAT KARTU KPI RINGKASAN CEPAT (4 Kolom di Desktop, 2 di Mobile)
         ===================================================================== */}
      <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        <Card className="border-gambut/20">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="flex items-center justify-between text-xs font-bold uppercase text-gambut">
              <span>Kohort Tanpa Bakar</span>
              <Users className="size-4" />
            </CardDescription>
            <CardTitle className="text-2xl font-extrabold tabular-nums">
              {formatNumber(totalCommittedHa)} ha
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 p-4 pt-0">
            <Progress value={villagePct} />
            <p className="text-xs text-kabut">
              {totalFarmers} petani · Target desa {village.targetZeroBurnHa} ha ({Math.round(villagePct)}%)
            </p>
          </CardContent>
        </Card>

        <Card className={cn("border-gambut/20", waterZone?.pattern)}>
          <CardHeader className="p-4 pb-2">
            <CardDescription className="flex items-center justify-between text-xs font-bold uppercase text-arang">
              <span>Muka Air Gambut</span>
              <Droplets className="size-4 text-gambut" />
            </CardDescription>
            <CardTitle className="text-2xl font-extrabold tabular-nums">
              {latestWater ? `${latestWater.depthCm} cm` : "Belum diukur"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1.5 p-4 pt-0">
            {waterZone && (
              <Badge variant={waterZone.zone}>
                {waterZone.zone === "aman" && <CheckCircle2 />}
                {waterZone.zone === "waspada" && <AlertTriangle />}
                {waterZone.zone === "bahaya" && <Flame />}
                {waterZone.label} (Batas 40 cm)
              </Badge>
            )}
            <div>
              <Link href="/muka-air" className="inline-flex items-center gap-1 text-xs font-bold text-gambut hover:underline">
                Catat tongkat ukur <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gambut/20">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="flex items-center justify-between text-xs font-bold uppercase text-gambut">
              <span>Progres 6 Tahap</span>
              <ListChecks className="size-4" />
            </CardDescription>
            <CardTitle className="text-2xl font-extrabold tabular-nums">{completedStages}/6 Selesai</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 p-4 pt-0">
            <Progress value={stagePct} />
            <Link href="/panduan" className="inline-flex items-center gap-1 text-xs font-bold text-gambut hover:underline">
              Buka Tahap {state.currentStage} <ArrowRight className="size-3.5" />
            </Link>
          </CardContent>
        </Card>

        <Card className="border-gambut/20 bg-tunas/40">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="flex items-center justify-between text-xs font-bold uppercase text-gambut">
              <span>Penghematan 2 Musim</span>
              <Wrench className="size-4" />
            </CardDescription>
            <CardTitle className="text-2xl font-extrabold text-gambut tabular-nums">
              {formatRupiah(quickCostWithAid.twoSeason.difference)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 p-4 pt-0 text-xs text-kabut">
            <p>Dengan pinjam alat cacah desa + hemat pupuk musim ke-2.</p>
            <Link href="/kalkulator" className="inline-flex items-center gap-1 font-bold text-gambut hover:underline">
              Lihat rincian rumus <ArrowRight className="size-3.5" />
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* =====================================================================
          3. GRID UTAMA 2 KOLOM DI DESKTOP (7 Kolom Kiri + 5 Kolom Kanan)
         ===================================================================== */}
      <div className="grid gap-5 lg:grid-cols-12">
        {/* KOLOM KIRI (7 Kolom): Pengingat Pra-Keputusan & Pipa Interaktif 6 Tahap */}
        <div className="space-y-5 lg:col-span-7">
          {/* F-07: Pengingat Pra-Keputusan (H-21, H-14, H-7) */}
          <Card className="border-2 border-gambut/25">
            <CardHeader className="pb-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  {state.profile.remindersPaused ? (
                    <BellOff className="size-5 text-kabut" />
                  ) : (
                    <Bell className="size-5 text-gambut" />
                  )}
                  Pengingat Pra-Keputusan Musim Tanam (F-07)
                </CardTitle>
                <Badge variant={state.profile.remindersPaused ? "muted" : "default"}>
                  {reminder.daysLeft >= 0 ? `H-${reminder.daysLeft} Menuju Buka Lahan` : "Musim Berjalan"}
                </Badge>
              </div>
              <CardDescription>
                Jadwal buka lahan: <strong>{formatDate(state.profile.nextPlantingDate)}</strong> · Eskalasi diabaikan:{" "}
                <strong>
                  {state.profile.ignoredReminders}/{MAX_IGNORED} kali
                </strong>
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              {state.profile.remindersPaused ? (
                <div className="rounded-2xl bg-slate-100 p-4 text-xs leading-relaxed text-arang">
                  <p className="font-bold text-arang">
                    Pengingat otomatis dihentikan (Aturan Unobtrusiveness — 3x tanpa respons).
                  </p>
                  <p className="mt-1 text-kabut">
                    Kami menghormati waktu Anda dan tidak mengirim notifikasi berulang tanpa henti. Untuk lahan gambut
                    berisiko tinggi, penyuluh desa telah dijadwalkan melakukan pendampingan tatap muka.
                  </p>
                  <Button variant="outline" size="sm" className="mt-3" onClick={resumeReminders}>
                    Aktifkan Kembali Pengingat
                  </Button>
                </div>
              ) : activeReminder ? (
                <div className="rounded-2xl bg-tunas p-4">
                  <p className="text-base font-extrabold text-gambut-900">{activeReminder.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-arang">{activeReminder.body}</p>
                  <div className="mt-3.5 flex flex-wrap gap-2">
                    <Link href={activeReminder.href} onClick={respondReminder}>
                      <Button size="sm">
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
                  Pengingat akan muncul otomatis pada H-21, H-14, dan H-7 sebelum tanggal rencana buka lahan.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Pipa Interaktif 6 Tahap Pembukaan Lahan Tanpa Bakar */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <ListChecks className="size-5 text-gambut" />
                  Alur 6 Tahap Pembukaan Lahan Tanpa Bakar (F-03)
                </CardTitle>
                <Link href="/panduan" className="text-xs font-bold text-gambut hover:underline">
                  Buka Panduan Lengkap →
                </Link>
              </div>
              <CardDescription>
                Klik tahap mana pun untuk melihat langkah kerja, video peragaan 40 detik, atau pengingat balik mulsa
                Hari ke-10.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {state.stages.map((st, idx) => {
                  const isCurrent = st.stage === state.currentStage;
                  const isDone = st.status === "selesai";
                  return (
                    <Link
                      key={st.stage}
                      href="/panduan"
                      onClick={() => setCurrentStage(st.stage)}
                      className={cn(
                        "flex flex-col justify-between rounded-2xl border-2 p-3 transition hover:border-gambut",
                        isCurrent
                          ? "border-gambut bg-tunas/70"
                          : isDone
                            ? "border-gambut/35 bg-tunas/30"
                            : "border-gambut/10 bg-slate-50/70",
                      )}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-extrabold text-gambut">{STAGE_LABELS[idx]}</span>
                        {st.verified && <ShieldCheck className="size-4 text-gambut" />}
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[11px]">
                        <span className="capitalize text-kabut">{st.status.replace("_", " ")}</span>
                        <span className="font-bold text-gambut">{isCurrent ? "Aktif →" : "Lihat"}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* KOLOM KANAN (5 Kolom): Lencana Kolektif Desa, Alat Cacah, & Status Asap */}
        <div className="space-y-5 lg:col-span-5">
          <Card className="border-gambut/20">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Award className="size-5 text-gambut" />
                  Lencana Kolektif {village.name}
                </CardTitle>
                <Link href="/kohort-desa" className="text-xs font-bold text-gambut hover:underline">
                  Detail Desa →
                </Link>
              </div>
              <CardDescription>
                Penghargaan diberikan pada tingkat desa (tanpa *leaderboard* individu).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5 text-xs">
              {[
                {
                  title: "Sepuluh Hektare Tanpa Bakar",
                  ok: totalCommittedHa >= 10,
                  sub: `${formatNumber(totalCommittedHa)} / 10 ha tercapai`,
                },
                {
                  title: "Desa Bebas Bakar",
                  ok: totalCommittedHa >= village.targetZeroBurnHa,
                  sub: `${formatNumber(totalCommittedHa)} / ${village.targetZeroBurnHa} ha target desa`,
                },
                {
                  title: "Musim Kedua Berturut-turut",
                  ok: village.consecutiveZeroBurnSeasons >= 2,
                  sub: `${village.consecutiveZeroBurnSeasons} / 2 musim berturut-turut`,
                },
              ].map((b) => (
                <div
                  key={b.title}
                  className={cn(
                    "flex items-center justify-between rounded-xl border p-3",
                    b.ok ? "border-gambut bg-tunas/60" : "border-slate-200 bg-slate-50",
                  )}
                >
                  <div>
                    <p className="font-bold text-arang">
                      {b.ok ? "🏅 " : "🌱 "}
                      {b.title}
                    </p>
                    <p className="text-[11px] text-kabut">{b.sub}</p>
                  </div>
                  <Badge variant={b.ok ? "default" : "muted"}>{b.ok ? "Diraih" : "Progres"}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Flame className="size-5 text-bahaya" />
                  Kewaspadaan Asap & Pasca-Bakar Desa
                </CardTitle>
                <Link href="/pantau-asap" className="text-xs font-bold text-gambut hover:underline">
                  Lapor / Pantau →
                </Link>
              </div>
              <CardDescription>Laporan tingkat blok/parit desa tanpa koordinat GPS individu.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              {state.smokeReports.slice(0, 2).map((sm) => (
                <div
                  key={sm.id}
                  className="flex items-center justify-between rounded-xl border border-gambut/10 bg-slate-50 p-2.5"
                >
                  <div>
                    <p className="font-bold text-arang">{sm.zone}</p>
                    <p className="text-[11px] text-kabut">
                      Asap {sm.intensity.replace("_", " ")} · {sm.wind}
                    </p>
                  </div>
                  <Badge variant={sm.status === "tertangani" ? "aman" : "waspada"}>
                    {sm.status.replaceAll("_", " ")}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* =====================================================================
          4. JELAJAHI SELURUH 8 MODUL FUNGSIONAL (4 Kolom di Desktop)
         ===================================================================== */}
      <div>
        <h2 className="mb-3 text-sm font-extrabold uppercase tracking-wider text-kabut">
          Akses Cepat Seluruh Modul Jaga Lahan
        </h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
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
                className="flex flex-col justify-between rounded-2xl border border-gambut/15 bg-white p-4 shadow-xs transition hover:-translate-y-0.5 hover:border-gambut hover:bg-tunas/40"
              >
                <div>
                  <div className="mb-2.5 flex items-center justify-between gap-1">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-tunas text-gambut">
                      <Icon className="size-5" />
                    </span>
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-kabut">
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-sm font-extrabold text-arang">{item.title}</p>
                  <p className="mt-1 text-xs leading-snug text-kabut">{item.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
