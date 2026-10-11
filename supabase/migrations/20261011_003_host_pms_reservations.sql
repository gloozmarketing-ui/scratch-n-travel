-- ============================================================================
-- SNT-601 / SNT-602: Hotel & Host Management Cockpit (PMS) & Dual-Unlock Buchungen
-- 1. host_profiles: Business-Profile, Belegungsampel, Zimmer-Kontingente, iCal & API
-- 2. host_reservations: Buchungen, Gast-Details, Kinderbett, Haustiere, Stammkunden, Dual-Unlock
-- 3. RLS-Policies, Indizes & Helfer-Funktionen
-- ============================================================================

-- 1. Host-Profile (Hotels, Pensionen, Lokale Hubs)
CREATE TABLE IF NOT EXISTS public.host_profiles (
    id                  UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    business_name       VARCHAR(200) NOT NULL,
    category            VARCHAR(80) NOT NULL DEFAULT 'hotel', -- hotel | gastro_hub | boutique_retreat | surf_camp | local_host
    country             VARCHAR(100) NOT NULL,
    city                VARCHAR(100) NOT NULL,
    address             TEXT,
    occupancy_status    VARCHAR(30) NOT NULL DEFAULT 'available', -- available | limited | full
    available_rooms     INT NOT NULL DEFAULT 5,
    total_rooms         INT NOT NULL DEFAULT 10,
    display_type        VARCHAR(50) NOT NULL DEFAULT 'acrylic_20mm_10x15',
    qr_corner_count     INT NOT NULL DEFAULT 4,
    qr_config           JSONB NOT NULL DEFAULT '{"corner1":"menu_checkin","corner2":"google_reviews","corner3":"passport_stamps","corner4":"tip_wifi"}'::jsonb,
    ical_export_token   VARCHAR(100) UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
    ical_import_url     TEXT,
    api_key_hash        VARCHAR(255),
    webhook_url         TEXT,
    commission_rate     NUMERIC(4,2) NOT NULL DEFAULT 0.00, -- 0% Provision
    is_verified         BOOLEAN NOT NULL DEFAULT true,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Host-Reservierungen (Gäste, Termine, Sonderwünsche & Dual-Unlock Nachweis)
CREATE TABLE IF NOT EXISTS public.host_reservations (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    host_id             UUID NOT NULL REFERENCES public.host_profiles(id) ON DELETE CASCADE,
    guest_user_id       UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    guest_name          VARCHAR(150) NOT NULL,
    guest_email         VARCHAR(255) NOT NULL,
    guest_phone         VARCHAR(50),
    country             VARCHAR(100) NOT NULL,
    city                VARCHAR(100) NOT NULL,
    start_date          DATE NOT NULL,
    end_date            DATE,
    check_in_time       VARCHAR(20) DEFAULT '15:00',
    guests_count        INT NOT NULL DEFAULT 1,
    category            VARCHAR(80) DEFAULT 'hotel',
    notes               TEXT,
    has_baby_bed        BOOLEAN NOT NULL DEFAULT false,
    has_pets            BOOLEAN NOT NULL DEFAULT false,
    is_regular_guest    BOOLEAN NOT NULL DEFAULT false,
    original_price      NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    custom_price        NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    discount_pct        INT NOT NULL DEFAULT 0,
    checked_in          BOOLEAN NOT NULL DEFAULT false,
    status              VARCHAR(30) NOT NULL DEFAULT 'confirmed', -- confirmed | checked_in | pending | cancelled
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indizes für schnelle Abfragen
CREATE INDEX IF NOT EXISTS idx_host_reservations_host ON public.host_reservations(host_id);
CREATE INDEX IF NOT EXISTS idx_host_reservations_guest ON public.host_reservations(guest_user_id);
CREATE INDEX IF NOT EXISTS idx_host_reservations_lookup ON public.host_reservations(country, status, start_date);

-- Row Level Security aktivieren
ALTER TABLE public.host_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.host_reservations ENABLE ROW LEVEL SECURITY;

-- RLS Policies: host_profiles
DROP POLICY IF EXISTS "Public can view verified host profiles" ON public.host_profiles;
CREATE POLICY "Public can view verified host profiles"
    ON public.host_profiles FOR SELECT
    USING (is_verified = true);

DROP POLICY IF EXISTS "Hosts can update own profile" ON public.host_profiles;
CREATE POLICY "Hosts can update own profile"
    ON public.host_profiles FOR UPDATE
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Hosts can insert own profile" ON public.host_profiles;
CREATE POLICY "Hosts can insert own profile"
    ON public.host_profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- RLS Policies: host_reservations
DROP POLICY IF EXISTS "Hosts can manage their own reservations" ON public.host_reservations;
CREATE POLICY "Hosts can manage their own reservations"
    ON public.host_reservations FOR ALL
    USING (auth.uid() = host_id);

DROP POLICY IF EXISTS "Guests can view their own reservations" ON public.host_reservations;
CREATE POLICY "Guests can view their own reservations"
    ON public.host_reservations FOR SELECT
    USING (auth.uid() = guest_user_id);

DROP POLICY IF EXISTS "Authenticated users can create reservations" ON public.host_reservations;
CREATE POLICY "Authenticated users can create reservations"
    ON public.host_reservations FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- 3. Dual-Unlock Prüfung im Backend (Deterministische Wahrheitsquelle)
CREATE OR REPLACE FUNCTION public.can_unlock_country_by_booking(p_user_id UUID, p_country TEXT)
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_has_booking BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.host_reservations
    WHERE (guest_user_id = p_user_id OR guest_email = (SELECT email FROM public.profiles WHERE id = p_user_id))
      AND lower(country) = lower(p_country)
      AND status IN ('confirmed', 'checked_in')
      AND start_date <= CURRENT_DATE
  ) INTO v_has_booking;
  RETURN v_has_booking;
END;
$$;

-- 4. Check-in Funktion (Prägt Status und Stempel)
CREATE OR REPLACE FUNCTION public.check_in_reservation(p_reservation_id UUID)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.host_reservations
  SET checked_in = true,
      status = 'checked_in',
      updated_at = now()
  WHERE id = p_reservation_id;
END;
$$;
