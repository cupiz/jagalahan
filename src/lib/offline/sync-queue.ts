"use client";

import { getVillage } from "@/lib/data/seed";
import { getState, markSynced } from "@/lib/store";
import { getSupabase } from "@/lib/supabase/client";

/**
 * Antrean sinkronisasi luring → Supabase.
 * - Login anonim (tanpa verifikasi email rumit) via Supabase Auth.
 * - Profil hanya menyimpan desa & luas lahan (tanpa koordinat GPS).
 * - Operasi dikirim berurutan; yang gagal tetap di antrean untuk dicoba lagi.
 */

export type SyncResult =
  | { status: "demo"; message: string }
  | { status: "ok"; synced: number; message: string }
  | { status: "error"; message: string };

let running = false;

export async function flushSyncQueue(): Promise<SyncResult> {
  const supabase = getSupabase();
  if (!supabase) {
    return { status: "demo", message: "Mode demo luring: data tersimpan aman di perangkat ini." };
  }
  if (running) return { status: "ok", synced: 0, message: "Sinkronisasi sedang berjalan." };
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return { status: "error", message: "Sedang luring. Data akan dikirim otomatis saat sinyal kembali." };
  }

  running = true;
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      const { error } = await supabase.auth.signInAnonymously();
      if (error) throw new Error(`Login anonim gagal: ${error.message}`);
    }
    const { data: userData } = await supabase.auth.getUser();
    const authUserId = userData.user?.id;
    if (!authUserId) throw new Error("Sesi pengguna tidak ditemukan.");

    const state = getState();
    const village = getVillage(state.profile.villageId);
    const { data: villageRow, error: villageErr } = await supabase
      .from("villages")
      .select("id")
      .eq("village_code", village.code)
      .maybeSingle();
    if (villageErr || !villageRow) throw new Error("Desa belum terdaftar di Supabase (jalankan seed.sql).");

    const { data: profileRow, error: profileErr } = await supabase
      .from("profiles")
      .upsert(
        {
          auth_user_id: authUserId,
          village_id: villageRow.id,
          display_name: state.profile.displayName,
          role: state.profile.role,
          dominant_soil_type: state.profile.soil,
          default_land_area_ha: state.profile.areaHa,
          next_planting_date: state.profile.nextPlantingDate,
          ignored_reminder_count: state.profile.ignoredReminders,
          reminders_paused: state.profile.remindersPaused,
        },
        { onConflict: "auth_user_id" },
      )
      .select("id")
      .single();
    if (profileErr || !profileRow) throw new Error(`Profil gagal disimpan: ${profileErr?.message}`);

    const base = { profile_id: profileRow.id, village_id: villageRow.id };
    const done: string[] = [];

    for (const op of state.syncQueue) {
      const p = op.payload;
      let error: { message: string } | null = null;

      if (op.table === "season_commitments") {
        ({ error } = await supabase.from("season_commitments").insert({
          ...base,
          season_label: p.season,
          committed_area_ha: p.areaHa,
          soil_type: p.soil,
          vegetation_density: p.density,
          is_public_to_village: p.isPublic,
          status: p.status,
        }));
      } else if (op.table === "six_stage_progress") {
        const { data: latest } = await supabase
          .from("season_commitments")
          .select("id")
          .eq("profile_id", profileRow.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        if (latest) {
          ({ error } = await supabase
            .from("six_stage_progress")
            .upsert({ ...p, commitment_id: latest.id }, { onConflict: "commitment_id,stage_number" }));
        }
      } else if (op.table === "smoke_reports") {
        ({ error } = await supabase
          .from("smoke_reports")
          .insert({ ...p, reporter_profile_id: profileRow.id, village_id: villageRow.id }));
      } else {
        ({ error } = await supabase.from(op.table).insert({ ...base, ...p }));
      }

      if (error) {
        console.warn(`[JagaLahan] Sinkronisasi ${op.table} gagal:`, error.message);
        break; // pertahankan urutan; coba lagi nanti
      }
      done.push(op.id);
    }

    markSynced(done);
    return { status: "ok", synced: done.length, message: `${done.length} catatan tersinkron ke Supabase.` };
  } catch (err) {
    return { status: "error", message: err instanceof Error ? err.message : "Sinkronisasi gagal." };
  } finally {
    running = false;
  }
}

