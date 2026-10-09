import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTravel } from '../context/TravelContext'
import { POD_ENABLED } from '../lib/features'

export default function Pricing() {
  const { user, triggerHaptic } = useTravel()
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly')

  const plans = [
    {
      id: 'free',
      name: 'Explorer Free',
      badge: 'STARTER',
      price: '€0',
      period: 'dauerhaft kostenlos',
      desc: 'Perfekt für spontane Trips, um erste Geheimtipps freizurubbeln.',
      features: [
        '3 GPS-Secrets pro Monat freirubbeln',
        'Digitaler Reisepass mit Basis-Stempeln',
        'Routen folgen — sobald du 1 Ort bestätigt hast',
        'Zugriff auf Hazard & Scam Radar',
        '2 AI Concierge Anfragen pro Tag',
        '1-Klick Google Kalender & GPX Export',
        'Give & Take: Meetups, Nachrichten & Gastgeben',
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
      desc: 'Für passionierte Weltenbummler, die abseits ausgetretener Pfade reisen.',
      features: [
        'Unbegrenzt GPS-Secrets freirubbeln',
        'Alle 460+ Master-Badges & Sammlungen',
        '130-Hobby DNA Matching mit Locals',
        'Eigene Routen ab 5 bestätigten Orten (5 aktiv)',
        'Routen-Badges mit Namen des Locals',
        ...(POD_ENABLED ? ['25% Rabatt auf alle Merch-Bestellungen'] : []),
        'Unbegrenzter AI Travel Concierge',
        'Ebbe, Flut & Strömung für deine Route',
      ],
      cta: 'Pro Mitglied werden →',
      primary: true,
    },
    {
      id: 'family_pet',
      name: 'Family & Pet VIP',
      badge: 'FAMILIE & HUND',
      price: billingCycle === 'yearly' ? '€24,00' : '€29,00',
      period: billingCycle === 'yearly' ? 'pro Monat (jährlich €288)' : 'pro Monat',
      priceId: 'price_1P_mock_vip_monthly',
      desc: 'Komplettpaket für Familien und Reisende mit Hund.',
      features: [
        'Alles aus Pro inklusive',
        '25 eigene Routen ab 25 bestätigten Orten',
        'Routen als offizielle Landmarke sichtbar',
        'Hundefreundliche Filter & Tierarzt-Notfallnetz',
        'Kinderwagen- und barrierefreie Routen',
        'Strömungs- und Flutwarnung als Push (nass + windig)',
        'Direkte B2B Tisch- & Platzreservierung (0% Fee)',
        'Prioritärer Concierge WhatsApp Support',
      ],
      cta: 'VIP Family & Pet starten →',
      primary: false,
    },
  ]

  const handleCheckout = async (plan: typeof plans[0]) => {
    triggerHaptic(20)
    if (plan.id === 'free') {
      alert('Du bist bereits auf dem Explorer Free Plan angemeldet!')
      return
    }

    setLoadingPlan(plan.id)
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: plan.priceId,
          customerEmail: 'maria@wanderer.eu',
          successUrl: window.location.origin + '/passport?checkout=success',
          cancelUrl: window.location.origin + '/pricing',
        }),
      })

      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert("Stripe Checkout für " + plan.name + " (" + plan.price + ") wird simuliert. Keine Plattformgebühren!")
      }
    } catch (e) {
      alert("Stripe Checkout für " + plan.name + " (" + plan.price + ") initialisiert (Test-Modus).")
    } finally {
      setLoadingPlan(null)
    }
  }

  return (
    <div>
      <div className="page-header">
        <p className="coord mb-1">Echte Erlebnisse · Transparente Preise · Keine versteckten Kosten</p>
        <h1 className="font-display text-3xl text-ink font-bold">Mitgliedschaften & Pläne</h1>
        <p className="font-script text-sun text-lg mt-0.5">invest in your wanderlust</p>
      </div>

      <div className="p-6 space-y-8 pb-24 md:pb-8">
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
              Jährlich <span className="text-[0.62rem] text-emerald-900 bg-emerald-300 font-bold px-1.5 py-0.2 rounded-full ml-1">-20%</span>
            </button>
          </div>
        </div>

        {/* Give & Take — das Freemium-Prinzip, sichtbar über den Plänen (SNT-374). */}
        <div className="card card-accent p-5 max-w-4xl mx-auto text-center border border-sun">
          <p className="font-script text-terracotta text-xl mb-1">geben und nehmen</p>
          <p className="font-body text-ink text-sm max-w-2xl mx-auto leading-relaxed">
            Solange du aktiv bist, kostet dich die Community nichts: Spots teilen, Touren als Guide
            führen, andere etwas beibringen, Gäste aufnehmen, Meetups machen — wer gibt, bekommt
            zurück. <strong className="text-sun">Freemium heißt für uns: Aktiv mitmachen = kostenlos.</strong>{' '}
            Bezahlt wird erst, wenn du gar nichts mehr beiträgst — und dann nur für Extras
            jenseits der Community.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map(p => (
            <div
              key={p.id}
              className={"card p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:scale-[1.02] " + (
                p.primary
                  ? 'border-sun shadow-[0_0_35px_var(--sun-wash)] bg-gradient-to-b from-card to-paper-deep'
                  : 'border-sun'
              )}
            >
              {p.badge && (
                <span
                  className={"absolute top-3 right-3 font-mono text-[0.58rem] font-bold px-2.5 py-0.5 rounded-full " + (
                    p.primary ? 'shimmer-anim text-ink' : 'bg-paper-deep text-sun border border-sun/30'
                  )}
                >
                  {p.badge}
                </span>
              )}

              <div>
                <h3 className="font-display text-ink text-xl font-bold mb-1">{p.name}</h3>
                <p className="font-body text-ink-faint text-xs mb-4 min-h-[32px]">{p.desc}</p>

                <div className="mb-6 pb-4 border-b border-sun">
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

        {/* B2B Verified Local Host Partner Section */}
        <div className="card parchment p-6 sm:p-8 max-w-5xl mx-auto border-2 border-leaf shadow-xl">
          <div className="grid md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-2">
              <span className="font-mono text-xs font-bold text-leaf bg-leaf-wash px-3 py-1 rounded-full uppercase">
                B2B Partner &amp; Local Business
              </span>
              <h3 className="font-display text-2xl font-bold text-ink">
                Verified Local Host &amp; Gastro Hub — 29 € / Monat
              </h3>
              <p className="font-body text-xs sm:text-sm text-ink-faint leading-relaxed">
                Für Cafés, Tascas, Guides, Surfschulen und Manufakturen. 
                Inklusive <strong>physischem Holz/Acryl QR-Stempelaufsteller</strong> per Post, 
                digitalem Reisepass-Stempel für Gäste (+50 XP), 
                <strong> 0% Buchungsprovision</strong> und Verifizierung im Safety &amp; Connectivity Radar.
              </p>
            </div>
            <div className="text-center md:text-right space-y-3">
              <div>
                <span className="font-display text-3xl font-black text-leaf">29,00 €</span>
                <span className="font-mono text-xs text-ink-faint ml-1">/ Monat</span>
              </div>
              <Link to="/host" className="btn btn-primary w-full md:w-auto py-2.5 px-6 text-xs font-bold shadow-lg inline-block">
                Host Starter-Kit bestellen →
              </Link>
            </div>
          </div>
        </div>

        <div className="parchment rounded-xl p-6 max-w-4xl mx-auto text-center border border-terracotta shadow-md">
          <p className="font-script text-2xl text-terracotta mb-1">Datenschutz- und DSGVO-konform</p>
          <p className="font-body text-ink text-sm max-w-xl mx-auto">
            Keine Weitergabe deiner Reisedaten. Jederzeit monatlich kündbar mit einem Klick im Kundenportal. Sichere Zahlungsabwicklung via Stripe.
          </p>
        </div>
      </div>
    </div>
  )
}
