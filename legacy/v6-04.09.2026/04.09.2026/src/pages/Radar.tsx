import { useState } from 'react'
import { hazards, scams } from '../data/data'

type Tab = 'hazards' | 'scams'

export default function Radar() {
  const [tab, setTab] = useState<Tab>('hazards')
  const [areaFilter, setAreaFilter] = useState('All')
  const [showReport, setShowReport] = useState(false)
  const [reportSubmitted, setReportSubmitted] = useState(false)

  const hazardAreas = ['All', ...Array.from(new Set(hazards.map(h => h.area)))]
  const filteredHazards = areaFilter === 'All' ? hazards : hazards.filter(h => h.area === areaFilter)

  const levelBg: Record<string,string> = {
    high: 'border-red-500/30 bg-red-500/5',
    medium: 'border-yellow-500/30 bg-yellow-500/5',
    low: 'border-emerald-500/30 bg-emerald-500/5',
  }
  const levelLabel: Record<string,string> = {
    high: 'text-red-400 border-red-400/30 bg-red-400/10',
    medium: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
    low: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',
  }

  return (
    <div>
      <div className="page-header">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="coord mb-1">Live Community Intelligence · Updated hourly</p>
            <h1 className="font-display text-3xl text-[#F4E4C1] font-bold">Hazard & Scam Radar</h1>
            <p className="font-script text-[rgba(201,168,76,0.5)] text-lg mt-0.5">know before you go</p>
          </div>
          <button onClick={() => setShowReport(!showReport)} className="btn btn-secondary">+ Report an Issue</button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Report form */}
        {showReport && (
          <div className="card p-6">
            <h2 className="font-display text-[#C9A84C] font-bold mb-4">Submit a Community Report</h2>
            {reportSubmitted ? (
              <div className="text-center py-6">
                <p className="text-3xl mb-2">✅</p>
                <p className="font-display text-[#F4E4C1] text-lg font-bold">Report received</p>
                <p className="font-body text-[#8A9AAA] mt-2">Reviewed within 2h. Confirmed reports appear on the radar with your username.</p>
                <button onClick={() => { setShowReport(false); setReportSubmitted(false) }} className="btn btn-secondary mt-4">Close</button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-[0.65rem] text-[rgba(201,168,76,0.6)] uppercase tracking-widest block mb-1">Report Type</label>
                  <select className="field">
                    <option>Hazard (Natural)</option>
                    <option>Hazard (Infrastructure)</option>
                    <option>Scam / Tourist Trap</option>
                    <option>Crime / Safety Risk</option>
                    <option>Local Tip</option>
                  </select>
                </div>
                <div>
                  <label className="font-mono text-[0.65rem] text-[rgba(201,168,76,0.6)] uppercase tracking-widest block mb-1">Location</label>
                  <input className="field" placeholder="e.g. Praia do Norte, Nazaré" />
                </div>
                <div>
                  <label className="font-mono text-[0.65rem] text-[rgba(201,168,76,0.6)] uppercase tracking-widest block mb-1">Severity</label>
                  <select className="field">
                    <option>🔴 High Risk</option>
                    <option>🟡 Medium Risk</option>
                    <option>🟢 Advisory / Tip</option>
                  </select>
                </div>
                <div>
                  <label className="font-mono text-[0.65rem] text-[rgba(201,168,76,0.6)] uppercase tracking-widest block mb-1">When did this occur?</label>
                  <input type="datetime-local" className="field" />
                </div>
                <div className="md:col-span-2">
                  <label className="font-mono text-[0.65rem] text-[rgba(201,168,76,0.6)] uppercase tracking-widest block mb-1">Description</label>
                  <textarea className="field h-24 resize-none" placeholder="Describe what you observed, how to avoid it, and any advice for other travellers…" />
                </div>
                <div className="md:col-span-2 flex gap-3">
                  <button onClick={() => setReportSubmitted(true)} className="btn btn-primary flex-1">Submit Report</button>
                  <button onClick={() => setShowReport(false)} className="btn btn-ghost">Cancel</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1.5">
          {([['hazards','🚨 Hazard Radar'],['scams','🟡 Scam Radar']] as const).map(([t, label]) => (
            <button key={t} onClick={() => setTab(t)}
              className={`btn text-[0.7rem] ${tab === t ? 'btn-primary' : 'btn-ghost'}`}>{label}</button>
          ))}
        </div>

        {/* Hazards */}
        {tab === 'hazards' && (
          <div className="space-y-4">
            {/* Summary */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { level:'high', label:'High Risk', count: hazards.filter(h=>h.level==='high').length, color:'text-red-400' },
                { level:'medium', label:'Medium', count: hazards.filter(h=>h.level==='medium').length, color:'text-yellow-400' },
                { level:'low', label:'Advisory', count: hazards.filter(h=>h.level==='low').length, color:'text-emerald-400' },
              ].map(s => (
                <div key={s.level} className="card p-4 text-center">
                  <p className={`font-display font-black text-3xl ${s.color}`}>{s.count}</p>
                  <p className="font-mono text-[0.65rem] text-[#8A9AAA] uppercase tracking-wide">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Area filter */}
            <div className="flex gap-2 flex-wrap">
              {hazardAreas.map(a => (
                <button key={a} onClick={() => setAreaFilter(a)}
                  className={`btn text-[0.65rem] py-1 px-3 ${areaFilter === a ? 'btn-primary' : 'btn-ghost'}`}>{a}</button>
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
                        <span className={`font-mono text-[0.58rem] border px-2 py-0.5 rounded-full flex-shrink-0 ${levelLabel[h.level]}`}>
                          {h.level.toUpperCase()}
                        </span>
                      </div>
                      <p className="font-body text-[#8A9AAA] text-sm leading-relaxed mb-2">{h.desc}</p>
                      <div className="flex items-center gap-4">
                        <span className="coord">{h.area}</span>
                        <span className="font-mono text-[0.62rem] text-[#8A9AAA]">{h.time}</span>
                        <span className="font-mono text-[0.62rem] text-[rgba(201,168,76,0.5)] border border-[rgba(201,168,76,0.15)] px-1.5 py-0.5 rounded">{h.category}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scams */}
        {tab === 'scams' && (
          <div className="space-y-3">
            {scams.map(s => (
              <div key={s.id} className="card p-5">
                <div className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0">{s.icon}</span>
                  <div className="flex-1">
                    <p className="font-display text-[#F4E4C1] font-bold text-sm mb-1">{s.title}</p>
                    <p className="coord mb-2">📍 {s.location}</p>
                    <p className="font-body text-[#8A9AAA] text-sm leading-relaxed mb-2">{s.desc}</p>
                    {s.reports > 0 && (
                      <span className="font-mono text-[0.6rem] text-[rgba(201,168,76,0.6)] border border-[rgba(201,168,76,0.15)] px-2 py-0.5 rounded-full">
                        {s.reports} community reports
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
