"use client";

import { useState } from "react";
import {
  AlertCircle,
  Calculator,
  CheckCircle2,
  Handshake,
  HelpCircle,
  Info,
  Sprout,
  Wrench,
} from "lucide-react";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Segmented } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { calculateCosts } from "@/lib/calculator/cost-engine";
import { CURRENT_SEASON, DEFAULT_PRICE_REF, getVillage } from "@/lib/data/seed";
import { addCommitment, requestEquipment, updateProfile, useAppState } from "@/lib/store";
import type { Density, EquipmentType, SoilType } from "@/lib/types";
import { formatDate, formatNumber, formatRupiah } from "@/lib/utils";

const AREA_PRESETS = [0.5, 1, 2, 3, 5];

/**
 * F-02 — Kalkulator Bakar vs. Tanpa Bakar.
 * Menerapkan prinsip Reduction, kejujuran informasi (menampilkan selisih Rp300.000 pada contoh 2 ha),
 * transparansi rumus, dan tombol pengajuan bantuan alat pencacah / bibit penutup tanah desa.
 */
export default function KalkulatorPage() {
  const state = useAppState();
  const village = getVillage(state.profile.villageId);
  const prices = state.priceRefs[village.id] ?? DEFAULT_PRICE_REF;

  const [areaHa, setAreaHa] = useState<number>(state.profile.areaHa || 2);
  const [soil, setSoil] = useState<SoilType>(state.profile.soil || "gambut");
  const [density, setDensity] = useState<Density>("sedang");
  const [borrowChopper, setBorrowChopper] = useState<boolean>(false);
  const [formulaOpen, setFormulaOpen] = useState<boolean>(false);
  const [aidOpen, setAidOpen] = useState<boolean>(false);
  const [aidType, setAidType] = useState<EquipmentType>("alat_pencacah");
  const [isPublicCommit, setIsPublicCommit] = useState<boolean>(true);
  const [bannerMsg, setBannerMsg] = useState<string | null>(null);

  const result = calculateCosts({
    areaHa,
    soil,
    density,
    borrowVillageChopper: borrowChopper,
    prices,
  });

  function handleSaveCommitment() {
    updateProfile({ areaHa, soil });
    addCommitment({
      season: CURRENT_SEASON,
      areaHa,
      soil,
      density,
      isPublic: isPublicCommit,
    });
    setBannerMsg(
      isPublicCommit
        ? `Komitmen ${formatNumber(areaHa)} ha tanpa bakar disimpan & ditampilkan di Kohort ${village.name}.`
        : `Komitmen ${formatNumber(areaHa)} ha disimpan secara pribadi (hanya Anda yang dapat melihat nama Anda).`,
    );
  }

  function handleSubmitAid() {
    requestEquipment({
      type: aidType,
      areaHa,
      costGap: Math.max(0, result.season1Gap),
    });
    setAidOpen(false);
    if (aidType === "alat_pencacah") {
      setBorrowChopper(true);
    }
    setBannerMsg(
      `Pengajuan ${
        aidType === "alat_pencacah"
          ? "Pinjam Alat Pencacah Desa"
          : aidType === "bibit_penutup_tanah"
            ? "Bibit Tanaman Penutup Tanah"
            : "Kapur Dolomit & Dekomposer"
      } untuk ${formatNumber(areaHa)} ha telah dikirim ke Penyuluh ${village.name}.`,
    );
  }

  return (
    <div className="space-y-4">
      <PageHeader
        icon={Calculator}
        title="Kalkulator Bakar vs. Tanpa Bakar"
        subtitle="Perbandingan jujur Musim 1 & Proyeksi 2 Musim berdasarkan harga acuan desa"
      />

      {bannerMsg && (
        <div className="flex items-start gap-2.5 rounded-2xl border border-gambut bg-tunas p-3.5 text-xs text-arang">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-gambut" />
          <div className="flex-1 font-medium">{bannerMsg}</div>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-12">
      {/* Panel Input Sederhana (Reduction: cukup 3 input) — 5 Kolom di Desktop */}
      <Card className="lg:col-span-5 h-fit">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>1. Kondisi Lahan Anda</CardTitle>
            <button
              type="button"
              onClick={() => setFormulaOpen(true)}
              className="inline-flex items-center gap-1 text-xs font-bold text-gambut underline-offset-2 hover:underline"
            >
              <HelpCircle className="size-3.5" /> Lihat cara hitung
            </button>
          </div>
          <CardDescription>
            Acuan harga: <strong>{village.name}</strong> (diverifikasi {prices.verifiedBy}, {formatDate(prices.updatedAt)})
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="mb-1.5 flex items-center justify-between text-sm font-semibold">
              <span>Luas lahan dibuka</span>
              <span className="font-extrabold text-gambut tabular-nums">{formatNumber(areaHa)} ha</span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {AREA_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAreaHa(preset)}
                  className={`h-11 rounded-xl border-2 text-sm font-bold tabular-nums transition ${
                    areaHa === preset
                      ? "border-gambut bg-gambut text-white"
                      : "border-gambut/15 bg-white text-arang hover:bg-tunas"
                  }`}
                >
                  {formatNumber(preset)} ha
                </button>
              ))}
            </div>
            <input
              type="range"
              min={0.5}
              max={5}
              step={0.5}
              value={areaHa}
              onChange={(e) => setAreaHa(Number(e.target.value))}
              className="mt-2.5 w-full accent-[#1B5E3A]"
              aria-label="Geser luas lahan"
            />
          </div>

          <div>
            <p className="mb-1.5 text-sm font-semibold">Jenis tanah</p>
            <Segmented
              ariaLabel="Jenis tanah"
              value={soil}
              onChange={setSoil}
              options={[
                { value: "gambut", label: "Gambut", hint: "butuh dolomit penuh" },
                { value: "mineral", label: "Mineral", hint: "dolomit lebih ringan" },
              ]}
            />
          </div>

          <div>
            <p className="mb-1.5 text-sm font-semibold">Ketebalan semak / biomassa</p>
            <Segmented
              ariaLabel="Ketebalan semak"
              value={density}
              onChange={setDensity}
              options={[
                { value: "ringan", label: "Ringan", hint: "semak rendah" },
                { value: "sedang", label: "Sedang", hint: "belukar biasa" },
                { value: "tebal", label: "Tebal", hint: "semak rapat" },
              ]}
            />
          </div>

          <div className="flex items-center justify-between gap-3 rounded-2xl bg-tunas/70 p-3">
            <div>
              <p className="text-sm font-bold text-arang">Pinjam alat pencacah gilir desa</p>
              <p className="text-xs text-kabut">
                Hemat sewa alat <strong>{formatRupiah(result.chopperRental)}</strong> ({village.chopperUnits} unit
                tersedia di balai desa)
              </p>
            </div>
            <Switch
              checked={borrowChopper}
              onCheckedChange={setBorrowChopper}
              label="Simulasikan pinjam alat pencacah desa"
            />
          </div>
        </CardContent>
      </Card>

      {/* Kolom Kanan di Desktop (7 Kolom): Tabel Perbandingan + Ringkasan + Komitmen */}
      <div className="space-y-4 lg:col-span-7">
      {/* Tabel 2 Kolom Sejajar: Cara Bakar vs. Tanpa Bakar */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* Kolom Kiri: Cara Bakar */}
        <Card className="border-slate-300 bg-slate-50/80">
          <CardHeader className="p-3.5 pb-2">
            <Badge variant="muted" className="w-fit">
              Cara Lama
            </Badge>
            <CardTitle className="mt-1 text-base">Cara Bakar</CardTitle>
            <CardDescription className="text-xs">{formatNumber(areaHa)} ha · Musim Pertama</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5 p-3.5 pt-0">
            <div className="space-y-1.5 border-y border-slate-200 py-2 text-xs">
              {result.burn.lines.map((line) => (
                <div key={line.label} className="flex justify-between gap-1">
                  <span className="text-kabut">{line.label}</span>
                  <span className="font-bold tabular-nums text-arang">{formatRupiah(line.amount)}</span>
                </div>
              ))}
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase text-kabut">Total Musim 1</p>
              <p className="text-xl font-extrabold tabular-nums text-arang">{formatRupiah(result.burn.total)}</p>
            </div>
            <ul className="space-y-1 pt-1 text-[11px] leading-snug text-kabut">
              {result.burn.risks.map((r) => (
                <li key={r} className="flex gap-1">
                  <span className="text-bahaya">•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Kolom Kanan: Tanpa Bakar */}
        <Card className="border-2 border-gambut bg-white">
          <CardHeader className="p-3.5 pb-2">
            <Badge variant="default" className="w-fit">
              Direkomendasikan
            </Badge>
            <CardTitle className="mt-1 text-base text-gambut">Tanpa Bakar</CardTitle>
            <CardDescription className="text-xs">{formatNumber(areaHa)} ha · Tebas, Cacah & Mulsa</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5 p-3.5 pt-0">
            <div className="space-y-1.5 border-y border-gambut/15 py-2 text-xs">
              {result.zeroBurn.lines.map((line) => (
                <div key={line.label} className="flex justify-between gap-1">
                  <span className="text-kabut">{line.label}</span>
                  <span className="font-bold tabular-nums text-gambut">{formatRupiah(line.amount)}</span>
                </div>
              ))}
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase text-kabut">Total Musim 1</p>
              <p className="text-xl font-extrabold tabular-nums text-gambut">{formatRupiah(result.zeroBurn.total)}</p>
            </div>
            <ul className="space-y-1 pt-1 text-[11px] leading-snug text-arang">
              {result.zeroBurn.benefits.map((b) => (
                <li key={b} className="flex gap-1">
                  <span className="font-bold text-gambut">✓</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Kartu Kejujuran Selisih Musim 1 & Proyeksi 2 Musim */}
      <Card id="bantuan" className="border-2 border-gambut/25 bg-tunas/50">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Info className="size-5 text-gambut" />
            Ringkasan Jujur & Solusi Desa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs leading-relaxed text-arang">
          {result.season1Gap > 0 ? (
            <div className="rounded-xl bg-white p-3">
              <p className="font-bold text-arang">
                Di musim pertama, Tanpa Bakar membutuhkan tambahan{" "}
                <span className="text-bahaya tabular-nums">{formatRupiah(result.season1Gap)}</span> dibanding membakar.
              </p>
              <p className="mt-1 text-kabut">
                Kami tidak menyembunyikan selisih ini. Namun jika Anda meminjam alat pencacah gilir desa (hemat{" "}
                <strong>{formatRupiah(result.chopperRental)}</strong>) dan menghitung penghematan pupuk musim kedua (
                <strong>{formatRupiah(result.season2FertilizerSaving)}</strong>), metode Tanpa Bakar{" "}
                <strong className="text-gambut">
                  lebih hemat {formatRupiah(result.twoSeason.difference)} dalam 2 musim
                </strong>
                .
              </p>
            </div>
          ) : (
            <div className="rounded-xl bg-white p-3">
              <p className="font-bold text-gambut">
                Dengan meminjam alat pencacah gilir desa, metode Tanpa Bakar langsung lebih hemat{" "}
                <span className="tabular-nums">{formatRupiah(Math.abs(result.season1Gap))}</span> sejak musim pertama!
              </p>
              <p className="mt-1 text-kabut">
                Ditambah penghematan pupuk musim ke-2 sebesar{" "}
                <strong>{formatRupiah(result.season2FertilizerSaving)}</strong>, total penghematan 2 musim mencapai{" "}
                <strong className="text-gambut">{formatRupiah(result.twoSeason.difference)}</strong>.
              </p>
            </div>
          )}

          {/* Perbandingan 2 Musim */}
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-white p-3 tabular-nums">
            <div>
              <p className="text-[11px] text-kabut">Proyeksi 2 Musim (Cara Bakar + Pupuk Tambahan)</p>
              <p className="text-sm font-extrabold text-arang">{formatRupiah(result.twoSeason.burn)}</p>
            </div>
            <div>
              <p className="text-[11px] text-kabut">Proyeksi 2 Musim (Tanpa Bakar)</p>
              <p className="text-sm font-extrabold text-gambut">{formatRupiah(result.twoSeason.zeroBurn)}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-1">
            <Button onClick={() => setAidOpen(true)} className="w-full">
              <Wrench /> Ajukan Pinjam Alat Pencacah / Bibit Desa
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Kartu Komitmen Sukarela (Bisa Publik di Desa atau Simpan Pribadi) */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Handshake className="size-5 text-gambut" />
            2. Catat Rencana Musim Tanam ({CURRENT_SEASON})
          </CardTitle>
          <CardDescription>
            Anda bebas memilih apakah komitmen ini ditampilkan di Kohort Desa atau disimpan untuk diri sendiri.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3">
            <div>
              <p className="text-sm font-semibold text-arang">
                {isPublicCommit ? "Tampilkan di Kohort Desa" : "Simpan Pribadi (Hanya Saya)"}
              </p>
              <p className="text-xs text-kabut">
                {isPublicCommit
                  ? "Membantu menambah capaian hektare bebas bakar desa."
                  : "Nama Anda tidak ditampilkan di papan desa, namun Anda tetap bisa memakai seluruh panduan."}
              </p>
            </div>
            <Switch
              checked={isPublicCommit}
              onCheckedChange={setIsPublicCommit}
              label="Pilih tampilkan komitmen di desa atau pribadi"
            />
          </div>
          <Button variant="secondary" className="w-full" onClick={handleSaveCommitment}>
            <Sprout /> Simpan Rencana {formatNumber(areaHa)} ha Tanpa Bakar
          </Button>
        </CardContent>
      </Card>
      </div>
      </div>

      {/* Dialog Transparansi Rumus Perhitungan */}
      <Dialog
        open={formulaOpen}
        onOpenChange={setFormulaOpen}
        title="Transparansi Rumus & Acuan Harga Desa"
        description={`Diverifikasi oleh ${prices.verifiedBy} pada ${formatDate(prices.updatedAt)}`}
      >
        <div className="space-y-3 text-xs leading-relaxed text-arang">
          <p className="rounded-xl bg-tunas p-3">
            Sesuai prinsip etika <strong>Persuasive Technology (Berdichevsky & Neuenschwander, 1999)</strong>, seluruh
            rumus kalkulator ini dibuka secara transparan dan tidak direkayasa.
          </p>
          <div>
            <p className="mb-1 font-bold text-arang">A. Rumus Cara Bakar ({formatNumber(areaHa)} ha):</p>
            <ul className="space-y-1 rounded-xl border border-slate-200 p-2.5">
              {result.burn.lines.map((l) => (
                <li key={l.label}>
                  <strong>{l.label}:</strong> {l.formula} = <strong>{formatRupiah(l.amount)}</strong>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-1 font-bold text-gambut">B. Rumus Tanpa Bakar ({formatNumber(areaHa)} ha):</p>
            <ul className="space-y-1 rounded-xl border border-gambut/20 p-2.5">
              {result.zeroBurn.lines.map((l) => (
                <li key={l.label}>
                  <strong>{l.label}:</strong> {l.formula} = <strong>{formatRupiah(l.amount)}</strong>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl bg-slate-100 p-2.5">
            <strong>Proyeksi Musim ke-2:</strong> Pembakaran menguapkan nitrogen permukaan sehingga membutuhkan tambahan
            pupuk sekitar <strong>{formatRupiah(prices.season2FertilizerSavingPerHa)}/ha</strong> pada musim tanam
            berikutnya.
          </div>
        </div>
      </Dialog>

      {/* Dialog Pengajuan Bantuan Alat / Bibit Desa */}
      <Dialog
        open={aidOpen}
        onOpenChange={setAidOpen}
        title="Ajukan Bantuan Alat / Bibit Desa"
        description={`Menutup selisih biaya awal di ${village.name} (Prinsip Reciprocity & Ability)`}
      >
        <div className="space-y-3">
          <div className="space-y-2">
            {(
              [
                [
                  "alat_pencacah",
                  "Pinjam Alat Pencacah Gilir Desa",
                  `Tersedia ${village.chopperUnits} unit di balai desa — menghemat biaya sewa ${formatRupiah(result.chopperRental)}.`,
                ],
                [
                  "bibit_penutup_tanah",
                  "Bibit Tanaman Penutup Tanah (Cover Crop)",
                  `Stok desa: ${village.coverCropKg} kg — menjaga kelembapan gambut & menekan gulma.`,
                ],
                [
                  "kapur_dolomit_kompos",
                  "Bantuan Kapur Dolomit & Dekomposer",
                  "Mempercepat pelapukan serasah hasil pencacahan menjadi kompos alami.",
                ],
              ] as const
            ).map(([val, title, desc]) => (
              <button
                key={val}
                type="button"
                onClick={() => setAidType(val)}
                className={`w-full rounded-2xl border-2 p-3 text-left ${
                  aidType === val ? "border-gambut bg-tunas" : "border-gambut/15 bg-white"
                }`}
              >
                <p className="text-sm font-bold text-arang">{title}</p>
                <p className="text-xs text-kabut">{desc}</p>
              </button>
            ))}
          </div>
          <div className=" flex items-center gap-2 rounded-xl bg-slate-100 p-2.5 text-xs text-kabut">
            <AlertCircle className="size-4 shrink-0 text-gambut" />
            Tanpa hitung mundur palsu (No Fake Scarcity): pengajuan dijadwalkan secara adil oleh Penyuluh Desa.
          </div>
          <Button className="w-full" onClick={handleSubmitAid}>
            Kirim Pengajuan untuk {formatNumber(areaHa)} ha
          </Button>
        </div>
      </Dialog>
    </div>
  );
}

