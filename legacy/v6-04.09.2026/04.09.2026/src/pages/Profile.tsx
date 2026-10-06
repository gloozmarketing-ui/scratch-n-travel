import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { user, achievementBadges, tierGradient, storyPins } from '../data/data'

const unlockedBadges = achievementBadges.filter(b => b.unlocked)
const xpPct = Math.round((user.xp / user.xpNext) * 100)

const recentActivity = [
  { icon: '🪙', text: 'Scratched Praia da Ursa — +120 XP', time: '2h ago' },
  { icon: '📍', text: 'Unlocked story pin in Alfama', time: '1d ago' },
  { icon: '🤝', text: 'Connected with local Levan M.', time: '2d ago' },
  { icon: '🏷️', text: 'Earned badge: Summit Pioneer', time: '3d ago' },
  { icon: '📖', text: 'Submitted secret: "Reykjadalur Thermal Valley"', time: '5d ago' },
]

const journeyStats = [
  { label: 'Countries', value: user.countries, icon: '🌍' },
  { label: 'Cities', value: 12, icon: '🏙️' },
  { label: 'Secrets', value: user.secrets, icon: '🔑' },
  { label: 'Stories', value: user.stories, icon: '📖' },
  { label: 'Badges', value: user.badges, icon: '🏷️' },
  { label: 'Tours', value: 4, icon: '👟' },
]

// Helper for GPS nav
function parseCoords(coordStr: string): { lat: number; lng: number } {
  try {
    const latMatch = coordStr.match(/([0-9]+)°([0-9]+)'([0-9.]+)"?([NS])/);
    const lngMatch = coordStr.match(/([0-9]+)°([0-9]+)'([0-9.]+)"?([EW])/);
    let lat = 38.7223;
    let lng = -9.1393;
    if (latMatch) {
      lat = parseFloat(latMatch[1]) + parseFloat(latMatch[2]) / 60 + parseFloat(latMatch[3] || '0') / 3600;
      if (latMatch[4] === 'S') lat = -lat;
    }
    if (lngMatch) {
      lng = parseFloat(lngMatch[1]) + parseFloat(lngMatch[2]) / 60 + parseFloat(lngMatch[3] || '0') / 3600;
      if (lngMatch[4] === 'W') lng = -lng;
    }
    return { lat: parseFloat(lat.toFixed(5)), lng: parseFloat(lng.toFixed(5)) };
  } catch {
    return { lat: 38.7223, lng: -9.1393 };
  }
}

export default function Profile() {
  const [likedIds, setLikedIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('scratch_liked_pins');
      return saved ? JSON.parse(saved) : [1, 4];
    } catch {
      return [1, 4];
    }
  });

  const likedPins = storyPins.filter(p => likedIds.includes(p.id));

  const removeLike = (id: number) => {
    const next = likedIds.filter(x => x !== id);
    setLikedIds(next);
    localStorage.setItem('scratch_liked_pins', JSON.stringify(next));
  };

  return (
    <div>
      <div className="page-header">
        <p className="coord mb-1">Explorer since {user.joinDate}</p>
        <h1 className="font-display text-3xl text-[#F4E4C1] font-bold">Mein Kabinett &amp; Profil</h1>
        <p className="font-script text-[rgba(201,168,76,0.6)] text-xl mt-0.5">deine reise, deine legende, deine orte</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Hero card */}
        <div className="card p-6">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-full gold-gradient flex items-center justify-center font-display font-black text-[#0C1825] text-2xl pulse-gold shadow-md">
                {user.initials}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[#152539] flex items-center justify-center text-[10px] text-white font-bold">4</div>
            </div>
            <div className="flex-1">
              <h2 className="font-display text-[#F4E4C1] text-2xl font-bold">{user.name}</h2>
              <p className="font-mono text-[#C9A84C] text-sm mb-3">{user.rank}</p>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-[0.65rem] text-[#8A9AAA]">Fortschritt zu Rang 5</span>
                <span className="font-mono text-[0.65rem] text-[#C9A84C]">{user.xp} / {user.xpNext} XP</span>
              </div>
              <div className="xp-bar mb-4">
                <div className="xp-fill" style={{ width: `${xpPct}%` }} />
              </div>
              <div className="flex gap-3 flex-wrap">
                <Link to="/stories" className="btn btn-primary text-xs py-2 px-3">Story Pins entdecken</Link>
                <Link to="/scratch" className="btn btn-secondary text-xs py-2 px-3">Rubbelkarten</Link>
                <Link to="/badges" className="btn btn-ghost text-xs py-2 px-3">Badge-Kollektion</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div>
          <div className="section-divider mb-4"><span className="font-mono text-[0.68rem] tracking-widest">Reise-Statistiken</span></div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {journeyStats.map(s => (
              <div key={s.label} className="card p-4 text-center border border-[rgba(255,255,255,0.06)]">
                <p className="text-2xl mb-1">{s.icon}</p>
                <p className="font-display text-[#C9A84C] text-2xl font-black">{s.value}</p>
                <p className="font-mono text-[0.6rem] text-[#8A9AAA] uppercase tracking-wide">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ❤️ GELIKETE ORTE & GESPEICHERTE GEHEIMNISSE */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl text-rose-500">❤️</span>
              <h3 className="font-display text-lg text-[#F4E4C1] font-bold">
                Gelikete Orte &amp; Gespeicherte Geheimnisse ({likedPins.length})
              </h3>
            </div>
            <Link to="/stories" className="text-xs text-[#C9A84C] hover:underline font-mono">
              + Mehr Orte auf der Karte liken →
            </Link>
          </div>

          {likedPins.length === 0 ? (
            <div className="card p-8 text-center border border-dashed border-[rgba(201,168,76,0.3)]">
              <p className="text-3xl mb-2">🗺️</p>
              <p className="font-display text-[#F4E4C1] font-bold text-sm mb-1">Noch keine Orte mit Herz markiert</p>
              <p className="text-xs text-[#8A9AAA] mb-4">Klicke bei den Story Pins auf das Herz-Symbol, um dir deine Lieblingsspots für deine nächste Reise zu sichern.</p>
              <Link to="/stories" className="btn btn-secondary text-xs">Zu den Golden Story Pins →</Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {likedPins.map(pin => {
                const coords = parseCoords(pin.gps);
                return (
                  <div key={pin.id} className="card overflow-hidden border border-[rgba(201,168,76,0.25)] flex flex-col justify-between">
                    <div>
                      <div className="relative h-36">
                        <img src={pin.image} alt={pin.location} className="w-full h-full object-cover opacity-80" />
                        <div className="absolute top-2 left-2">
                          <span className="font-mono text-[0.6rem] bg-[rgba(12,24,37,0.85)] text-[#C9A84C] px-2 py-0.5 rounded-full font-bold">{pin.tag}</span>
                        </div>
                        <button
                          onClick={() => removeLike(pin.id)}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-rose-600/90 text-white text-xs flex items-center justify-center cursor-pointer hover:bg-rose-700 transition-colors shadow-sm"
                          title="Aus Favoriten entfernen"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="p-4 pb-2">
                        <p className="font-display text-[#F4E4C1] text-sm font-bold">{pin.local}</p>
                        <p className="font-mono text-xs text-[#8A9AAA] mb-2">{pin.location}</p>
                        <p className="text-xs text-[#C4D0DC] line-clamp-2 leading-relaxed mb-3">{pin.story}</p>
                        <div className="bg-[#0C1825] rounded p-2 flex items-center gap-2 border border-emerald-500/20 mb-2">
                          <span className="text-emerald-400 text-xs">📍</span>
                          <span className="font-mono text-[0.65rem] text-emerald-400 font-bold">{pin.gps}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 pt-0">
                      <div className="grid grid-cols-3 gap-1 pt-2 border-t border-white/5">
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-center py-1 bg-[#17263c] hover:bg-[#1f3350] rounded text-[10px] text-[#F4E4C1] font-semibold"
                        >
                          Google Maps
                        </a>
                        <a
                          href={`https://maps.apple.com/?q=${coords.lat},${coords.lng}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-center py-1 bg-[#17263c] hover:bg-[#1f3350] rounded text-[10px] text-[#F4E4C1] font-semibold"
                        >
                          Apple Maps
                        </a>
                        <a
                          href={`https://www.waze.com/ul?ll=${coords.lat},${coords.lng}&navigate=yes`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-center py-1 bg-[#17263c] hover:bg-[#1f3350] rounded text-[10px] text-[#F4E4C1] font-semibold"
                        >
                          Waze
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Earned badges */}
          <div>
            <div className="section-divider mb-4"><span className="font-mono text-[0.68rem] tracking-widest">Freigeschaltete Badges ({unlockedBadges.length})</span></div>
            <div className="grid grid-cols-4 gap-2">
              {unlockedBadges.map(b => (
                <div key={b.id} className="card p-3 text-center hover:scale-105 transition-transform" title={b.name}>
                  <div className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center text-xl"
                    style={{ background: tierGradient[b.tier] }}>
                    {b.emoji}
                  </div>
                  <p className="font-mono text-[0.55rem] text-[#8A9AAA] leading-tight">{b.name}</p>
                </div>
              ))}
              {Array.from({ length: Math.max(0, 8 - unlockedBadges.length) }).map((_, i) => (
                <div key={`empty-${i}`} className="card p-3 opacity-25 text-center">
                  <div className="w-10 h-10 rounded-xl mx-auto mb-2 bg-[#243E63] flex items-center justify-center text-lg">🔒</div>
                  <p className="font-mono text-[0.55rem] text-[#8A9AAA]">Gesperrt</p>
                </div>
              ))}
            </div>
            <Link to="/badges" className="btn btn-ghost w-full mt-3 text-[0.68rem]">Alle Badges im Detail ansehen →</Link>
          </div>

          {/* Recent activity */}
          <div>
            <div className="section-divider mb-4"><span className="font-mono text-[0.68rem] tracking-widest">Letzte Aktivitäten</span></div>
            <div className="space-y-2">
              {recentActivity.map((a, i) => (
                <div key={i} className="card p-3 flex items-center gap-3">
                  <span className="text-xl flex-shrink-0">{a.icon}</span>
                  <p className="font-body text-[#F4E4C1] text-sm flex-1 leading-snug">{a.text}</p>
                  <span className="font-mono text-[0.6rem] text-[#8A9AAA] flex-shrink-0">{a.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
