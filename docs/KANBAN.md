# KANBAN — Scratch'n'Travel

> **Stand:** 2026-09-25 · **Commit:** `27ba277`
> **Quelle:** `PROJEKT_AUDIT_2026-09-25.md` → `IMPLEMENTATION_PLAN.md`
> **Regel:** Eine Karte wandert nur nach rechts, wenn ihr **VERIFY** erfüllt ist. Nicht nach Gefühl.

## Legende

| Symbol | Bedeutung |
|---|---|
| 🔴 | **P0** Blocker — blockiert alles |
| 🟡 | **P1** Fundament |
| 🟢 | **P2** Wachstum |
| ⚪ | **P3** Later |
| ⏱️ | Aufwand |
| 👤 V | Owner (du) · 👤 A | Agent (Cline) |

---

## Spalten-Übersicht

| Spalte | Karten | Aufwand |
|---|---|---|
| 📋 **BACKLOG** | 72 | ~124 h |
| 🚧 **IN PROGRESS** | 0 | — |
| 👀 **REVIEW** | 0 | — |
| ✅ **DONE** | 0 | — |
| ⛔ **BLOCKED** | 4 | — |
| 🗑️ **WONTFIX / DROP** | 5 | — |

---

## 📋 BACKLOG

### 🔴 P0 — Blocker (diese zuerst, ohne Ausnahme)

| Karte | Task | Aufwand | Verantw. | Abhängig von |
|---|---|---|---|---|
| SNT-101 | 🔐 API-Keys widerrufen + aus Code entfernen | 1 h | 👤 V | — |
| SNT-102 | 📄 `.env.example` anlegen (10 Variablen) | 15 min | 👤 A | — |
| SNT-103 | 🚫 `503 AI_NOT_CONFIGURED` statt 500 bei fehlenden Keys | 1 h | 👤 A | SNT-101 |
| SNT-104 | 🌐 `04.09.2026/index.html`: echte SEO-Metas statt Figma-Placeholder | 1 h | 👤 A | — |
| SNT-105 | 🤖 `site.json` `robots.index` korrigieren | 10 min | 👤 A | SNT-104 |
| SNT-106 | 🏷️ Staging (`-six`) auf `X-Robots-Tag: noindex` | 20 min | 👤 A | SNT-104 |
| SNT-107 | 📖 `robots.txt`: `Disallow: /` → `Allow: /` (+ `/api/`, `/growth/` sperren) | 15 min | 👤 A | — |
| SNT-108 | 🌐 Domain-Entscheidung: `scratchntravel.com` kaufen oder Vercel-URL nutzen | 30 min | 👤 V | — |
| SNT-109 | 🔗 `sitemap.xml` + `canonical` + `og:url` konsistent | 45 min | 👤 A | SNT-108 |
| SNT-110 | 🎭 `tours[]`: erfundene Reviews/Ratings flaggen oder entfernen | 2 h | 👤 A | — |
| SNT-111 | 🎰 `cities[]`: Fake-Scarcity (`total`/`taken`) entfernen | 30 min | 👤 A | — |
| SNT-112 | 🤖 `community_extender.js`: 4 erzwungene Felder korrigieren | 1,5 h | 👤 A | — |
| SNT-113 | 📊 KI-Digest: ungeprüfte Zahlen als `[UNVERIFIED PROJECTION]` markieren | 45 min | 👤 A | — |
| SNT-114 | 🧪 `GrowthStudio`: Mallorca-Headline dynamisch | 30 min | 👤 A | — |
| SNT-115 | 🔐 `Login.tsx`: falsche DSGVO-/Verschlüsselungs-Versprechen entfernen | 20 min | 👤 A | — |

**Phase-0-Aufwand gesamt: ~11 h**

---

### 🟡 P1 — Fundament

| Karte | Task | Aufwand | Verantw. | Abhängig von |
|---|---|---|---|---|
| SNT-201 | 📦 Quelle A → `src/` an Repo-Root verschieben | 3 h | 👤 A | SNT-114 |
| SNT-202 | 🗄️ Quelle B → `legacy/v6-04.09.2026/` | 30 min | 👤 A | SNT-201 |
| SNT-203 | 📚 39 Legacy-Engines → `legacy/v5-legacy-engines/` | 1 h | 👤 A | SNT-201 |
| SNT-204 | 🗑️ `dist/` aus Git-Tracking entfernen | 15 min | 👤 A | SNT-201 |
| SNT-205 | ⚙️ `vercel.json`: echter `buildCommand` | 30 min | 👤 A | SNT-201 |
| SNT-206 | 🔄 CI: `npm ci && npm run build` + Artefakt-Upload | 1,5 h | 👤 A | SNT-201 |
| SNT-207 | ✅ `Login.tsx` aus Quelle A (echtes `signInWithOtp`) | 2 h | 👤 A | SNT-201, SNT-115 |
| SNT-208 | 🔑 `AuthContext` + `useAuth()` + Session-Persistenz | 2 h | 👤 A | SNT-207 |
| SNT-209 | 🛡️ `AuthGuard` für geschützte Routen | 1 h | 👤 A | SNT-208 |
| SNT-210 | 🔑 Supabase-Env in GitHub Secrets + Vercel | 20 min | 👤 V | — |
| SNT-211 | 🔒 RLS: 6 Basis-Policies schreiben | 3 h | 👤 A | SNT-210 |
| SNT-212 | 🔗 `created_by` FK in `secret_spots` ergänzen | 30 min | 👤 A | SNT-211 |
| SNT-213 | 🧪 `scripts/test_rls.js` schreiben | 1,5 h | 👤 A | SNT-211, SNT-212 |
| SNT-214 | 📊 Plausible + 12 Events instrumentieren | 3 h | 👤 A | SNT-208 |
| SNT-215 | ⚖️ `Impressum.tsx` (§ 5 DDG, § 18 MStV, VSBG) | 1,5 h | 👤 A | — |
| SNT-216 | 🔐 `Datenschutz.tsx` (alle Auftragsverarbeiter) | 1,5 h | 👤 A | SNT-214 |
| SNT-217 | 📜 `Terms.tsx` mit Offline-Disclaimer | 1,5 h | 👤 A | — |
| SNT-218 | 🛡️ `Safety.tsx` mit Report/Block-UI | 2 h | 👤 A | SNT-217 |
| SNT-219 | 🔗 Footer-Links auf Rechtstexte | 30 min | 👤 A | SNT-215…218 |
| SNT-220 | ⚖️ Rechtstexte juristisch prüfen lassen | 2 h | 👤 V | SNT-215…219 |

---

### 🟢 P2 — Community-Kern

| Karte | Task | Aufwand | Verantw. | Abhängig von |
|---|---|---|---|---|
| SNT-301 | 🗺️ `SubmitSpotModal` integrieren + `created_by` | 3 h | 👤 A | SNT-208, SNT-212 |
| SNT-302 | ✅ Spot-Pflichtfelder inkl. Koordinaten-Validierung | 1,5 h | 👤 A | SNT-301 |
| SNT-303 | 🏷️ `source`-Feld + Provenienz-Label (KI vs. Local) | 1 h | 👤 A | SNT-301 |
| SNT-304 | ⏱️ Rate-Limit: 5 Einreichungen/Tag | 1 h | 👤 A | SNT-301 |
| SNT-305 | 📖 `Explore.tsx` liest aus Supabase | 2 h | 👤 A | SNT-301 |
| SNT-306 | ✅ `spot_verifications` Tabelle + RLS | 2 h | 👤 A | SNT-212 |
| SNT-307 | 🎯 3-Bestätigungen-Schwelle implementieren | 2 h | 👤 A | SNT-306 |
| SNT-308 | 🛡️ Anti-Spoofing (1 Stimme/User, kein Creator-Votum) | 1 h | 👤 A | SNT-306 |
| SNT-309 | 💬 `follows` + `messages` + `message_reports` | 4 h | 👤 A | SNT-212 |
| SNT-310 | 🤝 Kontext-basierte Kontaktaufnahme | 2 h | 👤 A | SNT-309 |
| SNT-311 | ⏱️ Rate-Limits (5 Kontakte/Tag, 20 Msg/Stunde) | 1 h | 👤 A | SNT-309 |
| SNT-312 | 🚫 Block/Report in jeder Konversation | 1,5 h | 👤 A | SNT-309 |
| SNT-313 | 🔕 Moderations-Queue (Link-/Spam-Filter) | 2 h | 👤 A | SNT-312 |
| SNT-314 | 🤝 **Meetup #1 real durchführen** (WhatsApp, 6–8 Pers.) | 4 h | 👤 V | — |
| SNT-315 | 📄 `docs/MEETUP_001_REPORT.md` schreiben | 1 h | 👤 V | SNT-314 |



### 🟢 P2 — System gesund

| Karte | Task | Aufwand | Verantw. | Abhängig von |
|---|---|---|---|---|
| SNT-401 | 🚫 Webhook- + Telegram-Dispatch entfernen | 1 h | 👤 A | SNT-114 |
| SNT-402 | 📥 Seeder → Review-Queue statt Direkt-Insert | 2 h | 👤 A | SNT-401 |
| SNT-403 | 📊 Reflection ohne erfundene Zahlen | 1 h | 👤 A | SNT-113 |
| SNT-404 | ⏰ Cron von 3 Workflows auf 1 reduzieren | 1 h | 👤 A | SNT-401 |
| SNT-405 | 🔐 `/growth` hinter Admin-Flag | 45 min | 👤 A | SNT-208 |
| SNT-406 | 🧪 Vitest + Unit-Tests (Scoring, Geo, Provenienz) | 4 h | 👤 A | SNT-201 |
| SNT-407 | 🎭 Playwright Smoke (16 Routen + Login + Submit) | 4 h | 👤 A | SNT-209, SNT-301 |
| SNT-408 | 🔄 CI: `lint → test → build → deploy` verknüpfen | 1,5 h | 👤 A | SNT-206, SNT-406, SNT-407 |
| SNT-409 | ✂️ Route-Level Code-Splitting (`React.lazy`) | 3 h | 👤 A | SNT-201 |
| SNT-410 | 💤 `data.ts` + Leaflet lazy laden | 2 h | 👤 A | SNT-409 |
| SNT-411 | 🔤 Fonts reduzieren (4 → 2) | 1 h | 👤 A | SNT-409 |
| SNT-412 | 📏 Bundle-Budget < 500 KB gzip im CI erzwingen | 1 h | 👤 A | SNT-410 |

---

### ⚪ P3 — Wachstum (ab Woche 9, nach Phase 0–3)

| Karte | Task | Aufwand | Verantw. | Abhängig von |
|---|---|---|---|---|
| SNT-501 | 📜 Founding-Local-Angebot + Pflichten (öffentlich auf URL) | 2 h | 👤 V | — |
| SNT-502 | 🤝 5 Locals persönlich rekrutieren (Face-to-Face) | 4 h | 👤 V | SNT-501 |
| SNT-503 | 📣 6 weitere Locals über 5 Kanäle gewinnen | 6 h | 👤 V | SNT-502 |
| SNT-504 | ✅ 30 Spots von Locals verifizieren lassen | 4 h | 👤 V | SNT-307 |
| SNT-505 | 📰 Redaktionsplan: 1 Stadtratgeber/Monat | 2 h | 👤 A | SNT-109 |
| SNT-506 | 📄 Magazin-Artikel auf echte Domain umstellen | 2 h | 👤 A | SNT-109 |
| SNT-507 | 📧 Newsletter (monatlich) einrichten | 3 h | 👤 A | SNT-214 |
| SNT-508 | 💳 Stripe: Free / Supporter / Local Pro definieren | 2 h | 👤 A | SNT-208 |
| SNT-509 | 💰 Supporter-Plan live schalten | 1 h | 👤 A | SNT-508 |
| SNT-510 | 🤝 3 zahlende Locals/Businesses gewinnen | 6 h | 👤 V | SNT-509 |

---

## 🚧 IN PROGRESS

*(leer)*

## 👀 REVIEW

*(leer)*

## ✅ DONE

*(leer — das Audit vom 2026-09-25 ist der Ausgangspunkt, nicht ein abgeschlossener Task)*

---

## ⛔ BLOCKED

| Karte | Blockiert durch | Notiz |
|---|---|---|
| SNT-207 | SNT-210 | `.env` enthält **keine** Supabase-Variablen — nur Stripe + AI-Keys |
| SNT-201 | SNT-202, SNT-203 | Umzug muss vor dem Build vereinheitlicht werden |
| SNT-301 | SNT-208 | Ohne `auth.uid()` kein `created_by` |
| SNT-501+ | Phase 0 komplett | Vor Phase 4 muss alles in Phase 0–3 grün und messbar sein |

---

## 🗑️ WONTFIX / DROP

| Element | Begründung |
|---|---|
| `app.html` (29 KB) als eigene Seite | Durch SPA-Rewrite unerreichbar. Archivieren oder echte Route bauen. |
| 39 Legacy-Engines in `assets/js/` | Nicht deployed. Nach `legacy/` verschieben, dann neu bauen was gebraucht wird. |
| `scratch-n-travel-six.vercel.app` als Version | **Kein zweites Produkt.** Nur Staging. |
| 47 Vite-Bundles in `dist/assets/` (45 tot) | Build-Artefakte, dürfen nicht im Git liegen. |
| 2 Duplikat-Bundles in Root `assets/` | Von `scripts/build_app.js` erzeugt, überflüssig. |

---

## Karten-Statistik

| Priorität | Karten | Aufwand |
|---|---|---|
| 🔴 P0 | 15 | ~11 h |
| 🟡 P1 | 20 | ~31 h |
| 🟢 P2 (Community) | 15 | ~28 h + 5 h manuell |
| 🟢 P2 (System) | 12 | ~22 h |
| ⚪ P3 | 10 | ~32 h + 10 h/Woche |
| **Gesamt** | **72** | **~124 h + Community-Zeit** |


*Fortsetzung: `IMPLEMENTATION_PLAN.md` · `TODOLIST.md` · `PROJEKT_AUDIT_2026-09-25.md` · `../COMMUNITY_GROWTH_STRATEGY_2026.md`*
