import { motion } from 'framer-motion'
import { Quote, Star } from 'lucide-react'

const stimmen = [
  {
    zitat: 'Wir haben im ersten Quartal 47 qualifizierte Leads aus unserem bestehenden Traffic gewonnen — ohne einen Euro mehr für Werbung auszugeben. Die Intent-Alerts sind Gold wert.',
    name: 'Markus Feldmann',
    rolle: 'Head of Sales, Nordwind Logistics GmbH',
    stern: 5,
  },
  {
    zitat: 'Endlich ein Tool, das unser Vertriebsteam wirklich täglich öffnet. Das Scoring ist erstaunlich treffsicher — wir rufen nur noch an, wenn es sich lohnt.',
    name: 'Dr. Julia Berger',
    rolle: 'Geschäftsführerin, Bergmann & Söhne AG',
    stern: 5,
  },
  {
    zitat: 'Die DSGVO-Konformität war für uns als Energieunternehmen das entscheidende Kriterium. Server in Deutschland, sauberer AVV, kein Cookie-Stress. Einrichtung: 10 Minuten.',
    name: 'Thomas Reiter',
    rolle: 'Leiter Digital Sales, Helios Energie GmbH',
    stern: 5,
  },
]

export default function Testimonials() {
  return (
    <section className="py-24 sm:py-32 bg-surface/30 border-y border-line">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold text-brand-light mb-3 tracking-wide uppercase">Kundenstimmen</p>
          <h2 className="font-display text-3xl sm:text-[42px] font-bold text-white leading-tight tracking-tight">
            Vertriebsteams, die liefern müssen, vertrauen LeadPulse
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {stimmen.map((s, i) => (
            <motion.figure
              key={s.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="noise-card p-8 flex flex-col"
            >
              <Quote size={28} className="text-brand-light/60" />
              <div className="flex gap-1 mt-4">
                {Array.from({ length: s.stern }).map((_, j) => (
                  <Star key={j} size={15} className="text-amber" fill="currentColor" />
                ))}
              </div>
              <blockquote className="mt-4 text-slate-300 leading-relaxed text-[15px] flex-1">
                „{s.zitat}"
              </blockquote>
              <figcaption className="mt-6 pt-5 border-t border-line">
                <p className="font-semibold text-white text-sm">{s.name}</p>
                <p className="text-slate-500 text-[13px] mt-0.5">{s.rolle}</p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}
