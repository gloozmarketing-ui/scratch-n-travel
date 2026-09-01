import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTravel } from '../context/TravelContext'

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
        'Zugriff auf Hazard & Scam Radar',
        '2 AI Concierge Anfragen pro Tag',
        '1-Klick Google Kalender & GPX Export',
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
        '25% Rabatt auf alle Merch-Bestellungen',
        'Unbegrenzter AI Travel Concierge',
        'City Quests & exklusive Belohnungen',
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
        'Hundefreundliche Filter & Tierarzt-Notfallnetz',
        'Kinderwagen- und barrierefreie Routen',
        'Direkte B2B Tisch- & Platzreservierung (0% Fee)',
        'Monatliche limitierte Sammler-Badges frei Haus',
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
        <h1 className="font-display text-3xl text-[#F4E4C1] font-bold">Mitgliedschaften & Pläne</h1>
        <p className="font-script text-[rgba(201,168,76,0.5)] text-lg mt-0.5">invest in your wanderlust</p>
      </div>

      <div className="p-6 space-y-8 pb-24 md:pb-8">
        <div className="flex justify-center">
          <div className="flex items-center gap-2 p-1 bg-[#152539] border border-[rgba(201,168,76,0.2)] rounded-full">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={"btn text-xs py-1.5 px-4 rounded-full " + (billingCycle === 'monthly' ? 'btn-primary' : 'bg-transparent text-[#8A9AAA]')}
            >
              Monatlich
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={"btn text-xs py-1.5 px-4 rounded-full " + (billingCycle === 'yearly' ? 'btn-primary' : 'bg-transparent text-[#8A9AAA]')}
            >
              Jährlich <span className="text-[0.62rem] text-emerald-900 bg-emerald-300 font-bold px-1.5 py-0.2 rounded-full ml-1">-20%</span>
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map(p => (
            <div
              key={p.id}
              className={"card p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:scale-[1.02] " + (
                p.primary
                  ? 'border-[#C9A84C] shadow-[0_0_35px_rgba(201,168,76,0.15)] bg-gradient-to-b from-[#1D3454] to-[#152539]'
                  : 'border-[rgba(201,168,76,0.2)]'
              )}
            >
              {p.badge && (
                <span
                  className={"absolute top-3 right-3 font-mono text-[0.58rem] font-bold px-2.5 py-0.5 rounded-full " + (
                    p.primary ? 'shimmer-anim text-[#0C1825]' : 'bg-[#0C1825] text-[#C9A84C] border border-[#C9A84C]/30'
                  )}
                >
                  {p.badge}
                </span>
              )}

              <div>
                <h3 className="font-display text-[#F4E4C1] text-xl font-bold mb-1">{p.name}</h3>
                <p className="font-body text-[#8A9AAA] text-xs mb-4 min-h-[32px]">{p.desc}</p>

                <div className="mb-6 pb-4 border-b border-[rgba(201,168,76,0.15)]">
                  <span className="font-display text-3xl font-black text-[#C9A84C]">{p.price}</span>
                  <span className="font-mono text-xs text-[#8A9AAA] ml-2">/ {p.period}</span>
                </div>

                <div className="space-y-2.5 mb-6">
                  {p.features.map(f => (
                    <div key={f} className="flex items-start gap-2 text-xs font-body text-[#F4E4C1]">
                      <span className="text-emerald-400 font-bold">✓</span>
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

        <div className="parchment rounded-xl p-6 max-w-4xl mx-auto text-center border border-[rgba(139,58,42,0.2)] shadow-md">
          <p className="font-script text-2xl text-[#8B3A2A] mb-1">100% BaFin- und DSGVO-konform</p>
          <p className="font-body text-[#2C1810] text-sm max-w-xl mx-auto">
            Keine Weitergabe deiner Reisedaten. Jederzeit monatlich kündbar mit einem Klick im Kundenportal. Sichere Verschlüsselung via Stripe & Supabase.
          </p>
        </div>
      </div>
    </div>
  )
}
