/**
 * Das Local-Routen-Modell.
 *
 * Kernidee: Ein Local stellt seine *Lieblingsorte* als eine benannte Route
 * zusammen. Der Reisende folgt ihr, markiert Stationen und bekommt am Ende
 * einen Badge, der den Routennamen des Locals traegt.
 *
 * Zwei Regeln bestimmen dieses Modell und sollten nicht aufgeweicht werden:
 *
 * 1. Jede Station ist ein realer Ort mit Koordinaten. Der Datensatz erlaubt
 *    keine Station ohne `lat`/`lng` — sonst waere die Route eine Abstraktion
 *    ohne Nutzen, und genau dann erzeugen Nutzer Wegwerf-Inhalte.
 *
 * 2. Fotos erscheinen nicht sofort. Sie tragen `visibleAt`; erst ab diesem
 *    Zeitpunkt sind sie ueberhaupt abrufbar. Die Verzoegerung schuetzt vor
 *    Personen, die den Reisenden bei der Aufnahme beobachten. Sie ist *kein*
 *    Anonymisierungsschutz — die Aufgabe `stripExif` in
 *    `src/lib/photoSafety.ts` ist dafuer zustaendig.
 */

import type { TrustLevel } from './trust'

export type RouteMood = 'gemütlich' | 'verwirrend' | 'schnell' | 'romantisch' | 'hungrig'

export interface RouteStop {
  id: string
  routeId: string
  /** 1-basiert, gibt die Reihenfolge auf der Karte vor. */
  order: number
  title: string
  /** Was der Local gerade *hier* empfiehlt — der eigentliche Inhalt. */
  note: string
  lat: number
  lng: number
  /** Optional: Verknuepfung auf einen bereits verifizierten Ort. */
  secretSpotId?: string
  /** Wie lange der Reisende realistisch braucht, in Minuten. */
  dwellMinutes: number
}

export interface RoutePhoto {
  id: string
  routeId: string
  stopId: string
  authorHandle: string
  /** Leeres Array, solange die Verzoegerung laeuft. */
  urls: string[]
  caption: string
  createdAt: string
  /**
   * Wann das Foto oeffentlich wird.
   *
   * Zweck der Frist ist der Schutz des *Quest-Folgers*: sie verhindert, dass
   * aus dem Veroeffentlichungsmuster geschlossen wird, wo sich gerade jemand
   * aufhält. Deshalb ist `visibleAt` clientseitig UND in der RLS-Policy
   * erzwungen — ein reiner Client-Filter waere umgehbar.
   */
  visibleAt: string
  /** Wurden Gesichter verschwommen? */
  facesBlurred: boolean
  /**
   * Sind Personen erkennbar? Dann laeuft ab `expiresAt` ein harter Ablauf —
   * langlebiges Personenmaterial ist das eigentliche Risiko, nicht die Wartezeit.
   */
  hasPerson: boolean
  /** Null bei personenfreien Fotos. */
  expiresAt: string | null
  status: 'in_ delay' | 'visible' | 'flagged' | 'removed'
}

export interface LocalRoute {
  id: string
  /** Der Name, den der Local selbst vergibt — er traegt spaeter den Badge. */
  name: string
  /** Wer sie zusammengestellt hat. */
  authorHandle: string
  authorName: string
  authorInitials: string
  authorTrustLevel: TrustLevel
  /** Zertifiziert, ob der Autor ein Local ist oder sich als einer ausweist. */
  authorIsLocal: boolean
  city: string
  country: string
  countryCode: string
  blurb: string
  mood: RouteMood
  /** Tags wie 'sundowner', 'nur-zu-fuss', 'mit-kindern'. */
  tags: string[]
  stops: RouteStop[]
  photos: RoutePhoto[]
  /** Zustimmung, solange nicht alle Stationen abgehakt sind. */
  upvotes: number
  downvotes: number
  hasUpvoted: boolean
  /** Abonniert: neue Stationen oder Fotos erscheinen als Hinweis. */
  following: boolean
  completions: number
  createdAt: string
  /** Naechste Station, die der angemeldete Nutzer noch offen hat. */
  nextStopId?: string
  completedStopIds: string[]
}

/** Fortschritt 0..1 — treibt den Riss in der Schatzkarte. */
export function routeProgress(route: LocalRoute): number {
  if (route.stops.length === 0) return 0
  const done = route.stops.filter(s => route.completedStopIds.includes(s.id)).length
  return done / route.stops.length
}

export function isRouteComplete(route: LocalRoute): boolean {
  return route.stops.length > 0 && route.completedStopIds.length >= route.stops.length
}

/**
 * Der Badge-Name. Bewusst *nicht* generisch ("Route abgeschlossen"),
 * sondern mit Namen des Locals und der Stadt — das ist der Teil, der die
 * Community besitzbar macht.
 */
export function routeBadgeName(route: LocalRoute): string {
  return `${route.name} — ${route.authorName.split(' ')[0]}, ${route.city}`
}

export function routeBadgeMotif(route: LocalRoute): string {
  const n = route.stops.length
  return `${n} Stationen · ${route.mood}`
}

/** Gesamtdauer, aufgerundet auf halbe Stunden fuer die Anzeige. */
export function routeDurationMinutes(route: LocalRoute): number {
  const total = route.stops.reduce((sum, s) => sum + s.dwellMinutes, 0)
  return Math.ceil(total / 30) * 30
}

export function formatRouteDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m} Min`
  if (m === 0) return `${h} Std`
  return `${h} Std ${m} Min`
}

/**
 * Verbleibende Verzoegerung fuer die Anzeige. Gibt null zurueck, sobald das
 * Foto sichtbar ist.
 */
export function photoCooldownMinutes(photo: RoutePhoto, now = Date.now()): number | null {
  const at = new Date(photo.visibleAt).getTime()
  if (!Number.isFinite(at)) return null
  const left = Math.ceil((at - now) / 60000)
  return left > 0 ? left : null
}
