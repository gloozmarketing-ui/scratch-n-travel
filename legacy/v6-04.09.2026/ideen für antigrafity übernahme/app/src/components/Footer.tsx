import { motion } from 'framer-motion'
import { ArrowRight, Zap, Linkedin, Twitter, Youtube } from 'lucide-react'

export function CTA() {
  return (
    <section id="cta" className="py-24 sm:py-32 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-dark via-brand to-mint/80 p-12 sm:p-20 text-center"
        >
          <div className="absolute inset-0 grid-bg opacity-60" />
          <div className="relative">
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight max-w-2xl mx-auto">
              Ihre nächsten Kunden besuchen Sie gerade. Erkennen Sie sie.
            </h2>
            <p className="mt-5 text-white/85 text-lg max-w-xl mx-auto">
              Starten Sie jetzt Ihre 14-tägige Testphase — Setup in 5 Minuten, erste Leads noch heute.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#top"
                className="group inline-flex items-center gap-2 bg-white text-ink font-bold px-8 py-4 rounded-xl hover:bg-slate-100 transition text-[15px]"
              >
                Jetzt kostenlos starten
                <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#preise"
                className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold px-8 py-4 rounded-xl transition text-[15px]"
              >
                Preise ansehen
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default function Footer() {
  const cols = [
    {
      titel: 'Produkt',
      links: ['Besucher-Identifikation', 'KI-Lead-Scoring', 'Integrationen', 'Preise', 'Changelog'],
    },
    {
      titel: 'Ressourcen',
      links: ['Blog', 'Case Studies', 'B2B-Lead-Guide 2026', 'Webinare', 'API-Dokumentation'],
    },
    {
      titel: 'Unternehmen',
      links: ['Über uns', 'Karriere', 'Partnerprogramm', 'Presse', 'Kontakt'],
    },
    {
      titel: 'Rechtliches',
      links: ['Impressum', 'Datenschutz', 'AGB', 'AVV-Muster', 'Cookie-Richtlinie'],
    },
  ]

  return (
    <footer className="border-t border-line bg-surface/40">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid lg:grid-cols-6 gap-10">
          <div className="lg:col-span-2">
            <a href="#top" className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand to-mint grid place-items-center">
                <Zap size={18} className="text-white" fill="currentColor" />
              </span>
              <span className="font-display font-bold text-lg text-white">LeadPulse</span>
            </a>
            <p className="mt-4 text-sm text-slate-500 leading-relaxed max-w-xs">
              Die DSGVO-konforme Plattform für B2B-Leadgenerierung. Entwickelt und gehostet in Deutschland.
            </p>
            <div className="mt-6 flex gap-3">
              {[Linkedin, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#top" className="w-9 h-9 rounded-lg bg-white/5 border border-line grid place-items-center text-slate-400 hover:text-white hover:border-brand/50 transition">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
          {cols.map((c) => (
            <div key={c.titel}>
              <h4 className="text-sm font-semibold text-white mb-4">{c.titel}</h4>
              <ul className="space-y-2.5">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#top" className="text-sm text-slate-500 hover:text-slate-300 transition">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 pt-8 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-slate-600">
          <p>© 2026 LeadPulse GmbH · Frankfurt am Main</p>
          <p className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-mint" /> Alle Systeme betriebsbereit · 99,98 % Uptime
          </p>
        </div>
      </div>
    </footer>
  )
}
