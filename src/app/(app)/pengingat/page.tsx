"use client";

import { useState } from "react";
import {
  Bell,
  Plus,
  Clock,
  Calendar,
  Flame,
  Trash2,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";
import {
  useV2State,
  addReminder,
  toggleReminder,
  deleteReminder,
  type LandReminder,
} from "@/lib/store";

export default function PengingatPage() {
  const state = useV2State();
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [timeOrDate, setTimeOrDate] = useState("16:30");
  const [kind, setKind] = useState<LandReminder["kind"]>("harian");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addReminder({
      title: title.trim(),
      subtitle:
        subtitle.trim() ||
        "Pengingat otomatis JagaLahan agar lahan tetap aman, lembap, dan bebas api.",
      timeOrDate: timeOrDate.trim() || "16:30",
      kind,
    });
    setTitle("");
    setSubtitle("");
    setShowAdd(false);
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-800 md:flex-row md:items-center">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300">
            <Bell className="h-3.5 w-3.5" />
            Prinsip Suggestion & Pengingat Tepat Waktu
          </span>
          <h1 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            Pengingat Lahan & Siaga Karhutla
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Atur jadwal pemeriksaan kebun sore hari, balik mulsa kompos, dan peringatan cuaca kering
            BMKG tanpa notifikasi yang mengganggu.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          Tambah Pengingat Baru
        </button>
      </div>

      {/* Reminder Cards List */}
      <div className="space-y-3.5">
        {state.reminders.map((rem) => {
          const isAlert = rem.kind === "siaga_asap";
          const isDaily = rem.kind === "harian";
          return (
            <div
              key={rem.id}
              className={`flex flex-col justify-between gap-4 rounded-3xl bg-white p-5 shadow-sm ring-1 transition sm:flex-row sm:items-center dark:bg-slate-900 ${
                rem.enabled
                  ? "ring-emerald-200/90 dark:ring-emerald-900/60"
                  : "opacity-60 ring-slate-200/70 dark:ring-slate-800"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                    isAlert
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300"
                      : isDaily
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300"
                        : "bg-cyan-100 text-cyan-700 dark:bg-cyan-950/70 dark:text-cyan-300"
                  }`}
                >
                  {isAlert ? (
                    <Flame className="h-6 w-6" />
                  ) : isDaily ? (
                    <Clock className="h-6 w-6" />
                  ) : (
                    <Calendar className="h-6 w-6" />
                  )}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                      {rem.title}
                    </h3>
                    <span className="rounded-lg bg-slate-100 px-2.5 py-0.5 text-xs font-extrabold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {rem.timeOrDate}
                    </span>
                    <span
                      className={`rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase ${
                        rem.enabled
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {rem.enabled ? "Aktif" : "Nonaktif"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                    {rem.subtitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3">
                {/* Toggle Switch */}
                <button
                  type="button"
                  onClick={() => toggleReminder(rem.id)}
                  role="switch"
                  aria-checked={rem.enabled}
                  className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                    rem.enabled ? "bg-emerald-600" : "bg-slate-300 dark:bg-slate-700"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition duration-200 ${
                      rem.enabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>

                <button
                  type="button"
                  onClick={() => deleteReminder(rem.id)}
                  className="rounded-xl p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                  title="Hapus pengingat"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ethical Notification Guarantee */}
      <div className="flex items-start gap-3 rounded-3xl border border-emerald-200/70 bg-emerald-50/60 p-5 text-xs text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-200">
        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
        <div>
          <p className="font-bold">Kendali Penuh Notifikasi di Tangan Pengguna (Bebas Spam):</p>
          <p className="mt-0.5 leading-relaxed">
            Seluruh pengingat di atas dapat dimatikan kapan saja dengan satu ketukan tombol sakelar.
            JagaLahan tidak pernah mengirimkan notifikasi yang memicu kecemasan berlebih atau
            memaksa pengguna membuka aplikasi di luar jam yang Anda tentukan.
          </p>
        </div>
      </div>

      {/* Modal Tambah Pengingat */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
              + Tambah Pengingat Lahan Baru
            </h3>
            <form onSubmit={handleAdd} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Judul Pengingat
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Cek Pintu Sekat Kanal Blok Selatan"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Jenis Pengingat
                  </label>
                  <select
                    value={kind}
                    onChange={(e) => setKind(e.target.value as LandReminder["kind"])}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800"
                  >
                    <option value="harian">Rutin Harian</option>
                    <option value="musiman">Jadwal Kompos / Musiman</option>
                    <option value="siaga_asap">Siaga Cuaca Panas BMKG</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Jam atau Tanggal
                  </label>
                  <input
                    type="text"
                    required
                    value={timeOrDate}
                    onChange={(e) => setTimeOrDate(e.target.value)}
                    placeholder="Contoh: 16:30 atau 5 Nov 2026"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Pesan Motivasi / Keterangan
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Contoh: Pastikan tinggi air tetap lembap sore ini"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white"
                >
                  Simpan Pengingat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
