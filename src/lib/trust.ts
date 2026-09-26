/**
 * Trust & Safety — zentrale Logik.
 *
 * Grundsatz: Vertrauen wird durch konkrete, nachweisbare Handlungen aufgebaut —
 * nicht durch ein Formular, das man ausfüllt, sondern durch Dinge, die man tut.
 *
 * Die Stufen (gespiegelt in `supabase/schema.sql`, Teil 5):
 *
 *   Stufe        Punkte  Was du darfst
 *   ───────────  ──────  ────────────────────────────────────────────
 *   new              0  stöbern, lesen, sich registrieren
 *   member           2  volles Profil, Spots einreichen, chatten
 *   trusted          5  Meetups beitreten
 *   anchor           9  eigene Meetups ausrichten
 *
 * Bewusste Entscheidung: Es gibt KEINEN Zwang zu Ausweis, Selfie oder Telefon.
 * - E-Mail ist durch die Registrierung immer bestätigt (kostenlos, 0 Klicks).
 * - Telefon ist optional und schaltet nur Bonus-Funktionen frei.
 * - Ausweis ist NUR für die Host-Rolle relevant, weil man dann Verantwortung
 *   für eine Gruppe im öffentlichen Raum trägt. Auch dort freiwillig.
 *
 * Grundsatz dahinter: Wer zu früh zur Verifikation gezwungen wird, meldet sich
 * gar nicht erst an. Lieber weniger, aber echte Nutzer.
 */

// ---------------------------------------------------------------------------
// Typen
// ---------------------------------------------------------------------------

export type TrustTier = 'new' | 'member' | 'trusted' | 'anchor'

export type TrustEventType =
  | 'email_verified'
  | 'profile_completed'
  | 'photo_added'
  | 'spot_submitted'
  | 'spot_confirmed'
  | 'hosted_meetup'
  | 'attended_meetup'
  | 'positive_feedback'
  | 'phone_verified'
  | 'id_verified'

export interface TrustEventDefinition {
  type: TrustEventType
  label: string
  points: number
  description: string
  /** Wie viele Nutzer diese Stufe typischerweise haben. */
  typical: string
}

export interface TrustTierDefinition {
  tier: TrustTier
  label: string
  minPoints: number
  icon: string
  perks: string[]
  color: string
}

// ---------------------------------------------------------------------------
// Gewichtung — identisch zu `trust_event_weight()` in der Datenbank
// ---------------------------------------------------------------------------

export const TRUST_EVENTS: TrustEventDefinition[] = [
  {
    type: 'email_verified',
    label: 'E-Mail bestätigt',
    points: 1,
    description: 'Passiert automatisch bei der Registrierung.',
    typical: '100 %',
  },
  {
    type: 'profile_completed',
    label: 'Profil vervollständigt',
    points: 1,
    description: 'Name, Stadt und ein paar Worte über dich.',
    typical: '85 %',
  },
  {
    type: 'photo_added',
    label: 'Profilbild hochgeladen',
    points: 1,
    description: 'Ein echtes Gesicht schafft Vertrauen — freiwillig.',
    typical: '60 %',
  },
  {
    type: 'spot_submitted',
    label: 'Ersten Spot eingereicht',
    points: 1,
    description: 'Du hast der Community etwas gegeben.',
    typical: '25 %',
  },
  {
    type: 'spot_confirmed',
    label: 'Spot von anderen bestätigt',
    points: 2,
    description: 'Jemand hat deine Angabe geprüft.',
    typical: '20 %',
  },
  {
    type: 'attended_meetup',
    label: 'Erstes Meetup besucht',
    points: 2,
    description: 'Du warst persönlich da.',
    typical: '15 %',
  },
  {
    type: 'positive_feedback',
    label: '"Ich fühlte mich sicher" bestätigt',
    points: 1,
    description: 'Das wichtigste Signal der ganzen Plattform.',
    typical: '90 %',
  },
  {
    type: 'hosted_meetup',
    label: 'Erstes Meetup ausgerichtet',
    points: 3,
    description: 'Du hast Menschen eingeladen.',
    typical: '5 %',
  },
  {
    type: 'phone_verified',
    label: 'Telefon bestätigt',
    points: 1,
    description: 'Freiwillig. Macht Kontaktaufnahme verlässlicher.',
    typical: '15 %',
  },
  {
    type: 'id_verified',
    label: 'Ausweis geprüft',
    points: 2,
    description: 'Nur relevant, wenn du eigene Meetups ausrichtest.',
    typical: '2 %',
  },
]



// ---------------------------------------------------------------------------
// Stufen
// ---------------------------------------------------------------------------

export const TRUST_TIERS: TrustTierDefinition[] = [
  {
    tier: 'new',
    label: 'Neu dabei',
    minPoints: 0,
    icon: '🌱',
    color: '#8A9AAA',
    perks: [
      'Alles durchstöbern und lesen',
      'Profile anderer ansehen',
      'Secret Spots entdecken',
    ],
  },
  {
    tier: 'member',
    label: 'Mitglied',
    minPoints: 2,
    icon: '🤝',
    color: '#C9A84C',
    perks: [
      'Alles aus „Neu dabei"',
      'Eigene Spots einreichen',
      'Nachrichten schreiben',
      'Profile vervollständigen',
    ],
  },
  {
    tier: 'trusted',
    label: 'Vertrauensvoll',
    minPoints: 5,
    icon: '🛡️',
    color: '#10B981',
    perks: [
      'Alles aus „Mitglied"',
      'An Meetups teilnehmen',
      'Spots von anderen bestätigen',
      'Sicherheits-Feedback geben',
    ],
  },
  {
    tier: 'anchor',
    label: 'Anker',
    minPoints: 9,
    icon: '⚓',
    color: '#F59E0B',
    perks: [
      'Alles aus „Vertrauensvoll"',
      'Eigene Meetups ausrichten',
      'In der Stadt als Local gelten',
    ],
  },
]

// Reihenfolge der Stufen (für "mindestens so hoch" Vergleiche)
const TIER_ORDER: TrustTier[] = ['new', 'member', 'trusted', 'anchor']

/** Punkte → Stufe. Spiegelt `compute_trust_tier()` in der Datenbank. */
export function computeTrustTier(points: number): TrustTier {
  if (points >= 9) return 'anchor'
  if (points >= 5) return 'trusted'
  if (points >= 2) return 'member'
  return 'new'
}

/** Gewicht eines Events. Spiegelt `trust_event_weight()` in der Datenbank. */
export function trustEventWeight(type: TrustEventType): number {
  return TRUST_EVENTS.find((e) => e.type === type)?.points ?? 0
}

/** Punkte aus einer Liste von Events. */
export function totalTrustPoints(events: TrustEventType[]): number {
  return events.reduce((sum, e) => sum + trustEventWeight(e), 0)
}

/** Stufendefinition für einen Tier-Namen. */
export function tierInfo(tier: TrustTier): TrustTierDefinition {
  return TRUST_TIERS.find((t) => t.tier === tier) ?? TRUST_TIERS[0]
}

/** true, wenn `tier` mindestens so hoch ist wie `minimum`. */
export function meetsTier(tier: TrustTier, minimum: TrustTier): boolean {
  return TIER_ORDER.indexOf(tier) >= TIER_ORDER.indexOf(minimum)
}

/** Die nächsten Schritte, die jemanden zur nächsten Stufe bringen. */
export function nextSteps(points: number): {
  tier: TrustTierDefinition
  needed: number
  actions: TrustEventDefinition[]
} {
  const current = computeTrustTier(points)
  const idx = TIER_ORDER.indexOf(current)
  const nextTier = TRUST_TIERS[idx + 1] ?? TRUST_TIERS[TRUST_TIERS.length - 1]
  const needed = Math.max(0, nextTier.minPoints - points)

  // Die preiswerftest sinnvollen Schritte zuerst
  const actions = TRUST_EVENTS.filter(
    (e) => e.points <= needed && e.type !== 'email_verified',
  ).slice(0, 3)

  return { tier: nextTier, needed, actions }
}

// ---------------------------------------------------------------------------
// Sicherheits-Textbausteine
// ---------------------------------------------------------------------------

/**
 * Der Offline-Disclaimer. Muss in JEDEM Kontext stehen, in dem sich zwei
 * Menschen zum ersten Mal treffen könnten. Nicht verhandelbar.
 */
export const OFFLINE_DISCLAIMER =
  "Scratch'n'Travel bringt dich mit Menschen zusammen — die Treffen selbst finden " +
  'offline und auf eigene Verantwortung statt. Wir vermitteln Kontakt, wir vermitteln ' +
  'keine Sicherheit. Bitte triff dich an einem öffentlichen Ort, teile jemandem deinen ' +
  'Standort mit und achte auf dein Gefühl: Du kannst jederzeit gehen, ohne dich zu ' +
  'rechtfertigen.'

/** Kurze Variante für kompakte Flächen. */
export const OFFLINE_DISCLAIMER_SHORT =
  'Treffen finden offline und auf eigene Verantwortung statt. Triff dich öffentlich ' +
  'und vertraue deinem Gefühl.'

/** Verhaltensregeln — vor dem ersten Meetup bestätigen. */
export const MEETUP_CODE_OF_CONDUCT: string[] = [
  'Ich respektiere andere Grenzen. Ein "Nein" ist ein vollständiger Satz.',
  'Keine sexualisierten Anfragen, kein Objektivieren. Diese Plattform ist für Freundschaft, Kultur und Hobby.',
  'Wer sich unbehaglich fühlt, geht. Ohne Diskussion, ohne Rechtfertigung.',
  'Kein Alkohol- oder Drogenkonsum als Voraussetzung für ein Treffen.',
  'Ich nutze kein Fake-Profil und gebe keine falschen Angaben zu meiner Person an.',
  'Wenn ich etwas beobachte, das nicht stimmt, melde ich es — auch wenn es unangenehm ist.',
]

/** Checkliste vor dem ersten Treffen. */
export const SAFETY_CHECKLIST: { icon: string; title: string; text: string }[] = [
  {
    icon: '📍',
    title: 'Öffentlicher Ort',
    text: 'Café, Markt, Bibliothek, Park — nie eine Privatwohnung beim ersten Treffen.',
  },
  {
    icon: '👥',
    title: 'Jemandem Bescheid sagen',
    text: 'Schick einer vertrauten Person Ort und Zeit. Frag, ob sie in einer Stunde anruft.',
  },
  {
    icon: '📱',
    title: 'Check-in nutzen',
    text: 'Markiere im Meetup "Ich bin da". Eine Begleitung sieht deinen Status.',
  },
  {
    icon: '💬',
    title: 'Erst im Chat klären',
    text: 'Frag nach Interessen, bevor du zusagst. Passen die Antworten nicht zum Profil: Absage.',
  },
  {
    icon: '🧭',
    title: 'Eigene Heimfahrt',
    text: 'Organisiere deinen Weg zurück selbst. Dann kannst du jederzeit gehen, ohne Stress.',
  },
  {
    icon: '🚨',
    title: 'Bei Unsicherheit: sofort melden',
    text: 'Der Melde-Button ist in jedem Chat sichtbar. Du bekommst keine Personalien.',
  },
]

/** Was die Plattform zusichert — und was ausdrücklich nicht. */
export const SAFETY_PROMISES: { we: string; notWe: string }[] = [
  {
    we: 'Du kannst jederzeit blockieren und melden — ohne Begründung.',
    notWe: 'Wir können nicht garantieren, dass niemand dir Böses will.',
  },
  {
    we: 'Deine Adresse wird nie an andere weitergegeben.',
    notWe: 'Wir können ein Treffen nicht überwachen.',
  },
  {
    we: 'Du siehst vor einem Treffen, ob jemand als Local markiert ist.',
    notWe: 'Wir können keine Echtheitsgarantie für Profile geben.',
  },
  {
    we: 'Nach einem Treffen kannst du sagen, ob du dich sicher gefühlt hast.',
    notWe: 'Wir können keinen Background-Check für alle durchführen.',
  },
]

/** Meldungs-Kategorien für den Report-Dialog. */
export const REPORT_CATEGORIES: { value: string; label: string; hint: string }[] = [
  { value: 'harassment', label: 'Belästigung', hint: 'Beleidigungen, wiederholte unerwünschte Nachrichten' },
  { value: 'scam', label: 'Betrug', hint: 'Geld verlangt, falsche Angebote, Phishing' },
  { value: 'impersonation', label: 'Fake-Profil', hint: 'Jemand gibt sich als andere Person aus' },
  { value: 'unsafe_meetup', label: 'Unsicheres Treffen', hint: 'Verhalten bei oder nach einem Meetup' },
  { value: 'inappropriate_content', label: 'Unangemessene Inhalte', hint: 'Sexuelle oder grenzwertige Inhalte' },
  { value: 'spam', label: 'Spam', hint: 'Werbung, Massen-Nachrichten' },
  { value: 'other', label: 'Etwas anderes', hint: 'Passt nichts davon' },
]

/** Häufige Warnsignale — hilfreich beim Einordnen. */
export const RED_FLAGS: string[] = [
  'Will sofort Geld oder Kauf über eine App',
  'Schlägt ein Treffen sofort an einem privaten Ort vor',
  'Schreibt widersprüchlich, verlangt schnelle Entscheidung',
  'Profilbild wirkt übernommen, Stories wirken kopiert',
  'Lenkt das Gespräch sofort auf Körper oder Äußeres ab',
  'Will dich von der Plattform weg zu einer anderen App ziehen',
  'Weigert sich, ein Foto mitzuschicken oder ruft selbst an',
]


/** Fortschritt zur nächsten Stufe, 0..1. */
export function tierProgress(points: number): number {
  const current = computeTrustTier(points)
  const idx = TIER_ORDER.indexOf(current)
  if (idx >= TRUST_TIERS.length - 1) return 1
  const cur = TRUST_TIERS[idx]
  const next = TRUST_TIERS[idx + 1]
  const span = next.minPoints - cur.minPoints
  if (span <= 0) return 1
  return Math.min(1, Math.max(0, (points - cur.minPoints) / span))
}

