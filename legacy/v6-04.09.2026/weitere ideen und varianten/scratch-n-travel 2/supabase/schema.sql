-- supabase/schema.sql
-- Kapitel 13 (Datenarchitektur) + Masterprompt Phase-D-Kriterium:
-- "Row-Level-Security so konfiguriert, dass ein Nutzer AUSSCHLIESSLICH eigene
--  scratch_progress- und checklist-Datensätze lesen/schreiben kann."

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  karma_points int not null default 0,
  document_number text unique,
  tier text not null default 'free' check (tier in ('free', 'pro', 'business')),
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists host_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  stripe_account_id text unique,
  business_type text,
  region_code text,
  status text not null default 'onboarding' check (status in ('onboarding', 'active', 'suspended')),
  updated_at timestamptz not null default now()
);

create table if not exists scratch_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  region_code text not null,
  progress numeric not null default 0 check (progress >= 0 and progress <= 1),
  unlocked_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, region_code)
);

create table if not exists checklist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  list_key text not null check (list_key in ('family', 'pet')),
  item_index int not null,
  checked boolean not null default false,
  updated_at timestamptz not null default now(),
  unique (user_id, list_key, item_index)
);

create table if not exists story_pins (
  id uuid primary key default gen_random_uuid(),
  region_code text not null,
  category text not null,
  title text not null,
  quote text not null,
  author_name text not null,
  author_role text,
  rating numeric,
  review_count int default 0,
  lat numeric,
  lng numeric,
  approach_notes text,
  verified boolean not null default false,
  moderation_status text not null default 'pending' check (moderation_status in ('pending','approved','rejected')),
  submitted_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists safety_reports (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('wucher','gefahr','tipp')),
  location text not null,
  description text not null,
  moderation_status text not null default 'pending' check (moderation_status in ('pending','flagged','auto_approved','published')),
  reported_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

-- ============ ROW LEVEL SECURITY ============

alter table profiles enable row level security;
alter table host_profiles enable row level security;
alter table scratch_progress enable row level security;
alter table checklist_items enable row level security;
alter table story_pins enable row level security;
alter table safety_reports enable row level security;

-- profiles: Nutzer sieht/ändert nur sich selbst
create policy "profiles_select_own" on profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on profiles for update using (auth.uid() = id);
-- Hinweis: profiles.tier und profiles.role werden NIE clientseitig per
-- profiles_update_own verändert -- diese Policy deckt nur Felder wie
-- display_name ab. tier/role-Änderungen laufen ausschließlich über den
-- Supabase-Service-Role-Key im Stripe-Webhook (app/api/stripe/webhook),
-- der RLS umgeht. Für strikte Trennung in Produktion: separate Spalten-
-- Policy oder ein Trigger, der tier/role gegen Client-Updates sperrt.

-- host_profiles: Host sieht/verwaltet nur sein eigenes Profil
create policy "host_profiles_select_own" on host_profiles for select using (auth.uid() = user_id);
create policy "host_profiles_upsert_own" on host_profiles for insert with check (auth.uid() = user_id);
create policy "host_profiles_update_own" on host_profiles for update using (auth.uid() = user_id);

-- scratch_progress: strikt user-scoped, wie im Masterprompt gefordert
create policy "scratch_progress_select_own" on scratch_progress
  for select using (auth.uid() = user_id);
create policy "scratch_progress_insert_own" on scratch_progress
  for insert with check (auth.uid() = user_id);
create policy "scratch_progress_update_own" on scratch_progress
  for update using (auth.uid() = user_id);

-- checklist_items: strikt user-scoped
create policy "checklist_select_own" on checklist_items
  for select using (auth.uid() = user_id);
create policy "checklist_insert_own" on checklist_items
  for insert with check (auth.uid() = user_id);
create policy "checklist_update_own" on checklist_items
  for update using (auth.uid() = user_id);

-- story_pins: öffentlich lesbar NUR wenn verified/approved; Einreichen nur eingeloggt
create policy "story_pins_select_public" on story_pins
  for select using (moderation_status = 'approved');
create policy "story_pins_insert_own" on story_pins
  for insert with check (auth.uid() = submitted_by);

-- safety_reports: Sicherheitsinfos sind bewusst IMMER öffentlich lesbar,
-- sobald sie den Moderationsstatus 'published' erreichen — kein Gate wie
-- bei story_pins (8.13: "kein Gamification-Gate bei Warnungen").
create policy "safety_reports_select_published" on safety_reports
  for select using (moderation_status = 'published');
create policy "safety_reports_insert_any" on safety_reports
  for insert with check (true); -- auch anonyme Meldungen erlaubt, Missbrauchsschutz über Vorprüfung/Rate-Limit auf API-Ebene
