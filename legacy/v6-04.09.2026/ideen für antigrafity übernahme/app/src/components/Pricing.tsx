import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Sparkles } from 'lucide-react'

type Plan = {
  name: string
  beschreibung: string
  preisMonat: number | null
  preisJahr: number | null
  cta: string
  highlight?: boolean
  features: string[]
}

const plaene: Plan[] = [
  {
    name: 'Starter',
    beschreibung: 'Für kleine Teams, die ihre ersten Website-Leads gewinnen wollen.',
    preisMonat: 79, preisJahr: 63,
    cta: 'Kostenlos testen',
    features: [
      'Bis zu 5.000 Besucher / Monat',
      'Besucher-Identifikation',
      'KI-Lead-Scoring (Basis)',
      'E-Mail-Benachrichtigungen',
      '1 Nutzer, 1 Website',
      'E-Mail-Support',
    ],
  },
  {
    name: 'Growth',
    beschreibung: 'Für Vertriebsteams, die systematisch Pipeline aufbauen.',
    preisMonat: 199, preisJahr: 159,
    cta: 'Kostenlos testen',
    highlight: true,
    features: [
      'Bis zu 25.000 Besucher / Monat',
      'Alles aus Starter, plus:',
      'Echtzeit Intent-Alerts (Slack & E-Mail)',
      'CRM-Integrationen (HubSpot, Salesforce, Pipedrive)',
      'Ansprechpartner-Anreicherung',
      'Automatisierte Workflows',
      '10 Nutzer, 3 Websites',
      'Prioritäts-Support',
    ],
  },
  {
    name: 'Enterprise',
    beschreibung: 'Für Organisationen mit komplexen Anforderungen und Volumen.',
    preisMonat: null, preisJahr: null,
    cta: 'Gespräch vereinbaren',
    features: [
      'Unbegrenzte Besucher & Nutzer',
      'Alles aus Growth, plus:',
      'API-Zugang & Webhooks',
      'SSO / SAML & Rollenverwaltung',
      'Dedizierter Customer Success Manager',
      'Individuelle AVV & Security-Review',
      'SLA mit 99,9 % Verfügbarkeit',
      'Onboarding & Schulung inklusive',
    ],
  },
]

export default function Pricing() {
  const [jaehrlich, setJaehrlich] = useState(true)

  return (
    <section id="preise" className="py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand/12 blur-[130px] rounded-full pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-sm font-semibold text-brand-light mb-3 tracking-wide uppercase">Preise</p>
          <h2 className="font-display text-3xl sm:text-[42px] font-bold text-white leading-tight tracking-tight">
            Faire Preise. Volle Transparenz.
          </h2>
          <p className="mt-4 text-slate-400 text-lg">
            14 Tage kostenlos testen — keine Kreditkarte, keine Vertragsfalle, monatlich kündbar.
          </p>

          <div className="mt-8 inline-flex items-center bg-surface border border-line rounded-full p-1">
            <button
              onClick={() => setJaehrlich(false)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition ${!jaehrlich ? 'bg-brand text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Monatlich
            </button>
            <button
              onClick={() => setJaehrlich(true)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition flex items-center gap-2 ${jaehrlich ? 'bg-brand text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Jährlich
              <span className="text-[10px] font-bold bg-mint/20 text-mint px-2 py-0.5 rounded-full">−20 %</span>
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-5 max-w-6xl mx-auto items-stretch">
          {plaene.map((p, i) => {
            const preis = jaehrlich ? p.preisJahr : p.preisMonat
            return (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={`relative rounded-2xl p-8 flex flex-col border transition-all duration-300 ${
                  p.highlight
                    ? 'bg-gradient-to-b from-brand/20 to-card border-brand/50 shadow-glow lg:-my-4 lg:py-12'
                    : 'bg-card border-line hover:border-slate-500/40'
                }`}
              >
                {p.highlight && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-xs font-bold bg-gradient-to-r from-brand to-brand-light text-white px-4 py-1.5 rounded-full shadow-glow whitespace-nowrap">
                    <Sparkles size={13} /> Am beliebtesten
                  </span>
                )}
                <h3 className="font-display font-bold text-white text-xl">{p.name}</h3>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed min-h-[42px]">{p.beschreibung}</p>

                <div className="mt-6 mb-8">
                  {preis !== null ? (
                    <div className="flex items-end gap-2">
                      <span className="font-display text-5xl font-extrabold text-white">{preis} €</span>
                      <span className="text-slate-500 text-sm mb-1.5">/ Monat{jaehrlich ? ', jährlich abgerechnet' : ''}</span>
                    </div>
                  ) : (
                    <span className="font-display text-4xl font-extrabold text-white">Individuell</span>
                  )}
                  {preis !== null && jaehrlich && (
                    <p className="mt-1.5 text-xs text-mint">statt {p.preisMonat} € — Sie sparen {(((p.preisMonat! - p.preisJahr!) / p.preisMonat!) * 100).toFixed(0)} %</p>
                  )}
                </div>

                <ul className="space-y-3 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-slate-300">
                      <Check size={16} className={`shrink-0 mt-0.5 ${p.highlight ? 'text-mint' : 'text-brand-light'}`} />
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href="#cta"
                  className={`mt-8 block text-center font-semibold py-3.5 rounded-xl transition ${
                    p.highlight
                      ? 'bg-brand hover:bg-brand-dark text-white shadow-glow'
                      : 'bg-white/5 hover:bg-white/10 border border-line text-white'
                  }`}
                >
                  {p.cta}
                </a>
              </motion.div>
            )
          })}
        </div>

        <p className="text-center text-sm text-slate-500 mt-10">
          Alle Preise zzgl. MwSt. · DSGVO-konforme Auftragsverarbeitung in allen Paketen inklusive.
        </p>
      </div>
    </section>
  )
}
