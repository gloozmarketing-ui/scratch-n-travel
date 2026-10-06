import { motion } from 'framer-motion'
import { Code2, Filter, Rocket } from 'lucide-react'

const steps = [
  {
    nr: '01',
    icon: Code2,
    titel: 'Snippet einbinden',
    text: 'Ein einziges Script-Tag auf Ihrer Website — fertig. Keine Entwickler nötig, keine Cookies, keine Einwilligungsbanner.',
    dauer: '5 Minuten',
  },
  {
    nr: '02',
    icon: Filter,
    titel: 'KI qualifiziert automatisch',
    text: 'LeadPulse erkennt Unternehmen, bewertet ihre Kaufbereitschaft und filtert irrelevanten Traffic heraus — vollautomatisch.',
    dauer: 'Ab dem ersten Besuch',
  },
  {
    nr: '03',
    icon: Rocket,
    titel: 'Vertrieb übernimmt',
    text: 'Qualifizierte Leads landen mit Kontaktdaten und Score direkt in Ihrem CRM. Ihr Team ruft an, wenn es heiß ist.',
    dauer: 'In Echtzeit',
  },
]

export default function HowItWorks() {
  return (
    <section id="ablauf" className="py-24 sm:py-32 bg-surface/30 border-y border-line relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-mint/8 blur-[120px] rounded-full pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold text-brand-light mb-3 tracking-wide uppercase">So funktioniert’s</p>
          <h2 className="font-display text-3xl sm:text-[42px] font-bold text-white leading-tight tracking-tight">
            Von null auf erste Leads — noch heute
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {steps.map((s, i) => (
            <motion.div
              key={s.nr}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="relative noise-card p-8"
            >
              <span className="absolute top-6 right-7 font-display text-5xl font-extrabold text-white/5 select-none">
                {s.nr}
              </span>
              <span className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand to-mint/70 grid place-items-center text-white shadow-glow">
                <s.icon size={22} />
              </span>
              <h3 className="mt-6 font-display font-bold text-white text-xl">{s.titel}</h3>
              <p className="mt-3 text-slate-400 leading-relaxed text-[15px]">{s.text}</p>
              <span className="inline-block mt-5 text-xs font-semibold text-mint bg-mint/10 border border-mint/20 rounded-full px-3 py-1.5">
                {s.dauer}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Kennzahlen */}
        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-px bg-line rounded-2xl overflow-hidden border border-line">
          {[
            { wert: '+38 %', label: 'mehr qualifizierte Leads im Schnitt' },
            { wert: '40 %', label: 'der B2B-Besucher werden identifiziert' },
            { wert: '5 Min.', label: 'bis zur Einrichtung' },
            { wert: '2.400+', label: 'B2B-Unternehmen nutzen LeadPulse' },
          ].map((s) => (
            <div key={s.label} className="bg-card px-6 py-8 text-center">
              <p className="font-display text-3xl sm:text-4xl font-extrabold text-gradient">{s.wert}</p>
              <p className="mt-2 text-sm text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
