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

-- 1.3 User ↔ Hobby (Many-to-Many) — das Matching läuft hierüber
CREATE TABLE IF NOT EXISTS profile_hobbies (
    user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    hobby_id    INT  NOT NULL REFERENCES hobbies(id)  ON DELETE CASCADE,
    skill_level VARCHAR(20) DEFAULT 'interested', -- curious | beginner | solid | expert
    PRIMARY KEY (user_id, hobby_id)
);

CREATE INDEX IF NOT EXISTS idx_profile_hobbies_hobby ON profile_hobbies(hobby_id);

-- 1.8 Gespeicherte Spots -------------------------------------------------
CREATE TABLE IF NOT EXISTS saved_spots (
    user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    spot_id     UUID NOT NULL REFERENCES secret_spots(id) ON DELETE CASCADE,
    saved_at    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, spot_id)
);

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
CREATE TABLE IF NOT EXISTS blocks (
    blocker_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,


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
CREATE TABLE IF NOT EXISTS hermes_city_brains (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    city         VARCHAR(100) UNIQUE NOT NULL,
    country      VARCHAR(100),

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

-- ---------- conversations ----------
DROP POLICY IF EXISTS conversations_select_members ON conversations;
CREATE POLICY conversations_select_members ON conversations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversation_members cm
      WHERE cm.conversation_id = id AND cm.user_id = auth.uid()
    )
  );

-- ---------- conversation_members ----------
DROP POLICY IF EXISTS conv_members_select_members ON conversation_members;
CREATE POLICY conv_members_select_members ON conversation_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversation_members cm2
      WHERE cm2.conversation_id = conversation_id AND cm2.user_id = auth.uid()
    )
  );

-- ---------- messages ----------
-- Nur lesen, wenn man Mitglied ist UND niemand in der Unterhaltung blockiert hat
DROP POLICY IF EXISTS messages_select_members ON messages;
CREATE POLICY messages_select_members ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversation_members cm
      WHERE cm.conversation_id = conversation_id AND cm.user_id = auth.uid()
    )
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
    AND EXISTS (
      SELECT 1 FROM conversation_members cm
      WHERE cm.conversation_id = messages.conversation_id AND cm.user_id = auth.uid()
    )
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


-- ============================================================================

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



  FOR EACH ROW EXECUTE FUNCTION public.on_trust_event_insert();


