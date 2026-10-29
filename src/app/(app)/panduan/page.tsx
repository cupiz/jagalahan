"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  ListChecks,
  Play,
  RotateCcw,
  ShieldCheck,
  SkipForward,
  Sparkles,
} from "lucide-react";
import { PageHeader } from "@/components/layout/app-shell";
import { PhotoUploader } from "@/components/shared/photo-uploader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress, Textarea } from "@/components/ui/form";
import { attachStagePhoto, setCurrentStage, updateStage, useAppState } from "@/lib/store";
import type { StageSlug } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";

interface StageMeta {
  stage: number;
  slug: StageSlug;
  title: string;
  duration: string;
  summary: string;
  steps: string[];
  tailoringGambut: string;
  tailoringMineral: string;
}

const STAGES: StageMeta[] = [
  {
    stage: 1,
    slug: "penilaian",
    title: "Penilaian Biomassa & Semak",
    duration: "Hari ke-1",
    summary: "Memetakan ketebalan semak, jalur air, dan memisahkan kayu keras yang bisa dimanfaatkan.",
    steps: [
      "Periksa ketebalan semak dan tandai batang kayu berdiameter >10 cm untuk kayu bangunan/tiang.",
      "Pastikan parit/sekat kanal di sekitar lahan dalam kondisi tertutup agar tanah tetap lembap.",
      "Tentukan arah jalur rumpuk (tumpukan serasah) sejajar kontur atau saluran air.",
    ],
    tailoringGambut: "Khusus Gambut: cek dulu tongkat ukur muka air tanah agar tidak bekerja saat gambut terlalu kering.",
    tailoringMineral: "Khusus Mineral: buat jalur rumpuk memotong lereng untuk menahan erosi air hujan.",
  },
  {
    stage: 2,
    slug: "pencacahan",
    title: "Pencacahan Vegetasi & Semak",
    duration: "Hari ke-2 s.d. ke-5",
    summary: "Menebas dan mencacah semak menjadi potongan 10–20 cm agar cepat lapuk tanpa perlu dibakar.",
    steps: [
      "Tebas semak rapat dari bagian bawah menggunakan parang/mesin potong rumput.",
      "Cacah ranting dan daun menjadi ukuran pendek (10–20 cm) atau masukkan ke mesin pencacah gilir desa.",
      "Hindari menumpuk serasah kering terlalu tinggi di satu titik agar tidak memicu panas berlebih.",
    ],
    tailoringGambut: "Khusus Gambut: cacahan halus menjaga permukaan gambut tetap teduh dan tidak mudah retak.",
    tailoringMineral: "Khusus Mineral: cacahan daun menjadi sumber bahan organik utama pengganti pupuk dasar.",
  },
  {
    stage: 3,
    slug: "penumpukan",
    title: "Penumpukan Serasah (Jalur Rumpuk)",
    duration: "Hari ke-6 s.d. ke-7",
    summary: "Menata hasil cacahan dalam jalur teratur sehingga ruang tanam bersih tanpa membakar.",
    steps: [
      "Susun cacahan semak membentuk jalur rumpuk selebar ±1 meter di antara barisan tanam.",
      "Sisakan lorong bersih selebar 1,5–2 meter untuk lubang tanam komoditas utama.",
      "Padatkan tumpukan secara ringan agar menyentuh tanah lembap.",
    ],
    tailoringGambut: "Khusus Gambut: jangan menggali parit baru yang mengeringkan gambut saat membuat jalur rumpuk.",
    tailoringMineral: "Khusus Mineral: letakkan jalur rumpuk di sisi bawah lereng sebagai penahan aliran permukaan.",
  },
  {
    stage: 4,
    slug: "pengomposan",
    title: "Pengomposan & Mulsa Alami",
    duration: "Hari ke-8 s.d. ke-18 (Balik Mulsa Hari ke-10)",
    summary: "Menaburkan kapur dolomit & dekomposer lokal, lalu membalik mulsa pada hari ke-10.",
    steps: [
      "Taburkan kapur pertanian (dolomit) secara merata di atas jalur rumpuk dan jalur tanam.",
      "Siramkan larutan dekomposer (EM4/MOL lokal) untuk mempercepat pelapukan serasah.",
      "Pada Hari ke-10, balik tumpukan mulsa satu kali agar pelapukan merata dan tidak berjamur.",
    ],
    tailoringGambut: "Khusus Gambut: dolomit menaikkan pH gambut yang masam tanpa perlu abu pembakaran.",
    tailoringMineral: "Khusus Mineral: mulsa menahan penguapan air tanah hingga 40% saat kemarau.",
  },
  {
    stage: 5,
    slug: "kesiapan",
    title: "Pemeriksaan Kesiapan Tanah",
    duration: "Hari ke-19 s.d. ke-20",
    summary: "Memastikan serasah sudah mulai lapuk, suhu tanah stabil, dan lubang tanam siap.",
    steps: [
      "Cek bagian bawah mulsa: warna mulai cokelat kehitaman dan terasa dingin/lembap di tangan.",
      "Buat lubang tanam di lorong bersih yang telah diberi pupuk kandang/kompos matang.",
      "Catat kesiapan lahan untuk diverifikasi oleh Penyuluh Desa.",
    ],
    tailoringGambut: "Khusus Gambut: pastikan tinggi air tanah tetap di Zona Aman/Waspada (≤40 cm) sebelum tanam.",
    tailoringMineral: "Khusus Mineral: gemburkan titik lubang tanam sedalam 20–30 cm.",
  },
  {
    stage: 6,
    slug: "penanaman",
    title: "Penanaman Komoditas & Penutup Tanah",
    duration: "Hari ke-21",
    summary: "Menanam bibit komoditas utama bersama tanaman penutup tanah (cover crop).",
    steps: [
      "Tanam bibit komoditas utama pada pagi atau sore hari.",
      "Tutup sekeliling pangkal tanaman dengan mulsa tipis dari jalur rumpuk untuk menjaga kelembapan.",
      "Sebar benih tanaman penutup tanah (Mucuna/kacangan) di sela jalur agar gulma tidak tumbuh kembali.",
    ],
    tailoringGambut: "Khusus Gambut: pilih komoditas ramah gambut (nanas gambut, pinang, karet, sawit rakyat).",
    tailoringMineral: "Khusus Mineral: tumpangsarikan dengan jagung atau cabai untuk hasil panen cepat.",
  },
];

/**
 * F-03 — Panduan 6 Tahap Pembukaan Lahan Tanpa Bakar.
 * Menerapkan Tunneling + Tailoring (gambut/mineral), video peragaan 40 detik hemat kuota,
 * pengingat balik mulsa hari ke-10, unggah foto bebas EXIF, serta tombol non-koersif Lewati/Kembali.
 */
export default function PanduanPage() {
  const state = useAppState();
  const activeStageNum = state.currentStage || 1;
  const meta = STAGES.find((s) => s.stage === activeStageNum) ?? STAGES[0];
  const progress = state.stages.find((s) => s.stage === activeStageNum) ?? state.stages[0];

  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoSec, setVideoSec] = useState(0);

  const completedCount = state.stages.filter((s) => s.status === "selesai").length;

  function startDemoVideo() {
    setVideoPlaying(true);
    setVideoSec(0);
    const timer = window.setInterval(() => {
      setVideoSec((prev) => {
        if (prev >= 40) {
          window.clearInterval(timer);
          setVideoPlaying(false);
          return 40;
        }
        return prev + 5;
      });
    }, 450);
  }

  return (
    <div className="space-y-4">
      <PageHeader
        icon={ListChecks}
        title="Panduan 6 Tahap Tanpa Bakar"
        subtitle={`Disesuaikan untuk tanah ${state.profile.soil.toUpperCase()} · Bebas berpindah atau melewati tahap`}
      />

      {/* Bilah Progres & Pemilih 6 Tahap */}
      <Card>
        <CardContent className="space-y-3 p-4">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-arang">{completedCount} dari 6 tahap selesai</span>
            <span className="text-gambut tabular-nums">{Math.round((completedCount / 6) * 100)}%</span>
          </div>
          <Progress value={(completedCount / 6) * 100} />
          <div className="grid grid-cols-6 gap-1.5 pt-1">
            {STAGES.map((st) => {
              const stProg = state.stages.find((p) => p.stage === st.stage);
              const isCurrent = st.stage === activeStageNum;
              const isDone = stProg?.status === "selesai";
              const isSkipped = stProg?.status === "dilewati";
              return (
                <button
                  key={st.stage}
                  type="button"
                  onClick={() => setCurrentStage(st.stage)}
                  className={cn(
                    "flex h-11 flex-col items-center justify-center rounded-xl border-2 text-xs font-bold transition",
                    isCurrent
                      ? "border-gambut bg-gambut text-white"
                      : isDone
                        ? "border-gambut/40 bg-tunas text-gambut-900"
                        : isSkipped
                          ? "border-slate-300 bg-slate-100 text-kabut"
                          : "border-gambut/15 bg-white text-arang",
                  )}
                  aria-label={`Tahap ${st.stage}: ${st.title}`}
                >
                  <span>{st.stage}</span>
                  <span className="text-[9px] font-normal">
                    {isDone ? "✓" : isSkipped ? "Lewat" : stProg?.status === "sedang_dikerjakan" ? "Aktif" : "—"}
                  </span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Kartu Detail Tahap Aktif */}
      <Card className="border-2 border-gambut/25">
        <CardHeader className="pb-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Badge variant="default">
              Tahap {meta.stage} dari 6 · {meta.duration}
            </Badge>
            <div className="flex items-center gap-1.5">
              {progress.verified && (
                <Badge variant="aman">
                  <ShieldCheck /> Diverifikasi Penyuluh
                </Badge>
              )}
              <Badge
                variant={
                  progress.status === "selesai"
                    ? "secondary"
                    : progress.status === "dilewati"
                      ? "muted"
                      : "outline"
                }
              >
                Status: {progress.status.replace("_", " ")}
              </Badge>
            </div>
          </div>
          <CardTitle className="mt-1 text-lg">{meta.title}</CardTitle>
          <CardDescription>{meta.summary}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Tips Tailoring berdasarkan Jenis Tanah (Gambut vs Mineral) */}
          <div className="rounded-2xl bg-tunas p-3 text-xs leading-relaxed text-arang">
            <p className="flex items-center gap-1.5 font-bold text-gambut-900">
              <Sparkles className="size-4 text-gambut" />
              Saran Khusus Lahan {state.profile.soil === "gambut" ? "Gambut" : "Mineral"} Anda:
            </p>
            <p className="mt-0.5">
              {state.profile.soil === "gambut" ? meta.tailoringGambut : meta.tailoringMineral}
            </p>
          </div>

          {/* Langkah-langkah Praktis */}
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-kabut">Langkah Kerja di Kebun</p>
            <ol className="space-y-2">
              {meta.steps.map((stepText, idx) => (
                <li key={stepText} className="flex gap-2.5 rounded-xl border border-gambut/10 bg-slate-50/70 p-2.5 text-sm">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-gambut text-xs font-bold text-white">
                    {idx + 1}
                  </span>
                  <span className="leading-snug text-arang">{stepText}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Fitur Khusus Tahap 2: Video Peragaan Singkat 40 Detik (Hemat Kuota & Tersimpan Luring) */}
          {meta.slug === "pencacahan" && (
            <div className="rounded-2xl border-2 border-gambut/20 bg-arang p-4 text-white">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <Badge variant="secondary" className="mb-1">
                    Video Peragaan · 40 Detik · 1,8 MB (Tersimpan Luring)
                  </Badge>
                  <p className="text-sm font-bold">Cara Tebas & Cacah Semak Rapat Tanpa Bakar</p>
                </div>
                <Button size="sm" variant="secondary" onClick={startDemoVideo} disabled={videoPlaying}>
                  <Play /> {videoPlaying ? `${videoSec} dtk / 40 dtk` : "Putar 40 dtk"}
                </Button>
              </div>
              <div className="mt-3 flex h-28 items-center justify-between rounded-xl bg-gambut-900/90 px-4">
                <div className="space-y-1 text-xs text-white/85">
                  <p className="font-semibold">
                    {videoSec < 15
                      ? "00:00–00:15 · Tebas pangkal semak sejajar tanah"
                      : videoSec < 30
                        ? "00:15–00:30 · Cacah ranting 10–20 cm dengan parang / mesin desa"
                        : "00:30–00:40 · Sebar merata agar cepat lapuk & lembap"}
                  </p>
                  <p className="text-[11px] text-white/65">
                    Tanpa kuota streaming berulang — file tersimpan di cache peramban.
                  </p>
                </div>
                <div className={cn("text-3xl", videoPlaying && "animate-chop")} aria-hidden>
                  🌿🪓
                </div>
              </div>
              <Progress value={(videoSec / 40) * 100} className="mt-2 bg-white/20" indicatorClassName="bg-emerald-400" />
            </div>
          )}

          {/* Fitur Khusus Tahap 4: Pengingat Hari ke-10 Balik Tumpukan Mulsa */}
          {meta.slug === "pengomposan" && (
            <div className="rounded-2xl border-2 border-dashed border-waspada bg-waspada-bg/70 p-3.5 text-xs text-arang">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="flex items-center gap-1.5 text-sm font-bold text-[#92400e]">
                    <Clock className="size-4" /> Pengingat Otomatis Hari ke-10: Balik Tumpukan Mulsa
                  </p>
                  <p className="mt-1">
                    {progress.mulchFlipDue
                      ? `Jadwal balik mulsa: ${formatDate(progress.mulchFlipDue)} (10 hari sejak tahap dimulai).`
                      : "Klik 'Mulai Kerjakan Tahap Ini' untuk menjadwalkan pengingat Hari ke-10 secara otomatis."}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant={progress.mulchFlipped ? "default" : "outline"}
                  onClick={() => updateStage(4, { status: "sedang_dikerjakan", mulchFlipped: !progress.mulchFlipped })}
                >
                  {progress.mulchFlipped ? "✓ Sudah Dibalik" : "Tandai Sudah Dibalik"}
                </Button>
              </div>
            </div>
          )}

          {/* Unggah Foto Kemajuan (Opsional, Bebas EXIF GPS) */}
          <div className="rounded-2xl border border-gambut/15 bg-slate-50 p-3">
            <p className="mb-2 text-xs font-bold text-arang">
              Dokumentasi Tahap {meta.stage} (Opsional — Tidak Wajib Foto)
            </p>
            <PhotoUploader
              label={`Ambil / Pilih Foto Tahap ${meta.stage}`}
              value={progress.photo}
              onChange={(photo) => attachStagePhoto(meta.stage, photo)}
            />
          </div>

          {/* Catatan Lapangan Petani */}
          <div>
            <p className="mb-1 text-xs font-semibold text-kabut">Catatan kebun (opsional)</p>
            <Textarea
              placeholder="Mis: Jalur rumpuk sisi timur sudah diberi dolomit 2 karung..."
              value={progress.notes ?? ""}
              onChange={(e) => updateStage(meta.stage, { notes: e.target.value })}
            />
          </div>

          {/* Tombol Aksi Tahap & Navigasi Non-Koersif (Bisa Lewati / Kembali Kapan Saja) */}
          <div className="space-y-2 pt-1">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="secondary"
                onClick={() => updateStage(meta.stage, { status: "sedang_dikerjakan" })}
              >
                Mulai Kerjakan
              </Button>
              <Button
                onClick={() => {
                  updateStage(meta.stage, { status: "selesai" });
                  if (meta.stage < 6) setCurrentStage(meta.stage + 1);
                }}
              >
                <CheckCircle2 /> Tandai Selesai
              </Button>
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                disabled={meta.stage <= 1}
                onClick={() => setCurrentStage(meta.stage - 1)}
              >
                <ArrowLeft /> Tahap Sebelumnya
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  updateStage(meta.stage, { status: "dilewati" });
                  if (meta.stage < 6) setCurrentStage(meta.stage + 1);
                }}
              >
                <SkipForward /> Lewati Tahap Ini
              </Button>

              <Button
                variant="outline"
                size="sm"
                disabled={meta.stage >= 6}
                onClick={() => setCurrentStage(meta.stage + 1)}
              >
                Tahap Berikutnya <ArrowRight />
              </Button>
            </div>

            {progress.status !== "belum" && (
              <button
                type="button"
                onClick={() => updateStage(meta.stage, { status: "belum", mulchFlipped: false })}
                className="inline-flex items-center gap-1 text-xs text-kabut hover:text-arang"
              >
                <RotateCcw className="size-3" /> Atur ulang status tahap ini
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

