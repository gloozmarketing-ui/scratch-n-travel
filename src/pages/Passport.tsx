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
            <h1 className="font-display text-3xl text-ink font-bold">Travel Passport (Reisepass)</h1>
            <p className="font-script text-sun text-lg mt-0.5">your personal explorer's chronicle</p>
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
            <div className="flex items-center gap-2 bg-paper-deep border border-sun rounded-xl px-3 py-1.5">
              <span className="text-xl">🛂</span>
              <div>
                <p className="font-display text-sun text-xs font-bold">{user.rank}</p>
                <p className="font-mono text-[0.62rem] text-ink-faint">
                  {user.xp} / {user.xpNext} XP
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6 pb-24 md:pb-8">
        {/* Luxury Passport Booklet Card */}
        <div className="parchment rounded-2xl p-6 sm:p-8 shadow-2xl border-2 border-terracotta relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 opacity-5 bg-[radial-gradient(circle,var(--terracotta),transparent_70%)] pointer-events-none" />

          {/* Identity page */}
          <div className="grid md:grid-cols-3 gap-6 items-center border-b border-line pb-6 mb-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-28 h-28 rounded-2xl gold-gradient flex items-center justify-center font-display font-black text-ink text-3xl shadow-xl mb-3 border-2 border-line">
                {user.initials}
              </div>
              <p className="font-display text-ink font-black text-lg">{user.name}</p>
              <p className="font-mono text-[0.68rem] text-terracotta">{user.handle}</p>
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
                    className="bg-ink-ghost/10 rounded-xl p-2.5 text-center border border-terracotta"
                  >
                    <p className="font-mono text-[0.6rem] text-terracotta">{label}</p>
                    <p className="font-display text-ink font-black text-xl">{val}</p>
                  </div>
                ))}
              </div>

              {/* EXP Progression */}
              <div className="bg-ink-ghost/10 rounded-xl p-3 border border-terracotta">
                <div className="flex justify-between font-mono text-[0.65rem] text-terracotta mb-1">
                  <span>EXP Progression to Level {user.level + 1}</span>
                  <span>
                    {user.xp} / {user.xpNext} XP ({xpPct}%)
                  </span>
                </div>
                <div className="h-2.5 bg-ink-ghost/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${xpPct}%`,
                      background: 'linear-gradient(90deg, var(--terracotta), var(--sun))',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mb-6 border-b border-line pb-3 flex-wrap">
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
                    : 'bg-transparent text-ink hover:bg-ink-ghost/10'
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
                  className="rounded-2xl p-4 border-2 border-dashed border-terracotta bg-[rgba(255,255,255,0.4)] flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-2xl">{s.flag}</span>
                      <h4 className="font-display text-ink font-bold text-sm mt-1">{s.city}</h4>
                      <p className="font-mono text-[0.6rem] text-terracotta">{s.country}</p>
                    </div>
                    <span className="font-mono text-[0.6rem] bg-terracotta/10 text-terracotta px-2 py-0.5 rounded-full font-bold">
                      +{s.xpEarned} XP
                    </span>
                  </div>
                  <div className="border-t border-line pt-2 mt-2 space-y-1">
                    <p className="font-display text-xs text-ink font-semibold">{s.secretName}</p>
                    <p className="font-mono text-[0.58rem] text-terracotta">{s.gps}</p>
                    <p className="font-mono text-[0.55rem] text-terracotta/70 text-right">Eingestempelt: {s.date}</p>
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
                  <h3 className="font-display text-ink text-lg font-bold">Deine aktive WanderBond™ DNA</h3>
                  <p className="font-body text-terracotta text-xs">
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
                    className="bg-card text-ink px-3 py-1 rounded-full text-xs font-mono font-bold shadow"
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
                  className="bg-[rgba(255,255,255,0.4)] rounded-xl p-4 border border-terracotta space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-display text-ink font-bold text-sm">{q.title}</h4>
                      <p className="font-mono text-[0.62rem] text-terracotta">
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
                        className="flex items-center gap-2 text-xs font-body text-ink cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={s.done}
                          onChange={() => {
                            triggerHaptic(10)
                            completeQuestStep(q.id, s.id)
                          }}
                          className="rounded text-terracotta"
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
                  className="bg-[rgba(255,255,255,0.5)] rounded-xl p-3 border border-terracotta flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center font-bold text-ink text-xs">
                      {item.avatar}
                    </div>
                    <div>
                      <p className="font-body text-xs text-ink">
                        <strong className="font-semibold">{item.userName}</strong> {item.action}:{' '}
                        <span className="font-semibold text-terracotta">{item.target}</span>
                      </p>
                      <p className="font-mono text-[0.58rem] text-terracotta/70">
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
                      item.liked ? 'btn-primary font-bold' : 'btn-ghost text-ink'
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
                className="absolute top-4 right-4 text-ink-faint hover:text-ink text-lg font-bold"
              >
                ✕
              </button>

              <div className="w-16 h-16 rounded-2xl gold-gradient mx-auto mb-3 flex items-center justify-center font-display font-black text-2xl text-ink border-2 border-line">
                {user.initials}
              </div>
              <h3 className="font-display text-ink text-xl font-bold">{user.name}'s Passport</h3>
              <p className="font-mono text-[0.65rem] text-sun mb-4">
                {user.rank} · Level {user.level} · {user.countriesCount} Länder · {user.badgesCount} Badges
              </p>

              {/* QR Code Graphic Box */}
              <div className="parchment p-4 rounded-xl mb-4 flex flex-col items-center">
                <div className="w-36 h-36 bg-white p-2 rounded-lg border-2 border-terracotta flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <rect width="100" height="100" fill="white" />
                    <path
                      d="M10,10 h30 v30 h-30 z M15,15 v20 h20 v-20 z M20,20 h10 v10 h-10 z"
                      fill="#1A1A1A"
                    />
                    <path
                      d="M60,10 h30 v30 h-30 z M65,15 v20 h20 v-20 z M70,20 h10 v10 h-10 z"
                      fill="#1A1A1A"
                    />
                    <path
                      d="M10,60 h30 v30 h-30 z M15,65 v20 h20 v-20 z M20,70 h10 v10 h-10 z"
                      fill="#1A1A1A"
                    />
                    <rect x="50" y="50" width="8" height="8" fill="#1A1A1A" />
                    <rect x="65" y="60" width="12" height="12" fill="#1A1A1A" />
                    <rect x="80" y="75" width="10" height="10" fill="#1A1A1A" />
                    <rect x="55" y="80" width="15" height="8" fill="#1A1A1A" />
                  </svg>
                </div>
                <p className="font-mono text-[0.62rem] text-terracotta mt-2 font-bold">
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
