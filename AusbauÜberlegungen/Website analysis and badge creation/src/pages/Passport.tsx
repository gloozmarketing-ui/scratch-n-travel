import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTravel } from '../context/TravelContext'

type PassportTab = 'stamps' | 'dna' | 'quests' | 'feed'

export default function Passport() {
  const { user, stamps, quests, feed, completeQuestStep, likeFeedItem, triggerHaptic } = useTravel()
  const [tab, setTab] = useState<PassportTab>('stamps')
  const [showShareModal, setShowShareModal] = useState(false)
  const [copied, setCopied] = useState(false)

  const xpPct = Math.min(100, Math.round((user.xp / user.xpNext) * 100))
  const shareUrl = `${window.location.origin}/profile?user=${encodeURIComponent(user.handle)}`

  const handleCopyLink = () => {
    triggerHaptic(15)
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="coord mb-1">Official Digital Travel Document · Issue No. SNT-2026-PT</p>
            <h1 className="font-display text-3xl text-[#F4E4C1] font-bold">Travel Passport (Reisepass)</h1>
            <p className="font-script text-[rgba(201,168,76,0.5)] text-lg mt-0.5">your personal explorer's chronicle</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                triggerHaptic(10)
                setShowShareModal(true)
              }}
              className="btn btn-primary text-xs py-2 px-3 font-bold flex items-center gap-1.5 shadow-lg"
            >
              <span>📲</span>
              <span>Pass teilen / QR</span>
            </button>
            <div className="flex items-center gap-2 bg-[#152539] border border-[rgba(201,168,76,0.25)] rounded-xl px-3 py-1.5">
              <span className="text-xl">🛂</span>
              <div>
                <p className="font-display text-[#C9A84C] text-xs font-bold">{user.rank}</p>
                <p className="font-mono text-[0.62rem] text-[#8A9AAA]">
                  {user.xp} / {user.xpNext} XP
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6 pb-24 md:pb-8">
        {/* Luxury Passport Booklet Card */}
        <div className="parchment rounded-2xl p-6 sm:p-8 shadow-2xl border-2 border-[rgba(139,58,42,0.3)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 opacity-5 bg-[radial-gradient(circle,#8B3A2A,transparent_70%)] pointer-events-none" />

          {/* Identity page */}
          <div className="grid md:grid-cols-3 gap-6 items-center border-b border-[rgba(44,24,16,0.18)] pb-6 mb-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-28 h-28 rounded-2xl gold-gradient flex items-center justify-center font-display font-black text-[#0C1825] text-3xl shadow-xl mb-3 border-2 border-[#F4E4C1]">
                {user.initials}
              </div>
              <p className="font-display text-[#2C1810] font-black text-lg">{user.name}</p>
              <p className="font-mono text-[0.68rem] text-[#8B3A2A]">{user.handle}</p>
            </div>

            <div className="md:col-span-2 space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  ['🌍 Länder', user.countriesCount],
                  ['🔑 Secrets', user.secretsCount],
                  ['🏷️ Badges', user.badgesCount],
                  ['⭐ Level', user.level],
                ].map(([label, val]) => (
                  <div
                    key={String(label)}
                    className="bg-[rgba(44,24,16,0.06)] rounded-xl p-2.5 text-center border border-[rgba(139,58,42,0.12)]"
                  >
                    <p className="font-mono text-[0.6rem] text-[#8B3A2A]">{label}</p>
                    <p className="font-display text-[#2C1810] font-black text-xl">{val}</p>
                  </div>
                ))}
              </div>

              {/* EXP Progression */}
              <div className="bg-[rgba(44,24,16,0.06)] rounded-xl p-3 border border-[rgba(139,58,42,0.12)]">
                <div className="flex justify-between font-mono text-[0.65rem] text-[#8B3A2A] mb-1">
                  <span>EXP Progression to Level {user.level + 1}</span>
                  <span>
                    {user.xp} / {user.xpNext} XP ({xpPct}%)
                  </span>
                </div>
                <div className="h-2.5 bg-[rgba(44,24,16,0.15)] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${xpPct}%`,
                      background: 'linear-gradient(90deg, #8B3A2A, #C9A84C)',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mb-6 border-b border-[rgba(44,24,16,0.15)] pb-3 flex-wrap">
            {[
              { id: 'stamps', label: `🏛️ Visum-Stempel (${stamps.length})` },
              { id: 'dna', label: `🧬 WanderBond DNA (${user.hobbies.length})` },
              { id: 'quests', label: `⚔️ City Quests (${quests.length})` },
              { id: 'feed', label: `📡 Explorer Feed (${feed.length})` },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => {
                  triggerHaptic(10)
                  setTab(t.id as PassportTab)
                }}
                className={`btn text-xs py-1.5 px-3.5 ${
                  tab === t.id
                    ? 'btn-primary font-bold shadow-md'
                    : 'bg-transparent text-[#2C1810] hover:bg-[rgba(44,24,16,0.08)]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Stamps */}
          {tab === 'stamps' && (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {stamps.map(s => (
                <div
                  key={s.id}
                  className="rounded-2xl p-4 border-2 border-dashed border-[rgba(139,58,42,0.3)] bg-[rgba(255,255,255,0.4)] flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-2xl">{s.flag}</span>
                      <h4 className="font-display text-[#2C1810] font-bold text-sm mt-1">{s.city}</h4>
                      <p className="font-mono text-[0.6rem] text-[#8B3A2A]">{s.country}</p>
                    </div>
                    <span className="font-mono text-[0.6rem] bg-[#8B3A2A]/10 text-[#8B3A2A] px-2 py-0.5 rounded-full font-bold">
                      +{s.xpEarned} XP
                    </span>
                  </div>
                  <div className="border-t border-[rgba(44,24,16,0.1)] pt-2 mt-2 space-y-1">
                    <p className="font-display text-xs text-[#2C1810] font-semibold">{s.secretName}</p>
                    <p className="font-mono text-[0.58rem] text-[#8B3A2A]">{s.gps}</p>
                    <p className="font-mono text-[0.55rem] text-[#8B3A2A]/70 text-right">Eingestempelt: {s.date}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 2: WanderBond DNA */}
          {tab === 'dna' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-[#2C1810] text-lg font-bold">Deine aktive WanderBond™ DNA</h3>
                  <p className="font-body text-[#8B3A2A] text-xs">
                    Kombination deiner Reise-Leidenschaften für personalisierte Empfehlungen.
                  </p>
                </div>
                <Link to="/wanderbond" className="btn btn-primary text-xs py-1.5 px-3">
                  🧬 DNA erweitern →
                </Link>
              </div>

              <div className="flex flex-wrap gap-2">
                {user.hobbies.map(h => (
                  <span
                    key={h}
                    className="bg-[#2C1810] text-[#F4E4C1] px-3 py-1 rounded-full text-xs font-mono font-bold shadow"
                  >
                    ✦ {h}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Quests */}
          {tab === 'quests' && (
            <div className="space-y-4">
              {quests.map(q => (
                <div
                  key={q.id}
                  className="bg-[rgba(255,255,255,0.4)] rounded-xl p-4 border border-[rgba(139,58,42,0.2)] space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-display text-[#2C1810] font-bold text-sm">{q.title}</h4>
                      <p className="font-mono text-[0.62rem] text-[#8B3A2A]">
                        Stadt: {q.city} · Belohnung: {q.rewardBadgeName}
                      </p>
                    </div>
                    <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                      +{q.xp} XP
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {q.steps.map(s => (
                      <label
                        key={s.id}
                        className="flex items-center gap-2 text-xs font-body text-[#2C1810] cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={s.done}
                          onChange={() => {
                            triggerHaptic(10)
                            completeQuestStep(q.id, s.id)
                          }}
                          className="rounded text-[#8B3A2A]"
                        />
                        <span className={s.done ? 'line-through opacity-60' : ''}>{s.text}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 4: Explorer Feed */}
          {tab === 'feed' && (
            <div className="space-y-3">
              {feed.map(item => (
                <div
                  key={item.id}
                  className="bg-[rgba(255,255,255,0.5)] rounded-xl p-3 border border-[rgba(139,58,42,0.15)] flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center font-bold text-[#0C1825] text-xs">
                      {item.avatar}
                    </div>
                    <div>
                      <p className="font-body text-xs text-[#2C1810]">
                        <strong className="font-semibold">{item.userName}</strong> {item.action}:{' '}
                        <span className="font-semibold text-[#8B3A2A]">{item.target}</span>
                      </p>
                      <p className="font-mono text-[0.58rem] text-[#8B3A2A]/70">
                        📍 {item.location} · {item.time}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      triggerHaptic(10)
                      likeFeedItem(item.id)
                    }}
                    className={`btn text-xs py-1 px-2.5 ${
                      item.liked ? 'btn-primary font-bold' : 'btn-ghost text-[#2C1810]'
                    }`}
                  >
                    ❤️ {item.likes}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SHARE PASSPORT & QR CODE MODAL */}
        {showShareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="card w-full max-w-sm p-6 relative text-center">
              <button
                onClick={() => setShowShareModal(false)}
                className="absolute top-4 right-4 text-[#8A9AAA] hover:text-[#F4E4C1] text-lg font-bold"
              >
                ✕
              </button>

              <div className="w-16 h-16 rounded-2xl gold-gradient mx-auto mb-3 flex items-center justify-center font-display font-black text-2xl text-[#0C1825] border-2 border-[#F4E4C1]">
                {user.initials}
              </div>
              <h3 className="font-display text-[#F4E4C1] text-xl font-bold">{user.name}'s Passport</h3>
              <p className="font-mono text-[0.65rem] text-[#C9A84C] mb-4">
                {user.rank} · Level {user.level} · {user.countriesCount} Länder · {user.badgesCount} Badges
              </p>

              {/* QR Code Graphic Box */}
              <div className="parchment p-4 rounded-xl mb-4 flex flex-col items-center">
                <div className="w-36 h-36 bg-white p-2 rounded-lg border-2 border-[#8B3A2A] flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <rect width="100" height="100" fill="white" />
                    <path
                      d="M10,10 h30 v30 h-30 z M15,15 v20 h20 v-20 z M20,20 h10 v10 h-10 z"
                      fill="#2C1810"
                    />
                    <path
                      d="M60,10 h30 v30 h-30 z M65,15 v20 h20 v-20 z M70,20 h10 v10 h-10 z"
                      fill="#2C1810"
                    />
                    <path
                      d="M10,60 h30 v30 h-30 z M15,65 v20 h20 v-20 z M20,70 h10 v10 h-10 z"
                      fill="#2C1810"
                    />
                    <rect x="50" y="50" width="8" height="8" fill="#8B3A2A" />
                    <rect x="65" y="60" width="12" height="12" fill="#2C1810" />
                    <rect x="80" y="75" width="10" height="10" fill="#8B3A2A" />
                    <rect x="55" y="80" width="15" height="8" fill="#2C1810" />
                  </svg>
                </div>
                <p className="font-mono text-[0.62rem] text-[#8B3A2A] mt-2 font-bold">
                  Scanne den QR-Code um Alex's Pass zu öffnen
                </p>
              </div>

              <div className="space-y-2">
                <button onClick={handleCopyLink} className="btn btn-primary w-full text-xs py-2.5 font-bold shadow-lg">
                  {copied ? '✓ Link in Zwischenablage kopiert!' : '🔗 Profil-Link kopieren'}
                </button>
                <button onClick={() => setShowShareModal(false)} className="btn btn-ghost w-full text-xs py-2">
                  Schließen
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
