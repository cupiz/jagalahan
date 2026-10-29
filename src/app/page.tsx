"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  Calculator,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Droplets,
  Flame,
  Handshake,
  LayoutDashboard,
  ListChecks,
  Lock,
  MapPin,
  ShieldCheck,
  Sparkles,
  Sprout,
  Users,
  Wrench,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Segmented } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { calculateCosts } from "@/lib/calculator/cost-engine";
import { DEFAULT_PRICE_REF, ROLE_DESCRIPTIONS, ROLE_LABELS, ROLE_PERSONA, VILLAGES } from "@/lib/data/seed";
import { completeOnboarding, switchRole, useAppState, useHydrated } from "@/lib/store";
import type { Role, SoilType } from "@/lib/types";
import { cn, formatNumber, formatRupiah } from "@/lib/utils";
import { getZone } from "@/lib/water/zones";

const ROLES: Role[] = ["pekebun_primer", "petani_sekunder", "penyuluh_tersier", "warga_penjaga"];
const AREA_PRESETS = [0.5, 1, 2, 3, 5];

export default function LandingPage() {
  const router = useRouter();
  const state = useAppState();
  const hydrated = useHydrated();

  // State simulasi interaktif di Hero Landing Page
  const [heroAreaHa, setHeroAreaHa] = useState<number>(2);
  const [heroBorrowChopper, setHeroBorrowChopper] = useState<boolean>(false);
  const [heroWaterCm, setHeroWaterCm] = useState<number>(36);

  // State Onboarding 3 Langkah (#onboarding)
  const [step, setStep] = useState<number>(0);
  const [villageId, setVillageId] = useState<string>("kalampangan");
  const [role, setRole] = useState<Role>("pekebun_primer");
  const [soil, setSoil] = useState<SoilType>("gambut");
  const [areaHa, setAreaHa] = useState<number>(2);
  const [consent, setConsent] = useState<boolean>(true);

  const heroCost = calculateCosts({
    areaHa: heroAreaHa,
    soil: "gambut",
    density: "sedang",
    borrowVillageChopper: heroBorrowChopper,
    prices: DEFAULT_PRICE_REF,
  });
  const heroZone = getZone(heroWaterCm);

  function finishOnboarding() {
    completeOnboarding({
      villageId,
      role,
      soil,
      areaHa,
      displayName: ROLE_PERSONA[role],
    });
    router.push("/beranda");
  }

  function enterAsRole(selectedRole: Role) {
    switchRole(selectedRole);
    completeOnboarding({
      role: selectedRole,
      displayName: ROLE_PERSONA[selectedRole],
      soil: selectedRole === "petani_sekunder" ? "mineral" : "gambut",
    });
    router.push(
      selectedRole === "penyuluh_tersier"
        ? "/penyuluh"
        : selectedRole === "warga_penjaga"
          ? "/pantau-asap"
          : "/beranda",
    );
  }

  return (
    <div className="min-h-dvh bg-kertas text-arang">
      {/* =====================================================================
          1. TOP NAVBAR (Desktop & Mobile)
         ===================================================================== */}
      <header className="sticky top-0 z-40 border-b border-gambut/15 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo-jagalahan.png"
              alt="Logo Jaga Lahan"
              width={42}
              height={42}
              className="rounded-xl shadow-xs"
              priority
            />
            <div>
              <span className="block text-lg font-extrabold leading-none tracking-tight text-gambut">
                Jaga Lahan
              </span>
              <span className="mt-0.5 block text-xs font-medium text-kabut">
                Persuasive Technology · Ekosistem Gambut
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-semibold text-arang md:flex">
            <a href="#masalah-karhutla" className="hover:text-gambut">
              Data & Masalah
            </a>
            <a href="#fitur-lengkap" className="hover:text-gambut">
              8 Modul Inti
            </a>
            <a href="#kohort-peran" className="hover:text-gambut">
              4 Peran Desa
            </a>
            <a href="#etika-privasi" className="hover:text-gambut">
              Etika & UU PDP
            </a>
            <a href="#onboarding" className="hover:text-gambut">
              Onboarding
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            <Link href="/kalkulator" className="hidden sm:inline-flex">
              <Button variant="outline" size="sm">
                <Calculator /> Coba Kalkulator
              </Button>
            </Link>
            <Link href="/beranda">
              <Button size="sm">
                <LayoutDashboard />
                {hydrated && state.onboarded ? `Dasbor (${state.profile.displayName})` : "Buka Dasbor Aplikasi"}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* =====================================================================
          2. HERO SECTION (2 Kolom Lebar di Desktop + Widget Simulasi Langsung)
         ===================================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gambut-900 via-gambut to-[#13462b] text-white">
        <div className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-emerald-400/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-28 -left-20 size-96 rounded-full bg-teal-300/10 blur-2xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-12 lg:py-20 lg:px-8">
          {/* Kolom Kiri Hero (7 kolom) */}
          <div className="space-y-6 lg:col-span-7">
            <div className="inline-flex flex-wrap items-center gap-2 rounded-full bg-white/12 px-4 py-1.5 text-xs font-semibold text-emerald-100 ring-1 ring-white/25">
              <Sparkles className="size-3.5 text-emerald-300" />
              <span>Pendamping Pembukaan Lahan Tanpa Bakar Berbasis Komunitas Desa</span>
            </div>

            <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:leading-[1.12]">
              Buka Lahan Tanpa Bakar —{" "}
              <span className="text-emerald-300">Jaga Gambut, Jaga Panen Desa.</span>
            </h1>

            <p className="max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
              Petani kecil tidak memilih api karena ingin merusak lingkungan, melainkan karena keterbatasan biaya sewa
              alat dan tenaga kerja (<strong className="text-white">Ability</strong> pada model perilaku{" "}
              <code className="rounded bg-white/15 px-1.5 py-0.5 text-emerald-200">B = MAT</code>).{" "}
              <strong className="text-white">Jaga Lahan</strong> hadir sebagai alat hitung yang jujur, pemandu 6 tahap
              praktis, pemantau air gambut, dan penghubung alat pencacah gilir desa —{" "}
              <span className="underline decoration-emerald-300 underline-offset-4">
                100% tanpa melacak titik GPS kebun petani
              </span>
              .
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link href="/beranda">
                <Button
                  size="lg"
                  className="bg-white text-gambut-900 hover:bg-emerald-50"
                >
                  <LayoutDashboard /> Masuk ke Beranda Dasbor <ArrowRight />
                </Button>
              </Link>
              <Link href="/kalkulator">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/35 bg-white/10 text-white hover:bg-white/20"
                >
                  <Calculator /> Hitung Biaya Bakar vs. Tanpa Bakar
                </Button>
              </Link>
              <a
                href="#onboarding"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-emerald-200 hover:text-white"
              >
                Atur Profil 3 Langkah <ArrowRight className="size-4" />
              </a>
            </div>

            {/* 3 Pilar Jaminan Lapangan */}
            <div className="grid gap-3 border-t border-white/15 pt-6 sm:grid-cols-3">
              <div className="flex items-start gap-2.5">
                <Lock className="mt-0.5 size-5 shrink-0 text-emerald-300" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-200">Zero-GIS & Bebas EXIF</p>
                  <p className="text-xs text-white/80">
                    Tidak ada koordinat GPS kebun; metadata lokasi foto dihapus di HP sebelum diunggah.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Droplets className="mt-0.5 size-5 shrink-0 text-emerald-300" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-200">Ambang 40 cm PP 57/2016</p>
                  <p className="text-xs text-white/80">
                    Indikator tongkat ukur 3 zona dengan Warna + Ikon + Pola yang ramah buta warna.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Handshake className="mt-0.5 size-5 shrink-0 text-emerald-300" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-200">Jujur & Non-Koersif</p>
                  <p className="text-xs text-white/80">
                    Menampilkan selisih biaya apa adanya, tanpa ancaman pidana & tanpa peringkat individu.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Kolom Kanan Hero: Widget Simulasi Interaktif Langsung (5 kolom) */}
          <div id="kalkulator-interaktif" className="lg:col-span-5">
            <div className="rounded-3xl border border-white/20 bg-white p-5 text-arang shadow-2xl sm:p-6">
              <div className="flex items-center justify-between gap-2 border-b border-gambut/10 pb-3">
                <div>
                  <Badge variant="default">Simulasi Interaktif Langsung</Badge>
                  <h2 className="mt-1 text-lg font-extrabold text-arang">
                    Coba Kalkulator & Tongkat Air Gambut
                  </h2>
                </div>
                <Link href="/kalkulator" className="text-xs font-bold text-gambut hover:underline">
                  Buka Penuh →
                </Link>
              </div>

              {/* Mini Kalkulator 2 Kolom */}
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>Luas Lahan Gambut (Semak Sedang):</span>
                  <span className="text-base font-extrabold text-gambut tabular-nums">
                    {formatNumber(heroAreaHa)} ha
                  </span>
                </div>
                <input
                  type="range"
                  min={0.5}
                  max={5}
                  step={0.5}
                  value={heroAreaHa}
                  onChange={(e) => setHeroAreaHa(Number(e.target.value))}
                  className="w-full accent-[#1B5E3A]"
                  aria-label="Geser luas lahan simulasi"
                />

                <div className="flex items-center justify-between rounded-xl bg-tunas/70 px-3 py-2 text-xs">
                  <span className="font-semibold text-arang">
                    Pinjam Alat Pencacah Gilir Desa (Hemat {formatRupiah(heroCost.chopperRental)})
                  </span>
                  <Switch
                    checked={heroBorrowChopper}
                    onCheckedChange={setHeroBorrowChopper}
                    label="Simulasi pinjam alat pencacah desa"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5 tabular-nums">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-[11px] font-bold uppercase text-kabut">Cara Bakar (Musim 1)</p>
                    <p className="mt-0.5 text-lg font-extrabold text-arang">{formatRupiah(heroCost.burn.total)}</p>
                    <p className="mt-1 text-[11px] text-bahaya">
                      2 Musim: {formatRupiah(heroCost.twoSeason.burn)} (pupuk naik)
                    </p>
                  </div>
                  <div className="rounded-2xl border-2 border-gambut bg-tunas/50 p-3">
                    <p className="text-[11px] font-bold uppercase text-gambut">Tanpa Bakar (Musim 1)</p>
                    <p className="mt-0.5 text-lg font-extrabold text-gambut">{formatRupiah(heroCost.zeroBurn.total)}</p>
                    <p className="mt-1 text-[11px] font-semibold text-gambut-900">
                      2 Musim: {formatRupiah(heroCost.twoSeason.zeroBurn)} (hemat pupuk)
                    </p>
                  </div>
                </div>

                <p className="rounded-xl bg-slate-100 p-2.5 text-xs text-arang">
                  {heroCost.season1Gap > 0 ? (
                    <>
                      <strong>Transparan & Jujur:</strong> Tanpa pinjam alat, musim ke-1 butuh tambahan{" "}
                      <strong className="text-bahaya">{formatRupiah(heroCost.season1Gap)}</strong> — aktifkan sakelar{" "}
                      <em>Pinjam Alat Desa</em> di atas untuk menutup selisihnya!
                    </>
                  ) : (
                    <>
                      <strong>Solusi Desa Aktif:</strong> Dengan alat pencacah gilir desa, metode Tanpa Bakar langsung{" "}
                      <strong className="text-gambut">
                        lebih hemat {formatRupiah(Math.abs(heroCost.season1Gap))}
                      </strong>{" "}
                      sejak musim pertama!
                    </>
                  )}
                </p>
              </div>

              {/* Mini Simulasi Tongkat Air Gambut PP 57/2016 */}
              <div className="mt-4 border-t border-gambut/10 pt-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-arang">Simulasi Tongkat Ukur Air Gambut:</span>
                  <Badge variant={heroZone.zone} className="tabular-nums">
                    {heroWaterCm} cm · {heroZone.label}
                  </Badge>
                </div>
                <input
                  type="range"
                  min={0}
                  max={80}
                  step={2}
                  value={heroWaterCm}
                  onChange={(e) => setHeroWaterCm(Number(e.target.value))}
                  className="mt-2 w-full accent-[#1B5E3A]"
                  aria-label="Simulasi kedalaman muka air gambut"
                />
                <p className="mt-1 text-[11px] text-kabut">{heroZone.message}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. DATA EMPIRIS KARHUTLA & KERANGKA TEORETIS (#masalah-karhutla)
         ===================================================================== */}
      <section id="masalah-karhutla" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="secondary">Latar Belakang Empiris & Teoretis</Badge>
          <h2 className="mt-2 text-2xl font-extrabold text-arang sm:text-3xl">
            Mengapa Sosialisasi Hukum Saja Tidak Cukup Menghentikan Karhutla?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-kabut sm:text-base">
            Berdasarkan data resmi Kementerian Lingkungan Hidup dan Kehutanan (KLHK) serta BNPB, pembakaran lahan berulang
            terjadi karena petani menghadapi hambatan kemampuan nyata (<em>Ability</em>) pada jendela pra-musim tanam.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              stat: "1,65 Juta Ha",
              label: "Luas Karhutla Puncak 2019",
              desc: "Menimbulkan kerugian ekonomi, kerusakan gambut, dan gangguan pernapasan lintas provinsi (KLHK, 2024).",
            },
            {
              stat: "1,16 Juta Ha",
              label: "Karhutla Saat El Niño 2023",
              desc: "Kembali melonjak tajam ketika kemarau panjang menurunkan muka air tanah gambut melewati batas 40 cm.",
            },
            {
              stat: "~99%",
              label: "Faktor Aktivitas Manusia",
              desc: "Sebagian besar dipicu pembukaan lahan karena membakar dianggap jauh lebih murah dan cepat dibanding menebas.",
            },
            {
              stat: "Rp300.000",
              label: "Selisih Biaya Awal (2 Ha)",
              desc: "Hambatan biaya sewa alat cacah & dolomit di musim pertama yang dijembatani oleh Jaga Lahan lewat alat gilir desa.",
            },
          ].map((item) => (
            <Card key={item.label} className="border-gambut/15">
              <CardHeader className="pb-2">
                <p className="text-2xl font-extrabold text-gambut tabular-nums sm:text-3xl">{item.stat}</p>
                <CardTitle className="text-sm">{item.label}</CardTitle>
              </CardHeader>
              <CardContent className="text-xs leading-relaxed text-kabut">{item.desc}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* =====================================================================
          4. DELAPAN MODUL FUNGSIONAL JAGA LAHAN (#fitur-lengkap)
         ===================================================================== */}
      <section id="fitur-lengkap" className="border-y border-gambut/10 bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Badge variant="default">Functional Triad (Fogg, 2002) & Prinsip Cialdini</Badge>
              <h2 className="mt-2 text-2xl font-extrabold text-arang sm:text-3xl">
                8 Modul Fungsional Jaga Lahan
              </h2>
              <p className="mt-1 text-sm text-kabut">
                Klik modul mana pun di bawah ini untuk langsung membuka dan menguji fiturnya.
              </p>
            </div>
            <Link href="/beranda">
              <Button variant="secondary">
                Buka Dasbor Utama <ArrowRight />
              </Button>
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                code: "F-01",
                theory: "Reduction",
                title: "Onboarding 3 Langkah",
                desc: "Pilih desa, peran, dan luas lahan dalam <60 detik tanpa verifikasi email rumit.",
                href: "#onboarding",
                icon: Sprout,
              },
              {
                code: "F-02",
                theory: "Reduction & Reciprocity",
                title: "Kalkulator Bakar vs. Tanpa Bakar",
                desc: "Perbandingan jujur 2 musim + modal transparansi rumus + pengajuan pinjam alat cacah desa.",
                href: "/kalkulator",
                icon: Calculator,
              },
              {
                code: "F-03",
                theory: "Tunneling & Tailoring",
                title: "Panduan 6 Tahap Tanpa Bakar",
                desc: "Disesuaikan untuk tanah gambut/mineral, video 40 dtk, pengingat balik mulsa H+10, & foto bebas EXIF.",
                href: "/panduan",
                icon: ListChecks,
              },
              {
                code: "F-04",
                theory: "Self-Monitoring & Simulation",
                title: "Tongkat Ukur Air Gambut",
                desc: "Skala 1 meter terhadap ambang 40 cm (PP 57/2016) dalam 3 zona ramah buta warna + 2 aksi darurat.",
                href: "/muka-air",
                icon: Droplets,
              },
              {
                code: "F-05",
                theory: "Social Proof (Aman N ≥ 5)",
                title: "Jurnal Panen & Agregat Desa",
                desc: "Input satuan karung/ton/Rp & bandingkan dengan rata-rata desa tanpa papan peringkat individu.",
                href: "/jurnal-panen",
                icon: BookOpen,
              },
              {
                code: "F-06",
                theory: "Commitment & Liking",
                title: "Kohort & 3 Lencana Desa",
                desc: "Lencana kolektif desa (Desa Bebas Bakar, 10 Ha Tanpa Bakar, Musim Ke-2) & opsi komitmen pribadi.",
                href: "/kohort-desa",
                icon: Award,
              },
              {
                code: "F-07",
                theory: "Suggestion (Unobtrusive)",
                title: "Kalender Pra-Keputusan",
                desc: "Pengingat tepat waktu pada H-21, H-14, H-7 yang berhenti otomatis setelah 3 kali diabaikan.",
                href: "/beranda",
                icon: BarChart3,
              },
              {
                code: "F-08",
                theory: "Authority & Community Guard",
                title: "Lapor Asap & Panel Penyuluh",
                desc: "Lapor asap dini tingkat blok desa, pantau pasca-bakar 6–12 bulan, & verifikasi penyuluh ber-audit log.",
                href: "/pantau-asap",
                icon: Flame,
              },
            ].map((mod) => {
              const Icon = mod.icon;
              return (
                <Link
                  key={mod.code}
                  href={mod.href}
                  className="group flex flex-col justify-between rounded-2xl border border-gambut/15 bg-kertas p-5 transition hover:-translate-y-0.5 hover:border-gambut hover:bg-tunas/40 hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex size-10 items-center justify-center rounded-xl bg-gambut text-white">
                        <Icon className="size-5" />
                      </span>
                      <span className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-bold text-gambut shadow-2xs">
                        {mod.code} · {mod.theory}
                      </span>
                    </div>
                    <h3 className="mt-3.5 text-base font-extrabold text-arang group-hover:text-gambut">
                      {mod.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-kabut">{mod.desc}</p>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-gambut">
                    Buka Modul <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================================
          5. EMPAT PERAN DALAM SATU KOHORT DESA (#kohort-peran)
         ===================================================================== */}
      <section id="kohort-peran" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="secondary">Pendekatan Ekosistem Desa</Badge>
          <h2 className="mt-2 text-2xl font-extrabold text-arang sm:text-3xl">
            Satu Kohort Desa, Empat Peran Saling Menguatkan
          </h2>
          <p className="mt-2 text-sm text-kabut sm:text-base">
            Klik salah satu peran di bawah ini untuk langsung masuk dan mencoba tampilan aplikasi sesuai peran tersebut.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ROLES.map((r) => (
            <Card key={r} className="flex flex-col justify-between border-2 border-gambut/15 hover:border-gambut">
              <CardHeader>
                <Badge variant="default" className="w-fit">
                  {ROLE_LABELS[r]}
                </Badge>
                <CardTitle className="mt-2 text-lg">{ROLE_PERSONA[r]}</CardTitle>
                <CardDescription className="text-xs leading-relaxed">{ROLE_DESCRIPTIONS[r]}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="secondary" className="w-full" onClick={() => enterAsRole(r)}>
                  Masuk sebagai {ROLE_LABELS[r]} <ArrowRight />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* =====================================================================
          6. ETIKA, ANTI-DARK PATTERNS, & UU PDP NO. 27/2022 (#etika-privasi)
         ===================================================================== */}
      <section id="etika-privasi" className="bg-gambut-900 py-14 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Badge variant="secondary">Kepatuhan UU No. 27 Tahun 2022 & Etika Berdichevsky–Neuenschwander</Badge>
            <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">
              Persuasi yang Menghormati Martabat & Privasi Petani
            </h2>
            <p className="mt-2 text-sm text-white/80 sm:text-base">
              Jaga Lahan menolak secara eksplisit penggunaan <em>Scarcity</em> (kelangkaan palsu) dan{" "}
              <em>Fear Appeal</em> (ancaman pidana berulang), serta menerapkan 6 pelindung privasi di tingkat kode.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              [
                "1. Zero-GIS Policy (Tanpa Titik GPS)",
                "Basis data tidak memiliki kolom latitude/longitude atau poligon kebun. Lokasi hanya dicatat pada tingkat administratif Desa.",
              ],
              [
                "2. Pembersih EXIF GPS di Sisi Klien",
                "Setiap foto digambar ulang melalui HTML5 Canvas di peramban HP sehingga seluruh tag lokasi EXIF hilang 100% sebelum diunggah.",
              ],
              [
                "3. Agregasi Aman N ≥ 5 Petani",
                "Rata-rata hasil panen desa hanya tampil jika ada minimal 5 petani pencatat; jika kurang, otomatis beralih ke rata-rata Kecamatan.",
              ],
              [
                "4. Tanpa Papan Peringkat Individu",
                "Mencegah rasa malu sosial (public shaming) ketika hasil panen petani turun akibat faktor cuaca atau hama.",
              ],
              [
                "5. Aturan Berhenti Eskalasi 3 Kali",
                "Jika 3 pengingat pra-musim berturut-turut tidak direspons, notifikasi aplikasi berhenti otomatis agar tidak mengganggu.",
              ],
              [
                "6. Hak Unduh & Hapus Data (UU PDP)",
                "Petani dapat mengunduh salinan seluruh catatannya (JSON) atau menghapus seluruh datanya dengan satu ketukan di halaman Profil.",
              ],
            ].map(([title, desc]) => (
              <div key={title} className="rounded-2xl border border-white/15 bg-white/5 p-5">
                <p className="flex items-center gap-2 text-sm font-extrabold text-emerald-300">
                  <ShieldCheck className="size-4 shrink-0" />
                  {title}
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-white/80">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          7. ONBOARDING INTERAKTIF 3 LANGKAH (#onboarding)
         ===================================================================== */}
      <section id="onboarding" className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
        <Card className="border-2 border-gambut/25 shadow-lg">
          <CardHeader className="border-b border-gambut/10 bg-tunas/50 p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <Badge variant="default">Modul F-01 · Onboarding Cepat 3 Langkah</Badge>
                <CardTitle className="mt-1 text-xl sm:text-2xl">
                  Atur Profil Desa & Lahan Anda (Tanpa Verifikasi Email)
                </CardTitle>
                <CardDescription>
                  Selesaikan 3 langkah singkat di bawah ini atau langsung klik <strong>Buka Dasbor Aplikasi</strong> di
                  pojok kanan atas.
                </CardDescription>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-gambut">
                {[0, 1, 2].map((i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setStep(i)}
                    className={cn(
                      "rounded-full px-3 py-1 transition",
                      step === i ? "bg-gambut text-white" : "bg-white text-gambut hover:bg-tunas",
                    )}
                  >
                    Langkah {i + 1}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {step === 0 && (
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-2.5">
                  <p className="text-sm font-extrabold text-arang">1A. Pilih Desa Percontohan (Tanpa GPS)</p>
                  {VILLAGES.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setVillageId(v.id)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-2xl border-2 p-3.5 text-left transition",
                        villageId === v.id ? "border-gambut bg-tunas" : "border-gambut/10 bg-white hover:bg-tunas/40",
                      )}
                    >
                      <MapPin className="size-5 shrink-0 text-gambut" />
                      <span className="min-w-0 flex-1">
                        <span className="block font-bold text-arang">{v.name}</span>
                        <span className="block text-xs text-kabut">
                          {v.district}, {v.regency}, {v.province} · Target {v.targetZeroBurnHa} ha
                        </span>
                      </span>
                      {villageId === v.id && <Check className="size-5 text-gambut" />}
                    </button>
                  ))}
                </div>

                <div className="space-y-2.5">
                  <p className="text-sm font-extrabold text-arang">1B. Pilih Peran Anda di Desa</p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
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
                          "rounded-2xl border-2 p-3.5 text-left transition",
                          role === r ? "border-gambut bg-tunas" : "border-gambut/10 bg-white hover:bg-tunas/40",
                        )}
                      >
                        <span className="block text-sm font-bold text-arang">{ROLE_LABELS[r]}</span>
                        <span className="mt-1 block text-xs leading-snug text-kabut">{ROLE_DESCRIPTIONS[r]}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="grid gap-6 lg:grid-cols-2">
                <div>
                  <p className="mb-2 text-sm font-extrabold text-arang">2A. Jenis Tanah Dominan</p>
                  <Segmented
                    ariaLabel="Jenis tanah"
                    value={soil}
                    onChange={setSoil}
                    options={[
                      { value: "gambut", label: "Lahan Gambut", hint: "hitam, lembek, berair" },
                      { value: "mineral", label: "Tanah Mineral", hint: "tanah kering pinggiran" },
                    ]}
                  />
                </div>
                <div>
                  <p className="mb-2 text-sm font-extrabold text-arang">
                    2B. Perkiraan Luas Lahan:{" "}
                    <span className="text-gambut tabular-nums">{formatNumber(areaHa)} hektare</span>
                  </p>
                  <div className="grid grid-cols-5 gap-2">
                    {AREA_PRESETS.map((a) => (
                      <button
                        key={a}
                        type="button"
                        onClick={() => setAreaHa(a)}
                        className={cn(
                          "h-11 rounded-xl border-2 text-sm font-bold tabular-nums",
                          areaHa === a ? "border-gambut bg-gambut text-white" : "border-gambut/15 bg-white",
                        )}
                      >
                        {formatNumber(a)} ha
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    ["Tanpa Titik GPS Kebun", "Kami hanya menyimpan nama desa dan perkiraan luas hektare."],
                    ["EXIF GPS Dihapus Otomatis", "Foto dibersihkan di perangkat Anda sebelum pernah dikirim."],
                    ["Agregasi Aman N ≥ 5", "Tidak ada data panen individu yang dibagikan ke pihak luar."],
                    ["Bebas Memilih & Menghapus", "Anda dapat menyimpan komitmen secara pribadi atau menghapus data."],
                  ].map(([t, d]) => (
                    <div key={t} className="flex gap-2.5 rounded-xl border border-gambut/15 bg-slate-50 p-3 text-xs">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-gambut" />
                      <div>
                        <p className="font-bold text-arang">{t}</p>
                        <p className="text-kabut">{d}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-tunas p-3.5 text-sm font-medium">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="size-5 accent-[#1B5E3A]"
                  />
                  <span>Saya menyetujui perlindungan privasi di atas (UU No. 27 Tahun 2022).</span>
                </label>
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-gambut/10 pt-4">
              {step > 0 ? (
                <Button variant="outline" onClick={() => setStep(step - 1)}>
                  <ArrowLeft /> Langkah Sebelumnya
                </Button>
              ) : (
                <span className="text-xs text-kabut">Langkah 1 dari 3</span>
              )}

              {step < 2 ? (
                <Button onClick={() => setStep(step + 1)}>
                  Lanjut ke Langkah {step + 2} <ArrowRight />
                </Button>
              ) : (
                <Button size="lg" disabled={!consent} onClick={finishOnboarding}>
                  <Sprout /> Simpan & Masuk ke Dasbor Beranda <ArrowRight />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-gambut/15 bg-white py-8 text-xs text-kabut">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <Image src="/icon-192.png" alt="Jaga Lahan" width={28} height={28} className="rounded-lg" />
            <span className="font-bold text-arang">Jaga Lahan</span>
            <span>· Karya Ilmiah Persuasive Technology — Iqbal Ahdagita Elbadra (26MA41D022)</span>
          </div>
          <div className="flex gap-4 font-semibold text-gambut">
            <Link href="/beranda">Beranda Dasbor</Link>
            <Link href="/kalkulator">Kalkulator</Link>
            <Link href="/panduan">Panduan 6 Tahap</Link>
            <Link href="/muka-air">Tongkat Air Gambut</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
