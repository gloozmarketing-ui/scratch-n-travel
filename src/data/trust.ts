/**
 * Vertrauensstufen.
 *
 * Grundidee: Wer Empfehlungen ausspricht, muss nachweisbar vor Ort gewesen
 * sein. Deshalb ist `certifiedStops` der eigentliche Taktgeber — jede Stufe
 * verlangt eine Anzahl *verifizierter* Orte, nicht einfach verbrachte Zeit.
 *
 * `routeLimit` ist bewusst hart gedeckelt: ohne Deckel entstehen schnell
 * hundert Wegwerf-Routen, die niemand pflegt. Der Wert gilt alsaehren
 * gleichzeitigen *veroeffentlichten* Routen, nicht als Gesamtlaufzeit.
 */

export type TrustLevel = 0 | 1 | 2 | 3 | 4

export interface TrustTier {
  level: TrustLevel
  name: string
  /** Wie viele Orte dieser Stufe selbst bestaetigt und verifiziert wurden. */
  certifiedStops: number
  /** Wie viele Empfehlungen sie aussprechen darf. */
  routeLimit: number
  /** Frueheste Stufe, ab der eine Route sichtbar publiziert wird. */
  canPublishRoute: boolean
  /** Ob die Stufe in der Oeffentlichkeit als Absender auftaucht. */
  publicBadge: boolean
  blurb: string
}

export const TRUST_TIERS: Record<TrustLevel, TrustTier> = {
  0: {
    level: 0,
    name: 'Reisende',
    certifiedStops: 0,
    routeLimit: 0,
    canPublishRoute: false,
    publicBadge: false,
    blurb: 'Du sammelst Erfahrung. Empfehlungen gibst du noch keine ab.',
  },
  1: {
    level: 1,
    name: 'Neugierige',
    certifiedStops: 1,
    routeLimit: 3,
    canPublishRoute: true,
    publicBadge: true,
    blurb: 'Ein bestaetigter Ort genug. Deine Routen tragen deinen Namen.',
  },
  2: {
    level: 2,
    name: 'Kundschafterin',
    certifiedStops: 5,
    routeLimit: 5,
    canPublishRoute: true,
    publicBadge: true,
    blurb: 'Du kennst Orte, die nicht auf Karten stehen. Deine Routen zaehlen.',
  },
  3: {
    level: 3,
    name: 'Wegfuehrerin',
    certifiedStops: 12,
    routeLimit: 10,
    canPublishRoute: true,
    publicBadge: true,
    blurb: 'Deine Routen werden bevorzugt angezeigt und uebernehmen Landmarken.',
  },
  4: {
    level: 4,
    name: 'Schatzkaertin',
    certifiedStops: 25,
    routeLimit: 30,
    canPublishRoute: true,
    publicBadge: true,
    blurb: 'Deine Route ist eine offizielle Landmarke der Stadt.',
  },
}

export const TRUST_ORDER: TrustLevel[] = [0, 1, 2, 3, 4]

/**
 * Bestimmt die Stufe aus der Zahl bestaetigter Orte.
 * Bewusst *nicht* kumulativ ueber Stufen hinweg: 25 Orte ergeben direkt
 * Stufe 4, nicht Stufe 1 plus Bonus.
 */
export function tierForCertifiedStops(count: number): TrustLevel {
  const safe = Math.max(0, Math.floor(count || 0))
  let result: TrustLevel = 0
  for (const level of TRUST_ORDER) {
    if (safe >= TRUST_TIERS[level].certifiedStops) result = level
  }
  return result
}

/** Naechste Stufe und der noch fehlgende Abstand — fuer Fortschrittsbalken. */
export function nextTier(count: number): {
  current: TrustTier
  next: TrustTier | null
  remaining: number
  progress: number
} {
  const level = tierForCertifiedStops(count)
  const current = TRUST_TIERS[level]
  if (level === 4) {
    return { current, next: null, remaining: 0, progress: 1 }
  }
  const next = TRUST_TIERS[(level + 1) as TrustLevel]
  const span = next.certifiedStops - current.certifiedStops
  const done = count - current.certifiedStops
  return {
    current,
    next,
    remaining: Math.max(0, next.certifiedStops - count),
    progress: span > 0 ? Math.min(1, Math.max(0, done / span)) : 1,
  }
}

/** Zentrales Ergebnis der Freigabepruefung fuer eine Route. */
export interface TrustVerdict {
  allowed: boolean
  tier: TrustTier
  /** Was genau fehlt — als Text, den die UI direkt anzeigen kann. */
  reason: string
  /** Verbleibende freie Routen-Slots. */
  slotsLeft: number
  /** Das Gesamtkontingent. Die UI zeigt "x von y frei" — ohne dieses Feld
   *  waere die Anzeige nicht nachvollziehbar. */
  limit: number
  /** Falls VIP: um wie viele Slots erweitert. */
  vipBonus: number
}

/**
 * Zentrale Freigabep|pruefung fuer das Publizieren einer Route.
 *
 * Aufrufer sollten das Ergebnis *zeigen*, nicht nur `allowed` nutzen: die
 * Begruendung ist der Teil, der Vertrauen schafft.
 */
export function canPublishRoute(args: {
  certifiedStops: number
  publishedRouteCount: number
  vip: boolean
}): TrustVerdict {
  const tier = TRUST_TIERS[tierForCertifiedStops(args.certifiedStops)]

  // VIP erweitert das Kontingent, ersetzt aber nie die Huerde. Wer nie vor
  // Ort war, darf auch mit Abo keine Empfehlung unter eigenem Namen
  // veroeffentlichen — sonst ist der Badge wertlos.
  const vipBonus = args.vip ? 5 : 0
  const limit = tier.routeLimit + vipBonus
  const slotsLeft = limit - args.publishedRouteCount

  if (!tier.canPublishRoute) {
    return {
      allowed: false,
      tier,
      reason: `Benoetigt mindestens 1 bestaetigten Ort. Du hast ${args.certifiedStops}.`,
      slotsLeft: 0,
      limit,
      vipBonus,
    }
  }
  if (args.publishedRouteCount >= limit) {
    return {
      allowed: false,
      tier,
      // Der VIP-Hinweis erscheint nur, wenn es VIP ueberhaupt gibt — sonst
      // wiesse der gesperrte Nutzer nicht, woran er scheitert.
      reason: args.vip
        ? `Kontingent erschoepft: ${args.publishedRouteCount}/${limit} Routen.`
        : `Kontingent erschoepft: ${args.publishedRouteCount}/${limit} Routen. VIP +${vipBonus} Slots.`,
      slotsLeft: 0,
      limit,
      vipBonus,
    }
  }
  return {
    allowed: true,
    tier,
    reason: `Freigabe als ${tier.name}. Noch ${slotsLeft} von ${limit} Routen frei.`,
    slotsLeft,
    limit,
    vipBonus,
  }
}

/** Kurzer Anzeigename, z. B. fuer Route-Karten. */
export function tierLabel(level: TrustLevel): string {
  return TRUST_TIERS[level].name
}
