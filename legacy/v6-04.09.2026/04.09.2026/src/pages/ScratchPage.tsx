import { useState } from 'react'
import ScratchCard from '../components/ScratchCard'
import { storyPins, user } from '../data/data'

const xpPct = Math.round((user.xp / user.xpNext) * 100)

const scratchCards = [
  { id: 1, location: 'Praia da Ursa', country: 'Portugal', gps: '38°47\'29"N · 9°28\'32"W', xp: 120, tag: 'Nature', locked: true },
  { id: 2, location: 'Alfama Quarter', country: 'Portugal', gps: '38°42\'44"N · 9°07\'59"W', xp: 90, tag: 'Food', locked: true },
  { id: 3, location: 'Ponta da Piedade', country: 'Portugal', gps: '37°04\'24"N · 8°40\'01"W', xp: 160, tag: 'Nature', locked: true },
  { id: 4, location: 'Sintra Palaces', country: 'Portugal', gps: '38°47\'24"N · 9°23\'21"W', xp: 110, tag: 'History', locked: true },
  { id: 5, location: 'Ericeira Reef', country: 'Portugal', gps: '38°57\'50"N · 9°25\'03"W', xp: 100, tag: 'Surf', locked: false },
  { id: 6, location: 'Douro Valley Cave', country: 'Portugal', gps: '41°09\'14"N · 7°47\'34"W', xp: 200, tag: 'Wine', locked: false },
]

export default function ScratchPage() {
  const [revealed, setRevealed] = useState<number[]>([5, 6])
  const [totalXP, setTotalXP] = useState(user.xp)

  const handleReveal = (id: number, xp: number) => {
    if (!revealed.includes(id)) {
      setRevealed(prev => [...prev, id])
      setTotalXP(prev => prev + xp)
    }
  }

  const currentXpPct = Math.min(100, Math.round((totalXP / user.xpNext) * 100))

  return (
    <div>
      <div className="page-header">
        <p className="coord mb-1">Explorer Progress · Season I</p>
        <h1 className="font-display text-3xl text-[#F4E4C1] font-bold">Scratch Cards</h1>
        <p className="font-script text-[rgba(201,168,76,0.5)] text-lg mt-0.5">reveal what the earth hides</p>
      </div>

      <div className="p-6">
        {/* XP Dashboard */}
        <div className="parchment rounded-xl p-5 mb-8 relative overflow-hidden">
          <div className="grid sm:grid-cols-3 gap-5">
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1">
                <p className="font-display text-[#2C1810] font-bold text-sm">{user.rank}</p>
                <p className="font-mono text-[0.65rem] text-[#8B3A2A]">{totalXP} / {user.xpNext} XP</p>
              </div>
              <div className="h-3 bg-[rgba(44,24,16,0.15)] rounded-full overflow-hidden mb-4">
                <div className="h-full rounded-full transition-all duration-700" style={{width:`${currentXpPct}%`, background:'linear-gradient(90deg,#8B3A2A,#C9A84C)'}} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  ['🔓', revealed.length, 'Revealed'],
                  ['🌍', user.countries, 'Countries'],
                  ['🏷️', user.badges, 'Badges'],
                ].map(([ic, v, l]) => (
                  <div key={String(l)} className="text-center bg-[rgba(44,24,16,0.07)] rounded-lg py-3">
                    <p className="text-xl mb-0.5">{ic}</p>
                    <p className="font-display text-[#2C1810] font-black text-lg">{v}</p>
                    <p className="font-mono text-[0.6rem] text-[#8B3A2A] uppercase tracking-wide">{l}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col justify-center items-center text-center">
              <div className="w-20 h-20 rounded-full gold-gradient flex items-center justify-center mb-2 shadow-lg">
                <div className="text-center">
                  <p className="font-display font-black text-[#0C1825] text-xs leading-tight">Rang</p>
                  <p className="font-display font-black text-[#0C1825] text-2xl leading-tight">3</p>
                </div>
              </div>
              <p className="font-display text-[#2C1810] text-xs font-bold">Pathfinder</p>
              <p className="font-mono text-[0.58rem] text-[#8B3A2A]">{user.xpNext - totalXP} XP to Rang 4</p>
            </div>
          </div>
        </div>

        {/* Scratch Card Grid */}
        <div className="mb-6">
          <div className="section-divider mb-6"><span className="font-mono text-[0.68rem] tracking-widest">Your Card Portfolio</span></div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {scratchCards.map(card => {
              const isRevealed = revealed.includes(card.id)
              return (
                <div key={card.id} className="flex flex-col items-center gap-3">
                  <div className="flex items-center justify-between w-full">
                    <span className="font-mono text-[0.6rem] border border-[rgba(201,168,76,0.25)] text-[rgba(201,168,76,0.75)] px-2 py-0.5 rounded-full">{card.tag}</span>
                    <span className="font-mono text-emerald-400/70 text-[0.62rem]">+{card.xp} XP</span>
                  </div>

                  {isRevealed ? (
                    <div className="w-full h-[140px] card rounded-xl flex flex-col items-center justify-center gap-2 border-[rgba(201,168,76,0.3)]">
                      <p className="font-display text-[#C9A84C] text-base font-bold">{card.location}</p>
                      <p className="coord">{card.gps}</p>
                      <span className="text-emerald-400 text-xs font-semibold">✓ Revealed</span>
                    </div>
                  ) : (
                    <ScratchCard
                      width={280}
                      height={140}
                      onComplete={() => handleReveal(card.id, card.xp)}
                    >
                      <div className="text-center px-4">
                        <p className="font-display text-[#F4E4C1] font-bold text-base mb-1">{card.location}</p>
                        <p className="font-mono text-[#8A9AAA] text-[0.62rem] mb-1">{card.country}</p>
                        <p className="coord">{card.gps}</p>
                      </div>
                    </ScratchCard>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* History */}
        <div>
          <div className="section-divider mb-4"><span className="font-mono text-[0.68rem] tracking-widest">Recently Revealed</span></div>
          <div className="space-y-2">
            {storyPins.slice(0,3).map(pin => (
              <div key={pin.id} className="card p-3 flex items-center gap-4">
                <span className="text-emerald-400">📍</span>
                <div className="flex-1">
                  <p className="font-display text-[#F4E4C1] text-sm">{pin.location}</p>
                  <p className="coord">{pin.gps}</p>
                </div>
                <span className="font-mono text-emerald-400/70 text-xs">+{pin.xp} XP</span>
                <span className="font-mono text-[0.6rem] border border-[rgba(201,168,76,0.2)] text-[rgba(201,168,76,0.65)] px-2 py-0.5 rounded-full">{pin.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
