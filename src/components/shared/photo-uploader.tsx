"use client";

import { useRef, useState } from "react";
import { Camera, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { stripExifAndCompress } from "@/lib/privacy/exif-stripper";
import type { PhotoRecord } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PhotoUploaderProps {
  label?: string;
  value?: PhotoRecord;
  onChange: (photo: PhotoRecord) => void;
  className?: string;
}

/**
 * Unggah foto opsional dengan pembersihan EXIF GPS di perangkat.
 * Foto tidak pernah dikirim sebelum lolos verifikasi bebas-metadata (fail-closed).
 */
export function PhotoUploader({ label = "Tambah foto (opsional)", value, onChange, className }: PhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const { record } = await stripExifAndCompress(file);
      onChange(record);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Foto gagal diproses.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <Button variant="outline" className="w-full" onClick={() => inputRef.current?.click()} disabled={busy}>
        {busy ? <Loader2 className="animate-spin" /> : <Camera />}
        {busy ? "Membersihkan metadata lokasi…" : value ? "Ganti foto" : label}
      </Button>
      <p className="flex items-center gap-1.5 text-xs text-kabut">
        <ShieldCheck className="size-3.5 text-gambut" />
        EXIF GPS otomatis dihapus di perangkat Anda sebelum foto disimpan.
      </p>
      {error && <p className="text-sm font-medium text-bahaya">{error}</p>}
      {value && (
        <div className="flex gap-3 rounded-xl border border-gambut/15 bg-tunas/50 p-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value.dataUrl} alt="Pratinjau foto bebas EXIF" className="size-20 rounded-lg object-cover" />
          <div className="text-xs leading-relaxed text-arang">
            <p className="flex items-center gap-1 font-bold text-gambut">
              <CheckCircle2 className="size-4" /> Bebas EXIF terverifikasi
            </p>
            <p>Foto asli: {value.hadGps ? "mengandung koordinat GPS" : value.hadExif ? "mengandung EXIF (tanpa GPS)" : "tanpa EXIF"}</p>
            <p>Sekarang: 0 tag lokasi · {(value.bytesAfter / 1024).toFixed(0)} KB (dari {(value.bytesBefore / 1024).toFixed(0)} KB)</p>
          </div>
        </div>
      )}
    </div>
  );
}

