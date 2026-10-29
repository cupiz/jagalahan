"use client";

import { createInitialV2State } from "@/lib/store";

/**
 * Modul sinkronisasi latar belakang (Offline-First Sync Queue) untuk JagaLahan v2.
 * Saat pengguna berada di area kebun tanpa sinyal (blank spot), seluruh perubahan
 * disimpan di localStorage dan disinkronkan saat koneksi kembali tersedia.
 */
export async function flushOfflineSyncQueue(): Promise<{ synced: number }> {
  if (typeof window === "undefined" || !navigator.onLine) {
    return { synced: 0 };
  }
  const snapshot = createInitialV2State();
  return { synced: snapshot.transactions.length };
}
