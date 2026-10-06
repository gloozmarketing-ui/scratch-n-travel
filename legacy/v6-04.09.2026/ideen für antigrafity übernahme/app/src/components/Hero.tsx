import { motion } from 'framer-motion'
import { ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react'
import DashboardMock from './DashboardMock'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

export default function Hero() {
  return (
    <section id="top" className="relative pt-40 pb-24 overflow-hidden">
      <div className="absolute inset-0 grid-bg" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-brand/20 blur-[140px] rounded-full pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-300 bg-white/5 border border-line rounded-full px-4 py-1.5 mb-7">
            <ShieldCheck size={14} className="text-mint" />
            DSGVO-konform · Serverstandort Deutschland · ISO 27001
          </motion.div>

          <motion.h1 variants={fadeUp} initial="hidden" animate="show" custom={1}
            className="font-display text-4xl sm:text-5xl lg:text-[64px] font-extrabold leading-[1.08] tracking-tight text-white">
            Verwandeln Sie anonyme Besucher in <span className="text-gradient">zahlende Kunden</span>
          </motion.h1>

          <motion.p variants={fadeUp} initial="hidden" animate="show" custom={2}
            className="mt-6 text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
            LeadPulse identifiziert die Unternehmen auf Ihrer Website, bewertet ihre Kaufbereitschaft
            in Echtzeit und liefert qualifizierte Leads direkt in Ihr CRM — ohne Formulare, ohne Cold Calls.
          </motion.p>

          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3}
            className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#cta"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand hover:bg-brand-dark text-white font-semibold px-8 py-4 rounded-xl transition shadow-glow text-[15px]">
              14 Tage kostenlos testen
              <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#produkt"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-line text-white font-semibold px-8 py-4 rounded-xl transition text-[15px]">
              Live-Demo ansehen
            </a>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4}
            className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] text-slate-500">
            {['Keine Kreditkarte nötig', 'Setup in 5 Minuten', 'Jederzeit kündbar'].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-mint" /> {t}
              </span>
            ))}
          </motion.div>
        </div>

        <div className="mt-16 max-w-5xl mx-auto">
          <DashboardMock />
        </div>
      </div>
    </section>
  )
}
