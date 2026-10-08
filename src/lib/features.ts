/**
 * Feature-Flags.
 *
 * POD/Merch ist ab 2026-10-06 Produktentscheidung des Owners:
 * "vorerst verbergen, erst später wenn Nutzer da sind öffnen und einstellen."
 *
 * - Default: AUS. Ohne Env-Var wird der komplette Shop (Merch-Kategorie,
 *   Bestell-Sektion, Badge-Bestellmodal, Pricing-Rabatt) nicht gerendert.
 * - Öffnen: `VITE_POD_ENABLED=true` in die Vercel-Env eintragen + Deploy —
 *   keine Codeänderung nötig.
 * - Die API-Endpoints (`api/create-merch-checkout-session.js`,
 *   `api/pod-orders.js`) bleiben unverändert liegen; ohne UI-Einstieg
 *   erreicht sie niemand.
 *
 * Bewusst ein Build-Zeit-Flag (import.meta.env), kein Laufzeit-Zustand:
 * Versteckt heißt, dass auch kein tote Buttons/Links im DOM landen.
 */
export const POD_ENABLED = import.meta.env.VITE_POD_ENABLED === 'true'
