"use client";

import { useState } from "react";
import {
  BarChart3,
  BookOpen,
  CheckCircle2,
  Lock,
  PlusCircle,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Progress, Select } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { COMMODITIES, getVillage, SEASONS } from "@/lib/data/seed";
import { getSafeHarvestAggregate, PRIVACY_MIN_N } from "@/lib/privacy/aggregation-guard";
import { addHarvest, removeHarvest, useAppState } from "@/lib/store";
import { formatNumber, formatRupiah } from "@/lib/utils";

/**
 * F-05 — Jurnal Hasil Panen & Perbandingan Agregat Desa (N ≥ 5).
 * - Satuan lokal yang akrab bagi petani: Karung, Ton/ha, dan Rupiah (Rp).
 * - Membandingkan hasil panen sendiri terhadap rata-rata agregat desa (TANPA leaderboard individu).
 * - Menegakkan aturan privasi N ≥ 5: jika petani pencatat di desa < 5, otomatis beralih (fallback) ke rata-rata Kecamatan.
 */
export default function JurnalPanenPage() {
  const state = useAppState();
  const village = getVillage(state.profile.villageId);

  const [commodity, setCommodity] = useState<string>("Jagung");
  const [season, setSeason] = useState<string>("Musim 2026");
  const [simulateLowN, setSimulateLowN] = useState<boolean>(false);

  // State form tambah catatan panen baru
  const [formSeason, setFormSeason] = useState<string>("Musim 2026");
  const [formCommodity, setFormCommodity] = useState<string>("Jagung");
  const [formAreaHa, setFormAreaHa] = useState<string>(String(state.profile.areaHa || 2));
  const [formSacks, setFormSacks] = useState<string>("180");
  const [formTonPerHa, setFormTonPerHa] = useState<string>("4.5");
  const [formRevenue, setFormRevenue] = useState<string>("41400000");
  const [formCost, setFormCost] = useState<string>("13800000");
  const [notice, setNotice] = useState<string | null>(null);

  const aggregate = getSafeHarvestAggregate({
    villageId: village.id,
    season,
    commodity,
    myHarvests: state.harvests,
    simulateVillageCount: simulateLowN ? 3 : undefined,
  });

  const myCurrent = state.harvests.find((h) => h.season === season && h.commodity === commodity);
  const myPrev = state.harvests.find((h) => h.season === "Musim 2025" && h.commodity === commodity);

  const maxTon = Math.max(6, myCurrent?.tonPerHa ?? 0, myPrev?.tonPerHa ?? 0, aggregate.avgTonPerHa ?? 0);

  function handleAddHarvest(e: React.FormEvent) {
    e.preventDefault();
    const area = Math.max(0.5, Number(formAreaHa) || 2);
    const sacks = Math.max(0, Math.round(Number(formSacks) || 0));
    const tonPerHa = Math.max(0, Number(formTonPerHa) || Number(((sacks * 50) / 1000 / area).toFixed(2)));
    const revenue = Math.max(0, Math.round(Number(formRevenue) || 0));
    const cost = Math.max(0, Math.round(Number(formCost) || 0));

    addHarvest({
      season: formSeason,
      commodity: formCommodity,
      areaHa: area,
      sacks,
      tonPerHa,
      revenue,
      cost,
      zeroBurn: true,
    });
    setCommodity(formCommodity);
    setSeason(formSeason);
    setNotice(`Catatan panen ${formCommodity} (${formSeason}) sebesar ${formatNumber(tonPerHa)} ton/ha berhasil disimpan.`);
  }

  return (
    <div className="space-y-4">
      <PageHeader
        icon={BookOpen}
        title="Jurnal Panen & Agregat Desa"
        subtitle="Satuan lokal (Karung, Ton/ha, Rupiah) · Tanpa peringkat individu · Privasi N ≥ 5"
      />

      {notice && (
        <div className="flex items-start gap-2 rounded-2xl border border-gambut bg-tunas p-3 text-xs font-medium text-arang">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-gambut" />
          <span>{notice}</span>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-12">
      {/* Kontrol Filter & Sakelar Simulasi Ambang Privasi N >= 5 */}
      <Card className="border-gambut/20 lg:col-span-7 h-fit">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="flex items-center gap-1.5 text-base">
              <BarChart3 className="size-5 text-gambut" />
              Perbandingan Hasil Panen Tanpa Bakar
            </CardTitle>
            <Badge variant={aggregate.level === "desa" ? "aman" : "waspada"}>
              <Lock /> {aggregate.level === "desa" ? `Agregat Desa (N=${aggregate.villageFarmerCount})` : `Fallback Kecamatan (N Desa=${aggregate.villageFarmerCount} < ${PRIVACY_MIN_N})`}
            </Badge>
          </div>
          <CardDescription>
            Membandingkan kebun Anda sendiri terhadap rata-rata kolektif — tidak pernah menampilkan nama atau urutan
            tetangga.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="filter-commodity">Komoditas</Label>
              <Select
                id="filter-commodity"
                value={commodity}
                onChange={(e) => setCommodity(e.target.value)}
              >
                {COMMODITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="filter-season">Musim</Label>
              <Select id="filter-season" value={season} onChange={(e) => setSeason(e.target.value)}>
                {SEASONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {/* Sakelar Demo Aturan Privasi N >= 5 */}
          <div className="flex items-center justify-between gap-3 rounded-2xl bg-tunas/70 p-3">
            <div>
              <p className="text-xs font-bold text-arang">
                Uji Aturan Privasi Ambang Batas N ≥ {PRIVACY_MIN_N} Petani
              </p>
              <p className="text-[11px] text-kabut">
                Aktifkan untuk melihat bagaimana sistem otomatis beralih ke rata-rata{" "}
                <strong>{village.district}</strong> bila pencatat di desa kurang dari 5 orang.
              </p>
            </div>
            <Switch
              checked={simulateLowN}
              onCheckedChange={setSimulateLowN}
              label="Simulasikan jumlah petani desa kurang dari 5"
            />
          </div>

          {/* Grafik Batang Perbandingan: Musim Lalu Saya vs Musim Ini Saya vs Rata-Rata Aman Desa/Kecamatan */}
          <div className="space-y-3 rounded-2xl border border-gambut/15 bg-slate-50/70 p-3.5">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-kabut">Kebun Saya — Musim 2025 (Sebelum Tanpa Bakar)</span>
                <span className="font-bold tabular-nums text-arang">
                  {myPrev ? `${formatNumber(myPrev.tonPerHa)} ton/ha (${myPrev.sacks} karung)` : "Belum ada catatan"}
                </span>
              </div>
              <Progress
                value={myPrev ? (myPrev.tonPerHa / maxTon) * 100 : 0}
                indicatorClassName="bg-slate-400"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-gambut">Kebun Saya — {season} (Tanpa Bakar)</span>
                <span className="font-extrabold tabular-nums text-gambut">
                  {myCurrent
                    ? `${formatNumber(myCurrent.tonPerHa)} ton/ha (${myCurrent.sacks} karung)`
                    : "Belum ada catatan"}
                </span>
              </div>
              <Progress value={myCurrent ? (myCurrent.tonPerHa / maxTon) * 100 : 0} />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-arang">{aggregate.scopeLabel} (Tanpa Bakar)</span>
                <span className="font-bold tabular-nums text-arang">
                  {aggregate.avgTonPerHa !== null ? `${formatNumber(aggregate.avgTonPerHa)} ton/ha` : "Disembunyikan"}
                </span>
              </div>
              <Progress
                value={aggregate.avgTonPerHa ? (aggregate.avgTonPerHa / maxTon) * 100 : 0}
                indicatorClassName="bg-teal-600"
              />
            </div>

            {/* Ringkasan Pendapatan & Biaya per Hektare */}
            {aggregate.avgRevenuePerHa !== null && (
              <div className="grid grid-cols-2 gap-2 border-t border-gambut/10 pt-2.5 text-xs tabular-nums">
                <div className="rounded-xl bg-white p-2.5">
                  <p className="text-[11px] text-kabut">Pendapatan Kotor ({aggregate.scopeLabel})</p>
                  <p className="text-sm font-extrabold text-arang">{formatRupiah(aggregate.avgRevenuePerHa)}/ha</p>
                </div>
                <div className="rounded-xl bg-white p-2.5">
                  <p className="text-[11px] text-kabut">Biaya Input ({aggregate.scopeLabel})</p>
                  <p className="text-sm font-extrabold text-gambut">{formatRupiah(aggregate.avgCostPerHa ?? 0)}/ha</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-start gap-2 rounded-xl bg-slate-100 p-2.5 text-[11px] text-kabut">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-gambut" />
            <span>
              <strong>Mengapa tidak ada Leaderboard Individu?</strong> Papan peringkat individu di desa kecil dapat
              memicu rasa malu sosial (<em>public shaming</em>) saat panen turun karena cuaca. Jaga Lahan hanya
              menampilkan rata-rata gabungan minimal {PRIVACY_MIN_N} petani (`v_safe_harvest_aggregates`).
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Formulir Input Catatan Panen Baru (Satuan Lokal: Karung, Ton/ha, Rupiah) */}
      <Card className="lg:col-span-5 h-fit">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Catat Hasil Panen & Biaya Kebun Saya</CardTitle>
          <CardDescription>Masukkan dengan satuan yang biasa Anda gunakan di desa.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddHarvest} className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="form-season">Musim Panen</Label>
                <Select id="form-season" value={formSeason} onChange={(e) => setFormSeason(e.target.value)}>
                  {SEASONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="form-commodity">Komoditas</Label>
                <Select
                  id="form-commodity"
                  value={formCommodity}
                  onChange={(e) => setFormCommodity(e.target.value)}
                >
                  {COMMODITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label htmlFor="form-area">Luas (ha)</Label>
                <Input
                  id="form-area"
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="25"
                  value={formAreaHa}
                  onChange={(e) => setFormAreaHa(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="form-sacks">Hasil (Karung)</Label>
                <Input
                  id="form-sacks"
                  type="number"
                  min="0"
                  value={formSacks}
                  onChange={(e) => {
                    setFormSacks(e.target.value);
                    const area = Math.max(0.5, Number(formAreaHa) || 2);
                    const ton = ((Number(e.target.value) * 50) / 1000 / area).toFixed(1);
                    setFormTonPerHa(ton);
                  }}
                />
              </div>
              <div>
                <Label htmlFor="form-ton">Ton / ha</Label>
                <Input
                  id="form-ton"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formTonPerHa}
                  onChange={(e) => setFormTonPerHa(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="form-rev">Hasil Jual Kotor (Rp)</Label>
                <Input
                  id="form-rev"
                  type="number"
                  step="100000"
                  min="0"
                  value={formRevenue}
                  onChange={(e) => setFormRevenue(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="form-cost">Total Biaya Musim (Rp)</Label>
                <Input
                  id="form-cost"
                  type="number"
                  step="100000"
                  min="0"
                  value={formCost}
                  onChange={(e) => setFormCost(e.target.value)}
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              <PlusCircle /> Simpan ke Jurnal Panen Saya
            </Button>
          </form>

          {/* Riwayat Catatan Pribadi */}
          <div className="mt-4 space-y-2 border-t border-gambut/10 pt-3">
            <p className="text-xs font-bold uppercase tracking-wider text-kabut">Catatan Panen Pribadi Saya</p>
            {state.harvests.map((h) => (
              <div
                key={h.id}
                className="flex items-center justify-between gap-2 rounded-xl border border-gambut/10 bg-slate-50 px-3 py-2 text-xs"
              >
                <div>
                  <p className="font-bold text-arang">
                    {h.commodity} · {h.season} ({formatNumber(h.areaHa)} ha)
                  </p>
                  <p className="text-kabut tabular-nums">
                    {formatNumber(h.tonPerHa)} ton/ha ({h.sacks} karung) · Jual: {formatRupiah(h.revenue)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeHarvest(h.id)}
                  className="rounded-lg p-1.5 text-kabut hover:bg-slate-200 hover:text-bahaya"
                  aria-label="Hapus catatan panen"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}

