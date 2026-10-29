"use client";

import { useState } from "react";
import {
  User,
  ShieldCheck,
  Eye,
  EyeOff,
  Download,
  RotateCcw,
  CheckCircle2,
  Lock,
} from "lucide-react";
import {
  useV2State,
  updateUserProfile,
  togglePrivacyMask,
  resetV2Data,
} from "@/lib/store";

export default function ProfilPage() {
  const state = useV2State();
  const [userName, setUserName] = useState(state.userName);
  const [villageName, setVillageName] = useState(state.villageName);
  const [landAreaHa, setLandAreaHa] = useState(String(state.landAreaHa));
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      userName: userName.trim() || "Iqbal",
      villageName: villageName.trim() || "Desa Kalampangan, Palangka Raya",
      landAreaHa: Number(landAreaHa) || 2.0,
    });
    setSavedNotice("Profil & data kebun berhasil diperbarui!");
    setTimeout(() => setSavedNotice(null), 3500);
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `jagalahan-v2-backup-${state.userName.toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    resetV2Data();
    setUserName("Iqbal");
    setVillageName("Desa Kalampangan, Palangka Raya");
    setLandAreaHa("2");
    setSavedNotice("Seluruh data aplikasi dikembalikan ke setelan awal demo v2.");
    setTimeout(() => setSavedNotice(null), 3500);
  };

  return (
    <div className="space-y-6 pb-10">
      {savedNotice && (
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-md">
          <CheckCircle2 className="h-4 w-4" />
          <span>{savedNotice}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Form Profil Petani / Pengelola Kebun (6 cols) */}
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-800 lg:col-span-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Profil Pengguna & Lahan
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Data disimpan secara lokal di perangkat Anda (Offline-First)
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Nama Panggilan Pengguna
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold dark:border-slate-700 dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Desa / Wilayah Kelola (Agregat Desa, Bukan Koordinat GPS Rumah)
              </label>
              <input
                type="text"
                value={villageName}
                onChange={(e) => setVillageName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold dark:border-slate-700 dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Luas Lahan Kelola Tanpa Bakar (Hektare)
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                value={landAreaHa}
                onChange={(e) => setLandAreaHa(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold dark:border-slate-700 dark:bg-slate-800"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-emerald-600 py-3 text-xs font-extrabold text-white transition hover:bg-emerald-700"
            >
              Simpan Perubahan Profil
            </button>
          </form>
        </div>

        {/* Privasi, Keamanan Data & Kepatuhan UU PDP No. 27/2022 (6 cols) */}
        <div className="space-y-6 lg:col-span-6">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  Kendali Privasi & Etika Data (UU PDP)
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Perlindungan penuh atas data finansial lahan & foto pemindaian
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
                <div>
                  <p className="text-xs font-extrabold text-slate-900 dark:text-white">
                    Mode Privasi Nominal (Sensor Rp •••••••)
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Sembunyikan angka tabungan & nilai manfaat saat membuka aplikasi di tempat umum
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => togglePrivacyMask()}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white dark:bg-emerald-600"
                >
                  {state.privacyMask ? (
                    <>
                      <EyeOff className="h-3.5 w-3.5" /> Aktif
                    </>
                  ) : (
                    <>
                      <Eye className="h-3.5 w-3.5" /> Nonaktif
                    </>
                  )}
                </button>
              </div>

              <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50/50 p-4 text-xs text-emerald-950 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-200">
                <div className="flex items-center gap-1.5 font-extrabold">
                  <Lock className="h-4 w-4 text-emerald-600" />
                  <span>Jaminan Privasi JagaLahan v2:</span>
                </div>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-[11px] leading-relaxed">
                  <li>
                    <strong>Pembersihan EXIF/GPS Otomatis:</strong> Foto yang dipindai di Smart
                    Scanner dihapus tag koordinat GPS-nya di sisi klien sebelum diproses.
                  </li>
                  <li>
                    <strong>Tanpa Penjualan Data:</strong> Data catatan lahan, foto kebun, dan
                    progres tabungan alat tani tidak pernah dijual ke pihak ketiga.
                  </li>
                  <li>
                    <strong>Hak Portabilitas & Penghapusan:</strong> Anda dapat mengunduh seluruh
                    data dalam format JSON atau meresetnya kapan saja di bawah ini.
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleExportJson}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-2.5 text-xs font-extrabold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200"
              >
                <Download className="h-4 w-4" />
                Ekspor Data JSON
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-extrabold text-rose-700 hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-300"
              >
                <RotateCcw className="h-4 w-4" />
                Reset Data Demo v2
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
