"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Klien Supabase untuk peramban.
 * Jika variabel lingkungan belum diisi, aplikasi tetap berjalan penuh dalam MODE DEMO LURING
 * (data tersimpan di perangkat dan menunggu di antrean sinkronisasi).
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;

export const isSupabaseConfigured = Boolean(url && key);

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!client) {
    client = createClient(url!, key!, {
      auth: { persistSession: true, autoRefreshToken: true },
    });
  }
  return client;
}

