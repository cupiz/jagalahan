-- =============================================================================
-- JagaLahan v2 — Supabase PostgreSQL Schema & Initial Seed Data
-- Penyusun: Iqbal Ahdagita Elbadra (NIM: 26MA41D022)
-- Kepatuhan: UU Pelindungan Data Pribadi (UU No. 27 Tahun 2022)
-- =============================================================================

create extension if not exists "pgcrypto";

-- 1. Tabel Profil & Paket Langganan Pengguna (Trial 14 Hari / Pro / VIP)
create table if not exists public.v2_user_profiles (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  village_name text not null,
  land_area_ha numeric(5,2) not null default 2.00,
  plan_tier text not null default 'vip' check (plan_tier in ('trial', 'pro', 'vip')),
  privacy_mask boolean not null default false,
  coins_balance integer not null default 1250 check (coins_balance >= 0),
  streak_days integer not null default 12 check (streak_days >= 0),
  last_checkin_date date,
  created_at timestamptz not null default now()
);

-- 2. Tabel Tracking Lahan Tanpa Bakar (Manfaat & Biaya Kelola)
create table if not exists public.v2_land_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.v2_user_profiles(id) on delete cascade,
  title text not null,
  category text not null check (category in (
    'Kompos & Mulsa', 'Hemat Pupuk', 'Tebas & Cacah',
    'Bantuan & Insentif', 'Sekat Kanal & Air', 'Lainnya'
  )),
  tx_type text not null check (tx_type in ('manfaat', 'biaya')),
  amount_rp bigint not null check (amount_rp >= 0),
  tx_date date not null default current_date,
  note text,
  from_scanner boolean not null default false,
  created_at timestamptz not null default now()
);

-- 3. Tabel Smart Land & Smoke Scanner (Eksklusif VIP - EXIF GPS Stripped)
create table if not exists public.v2_smart_scans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.v2_user_profiles(id) on delete cascade,
  land_condition text not null,
  fire_risk text not null check (fire_risk in ('Aman (Lembap)', 'Waspada (Agak Kering)', 'Bahaya (Rawan Api)')),
  water_depth_cm integer not null,
  estimated_compost_kg integer not null,
  estimated_fertilizer_saved_rp bigint not null,
  recommendation text not null,
  exif_stripped boolean not null default true check (exif_stripped = true),
  scanned_at timestamptz not null default now()
);

-- 4. Tabel Pengingat Lahan & Siaga Karhutla
create table if not exists public.v2_reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.v2_user_profiles(id) on delete cascade,
  title text not null,
  subtitle text not null,
  time_or_date text not null,
  kind text not null check (kind in ('harian', 'musiman', 'siaga_asap')),
  enabled boolean not null default true,
  created_at timestamptz not null default now()
);

-- 5. Tabel Target Lahan Impian (Goal Setting & Progress Bar)
create table if not exists public.v2_dream_targets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.v2_user_profiles(id) on delete cascade,
  title text not null,
  subtitle text not null,
  target_amount_rp bigint not null check (target_amount_rp > 0),
  saved_amount_rp bigint not null default 0 check (saved_amount_rp >= 0),
  monthly_saving_rp bigint not null default 0,
  deadline_label text not null,
  icon_kind text not null default 'chopper' check (icon_kind in ('chopper', 'pump', 'seeds')),
  created_at timestamptz not null default now()
);

-- 6. Tabel Penukaran Koin Hijau (1.000 Koin = Rp10.000)
create table if not exists public.v2_reward_redemptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.v2_user_profiles(id) on delete cascade,
  reward_title text not null,
  coins_used integer not null check (coins_used > 0),
  rupiah_value bigint not null check (rupiah_value > 0),
  redeemed_date date not null default current_date
);
