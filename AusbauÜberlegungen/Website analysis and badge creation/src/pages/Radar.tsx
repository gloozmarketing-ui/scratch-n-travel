import React, { useState } from 'react'
import { hazards, scams } from '../data/data'
import { useTravel } from '../context/TravelContext'

type Tab = 'hazards' | 'scams' | 'esim'

export default function Radar() {
  const { triggerHaptic } = useTravel()
  const [tab, setTab] = useState<Tab>('hazards')
  const [areaFilter, setAreaFilter] = useState('All')
  const [showReport, setShowReport] = useState(false)
  const [reportSubmitted, setReportSubmitted] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)

  const hazardAreas = ['All', ...Array.from(new Set(hazards.map(h => h.area)))]
  const filteredHazards = areaFilter === 'All' ? hazards : hazards.filter(h => h.area === areaFilter)

  const levelBg: Record<string, string> = {
    high: 'border-red-500/30 bg-red-500/5',
    medium: 'border-yellow-500/30 bg-yellow-500/5',
    low: 'border-emerald-500/30 bg-emerald-500/5',
  }
  const levelLabel: Record<string, string> = {
    high: 'text-red-400 border-red-400/30 bg-red-400/10',
    medium: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
    low: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',
  }

  const handleCopyEsim = () => {
    triggerHaptic(15)
    navigator.clipboard.writeText('SCRATCH10')
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2500)
  }

  return (
    <div>
      <div className="page-header">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="coord mb-1">Live Community Intelligence · eSIM Connectivity · Updated Hourly</p>
            <h1 className="font-display text-3xl text-[#F4E4C1] font-bold">Safety Radar &amp; Travel Connectivity</h1>
            <p className="font-script text-[rgba(201,168,76,0.5)] text-lg mt-0.5">know before you go</p>
          </div>
          <button
            onClick={() => {
              triggerHaptic(10)
              setShowReport(!showReport)
            }}
            className="btn btn-secondary font-bold"
          >
            + Vorfall / Scam melden
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6 pb-24 md:pb-8">
        {/* Report form */}
        {showReport && (
          <div className="card p-6 border-[rgba(201,168,76,0.3)] shadow-2xl">
            <h2 className="font-display text-[#C9A84C] font-bold mb-4">Community-Sicherheitsbericht einreichen</h2>
            {reportSubmitted ? (
              <div className="text-center py-6">
                <p className="text-3xl mb-2">✅</p>
                <p className="font-display text-[#F4E4C1] text-lg font-bold">Meldung erfolgreich eingereicht</p>
                <p className="font-body text-[#8A9AAA] mt-2">
                  Wird innerhalb von 2 Stunden vom Hermes-Audit-Team geprüft und live auf dem Radar geschaltet.
                </p>
                <button
                  onClick={() => {
                    setShowReport(false)
                    setReportSubmitted(false)
                  }}
                  className="btn btn-secondary mt-4"
                >
                  Schließen
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-[0.65rem] text-[rgba(201,168,76,0.6)] uppercase tracking-widest block mb-1">
                    Art der Meldung
                  </label>
                  <select className="field">
                    <option>Naturgefahr (Klippenabbruch, Riptide, Sturm)</option>
                    <option>Infrastruktur (Wegsperrung, Brückenschaden)</option>
                    <option>Scam / Touristenfalle</option>
                    <option>Sicherheitsrisiko / Parkplatzaufbruch</option>
                    <option>Lokaler Sicherheitstipp</option>
                  </select>
                </div>
                <div>
                  <label className="font-mono text-[0.65rem] text-[rgba(201,168,76,0.6)] uppercase tracking-widest block mb-1">
                    Ort &amp; Region
                  </label>
                  <input className="field" placeholder="z. B. Praia do Magoito, Sintra" />
                </div>
                <div>
                  <label className="font-mono text-[0.65rem] text-[rgba(201,168,76,0.6)] uppercase tracking-widest block mb-1">
                    Risikostufe
                  </label>
                  <select className="field">
                    <option>🔴 Hohes Risiko (High)</option>
                    <option>🟡 Moderat (Medium)</option>
                    <option>🟢 Hinweis (Advisory)</option>
                  </select>
                </div>
                <div>
                  <label className="font-mono text-[0.65rem] text-[rgba(201,168,76,0.6)] uppercase tracking-widest block mb-1">
                    Zeitpunkt
                  </label>
                  <input type="datetime-local" className="field" />
                </div>
                <div className="md:col-span-2">
                  <label className="font-mono text-[0.65rem] text-[rgba(201,168,76,0.6)] uppercase tracking-widest block mb-1">
                    Beschreibung &amp; Ausweichempfehlung
                  </label>
                  <textarea
                    className="field h-24 resize-none"
                    placeholder="Beschreibe, was du beobachtet hast, wie man die Gefahr meidet und welche alternative Route sicher ist…"
                  />
                </div>
                <div className="md:col-span-2 flex gap-3">
                  <button onClick={() => setReportSubmitted(true)} className="btn btn-primary flex-1 font-bold">
                    Meldung absenden (+50 XP)
                  </button>
                  <button onClick={() => setShowReport(false)} className="btn btn-ghost">
                    Abbrechen
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 border-b border-[rgba(201,168,76,0.2)] pb-2 flex-wrap">
          {[
            ['hazards', '🚨 Hazard Radar'],
            ['scams', '🟡 Scam Radar'],
            ['esim', '📶 Global Travel eSIM (190+ Länder)'],
          ].map(([t, label]) => (
            <button
              key={t}
              onClick={() => {
                triggerHaptic(10)
                setTab(t as Tab)
              }}
              className={`btn text-xs py-1.5 px-3.5 ${
                tab === t ? 'btn-primary font-bold shadow-md' : 'btn-ghost'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* TAB 1: HAZARDS */}
        {tab === 'hazards' && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {[
                { level: 'high', label: 'Hohes Risiko', count: hazards.filter(h => h.level === 'high').length, color: 'text-red-400' },
                { level: 'medium', label: 'Moderat', count: hazards.filter(h => h.level === 'medium').length, color: 'text-yellow-400' },
                { level: 'low', label: 'Hinweis', count: hazards.filter(h => h.level === 'low').length, color: 'text-emerald-400' },
              ].map(s => (
                <div key={s.level} className="card p-4 text-center">
                  <p className={`font-display font-black text-3xl ${s.color}`}>{s.count}</p>
                  <p className="font-mono text-[0.65rem] text-[#8A9AAA] uppercase tracking-wide">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-2 flex-wrap">
              {hazardAreas.map(a => (
                <button
                  key={a}
                  onClick={() => {
                    triggerHaptic(8)
                    setAreaFilter(a)
                  }}
                  className={`btn text-[0.65rem] py-1 px-3 ${areaFilter === a ? 'btn-primary font-bold' : 'btn-ghost'}`}
                >
                  {a}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {filteredHazards.map(h => (
                <div key={h.id} className={`card p-4 border ${levelBg[h.level]}`}>
                  <div className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0">{h.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="font-display text-[#F4E4C1] font-bold text-sm">{h.title}</p>
                        <span
                          className={`font-mono text-[0.58rem] border px-2 py-0.5 rounded-full flex-shrink-0 font-bold ${levelLabel[h.level]}`}
                        >
                          {h.level.toUpperCase()}
                        </span>
                      </div>
                      <p className="font-body text-[#8A9AAA] text-sm leading-relaxed mb-2">{h.desc}</p>
                      <div className="flex items-center gap-4 text-xs">
                        <span className="coord">{h.area}</span>
                        <span className="font-mono text-[0.62rem] text-[#8A9AAA]">{h.time}</span>
                        <span className="font-mono text-[0.62rem] text-[rgba(201,168,76,0.6)] border border-[rgba(201,168,76,0.2)] px-1.5 py-0.5 rounded">
                          {h.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: SCAMS */}
        {tab === 'scams' && (
          <div className="space-y-3">
            {scams.map(s => (
              <div key={s.id} className="card p-5 border-[rgba(201,168,76,0.2)]">
                <div className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0">{s.icon}</span>
                  <div className="flex-1">
                    <p className="font-display text-[#F4E4C1] font-bold text-sm mb-1">{s.title}</p>
                    <p className="coord mb-2">📍 {s.location}</p>
                    <p className="font-body text-[#8A9AAA] text-sm leading-relaxed mb-2">{s.desc}</p>
                    {s.reports > 0 && (
                      <span className="font-mono text-[0.6rem] text-[#C9A84C] border border-[rgba(201,168,76,0.3)] bg-[#0C1825] px-2.5 py-0.5 rounded-full">
                        {s.reports} Community-Bestätigungen
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: eSIM AFFILIATE PARTNER */}
        {tab === 'esim' && (
          <div className="space-y-6">
            <div className="parchment rounded-2xl p-6 sm:p-8 text-[#2C1810] shadow-xl border-2 border-[rgba(139,58,42,0.3)]">
              <div className="max-w-2xl">
                <span className="font-mono text-xs text-[#8B3A2A] font-bold uppercase tracking-wider">
                  Partner-Angebot · 0% Roaming-Gebühren
                </span>
                <h3 className="font-display text-2xl font-black mt-1 mb-2">
                  Reise-eSIM für 190+ Länder in 60 Sekunden aktiviert
                </h3>
                <p className="font-body text-sm leading-relaxed mb-4">
                  Bleibe auf Klippenpfaden, in Schluchten und bei Strand-Sessions immer vernetzt für Notfall-GPS und
                  Secret-Spot-Navigation. Kein SIM-Karten-Tausch nötig — digital scannen und sofort surfen.
                </p>

                <div className="bg-[rgba(44,24,16,0.08)] p-4 rounded-xl flex items-center justify-between gap-4 flex-wrap mb-4 border border-[rgba(139,58,42,0.2)]">
                  <div>
                    <p className="font-mono text-xs text-[#8B3A2A] font-bold">10% Exklusiv-Rabattcode:</p>
                    <p className="font-display font-black text-xl text-[#2C1810]">SCRATCH10</p>
                  </div>
                  <button onClick={handleCopyEsim} className="btn btn-primary text-xs py-2 px-4 font-bold shadow">
                    {copiedCode ? '✓ Code kopiert!' : 'Code kopieren & einlösen'}
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
                  <div className="bg-white/60 p-2.5 rounded-lg border border-[rgba(139,58,42,0.15)]">
                    <p className="font-bold text-[#8B3A2A]">🇵🇹 Portugal &amp; EU</p>
                    <p>ab € 4,50 / 5 GB</p>
                  </div>
                  <div className="bg-white/60 p-2.5 rounded-lg border border-[rgba(139,58,42,0.15)]">
                    <p className="font-bold text-[#8B3A2A]">🇯🇵 Japan &amp; Asien</p>
                    <p>ab € 6,00 / 10 GB</p>
                  </div>
                  <div className="bg-white/60 p-2.5 rounded-lg border border-[rgba(139,58,42,0.15)]">
                    <p className="font-bold text-[#8B3A2A]">🇺🇸 USA &amp; Global</p>
                    <p>ab € 8,00 / Unbegrenzt</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
