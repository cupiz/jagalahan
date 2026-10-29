import type { PhotoRecord } from "@/lib/types";

/**
 * Pembersih metadata EXIF/GPS di sisi klien (berjalan 100% di peramban).
 * Foto digambar ulang ke HTML5 Canvas lalu diekspor ulang, sehingga seluruh
 * header EXIF (termasuk tag GPSInfo 0x8825) hilang sebelum foto meninggalkan perangkat.
 */

export interface ExifInspection {
  hasExif: boolean;
  hasGps: boolean;
}

/** Membaca header JPEG dan mendeteksi segmen APP1 "Exif" serta tag GPSInfo (0x8825). */
export function inspectExif(buffer: ArrayBuffer): ExifInspection {
  const view = new DataView(buffer);
  if (view.byteLength < 4 || view.getUint16(0) !== 0xffd8) {
    // Bukan JPEG (mis. PNG/WebP) — cari penanda "Exif" secara umum.
    const bytes = new Uint8Array(buffer.slice(0, Math.min(buffer.byteLength, 65536)));
    const text = String.fromCharCode(...bytes.slice(0, 4096));
    return { hasExif: text.includes("Exif"), hasGps: false };
  }

  let offset = 2;
  while (offset + 4 <= view.byteLength) {
    const marker = view.getUint16(offset);
    if ((marker & 0xff00) !== 0xff00) break;
    const size = view.getUint16(offset + 2);
    if (marker === 0xffe1 && offset + 10 <= view.byteLength) {
      const header = String.fromCharCode(
        view.getUint8(offset + 4),
        view.getUint8(offset + 5),
        view.getUint8(offset + 6),
        view.getUint8(offset + 7),
      );
      if (header === "Exif") {
        const tiff = offset + 10;
        if (tiff + 8 > view.byteLength) return { hasExif: true, hasGps: false };
        const little = view.getUint16(tiff) === 0x4949;
        const ifd0 = tiff + view.getUint32(tiff + 4, little);
        if (ifd0 + 2 > view.byteLength) return { hasExif: true, hasGps: false };
        const entries = view.getUint16(ifd0, little);
        for (let i = 0; i < entries; i++) {
          const entry = ifd0 + 2 + i * 12;
          if (entry + 2 > view.byteLength) break;
          if (view.getUint16(entry, little) === 0x8825) {
            return { hasExif: true, hasGps: true };
          }
        }
        return { hasExif: true, hasGps: false };
      }
    }
    if (marker === 0xffda) break; // awal data gambar
    offset += 2 + size;
  }
  return { hasExif: false, hasGps: false };
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Gambar tidak dapat dibaca."));
    };
    img.src = url;
  });
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

export interface StripResult {
  blob: Blob;
  record: PhotoRecord;
}

/**
 * Membersihkan EXIF/GPS dan mengecilkan foto (hemat kuota).
 * Melempar error jika hasil re-encode masih mengandung EXIF (fail-closed).
 */
export async function stripExifAndCompress(file: File, maxSize = 960, quality = 0.78): Promise<StripResult> {
  const original = await file.arrayBuffer();
  const before = inspectExif(original);

  const img = await loadImage(file);
  const scale = Math.min(1, maxSize / Math.max(img.naturalWidth, img.naturalHeight));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.naturalWidth * scale);
  canvas.height = Math.round(img.naturalHeight * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas tidak tersedia di perangkat ini.");
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Gagal memproses foto."))), "image/jpeg", quality),
  );

  const after = inspectExif(await blob.arrayBuffer());
  if (after.hasExif || after.hasGps) {
    throw new Error("Foto masih mengandung metadata. Unggahan dibatalkan demi privasi.");
  }

  return {
    blob,
    record: {
      dataUrl: await blobToDataUrl(blob),
      hadExif: before.hasExif,
      hadGps: before.hasGps,
      exifStrippedVerified: true,
      bytesBefore: file.size,
      bytesAfter: blob.size,
    },
  };
}

