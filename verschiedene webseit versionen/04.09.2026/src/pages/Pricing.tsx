import { useState } from 'react'
import { Link } from 'react-router-dom'

const plans = [
  {
    id: 'free',
    name: 'Free Explorer',
    price: { monthly: '€0', annual: '€0' },
    period: 'forever',
    desc: 'For curious travellers just beginning their journey',
    badge: null,
    features: [
      { text: '3 Scratch Cards per month', ok: true },
      { text: '2 AI Concierge requests per day', ok: true },
      { text: 'Community story pins (blurred GPS)', ok: true },
      { text: 'Hazard & scam radar', ok: true },
      { text: 'Basic activity filter', ok: true },
      { text: 'Exact GPS coordinates', ok: false },
      { text: 'GPX & PDF exports', ok: false },
      { text: 'Full badge collection', ok: false },
      { text: 'Offline PWA access', ok: false },
    ],
    cta: 'Start Free',
    ctaLink: '/login',
    highlighted: false,
  },
  {
    id: 'pro',
    name: 'Pro VIP Explorer',
    price: { monthly: '€9', annual: '€7' },
    period: '/month',
    desc: 'For serious explorers who want every secret unlocked',
    badge: 'MOST POPULAR',
    features: [
      { text: 'Unlimited scratch cards', ok: true },
      { text: 'Unlimited AI Concierge', ok: true },
      { text: 'Exact GPS coordinates for all pins', ok: true },
      { text: 'GPX & PDF exports', ok: true },
      { text: 'Full badge portfolio + Season 2', ok: true },
      { text: 'Priority hazard alerts (SMS)', ok: true },
      { text: 'Offline PWA — no internet needed', ok: true },
      { text: 'Hobby DNA matching (unlimited)', ok: true },
      { text: 'Give-to-Get story submissions', ok: true },
    ],
    cta: 'Go Pro',
    ctaLink: '/login',
    highlighted: true,
  },
  {
    id: 'host',
    name: 'Business & Host',
    price: { monthly: '€29', annual: '€23' },
    period: '/month',
    desc: 'For venues and experience providers ready to grow',
    badge: null,
    features: [
      { text: 'All Pro features included', ok: true },
      { text: 'Business listing page (verified)', ok: true },
      { text: '0% booking commission — ever', ok: true },
      { text: 'Gold verified badge on listing', ok: true },
      { text: 'Analytics dashboard', ok: true },
      { text: 'Direct guest messaging', ok: true },
      { text: '25% merch discount for guests', ok: true },
      { text: 'City beta slot access', ok: true },
      { text: 'Priority host support', ok: true },
    ],
    cta: 'Apply as Host',
    ctaLink: '/host',
    highlighted: false,
  },
]

const faq = [
  { q: 'Can I cancel anytime?', a: 'Yes. Cancel from your profile at any time. No lock-in, no cancellation fee.' },
  { q: 'What payment methods are accepted?', a: 'Stripe — all major credit/debit cards, Apple Pay, Google Pay.' },
  { q: 'Is there a free trial for Pro?', a: 'Submit an authentic local story and if verified, you receive 30 days Pro free.' },
  { q: 'Does the app track me?', a: 'No advertising cookies and no third-party tracking. Transparent privacy documented according to GDPR.' },
  { q: 'What is a "scratch card"?', a: 'Each card hides a real GPS location. Scratch (mouse or finger) to reveal the coordinates, earn XP, and collect the location in your travel passport.' },
  { q: 'Can I use it offline?', a: 'Pro and Business plans include full PWA offline support — your revealed locations and checklists are available without internet.' },
]

export default function Pricing() {
  const [annual, setAnnual] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div>
      <div className="page-header">
        <p className="coord mb-1">Transparent · No hidden fees · Cancel anytime</p>
        <h1 className="font-display text-3xl text-[#F4E4C1] font-bold">Pricing</h1>
        <p className="font-script text-[rgba(201,168,76,0.5)] text-lg mt-0.5">one plan for every kind of explorer</p>
      </div>

      <div className="p-6 space-y-10">
        {/* Toggle */}
        <div className="flex items-center justify-center gap-4">
          <span className={`font-mono text-sm ${!annual ? 'text-[#F4E4C1]' : 'text-[#8A9AAA]'}`}>Monthly</span>
          <button onClick={() => setAnnual(!annual)}
            className={`relative w-12 h-6 rounded-full transition-colors ${annual ? 'bg-[#C9A84C]' : 'bg-[#1D3454]'}`}>
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${annual ? 'left-7' : 'left-1'}`} />
          </button>
          <span className={`font-mono text-sm ${annual ? 'text-[#F4E4C1]' : 'text-[#8A9AAA]'}`}>Annual</span>
          {annual && <span className="font-mono text-[0.65rem] text-emerald-400 border border-emerald-400/30 px-2 py-0.5 rounded-full">Save ~22%</span>}
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {plans.map(plan => (
            <div key={plan.id} className={`flex flex-col rounded-2xl overflow-hidden ${plan.highlighted ? 'gold-gradient' : 'card'}`}>
              {plan.badge && (
                <div className="text-center py-1.5 bg-[rgba(0,0,0,0.2)]">
                  <span className="font-mono text-[0.65rem] font-bold text-[#0C1825] tracking-widest">{plan.badge}</span>
                </div>
              )}
              <div className="flex flex-col flex-1 p-6">
                <p className={`font-mono text-[0.62rem] uppercase tracking-widest mb-1 ${plan.highlighted ? 'text-[rgba(12,24,37,0.6)]' : 'text-[#8A9AAA]'}`}>{plan.name}</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className={`font-display font-black text-4xl ${plan.highlighted ? 'text-[#0C1825]' : 'text-[#F4E4C1]'}`}>
                    {annual ? plan.price.annual : plan.price.monthly}
                  </span>
                  <span className={`text-sm ${plan.highlighted ? 'text-[rgba(12,24,37,0.6)]' : 'text-[#8A9AAA]'}`}>{plan.period}</span>
                </div>
                {annual && plan.id !== 'free' && (
                  <p className={`font-mono text-[0.62rem] mb-2 ${plan.highlighted ? 'text-[rgba(12,24,37,0.5)]' : 'text-[#8A9AAA]'}`}>
                    billed annually ({plan.price.monthly}/mo if monthly)
                  </p>
                )}
                <p className={`font-body text-sm mb-5 ${plan.highlighted ? 'text-[rgba(12,24,37,0.7)]' : 'text-[#8A9AAA]'}`}>{plan.desc}</p>

                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.map(f => (
                    <li key={f.text} className={`flex items-start gap-2 text-sm font-body ${f.ok ? (plan.highlighted ? 'text-[#0C1825]' : 'text-[#8A9AAA]') : 'text-[rgba(138,154,170,0.35)] line-through'}`}>
                      <span className={`flex-shrink-0 mt-0.5 ${f.ok ? (plan.highlighted ? 'text-[#0C1825]' : 'text-[#C9A84C]') : 'text-[rgba(138,154,170,0.25)]'}`}>
                        {f.ok ? '✓' : '✕'}
                      </span>
                      {f.text}
                    </li>
                  ))}
                </ul>

                <Link to={plan.ctaLink} className={`btn text-center w-full ${plan.highlighted ? 'bg-[#0C1825] text-[#C9A84C] hover:bg-[#152539]' : 'btn-primary'}`}>
                  {plan.cta} →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Feature comparison table */}
        <div className="max-w-5xl mx-auto">
          <div className="section-divider mb-6"><span className="font-mono text-[0.68rem] tracking-widest">Full Feature Comparison</span></div>
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(201,168,76,0.1)]">
                  <th className="text-left p-4 font-mono text-[0.65rem] text-[#8A9AAA] uppercase tracking-widest">Feature</th>
                  {plans.map(p => (
                    <th key={p.id} className="p-4 font-display text-[0.75rem] text-[#C9A84C] font-bold text-center">{p.name.split(' ')[0]}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Scratch Cards', '3/month', 'Unlimited', 'Unlimited'],
                  ['AI Concierge', '2/day', 'Unlimited', 'Unlimited'],
                  ['GPS Precision', 'Blurred', 'Exact', 'Exact'],
                  ['GPX Export', '✕', '✓', '✓'],
                  ['Badge Collection', 'Basic', 'Full + S2', 'Full + S2'],
                  ['Offline Mode', '✕', '✓', '✓'],
                  ['Business Listing', '✕', '✕', '✓'],
                  ['Analytics', '✕', '✕', '✓'],
                  ['Commission', '—', '—', '0%'],
                ].map(([feature, ...vals], i) => (
                  <tr key={feature} className={`border-b border-[rgba(201,168,76,0.06)] ${i % 2 === 0 ? '' : 'bg-[rgba(201,168,76,0.02)]'}`}>
                    <td className="p-4 font-body text-[#F4E4C1] text-sm">{feature}</td>
                    {vals.map((v, vi) => (
                      <td key={vi} className={`p-4 text-center font-mono text-sm ${v === '✕' ? 'text-[rgba(138,154,170,0.3)]' : v === '✓' || v === '0%' ? 'text-emerald-400' : 'text-[#C9A84C]'}`}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <div className="section-divider mb-6"><span className="font-mono text-[0.68rem] tracking-widest">Frequently Asked Questions</span></div>
          <div className="space-y-2">
            {faq.map((item, i) => (
              <div key={i} className="card overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-[rgba(201,168,76,0.04)] transition-colors">
                  <span className="font-display text-[#F4E4C1] font-semibold text-sm">{item.q}</span>
                  <span className={`text-[#C9A84C] text-lg transition-transform ${openFaq === i ? 'rotate-180' : ''}`}>⌄</span>
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4">
                    <p className="font-body text-[#8A9AAA] text-sm leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="parchment rounded-xl p-8 text-center max-w-2xl mx-auto">
          <p className="font-script text-3xl text-[#8B3A2A] mb-2">Still not sure?</p>
          <p className="font-body text-[#2C1810] mb-4">Submit an authentic local story — if verified, you receive 30 days Pro free. No card required.</p>
          <Link to="/stories" className="btn btn-parchment" style={{border:'1px solid rgba(139,58,42,0.3)'}}>Submit a Story → Get Pro Free</Link>
        </div>
      </div>
    </div>
  )
}
