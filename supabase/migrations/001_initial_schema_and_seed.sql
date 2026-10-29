-- ============================================================================
-- JAGA LAHAN — SUPABASE POSTGRESQL MIGRATION & SEED (001)
-- Privacy-by-Design: Zero-GIS (Tanpa Koordinat GPS), EXIF-Stripped Check,
-- dan View Agregasi Aman N >= 5 (Fallback otomatis ke tingkat Kecamatan).
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. TABEL DESA (VILLAGES)
CREATE TABLE IF NOT EXISTS public.villages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    village_code VARCHAR(32) UNIQUE NOT NULL,
    village_name VARCHAR(120) NOT NULL,
    district_name VARCHAR(120) NOT NULL,
    regency_name VARCHAR(120) NOT NULL,
    province_name VARCHAR(120) NOT NULL,
    target_zero_burn_ha NUMERIC(8,2) NOT NULL DEFAULT 25.00,
    consecutive_zero_burn_seasons INT NOT NULL DEFAULT 0,
    available_chopper_units INT NOT NULL DEFAULT 2,
    available_cover_crop_kg NUMERIC(8,2) NOT NULL DEFAULT 150.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. TABEL PROFIL PENGGUNA (PROFILES) — Tanpa Koordinat GPS
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
    village_id UUID NOT NULL REFERENCES public.villages(id) ON DELETE RESTRICT,
    display_name VARCHAR(100) NOT NULL,
    role VARCHAR(32) NOT NULL CHECK (role IN (
        'pekebun_primer',
        'petani_sekunder',
        'penyuluh_tersier',
        'warga_penjaga'
    )),
    dominant_soil_type VARCHAR(20) NOT NULL DEFAULT 'gambut' CHECK (dominant_soil_type IN ('gambut', 'mineral')),
    default_land_area_ha NUMERIC(5,2) NOT NULL DEFAULT 2.00 CHECK (default_land_area_ha > 0 AND default_land_area_ha <= 25),
    next_planting_date DATE,
    ignored_reminder_count INT NOT NULL DEFAULT 0 CHECK (ignored_reminder_count >= 0 AND ignored_reminder_count <= 3),
    reminders_paused BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. TABEL ACUAN HARGA LOKAL KALKULATOR (CALCULATOR_PRICE_REFS)
CREATE TABLE IF NOT EXISTS public.calculator_price_refs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    village_id UUID NOT NULL REFERENCES public.villages(id) ON DELETE CASCADE,
    soil_type VARCHAR(20) NOT NULL CHECK (soil_type IN ('gambut', 'mineral')),
    vegetation_density VARCHAR(20) NOT NULL CHECK (vegetation_density IN ('ringan', 'sedang', 'tebal')),
    burn_labor_cost_per_ha INT NOT NULL DEFAULT 750000,
    burn_ash_handling_per_ha INT NOT NULL DEFAULT 350000,
    zeroburn_chop_labor_per_ha INT NOT NULL DEFAULT 550000,
    zeroburn_chopper_rental_per_ha INT NOT NULL DEFAULT 350000,
    zeroburn_dolomite_decomposer_per_ha INT NOT NULL DEFAULT 350000,
    season2_fertilizer_saving_per_ha INT NOT NULL DEFAULT 400000,
    verified_by_penyuluh UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (village_id, soil_type, vegetation_density)
);

-- 4. TABEL KOMITMEN MUSIM TANAM (SEASON_COMMITMENTS)
CREATE TABLE IF NOT EXISTS public.season_commitments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    village_id UUID NOT NULL REFERENCES public.villages(id) ON DELETE RESTRICT,
    season_label VARCHAR(64) NOT NULL,
    committed_area_ha NUMERIC(5,2) NOT NULL CHECK (committed_area_ha > 0),
    soil_type VARCHAR(20) NOT NULL CHECK (soil_type IN ('gambut', 'mineral')),
    vegetation_density VARCHAR(20) NOT NULL CHECK (vegetation_density IN ('ringan', 'sedang', 'tebal')),
    is_public_to_village BOOLEAN NOT NULL DEFAULT TRUE,
    status VARCHAR(32) NOT NULL DEFAULT 'berjalan' CHECK (status IN (
        'berjalan',
        'tuntas_tanpa_bakar',
        'butuh_pendampingan'
    )),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. TABEL PROGRES 6 TAHAP PEMBUKAAN LAHAN TANPA BAKAR (SIX_STAGE_PROGRESS)
CREATE TABLE IF NOT EXISTS public.six_stage_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    commitment_id UUID NOT NULL REFERENCES public.season_commitments(id) ON DELETE CASCADE,
    stage_number INT NOT NULL CHECK (stage_number BETWEEN 1 AND 6),
    stage_slug VARCHAR(32) NOT NULL CHECK (stage_slug IN (
        'penilaian',
        'pencacahan',
        'penumpukan',
        'pengomposan',
        'kesiapan',
        'penanaman'
    )),
    status VARCHAR(32) NOT NULL DEFAULT 'belum' CHECK (status IN (
        'belum',
        'sedang_dikerjakan',
        'selesai',
        'dilewati'
    )),
    started_at DATE,
    completed_at DATE,
    mulch_flip_due_date DATE,
    mulch_flipped BOOLEAN NOT NULL DEFAULT FALSE,
    photo_url TEXT,
    exif_stripped_verified BOOLEAN NOT NULL DEFAULT TRUE CHECK (exif_stripped_verified = TRUE),
    verified_by_penyuluh UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    field_notes TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (commitment_id, stage_number)
);

-- 6. TABEL LOG TONGKAT UKUR MUKA AIR TANAH (WATER_TABLE_LOGS) — PP No. 57 Tahun 2016 (0,4 m / 40 cm)
CREATE TABLE IF NOT EXISTS public.water_table_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    village_id UUID NOT NULL REFERENCES public.villages(id) ON DELETE RESTRICT,
    measurement_date DATE NOT NULL DEFAULT CURRENT_DATE,
    depth_cm INT NOT NULL CHECK (depth_cm BETWEEN 0 AND 150),
    risk_zone VARCHAR(24) GENERATED ALWAYS AS (
        CASE
            WHEN depth_cm <= 30 THEN 'aman_0_30'
            WHEN depth_cm <= 40 THEN 'waspada_31_40'
            ELSE 'bahaya_gt_40'
        END
    ) STORED,
    canal_block_closed_action BOOLEAN NOT NULL DEFAULT FALSE,
    penyuluh_contacted_action BOOLEAN NOT NULL DEFAULT FALSE,
    dipstick_photo_url TEXT,
    exif_stripped_verified BOOLEAN NOT NULL DEFAULT TRUE CHECK (exif_stripped_verified = TRUE),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. TABEL JURNAL HASIL PANEN & BIAYA (HARVEST_JOURNALS)
CREATE TABLE IF NOT EXISTS public.harvest_journals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    village_id UUID NOT NULL REFERENCES public.villages(id) ON DELETE RESTRICT,
    season_label VARCHAR(64) NOT NULL,
    commodity VARCHAR(80) NOT NULL,
    land_area_ha NUMERIC(5,2) NOT NULL CHECK (land_area_ha > 0),
    yield_ton_per_ha NUMERIC(6,2) NOT NULL CHECK (yield_ton_per_ha >= 0),
    yield_sacks_count INT NOT NULL DEFAULT 0 CHECK (yield_sacks_count >= 0),
    gross_revenue_idr BIGINT NOT NULL DEFAULT 0 CHECK (gross_revenue_idr >= 0),
    input_cost_idr BIGINT NOT NULL DEFAULT 0 CHECK (input_cost_idr >= 0),
    used_zero_burning BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. TABEL LENCANA KOLEKTIF DESA (VILLAGE_BADGES)
CREATE TABLE IF NOT EXISTS public.village_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    village_id UUID NOT NULL REFERENCES public.villages(id) ON DELETE CASCADE,
    badge_code VARCHAR(48) NOT NULL CHECK (badge_code IN (
        'desa_bebas_bakar',
        'sepuluh_hektare_tanpa_bakar',
        'musim_kedua_berturut'
    )),
    badge_title VARCHAR(120) NOT NULL,
    badge_description TEXT NOT NULL,
    season_awarded VARCHAR(64) NOT NULL,
    awarded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (village_id, badge_code, season_awarded)
);

-- 9. TABEL PENGAJUAN BANTUAN ALAT & BIBIT (EQUIPMENT_REQUESTS)
CREATE TABLE IF NOT EXISTS public.equipment_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    village_id UUID NOT NULL REFERENCES public.villages(id) ON DELETE RESTRICT,
    request_type VARCHAR(40) NOT NULL CHECK (request_type IN (
        'alat_pencacah',
        'bibit_penutup_tanah',
        'kapur_dolomit_kompos'
    )),
    land_area_ha NUMERIC(5,2) NOT NULL,
    estimated_cost_gap_idr INT NOT NULL DEFAULT 300000,
    status VARCHAR(32) NOT NULL DEFAULT 'menunggu' CHECK (status IN (
        'menunggu',
        'disetujui_penyuluh',
        'dijadwalkan_gilir',
        'selesai'
    )),
    scheduled_date DATE,
    handled_by_penyuluh UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. TABEL LAPORAN ASAP DINI WARGA (SMOKE_REPORTS)
CREATE TABLE IF NOT EXISTS public.smoke_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    village_id UUID NOT NULL REFERENCES public.villages(id) ON DELETE RESTRICT,
    sub_village_zone VARCHAR(120) NOT NULL,
    smoke_intensity VARCHAR(32) NOT NULL CHECK (smoke_intensity IN (
        'tipis_putih',
        'sedang_abu',
        'pekat_hitam'
    )),
    wind_direction_note VARCHAR(120),
    status VARCHAR(32) NOT NULL DEFAULT 'baru_dilaporkan' CHECK (status IN (
        'baru_dilaporkan',
        'dicek_mpk_penyuluh',
        'tertangani'
    )),
    photo_url TEXT,
    exif_stripped_verified BOOLEAN NOT NULL DEFAULT TRUE CHECK (exif_stripped_verified = TRUE),
    reported_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. TABEL PEMANTAUAN LAHAN PASCA-KEBAKARAN 6-12 BULAN (POST_FIRE_PLOTS & OBSERVATIONS)
CREATE TABLE IF NOT EXISTS public.post_fire_plots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    village_id UUID NOT NULL REFERENCES public.villages(id) ON DELETE CASCADE,
    local_area_label VARCHAR(120) NOT NULL,
    affected_area_ha NUMERIC(6,2) NOT NULL,
    fire_extinguished_date DATE NOT NULL,
    monitoring_end_date DATE NOT NULL,
    recovery_status VARCHAR(32) NOT NULL DEFAULT 'pemantauan_aktif' CHECK (recovery_status IN (
        'pemantauan_aktif',
        'vegetasi_pulih',
        'rawan_bakar_ulang'
    )),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.post_fire_observations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plot_id UUID NOT NULL REFERENCES public.post_fire_plots(id) ON DELETE CASCADE,
    observer_profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    month_number INT NOT NULL CHECK (month_number BETWEEN 1 AND 12),
    water_depth_cm INT NOT NULL CHECK (water_depth_cm BETWEEN 0 AND 150),
    regrowth_level VARCHAR(40) NOT NULL CHECK (regrowth_level IN (
        'belum_tumbuh',
        'tunas_awal',
        'tertutup_semak_basah',
        'ditanami_kembali'
    )),
    repeat_fire_signs_detected BOOLEAN NOT NULL DEFAULT FALSE,
    notes TEXT,
    observed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (plot_id, month_number)
);

-- 12. TABEL LOG AUDIT AKSES DATA (AUDIT_LOGS)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action_type VARCHAR(64) NOT NULL,
    target_scope VARCHAR(64) NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- VIEW AGREGASI AMAN N >= 5 (v_safe_harvest_aggregates)
-- ============================================================================
CREATE OR REPLACE VIEW public.v_safe_harvest_aggregates AS
WITH village_stats AS (
    SELECT
        v.id AS village_id,
        v.village_name,
        v.district_name,
        hj.season_label,
        hj.commodity,
        COUNT(DISTINCT hj.profile_id) AS unique_farmer_count,
        ROUND(AVG(hj.yield_ton_per_ha), 2) AS village_avg_ton_per_ha,
        ROUND(AVG(hj.gross_revenue_idr / NULLIF(hj.land_area_ha, 0)), 0) AS village_avg_revenue_per_ha,
        ROUND(AVG(hj.input_cost_idr / NULLIF(hj.land_area_ha, 0)), 0) AS village_avg_cost_per_ha
    FROM public.harvest_journals hj
    JOIN public.villages v ON v.id = hj.village_id
    WHERE hj.used_zero_burning = TRUE
    GROUP BY v.id, v.village_name, v.district_name, hj.season_label, hj.commodity
),
district_stats AS (
    SELECT
        v.district_name,
        hj.season_label,
        hj.commodity,
        COUNT(DISTINCT hj.profile_id) AS district_farmer_count,
        ROUND(AVG(hj.yield_ton_per_ha), 2) AS district_avg_ton_per_ha,
        ROUND(AVG(hj.gross_revenue_idr / NULLIF(hj.land_area_ha, 0)), 0) AS district_avg_revenue_per_ha,
        ROUND(AVG(hj.input_cost_idr / NULLIF(hj.land_area_ha, 0)), 0) AS district_avg_cost_per_ha
    FROM public.harvest_journals hj
    JOIN public.villages v ON v.id = hj.village_id
    WHERE hj.used_zero_burning = TRUE
    GROUP BY v.district_name, hj.season_label, hj.commodity
)
SELECT
    vs.village_id,
    vs.village_name,
    vs.district_name,
    vs.season_label,
    vs.commodity,
    vs.unique_farmer_count,
    (vs.unique_farmer_count >= 5) AS meets_privacy_threshold,
    CASE
        WHEN vs.unique_farmer_count >= 5 THEN 'desa'
        ELSE 'kecamatan_fallback'
    END AS aggregation_level,
    CASE
        WHEN vs.unique_farmer_count >= 5 THEN vs.village_avg_ton_per_ha
        ELSE ds.district_avg_ton_per_ha
    END AS safe_avg_ton_per_ha,
    CASE
        WHEN vs.unique_farmer_count >= 5 THEN vs.village_avg_revenue_per_ha
        ELSE ds.district_avg_revenue_per_ha
    END AS safe_avg_revenue_per_ha,
    CASE
        WHEN vs.unique_farmer_count >= 5 THEN vs.village_avg_cost_per_ha
        ELSE ds.district_avg_cost_per_ha
    END AS safe_avg_cost_per_ha
FROM village_stats vs
JOIN district_stats ds
    ON ds.district_name = vs.district_name
   AND ds.season_label = vs.season_label
   AND ds.commodity = vs.commodity;

-- ============================================================================
-- SEED DATA 3 DESA PERCONTOHAN
-- ============================================================================
INSERT INTO public.villages (village_code, village_name, district_name, regency_name, province_name, target_zero_burn_ha, consecutive_zero_burn_seasons, available_chopper_units, available_cover_crop_kg)
VALUES
    ('6271011005', 'Desa Kalampangan', 'Kec. Sabangau', 'Kota Palangka Raya', 'Kalimantan Tengah', 40.00, 1, 2, 150.00),
    ('1408032004', 'Desa Rantau Panjang', 'Kec. Koto Gasib', 'Kab. Siak', 'Riau', 15.00, 0, 1, 60.00),
    ('1408032007', 'Desa Buatan Baru', 'Kec. Koto Gasib', 'Kab. Siak', 'Riau', 20.00, 2, 2, 90.00)
ON CONFLICT (village_code) DO NOTHING;

