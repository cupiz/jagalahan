"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Database,
  Download,
  Lock,
  RefreshCw,
  ShieldCheck,
  Trash2,
  UserRound,
} from "lucide-react";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Segmented, Select } from "@/components/ui/form";
import { ROLE_LABELS, VILLAGES } from "@/lib/data/seed";
import { flushSyncQueue } from "@/lib/offline/sync-queue";
import { resetAllData, switchRole, updateProfile, useAppState } from "@/lib/store";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import type { Role, SoilType } from "@/lib/types";
import { formatDate } from "@/lib/utils";

/**
 * Halaman Profil, Hak Subjek Data UU PDP No. 27/2022, & Sinkronisasi Supabase.
 * - Pengguna dapat mengubah nama, desa, peran, dan luas lahan.
 * - Menyediakan tombol 1-ketuk untuk mengunduh salinan data pribadi (JSON) dan menghapus seluruh catatan (Right to Erasure).
 */
export default function ProfilPage() {
  const state = useAppState();
  const [syncMsg, setSyncMsg] = useState<string | null>(null);
  const [syncing, setSyncing] = useState<boolean>(false);

  async function handleManualSync() {
    setSyncing(true);
    const res = await flushSyncQueue();
    setSyncMsg(res.message);
    setSyncing(false);
  }

  function handleExportMyData() {
    const payload = {
      exportedAt: new Date().toISOString(),
      privacyPolicy: "Zero-GIS (Tanpa Koordinat GPS) & EXIF GPS Stripped — UU PDP No. 27 Tahun 2022",
      profile: state.profile,
      commitments: state.commitments,
      stages: state.stages.map(({ photo, ...rest }) => ({ ...rest, hasPhoto: Boolean(photo) })),
      waterLogs: state.waterLogs.map(({ photo, ...rest }) => ({ ...rest, hasPhoto: Boolean(photo) })),
      harvests: state.harvests,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `data-pribadi-jagalahan-${state.profile.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      <PageHeader
        icon={UserRound}
        title="Profil, Privasi & Sinkronisasi"
        subtitle="Kendali penuh atas data Anda sesuai UU No. 27 Tahun 2022 (UU PDP)"
      />

      {syncMsg && (
        <div className="flex items-start gap-2 rounded-2xl border border-gambut bg-tunas p-3 text-xs font-medium text-arang">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-gambut" />
          <span>{syncMsg}</span>
        </div>
      )}

      {/* Pengaturan Profil & Peran */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Identitas Ringan & Peran Kohort Desa</CardTitle>
          <CardDescription>
            Tidak memerlukan verifikasi email rumit dan tidak menyimpan koordinat GPS kebun.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label htmlFor="prof-name">Nama Panggilan di Desa</Label>
            <Input
              id="prof-name"
              value={state.profile.displayName}
              onChange={(e) => updateProfile({ displayName: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="prof-village">Desa</Label>
              <Select
                id="prof-village"
                value={state.profile.villageId}
                onChange={(e) => updateProfile({ villageId: e.target.value })}
              >
                {VILLAGES.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.regency})
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="prof-role">Peran Kohort</Label>
              <Select
                id="prof-role"
                value={state.profile.role}
                onChange={(e) => switchRole(e.target.value as Role)}
              >
                {(Object.keys(ROLE_LABELS) as Role[]).map((r) => (
                  <option key={r} value={r}>
                    {ROLE_LABELS[r]}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Jenis Tanah</Label>
              <Segmented
                ariaLabel="Jenis tanah profil"
                value={state.profile.soil}
                onChange={(soil: SoilType) => updateProfile({ soil })}
                options={[
                  { value: "gambut", label: "Gambut" },
                  { value: "mineral", label: "Mineral" },
                ]}
              />
            </div>
            <div>
              <Label htmlFor="prof-area">Luas Umum (ha)</Label>
              <Input
                id="prof-area"
                type="number"
                step="0.5"
                min="0.5"
                max="25"
                value={state.profile.areaHa}
                onChange={(e) => updateProfile({ areaHa: Math.max(0.5, Number(e.target.value) || 2) })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Antrean Sinkronisasi Luring <-> Supabase */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Database className="size-5 text-gambut" />
              Sinkronisasi Luring & Supabase
            </CardTitle>
            <Badge variant={isSupabaseConfigured ? "aman" : "secondary"}>
              {isSupabaseConfigured ? "Supabase Terhubung" : "Mode Demo Luring"}
            </Badge>
          </div>
          <CardDescription>
            Semua catatan disimpan lebih dulu di perangkat Anda agar tetap berfungsi di kebun tanpa sinyal.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          <div className="rounded-xl bg-slate-50 p-3">
            <p>
              Operasi dalam antrean sinkronisasi: <strong>{state.syncQueue.length} catatan</strong>
            </p>
            <p className="mt-0.5 text-kabut">
              Sinkronisasi terakhir: {state.lastSyncAt ? formatDate(state.lastSyncAt) : "Tersimpan lokal di perangkat"}
            </p>
          </div>
          <Button variant="secondary" className="w-full" onClick={handleManualSync} disabled={syncing}>
            <RefreshCw className={syncing ? "animate-spin" : undefined} />
            {syncing ? "Menyinkronkan..." : "Sinkronkan Sekarang"}
          </Button>
        </CardContent>
      </Card>

      {/* Jaminan Privasi & Hak Subjek Data (UU PDP No. 27 Tahun 2022) */}
      <Card className="border-2 border-gambut/25">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <ShieldCheck className="size-5 text-gambut" />
            Hak Privasi Anda (UU PDP No. 27 Tahun 2022)
          </CardTitle>
          <CardDescription>
            Tidak ada Roach Motel / Dark Pattern: Anda memegang kendali penuh atas seluruh data Anda.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          <ul className="space-y-1.5 rounded-xl bg-tunas/60 p-3 text-arang">
            <li className="flex items-center gap-1.5">
              <Lock className="size-3.5 shrink-0 text-gambut" />
              <strong>Zero-GIS Policy:</strong> 0 koordinat GPS/poligon kebun yang pernah diambil atau disimpan.
            </li>
            <li className="flex items-center gap-1.5">
              <Lock className="size-3.5 shrink-0 text-gambut" />
              <strong>Client-Side EXIF Stripper:</strong> Semua foto dibersihkan dari tag GPS di HP sebelum diunggah.
            </li>
            <li className="flex items-center gap-1.5">
              <Lock className="size-3.5 shrink-0 text-gambut" />
              <strong>Agregasi Aman N ≥ 5:</strong> Hasil panen individu tidak pernah terlihat oleh petani lain.
            </li>
          </ul>

          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={handleExportMyData}>
              <Download /> Unduh Data Saya
            </Button>
            <Button
              variant="warning"
              onClick={() => {
                resetAllData();
                setSyncMsg("Seluruh catatan lokal telah dihapus dan dikembalikan ke pengaturan awal.");
              }}
            >
              <Trash2 /> Hapus Data Saya
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

