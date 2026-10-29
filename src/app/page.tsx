"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Lock, MapPin, ShieldCheck, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Segmented } from "@/components/ui/form";
import { ROLE_DESCRIPTIONS, ROLE_LABELS, ROLE_PERSONA, VILLAGES } from "@/lib/data/seed";
import { completeOnboarding, useAppState, useHydrated } from "@/lib/store";
import type { Role, SoilType } from "@/lib/types";
import { cn, formatNumber } from "@/lib/utils";

const ROLES: Role[] = ["pekebun_primer", "petani_sekunder", "penyuluh_tersier", "warga_penjaga"];
const AREA_PRESETS = [0.5, 1, 2, 3, 5];

/** F-01 — Onboarding 3 layar: tanpa verifikasi email, langsung ke kalkulator. */
export default function OnboardingPage() {
  const router = useRouter();
  const state = useAppState();
  const hydrated = useHydrated();
  const [step, setStep] = useState(0);
  const [villageId, setVillageId] = useState("kalampangan");
  const [role, setRole] = useState<Role>("pekebun_primer");
  const [soil, setSoil] = useState<SoilType>("gambut");
  const [areaHa, setAreaHa] = useState(2);
  const [consent, setConsent] = useState(false);

  function finish() {
    completeOnboarding({ villageId, role, soil, areaHa, displayName: ROLE_PERSONA[role] });
    router.push(role === "penyuluh_tersier" ? "/penyuluh" : role === "warga_penjaga" ? "/pantau-asap" : "/kalkulator");
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-kertas shadow-[0_0_40px_rgba(20,38,28,0.12)]">
      <div className="relative overflow-hidden bg-gambut px-6 pb-8 pt-8 text-white">
        <div className="absolute -right-10 -top-10 size-44 rounded-full bg-white/5" />
        <div className="absolute -bottom-16 -left-8 size-40 rounded-full bg-white/5" />
        <div className="relative flex items-center gap-3">
          <Image src="/logo-jagalahan.png" alt="Logo Jaga Lahan" width={64} height={64} className="rounded-2xl" priority />
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Jaga Lahan</h1>
            <p className="text-sm text-white/80">Buka Lahan Tanpa Bakar — Jaga Gambut, Jaga Panen Desa</p>
          </div>
        </div>
        {hydrated && state.onboarded && (
          <Button variant="secondary" className="relative mt-5 w-full" onClick={() => router.push("/beranda")}>
            Lanjutkan sebagai {state.profile.displayName} <ArrowRight />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2 px-6 pt-5" aria-label={`Langkah ${step + 1} dari 3`}>
        {[0, 1, 2].map((i) => (
          <div key={i} className={cn("h-2 flex-1 rounded-full", i <= step ? "bg-gambut" : "bg-tunas")} />
        ))}
      </div>

      <div className="flex-1 px-6 py-5">
        {step === 0 && (
          <section className="space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gambut">Langkah 1 dari 3</p>
              <h2 className="text-xl font-extrabold">Pilih desa & peran Anda</h2>
              <p className="text-sm text-kabut">Kami hanya mencatat nama desa — tidak ada titik GPS kebun.</p>
            </div>
            <div className="space-y-2">
              {VILLAGES.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setVillageId(v.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-2xl border-2 p-3 text-left",
                    villageId === v.id ? "border-gambut bg-tunas" : "border-gambut/10 bg-white",
                  )}
                >
                  <MapPin className="size-5 shrink-0 text-gambut" />
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold">{v.name}</span>
                    <span className="block text-xs text-kabut">
                      {v.district}, {v.regency}, {v.province}
                    </span>
                  </span>
                  {villageId === v.id && <Check className="size-5 text-gambut" />}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {ROLES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setRole(r);
                    if (r === "petani_sekunder") setSoil("mineral");
                    if (r === "pekebun_primer") setSoil("gambut");
                  }}
                  className={cn(
                    "rounded-2xl border-2 p-3 text-left",
                    role === r ? "border-gambut bg-tunas" : "border-gambut/10 bg-white",
                  )}
                >
                  <span className="block text-sm font-bold">{ROLE_LABELS[r]}</span>
                  <span className="mt-0.5 block text-[11px] leading-snug text-kabut">{ROLE_DESCRIPTIONS[r]}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {step === 1 && (
          <section className="space-y-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gambut">Langkah 2 dari 3</p>
              <h2 className="text-xl font-extrabold">Jenis tanah & luas lahan</h2>
              <p className="text-sm text-kabut">Cukup perkiraan. Bisa diubah kapan saja.</p>
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold">Jenis tanah dominan</p>
              <Segmented
                ariaLabel="Jenis tanah"
                value={soil}
                onChange={setSoil}
                options={[
                  { value: "gambut", label: "Gambut", hint: "hitam, lembek, berair" },
                  { value: "mineral", label: "Mineral", hint: "tanah kering biasa" },
                ]}
              />
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold">
                Luas lahan: <span className="text-gambut tabular-nums">{formatNumber(areaHa)} ha</span>
              </p>
              <div className="grid grid-cols-5 gap-2">
                {AREA_PRESETS.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setAreaHa(a)}
                    className={cn(
                      "h-12 rounded-xl border-2 text-sm font-bold tabular-nums",
                      areaHa === a ? "border-gambut bg-gambut text-white" : "border-gambut/15 bg-white",
                    )}
                  >
                    {formatNumber(a)}
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
                className="mt-4 w-full accent-[#1B5E3A]"
                aria-label="Luas lahan dalam hektare"
              />
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gambut">Langkah 3 dari 3</p>
              <h2 className="text-xl font-extrabold">Janji privasi kami</h2>
              <p className="text-sm text-kabut">Ditulis sederhana, sesuai UU No. 27 Tahun 2022 (Pelindungan Data Pribadi).</p>
            </div>
            <ul className="space-y-2.5">
              {[
                ["Tidak ada titik GPS / peta batas kebun.", "Kami hanya mencatat nama desa dan luas lahan (ha)."],
                ["Foto dibersihkan di HP Anda.", "Metadata lokasi (EXIF GPS) dihapus sebelum foto disimpan."],
                ["Tidak ada data perorangan untuk aparat.", "Laporan desa hanya berupa angka gabungan (minimal 5 petani)."],
                ["Anda bebas memilih.", "Komitmen bisa disimpan pribadi, tahap bisa dilewati, data bisa dihapus."],
              ].map(([t, d]) => (
                <li key={t} className="flex gap-3 rounded-2xl border border-gambut/10 bg-white p-3">
                  <ShieldCheck className="mt-0.5 size-5 shrink-0 text-gambut" />
                  <span>
                    <span className="block text-sm font-bold">{t}</span>
                    <span className="block text-xs text-kabut">{d}</span>
                  </span>
                </li>
              ))}
            </ul>
            <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-tunas p-3">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 size-5 accent-[#1B5E3A]"
              />
              <span className="text-sm">Saya mengerti dan setuju data saya disimpan sesuai janji di atas.</span>
            </label>
          </section>
        )}
      </div>

      <div className="sticky bottom-0 flex gap-2 border-t border-gambut/10 bg-kertas/95 px-6 py-4 backdrop-blur">
        {step > 0 && (
          <Button variant="outline" onClick={() => setStep(step - 1)} aria-label="Kembali">
            <ArrowLeft />
          </Button>
        )}
        {step < 2 ? (
          <Button className="flex-1" size="lg" onClick={() => setStep(step + 1)}>
            Lanjut <ArrowRight />
          </Button>
        ) : (
          <Button className="flex-1" size="lg" disabled={!consent} onClick={finish}>
            {role === "penyuluh_tersier" || role === "warga_penjaga" ? <Sprout /> : <Lock />}
            {role === "penyuluh_tersier"
              ? "Masuk Panel Penyuluh"
              : role === "warga_penjaga"
                ? "Mulai Jaga Desa"
                : "Hitung Biaya Lahan Saya"}
          </Button>
        )}
      </div>
    </div>
  );
}
