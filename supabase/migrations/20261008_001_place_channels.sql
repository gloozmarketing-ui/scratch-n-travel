-- ============================================================================
-- SNT-342 / SNT-343 / SNT-344: Orts-Chat (Additive Migration)
-- Modell B (ADR-002): Asynchroner Orts-Kanal (5 km Radius, kein Tracking)
-- ============================================================================

-- 1. Kanäle pro Ort / Spot ----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.place_channels (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    place_id    UUID NOT NULL REFERENCES public.secret_spots(id) ON DELETE CASCADE,
    created_by  UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    city        VARCHAR(100) NOT NULL,
    valid_until TIMESTAMPTZ NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_place_channels_place ON public.place_channels(place_id);
CREATE INDEX IF NOT EXISTS idx_place_channels_valid ON public.place_channels(valid_until);

-- 2. Einwilligung & Moderation pro Ort ----------------------------------------
CREATE TABLE IF NOT EXISTS public.chat_consent (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    place_id    UUID NOT NULL REFERENCES public.secret_spots(id) ON DELETE CASCADE,
    user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    allowed     BOOLEAN DEFAULT TRUE,
    granted_at  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    revoked_at  TIMESTAMPTZ,
    CONSTRAINT one_consent_per_user_place UNIQUE (place_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_chat_consent_user ON public.chat_consent(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_consent_place ON public.chat_consent(place_id);

-- 3. Chat-Beiträge ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.chat_posts (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel_id    UUID NOT NULL REFERENCES public.place_channels(id) ON DELETE CASCADE,
    author_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    body          TEXT NOT NULL CHECK (char_length(body) BETWEEN 1 AND 1000),
    trust_tier    VARCHAR(20) DEFAULT 'member',
    is_flagged    BOOLEAN DEFAULT FALSE,
    reports_count INT DEFAULT 0,
    created_at    TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_chat_posts_channel ON public.chat_posts(channel_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_posts_author  ON public.chat_posts(author_id);

-- 4. RLS aktivieren -----------------------------------------------------------
ALTER TABLE public.place_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_consent   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_posts     ENABLE ROW LEVEL SECURITY;

-- 4.1 Policies für place_channels
DROP POLICY IF EXISTS place_channels_select_public ON public.place_channels;
CREATE POLICY place_channels_select_public ON public.place_channels
  FOR SELECT USING (valid_until > now() - interval '1 hour');

DROP POLICY IF EXISTS place_channels_insert_auth ON public.place_channels;
CREATE POLICY place_channels_insert_auth ON public.place_channels
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 4.2 Policies für chat_consent
DROP POLICY IF EXISTS chat_consent_select_own ON public.chat_consent;
CREATE POLICY chat_consent_select_own ON public.chat_consent
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS chat_consent_insert_own ON public.chat_consent;
CREATE POLICY chat_consent_insert_own ON public.chat_consent
  FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS chat_consent_update_own ON public.chat_consent;
CREATE POLICY chat_consent_update_own ON public.chat_consent
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- 4.3 Policies für chat_posts
-- Lesen: öffentlich lesbar, sofern nicht von Moderation geflaggt
DROP POLICY IF EXISTS chat_posts_select_public ON public.chat_posts;
CREATE POLICY chat_posts_select_public ON public.chat_posts
  FOR SELECT USING (is_flagged = FALSE);

-- Schreiben: nur Autor selbst, mit aktivem Kanal-Token, Consent und Mindest-Trust
DROP POLICY IF EXISTS chat_posts_insert_auth ON public.chat_posts;
CREATE POLICY chat_posts_insert_auth ON public.chat_posts
  FOR INSERT WITH CHECK (
    author_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.place_channels pc
      WHERE pc.id = channel_id AND pc.valid_until > now()
    )
    AND EXISTS (
      SELECT 1 FROM public.chat_consent cc
      JOIN public.place_channels pc2 ON pc2.id = channel_id
      WHERE cc.place_id = pc2.place_id AND cc.user_id = auth.uid() AND cc.allowed = TRUE
    )
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.trust_tier IN ('member', 'trusted', 'anchor')
    )
  );

-- Löschen: nur der Autor selbst darf eigene Beiträge entfernen
DROP POLICY IF EXISTS chat_posts_delete_own ON public.chat_posts;
CREATE POLICY chat_posts_delete_own ON public.chat_posts
  FOR DELETE USING (author_id = auth.uid());

-- 5. Geo-RPC (SECURITY DEFINER): register_channel -----------------------------
-- Prüft 5-km-Schutzgrenze, verlangt Trust >= member, vergibt 15-Minuten-Token.
CREATE OR REPLACE FUNCTION public.register_channel(
    p_place_id UUID,
    p_lat NUMERIC DEFAULT NULL,
    p_lng NUMERIC DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id UUID;
    v_spot RECORD;
    v_dist_km NUMERIC;
    v_channel_id UUID;
    v_valid_until TIMESTAMPTZ;
    v_trust_tier VARCHAR(20);
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentifizierung erforderlich';
    END IF;

    -- Spot abrufen
    SELECT id, city, latitude, longitude INTO v_spot
    FROM public.secret_spots
    WHERE id = p_place_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Ort nicht gefunden';
    END IF;

    -- Trust-Stufe prüfen: mind. member (keine new Accounts ohne Verifikation)
    SELECT trust_tier INTO v_trust_tier
    FROM public.profiles
    WHERE id = v_user_id;

    IF v_trust_tier = 'new' OR v_trust_tier IS NULL THEN
        RAISE EXCEPTION 'Trust-Stufe member erforderlich fuer Orts-Chat';
    END IF;

    -- Wenn Koordinaten übergeben werden: 5 km Radius prüfen (Haversine-Formel)
    IF p_lat IS NOT NULL AND p_lng IS NOT NULL THEN
        v_dist_km := 6371 * acos(
            least(1.0, greatest(-1.0,
                cos(radians(v_spot.latitude)) * cos(radians(p_lat)) *
                cos(radians(p_lng) - radians(v_spot.longitude)) +
                sin(radians(v_spot.latitude)) * sin(radians(p_lat))
            ))
        );

        IF v_dist_km > 5.0 THEN
            RAISE EXCEPTION 'Standort ausserhalb des 5-km-Radius (aktuelle Distanz: % km)', round(v_dist_km, 1);
        END IF;
    END IF;

    -- Consent eintragen oder aktualisieren
    INSERT INTO public.chat_consent (place_id, user_id, allowed, granted_at)
    VALUES (p_place_id, v_user_id, TRUE, now())
    ON CONFLICT (place_id, user_id)
    DO UPDATE SET allowed = TRUE, revoked_at = NULL, granted_at = now();

    -- Bestehenden aktiven Kanal suchen oder neuen anlegen
    SELECT id, valid_until INTO v_channel_id, v_valid_until
    FROM public.place_channels
    WHERE place_id = p_place_id AND valid_until > now()
    ORDER BY valid_until DESC
    LIMIT 1;

    IF v_channel_id IS NULL THEN
        v_valid_until := now() + interval '15 minutes';
        INSERT INTO public.place_channels (place_id, created_by, city, valid_until)
        VALUES (p_place_id, v_user_id, v_spot.city, v_valid_until)
        RETURNING id INTO v_channel_id;
    ELSE
        -- Kanal um mindestens 15 Minuten ab jetzt verlängern
        v_valid_until := greatest(v_valid_until, now() + interval '15 minutes');
        UPDATE public.place_channels
        SET valid_until = v_valid_until
        WHERE id = v_channel_id;
    END IF;

    RETURN jsonb_build_object(
        'channel_id', v_channel_id,
        'place_id', p_place_id,
        'city', v_spot.city,
        'valid_until', v_valid_until,
        'status', 'active'
    );
END;
$$;
