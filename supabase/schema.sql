-- ============================================================================
-- Scratch'n'Travel — Supabase Database Schema v2 (PostgreSQL)
-- Community-Plattform: Secret Spots, Hobby-Matching, Meetups, Trust & Safety
--
-- WICHTIG — Idempotent: Die gesamte Migration kann mehrfach ausgeführt werden.
-- Anwendung: Supabase Dashboard → SQL Editor → diese Datei einfügen → Run
-- ============================================================================

-- ============================================================================
-- TEIL 0 — Aufräumen (alte Policies entfernen, damit Re-Runs sauber sind)
-- ============================================================================
DO $$
DECLARE
  t TEXT;
  r RECORD;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'profiles','secret_spots','spot_verifications','travel_checklists',
    'scratchbooks','hermes_city_brains','audit_logs',
    'profile_hobbies','hobbies','follows','blocks','reports','meetups',
    'meetup_participants','conversations','conversation_members','messages',
    'trust_events','safety_checkins','saved_spots'
  ] LOOP
    IF to_regclass('public.' || t) IS NOT NULL THEN
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
      FOR r IN (SELECT policyname FROM pg_policies
                WHERE schemaname = 'public' AND tablename = t) LOOP
        BEGIN
          EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, t);
        EXCEPTION WHEN OTHERS THEN NULL;
        END;
      END LOOP;
    END IF;
  END LOOP;
END $$;


-- ============================================================================
-- TEIL 1 — Kern-Tabellen
-- ============================================================================

-- 1.1 Profile -------------------------------------------------------------
-- WICHTIG: `id` ist die auth.users.id. Kein eigener Login, keine Passwörter.
CREATE TABLE IF NOT EXISTS profiles (
    id                  UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email               VARCHAR(255),
    full_name           VARCHAR(150),
    handle              VARCHAR(40) UNIQUE,
    avatar_url          TEXT,
    role                VARCHAR(30) DEFAULT 'traveler',  -- traveler | local | host | moderator
    bio                 TEXT,
    city                VARCHAR(100),
    country             VARCHAR(100),
    languages           JSONB DEFAULT '[]'::jsonb,      -- ["de","en","pt"]
    has_kids            BOOLEAN DEFAULT FALSE,
    has_pets            BOOLEAN DEFAULT FALSE,
    pet_types           JSONB DEFAULT '[]'::jsonb,      -- ["dog","cat"]
    -- Vertrauens-Signale (siehe trust_events)
    trust_tier          VARCHAR(20) DEFAULT 'new',       -- new | member | trusted | anchor
    is_verified         BOOLEAN DEFAULT FALSE,           -- von Moderation geprüft
    verification_kind   VARCHAR(30),                     -- email | phone | id_document | selfie
    is_local            BOOLEAN DEFAULT FALSE,           -- wohnt tatsächlich in der Stadt
    karma_points        INT DEFAULT 0,
    -- Ortsverifizierung. Wird ausschliesslich serverseitig befuellt — aus
    -- bestaetigten Check-ins oder einer Moderationspruefung. public.
    -- route_publish_allowed() liest genau diese beiden Spalten; ohne sie
    -- waere die Veroeffentlichungsregel wirkungslos.
    certified_stops     INT DEFAULT 0 CHECK (certified_stops >= 0),
    is_vip              BOOLEAN DEFAULT FALSE,
    reports_received    INT DEFAULT 0,
    reports_ignored     INT DEFAULT 0,
    last_seen_at        TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_profiles_city       ON profiles(city);
CREATE INDEX IF NOT EXISTS idx_profiles_trust_tier ON profiles(trust_tier);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at DESC);

-- 1.2 Hobbys (Taxonomie) -------------------------------------------------
CREATE TABLE IF NOT EXISTS hobbies (
    id          SERIAL PRIMARY KEY,
    slug        VARCHAR(60) UNIQUE NOT NULL,
    -- Die drei folgenden Spalten werden in TEIL 9 befuellt.
    label_de    VARCHAR(80) NOT NULL,
    category    VARCHAR(40) NOT NULL DEFAULT 'sonstiges',
    icon        VARCHAR(8)  NOT NULL DEFAULT '📍'
);
-- 1.3 User ↔ Hobby (Many-to-Many) — das Matching läuft hierüber
CREATE TABLE IF NOT EXISTS profile_hobbies (
    user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    hobby_id    INT  NOT NULL REFERENCES hobbies(id)  ON DELETE CASCADE,
    skill_level VARCHAR(20) DEFAULT 'interested', -- curious | beginner | solid | expert
    PRIMARY KEY (user_id, hobby_id)
);

CREATE INDEX IF NOT EXISTS idx_profile_hobbies_hobby ON profile_hobbies(hobby_id);

-- 1.4 Secret Spots --------------------------------------------------------
CREATE TABLE IF NOT EXISTS secret_spots (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title               VARCHAR(200) NOT NULL,
    city                VARCHAR(100) NOT NULL,
    country             VARCHAR(100),
    category            VARCHAR(60) NOT NULL,  -- nature | food | view | culture | activity
    description         TEXT NOT NULL,
    latitude            NUMERIC(10,7) NOT NULL,
    longitude           NUMERIC(10,7) NOT NULL,
    image_url           TEXT,
    -- PROVENIENZ: Woher kommt das? KI darf NIEMALS "verified" liefern.
    source              VARCHAR(30) NOT NULL DEFAULT 'local_submitted',
                        -- local_submitted | ai_seeded | partner | imported
    verification_state  VARCHAR(30) NOT NULL DEFAULT 'unverified',
                        -- unverified | community_verified | moderator_verified
    verified_by_count   INT NOT NULL DEFAULT 0,
    created_by          UUID REFERENCES profiles(id) ON DELETE SET NULL,
    -- Sicherheits- & Eignungs-Metadaten
    safety_level        VARCHAR(20) DEFAULT 'normal', -- normal | caution | remote
    safety_note         TEXT,
    is_stroller_friendly BOOLEAN DEFAULT FALSE,
    is_dog_friendly     BOOLEAN DEFAULT FALSE,
    is_family_friendly  BOOLEAN DEFAULT FALSE,
    is_secret           BOOLEAN DEFAULT TRUE,
    etiquette_note      TEXT,  -- "Bitte leise sein", "Kein Feuer"
    saves_count         INT NOT NULL DEFAULT 0,
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    -- Koordinaten müssen in einem plausiblen Bereich liegen
    CONSTRAINT valid_lat CHECK (latitude BETWEEN -90 AND 90),
    CONSTRAINT valid_lng CHECK (longitude BETWEEN -180 AND 180)
);

CREATE INDEX IF NOT EXISTS idx_spots_city     ON secret_spots(city);
CREATE INDEX IF NOT EXISTS idx_spots_category ON secret_spots(category);
CREATE INDEX IF NOT EXISTS idx_spots_state    ON secret_spots(verification_state);

-- 1.5 Spot-Verifizierung durch Locals (3 unabhängige Bestätigungen)
CREATE TABLE IF NOT EXISTS spot_verifications (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    spot_id     UUID NOT NULL REFERENCES secret_spots(id) ON DELETE CASCADE,
    user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    note        TEXT,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    -- 1 Stimme pro Person, pro Spot
    CONSTRAINT one_vote_per_user UNIQUE (spot_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_verifications_spot ON spot_verifications(spot_id);

-- 1.6 Follows -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS follows (
    follower_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    followee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (follower_id, followee_id),
    CONSTRAINT no_self_follow CHECK (follower_id <> followee_id)
);

-- 1.7 Blocklist (Sicherheit) ---------------------------------------------
-- Blockierte Nutzer sehen sich nicht: keine Nachrichten, keine Beitraege,
-- keine Follows. Die Liste ist symmetrisch gepflegt, damit ein Block fuer
-- beide Seiten gilt — sonst koennte der Blockierte den Blockierenden
-- weiterhin anschreiben.
CREATE TABLE IF NOT EXISTS blocks (
    blocker_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    blocked_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (blocker_id, blocked_id),
    CONSTRAINT no_self_block CHECK (blocker_id <> blocked_id)
);

CREATE INDEX IF NOT EXISTS idx_blocks_blocked ON blocks(blocked_id);

-- 1.8 Gespeicherte Spots -------------------------------------------------
CREATE TABLE IF NOT EXISTS saved_spots (
    user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    spot_id     UUID NOT NULL REFERENCES secret_spots(id) ON DELETE CASCADE,
    saved_at    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, spot_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_spots_user ON saved_spots(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_spots_spot ON saved_spots(spot_id);

-- ============================================================================
-- TEIL 2 — Community: Meetups & Nachrichten
-- ============================================================================

-- 2.1 Meetups -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS meetups (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title           VARCHAR(200) NOT NULL,
    description     TEXT,
    host_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    city            VARCHAR(100) NOT NULL,
    venue_name      VARCHAR(200),          -- öffentlicher Ort, nie exakte Privatadresse
    venue_note      TEXT,
    starts_at       TIMESTAMP WITH TIME ZONE NOT NULL,
    ends_at         TIMESTAMP WITH TIME ZONE,
    max_participants INT NOT NULL DEFAULT 8,
    -- SICHERHEIT: Min. Vertrauensstufe, um beizutreten
    required_tier   VARCHAR(20) NOT NULL DEFAULT 'member',  -- new | member | trusted
    -- Atmosphäre: Was will man hier wirklich?
    vibe            JSONB DEFAULT '[]'::jsonb,   -- culture_exchange | hobby | friendly_chat | language_exchange
    hobby_ids       JSONB DEFAULT '[]'::jsonb,   -- [1,4,7]
    safety_brief    TEXT,                        -- Pflicht-Sicherheitsbriefing
    is_public       BOOLEAN DEFAULT TRUE,
    status          VARCHAR(20) DEFAULT 'open',  -- open | full | cancelled | done
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT sane_capacity CHECK (max_participants BETWEEN 2 AND 50)
);

CREATE INDEX IF NOT EXISTS idx_meetups_city_time ON meetups(city, starts_at);
CREATE INDEX IF NOT EXISTS idx_meetups_status    ON meetups(status);

-- 2.2 Teilnahme -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS meetup_participants (
    meetup_id   UUID NOT NULL REFERENCES meetups(id) ON DELETE CASCADE,
    user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    joined_at   TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    -- Nach dem Meetup: "Hast du dich sicher gefühlt?"
    attended    BOOLEAN,
    felt_safe   BOOLEAN,
    rating_host INT CHECK (rating_host BETWEEN 1 AND 5),
    feedback    TEXT,
    PRIMARY KEY (meetup_id, user_id)
);

-- 2.3 Konversationen ------------------------------------------------------
-- Bewusst nur 1:1 im MVP: Gruppen-Chats sind der Haupthebel für Missbrauch.
CREATE TABLE IF NOT EXISTS conversations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS conversation_members (
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    last_read_at    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (conversation_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_conversation_members_user
  ON conversation_members(user_id);

-- 2.4 Nachrichten -----------------------------------------------------------
-- Die Nachricht gehoert einer Unterhaltung, nicht einem Nutzer direkt. So
-- laesst sich die Sichtbarkeit ueber die Teilnehmerliste steuern, ohne jede
-- Nachricht einzeln pruefen zu muessen.
CREATE TABLE IF NOT EXISTS messages (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    body            TEXT NOT NULL CHECK (char_length(body) BETWEEN 1 AND 2000),
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    -- Soft Delete: eine entfernte Nachricht bleibt als Zeile erhalten, damit
    -- die Reihenfolge im Chat nicht springt.
    deleted_at      TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation
  ON messages(conversation_id, created_at);

-- ============================================================================
-- TEIL 3 — Trust & Safety
-- ----------------------------------------------------------------------------
-- Grundsatz: Vertrauen wird durch KONKRETE, NACHWEISBARE Handlungen aufgebaut,
-- nicht durch KI-Scores und nicht durch lästige Formulare.
--
--   Stufe "new"      → darf stöbern, lesen, sich registrieren
--   Stufe "member"   → vollständiges Profil, darf Spots einreichen & chatten
--   Stufe "trusted"  → darf Meetups beitreten (ab ca. 3 Aktionen)
--   Stufe "anchor"   → darf eigene Meetups ausrichten (ab ca. 6 Aktionen)
--
-- Kein Schritt erzwingt ein Ausweisdokument. Ausweis ist NUR optional
-- und nur für die Host-Rolle (dann trägt man Verantwortung für andere).
-- ============================================================================

-- 3.1 Trust-Events — die Währung des Vertrauens ----------------------------
CREATE TABLE IF NOT EXISTS trust_events (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    event_type  VARCHAR(40) NOT NULL,
    -- event_type:
    --   email_verified      → von Supabase Auth gesetzt (automatisch, kostenlos)
    --   profile_completed   → Name + Bio + Stadt gesetzt
    --   photo_added         → Profilbild hochgeladen
    --   spot_submitted      → Ersten Spot eingereicht
    --   spot_confirmed      → Spot von einer anderen Person bestätigt
    --   hosted_meetup       → Erstes Meetup ausgerichtet
    --   attended_meetup     → Erstes Meetup besucht
    --   positive_feedback   → "Ich habe mich sicher gefühlt" bestätigt
    --   phone_verified      → Telefon bestätigt (freiwillig)
    --   id_verified         → Ausweis geprüft (nur Host, freiwillig)
    weight      INT NOT NULL DEFAULT 1,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_trust_events_user ON trust_events(user_id, event_type);
CREATE UNIQUE INDEX IF NOT EXISTS idx_trust_events_unique
  ON trust_events(user_id, event_type);

-- 3.2 Safety-Check-ins ("Ich bin sicher angekommen") ----------------------
-- Bewusst GROBE Ebene ("Alfama, beim Fado-Laden"), niemals GPS-Koordinaten.
CREATE TABLE IF NOT EXISTS safety_checkins (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    meetup_id   UUID REFERENCES meetups(id) ON DELETE SET NULL,
    area_label  VARCHAR(120) NOT NULL,
    note        TEXT,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_checkins_user ON safety_checkins(user_id, created_at DESC);

-- 3.3 Meldungen (Report) --------------------------------------------------
CREATE TABLE IF NOT EXISTS reports (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    reported_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    -- harassment | scam | impersonation | unsafe_meetup
    -- | inappropriate_content | spam | other
    category        VARCHAR(40) NOT NULL,
    details         TEXT,
    evidence_url    TEXT,
    status          VARCHAR(20) DEFAULT 'open',  -- open | reviewing | actioned | dismissed
    resolved_by     UUID REFERENCES profiles(id) ON DELETE SET NULL,
    resolution_note TEXT,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at     TIMESTAMP WITH TIME ZONE,
    CONSTRAINT cant_report_self CHECK (reporter_id <> reported_id)
);

CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_target ON reports(reported_id);

-- 3.4 Audit-Log (nur service_role sichtbar) ------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id    UUID,
    action      VARCHAR(80) NOT NULL,
    target_type VARCHAR(40),
    target_id   UUID,
    meta        JSONB DEFAULT '{}'::jsonb,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3.5 Reisedaten (Scratchbook) ------------------------------------------
CREATE TABLE IF NOT EXISTS scratchbooks (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    trip_title  VARCHAR(200) NOT NULL,
    city        VARCHAR(100) NOT NULL,
    country     VARCHAR(100),
    start_date  DATE,
    end_date    DATE,
    story       TEXT,
    photos      JSONB DEFAULT '[]'::jsonb,
    visited_spot_ids JSONB DEFAULT '[]'::jsonb,
    is_public   BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);



-- ============================================================================
-- TEIL 4 — Row Level Security
-- ----------------------------------------------------------------------------
-- OHNE diese Policies liefert Postgres für JEDEN angemeldeten Nutzer 0 Zeilen.
-- Das war der Grund, warum die App "funktionierte", aber nichts speicherte.
-- ============================================================================

-- ---------- profiles ----------
-- Öffentlich lesbar: Man muss Menschen finden können.
DROP POLICY IF EXISTS profiles_select_authenticated ON profiles;
CREATE POLICY profiles_select_authenticated ON profiles
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Eigenes Profil anlegen
DROP POLICY IF EXISTS profiles_insert_own ON profiles;
CREATE POLICY profiles_insert_own ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Eigenes Profil ändern — ABER: trust_tier, is_verified, reports_received,
-- reports_ignored, karma_points dürfen Nutzer NIEMALS selbst setzen.
DROP POLICY IF EXISTS profiles_update_own ON profiles;
CREATE POLICY profiles_update_own ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND role = profiles.role          -- Rollenwechsel braucht Moderation
  );

-- ---------- hobbies (Taxonomie) ----------
DROP POLICY IF EXISTS hobbies_select_authenticated ON hobbies;
CREATE POLICY hobbies_select_authenticated ON hobbies
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- ---------- profile_hobbies ----------
DROP POLICY IF EXISTS profile_hobbies_select_authenticated ON profile_hobbies;
CREATE POLICY profile_hobbies_select_authenticated ON profile_hobbies
  FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS profile_hobbies_own ON profile_hobbies;
CREATE POLICY profile_hobbies_own ON profile_hobbies
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ---------- secret_spots ----------
-- Lesbar für alle angemeldeten (die Community muss funktionieren)
DROP POLICY IF EXISTS spots_select_authenticated ON secret_spots;
CREATE POLICY spots_select_authenticated ON secret_spots
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Einreichen nur als eingeloggter Nutzer, mit eigenem created_by
DROP POLICY IF EXISTS spots_insert_own ON secret_spots;
CREATE POLICY spots_insert_own ON secret_spots
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
    AND created_by = auth.uid()
    -- NIEMALS selbst als "verified" markieren:
    AND verification_state = 'unverified'
    AND verified_by_count = 0
  );

-- Ändern/Löschen nur der Ersteller — UND nur solange unverified.
-- Danach ist der Spot "Eigentum der Community" und nur Modifikation änderbar.
DROP POLICY IF EXISTS spots_update_own ON secret_spots;
CREATE POLICY spots_update_own ON secret_spots
  FOR UPDATE USING (created_by = auth.uid() AND verification_state = 'unverified')
  WITH CHECK (created_by = auth.uid());

DROP POLICY IF EXISTS spots_delete_own ON secret_spots;
CREATE POLICY spots_delete_own ON secret_spots
  FOR DELETE USING (created_by = auth.uid() AND verified_by_count < 3);

-- ---------- SNT-304: max. 5 Einreichungen pro Person pro Tag ----------
-- Der Client-Zähler (SubmitSpotModal) ist nur Härtung; dieses Limit ist verbindlich.
-- Angreifer mit eigenem Account könnten den localStorage-Zähler umgehen.
DROP TRIGGER IF EXISTS spot_daily_limit ON secret_spots;
DROP FUNCTION IF EXISTS enforce_spot_daily_limit();

CREATE FUNCTION enforce_spot_daily_limit()
RETURNS trigger
LANGUAGE plpgsql
AS $fn$
BEGIN
  IF (
    SELECT count(*)
    FROM secret_spots
    WHERE created_by = NEW.created_by
      AND created_at >= date_trunc('day', NOW())
  ) >= 5 THEN
    RAISE EXCEPTION 'rate_limit: höchstens 5 Einreichungen pro Tag'
      USING ERRCODE = 'raise_exception';
  END IF;
  RETURN NEW;
END;
$fn$;

CREATE TRIGGER spot_daily_limit
  BEFORE INSERT ON secret_spots
  FOR EACH ROW
  EXECUTE FUNCTION enforce_spot_daily_limit();

-- ---------- spot_verifications ----------
DROP POLICY IF EXISTS verifications_select_authenticated ON spot_verifications;
CREATE POLICY verifications_select_authenticated ON spot_verifications
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- 1 Stimme pro Person (UNIQUE-Constraint), nicht für den eigenen Spot
DROP POLICY IF EXISTS verifications_insert_own ON spot_verifications;
CREATE POLICY verifications_insert_own ON spot_verifications
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND NOT EXISTS (
      SELECT 1 FROM secret_spots s
      WHERE s.id = spot_id AND s.created_by = auth.uid()
    )
  );

-- ---------- follows ----------
DROP POLICY IF EXISTS follows_select_authenticated ON follows;
CREATE POLICY follows_select_authenticated ON follows
  FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS follows_own ON follows;
CREATE POLICY follows_own ON follows
  FOR ALL USING (auth.uid() = follower_id) WITH CHECK (auth.uid() = follower_id);

-- ---------- blocks ----------
-- Blocklist ist PRIVAT: nur der Blocker darf sie sehen.
DROP POLICY IF EXISTS blocks_select_own ON blocks;
CREATE POLICY blocks_select_own ON blocks
  FOR SELECT USING (auth.uid() = blocker_id);

DROP POLICY IF EXISTS blocks_own ON blocks;
CREATE POLICY blocks_own ON blocks
  FOR ALL USING (auth.uid() = blocker_id) WITH CHECK (auth.uid() = blocker_id);

-- 2.3 Nachrichten ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS messages (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    body            TEXT NOT NULL CHECK (length(body) BETWEEN 1 AND 4000),
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at      TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_messages_conv ON messages(conversation_id, created_at DESC);

-- 3.7 Travel Checklists --------------------------------------------------
CREATE TABLE IF NOT EXISTS travel_checklists (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category    VARCHAR(60) NOT NULL,
    title       VARCHAR(200) NOT NULL,
    items       JSONB NOT NULL,
    is_default  BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- 'draft' | 'reviewed' | 'published'
-- Nur 'published' darf in der App als gesichert erscheinen.
-- ---------- hermes_city_brains ----------
-- Der KI-Stadtratgeber. WICHTIG: Diese Tabelle ist der einzige Ort im Schema,
-- an dem KI-Inhalte liegen. Ein KI-Ort darf niemals als local_verified
-- erscheinen — deshalb traegt die Tabelle einen eigenen Status, und die
-- App zeigt ausschliesslich 'published' als gesichert an.
CREATE TABLE IF NOT EXISTS hermes_city_brains (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    city         VARCHAR(100) UNIQUE NOT NULL,
    country      VARCHAR(100),
    summary      TEXT NOT NULL DEFAULT '',
    spots        JSONB NOT NULL DEFAULT '[]'::jsonb,
    safety_notes JSONB NOT NULL DEFAULT '[]'::jsonb,
    local_food   JSONB NOT NULL DEFAULT '[]'::jsonb,
    -- 'draft' | 'reviewed' | 'published'
    status       VARCHAR(20) NOT NULL DEFAULT 'draft'
                  CHECK (status IN ('draft', 'reviewed', 'published')),
    created_at   TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ---------- meetups ----------
DROP POLICY IF EXISTS meetups_select_authenticated ON meetups;
CREATE POLICY meetups_select_authenticated ON meetups
  FOR SELECT USING (auth.uid() IS NOT NULL AND is_public = TRUE);

-- Ausrichten: Profil muss mindestens "member" sein
DROP POLICY IF EXISTS meetups_insert_host ON meetups;
CREATE POLICY meetups_insert_host ON meetups
  FOR INSERT WITH CHECK (
    auth.uid() = host_id
    AND EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
        AND p.trust_tier IN ('trusted', 'anchor')
    )
  );

DROP POLICY IF EXISTS meetups_update_host ON meetups;
CREATE POLICY meetups_update_host ON meetups
  FOR UPDATE USING (host_id = auth.uid());

DROP POLICY IF EXISTS meetups_delete_host ON meetups;
CREATE POLICY meetups_delete_host ON meetups
  FOR DELETE USING (host_id = auth.uid());

-- ---------- meetup_participants ----------
DROP POLICY IF EXISTS participants_select_authenticated ON meetup_participants;
CREATE POLICY participants_select_authenticated ON meetup_participants
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Beitreten: eigene Zeile, und die Vertrauensstufe des Meetups erfüllen
DROP POLICY IF EXISTS participants_insert_self ON meetup_participants;
CREATE POLICY participants_insert_self ON meetup_participants
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM meetups m
      JOIN profiles p ON p.id = auth.uid()
      WHERE m.id = meetup_id
        AND m.status = 'open'
        AND CASE m.required_tier
              WHEN 'new'     THEN true
              WHEN 'member'  THEN p.trust_tier IN ('member','trusted','anchor')
              WHEN 'trusted' THEN p.trust_tier IN ('trusted','anchor')
              ELSE false
            END
    )
    -- Kapazität respektieren
    AND (
      SELECT count(*) FROM meetup_participants mp
      WHERE mp.meetup_id = meetup_participants.meetup_id
    ) < (
      SELECT max_participants FROM meetups WHERE id = meetup_participants.meetup_id
    )
  );

-- Feedback nach dem Meetup darf nur der Teilnehmer selbst geben
DROP POLICY IF EXISTS participants_update_self ON meetup_participants;
CREATE POLICY participants_update_self ON meetup_participants
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Helper-Funktion gegen RLS-Endlosrekursion:
-- SECURITY DEFINER liest conversation_members ohne erneute Policy-Prüfung aus.
CREATE OR REPLACE FUNCTION public.is_member_of_conversation(p_conversation_id UUID, p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM conversation_members
    WHERE conversation_id = p_conversation_id AND user_id = p_user_id
  );
$$;

-- ---------- conversations ----------
DROP POLICY IF EXISTS conversations_select_members ON conversations;
CREATE POLICY conversations_select_members ON conversations
  FOR SELECT USING (
    public.is_member_of_conversation(id, auth.uid())
  );

-- ---------- conversation_members ----------
DROP POLICY IF EXISTS conv_members_select_members ON conversation_members;
CREATE POLICY conv_members_select_members ON conversation_members
  FOR SELECT USING (
    user_id = auth.uid()
    OR public.is_member_of_conversation(conversation_id, auth.uid())
  );

-- ---------- messages ----------
-- Nur lesen, wenn man Mitglied ist UND niemand in der Unterhaltung blockiert hat
DROP POLICY IF EXISTS messages_select_members ON messages;
CREATE POLICY messages_select_members ON messages
  FOR SELECT USING (
    public.is_member_of_conversation(conversation_id, auth.uid())
    AND NOT EXISTS (
      SELECT 1 FROM conversation_members cm3
      JOIN blocks b ON b.blocker_id = cm3.user_id
      WHERE cm3.conversation_id = messages.conversation_id
        AND b.blocked_id = auth.uid()
    )
  );

-- Senden: nur Mitglied, nicht blockiert, Textlänge ok
DROP POLICY IF EXISTS messages_insert_members ON messages;
CREATE POLICY messages_insert_members ON messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid()
    AND length(body) BETWEEN 1 AND 4000
    AND public.is_member_of_conversation(messages.conversation_id, auth.uid())
    AND NOT EXISTS (
      SELECT 1 FROM conversation_members cm4
      JOIN blocks b ON b.blocker_id = cm4.user_id
      WHERE cm4.conversation_id = messages.conversation_id
        AND b.blocked_id = auth.uid()
    )
  );

-- Eigene Nachricht löschen (für sich selbst) — Redeverbot/DSGVO
DROP POLICY IF EXISTS messages_delete_own ON messages;
CREATE POLICY messages_delete_own ON messages
  FOR DELETE USING (sender_id = auth.uid());


-- ---------- trust_events ----------
-- Nutzer dürfen eigene Events lesen, aber NUR service_role darf sie schreiben.
DROP POLICY IF EXISTS trust_events_select_own ON trust_events;
CREATE POLICY trust_events_select_own ON trust_events
  FOR SELECT USING (user_id = auth.uid());

-- ---------- safety_checkins ----------
DROP POLICY IF EXISTS checkins_select_own ON safety_checkins;
CREATE POLICY checkins_select_own ON safety_checkins
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS checkins_insert_own ON safety_checkins;
CREATE POLICY checkins_insert_own ON safety_checkins
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- ---------- reports ----------
-- Wichtig: Der Melder sieht SEINE Meldung. Das Opfer sieht sie NICHT
-- (sonst wäre die Meldefunktion nutzlos).
DROP POLICY IF EXISTS reports_select_own ON reports;
CREATE POLICY reports_select_own ON reports
  FOR SELECT USING (reporter_id = auth.uid());

DROP POLICY IF EXISTS reports_insert_own ON reports;
CREATE POLICY reports_insert_own ON reports
  FOR INSERT WITH CHECK (reporter_id = auth.uid() AND reporter_id <> reported_id);

-- Wer Meldungen erhält, darf sie nicht selbst löschen/ändern
-- (nur Moderation via service_role)

-- ---------- audit_logs ----------
-- KEINE Policy für normale Nutzer → mit RLS ist die Tabelle für sie komplett
-- gesperrt. Nur service_role (der Server) sieht das Log.
-- (Explizit keine SELECT-Policy anlegen!)

-- ---------- scratchbooks ----------
DROP POLICY IF EXISTS scratchbooks_select_public ON scratchbooks;
CREATE POLICY scratchbooks_select_public ON scratchbooks
  FOR SELECT USING (is_public = TRUE OR user_id = auth.uid());

DROP POLICY IF EXISTS scratchbooks_own ON scratchbooks;
CREATE POLICY scratchbooks_own ON scratchbooks
  FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- ---------- hermes_city_brains ----------
-- Nur 'published' ist für die App sichtbar. Entwürfe sieht niemand außer Service.
DROP POLICY IF EXISTS city_brains_select_published ON hermes_city_brains;
CREATE POLICY city_brains_select_published ON hermes_city_brains
  FOR SELECT USING (status = 'published' AND auth.uid() IS NOT NULL);

-- ---------- travel_checklists ----------
DROP POLICY IF EXISTS checklists_select_authenticated ON travel_checklists;
CREATE POLICY checklists_select_authenticated ON travel_checklists
  FOR SELECT USING (is_default = TRUE AND auth.uid() IS NOT NULL);

-- ---------- saved_spots ----------
DROP POLICY IF EXISTS saved_spots_own ON saved_spots;
CREATE POLICY saved_spots_own ON saved_spots
  FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- TEIL 5 — Trust-Tier-Berechnung
-- ----------------------------------------------------------------------------
-- Die Stufe wird aus KONKRETEN, ZÄHLBAREN Handlungen berechnet.
-- Kein KI-Score. Jeder Schritt ist für den Nutzer sichtbar und erklärbar.
--
--   new     (0 Pkt)  → stöbern, lesen, registrieren
--   member  (2 Pkt)  → volles Profil, Spots einreichen, chatten
--   trusted (5 Pkt)  → Meetups beitreten
--   anchor  (9 Pkt)  → eigene Meetups ausrichten
-- ============================================================================

CREATE OR REPLACE FUNCTION public.compute_trust_tier(p_events INT)
RETURNS VARCHAR
LANGUAGE sql IMMUTABLE AS $$
  SELECT CASE
    WHEN p_events >= 9 THEN 'anchor'
    WHEN p_events >= 5 THEN 'trusted'
    WHEN p_events >= 2 THEN 'member'
    ELSE 'new'
  END;
$$;

-- Gewichtung: nicht jede Handlung zählt gleich viel.
CREATE OR REPLACE FUNCTION public.trust_event_weight(p_type VARCHAR)
RETURNS INT
LANGUAGE sql IMMUTABLE AS $$
  SELECT CASE p_type
    WHEN 'email_verified'    THEN 1
    WHEN 'profile_completed' THEN 1
    WHEN 'photo_added'       THEN 1
    WHEN 'spot_submitted'    THEN 1
    WHEN 'spot_confirmed'    THEN 2
    WHEN 'attended_meetup'   THEN 2
    WHEN 'positive_feedback' THEN 1
    WHEN 'hosted_meetup'     THEN 3
    WHEN 'phone_verified'    THEN 1
    WHEN 'id_verified'       THEN 2
    ELSE 0
  END;
$$;


-- ============================================================================
-- TEIL 6 — Automatischer Profil-Anlegen-Trigger
-- ----------------------------------------------------------------------------
-- Sobald sich jemand über Supabase Auth registriert, existiert sofort ein Profil.
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, trust_tier)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data ->> 'full_name',
      NEW.raw_user_meta_data ->> 'name',
      split_part(COALESCE(NEW.email, ''), '@', 1)
    ),
    NEW.raw_user_meta_data ->> 'avatar_url',
    'new'
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.trust_events (user_id, event_type, weight)
  VALUES (NEW.id, 'email_verified', public.trust_event_weight('email_verified'))
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ============================================================================
-- TEIL 7 — Trust-Tier nach jedem Event neu berechnen
-- ============================================================================
CREATE OR REPLACE FUNCTION public.recalculate_trust_tier(p_user UUID)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  total INT;
BEGIN
  SELECT COALESCE(SUM(weight), 0) INTO total
  FROM public.trust_events WHERE user_id = p_user;

  UPDATE public.profiles
  SET trust_tier = public.compute_trust_tier(total),
      updated_at = CURRENT_TIMESTAMP
  WHERE id = p_user;
END;
$$;

CREATE OR REPLACE FUNCTION public.on_trust_event_insert()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  PERFORM public.recalculate_trust_tier(NEW.user_id);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_trust_event_created ON trust_events;
CREATE TRIGGER on_trust_event_created
  AFTER INSERT ON trust_events
  FOR EACH ROW EXECUTE FUNCTION public.on_trust_event_insert();

-- TEIL 8 — Spot auf community_verified heben (3 unabhängige Stimmen)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.refresh_spot_verification(p_spot UUID)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_count INT;
BEGIN
  SELECT count(DISTINCT user_id) INTO v_count
  FROM public.spot_verifications WHERE spot_id = p_spot;

  UPDATE public.secret_spots
  SET verified_by_count = v_count,
      verification_state = CASE
        WHEN v_count >= 3 THEN 'community_verified'
        ELSE 'unverified'
      END
  WHERE id = p_spot;
END;
$$;

CREATE OR REPLACE FUNCTION public.on_verification_insert()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_total INT;
BEGIN
  PERFORM public.refresh_spot_verification(NEW.spot_id);

  -- Dem Bestätiger creditieren: "du hast der Community geholfen"
  SELECT count(*) INTO v_total
  FROM public.spot_verifications WHERE user_id = NEW.user_id;

  IF v_total > 0 THEN
    INSERT INTO public.trust_events (user_id, event_type, weight)
    VALUES (NEW.user_id, 'spot_confirmed', public.trust_event_weight('spot_confirmed'))
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_verification_created ON spot_verifications;
CREATE TRIGGER on_verification_created
  AFTER INSERT ON spot_verifications
  FOR EACH ROW EXECUTE FUNCTION public.on_verification_insert();


-- ============================================================================
-- TEIL 9 — Hobbys befüllen (Idempotent)
-- ============================================================================
INSERT INTO public.hobbies (slug, label_de, category, icon) VALUES
  ('wandern','Wandern','nature','🥾'),
  ('klettern','Klettern','sport','🧗'),
  ('surfen','Surfen','sport','🏄'),
  ('tauchen','Tauchen','sport','🤿'),
  ('radfahren','Radfahren','sport','🚴'),
  ('laufen','Laufen','sport','🏃'),
  ('yoga','Yoga','sport','🧘'),
  ('schwimmen','Schwimmen','sport','🏊'),
  ('fotografie','Fotografie','creative','📷'),
  ('malen','Malen','creative','🎨'),
  ('schreiben','Schreiben','creative','✍️'),
  ('musizieren','Musizieren','creative','🎵'),
  ('kochen','Kochen','food','🍳'),
  ('wein','Wein & Bars','food','🍷'),
  ('gastronomie','Gastronomie entdecken','food','🍽️'),
  ('kultur','Kultur & Museen','culture','🏛️'),
  ('geschichte','Geschichte','culture','📜'),
  ('sprachen','Sprachen lernen','culture','🗣️'),
  ('natur','Natur & Tierwelt','nature','🌿'),
  ('tierschutz','Tierschutz','social','🐾'),
  ('ehrenamt','Ehrenamt','social','🤲'),
  ('kunst','Kunst & Street Art','creative','🎨'),
  ('musik','Musik & Konzerte','culture','🎶'),
  ('garten','Garten & Pflanzen','nature','🌱')
ON CONFLICT (slug) DO NOTHING;


-- ============================================================================
-- TEIL 10 — Abschlussprüfung
-- ============================================================================
DO $$
DECLARE
  missing TEXT;
BEGIN
  SELECT string_agg(expected_table, ', ')
  INTO missing
  FROM unnest(ARRAY[
    'profiles','hobbies','profile_hobbies','secret_spots','spot_verifications',
    'follows','blocks','saved_spots','meetups','meetup_participants',
    'conversations','conversation_members','messages',
    'trust_events','safety_checkins','reports','audit_logs',
    'scratchbooks','hermes_city_brains','travel_checklists'
  ]) AS expected_table
  WHERE to_regclass('public.' || expected_table) IS NULL;

  IF missing IS NOT NULL THEN
    RAISE EXCEPTION 'FEHLER: Folgende Tabellen wurden nicht angelegt: %', missing;
  END IF;

  RAISE NOTICE 'Scratch''n''Travel Schema v2 installiert: 20 Tabellen, Trust-Tier-System, 3 Trigger.';
END $$;


-- ============================================================================
--  LOCAL ROUTES — Routen von Locals und Reisenden
-- ----------------------------------------------------------------------------
--  Ein Local stellt seine Lieblingsorte als benannte Route zusammen, der
--  Reisende folgt ihr und sammelt einen Badge, der den Routennamen traegt.
--
--  Warum `author_certified_stops` der Taktgeber ist: Wer Empfehlungen
--  ausspricht, muss nachweisbar vor Ort gewesen sein. Verweilzeit allein
--  beweist nichts — die stufenweise Freischaltung ist der eigentliche
--  Schutz vor Wegwerf-Inhalten.
-- ============================================================================

CREATE TABLE IF NOT EXISTS routes (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Der Name des Locals. Er wandert spaeter in den Badge-Namen.
  name         text NOT NULL CHECK (char_length(name) BETWEEN 3 AND 80),
  blurb        text NOT NULL DEFAULT '',
  author_id    uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  city         text NOT NULL,
  country      text NOT NULL,
  country_code char(2) NOT NULL,
  mood         text NOT NULL DEFAULT 'gemütlich',
  tags         text[] NOT NULL DEFAULT '{}',
  -- Wird bei der Veroeffentlichung aus profiles uebernommen, damit es nicht
  -- faelschlich im Client gesetzt werden kann.
  author_certified_stops int NOT NULL DEFAULT 0,
  author_is_local        boolean NOT NULL DEFAULT false,
  upvotes       int NOT NULL DEFAULT 0 CHECK (upvotes >= 0),
  downvotes     int NOT NULL DEFAULT 0 CHECK (downvotes >= 0),
  completions   int NOT NULL DEFAULT 0 CHECK (completions >= 0),
  published     boolean NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS routes_city_idx ON routes (city) WHERE published;
CREATE INDEX IF NOT EXISTS routes_author_idx ON routes (author_id);

-- Stationen. Die Koordinaten sind bewusst NOT NULL: eine Route ohne echten
-- Ort ist eine Abstraktion ohne Nutzen — und genau die erzeugt Wegwerf-Inhalt.
CREATE TABLE IF NOT EXISTS route_stops (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id      uuid NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
  position      int NOT NULL CHECK (position BETWEEN 1 AND 30),
  title         text NOT NULL CHECK (char_length(title) BETWEEN 2 AND 90),
  note          text NOT NULL DEFAULT '',
  lat           double precision NOT NULL CHECK (lat BETWEEN -90 AND 90),
  lng           double precision NOT NULL CHECK (lng BETWEEN -180 AND 180),
  secret_spot_id uuid REFERENCES secret_spots(id) ON DELETE SET NULL,
  dwell_minutes int NOT NULL DEFAULT 20 CHECK (dwell_minutes BETWEEN 1 AND 480),
  UNIQUE (route_id, position),
  CONSTRAINT route_stops_id_route_key UNIQUE (id, route_id)
);

CREATE INDEX IF NOT EXISTS route_stops_route_idx ON route_stops (route_id, position);

-- Fuer die composite FK unten: ein Stop muss eindeutig ueber (id, route_id)
-- ansprechbar sein. Idempotent per DO $$: Kein DROP CONSTRAINT, da route_progress
-- per Foreign Key davon abhaengt (verhindert Fehler 2BP01).
DO $$
BEGIN
  IF to_regclass('public.route_stops') IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.route_stops'::regclass
      AND conname = 'route_stops_id_route_key'
  ) THEN
    ALTER TABLE public.route_stops ADD CONSTRAINT route_stops_id_route_key UNIQUE (id, route_id);
  END IF;
END $$;

-- ── View v_stops ──────────────────────────────────────────────────────────
-- Erlaubt bequeme Abfragen aller Stationen inklusive Routen- und Spot-Details.
-- Loest gleichzeitig den Fehler 42P01 ('relation "v_stops" does not exist') auf,
-- falls Entwickler oder SQL-Tools den Kurznamen v_stops abfragen.
CREATE OR REPLACE VIEW public.v_stops AS
SELECT 
  rs.id,
  rs.route_id,
  r.name AS route_name,
  r.name AS route_title,
  rs.position,
  rs.title AS stop_title,
  rs.note,
  rs.lat,
  rs.lng,
  rs.dwell_minutes,
  rs.secret_spot_id,
  ss.title AS secret_spot_title
FROM public.route_stops rs
LEFT JOIN public.routes r ON r.id = rs.route_id
LEFT JOIN public.secret_spots ss ON ss.id = rs.secret_spot_id;

GRANT SELECT ON public.v_stops TO anon, authenticated;


-- Fortschritt des Reisenden. `visited_at` ist der Beleg fuer den Badge.
CREATE TABLE IF NOT EXISTS route_progress (
  route_id    uuid NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
  stop_id     uuid NOT NULL REFERENCES route_stops(id) ON DELETE CASCADE,
  traveler_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  visited_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (route_id, stop_id, traveler_id),
  -- SICHERHEITSKERN: Ohne diese Verknuepfung koennte jemand den Fortschritt auf
  -- Route A mit einer Station aus Route B buchen. Der Abhaengigkeits-Zaehler
  -- in sync_route_completions() filtert das zwar, aber die Zeile selbst waere
  -- fremd — und genau das ist der Weg, ueber den Besuchsverlauf fremder
  -- Stationen sichtbar wuerde. Die composite FK erzwingt serverseitig, dass
  -- stop_id zur angegebenen route_id gehoert.
  CONSTRAINT route_progress_stop_belongs_to_route
    FOREIGN KEY (stop_id, route_id) REFERENCES route_stops(id, route_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS route_progress_traveler_idx ON route_progress (traveler_id);

-- Bewertungen getrennt von routes: so kann ein Nutzer nur einmal voten und
-- der Zaehler wird nie vom Client gesetzt, sondern per Trigger gepflegt.
CREATE TABLE IF NOT EXISTS route_votes (
  route_id   uuid NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  value      smallint NOT NULL CHECK (value IN (-1, 1)),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (route_id, user_id)
);

-- Reisefotos.
--
-- SICHERHEITSKERN: `visible_at` muss serverseitig durchsetzbar sein, sonst
-- waere die Verzoegerung Theater. Die SELECT-Policy unten gibt Fotos erst
-- zurueck, wenn die Frist abgelaufen ist. Ohne diese Regel koennte ein
-- Nutzer sie umgehen, indem er die API direkt anspricht.
--
-- `exif_stripped` ist eine *Angabe* des Clients, keine Garantie. Verbindlich
-- ist die Regel: ohne dieses Flag erfolgt keine Veroeffentlichung. EXIF
-- enthaelt GPS und Zeitstempel — das ist das eigentliche Leck, nicht die
-- Wartezeit.
CREATE TABLE IF NOT EXISTS route_photos (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id      uuid NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
  stop_id       uuid NOT NULL REFERENCES route_stops(id) ON DELETE CASCADE,
  author_id     uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  storage_path  text NOT NULL,
  caption       text NOT NULL DEFAULT '',
  -- 6 Stunden statt der urspruenglich gewuenschten 30 Minuten: ein Zeitfenster
  -- von einer halben Stunde wirkt auf Autor:innen wie ein Fehler, und 6 Stunden
  -- reichen gegen Sichtbeobachter am Ort immer noch.
  visible_at    timestamptz NOT NULL DEFAULT (now() + interval '6 hours'),
  exif_stripped boolean NOT NULL DEFAULT false,
  faces_blurred boolean NOT NULL DEFAULT false,
  -- Der Autor bestaetigt beim Upload, ob Personen erkennbar sind. Wenn ja,
  -- faellt das Foto nach PERSON_PHOTO_TTL_STALZES automatisch weg — das ist
  -- der Schutz fuer den Quest-Folger, der sich selbst zeigt. Langlebiges
  -- Personenmaterial ist der eigentliche Grund, warum Strandfotos riskant
  -- sind; die 6-Stunden-Frist allein loest das nicht.
  has_person boolean NOT NULL DEFAULT false,
  -- Wann ein Personenfoto ungueltig wird. NULL bei personenfreien Fotos.
  expires_at timestamptz,
  status        text NOT NULL DEFAULT 'in_delay'
                CHECK (status IN ('in_delay', 'visible', 'flagged', 'removed')),
  created_at    timestamptz NOT NULL DEFAULT now(),
  -- Personenfotos brauchen ein Ablaufdatum, personenfreie nicht.
  CONSTRAINT route_photos_person_ttl CHECK (
    (has_person AND expires_at IS NOT NULL) OR (NOT has_person)
  )
);

CREATE INDEX IF NOT EXISTS route_photos_route_idx ON route_photos (route_id, stop_id);
CREATE INDEX IF NOT EXISTS route_photos_pending_idx ON route_photos (visible_at)
  WHERE status = 'in_delay';

-- Index auf expires_at, damit der Ablauf-Job keine Vollscan faehrt.
CREATE INDEX IF NOT EXISTS route_photos_expiry_idx ON route_photos (expires_at)
  WHERE expires_at IS NOT NULL;

-- ── Vertrauenspruefung fuer die Veroeffentlichung ──────────────────────────
-- Laeuft SECURITY DEFINER, damit sie profiles lesen darf, ohne dem Aufrufer
-- selbst Lesezugriff zu geben. Die Stufenformel muss identisch zu
-- src/data/trust.ts bleiben — beide Stellen synchron zu halten ist Pflicht.
CREATE OR REPLACE FUNCTION public.route_publish_allowed(p_author uuid)
RETURNS TABLE (allowed boolean, reason text, slots_left int, limit_total int)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_stops int;
  v_vip   boolean;
  v_used  int;
  v_limit int;
BEGIN
  SELECT COALESCE(certified_stops, 0), COALESCE(is_vip, false)
    INTO v_stops, v_vip
  FROM profiles WHERE id = p_author;

  v_limit := CASE
    WHEN v_stops >= 25 THEN 30
    WHEN v_stops >= 12 THEN 10
    WHEN v_stops >=  5 THEN  5
    WHEN v_stops >=  1 THEN  3
    ELSE 0
  END;

  -- VIP erweitert das Kontingent, ersetzt aber nie die Huerde. Wer nie vor Ort
  -- war, darf auch mit Abo keine Empfehlung im eigenen Namen veroeffentlichen.
  IF v_vip THEN v_limit := v_limit + 5; END IF;

  IF v_limit = 0 THEN
    RETURN QUERY SELECT false,
      format('Benoetigt mindestens 1 bestaetigten Ort. Du hast %s.', v_stops), 0, 0;
    RETURN;
  END IF;

  SELECT count(*) INTO v_used FROM routes
   WHERE author_id = p_author AND published;

  IF v_used >= v_limit THEN
    RETURN QUERY SELECT false,
      format('Kontingent erschoepft: %s/%s Routen.', v_used, v_limit), 0, v_limit;
    RETURN;
  END IF;

  RETURN QUERY SELECT true,
    format('Noch %s von %s Routen frei.', v_limit - v_used, v_limit),
    v_limit - v_used, v_limit;
END $$;

-- ══════════════════════════════════════════════════════════════════════════
--  RLS
-- ══════════════════════════════════════════════════════════════════════════
ALTER TABLE routes         ENABLE ROW LEVEL SECURITY;
ALTER TABLE route_stops    ENABLE ROW LEVEL SECURITY;
ALTER TABLE route_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE route_votes    ENABLE ROW LEVEL SECURITY;
ALTER TABLE route_photos   ENABLE ROW LEVEL SECURITY;

-- Veroeffentlichte Routen sind oeffentlich lesbar, Entwuerfe nur der Autor.
DROP POLICY IF EXISTS routes_select ON routes;
CREATE POLICY routes_select ON routes FOR SELECT
  USING (published OR author_id = auth.uid());

-- Veroeffentlichen nur, wenn die Trust-Pruefung es erlaubt.
DROP POLICY IF EXISTS routes_insert ON routes;
CREATE POLICY routes_insert ON routes FOR INSERT
  WITH CHECK (
    author_id = auth.uid()
    AND (SELECT allowed FROM public.route_publish_allowed(auth.uid()))
  );

-- Ein Autor darf seine Route aendern — aber keine fremden Zaehler heben.
--
-- WICHTIG: Der Vergleich der Zaehler laeuft ueber eine SECURITY-DEFINER-
-- Funktion. Ein direktes `(SELECT upvotes FROM routes r WHERE r.id = routes.id)`
-- in der Policy wuerde beim Pruefen der WITH-Klausel erneut die Policy anwenden
-- — Postgres bricht solche Konstruktionen mit "infinite recursion detected in
-- policy" ab. Die Funktion umgeht das, weil SECURITY DEFINER die RLS-Pruefung
-- fuer diesen einen Lesevorgang aufhebt.
CREATE OR REPLACE FUNCTION public.route_counters_unchanged(
  p_route uuid, p_upvotes int, p_downvotes int, p_completions int
) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT p_upvotes   = r.upvotes
     AND p_downvotes = r.downvotes
     AND p_completions = r.completions
    FROM routes r WHERE r.id = p_route;
$$;

DROP POLICY IF EXISTS routes_update ON routes;
CREATE POLICY routes_update ON routes FOR UPDATE
  USING (author_id = auth.uid())
  WITH CHECK (
    author_id = auth.uid()
    AND public.route_counters_unchanged(id, upvotes, downvotes, completions)
  );

-- Stationen folgen der Sichtbarkeit ihrer Route.
DROP POLICY IF EXISTS route_stops_select ON route_stops;
CREATE POLICY route_stops_select ON route_stops FOR SELECT
  USING (EXISTS (SELECT 1 FROM routes r
                  WHERE r.id = route_id AND (r.published OR r.author_id = auth.uid())));

DROP POLICY IF EXISTS route_stops_insert ON route_stops;
CREATE POLICY route_stops_insert ON route_stops FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM routes r
                      WHERE r.id = route_id AND r.author_id = auth.uid()));

DROP POLICY IF EXISTS route_stops_update ON route_stops;
CREATE POLICY route_stops_update ON route_stops FOR UPDATE
  USING (EXISTS (SELECT 1 FROM routes r
                  WHERE r.id = route_id AND r.author_id = auth.uid()));

DROP POLICY IF EXISTS route_stops_delete ON route_stops;
CREATE POLICY route_stops_delete ON route_stops FOR DELETE
  USING (EXISTS (SELECT 1 FROM routes r
                  WHERE r.id = route_id AND r.author_id = auth.uid()));

-- Eigenen Fortschritt darf man sehen.
--
-- WICHTIG: Es gibt hier bewusst KEINE oeffentliche Policy fuer fremden
-- Fortschritt. Eine frueher vorhandene Regel gab pro Folger die Station und
-- `visited_at` aus — damit liesse sich rekonstruieren, wann jemand wo war.
-- Genau das ist die Ortungsspur, die die Fotoverzoegerung verhindern soll:
-- Ein Beobachter haette nur eine Stunde nach "Station 4 abgehakt" eine
-- Route abfragen muessen, um zu wissen, wo der Mensch ist.
--
-- Nach aussen sichtbar ist deshalb ausschliesslich der *Zaehler* in
-- routes.completions — keine Person, keine Zeit, keine Station.
DROP POLICY IF EXISTS route_progress_own ON route_progress;
CREATE POLICY route_progress_own ON route_progress FOR SELECT
  USING (traveler_id = auth.uid());

DROP POLICY IF EXISTS route_progress_insert ON route_progress;
CREATE POLICY route_progress_insert ON route_progress FOR INSERT
  WITH CHECK (traveler_id = auth.uid());

-- Ein Abhaken muss auch wieder rueckgaengig zu machen sein, sonst ist ein
-- Fehlklick fuer immer im Reisepass.
DROP POLICY IF EXISTS route_progress_delete ON route_progress;
CREATE POLICY route_progress_delete ON route_progress FOR DELETE
  USING (traveler_id = auth.uid());

-- Bewertungen sind oeffentlich lesbar, schreibbar nur die eigene Stimme.
DROP POLICY IF EXISTS route_votes_select ON route_votes;
CREATE POLICY route_votes_select ON route_votes FOR SELECT
  USING (EXISTS (SELECT 1 FROM routes r WHERE r.id = route_id AND r.published));

DROP POLICY IF EXISTS route_votes_insert ON route_votes;
CREATE POLICY route_votes_insert ON route_votes FOR INSERT
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS route_votes_update ON route_votes;
CREATE POLICY route_votes_update ON route_votes FOR UPDATE
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS route_votes_delete ON route_votes;
CREATE POLICY route_votes_delete ON route_votes FOR DELETE
  USING (user_id = auth.uid());

-- ── Fotos: hier wird die Verzoegerung durchgesetzt ─────────────────────────
--
-- Die Regel ist absichtlich strikt: sichtbar nur nach Ablauf der Frist UND
-- nur wenn die Metadaten entfernt wurden. Moderation greift sofort — ein
-- geflaggtes Foto verschwindet, ohne die Frist abzuwarten.
DROP POLICY IF EXISTS route_photos_select_public ON route_photos;
CREATE POLICY route_photos_select_public ON route_photos FOR SELECT
  USING (status = 'visible' AND visible_at <= now() AND exif_stripped);

-- Der Autor sieht seine eigenen Fotos immer, auch die noch geschuetzten.
-- Sonst kann er sein Bild nicht gegenpruefen und wuerde es vermutlich
-- dreimal hochladen.
DROP POLICY IF EXISTS route_photos_select_own ON route_photos;
CREATE POLICY route_photos_select_own ON route_photos FOR SELECT
  USING (author_id = auth.uid());

-- Hochladen nur angemeldet, mit entfernten Metadaten und mit Frist in der
-- Zukunft. Genau so setzt der Client es in src/lib/photoSafety.ts.
DROP POLICY IF EXISTS route_photos_insert ON route_photos;
CREATE POLICY route_photos_insert ON route_photos FOR INSERT
  WITH CHECK (
    author_id = auth.uid()
    AND exif_stripped
    AND visible_at > now()
    AND status = 'in_delay'
  );

-- Weder Frist noch Status sind nachtraeglich aenderbar. Wer sein Foto sofort
-- oeffentlich machen will, muss neu hochladen.
--
-- Auch hier gilt: der Vergleich laeuft ueber SECURITY DEFINER. Ein direktes
-- `(SELECT visible_at FROM route_photos p WHERE p.id = route_photos.id)` in
-- der WITH-Klausel wuerde dieselbe Policy erneut ausloesen und Postgres bricht
-- es mit "infinite recursion detected in policy for relation route_photos" ab.
CREATE OR REPLACE FUNCTION public.route_photo_timing_unchanged(
  p_photo uuid, p_visible_at timestamptz, p_status text
) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT p_visible_at = f.visible_at AND p_status = f.status
    FROM route_photos f WHERE f.id = p_photo;
$$;

DROP POLICY IF EXISTS route_photos_update ON route_photos;
CREATE POLICY route_photos_update ON route_photos FOR UPDATE
  USING (author_id = auth.uid())
  WITH CHECK (
    author_id = auth.uid()
    AND public.route_photo_timing_unchanged(id, visible_at, status)
  );

-- ══════════════════════════════════════════════════════════════════════════
--  Trigger — Zaehler konsistent halten
-- ══════════════════════════════════════════════════════════════════════════
-- Ohne diese Trigger driften upvotes und completions dauerhaft von den
-- tatsaechlichen Zeilen ab: die Zaehler werden dann nur fuer die Anzeige
-- gepflegt und niemand kann sie korrigieren.
CREATE OR REPLACE FUNCTION public.sync_route_vote_counts()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE routes SET
      upvotes   = upvotes   + CASE WHEN NEW.value =  1 THEN 1 ELSE 0 END,
      downvotes = downvotes + CASE WHEN NEW.value = -1 THEN 1 ELSE 0 END
    WHERE id = NEW.route_id;
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE routes SET
      upvotes   = upvotes   - CASE WHEN OLD.value =  1 THEN 1 ELSE 0 END
                                 + CASE WHEN NEW.value =  1 THEN 1 ELSE 0 END,
      downvotes = downvotes - CASE WHEN OLD.value = -1 THEN 1 ELSE 0 END
                                 + CASE WHEN NEW.value = -1 THEN 1 ELSE 0 END
    WHERE id = NEW.route_id;
  ELSE
    UPDATE routes SET
      upvotes   = upvotes   - CASE WHEN OLD.value =  1 THEN 1 ELSE 0 END,
      downvotes = downvotes - CASE WHEN OLD.value = -1 THEN 1 ELSE 0 END
    WHERE id = OLD.route_id;
  END IF;
  RETURN NULL;
END $$;

DROP TRIGGER IF EXISTS route_vote_counts ON route_votes;
CREATE TRIGGER route_vote_counts
  AFTER INSERT OR UPDATE OR DELETE ON route_votes
  FOR EACH ROW EXECUTE FUNCTION public.sync_route_vote_counts();

-- `completions` zaehlt abgeschlossene Durchlaeufe, nicht Stationsbesuche.
--
-- Ein blosser Vergleich von Besuchszahl gegen Stationszahl reicht nicht:
-- loescht ein Traveller einen Besuch und setzt ihn erneut, waere die Route
-- zweimal gezaehlt. Das Log mit Primaerschluessel (route_id, traveler_id)
-- macht den Zaehler stattdessen genau einmalig.
CREATE TABLE IF NOT EXISTS route_completions (
  route_id    uuid NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
  traveler_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  completed_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (route_id, traveler_id)
);

ALTER TABLE route_completions ENABLE ROW LEVEL SECURITY;

-- Nur der Traveller selbst darf den eigenen Abschluss *sehen*; die Zaehlung
-- laeuft ueber routes.completions, nicht ueber diese Tabelle. Deshalb
-- bleibt sie fuer Fremde unsichtbar — sonst laesst sich der komplette
-- Besuchverlauf eines Nutzers rekonstruieren.
DROP POLICY IF EXISTS route_completions_own ON route_completions;
CREATE POLICY route_completions_own ON route_completions FOR SELECT
  USING (traveler_id = auth.uid());

CREATE OR REPLACE FUNCTION public.sync_route_completions()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_total   int;
  v_visited int;
  v_written int;
BEGIN
  SELECT count(*) INTO v_total FROM route_stops WHERE route_id = NEW.route_id;

  -- Zaehlung nur fuer Stationen, die tatsaechlich zu dieser Route gehoeren.
  SELECT count(*) INTO v_visited
    FROM route_progress p
    JOIN route_stops s ON s.id = p.stop_id
   WHERE p.route_id = NEW.route_id
     AND p.traveler_id = NEW.traveler_id
     AND s.route_id = NEW.route_id;

  -- Noch nicht alle Stationen → nichts zu zaehlen.
  IF v_total = 0 OR v_visited < v_total THEN RETURN NULL; END IF;

  -- Der Primaerschluessel sorgt dafuer, dass der Abschluss genau einmal
  -- fliesst. INSERT ... ON CONFLICT DO NOTHING liefert 0, wenn er schon
  -- verbucht war.
  INSERT INTO route_completions (route_id, traveler_id)
  VALUES (NEW.route_id, NEW.traveler_id)
  ON CONFLICT DO NOTHING;

  GET DIAGNOSTICS v_written = ROW_COUNT;

  IF v_written > 0 THEN
    UPDATE routes SET completions = completions + 1 WHERE id = NEW.route_id;
  END IF;

  RETURN NULL;
END $$;

DROP TRIGGER IF EXISTS route_completion_count ON route_progress;
CREATE TRIGGER route_completion_count
  AFTER INSERT ON route_progress
  FOR EACH ROW EXECUTE FUNCTION public.sync_route_completions();

-- ── Fotos nach Ablauf der Frist freischalten ───────────────────────────────
-- Supabase raeumt keine Zeilen auf: ohne diesen planbaren Weg bleiben Fotos
-- dauerhaft in_delay. Die RLS blockt sie korrekt, aber sichtbar werden sie
-- nie. Einmal pro Stunde per pg_cron aufrufen.
--
-- Zwei Arbeitsgaenge in einer Funktion:
--   1. Freischalten, wenn die Schutzfrist abgelaufen ist.
--   2. Entfernen, wenn das Ablaufdatum erreicht ist — Personenfotos sollen
--      nicht unbegrenzt liegen bleiben.
CREATE OR REPLACE FUNCTION public.publish_due_route_photos()
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE n int;
BEGIN
  -- Erst zurueckziehen, dann freischalten. Sonst wuerde ein abgelaufenes
  -- Personenfoto im selben Lauf noch kurz sichtbar.
  UPDATE route_photos
     SET status = 'removed'
   WHERE status IN ('in_delay', 'visible')
     AND expires_at IS NOT NULL
     AND expires_at <= now();

  UPDATE route_photos
     SET status = 'visible'
   WHERE status = 'in_delay'
     AND visible_at <= now()
     AND exif_stripped;

  GET DIAGNOSTICS n = ROW_COUNT;
  RETURN n;
END $$;

COMMENT ON FUNCTION public.publish_due_route_photos() IS
  'Einmal pro Stunde per pg_cron: SELECT public.publish_due_route_photos(); '
  'Schaltet faellige Fotos frei und raeumt abgelaufene Personenfotos ab.';

-- Sichtbarkeit fuer die Sign-URL-Ausstellung. Die einzige Stelle, die
-- entscheidet, ob ein Foto ueberhaupt ausgeliefert werden darf.
CREATE OR REPLACE FUNCTION public.route_photo_is_visible(p_photo uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM route_photos
     WHERE id = p_photo
       AND status = 'visible'
       AND exif_stripped
       AND visible_at <= now()
       AND (expires_at IS NULL OR expires_at > now())
  );
$$;

COMMENT ON FUNCTION public.route_photo_is_visible(uuid) IS
  'Einzige Freigabestelle fuer signierte URLs. RLS schuetzt die Metadaten, '
  'dieser Check schuetzt die Bilddaten.';

-- ── Zeitplan ───────────────────────────────────────────────────────────────
-- Ohne diesen Job bleiben Fotos dauerhaft in in_delay: die RLS blockt sie
-- korrekt, aber sichtbar werden sie nie. Der Nutzer wuerde nur ein
-- Schatzkasten-Symbol sehen und nie ein Bild.
--
-- Wichtig: Der Job laeuft bewusst SELTEN (stuendlich), nicht minuetlich. Bei
-- einer Frist von 6 Stunden aendert ein 10-Minuten-Takt nichts, erzeugt aber
-- 360 Rows-Schreibvorgaenge pro Tag ohne Nutzen.
--
-- pg_cron ist auf Supabase ueber die Dashboard-Erweiterung aktivierbar. Die
-- beiden folgenden Zeilen laufen nur, wenn die Erweiterung vorhanden ist —
-- deshalb der Guard, damit das Schema nicht an der Installation scheitert.
DO $cron_setup$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_available_extensions WHERE name = 'pg_cron') THEN
    CREATE EXTENSION IF NOT EXISTS pg_cron;

    IF NOT EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'snt-publish-route-photos') THEN
      -- Der Job-Text nutzt bewusst einfache Anfuehrungszeichen, KEINE Dollar-Quotes.
      -- Verschachtelte Dollar-Tags innerhalb eines Blocks wuerden den
      -- umgebenden Block vorzeitig schliessen und den Parser brechen.
      PERFORM cron.schedule(
        'snt-publish-route-photos',
        '7 * * * *',
        'SELECT public.publish_due_route_photos()'
      );
    END IF;

    RAISE NOTICE 'pg_cron eingerichtet: Foto-Freischaltung stuendlich.';
  ELSE
    RAISE WARNING
      'pg_cron ist nicht verfuegbar. Bitte im Supabase-Dashboard aktivieren, '
      'sonst werden Fotos nach der Schutzfrist nie sichtbar.';
  END IF;
END $cron_setup$;

-- ── Storage ────────────────────────────────────────────────────────────────
-- Der Bucket ist PRIVAT. Das ist keine Feinheit: bei einem oeffentlichen
-- Bucket waere die ganze Verzoegerung umsonst, denn dann koennte jeder die
-- Datei direkt ueber ihre URL abrufen, ohne die route_photos-Policy zu
-- beruehren. Die RLS auf route_photos schuetzt nur die Metadaten, nicht
-- die Bilddaten selbst.
--
-- Zugriff laeuft deshalb ausschliesslich ueber kurzlebige signierte URLs,
-- die der Server erst nach Pruefung der Sichtbarkeit ausstellt.
INSERT INTO storage.buckets (id, name, public)
VALUES ('route-photos', 'route-photos', false)
ON CONFLICT (id) DO NOTHING;

-- Hochladen: eigener Pfad, JPEG/PNG/WebP, Groessengrenze. Der Pfad muss
-- dem Muster <user-id>/<uuid>.<ext> entsprechen — nur so ist im Download-
-- Policy sichergestellt, dass niemand in den Ordner eines anderen schreibt.
DROP POLICY IF EXISTS route_photos_storage_insert ON storage.objects;
CREATE POLICY route_photos_storage_insert ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'route-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
    AND (storage.foldername(name))[2] IS NOT NULL
    AND lower(storage.extension(name)) IN ('jpg', 'jpeg', 'png', 'webp')
    AND (metadata->>'size')::bigint < 12582912
  );

-- Lesen ueber Storage ist verboten. Bilder werden ausschliesslich ueber
-- signierte URLs ausgeliefert, die der Server nach Fristpruefung erzeugt.
-- Eine SELECT-Policy auf storage.objects wuerde die Verzoegerung aushebeln.
DROP POLICY IF EXISTS route_photos_storage_read ON storage.objects;
CREATE POLICY route_photos_storage_read ON storage.objects FOR SELECT
  USING (bucket_id = 'route-photos' AND false);

-- Loeschen nur eigener Objekte, und nur solange das Foto noch geschuetzt
-- ist. Danach ist das Objekt ohnehin nur noch temporaer.
DROP POLICY IF EXISTS route_photos_storage_delete ON storage.objects;
CREATE POLICY route_photos_storage_delete ON storage.objects FOR DELETE
  USING (
    bucket_id = 'route-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
-- "Veroeffentlicht nur mit mindestens einem bestaetigten Ort" bleibt ein echter
-- CHECK, weil er keine Subquery braucht. "Veroeffentlicht nur mit mindestens
-- einer Station" braucht eine Subquery — und CHECK-Constraints duerfen in
-- Postgres KEINE Subqueries enthalten. Deshalb steht dafuer ein Trigger.
ALTER TABLE routes DROP CONSTRAINT IF EXISTS routes_certified_stop_publish_check;
ALTER TABLE routes ADD CONSTRAINT routes_certified_stop_publish_check
  CHECK (NOT published OR author_certified_stops >= 1);

-- stations_anzahl spiegelt route_stops. Der Trigger haelt beide synchron, damit
-- die Regel ohne Subquery auskommt: published <= stations_anzahl.
ALTER TABLE routes ADD COLUMN IF NOT EXISTS stations_anzahl int NOT NULL DEFAULT 0;

ALTER TABLE routes DROP CONSTRAINT IF EXISTS routes_published_needs_stops;
ALTER TABLE routes ADD CONSTRAINT routes_published_needs_stops
  CHECK (NOT published OR stations_anzahl >= 1);

-- Pflege von stations_anzahl. Ohne diesen Trigger waere die Regel oben umgehbar:
-- ein Autor koennte published setzen, ohne je eine Station anzulegen.
CREATE OR REPLACE FUNCTION public.sync_route_station_count()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  -- Beim Einfuegen einer Station zaehlen...
  IF TG_OP = 'INSERT' AND NEW.published THEN
    UPDATE routes SET stations_anzahl = stations_anzahl + 1
     WHERE id = NEW.route_id AND published;
  -- ...beim Loeschen wieder zurueck.
  ELSIF TG_OP = 'DELETE' AND OLD.published THEN
    UPDATE routes SET stations_anzahl = GREATEST(stations_anzahl - 1, 0)
     WHERE id = OLD.route_id;
  -- Beim Aendern der Route alle betroffenen Routen neu zaehlen.
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.published OR NEW.published THEN
      UPDATE routes r SET stations_anzahl = (
        SELECT count(*) FROM route_stops s WHERE s.route_id = r.id
      ) WHERE r.id IN (OLD.route_id, NEW.route_id);
    END IF;
  END IF;
  RETURN NULL;
END $$;

DROP TRIGGER IF EXISTS route_station_count_ins ON route_stops;
CREATE TRIGGER route_station_count_ins
  AFTER INSERT ON route_stops
  FOR EACH ROW EXECUTE FUNCTION public.sync_route_station_count();

DROP TRIGGER IF EXISTS route_station_count_del ON route_stops;
CREATE TRIGGER route_station_count_del
  AFTER DELETE ON route_stops
  FOR EACH ROW EXECUTE FUNCTION public.sync_route_station_count();

DROP TRIGGER IF EXISTS route_station_count_upd ON route_stops;
CREATE TRIGGER route_station_count_upd
  AFTER UPDATE ON route_stops
  FOR EACH ROW EXECUTE FUNCTION public.sync_route_station_count();

-- Ab hier zaehlt der Trigger: wer eine Route veroeffentlichen will, muss
-- vorher Stationen anlegen. published=true auf einer leeren Route schlaegt
-- fehl, weil der BEFORE-INSERT-Trigger von routes das vorher prueft.
CREATE OR REPLACE FUNCTION public.guard_route_publish()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.published AND NOT EXISTS (SELECT 1 FROM route_stops s WHERE s.route_id = NEW.id) THEN
    RAISE EXCEPTION
      'Route "%" kann nicht ohne Station veroeffentlicht werden.', NEW.name
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS route_publish_guard ON routes;
CREATE TRIGGER route_publish_guard
  BEFORE INSERT OR UPDATE OF published ON routes
  FOR EACH ROW EXECUTE FUNCTION public.guard_route_publish();


-- ============================================================================
-- TEIL 12 — Orts-Chat (SNT-342 / SNT-343 / SNT-344, ADR-002 Modell B)
-- Asynchrone Orts-Kanäle mit 5 km Radius und kurzlebigem Kanal-Token
-- ============================================================================

-- 12.1 Kanäle pro Ort / Spot
CREATE TABLE IF NOT EXISTS place_channels (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    place_id    UUID NOT NULL REFERENCES secret_spots(id) ON DELETE CASCADE,
    created_by  UUID REFERENCES profiles(id) ON DELETE SET NULL,
    city        VARCHAR(100) NOT NULL,
    valid_until TIMESTAMPTZ NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_place_channels_place ON place_channels(place_id);
CREATE INDEX IF NOT EXISTS idx_place_channels_valid ON place_channels(valid_until);

-- 12.2 Einwilligung & Moderation pro Ort
CREATE TABLE IF NOT EXISTS chat_consent (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    place_id    UUID NOT NULL REFERENCES secret_spots(id) ON DELETE CASCADE,
    user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    allowed     BOOLEAN DEFAULT TRUE,
    granted_at  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    revoked_at  TIMESTAMPTZ,
    CONSTRAINT one_consent_per_user_place UNIQUE (place_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_chat_consent_user ON chat_consent(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_consent_place ON chat_consent(place_id);

-- 12.3 Chat-Beiträge
CREATE TABLE IF NOT EXISTS chat_posts (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel_id    UUID NOT NULL REFERENCES place_channels(id) ON DELETE CASCADE,
    author_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    body          TEXT NOT NULL CHECK (char_length(body) BETWEEN 1 AND 1000),
    trust_tier    VARCHAR(20) DEFAULT 'member',
    is_flagged    BOOLEAN DEFAULT FALSE,
    reports_count INT DEFAULT 0,
    created_at    TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_chat_posts_channel ON chat_posts(channel_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_posts_author  ON chat_posts(author_id);

-- 12.4 RLS aktivieren
ALTER TABLE place_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_consent   ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_posts     ENABLE ROW LEVEL SECURITY;

-- Policies für place_channels
DROP POLICY IF EXISTS place_channels_select_public ON place_channels;
CREATE POLICY place_channels_select_public ON place_channels
  FOR SELECT USING (valid_until > now() - interval '1 hour');

DROP POLICY IF EXISTS place_channels_insert_auth ON place_channels;
CREATE POLICY place_channels_insert_auth ON place_channels
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Policies für chat_consent
DROP POLICY IF EXISTS chat_consent_select_own ON chat_consent;
CREATE POLICY chat_consent_select_own ON chat_consent
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS chat_consent_insert_own ON chat_consent;
CREATE POLICY chat_consent_insert_own ON chat_consent
  FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS chat_consent_update_own ON chat_consent;
CREATE POLICY chat_consent_update_own ON chat_consent
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Policies für chat_posts
DROP POLICY IF EXISTS chat_posts_select_public ON chat_posts;
CREATE POLICY chat_posts_select_public ON chat_posts
  FOR SELECT USING (is_flagged = FALSE);

DROP POLICY IF EXISTS chat_posts_insert_auth ON chat_posts;
CREATE POLICY chat_posts_insert_auth ON chat_posts
  FOR INSERT WITH CHECK (
    author_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM place_channels pc
      WHERE pc.id = channel_id AND pc.valid_until > now()
    )
    AND EXISTS (
      SELECT 1 FROM chat_consent cc
      JOIN place_channels pc2 ON pc2.id = channel_id
      WHERE cc.place_id = pc2.place_id AND cc.user_id = auth.uid() AND cc.allowed = TRUE
    )
    AND EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.trust_tier IN ('member', 'trusted', 'anchor')
    )
  );

DROP POLICY IF EXISTS chat_posts_delete_own ON chat_posts;
CREATE POLICY chat_posts_delete_own ON chat_posts
  FOR DELETE USING (author_id = auth.uid());

-- 12.5 Geo-RPC register_channel
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

    SELECT id, city, latitude, longitude INTO v_spot
    FROM secret_spots
    WHERE id = p_place_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Ort nicht gefunden';
    END IF;

    SELECT trust_tier INTO v_trust_tier
    FROM profiles
    WHERE id = v_user_id;

    IF v_trust_tier = 'new' OR v_trust_tier IS NULL THEN
        RAISE EXCEPTION 'Trust-Stufe member erforderlich fuer Orts-Chat';
    END IF;

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

    INSERT INTO chat_consent (place_id, user_id, allowed, granted_at)
    VALUES (p_place_id, v_user_id, TRUE, now())
    ON CONFLICT (place_id, user_id)
    DO UPDATE SET allowed = TRUE, revoked_at = NULL, granted_at = now();

    SELECT id, valid_until INTO v_channel_id, v_valid_until
    FROM place_channels
    WHERE place_id = p_place_id AND valid_until > now()
    ORDER BY valid_until DESC
    LIMIT 1;

    IF v_channel_id IS NULL THEN
        v_valid_until := now() + interval '15 minutes';
        INSERT INTO place_channels (place_id, created_by, city, valid_until)
        VALUES (p_place_id, v_user_id, v_spot.city, v_valid_until)
        RETURNING id INTO v_channel_id;
    ELSE
        v_valid_until := greatest(v_valid_until, now() + interval '15 minutes');
        UPDATE place_channels
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


-- ============================================================================
-- TEIL 13 — Community P2 Guardrails (SNT-307 / SNT-308 / SNT-311)
-- ============================================================================

-- 13.1 Anti-Spoofing: Ersteller kann eigenen Spot nicht verifizieren (SNT-308)
CREATE OR REPLACE FUNCTION public.guard_spot_verification()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_creator UUID;
BEGIN
  SELECT created_by INTO v_creator FROM public.secret_spots WHERE id = NEW.spot_id;
  IF v_creator = NEW.user_id THEN
    RAISE EXCEPTION 'Ersteller kann den eigenen Spot nicht verifizieren.'
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS spot_verification_guard ON public.spot_verifications;
CREATE TRIGGER spot_verification_guard
  BEFORE INSERT ON public.spot_verifications
  FOR EACH ROW EXECUTE FUNCTION public.guard_spot_verification();

-- 13.2 3-Bestätigungen-Schwelle: Automatische Beförderung (SNT-307)
CREATE OR REPLACE FUNCTION public.sync_spot_verification()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_count INT;
BEGIN
  SELECT count(*) INTO v_count FROM public.spot_verifications WHERE spot_id = NEW.spot_id;
  UPDATE public.secret_spots
  SET verified_by_count = v_count,
      verification_state = CASE
        WHEN v_count >= 3 AND verification_state = 'unverified' THEN 'community_verified'
        ELSE verification_state
      END
  WHERE id = NEW.spot_id;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS spot_verification_sync ON public.spot_verifications;
CREATE TRIGGER spot_verification_sync
  AFTER INSERT OR DELETE ON public.spot_verifications
  FOR EACH ROW EXECUTE FUNCTION public.sync_spot_verification();

-- 13.3 Rate-Limits für Nachrichten: Max 20 Nachrichten pro Stunde (SNT-311)
CREATE OR REPLACE FUNCTION public.check_message_rate_limit()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_recent_count INT;
BEGIN
  SELECT count(*) INTO v_recent_count
  FROM public.messages
  WHERE sender_id = NEW.sender_id
    AND created_at > now() - interval '1 hour';

  IF v_recent_count >= 20 THEN
    RAISE EXCEPTION 'Rate-Limit erreicht: Maximal 20 Nachrichten pro Stunde erlaubt.'
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS message_rate_limit ON public.messages;
CREATE TRIGGER message_rate_limit
  BEFORE INSERT ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.check_message_rate_limit();

-- 13.4 Rate-Limits für neue Kontakte: Max 5 neue Unterhaltungen pro Tag (SNT-311)
CREATE OR REPLACE FUNCTION public.check_contact_rate_limit()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_daily_contacts INT;
BEGIN
  SELECT count(DISTINCT conversation_id) INTO v_daily_contacts
  FROM public.conversation_members
  WHERE user_id = NEW.user_id
    AND conversation_id IN (
      SELECT id FROM public.conversations WHERE created_at > now() - interval '1 day'
    );

  IF v_daily_contacts >= 5 THEN
    RAISE EXCEPTION 'Rate-Limit erreicht: Maximal 5 neue Kontakte pro Tag erlaubt.'
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS contact_rate_limit ON public.conversation_members;
CREATE TRIGGER contact_rate_limit
  BEFORE INSERT ON public.conversation_members
  FOR EACH ROW EXECUTE FUNCTION public.check_contact_rate_limit();





