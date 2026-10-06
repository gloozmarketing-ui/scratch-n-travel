import { motion } from 'framer-motion'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts'
import { ArrowUpRight, Building2, Globe, Mail, MousePointerClick, Phone, TrendingUp } from 'lucide-react'

const data = [
  { m: 'Jan', leads: 128, qualifiziert: 61 },
  { m: 'Feb', leads: 154, qualifiziert: 74 },
  { m: 'Mär', leads: 171, qualifiziert: 88 },
  { m: 'Apr', leads: 203, qualifiziert: 104 },
  { m: 'Mai', leads: 238, qualifiziert: 129 },
  { m: 'Jun', leads: 265, qualifiziert: 151 },
  { m: 'Jul', leads: 312, qualifiziert: 183 },
]

const hotLeads = [
  { firma: 'Nordwind Logistics GmbH', branche: 'Logistik', score: 94, aktion: 'Preisseite · 4:12 Min.' },
  { firma: 'Bergmann & Söhne AG', branche: 'Maschinenbau', score: 91, aktion: 'Case Study gelesen' },
  { firma: 'Helios Energie GmbH', branche: 'Energie', score: 87, aktion: 'Demo-Video · 2×' },
]

const kpis = [
  { label: 'Leads diesen Monat', wert: '312', delta: '+17,7 %', icon: TrendingUp },
  { label: 'Qualifiziert (SQL)', wert: '183', delta: '+21,2 %', icon: MousePointerClick },
  { label: 'Identifizierte Firmen', wert: '1.204', delta: '+9,4 %', icon: Building2 },
  { label: 'Ø Lead-Score', wert: '76', delta: '+5 Pkt.', icon: Globe },
]

export default function DashboardMock() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      <div className="absolute -inset-6 bg-gradient-to-r from-brand/25 via-mint/15 to-brand/25 blur-3xl rounded-[2rem]" />
      <div className="relative noise-card overflow-hidden">
        {/* Fensterleiste */}
        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-line bg-surface/60">
          <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
          <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
          <span className="w-3 h-3 rounded-full bg-[#28C840]" />
          <div className="ml-4 flex items-center gap-2 text-xs text-slate-500 bg-ink/60 rounded-lg px-3 py-1.5 border border-line">
            <Globe size={12} />
            app.leadpulse.de/dashboard
          </div>
          <span className="ml-auto hidden sm:flex items-center gap-1.5 text-xs text-mint font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse" /> Live
          </span>
        </div>

        <div className="p-5 sm:p-6 grid gap-5">
          {/* KPI-Karten */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {kpis.map((k) => (
              <div key={k.label} className="bg-ink/50 border border-line rounded-xl p-4">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[11px] font-medium uppercase tracking-wide">{k.label}</span>
                  <k.icon size={14} />
                </div>
                <div className="mt-2 flex items-end gap-2">
                  <span className="text-2xl font-display font-bold text-white">{k.wert}</span>
                  <span className="text-xs text-mint font-semibold flex items-center mb-1">
                    <ArrowUpRight size={12} /> {k.delta}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-5 gap-5">
            {/* Chart */}
            <div className="lg:col-span-3 bg-ink/50 border border-line rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-white">Lead-Entwicklung</h4>
                <div className="flex gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-brand-light" /> Alle Leads</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-mint" /> Qualifiziert</span>
                </div>
              </div>
              <div className="h-48 sm:h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data} margin={{ top: 8, right: 4, left: -22, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gLeads" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7C92FF" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#7C92FF" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gQual" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#34D399" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#34D399" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="m" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: '#111726', border: '1px solid rgba(148,163,184,0.15)', borderRadius: 12, fontSize: 12 }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Area isAnimationActive={false} type="monotone" dataKey="leads" stroke="#7C92FF" strokeWidth={2.5} fill="url(#gLeads)" />
                    <Area isAnimationActive={false} type="monotone" dataKey="qualifiziert" stroke="#34D399" strokeWidth={2.5} fill="url(#gQual)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Heiße Leads */}
            <div className="lg:col-span-2 bg-ink/50 border border-line rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-white">Heiße Leads</h4>
                <span className="text-[11px] text-brand-light font-medium">Jetzt auf Ihrer Website</span>
              </div>
              <div className="space-y-2.5">
                {hotLeads.map((l) => (
                  <div key={l.firma} className="flex items-center gap-3 bg-surface/70 border border-line rounded-lg px-3 py-2.5">
                    <span className="w-8 h-8 rounded-lg bg-brand/15 text-brand-light grid place-items-center shrink-0">
                      <Building2 size={15} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-white truncate">{l.firma}</p>
                      <p className="text-[11px] text-slate-500 truncate">{l.aktion}</p>
                    </div>
                    <span className={`ml-auto text-xs font-bold ${l.score >= 90 ? 'text-mint' : 'text-amber'}`}>{l.score}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <span className="flex-1 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 bg-surface/70 border border-line rounded-lg py-2">
                  <Mail size={12} /> E-Mail an Vertrieb
                </span>
                <span className="flex-1 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 bg-surface/70 border border-line rounded-lg py-2">
                  <Phone size={12} /> CRM-Sync aktiv
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
