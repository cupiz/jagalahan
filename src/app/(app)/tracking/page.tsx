"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileDown,
  Filter,
  Calendar,
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  Lock,
  Sparkles,
  CheckCircle2,
  Printer,
} from "lucide-react";
import {
  useV2State,
  addTransaction,
  deleteTransaction,
  type TxCategory,
  type TxType,
} from "@/lib/store";
import { formatRupiah, todayIso } from "@/lib/utils";

const CATEGORIES: TxCategory[] = [
  "Kompos & Mulsa",
  "Hemat Pupuk",
  "Tebas & Cacah",
  "Bantuan & Insentif",
  "Sekat Kanal & Air",
  "Lainnya",
];

export default function TrackingPage() {
  const state = useV2State();
  const [filterType, setFilterType] = useState<"semua" | TxType>("semua");
  const [filterCategory, setFilterCategory] = useState<string>("Semua Kategori");
  const [startDate, setStartDate] = useState("2026-10-01");
  const [endDate, setEndDate] = useState("2026-10-31");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);

  const [txTitle, setTxTitle] = useState("");
  const [txCategory, setTxCategory] = useState<TxCategory>("Kompos & Mulsa");
  const [txType, setTxType] = useState<TxType>("manfaat");
  const [txAmount, setTxAmount] = useState("300000");
  const [txDate, setTxDate] = useState(todayIso());
  const [txNote, setTxNote] = useState("");

  const filtered = state.transactions.filter((tx) => {
    if (filterType !== "semua" && tx.type !== filterType) return false;
    if (filterCategory !== "Semua Kategori" && tx.category !== filterCategory) return false;
    if (startDate && tx.date < startDate) return false;
    if (endDate && tx.date > endDate) return false;
    return true;
  });

  const totalManfaat = filtered
    .filter((t) => t.type === "manfaat")
    .reduce((acc, t) => acc + t.amount, 0);
  const totalBiaya = filtered
    .filter((t) => t.type === "biaya")
    .reduce((acc, t) => acc + t.amount, 0);
  const netValue = totalManfaat - totalBiaya;

  const canDownloadPdf = state.plan === "pro" || state.plan === "vip";
  const mask = (val: string) => (state.privacyMask ? "Rp •••••••" : val);

  const handleAddTx = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = Number(txAmount.replace(/[^0-9]/g, "")) || 0;
    if (!txTitle.trim() || amountNum <= 0) return;
    addTransaction({
      title: txTitle.trim(),
      category: txCategory,
      type: txType,
      amount: amountNum,
      date: txDate || todayIso(),
      note: txNote.trim() || undefined,
    });
    setTxTitle("");
    setTxNote("");
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header & Action Buttons */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-800 md:flex-row md:items-center">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300">
            <Filter className="h-3.5 w-3.5" />
            Tracking Lahan & Laporan PDF
          </span>
          <h1 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            Riwayat Manfaat & Biaya Tanpa Bakar
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Pantau seluruh nilai kompos, penghematan pupuk, dan biaya kelola lahan secara transparan
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {canDownloadPdf ? (
            <button
              type="button"
              onClick={() => setShowPdfPreview(true)}
              className="inline-flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-800 transition hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
            >
              <FileDown className="h-4 w-4" />
              Unduh Laporan PDF
            </button>
          ) : (
            <Link
              href="/paket"
              className="inline-flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs font-bold text-amber-800 transition hover:bg-amber-100"
            >
              <Lock className="h-3.5 w-3.5" />
              Unduh PDF (Pro/VIP)
            </Link>
          )}

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" />
            Tambah Catatan
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-800">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Total Nilai Manfaat (Filter)
          </p>
          <p className="mt-1 text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
            +{mask(formatRupiah(totalManfaat))}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">Penghematan pupuk & kompos organik</p>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-800">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Total Biaya Kelola (Filter)
          </p>
          <p className="mt-1 text-2xl font-extrabold text-rose-600 dark:text-rose-400">
            -{mask(formatRupiah(totalBiaya))}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">Tebas-cacah, dolomit, EM4 & sekat kanal</p>
        </div>

        <div className="rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 p-5 text-white shadow-md">
          <p className="text-xs font-semibold text-emerald-100">Surplus Bersih Tanpa Bakar</p>
          <p className="mt-1 text-2xl font-extrabold">{mask(formatRupiah(netValue))}</p>
          <p className="mt-1 text-[11px] text-emerald-100">
            {filtered.length} catatan aktivitas pada periode terpilih
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-800 lg:flex-row lg:items-center">
        {/* Tabs Semua / Manfaat / Biaya */}
        <div className="inline-flex rounded-2xl bg-slate-100 p-1 dark:bg-slate-800">
          {(
            [
              { id: "semua", label: "Semua" },
              { id: "manfaat", label: "Manfaat (+)" },
              { id: "biaya", label: "Biaya (-)" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterType(tab.id)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                filterType === tab.id
                  ? "bg-white text-emerald-700 shadow-sm dark:bg-slate-900 dark:text-emerald-400"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Category & Date Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="Semua Kategori">Semua Kategori</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-700 outline-none dark:text-slate-200"
            />
            <span className="text-slate-400">s/d</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-700 outline-none dark:text-slate-200"
            />
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-800">
        <div className="flex items-center justify-between pb-4">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
            Daftar Catatan Aktivitas ({filtered.length})
          </h2>
          <span className="text-xs text-slate-500">Klik ikon tempat sampah untuk menghapus</span>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 py-12 text-center dark:border-slate-800">
            <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
              Belum ada catatan pada filter ini
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Ubah rentang tanggal atau tambahkan catatan baru
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((tx) => (
              <div
                key={tx.id}
                className="flex flex-col justify-between gap-3 py-4 sm:flex-row sm:items-center"
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                      tx.type === "manfaat"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300"
                        : "bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300"
                    }`}
                  >
                    {tx.type === "manfaat" ? (
                      <TrendingUp className="h-5 w-5" />
                    ) : (
                      <TrendingDown className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">{tx.title}</h3>
                      <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {tx.category}
                      </span>
                      {tx.fromScanner && (
                        <span className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300">
                          <Sparkles className="h-2.5 w-2.5" /> Smart Scanner
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      Tanggal: {tx.date} {tx.note ? `• ${tx.note}` : ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <span
                    className={`text-base font-extrabold ${
                      tx.type === "manfaat"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {tx.type === "manfaat" ? "+" : "-"}
                    {mask(formatRupiah(tx.amount))}
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteTransaction(tx.id)}
                    className="rounded-xl p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/50"
                    title="Hapus catatan"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Tambah Catatan */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
              + Tambah Catatan Tracking Lahan
            </h3>
            <form onSubmit={handleAddTx} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1 dark:bg-slate-800">
                <button
                  type="button"
                  onClick={() => setTxType("manfaat")}
                  className={`rounded-xl py-2 text-xs font-bold ${
                    txType === "manfaat" ? "bg-emerald-600 text-white" : "text-slate-600"
                  }`}
                >
                  + Nilai Manfaat
                </button>
                <button
                  type="button"
                  onClick={() => setTxType("biaya")}
                  className={`rounded-xl py-2 text-xs font-bold ${
                    txType === "biaya" ? "bg-rose-600 text-white" : "text-slate-600"
                  }`}
                >
                  - Biaya Kelola
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Deskripsi Aktivitas
                </label>
                <input
                  type="text"
                  required
                  value={txTitle}
                  onChange={(e) => setTxTitle(e.target.value)}
                  placeholder="Contoh: Kompos Serasah Gambut 300 Kg"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Kategori
                  </label>
                  <select
                    value={txCategory}
                    onChange={(e) => setTxCategory(e.target.value as TxCategory)}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    value={txDate}
                    onChange={(e) => setTxDate(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Nominal (Rp)
                </label>
                <input
                  type="number"
                  required
                  min={1000}
                  step={1000}
                  value={txAmount}
                  onChange={(e) => setTxAmount(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Catatan (Opsional)
                </label>
                <input
                  type="text"
                  value={txNote}
                  onChange={(e) => setTxNote(e.target.value)}
                  placeholder="Keterangan blok atau metode"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white"
                >
                  Simpan Catatan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Pratinjau & Cetak Laporan PDF */}
      {showPdfPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
              <div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                  <CheckCircle2 className="h-3 w-3" /> Dokumen Resmi Zero-Burning JagaLahan
                </span>
                <h3 className="mt-1 text-lg font-extrabold text-slate-900 dark:text-white">
                  Laporan Pengelolaan Lahan Tanpa Bakar (PDF)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                >
                  <Printer className="h-3.5 w-3.5" />
                  Cetak / Simpan PDF
                </button>
                <button
                  type="button"
                  onClick={() => setShowPdfPreview(false)}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600"
                >
                  Tutup
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-4 text-xs text-slate-700 dark:text-slate-300">
              <div className="grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
                <div>
                  <p className="text-slate-500">Nama Petani / Pengelola:</p>
                  <p className="font-bold text-slate-900 dark:text-white">{state.userName}</p>
                  <p className="mt-1 text-slate-500">Lokasi Desa:</p>
                  <p className="font-bold text-slate-900 dark:text-white">{state.villageName}</p>
                </div>
                <div>
                  <p className="text-slate-500">Luas Lahan & Status:</p>
                  <p className="font-bold text-emerald-700">
                    {state.landAreaHa} Ha • {state.streakDays} Hari Bebas Api
                  </p>
                  <p className="mt-1 text-slate-500">Periode Laporan:</p>
                  <p className="font-bold text-slate-900 dark:text-white">
                    {startDate} s/d {endDate}
                  </p>
                </div>
              </div>

              <table className="w-full border-collapse border border-slate-200 text-left text-xs dark:border-slate-700">
                <thead>
                  <tr className="bg-emerald-50 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200">
                    <th className="border border-slate-200 p-2 dark:border-slate-700">Tanggal</th>
                    <th className="border border-slate-200 p-2 dark:border-slate-700">Aktivitas</th>
                    <th className="border border-slate-200 p-2 dark:border-slate-700">Kategori</th>
                    <th className="border border-slate-200 p-2 text-right dark:border-slate-700">
                      Nominal
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((tx) => (
                    <tr key={tx.id}>
                      <td className="border border-slate-200 p-2 dark:border-slate-700">{tx.date}</td>
                      <td className="border border-slate-200 p-2 font-semibold dark:border-slate-700">
                        {tx.title}
                      </td>
                      <td className="border border-slate-200 p-2 dark:border-slate-700">
                        {tx.category}
                      </td>
                      <td
                        className={`border border-slate-200 p-2 text-right font-bold dark:border-slate-700 ${
                          tx.type === "manfaat" ? "text-emerald-700" : "text-rose-700"
                        }`}
                      >
                        {tx.type === "manfaat" ? "+" : "-"}
                        {formatRupiah(tx.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex items-center justify-between rounded-2xl bg-emerald-50 p-4 font-bold text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200">
                <span>Surplus Nilai Manfaat Bersih Tanpa Bakar:</span>
                <span className="text-base">{formatRupiah(netValue)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
