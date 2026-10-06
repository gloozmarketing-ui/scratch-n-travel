import { motion } from 'framer-motion'
import {
  Radar, Gauge, Workflow, Database, ShieldCheck, BarChart3, Bell, Users
} from 'lucide-react'

const features = [
  {
    icon: Radar,
    titel: 'Besucher-Identifikation',
    text: 'Erkennen Sie bis zu 40 % Ihrer anonymen B2B-Besucher — mit Firmenname, Branche, Größe und Ansprechpartnern.',
    badge: 'Kernfunktion',
  },
  {
    icon: Gauge,
    titel: 'KI-Lead-Scoring',
    text: 'Jeder Besuch wird in Echtzeit bewertet: Besuchsdauer, Seitenpfade, Wiederkehr und Firmendaten ergeben einen präzisen Score.',
    badge: 'KI-gestützt',
  },
  {
    icon: Workflow,
    titel: 'Automatisierte Workflows',
    text: 'Heiße Leads lösen automatisch Aktionen aus — E-Mail an den Vertrieb, Slack-Alert oder Aufgabe im CRM.',
    badge: null,
  },
  {
    icon: Database,
    titel: 'CRM-Integrationen',
    text: 'Nahtloser Sync mit HubSpot, Salesforce, Pipedrive und 50+ weiteren Tools. Einrichtung in unter 5 Minuten.',
    badge: null,
  },
  {
    icon: ShieldCheck,
    titel: 'DSGVO by Design',
    text: 'Verarbeitung ausschließlich auf Servern in Deutschland. AVV inklusive, keine Cookies nötig, ISO-27001-zertifiziert.',
    badge: 'Rechtssicher',
  },
  {
    icon: BarChart3,
    titel: 'Echtzeit-Analytics',
    text: 'Dashboards, die Ihr Vertriebsteam wirklich nutzt: Pipeline-Wert, Conversion-Pfade und Kanal-Performance auf einen Blick.',
    badge: null,
  },
  {
    icon: Bell,
    titel: 'Intent-Alerts',
    text: 'Sobald ein Zielkonto Ihre Preisseite besucht, weiß Ihr Vertrieb Bescheid — bevor der Wettbewerber anruft.',
    badge: null,
  },
  {
    icon: Users,
    titel: 'Ansprechpartner-Anreicherung',
    text: 'Automatische Anreicherung mit verifizierten Kontaktdaten der relevanten Entscheider im identifizierten Unternehmen.',
    badge: null,
  },
]

export default function Features() {
  return (
    <section id="funktionen" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl mb-16">
          <p className="text-sm font-semibold text-brand-light mb-3 tracking-wide uppercase">Funktionen</p>
          <h2 className="font-display text-3xl sm:text-[42px] font-bold text-white leading-tight tracking-tight">
            Alles, was Ihr Vertrieb braucht. Nichts, was ihn aufhält.
          </h2>
          <p className="mt-4 text-slate-400 text-lg leading-relaxed">
            Acht Module, ein Ziel: mehr qualifizierte Gespräche mit weniger Aufwand.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.titel}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: (i % 4) * 0.07 }}
              className="group noise-card p-6 hover:border-brand/40 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <span className="w-11 h-11 rounded-xl bg-brand/12 text-brand-light grid place-items-center group-hover:bg-brand group-hover:text-white transition-colors duration-300">
                  <f.icon size={20} />
                </span>
                {f.badge && (
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-mint bg-mint/10 border border-mint/20 rounded-full px-2.5 py-1">
                    {f.badge}
                  </span>
                )}
              </div>
              <h3 className="mt-5 font-display font-bold text-white text-[17px]">{f.titel}</h3>
              <p className="mt-2.5 text-sm text-slate-400 leading-relaxed">{f.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
