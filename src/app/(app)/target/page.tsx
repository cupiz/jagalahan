"use client";

import { useState } from "react";
import {
  Target,
  Plus,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Award,
  Sprout,
  Droplets,
  Wrench,
} from "lucide-react";
import {
  useV2State,
  addSavingToTarget,
  addDreamTarget,
  type DreamTarget,
} from "@/lib/store";
import { formatRupiah } from "@/lib/utils";

export default function TargetPage() {
  const state = useV2State();
  const [showNewModal, setShowNewModal] = useState(false);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("5000000");
  const [savedAmount, setSavedAmount] = useState("1000000");
  const [monthlySaving, setMonthlySaving] = useState("400000");
  const [deadline, setDeadline] = useState("Agustus 2027");
  const [icon, setIcon] = useState<DreamTarget["icon"]>("chopper");
  const [toast, setToast] = useState<string | null>(null);

  const mask = (val: string) => (state.privacyMask ? "Rp •••••••" : val);

  const handleAddSaving = (id: string, targetTitle: string, amount: number) => {
    addSavingToTarget(id, amount);
    setToast(
      `Berhasil menambah alokasi ${formatRupiah(amount)} ke "${targetTitle}"! (+10 Koin Hijau)`,
    );
    setTimeout(() => setToast(null), 3500);
  };

  const handleCreateTarget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addDreamTarget({
      title: title.trim(),
      subtitle:
        subtitle.trim() ||
        "Ayo terus konsisten kelola lahan tanpa bakar, target impianmu pasti tercapai!",
      targetAmount: Number(targetAmount) || 5_000_000,
      savedAmount: Number(savedAmount) || 500_000,
      monthlySaving: Number(monthlySaving) || 400_000,
      deadline: deadline.trim() || "Desember 2027",
      icon,
    });
    setTitle("");
    setSubtitle("");
    setShowNewModal(false);
  };

  const featured = state.targets[0];

  return (
    <div className="space-y-6 pb-10">
      {toast && (
        <div className="fixed bottom-20 right-4 z-50 flex items-center gap-2 rounded-2xl bg-emerald-800 px-4 py-3 text-xs font-bold text-white shadow-xl md:bottom-6">
          <Sparkles className="h-4 w-4 text-amber-300" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-800 md:flex-row md:items-center">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300">
            <Target className="h-3.5 w-3.5" />
            Self-Monitoring & Goal Setting
          </span>
          <h1 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            Target Lahan Impian Tanpa Bakar
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Ubah penghematan pupuk dan hasil panen tanpa bakar menjadi tabungan alat pertanian
            modern impianmu.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowNewModal(true)}
          className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          Buat Target Impian Baru
        </button>
      </div>

      {/* Featured Dream Target Hero Card (Matching Nurul Hani Screen 5 "Beli Laptop") */}
      {featured && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-700 via-teal-700 to-cyan-800 p-6 text-white shadow-lg">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur-sm">
                <Award className="h-3.5 w-3.5 text-amber-300" />
                Target Prioritas Utama
              </span>
              <h2 className="mt-2 text-2xl font-extrabold">{featured.title}</h2>
              <p className="mt-1 text-xs text-emerald-100">{featured.subtitle}</p>
            </div>
            <div className="text-left md:text-right">
              <span className="text-xs font-semibold text-emerald-100">Progres Saat Ini</span>
              <p className="text-3xl font-extrabold">
                {Math.min(100, Math.round((featured.savedAmount / featured.targetAmount) * 100))}%
              </p>
            </div>
          </div>

          <div className="mt-5 h-3.5 w-full overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-300 to-emerald-300 transition-all duration-500"
              style={{
                width: `${Math.min(100, Math.round((featured.savedAmount / featured.targetAmount) * 100))}%`,
              }}
            />
          </div>

          {/* Milestone Checkpoints 25% - 50% - 75% - 100% */}
          <div className="mt-3 grid grid-cols-4 gap-2 text-center text-[11px] font-bold">
            {[25, 50, 75, 100].map((m) => {
              const reached =
                Math.round((featured.savedAmount / featured.targetAmount) * 100) >= m;
              return (
                <div
                  key={m}
                  className={`rounded-xl py-1.5 ${
                    reached ? "bg-white/25 text-white" : "bg-white/10 text-emerald-200/70"
                  }`}
                >
                  {reached ? "✓ " : ""}Milestone {m}%
                </div>
              );
            })}
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-4 text-xs">
            <div className="flex flex-wrap gap-6">
              <div>
                <span className="text-emerald-200">Terkumpul:</span>{" "}
                <strong className="text-sm">{mask(formatRupiah(featured.savedAmount))}</strong>
              </div>
              <div>
                <span className="text-emerald-200">Target Total:</span>{" "}
                <strong className="text-sm">{mask(formatRupiah(featured.targetAmount))}</strong>
              </div>
              <div>
                <span className="text-emerald-200">Alokasi Rutin:</span>{" "}
                <strong>{mask(formatRupiah(featured.monthlySaving))}/bulan</strong>
              </div>
              <div>
                <span className="text-emerald-200">Target Tercapai:</span>{" "}
                <strong>{featured.deadline}</strong>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                handleAddSaving(featured.id, featured.title, featured.monthlySaving)
              }
              className="inline-flex items-center gap-1.5 rounded-2xl bg-white px-4 py-2.5 text-xs font-extrabold text-emerald-800 shadow-sm transition hover:bg-emerald-50"
            >
              <Plus className="h-4 w-4" />
              Tambah Alokasi +{formatRupiah(featured.monthlySaving)}
            </button>
          </div>
        </div>
      )}

      {/* All Targets Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {state.targets.map((t) => {
          const pct = Math.min(100, Math.round((t.savedAmount / t.targetAmount) * 100));
          const remaining = Math.max(0, t.targetAmount - t.savedAmount);
          const IconComp =
            t.icon === "chopper" ? Wrench : t.icon === "pump" ? Droplets : Sprout;

          return (
            <div
              key={t.id}
              className="flex flex-col justify-between rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-800"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300">
                    <IconComp className="h-5 w-5" />
                  </div>
                  <span className="rounded-xl bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300">
                    {pct}% Tercapai
                  </span>
                </div>

                <h3 className="mt-4 text-base font-extrabold text-slate-900 dark:text-white">
                  {t.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  {t.subtitle}
                </p>

                <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="mt-3 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Terkumpul:</span>
                    <strong className="text-emerald-700 dark:text-emerald-400">
                      {mask(formatRupiah(t.savedAmount))}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Target:</span>
                    <strong className="text-slate-800 dark:text-slate-200">
                      {mask(formatRupiah(t.targetAmount))}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Kurang:</span>
                    <span className="font-semibold text-slate-600 dark:text-slate-400">
                      {mask(formatRupiah(remaining))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Estimasi Selesai:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {t.deadline}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => handleAddSaving(t.id, t.title, 250_000)}
                  className="flex-1 rounded-xl bg-emerald-50 py-2 text-xs font-extrabold text-emerald-700 transition hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300"
                >
                  +Rp250rb
                </button>
                <button
                  type="button"
                  onClick={() => handleAddSaving(t.id, t.title, t.monthlySaving)}
                  className="flex-1 rounded-xl bg-emerald-600 py-2 text-xs font-extrabold text-white transition hover:bg-emerald-700"
                >
                  +{formatRupiah(t.monthlySaving)}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Buat Target Baru */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
              + Buat Target Lahan Impian Baru
            </h3>
            <form onSubmit={handleCreateTarget} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Nama Target Impian
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Mesin Pencacah Rumput Serbaguna"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Target Dana (Rp)
                  </label>
                  <input
                    type="number"
                    required
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Dana Awal (Rp)
                  </label>
                  <input
                    type="number"
                    required
                    value={savedAmount}
                    onChange={(e) => setSavedAmount(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Tabungan Rutin / Bulan
                  </label>
                  <input
                    type="number"
                    required
                    value={monthlySaving}
                    onChange={(e) => setMonthlySaving(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Target Waktu Tercapai
                  </label>
                  <input
                    type="text"
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Ikon Kategori
                </label>
                <select
                  value={icon}
                  onChange={(e) => setIcon(e.target.value as DreamTarget["icon"])}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
                >
                  <option value="chopper">Alat / Mesin Pencacah</option>
                  <option value="pump">Pompa Air & Sekat Kanal</option>
                  <option value="seeds">Bibit Unggul & Pupuk Organik</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white"
                >
                  Simpan Target
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
