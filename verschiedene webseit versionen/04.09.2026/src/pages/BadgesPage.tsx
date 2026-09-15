import { useState } from 'react'
import { achievementBadges, productBadges, tierGradient, tierBorder, type AchievementBadge } from '../data/data'
import { Link } from 'react-router-dom'

type Tab = 'achievements' | 'merch' | 'new'

function AchievBadgeCard({ b }: { b: AchievementBadge }) {
  return (
    <div className={`card rounded-xl p-4 flex flex-col transition-all duration-200 hover:scale-[1.02] ${b.isNew ? 'ring-1 ring-[rgba(201,168,76,0.45)]' : ''}`}
      style={{ borderColor: b.unlocked ? tierBorder[b.tier] : 'rgba(201,168,76,0.08)', opacity: b.unlocked ? 1 : 0.55 }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: tierGradient[b.tier], filter: b.unlocked ? 'none' : 'grayscale(1)' }}>
          {b.unlocked ? b.emoji : '🔒'}
        </div>
        <div className="flex flex-col items-end gap-1">
          {b.isNew && (
            <span className="font-mono text-[0.58rem] font-bold text-[#0C1825] px-1.5 py-0.5 rounded shimmer-anim">NEW</span>
          )}
          <span className="font-mono text-[0.58rem] font-bold text-[#0C1825] rounded px-1.5 py-0.5"
            style={{ background: tierGradient[b.tier] }}>
            {b.tier.toUpperCase()}
          </span>
        </div>
      </div>
      <p className="font-display text-[#F4E4C1] text-xs font-bold mb-1 leading-tight">{b.name}</p>
      <p className="font-body text-[#8A9AAA] text-[0.8rem] leading-snug mb-2 flex-1">{b.desc}</p>
      <div className="flex items-center justify-between mt-auto">
        <span className="font-mono text-[#C9A84C] text-[0.62rem]">+{b.xp} XP</span>
        {b.unlocked && <span className="font-mono text-emerald-400 text-[0.62rem]">✓ Earned</span>}
      </div>
    </div>
  )
}

export default function BadgesPage() {
  const [tab, setTab] = useState<Tab>('achievements')

  const oldBadges = achievementBadges.filter(b => !b.isNew)
  const newBadges  = achievementBadges.filter(b => b.isNew)
  const unlocked   = achievementBadges.filter(b => b.unlocked).length

  return (
    <div>
      <div className="page-header">
        <p className="coord mb-1">Collection · 400+ Designs · 300 DPI Vector</p>
        <h1 className="font-display text-3xl text-[#F4E4C1] font-bold">Badges & Merchandise</h1>
        <p className="font-script text-[rgba(201,168,76,0.5)] text-lg mt-0.5">collect your journey as a luxury artefact</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Progress strip */}
        <div className="parchment rounded-xl p-5 flex flex-wrap gap-6 items-center">
          <div className="flex-1">
            <div className="flex justify-between mb-1">
              <span className="font-display text-[#2C1810] font-bold text-sm">Badge Progress</span>
              <span className="font-mono text-[0.65rem] text-[#8B3A2A]">{unlocked} / {achievementBadges.length} earned</span>
            </div>
            <div className="h-3 bg-[rgba(44,24,16,0.12)] rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700" style={{width:`${Math.round(unlocked/achievementBadges.length*100)}%`, background:'linear-gradient(90deg,#8B3A2A,#C9A84C)'}} />
            </div>
          </div>
          <div className="flex gap-4">
            {['bronze','silver','gold','platinum'].map(tier => {
              const count = achievementBadges.filter(b => b.tier === tier && b.unlocked).length
              return (
                <div key={tier} className="text-center">
                  <div className="w-8 h-8 rounded-full mx-auto mb-1" style={{background: tierGradient[tier]}} />
                  <p className="font-mono text-[0.6rem] text-[#2C1810] capitalize">{tier}</p>
                  <p className="font-display text-[#2C1810] font-bold">{count}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1.5 p-1 bg-[#152539] border border-[rgba(201,168,76,0.12)] rounded-xl w-fit">
          {([['achievements','🏆 Achievements'],['new','✦ Season 2 NEW'],['merch','🛍 Physical Merch']] as const).map(([t, label]) => (
            <button key={t} onClick={() => setTab(t)}
              className={`btn text-[0.68rem] py-1.5 px-4 ${tab === t ? 'btn-primary' : 'btn-ghost border-transparent'}`}>
              {label}
            </button>
          ))}
        </div>

        {/* Achievements tab */}
        {tab === 'achievements' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {oldBadges.map(b => <AchievBadgeCard key={b.id} b={b} />)}
          </div>
        )}

        {/* Season 2 NEW */}
        {tab === 'new' && (
          <div>
            <div className="flex items-center gap-4 p-4 card mb-6" style={{borderColor:'rgba(201,168,76,0.4)'}}>
              <span className="text-3xl">✨</span>
              <div>
                <p className="font-display text-[#C9A84C] font-bold text-lg">Season 2 — New Badge Collection</p>
                <p className="font-body text-[#8A9AAA]">{newBadges.length} new achievement badges dropping August 2026</p>
              </div>
              <span className="ml-auto font-mono text-[0.65rem] font-bold text-[#0C1825] px-3 py-1.5 rounded shimmer-anim">SEASON 2</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {newBadges.map(b => <AchievBadgeCard key={b.id} b={b} />)}
            </div>
          </div>
        )}

        {/* Merch tab */}
        {tab === 'merch' && (
          <div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {productBadges.map(b => (
                <div key={b.id} className="card overflow-hidden group">
                  <div className="relative h-52 bg-[#0C1825]">
                    <img src={b.image} alt={b.name} className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500" />
                    {b.bestseller && (
                      <span className="absolute top-3 left-3 font-mono text-[0.62rem] font-bold text-[#0C1825] px-2.5 py-1 rounded-full shimmer-anim">BESTSELLER</span>
                    )}
                    <span className="absolute top-3 right-3 font-mono text-[0.6rem] bg-[rgba(12,24,37,0.85)] border border-[rgba(201,168,76,0.25)] text-[rgba(201,168,76,0.85)] px-2 py-0.5 rounded-full">{b.type}</span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-[#F4E4C1] font-bold mb-1">{b.name}</h3>
                    <p className="font-body text-[#8A9AAA] text-sm leading-relaxed mb-3">{b.desc}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-[0.65rem] text-[#8A9AAA]">{b.size}</span>
                      <span className="font-display text-[#C9A84C] text-xl font-bold">{b.price}</span>
                    </div>
                    <button className="btn btn-secondary w-full text-[0.7rem]">Add to Cart</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="card-parchment rounded-xl p-6 mt-6 text-center">
              <p className="font-script text-2xl text-[#8B3A2A] mb-1">Monthly Secret Drops</p>
              <p className="font-body text-[#2C1810] mb-4">Exclusive collector badges not available in the shop. Limited to 200 units/month worldwide.</p>
              <Link to="/pricing" className="btn btn-parchment" style={{border:'1px solid rgba(139,58,42,0.3)'}}>Get Pro for 25% Merch Discount</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
