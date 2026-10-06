/**
 * Dünner Analytics-Wrapper (SNT-214 / T-104).
 *
 * Regeln aus dem Plan:
 * - Kein Vendor-SDK im Component-Code — Components rufen nur `track()` auf.
 * - Plausible ist cookieless und DSGVO-freundlich; das Script wird erst
 *   geladen, wenn eine Domain konfiguriert ist (VITE_PLAUSIBLE_DOMAIN).
 * - **Stumm solange die Domainentscheidung (SNT-108) offen ist.** Ohne Env-Var
 *   passiert nichts — kein Request, kein Script, kein Konsolenfehler. Das ist
 *   beabsichtigt: auf der Vercel-URL soll nichts an eine fremde Property
 *   gemeldet werden, bevor die echte Domain steht.
 * - Keine GPS-Koordinaten, keine exakten Zeiten mitschicken. Die Event-Namen
 *   sagen, *was* passiert ist — nicht *wo* genau und *wann*.
 */

/** Die 12 Events aus T-104. Neu? Ergänzen und unten dokumentieren. */
export type AnalyticsEvent =
  | 'page_view'
  | 'signup_started'
  | 'signup_completed'
  | 'login_completed'
  | 'spot_viewed'
  | 'spot_submitted'
  | 'spot_claimed'
  | 'match_completed'
  | 'concierge_query'
  | 'meetup_joined'
  | 'badge_earned'
  | 'share_clicked'

/** Erlaubte Eigenschaften: primitiv, ohne Standort- oder Zeitstempel. */
export type AnalyticsProps = Record<string, string | number | boolean>

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: AnalyticsProps }) => void
    __sntPlausibleLoaded?: boolean
  }
}

const DOMAIN = import.meta.env.VITE_PLAUSIBLE_DOMAIN as string | undefined
/** Optional: eigener Plausible-Host (self-hosted). Standard ist plausible.io. */
const HOST = (import.meta.env.VITE_PLAUSIBLE_HOST as string | undefined) || 'https://plausible.io'

/** Lädt das Plausible-Script genau einmal. Ohne Domain nie aufgerufen. */
function ensureScript(): void {
  if (window.__sntPlausibleLoaded) return
  window.__sntPlausibleLoaded = true
  const script = document.createElement('script')
  script.defer = true
  script.dataset.domain = DOMAIN!
  script.src = `${HOST}/js/script.js`
  document.head.appendChild(script)
}

/**
 * Sendet ein Event. Ohne konfigurierte Domain ein bewusster No-Op.
 *
 * @param event  einer der 12 Events oben
 * @param props  optionale Eigenschaften — nie GPS, nie Uhrzeit
 */
export function track(event: AnalyticsEvent, props?: AnalyticsProps): void {
  if (!DOMAIN) return // kein Konto, keine Domain → keine Messung (SNT-108 offen)
  try {
    ensureScript()
    window.plausible?.(event, props ? { props } : undefined)
  } catch {
    // Messung darf die App nie stören.
  }
}

/** Testhelfer: zeigt, ob überhaupt gemessen wird. */
export function isAnalyticsConfigured(): boolean {
  return Boolean(DOMAIN)
}