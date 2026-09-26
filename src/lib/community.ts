/**
 * Community-Datenschicht.
 *
 * Jede Funktion arbeitet gegen Supabase und respektiert die RLS-Policies aus
 * `supabase/schema.sql`. Wo Supabase nicht konfiguriert ist, liefern die
 * Funktionen leere Ergebnisse — die UI zeigt dann einen Demo-Hinweis, statt
 * still zu scheitern.
 */
import { supabase, isSupabaseConfigured } from '../services/supabase'
import type { TrustTier } from './trust'

// ---------------------------------------------------------------------------
// Typen (spiegeln die Tabellen in supabase/schema.sql)
// ---------------------------------------------------------------------------

export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  handle: string | null
  avatar_url: string | null
  role: 'traveler' | 'local' | 'host' | 'moderator'
  bio: string | null
  city: string | null
  country: string | null
  languages: string[]
  has_kids: boolean
  has_pets: boolean
  pet_types: string[]
  trust_tier: TrustTier
  is_verified: boolean
  verification_kind: string | null
  is_local: boolean
  karma_points: number
  reports_received?: number
  reports_ignored?: number
  last_seen_at: string | null
  created_at: string
}

export interface Hobby {
  id: number
  slug: string
  label_de: string
  category: 'sport' | 'creative' | 'nature' | 'food' | 'culture' | 'social'
  icon: string | null
}

export interface ProfileHobby {
  user_id: string
  hobby_id: number
  skill_level: 'curious' | 'beginner' | 'solid' | 'expert'
}

export interface SecretSpot {
  id: string
  title: string
  city: string
  country: string | null
  category: string
  description: string
  latitude: number
  longitude: number
  image_url: string | null
  source: 'local_submitted' | 'ai_seeded' | 'partner' | 'imported'
  verification_state: 'unverified' | 'community_verified' | 'moderator_verified'
  verified_by_count: number
  created_by: string | null
  safety_level: 'normal' | 'caution' | 'remote'
  safety_note: string | null
  is_stroller_friendly: boolean
  is_dog_friendly: boolean
  is_family_friendly: boolean
  is_secret: boolean
  etiquette_note: string | null
  saves_count: number
  created_at: string
}

export interface Meetup {
  id: string
  title: string
  description: string | null
  host_id: string
  city: string
  venue_name: string | null
  venue_note: string | null
  starts_at: string
  ends_at: string | null
  max_participants: number
  required_tier: TrustTier
  vibe: string[]
  hobby_ids: number[]
  safety_brief: string | null
  is_public: boolean
  status: 'open' | 'full' | 'cancelled' | 'done'
  created_at: string
  host?: Profile
  participant_count?: number
  is_joined?: boolean
}

export interface PersonMatch {
  profile: Profile
  sharedHobbies: Hobby[]
  /** 0..100 — wie gut passen die Profile zusammen */
  score: number
  /** Warum dieser Match vorgeschlagen wird (für die Anzeige) */
  reasons: string[]
}

// ---------------------------------------------------------------------------
// Basis-Hilfen
// ---------------------------------------------------------------------------

/** Liefert `true`, wenn ohne Backend gearbeitet wird. */
export function isDemoMode(): boolean {
  return !isSupabaseConfigured
}

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : []
}

// ---------------------------------------------------------------------------
// Hobbys
// ---------------------------------------------------------------------------

export async function getHobbies(): Promise<Hobby[]> {
  if (!supabase) return []
  const { data, error } = await supabase.from('hobbies').select('*').order('category')
  if (error) throw new Error(`Hobbys laden fehlgeschlagen: ${error.message}`)
  return (data ?? []) as Hobby[]
}

export async function getUserHobbies(userId: string): Promise<Hobby[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('profile_hobbies')
    .select('hobby:hobbies(*)')
    .eq('user_id', userId)
  if (error) throw new Error(`Hobbys des Nutzers laden fehlgeschlagen: ${error.message}`)
  return (data ?? []).map((r) => (r as unknown as { hobby: Hobby }).hobby).filter(Boolean)
}

export async function setUserHobbies(
  userId: string,
  hobbyIds: number[],
  skillLevel: ProfileHobby['skill_level'] = 'curious',
): Promise<void> {
  if (!supabase) throw new Error('Nur mit Supabase-Konfiguration verfügbar.')
  const { error: delErr } = await supabase.from('profile_hobbies').delete().eq('user_id', userId)
  if (delErr) throw new Error(`Hobbys zurücksetzen fehlgeschlagen: ${delErr.message}`)

  if (hobbyIds.length === 0) return
  const { error } = await supabase.from('profile_hobbies').insert(
    hobbyIds.map((hobby_id) => ({ user_id: userId, hobby_id, skill_level: skillLevel })),
  )
  if (error) throw new Error(`Hobbys speichern fehlgeschlagen: ${error.message}`)
}

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------

export async function getProfile(userId: string): Promise<Profile | null> {
  if (!supabase) return null
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle()
  if (error) throw new Error(`Profil laden fehlgeschlagen: ${error.message}`)
  return (data as Profile) ?? null
}

export async function updateProfile(userId: string, patch: Partial<Profile>): Promise<void> {
  if (!supabase) throw new Error('Nur mit Supabase-Konfiguration verfügbar.')
  // Sicherheitskritische Felder werden NIEMALS vom Client geschrieben.
  const {
    trust_tier: _tier,
    is_verified: _verified,
    verification_kind: _kind,
    karma_points: _karma,
    reports_received: _received,
    reports_ignored: _ignored,
    ...safe
  } = patch

  const { error } = await supabase.from('profiles').update(safe).eq('id', userId)
  if (error) throw new Error(`Profil speichern fehlgeschlagen: ${error.message}`)
}

// ---------------------------------------------------------------------------
// Matching — "Menschen mit den gleichen Interessen finden"
// ---------------------------------------------------------------------------
//
// Bewusst einfacher, erklärbarer Algorithmus. Kein Blackbox-Scoring, kein
// „Magic Score". Jede Person bekommt eine sichtbare Begründung, warum sie
// vorgeschlagen wird — sonst verstehen Nutzer nicht, wen sie sehen.

/** Gewichte: Was verbindet Menschen wirklich? */
const MATCH_WEIGHTS = {
  hobby: 34,
  sameCity: 26,
  language: 16,
  localBridge: 12,
  context: 12,
} as const

/**
 * Berechnet einen Match zwischen meinem und dem Profil einer anderen Person.
 * Liefert Score (0-100), gemeinsame Hobbys und eine erklärbare Begründung.
 */
export function calculateMatch(
  me: Profile,
  other: Profile,
  myHobbies: Hobby[],
  otherHobbies: Hobby[],
  languageOverlap: number = 0,
): PersonMatch {
  const reasons: string[] = []
  let score = 0

  // 1) Geteilte Hobbys
  const myIds = new Set(myHobbies.map((h) => h.id))
  const sharedHobbies = otherHobbies.filter((h) => myIds.has(h.id))

  if (sharedHobbies.length > 0) {
    score += MATCH_WEIGHTS.hobby * Math.min(1, sharedHobbies.length / 2)
    const names = sharedHobbies.slice(0, 3).map((h) => `${h.icon ?? ''}${h.label_de}`.trim())
    reasons.push(
      sharedHobbies.length === 1
        ? `Beide mögt ${names[0]}`
        : `Gemeinsame Interessen: ${names.join(', ')}`,
    )
  }

  // 2) Gleiche Stadt
  if (me.city && other.city && me.city.toLowerCase() === other.city.toLowerCase()) {
    score += MATCH_WEIGHTS.sameCity
    reasons.push(`Beide in ${other.city}`)
  } else if (me.country && other.country && me.country === other.country) {
    score += MATCH_WEIGHTS.sameCity * 0.3
  }

  // 3) Sprachüberschneidung
  if (languageOverlap > 0) {
    score += MATCH_WEIGHTS.language * Math.min(1, languageOverlap / 2)
    if (languageOverlap >= 2) {
      const shared = asArray<string>(me.languages).filter((l) =>
        asArray<string>(other.languages).includes(l),
      )
      if (shared.length) reasons.push(`Ihr sprecht beide ${shared.slice(0, 2).join(' und ')}`)
    }
  }

  // 4) Local-Brücke
  if (me.is_local !== other.is_local) {
    score += MATCH_WEIGHTS.localBridge
    reasons.push(
      other.is_local
        ? `${other.full_name ?? 'Diese Person'} wohnt vor Ort und kennt die Stadt`
        : 'DU wohnst vor Ort — du kannst zeigen',
    )
  } else if (me.is_local && other.is_local) {
    score += MATCH_WEIGHTS.localBridge * 0.4
  }

  // 5) Lebenssituation
  const sharedContext: string[] = []
  if (me.has_kids && other.has_kids) sharedContext.push('Kinder')
  if (me.has_pets && other.has_pets) sharedContext.push('Haustiere')
  if (sharedContext.length > 0) {
    score += MATCH_WEIGHTS.context
    reasons.push(`Gemeinsam: ${sharedContext.join(' und ')}`)
  }

  // Bonus: Wer selbst viel beigetragen hat, ist verlaesslicher
  // (max. +4, damit es nie das wichtigste Kriterium ist)
  if (other.karma_points > 20) score += 4

  return {
    profile: other,
    sharedHobbies,
    score: Math.min(100, Math.round(score)),
    reasons: reasons.slice(0, 3),
  }
}


/** Findet passende Personen, sortiert nach Match-Qualität. */
export async function findPeopleMatches(
  me: Profile,
  myHobbies: Hobby[],
  options: { city?: string; limit?: number } = {},
): Promise<PersonMatch[]> {
  if (!supabase) return []

  const limit = options.limit ?? 20
  const city = options.city ?? me.city
  const blocked = await blockedIdList(me.id)

  let query = supabase.from('profiles').select('*').neq('id', me.id).limit(60)
  if (city) query = query.eq('city', city)

  const { data, error } = await query
  if (error) throw new Error(`Personen laden fehlgeschlagen: ${error.message}`)

  // Blockierte Personen nachträglich herausfiltern (sauberer als SQL-Injection-Risiko)
  const candidates = ((data ?? []) as Profile[]).filter((p) => !blocked.includes(p.id))
  if (candidates.length === 0) return []

  // Hobbys aller Kandidaten in einem Rutsch laden
  const ids = candidates.map((c) => c.id)
  const { data: phData } = await supabase
    .from('profile_hobbies')
    .select('user_id, hobby:hobbies(*)')
    .in('user_id', ids)

  const hobbyMap = new Map<string, Hobby[]>()
  for (const row of phData ?? []) {
    const r = row as unknown as { user_id: string; hobby: Hobby }
    if (!r.hobby) continue
    const list = hobbyMap.get(r.user_id) ?? []
    list.push(r.hobby)
    hobbyMap.set(r.user_id, list)
  }

  const myLangs = asArray<string>(me.languages)
  const matches = candidates.map((other) => {
    const otherLangs = asArray<string>(other.languages)
    const overlap = myLangs.filter((l) => otherLangs.includes(l)).length
    return calculateMatch(me, other, myHobbies, hobbyMap.get(other.id) ?? [], overlap)
  })

  return matches.filter((m) => m.score > 0).sort((a, b) => b.score - a.score).slice(0, limit)
}

/** IDs aller Nutzer, die ich blockiert habe. */
async function blockedIdList(userId: string): Promise<string[]> {
  if (!supabase) return []
  const { data } = await supabase.from('blocks').select('blocked_id').eq('blocker_id', userId)
  return (data ?? []).map((r) => (r as { blocked_id: string }).blocked_id)
}


// ---------------------------------------------------------------------------
// Secret Spots
// ---------------------------------------------------------------------------

export interface SubmitSpotInput {
  title: string
  city: string
  country?: string
  category: string
  description: string
  latitude: number
  longitude: number
  imageUrl?: string
  safetyLevel?: SecretSpot['safety_level']
  safetyNote?: string
  isDogFriendly?: boolean
  isFamilyFriendly?: boolean
  isStrollerFriendly?: boolean
  etiquetteNote?: string
}

/**
 * Reicht einen Spot ein.
 *
 * WICHTIG: `verification_state` und `verified_by_count` werden hier bewusst
 * NICHT gesetzt — die RLS-Policy erzwingt `unverified` und `0`. Ein Nutzer
 * kann seinen eigenen Spot nicht als "verifiziert" auszeichnen.
 */
export async function submitSpot(userId: string, input: SubmitSpotInput): Promise<SecretSpot> {
  if (!supabase) throw new Error('Nur mit Supabase-Konfiguration verfügbar.')

  if (!input.title?.trim()) throw new Error('Der Spot braucht einen Titel.')
  if (!input.description?.trim() || input.description.trim().length < 20) {
    throw new Error('Bitte beschreibe den Spot mit mindestens 20 Zeichen.')
  }
  if (Number.isNaN(input.latitude) || Number.isNaN(input.longitude)) {
    throw new Error('Bitte gib gültige Koordinaten an (du kannst sie auf der Karte setzen).')
  }
  if (input.latitude < -90 || input.latitude > 90 || input.longitude < -180 || input.longitude > 180) {
    throw new Error('Diese Koordinaten liegen nicht auf der Erde. Bitte korrigiere sie.')
  }

  const { data, error } = await supabase
    .from('secret_spots')
    .insert({
      title: input.title.trim(),
      city: input.city.trim(),
      country: input.country ?? null,
      category: input.category,
      description: input.description.trim(),
      latitude: input.latitude,
      longitude: input.longitude,
      image_url: input.imageUrl ?? null,
      source: 'local_submitted',
      safety_level: input.safetyLevel ?? 'normal',
      safety_note: input.safetyNote ?? null,
      is_dog_friendly: input.isDogFriendly ?? false,
      is_family_friendly: input.isFamilyFriendly ?? false,
      is_stroller_friendly: input.isStrollerFriendly ?? false,
      etiquette_note: input.etiquetteNote ?? null,
      created_by: userId,
    })
    .select()
    .single()

  if (error) throw new Error(`Spot konnte nicht gespeichert werden: ${error.message}`)
  return data as SecretSpot
}

export async function getSpots(city?: string, category?: string): Promise<SecretSpot[]> {
  if (!supabase) return []
  let query = supabase.from('secret_spots').select('*').order('saves_count', { ascending: false })
  if (city) query = query.eq('city', city)
  if (category) query = query.eq('category', category)
  const { data, error } = await query.limit(200)
  if (error) throw new Error(`Spots laden fehlgeschlagen: ${error.message}`)
  return (data ?? []) as SecretSpot[]
}

/**
 * Bestätigt einen Spot. Löst `community_verified` aus, sobald 3 verschiedene
 * Personen bestätigt haben (Trigger in der Datenbank). Der Ersteller des
 * Spots kann nicht selbst bestätigen (RLS-Policy).
 */
export async function verifySpot(
  userId: string,
  spotId: string,
  note?: string,
): Promise<void> {
  if (!supabase) throw new Error('Nur mit Supabase-Konfiguration verfügbar.')
  const { error } = await supabase
    .from('spot_verifications')
    .insert({ user_id: userId, spot_id: spotId, note: note ?? null })
  if (error) {
    if (error.message.includes('one_vote_per_user')) {
      throw new Error('Du hast diesen Spot bereits bestätigt.')
    }
    throw new Error(`Bestätigen fehlgeschlagen: ${error.message}`)
  }
}

/** Stimmungs-Labels für Meetups — klar formuliert, inkl. Erklärung. */
export const MEETUP_VIBES: { value: string; label: string; hint: string; icon: string }[] = [
  {
    value: 'culture_exchange',
    label: 'Kulturaustausch',
    hint: 'Sprachen, Sitten, Essen, Geschichten. Niemand muss etwas vorbereiten.',
    icon: '🌍',
  },
  {
    value: 'hobby',
    label: 'Gemeinsam Hobby',
    hint: 'Wandern, Surfen, Kochen, Fotografieren. Ihr macht etwas zusammen.',
    icon: '🥾',
  },
  {
    value: 'friendly_chat',
    label: 'Einfach nette Leute',
    hint: 'Kaffee, ein Bier, ein Gespräch. Kein Programm, kein Leistungsdruck.',
    icon: '☕',
  },
  {
    value: 'language_exchange',
    label: 'Sprachtausch',
    hint: 'Beide lernen voneinander. Deutsch gegen Englisch oder etwas anderes.',
    icon: '💬',
  },
  {
    value: 'family',
    label: 'Familien & Haustiere',
    hint: 'Mit Kindern oder Hund unterwegs. Ruhiger, kindertauglicher Rahmen.',
    icon: '👨‍👩‍👧',
  },
  {
    value: 'walk',
    label: 'Spaziergang',
    hint: 'Bewegung an der frischen Luft, niedrigschwellig, leicht.',
    icon: '🚶',
  },
]

export async function getMeetups(city?: string, limit = 30): Promise<Meetup[]> {
  if (!supabase) return []

  let query = supabase
    .from('meetups')
    .select('*, host:profiles(*)')
    .eq('is_public', true)
    .in('status', ['open', 'full'])
    .order('starts_at', { ascending: true })
    .limit(limit)

  if (city) query = query.eq('city', city)

  const { data, error } = await query
  if (error) throw new Error(`Meetups laden fehlgeschlagen: ${error.message}`)
  return (data ?? []) as unknown as Meetup[]
}

export async function getMeetup(meetupId: string): Promise<Meetup | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('meetups')
    .select('*, host:profiles(*)')
    .eq('id', meetupId)
    .maybeSingle()
  if (error) throw new Error(`Meetup laden fehlgeschlagen: ${error.message}`)
  return (data as unknown as Meetup) ?? null
}

/** Eingabe zum Anlegen eines Meetups. */
export interface CreateMeetupInput {
  title: string
  description?: string
  city: string
  venueName: string
  venueNote?: string
  startsAt: string
  endsAt?: string
  maxParticipants?: number
  vibe: string[]
  hobbyIds?: number[]
  safetyBrief?: string
}

export async function createMeetup(hostId: string, input: CreateMeetupInput): Promise<Meetup> {
  if (!supabase) throw new Error('Nur mit Supabase-Konfiguration verfügbar.')

  if (!input.title?.trim()) throw new Error('Das Meetup braucht einen Titel.')
  if (!input.venueName?.trim()) {
    throw new Error(
      'Gib einen öffentlichen Ort an (Café, Park, Markt). Keine Privatadresse beim ersten Meetup.',
    )
  }
  if (input.vibe.length === 0) throw new Error('Wähle aus, worum es geht.')
  if (new Date(input.startsAt).getTime() < Date.now()) {
    throw new Error('Der Termin liegt in der Vergangenheit.')
  }

  const { data, error } = await supabase
    .from('meetups')
    .insert({
      title: input.title.trim(),
      description: input.description?.trim() ?? null,
      host_id: hostId,
      city: input.city.trim(),
      venue_name: input.venueName.trim(),
      venue_note: input.venueNote ?? null,
      starts_at: input.startsAt,
      ends_at: input.endsAt ?? null,
      max_participants: Math.min(50, Math.max(2, input.maxParticipants ?? 8)),
      // Kleine Gruppen sind der wirksamste Schutzfactor
      required_tier: 'trusted',
      vibe: input.vibe,
      hobby_ids: input.hobbyIds ?? [],
      safety_brief: input.safetyBrief ?? null,
      is_public: true,
      status: 'open',
    })
    .select()
    .single()

  if (error) {
    if (error.message.includes('meetups_insert_host')) {
      throw new Error(
        'Um eigene Meetups auszurichten brauchst du die Stufe "Vertrauensvoll". ' +
          'In deinem Profil siehst du, wie viele Punkte dir noch fehlen.',
      )
    }
    throw new Error(`Meetup konnte nicht erstellt werden: ${error.message}`)
  }
  return data as Meetup
}

export async function joinMeetup(meetupId: string, userId: string): Promise<void> {
  if (!supabase) throw new Error('Nur mit Supabase-Konfiguration verfügbar.')
  const { error } = await supabase
    .from('meetup_participants')
    .insert({ meetup_id: meetupId, user_id: userId })
  if (error) {
    if (error.message.includes('participants_insert_self')) {
      throw new Error(
        'Du kannst diesem Meetup nicht beitreten — entweder ist es voll, abgesagt, ' +
          'oder deine Vertrauensstufe reicht noch nicht.',
      )
    }
    throw new Error(`Beitritt fehlgeschlagen: ${error.message}`)
  }
}

export async function leaveMeetup(meetupId: string, userId: string): Promise<void> {
  if (!supabase) throw new Error('Nur mit Supabase-Konfiguration verfügbar.')
  const { error } = await supabase
    .from('meetup_participants')
    .delete()
    .eq('meetup_id', meetupId)
    .eq('user_id', userId)
  if (error) throw new Error(`Absagen fehlgeschlagen: ${error.message}`)
}

export async function getMyMeetups(userId: string): Promise<Meetup[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('meetup_participants')
    .select('meetup:meetups(*, host:profiles(*))')
    .eq('user_id', userId)
  if (error) throw new Error(`Meine Meetups laden fehlgeschlagen: ${error.message}`)
  return (data ?? [])
    .map((r) => (r as unknown as { meetup: Meetup }).meetup)
    .filter(Boolean)
}

/**
 * Feedback nach einem Meetup. `feltSafe` ist das wichtigste Signal der
 * Plattform — es fließt in den Trust-Tier des Gastes ein.
 */
export async function submitMeetupFeedback(
  meetupId: string,
  userId: string,
  feedback: { attended: boolean; feltSafe: boolean; ratingHost?: number; feedback?: string },
): Promise<void> {
  if (!supabase) throw new Error('Nur mit Supabase-Konfiguration verfügbar.')
  const { error } = await supabase
    .from('meetup_participants')
    .update({
      attended: feedback.attended,
      felt_safe: feedback.feltSafe,
      rating_host: feedback.ratingHost ?? null,
      feedback: feedback.feedback ?? null,
    })
    .eq('meetup_id', meetupId)
    .eq('user_id', userId)
  if (error) throw new Error(`Feedback konnte nicht gespeichert werden: ${error.message}`)
}

/** Safety-Check-in: "Ich bin da" — mit grober Area, niemals GPS. */
export async function safetyCheckIn(
  userId: string,
  areaLabel: string,
  meetupId?: string,
  note?: string,
): Promise<void> {
  if (!supabase) throw new Error('Nur mit Supabase-Konfiguration verfügbar.')
  const { error } = await supabase
    .from('safety_checkins')
    .insert({
      user_id: userId,
      area_label: areaLabel,
      meetup_id: meetupId ?? null,
      note: note ?? null,
    })
  if (error) throw new Error(`Check-in fehlgeschlagen: ${error.message}`)
}

// ---------------------------------------------------------------------------
// Sicherheit: Blockieren, Melden
// ---------------------------------------------------------------------------

export async function blockUser(blockerId: string, blockedId: string, reason = 'other'): Promise<void> {
  if (!supabase) throw new Error('Nur mit Supabase-Konfiguration verfügbar.')
  const { error } = await supabase
    .from('blocks')
    .upsert({ blocker_id: blockerId, blocked_id: blockedId, reason })
  if (error) throw new Error(`Blockieren fehlgeschlagen: ${error.message}`)
}

export async function unblockUser(blockerId: string, blockedId: string): Promise<void> {
  if (!supabase) throw new Error('Nur mit Supabase-Konfiguration verfügbar.')
  const { error } = await supabase
    .from('blocks')
    .delete()
    .eq('blocker_id', blockerId)
    .eq('blocked_id', blockedId)
  if (error) throw new Error(`Blockierung aufheben fehlgeschlagen: ${error.message}`)
}

// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------

export interface Conversation {
  id: string
  created_at: string
  otherUser?: Profile
  lastMessage?: string
  lastMessageAt?: string
  unreadCount?: number
}

/**
 * Findet eine bestehende 1:1-Konversation oder legt sie an.
 * Statt `INSERT ... ON CONFLICT` nutzen wir eine doppelte Prüfung, weil es
 * keinen UNIQUE-Constraint auf (a,b) gibt (die Reihenfolge ist beliebig).
 */
export async function getOrCreateConversation(
  userId: string,
  otherUserId: string,
): Promise<string | null> {
  if (!supabase) return null

  // Alle Konversationen des Nutzers laden
  const { data: mine } = await supabase
    .from('conversation_members')
    .select('conversation_id')
    .eq('user_id', userId)

  const convIds = (mine ?? []).map((r) => (r as { conversation_id: string }).conversation_id)
  if (convIds.length === 0) return createConversation(userId, otherUserId)

  // Prüfen, ob eine davon auch die andere Person enthält
  const { data: shared } = await supabase
    .from('conversation_members')
    .select('conversation_id')
    .in('conversation_id', convIds)
    .eq('user_id', otherUserId)

  const sharedIds = new Set(
    (shared ?? []).map((r) => (r as { conversation_id: string }).conversation_id),
  )
  const existing = convIds.find((id) => sharedIds.has(id))
  if (existing) return existing

  return createConversation(userId, otherUserId)
}

async function createConversation(userId: string, otherUserId: string): Promise<string | null> {
  if (!supabase) return null
  const { data: conv, error: convErr } = await supabase
    .from('conversations')
    .insert({})
    .select()
    .single()
  if (convErr || !conv) return null

  const convId = (conv as { id: string }).id
  const { error } = await supabase
    .from('conversation_members')
    .insert([
      { conversation_id: convId, user_id: userId },
      { conversation_id: convId, user_id: otherUserId },
    ])
  if (error) return null
  return convId
}

export async function getConversations(userId: string): Promise<Conversation[]> {
  if (!supabase) return []

  const { data: members } = await supabase
    .from('conversation_members')
    .select('conversation_id')
    .eq('user_id', userId)

  const convIds = (members ?? []).map((r) => (r as { conversation_id: string }).conversation_id)
  if (convIds.length === 0) return []

  const { data: convs } = await supabase
    .from('conversations')
    .select('*')
    .in('id', convIds)
    .order('updated_at', { ascending: false })

  // Gegenstelle + letzte Nachricht laden
  const result: Conversation[] = []
  for (const c of (convs ?? []) as Conversation[]) {
    const { data: otherMembers } = await supabase
      .from('conversation_members')
      .select('user_id')
      .eq('conversation_id', c.id)
      .neq('user_id', userId)

    const otherId = (otherMembers ?? [])[0]?.user_id as string | undefined
    let otherUser: Profile | undefined
    if (otherId) {
      const { data: p } = await supabase.from('profiles').select('*').eq('id', otherId).maybeSingle()
      otherUser = (p as Profile) ?? undefined
    }

    const { data: last } = await supabase
      .from('messages')
      .select('body, created_at')
      .eq('conversation_id', c.id)
      .order('created_at', { ascending: false })
      .limit(1)

    result.push({
      ...c,
      otherUser,
      lastMessage: (last ?? [])[0]?.body,
      lastMessageAt: (last ?? [])[0]?.created_at,
    })
  }
  return result
}

export async function getMessages(conversationId: string, limit = 100) {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('messages')
    .select('*, sender:profiles(*)')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
    .limit(limit)
  if (error) throw new Error(`Nachrichten laden fehlgeschlagen: ${error.message}`)
  return data ?? []
}

export interface SendMessageResult {
  ok: boolean
  /** Feedback, das dem Sender hilft, die eigene Nachricht einzuordnen. */
  nudge?: 'first_contact' | 'link' | 'ok'
}

export async function sendMessage(
  conversationId: string,
  senderId: string,
  body: string,
): Promise<SendMessageResult> {
  if (!supabase) return { ok: false }

  const text = body.trim()
  if (!text) return { ok: false }
  if (text.length > 4000) return { ok: false }

  // Einfache Heuristik: Erster Kontakt sollte Kontext haben
  const { count } = await supabase
    .from('messages')
    .select('id', { count: 'exact', head: true })
    .eq('conversation_id', conversationId)

  const isFirst = (count ?? 0) === 0
  const hasLink = /(https?:\/\/|www\.)/i.test(text)

  const { error } = await supabase
    .from('messages')
    .insert({ conversation_id: conversationId, sender_id: senderId, body: text })

  if (error) return { ok: false }

  await supabase
    .from('conversations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', conversationId)

  return {
    ok: true,
    nudge: isFirst ? 'first_contact' : hasLink ? 'link' : 'ok',
  }
}

export async function deleteMessage(messageId: string, senderId: string): Promise<void> {
  if (!supabase) return
  await supabase
    .from('messages')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', messageId)
    .eq('sender_id', senderId)
}

export async function reportUser(
  reporterId: string,
  reportedId: string,
  category: string,
  details?: string,
): Promise<void> {
  if (!supabase) throw new Error('Nur mit Supabase-Konfiguration verfügbar.')
  const { error } = await supabase
    .from('reports')
    .insert({ reporter_id: reporterId, reported_id: reportedId, category, details: details ?? null })
  if (error) throw new Error(`Meldung fehlgeschlagen: ${error.message}`)
}



export async function toggleSaveSpot(userId: string, spotId: string, saved: boolean): Promise<void> {
  if (!supabase) throw new Error('Nur mit Supabase-Konfiguration verfügbar.')
  if (saved) {
    const { error } = await supabase.from('saved_spots').upsert({ user_id: userId, spot_id: spotId })
    if (error) throw new Error(`Speichern fehlgeschlagen: ${error.message}`)
  } else {
    const { error } = await supabase
      .from('saved_spots')
      .delete()
      .eq('user_id', userId)
      .eq('spot_id', spotId)
    if (error) throw new Error(`Entfernen fehlgeschlagen: ${error.message}`)
  }
}


// ---------------------------------------------------------------------------
// Follows
// ---------------------------------------------------------------------------

export async function follow(followerId: string, followeeId: string): Promise<void> {
  if (!supabase) throw new Error('Nur mit Supabase-Konfiguration verfügbar.')
  const { error } = await supabase
    .from('follows')
    .upsert({ follower_id: followerId, followee_id: followeeId })
  if (error) throw new Error(`Folgen fehlgeschlagen: ${error.message}`)
}

export async function unfollow(followerId: string, followeeId: string): Promise<void> {
  if (!supabase) throw new Error('Nur mit Supabase-Konfiguration verfügbar.')
  const { error } = await supabase
    .from('follows')
    .delete()
    .eq('follower_id', followerId)
    .eq('followee_id', followeeId)
  if (error) throw new Error(`Entfolgen fehlgeschlagen: ${error.message}`)
}

export async function getFollowIds(userId: string): Promise<string[]> {
  if (!supabase) return []
  const { data } = await supabase.from('follows').select('followee_id').eq('follower_id', userId)
  return (data ?? []).map((r) => (r as { followee_id: string }).followee_id)
}

export async function getBlockedIds(userId: string): Promise<string[]> {
  if (!supabase) return []
  const { data } = await supabase.from('blocks').select('blocked_id').eq('blocker_id', userId)
  return (data ?? []).map((r) => (r as { blocked_id: string }).blocked_id)
}
