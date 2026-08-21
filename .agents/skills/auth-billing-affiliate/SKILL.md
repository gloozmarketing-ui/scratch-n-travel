---
name: auth-billing-affiliate
description: Konzipiert und implementiert Login-Systeme, Stripe-basierte Abo-/Bezahlmodelle, Affiliate-Programme und die Anbindung an Print-on-Demand-Merch-Anbieter für komplexe Web-Apps. Nutzen, sobald nach "Login", "Auth", "Registrierung", "Stripe", "Abo-System", "Subscription", "Affiliate", "Provisionslink" oder "Merch bestellen/produzieren lassen" gefragt wird.
requires: webapp-ui-ux-frontend (Login-/Checkout-UI)
feeds_into: user-cabinet-personalization, badge-reward-system
---

# Auth-, Billing- & Affiliate-System

## Zweck
Das Fundament jeder Konto-basierten App: sicherer Login, zuverlässiges Abo-Handling über Stripe, ein Affiliate-Mechanismus zur Reichweitensteigerung und eine saubere Schnittstelle zu einem Print-on-Demand-Anbieter für individuellen Merch – ohne dass Claude selbst eine Merch-Produktion abwickelt (das übernimmt der externe Anbieter/API).

## Vorgehen

### 1. Auth-System
- **Empfehlung Free-Tier-tauglich**: Auth-Provider statt Eigenbau nutzen (z. B. NextAuth/Auth.js, Clerk, Supabase Auth – alle mit kostenlosen Startkontingenten). Eigenbau nur, wenn explizit gewünscht (mehr Aufwand, mehr Sicherheitsrisiko).
- Login-Methoden je nach Zielgruppe (aus `zielgruppenanalyse`) wählen: E-Mail/Passwort, Magic Link, OAuth (Google/GitHub) – für die meisten Consumer-Apps: OAuth + Magic Link senkt Drop-off am stärksten
- Session-Handling über sichere, httpOnly-Cookies bzw. den Provider-Standard – niemals Tokens im localStorage für sensible Sessions
- Passwort-Fälle (falls Passwort-Login genutzt wird): Hashing über den Provider/bcrypt, nie selbst "vereinfachtes" Hashing bauen

### 2. Stripe-Abo-System
- **Stripe Checkout/Billing Portal** nutzen statt eigenes Zahlungsformular – reduziert PCI-Compliance-Aufwand drastisch
- Produktstruktur in Stripe: Products → Prices (monatlich/jährlich), ggf. gestaffelte Tiers passend zu den Personas
- **Webhooks sind Pflicht**, nicht optional: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted` abfangen, um den Kontostatus in der eigenen DB synchron zu halten – niemals nur auf den Redirect nach Checkout vertrauen
- Auf Vercel: Webhook-Endpoint als Serverless Function, Signatur-Verifizierung mit dem Stripe-Webhook-Secret nicht überspringen
- Free-Tier-Falle: Webhook-Verarbeitung muss innerhalb der Vercel-Function-Timeout-Grenze bleiben – schwere Arbeit (z. B. Merch-Design-Trigger) asynchron/queued anstoßen, nicht synchron im Webhook erledigen
- Test-Modus (Stripe Test Keys) konsequent von Live-Keys trennen, beides als getrennte Env-Variablen

### 3. Affiliate-System
- Grundmechanik: eindeutiger Referral-Code/-Link pro User (z. B. `?ref=usercode`), im Cookie/LocalStorage mit Ablaufzeit (z. B. 30 Tage) gespeichert, bei Signup/Checkout ausgelesen
- Provisionslogik in eigener DB-Tabelle nachhalten (Referrer-User, geworbener User, Umsatz, Provisionsstatus) – Stripe selbst bietet kein natives Affiliate-System, das muss eigene Logik sein
- Auszahlung: entweder manuell (Anfangsphase völlig ausreichend) oder später über Stripe Connect, falls automatisierte Auszahlungen an Affiliates gewünscht sind
- Referral-Status im User-Cabinet sichtbar machen (siehe `user-cabinet-personalization`) – Transparenz erhöht Motivation zum Teilen

### 4. Merch-Outsourcing-Anbindung (Print-on-Demand)
- Kein Eigenbau der Produktion – Anbindung an einen POD-Anbieter mit API (z. B. Printful, Printify, Gelato – alle bieten REST-APIs)
- Workflow: individuelles Merch-Design (aus `merch-design-generation`) → als Datei/Layer an die POD-API übergeben → Mockup-Vorschau im User-Cabinet anzeigen → bei Bestellung automatisiert Order über die API auslösen
- Bezahlung läuft weiterhin über das eigene Stripe-Setup (Merch als zusätzliches Produkt/Price in Stripe oder als Einmalzahlung via Checkout), die POD-API übernimmt nur Produktion/Versand
- Wichtig: Rechtliches/Kosten (Versandzeiten, Mindestbestellwerte, Margen-Kalkulation) sind Business-Entscheidungen des Users, nicht durch diese Skill zu treffen – bei Unsicherheit aktiv nachfragen statt anzunehmen

## Sicherheits-Checkliste (nicht verhandelbar)
- Keine Secrets (Stripe Secret Key, Webhook Secret, DB-Credentials) im Frontend-Code oder Repo
- Rate-Limiting auf Login-/Signup-Endpunkten
- Stripe-Webhook-Signaturen immer verifizieren
- Rollen-/Berechtigungsprüfung serverseitig, nie nur im Frontend versteckt (UI-Verstecken ist keine Zugriffskontrolle)

## Qualitäts-Check vor Abgabe
- Ist der Abo-Status jederzeit über Webhooks aktuell, nicht nur beim Checkout-Redirect?
- Sind Test- und Live-Stripe-Keys sauber getrennt?
- Ist die Affiliate-Zuordnung nachvollziehbar dokumentiert (welcher User hat wen geworben)?
- Ist die Merch-Bestellung so entkoppelt, dass ein Ausfall der POD-API nicht den gesamten Checkout blockiert?
