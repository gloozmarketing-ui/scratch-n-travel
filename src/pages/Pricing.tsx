import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTravel } from '../context/TravelContext'
import { POD_ENABLED } from '../lib/features'

type AudienceMode = 'b2c' | 'b2b' | 'matrix'

export default function Pricing() {
  const { user, triggerHaptic } = useTravel()
  const [audienceMode, setAudienceMode] = useState<AudienceMode>('b2c')
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly')

  // B2C Pläne für normale Reisende
  const b2cPlans = [
    {
      id: 'free',
      name: 'Explorer Free',
      badge: 'GIVE & TAKE BASIS',
      price: '€0',
      period: 'dauerhaft kostenlos',
      desc: 'Perfekt für spontane Trips und jeden, der sich aktiv in der Community einbringt.',
      features: [
        '3 GPS-Secrets pro Monat freirubbeln',
        'Digitaler Reisepass mit Basis-Stempeln',
        'Routen folgen — sobald du 1 Ort bestätigt hast',
        'Basis-Zugriff auf Safety & Scam Radar',
        '2 AI Concierge Anfragen pro Tag',
        '1-Klick Google Kalender & GPX Export',
        'Give & Take: Meetups, Flash-Feed & Skill-Swap',
        'Kostenlose Pro-Tage durch Einreichen von Tipps verdienen',
      ],
      cta: 'Kostenlos starten',
      primary: false,
    },
    {
      id: 'pro',
      name: 'Explorer Pro',
      badge: 'BELIEBTESTE WAHL',
      price: billingCycle === 'yearly' ? '€7,50' : '€9,00',
      period: billingCycle === 'yearly' ? 'pro Monat (jährlich €90)' : 'pro Monat',
      priceId: 'price_1P_mock_pro_monthly',
      desc: 'Für passionierte Weltenbummler, die abseits ausgetretener Pfade reisen und vollen Radar-Schutz wollen.',
      features: [
        'Unbegrenzt GPS-Secrets freirubbeln',
        'VIP Radar Shield: Alle unzensierten K.O.-Tropfen- & Scam-Zonen',
        'Alle 460+ Master-Badges & Sammlungen',
        '130+ Hobby-DNA Matcher mit Locals & Skill-Swap',
        'Eigene Routen ab 5 bestätigten Orten (5 aktiv)',
        'Routen-Badges mit Namen des Locals',
        ...(POD_ENABLED ? ['25% Rabatt auf alle Merch-Bestellungen'] : []),
        'Unbegrenzter AI Travel Concierge (kein Tageslimit)',
        'Ebbe, Flut & Strömungs-Radar für deine Küstentouren',
      ],
      cta: 'Explorer Pro aktivieren →',
      primary: true,
    },
    {
      id: 'family_pet',
      name: 'Family & Pet VIP',
      badge: 'FAMILIE & HUND',
      price: billingCycle === 'yearly' ? '€24,00' : '€29,00',
      period: billingCycle === 'yearly' ? 'pro Monat (jährlich €288)' : 'pro Monat',
      priceId: 'price_1P_mock_vip_monthly',
      desc: 'Komplettpaket für Familien, Reisende mit Hund und komfortsuchende Camper.',
      features: [
        'Alles aus Explorer Pro inklusive',
        '25 eigene Routen ab 25 bestätigten Orten',
        'Routen als offizielle Landmarke auf der Weltkarte',
        'Hundefreundliche Filter & Tierarzt-Notfallnetz Europa',
        'Kinderwagen- und barrierefreie Routenfilter',
        'Strömungs- und Flutwarnung als Push-Benachrichtigung',
        'Direkte B2B Tisch- & Platzreservierung (0% Gebühr)',
        'Prioritärer WhatsApp Concierge Notfall-Support',
      ],
      cta: 'Family & Pet VIP starten →',
      primary: false,
    },
  ]

  // B2B Pläne für Cafés, Guides, Hosts & Gewerbetreibende aller Branchen
  const b2bPlans = [
    {
      id: 'b2b_host',
      name: 'Verified Local Host Starter',
      badge: 'FÜR CAFÉS, SURF, WEIN & RETREATS',
      price: '€29',
      period: 'pro Monat (monatlich kündbar)',
      priceId: 'price_1P_mock_b2b_monthly',
      desc: 'Für Cafés, Surfschulen, Weingüter, Boutique-Hotels, Glamping, Coworking & lokale Manufakturen.',
      features: [
        '1x Physischer 20mm Acrylglas Thekenaufsteller per Post (UV-Hinterdruck, 300 DPI, Gelato POD)',
        'Individuelles Design passend zu deinem Land, GPS-Gravur & Branchen-Wappen',
        '0% Buchungsprovision für direkte Tisch-, Zimmer-, Board- & Touranfragen',
        'Digitaler Stempel im Reisepass für Gäste (+50 XP Belohnung)',
        'Offizielle Verifizierung im Safety & Connectivity Radar',
        'Eintrag in die interaktive Map mit Öffnungszeiten & Fotos',
        'Gäste können Bewertungen & verifizierte Empfehlungen abgeben',
        'Direkter Chat-Kanal mit anfragenden Reisenden',
      ],
      cta: 'Local Host Starter buchen (29 €/Mo) →',
      primary: true,
    },
    {
      id: 'b2b_pro',
      name: 'Experience & Gastro Hub Pro',
      badge: 'FÜR MULTI-STANDORTE & CLUBS',
      price: '€59',
      period: 'pro Monat',
      priceId: 'price_1P_mock_b2b_pro_monthly',
      desc: 'Für größere Surfschulen, Guides mit Touren, Weingüter, Boutique-Resorts und Veranstalter.',
      features: [
        '3x Physische QR-Code Acryl-Aufsteller per Post inklusive',
        'Eigene geführte Touren & Workshops in der App listen',
        '0% Buchungsgebühr auf alle Kurs- und Touranfragen',
        'Top-Platzierung im Safety Radar unter "Verifizierte Local Hubs"',
        'Empfehlung durch den AI Concierge für passende Hobbys',
        'Analyse-Dashboard: Aufrufe, Stempel-Scans & Reservierungen',
        'Persönlicher Partner-Support & Quartals-Feature im Newsletter',
      ],
      cta: 'Gastro Hub Pro starten (59 €/Mo) →',
      primary: false,
    },
  ]

  const handleCheckout = async (plan: { id: string; name: string; price: string; priceId?: string }) => {
    triggerHaptic(20)
    if (plan.id === 'free') {
      alert('Der Explorer Free Plan ist dauerhaft kostenlos und bereits aktiv! Durch aktive Beiträge (z. B. Gefahren melden oder Spots teilen) verdienst du dir kostenlose Pro-Tage.')
      return
    }

    const emailToUse = user.email || (user.handle !== '@gast' ? `${user.handle.replace('@', '')}@wanderer.eu` : prompt('Bitte geschäftliche E-Mail für die Rechnung eingeben:') || 'partner@scratch-n-travel.com')

    setLoadingPlan(plan.id)
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: plan.priceId || 'price_1P_mock_monthly',
          customerEmail: emailToUse,
          successUrl: window.location.origin + '/passport?checkout=success',
          cancelUrl: window.location.origin + '/pricing',
        }),
      })

      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert("Stripe Checkout für " + plan.name + " (" + plan.price + ") für " + emailToUse + " gestartet! (Test-Modus).")
      }
    } catch (e) {
      alert("Stripe Checkout für " + plan.name + " (" + plan.price + ") initialisiert (Test-Modus).")
    } finally {
      setLoadingPlan(null)
    }
  }

  return (
    <div className="min-h-screen bg-paper pb-24 md:pb-12 text-ink">
      {/* ─── HEADER ─── */}
      <div className="page-header border-b border-sun/30 pb-5">
        <div className="max-w-6xl mx-auto">
          <p className="coord mb-1">Echte Erlebnisse · Transparente Preise · Keine versteckten Gebühren</p>
          <h1 className="font-display text-3xl md:text-4xl text-ink font-black tracking-tight">
            Pläne, Mitgliedschaften &amp; B2B-Partner
          </h1>
          <p className="font-body text-ink-faint text-sm mt-1 max-w-2xl">
            Klare Differenzierung: Für normale Reisende (kostenlos mit Give &amp; Take oder Pro) und für lokale Gewerbetreibende (feste Monatspauschale ohne Buchungsprovision).
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8">
        {/* ─── ZIELGRUPPEN-SCHALTER (B2C VS B2B VS MATRIX) ─── */}
        <div className="flex justify-center">
          <div className="flex items-center gap-1.5 p-1.5 bg-paper-deep border-2 border-sun/50 rounded-2xl shadow-md flex-wrap justify-center">
            <button
              onClick={() => {
                triggerHaptic(10)
                setAudienceMode('b2c')
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                audienceMode === 'b2c'
                  ? 'bg-terracotta text-white shadow-md scale-102'
                  : 'text-ink-faint hover:text-ink hover:bg-card'
              }`}
            >
              <span>👤</span>
              <span>Für Reisende &amp; Explorer (B2C)</span>
            </button>

            <button
              onClick={() => {
                triggerHaptic(10)
                setAudienceMode('b2b')
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                audienceMode === 'b2b'
                  ? 'bg-leaf text-white shadow-md scale-102'
                  : 'text-ink-faint hover:text-ink hover:bg-card'
              }`}
            >
              <span>🏪</span>
              <span>Für Business Owner, Cafés &amp; Hosts (B2B)</span>
            </button>

            <button
              onClick={() => {
                triggerHaptic(10)
                setAudienceMode('matrix')
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                audienceMode === 'matrix'
                  ? 'bg-ink text-white shadow-md'
                  : 'text-ink-faint hover:text-ink hover:bg-card'
              }`}
            >
              <span>⚖️</span>
              <span>Alle Details im Vergleich</span>
            </button>
          </div>
        </div>

        {/* ─── BEREICH A: FÜR NORMALE REISENDE (B2C) ─── */}
        {audienceMode === 'b2c' && (
          <div className="space-y-6 animate-fade-in">
            {/* Abrechnungs-Umschalter Monat / Jahr */}
            <div className="flex justify-center">
              <div className="flex items-center gap-2 p-1 bg-paper-deep border border-sun rounded-full">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={"btn text-xs py-1.5 px-4 rounded-full " + (billingCycle === 'monthly' ? 'btn-primary' : 'bg-transparent text-ink-faint')}
                >
                  Monatlich
                </button>
                <button
                  onClick={() => setBillingCycle('yearly')}
                  className={"btn text-xs py-1.5 px-4 rounded-full " + (billingCycle === 'yearly' ? 'btn-primary' : 'bg-transparent text-ink-faint')}
                >
                  Jährlich <span className="text-[0.62rem] text-emerald-900 bg-emerald-300 font-bold px-1.5 py-0.2 rounded-full ml-1">-20% Rabatt</span>
                </button>
              </div>
            </div>

            {/* Give & Take — das Freemium-Prinzip für normale User */}
            <div className="card card-accent p-5 max-w-4xl mx-auto text-center border-2 border-sun/60 bg-sun-wash/30 shadow-md">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-xl">🪙</span>
                <h3 className="font-display font-bold text-base text-ink">Das Give &amp; Take Freemium-Prinzip</h3>
              </div>
              <p className="font-body text-ink text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
                Als Reisender musst du <strong>kein Geld bezahlen, wenn du aktiv mitmachst</strong>!
                Für jeden gemeldeten Vorfall im Safety Radar erhältst du <strong>+7 Tage VIP Pass</strong>, für jeden geteilten Secret Spot <strong>+14 Tage VIP Pass</strong>.
                Zahlen muss nur, wer rein konsumiert ohne beizutragen — oder wer den bequemen Dauerzugang möchte.
              </p>
            </div>

            {/* B2C Pläne Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
              {b2cPlans.map(p => (
                <div
                  key={p.id}
                  className={"card p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:scale-[1.02] border-2 " + (
                    p.primary
                      ? 'border-sun shadow-[0_0_35px_var(--sun-wash)] bg-gradient-to-b from-card to-paper-deep'
                      : 'border-sun/40 bg-card'
                  )}
                >
                  {p.badge && (
                    <span
                      className={"absolute top-3 right-3 font-mono text-[0.6rem] font-bold px-2.5 py-0.5 rounded-full " + (
                        p.primary ? 'shimmer-anim text-ink font-extrabold' : 'bg-paper-deep text-sun border border-sun/30'
                      )}
                    >
                      {p.badge}
                    </span>
                  )}

                  <div>
                    <h3 className="font-display text-ink text-xl font-bold mb-1">{p.name}</h3>
                    <p className="font-body text-ink-faint text-xs mb-4 min-h-[32px]">{p.desc}</p>

                    <div className="mb-6 pb-4 border-b border-sun/40">
                      <span className="font-display text-3xl font-black text-sun">{p.price}</span>
                      <span className="font-mono text-xs text-ink-faint ml-2">/ {p.period}</span>
                    </div>

                    <div className="space-y-2.5 mb-6">
                      {p.features.map(f => (
                        <div key={f} className="flex items-start gap-2 text-xs font-body text-ink">
                          <span className="text-leaf font-bold">✓</span>
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleCheckout(p)}
                    disabled={loadingPlan === p.id}
                    className={"btn w-full py-3 text-xs " + (p.primary ? 'btn-primary font-bold shadow-lg' : 'btn-secondary')}
                  >
                    {loadingPlan === p.id ? 'Wird geladen…' : p.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── BEREICH B: FÜR BUSINESS OWNER & LOCAL HOSTS (B2B) ─── */}
        {audienceMode === 'b2b' && (
          <div className="space-y-6 animate-fade-in">
            {/* Banner für Gewerbetreibende */}
            <div className="card parchment p-6 max-w-4xl mx-auto border-2 border-leaf shadow-md text-center">
              <span className="text-2xl block mb-2">🏪</span>
              <h2 className="font-display text-2xl font-bold text-ink mb-1">
                Für alle Branchen: Cafés, Surfschulen, Weingüter, Hotels &amp; Guides
              </h2>
              <p className="font-body text-xs sm:text-sm text-ink-faint max-w-2xl mx-auto leading-relaxed">
                Keine teuren 15–25% Buchungsprovisionen wie bei Booking oder Airbnb. 
                Du zahlst eine <strong>feste, faire Monatspauschale</strong> und erhältst echte Reisende, 
                einen <strong>physischen QR-Code Acrylglas Thekenaufsteller per Post</strong> und 0% Provision auf alle Anfragen!
              </p>
            </div>

            {/* Branchen-Tags Bar */}
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto text-xs font-mono">
              {[
                '☕ Cafés & Bäckereien',
                '🏄 Surfschulen & Wassersport',
                '🍇 Weingüter & Bodegas',
                '🥾 Outdoor- & Bergführer',
                '🚐 Campervan & Glamping',
                '🏺 Handwerk & Ateliers',
                '💻 Coworking & Nomad Hubs',
                '🏨 Boutique Hotels & B&Bs',
                '🚲 Bike & Gravel Verleih',
              ].map(tag => (
                <span key={tag} className="bg-paper-deep border border-leaf/40 text-ink px-3 py-1 rounded-full text-[0.68rem] font-bold shadow-sm">
                  {tag}
                </span>
              ))}
            </div>

            {/* B2B Pläne Grid */}
            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {b2bPlans.map(p => (
                <div
                  key={p.id}
                  className={"card p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:scale-[1.01] border-2 " + (
                    p.primary
                      ? 'border-leaf shadow-xl bg-gradient-to-b from-card to-paper-deep'
                      : 'border-sun/60 bg-card'
                  )}
                >
                  <span className="absolute top-3 right-3 font-mono text-[0.62rem] font-bold px-2.5 py-0.5 rounded-full bg-leaf-wash text-leaf border border-leaf/40">
                    {p.badge}
                  </span>

                  <div>
                    <h3 className="font-display text-ink text-2xl font-bold mb-1">{p.name}</h3>
                    <p className="font-body text-ink-faint text-xs mb-4 min-h-[32px]">{p.desc}</p>

                    <div className="mb-6 pb-4 border-b border-line">
                      <span className="font-display text-4xl font-black text-leaf">{p.price}</span>
                      <span className="font-mono text-xs text-ink-faint ml-2">/ {p.period}</span>
                    </div>

                    <div className="space-y-2.5 mb-6">
                      {p.features.map(f => (
                        <div key={f} className="flex items-start gap-2 text-xs font-body text-ink">
                          <span className="text-leaf font-bold">✓</span>
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => handleCheckout(p)}
                      disabled={loadingPlan === p.id}
                      className="btn btn-primary w-full py-3 text-xs font-bold shadow-lg"
                    >
                      {loadingPlan === p.id ? 'Wird geladen…' : p.cta}
                    </button>
                    <Link to="/host" className="text-[0.72rem] text-ink-faint hover:text-ink underline block text-center">
                      Details zum Starter-Kit &amp; Ablauf im Host-Portal ansehen →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── BEREICH C: DETAIL-MATRIX (FÜR BEIDE SEITEN) ─── */}
        {audienceMode === 'matrix' && (
          <div className="card p-6 border border-sun overflow-x-auto animate-fade-in shadow-lg">
            <h3 className="font-display text-xl font-bold text-ink mb-4 text-center">
              Vollständiger Leistungs- &amp; Preisvergleich
            </h3>
            <table className="w-full text-left text-xs font-body">
              <thead>
                <tr className="border-b-2 border-sun text-ink font-bold">
                  <th className="py-3 px-3">Funktion / Leistung</th>
                  <th className="py-3 px-3">👤 Explorer Free</th>
                  <th className="py-3 px-3 bg-sun-wash/40">💎 Explorer Pro</th>
                  <th className="py-3 px-3">🐶 Family &amp; Pet VIP</th>
                  <th className="py-3 px-3 bg-leaf-wash/40 text-leaf">🏪 B2B Host (29 €)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                <tr>
                  <td className="py-3 px-3 font-bold">Preis / Abrechnung</td>
                  <td className="py-3 px-3">0 € dauerhaft</td>
                  <td className="py-3 px-3 bg-sun-wash/40 font-bold">7,50 € / 9,00 € mtl.</td>
                  <td className="py-3 px-3 font-bold">24,00 € / 29,00 € mtl.</td>
                  <td className="py-3 px-3 bg-leaf-wash/40 font-bold text-leaf">29,00 € mtl. (0% Provision)</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold">Zielgruppe</td>
                  <td className="py-3 px-3">Gelegenheits-Reisende</td>
                  <td className="py-3 px-3 bg-sun-wash/40">Vollblut-Reisende &amp; Solos</td>
                  <td className="py-3 px-3">Familien &amp; Hundebesitzer</td>
                  <td className="py-3 px-3 bg-leaf-wash/40 font-bold text-leaf">Cafés, Bars, Guides &amp; Shops</td>
                </tr>
                <tr>
                  <td className="py-3 px-3">GPS-Secrets freirubbeln</td>
                  <td className="py-3 px-3">3 pro Monat</td>
                  <td className="py-3 px-3 bg-sun-wash/40 font-bold text-leaf">Unbegrenzt</td>
                  <td className="py-3 px-3 font-bold text-leaf">Unbegrenzt</td>
                  <td className="py-3 px-3 bg-leaf-wash/40">Inklusive</td>
                </tr>
                <tr>
                  <td className="py-3 px-3">Safety &amp; Threat Radar</td>
                  <td className="py-3 px-3">Basis-Zonen</td>
                  <td className="py-3 px-3 bg-sun-wash/40 font-bold text-leaf">VIP Shield (Alle Zonen)</td>
                  <td className="py-3 px-3 font-bold text-leaf">VIP Shield + Push</td>
                  <td className="py-3 px-3 bg-leaf-wash/40 font-bold text-leaf">Als verifizierter Partner gelistet</td>
                </tr>
                <tr>
                  <td className="py-3 px-3">Give &amp; Take (Meetups &amp; Swaps)</td>
                  <td className="py-3 px-3">✓ Ja</td>
                  <td className="py-3 px-3 bg-sun-wash/40">✓ Ja (+ VIP Status)</td>
                  <td className="py-3 px-3">✓ Ja</td>
                  <td className="py-3 px-3 bg-leaf-wash/40 font-bold">Eigene Events hosten</td>
                </tr>
                <tr>
                  <td className="py-3 px-3">Physischer QR-Aufsteller per Post</td>
                  <td className="py-3 px-3 text-ink-faint">—</td>
                  <td className="py-3 px-3 bg-sun-wash/40 text-ink-faint">—</td>
                  <td className="py-3 px-3 text-ink-faint">—</td>
                  <td className="py-3 px-3 bg-leaf-wash/40 font-bold text-leaf">✓ Inklusive frei Haus</td>
                </tr>
                <tr>
                  <td className="py-3 px-3">Buchungsprovision für Anfragen</td>
                  <td className="py-3 px-3 text-ink-faint">—</td>
                  <td className="py-3 px-3 bg-sun-wash/40 text-ink-faint">—</td>
                  <td className="py-3 px-3 text-ink-faint">—</td>
                  <td className="py-3 px-3 bg-leaf-wash/40 font-bold text-leaf">0% (100% Gewinn bei dir)</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* DSGVO & Sicherheit Footer */}
        <div className="parchment rounded-xl p-6 max-w-4xl mx-auto text-center border border-terracotta shadow-md">
          <p className="font-script text-2xl text-terracotta mb-1">Datenschutz- und DSGVO-konform</p>
          <p className="font-body text-ink text-xs sm:text-sm max-w-xl mx-auto">
            Keine Weitergabe deiner Reisedaten. Jederzeit monatlich mit 1 Klick kündbar im Kundenportal. Sichere Zahlungsabwicklung via Stripe.
          </p>
        </div>
      </div>
    </div>
  )
}

