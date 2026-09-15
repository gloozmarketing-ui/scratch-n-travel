import { useState } from 'react'
import { cities, businessCategories } from '../data/data'

export default function Host() {
  const [step, setStep] = useState(1)
  const [applied, setApplied] = useState(false)
  const [form, setForm] = useState({ business: '', category: businessCategories[0], city: 'Lisbon', website: '', name: '', email: '', desc: '' })

  const tierColor = (tier: string) =>
    tier === 'Gold' ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30' :
    tier === 'Silver' ? 'text-slate-300 bg-slate-300/10 border-slate-300/30' :
    'text-amber-600 bg-amber-600/10 border-amber-600/30'

  return (
    <div>
      <div className="page-header">
        <p className="coord mb-1">B2B Partner Programme · Zero Commission</p>
        <h1 className="font-display text-3xl text-[#F4E4C1] font-bold">Host Portal</h1>
        <p className="font-script text-[rgba(201,168,76,0.5)] text-lg mt-0.5">list your business — keep every cent</p>
      </div>

      <div className="p-6 space-y-8">
        {/* Hero value prop */}
        <div className="parchment rounded-xl p-7 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 opacity-5 bg-[radial-gradient(circle,#8B3A2A,transparent_70%)]" />
          <div className="grid md:grid-cols-3 gap-6 relative z-10">
            <div className="md:col-span-2">
              <p className="font-script text-2xl text-[#8B3A2A] mb-1">No more 15–20% platform fees</p>
              <h2 className="font-display text-2xl text-[#2C1810] font-black mb-3">Flat monthly fee. Zero commission. Your guests, your revenue.</h2>
              <p className="font-body text-[#2C1810] leading-relaxed mb-4">Scratch'n'Travel connects you directly with quality travellers who seek authentic experiences — not package tourists. No booking fee on any transaction. Ever.</p>
              <div className="flex gap-3 flex-wrap">
                <button onClick={() => document.getElementById('apply-form')?.scrollIntoView({behavior:'smooth'})}
                  className="btn btn-parchment" style={{border:'1px solid rgba(139,58,42,0.3)'}}>
                  Apply as Host Partner →
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[['€0','Commission','(others charge 15–20%)'],['Gold','Verified Badge','on your listing'],['25%','Merch Discount','for your guests'],['0','Booking','platform dependency']].map(([v,l,sub]) => (
                <div key={l} className="bg-[rgba(44,24,16,0.07)] rounded-xl p-3 text-center border border-[rgba(139,58,42,0.15)]">
                  <p className="font-display text-[#C9A84C] text-xl font-black">{v}</p>
                  <p className="font-display text-[#2C1810] text-xs font-bold">{l}</p>
                  <p className="font-mono text-[0.55rem] text-[#8B3A2A]">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* City availability */}
        <div>
          <div className="section-divider mb-5"><span className="font-mono text-[0.68rem] tracking-widest">Beta City Availability</span></div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cities.map(c => (
              <div key={c.name} className="card p-4 flex items-center gap-4">
                <span className="text-2xl">{c.flag}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-display text-[#F4E4C1] font-bold">{c.name}</p>
                    <span className={`font-mono text-[0.58rem] border px-1.5 py-0.5 rounded-full ${tierColor(c.tier)}`}>{c.tier}</span>
                  </div>
                  <div className="flex gap-1 mb-1">
                    {Array.from({length: c.total}).map((_,i) => (
                      <div key={i} className={`h-2 flex-1 rounded-sm ${i < c.taken ? 'bg-[rgba(201,168,76,0.2)]' : 'gold-gradient'}`} />
                    ))}
                  </div>
                  <p className="font-mono text-[0.62rem] text-[#8A9AAA]">
                    {c.total - c.taken > 0 ? <span className="text-emerald-400">{c.total - c.taken} slot{c.total - c.taken !== 1 ? 's' : ''} open</span> : <span className="text-red-400">Full — join waitlist</span>}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Business categories */}
        <div>
          <div className="section-divider mb-5"><span className="font-mono text-[0.68rem] tracking-widest">Business Categories (15+)</span></div>
          <div className="flex flex-wrap gap-2">
            {businessCategories.map(cat => (
              <span key={cat} className="font-body text-sm border border-[rgba(201,168,76,0.2)] text-[#8A9AAA] hover:text-[#C9A84C] hover:border-[rgba(201,168,76,0.45)] cursor-pointer px-3 py-1.5 rounded-full transition-all">
                {cat}
              </span>
            ))}
          </div>
        </div>

        {/* Features */}
        <div>
          <div className="section-divider mb-5"><span className="font-mono text-[0.68rem] tracking-widest">What You Get</span></div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {icon:'💎', title:'Gold Verified Badge', desc:'Stand out with a community-verified gold badge on your listing'},
              {icon:'📊', title:'Analytics Dashboard', desc:'Bookings, views, conversion rates, and guest demographics'},
              {icon:'💬', title:'Direct Messaging', desc:'Chat directly with guests before and after their visit'},
              {icon:'🏷️', title:'Merch Discount', desc:'25% off all physical badge merch to gift to your guests'},
            ].map(f => (
              <div key={f.title} className="card p-5">
                <p className="text-2xl mb-3">{f.icon}</p>
                <p className="font-display text-[#C9A84C] font-bold text-sm mb-1">{f.title}</p>
                <p className="font-body text-[#8A9AAA] text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Application form */}
        <div id="apply-form" className="card p-6">
          <h2 className="font-display text-[#C9A84C] text-xl font-bold mb-2">Apply as Host Partner</h2>
          <p className="font-body text-[#8A9AAA] mb-6">Applications reviewed within 48h. Limited city slots — apply early.</p>

          {applied ? (
            <div className="text-center py-10">
              <p className="text-4xl mb-4">🎉</p>
              <p className="font-display text-[#F4E4C1] text-2xl font-bold mb-2">Application received!</p>
              <p className="font-body text-[#8A9AAA] max-w-md mx-auto">We'll review your application within 48h and contact you at <span className="text-[#C9A84C]">{form.email || 'your email'}</span>. Check your inbox for a confirmation.</p>
            </div>
          ) : (
            <div>
              {/* Step indicators */}
              <div className="flex items-center gap-3 mb-8">
                {[1,2,3].map(s => (
                  <div key={s} className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold border ${step >= s ? 'gold-gradient text-[#0C1825] border-transparent' : 'border-[rgba(201,168,76,0.2)] text-[#8A9AAA]'}`}>{s}</div>
                    <span className={`font-mono text-[0.62rem] ${step >= s ? 'text-[#C9A84C]' : 'text-[#8A9AAA]'}`}>{['Business','Contact','Submit'][s-1]}</span>
                    {s < 3 && <div className="h-px w-8 bg-[rgba(201,168,76,0.15)]" />}
                  </div>
                ))}
              </div>

              {step === 1 && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="font-mono text-[0.65rem] text-[rgba(201,168,76,0.6)] uppercase tracking-widest block mb-1">Business Name</label>
                    <input value={form.business} onChange={e => setForm(p=>({...p,business:e.target.value}))} className="field" placeholder="e.g. Surf School Ericeira" />
                  </div>
                  <div>
                    <label className="font-mono text-[0.65rem] text-[rgba(201,168,76,0.6)] uppercase tracking-widest block mb-1">Category</label>
                    <select value={form.category} onChange={e => setForm(p=>({...p,category:e.target.value}))} className="field">
                      {businessCategories.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="font-mono text-[0.65mn] text-[rgba(201,168,76,0.6)] uppercase tracking-widest block mb-1">City</label>
                    <select value={form.city} onChange={e => setForm(p=>({...p,city:e.target.value}))} className="field">
                      {cities.map(c => <option key={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="font-mono text-[0.65rem] text-[rgba(201,168,76,0.6)] uppercase tracking-widest block mb-1">Website (optional)</label>
                    <input value={form.website} onChange={e => setForm(p=>({...p,website:e.target.value}))} className="field" placeholder="https://yourbusiness.com" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="font-mono text-[0.65rem] text-[rgba(201,168,76,0.6)] uppercase tracking-widest block mb-1">Short Description</label>
                    <textarea value={form.desc} onChange={e => setForm(p=>({...p,desc:e.target.value}))} className="field h-24 resize-none" placeholder="Describe what makes your business special for authentic travellers…" />
                  </div>
                  <div className="md:col-span-2">
                    <button onClick={() => setStep(2)} className="btn btn-primary w-full">Next: Contact Details →</button>
                  </div>
                </div>
              )}
              {step === 2 && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono text-[0.65rem] text-[rgba(201,168,76,0.6)] uppercase tracking-widest block mb-1">Full Name</label>
                    <input value={form.name} onChange={e => setForm(p=>({...p,name:e.target.value}))} className="field" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="font-mono text-[0.65rem] text-[rgba(201,168,76,0.6)] uppercase tracking-widest block mb-1">Email Address</label>
                    <input type="email" value={form.email} onChange={e => setForm(p=>({...p,email:e.target.value}))} className="field" placeholder="you@business.com" />
                  </div>
                  <div className="md:col-span-2 flex gap-3">
                    <button onClick={() => setStep(1)} className="btn btn-ghost">← Back</button>
                    <button onClick={() => setStep(3)} className="btn btn-primary flex-1">Review Application →</button>
                  </div>
                </div>
              )}
              {step === 3 && (
                <div>
                  <div className="parchment rounded-xl p-5 mb-6">
                    <p className="font-display text-[#2C1810] font-bold mb-3">Application Summary</p>
                    <div className="space-y-2">
                      {[['Business', form.business || '—'],['Category', form.category],['City', form.city],['Contact', form.name || '—'],['Email', form.email || '—']].map(([l,v]) => (
                        <div key={l} className="flex justify-between text-sm">
                          <span className="font-mono text-[0.65rem] text-[#8B3A2A] uppercase">{l}</span>
                          <span className="font-body text-[#2C1810]">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setStep(2)} className="btn btn-ghost">← Edit</button>
                    <button onClick={() => setApplied(true)} className="btn btn-primary flex-1">Submit Application ✓</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
