import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ScratchCard from '../components/ScratchCard'
import { storyPins, tours, cities, user } from '../data/data'

function PageSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="py-12 px-6 sm:px-8">
      <div className="section-divider mb-8">
        <span className="font-mono text-[0.68rem] tracking-widest uppercase">{label}</span>
      </div>
      {children}
    </section>
  )
}

export default function Home() {
  const [scratched, setScratched] = useState(false)

  return (
    <div>
      {/* ─── HERO ─── */}
      <div className="relative overflow-hidden pt-12 pb-16 px-6 sm:px-8 border-b border-[rgba(201,168,76,0.15)] bg-gradient-to-b from-[#0C1825] to-[#152539]">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <p className="coord uppercase tracking-widest text-xs">
            20+ Global Destinations · Verified Dog &amp; Stroller Intelligence · 130-Hobby DNA
          </p>
          <h1 className="font-display text-4xl sm:text-6xl font-black text-[#F4E4C1] leading-tight">
            Entdecke die <span className="gold-text">verborgenen Schätze</span> dieser Welt.
          </h1>
          <p className="font-body text-[#8A9AAA] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Keine Massenströme, keine Touristenfallen. Echte Secret Spots von Einheimischen mit
            GPS-Koordinaten, 1–5 Schwierigkeitsgraden und Barrierefreiheits-Garantie.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link to="/explore" className="btn btn-primary font-bold shadow-xl">
              🗺️ Explore Map öffnen →
            </Link>
            <Link to="/wanderbond" className="btn btn-secondary">
              🧬 WanderBond™ DNA testen
            </Link>
          </div>
        </div>

        {/* Interactive Scratch Preview */}
        <div className="mt-10 max-w-md mx-auto card p-4 border border-[rgba(201,168,76,0.3)] shadow-2xl">
          <p className="font-mono text-[0.62rem] text-[#C9A84C] uppercase text-center mb-2 font-bold">
            🪙 Probe-Rubbelfeld: Geheimtipp freirubbeln
          </p>
          <ScratchCard
            cardId={999}
            width={360}
            height={180}
            onComplete={() => setScratched(true)}
          >
            <div className="w-full h-full bg-[#0C1825] p-4 flex flex-col justify-between text-center">
              <div>
                <span className="text-2xl">🌊</span>
                <p className="font-display text-[#F4E4C1] font-bold text-sm mt-1">
                  Klippenquelle Praia da Ursa
                </p>
                <p className="font-mono text-xs text-emerald-400 font-bold">
                  38°47'29"N · 9°28'32"W (+120 XP)
                </p>
              </div>
              <p className="font-body text-[#8A9AAA] text-[0.7rem] line-clamp-2">
                200m hinter dem Felsvorsprung entspringt reines Süßwasser direkt an der Atlantikbrandung.
              </p>
            </div>
          </ScratchCard>
        </div>
      </div>

      {/* ─── GLOBAL DESTINATION HUBS ─── */}
      <PageSection label="20+ Kuratierte Destinationen">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {cities.slice(0, 8).map(c => (
            <Link
              key={c.name}
              to="/explore"
              className="card p-4 group hover:border-[rgba(201,168,76,0.6)] hover:scale-[1.02] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{c.flag}</span>
                  <span className="font-mono text-[0.6rem] bg-[#0C1825] border border-[rgba(201,168,76,0.3)] text-[#C9A84C] px-2 py-0.5 rounded-full font-bold">
                    {c.tier}
                  </span>
                </div>
                <h3 className="font-display text-[#F4E4C1] text-sm font-bold group-hover:text-[#C9A84C] transition-colors">
                  {c.name}
                </h3>
                <p className="font-mono text-[0.62rem] text-[#8A9AAA] mb-2">{c.region}</p>
                <p className="font-body text-[#8A9AAA] text-xs line-clamp-2">{c.description}</p>
              </div>
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-[rgba(201,168,76,0.1)]">
                <span className="font-mono text-[0.6rem] text-emerald-400">{c.total} Secret Spots</span>
                <span className="font-mono text-[0.65rem] text-[#C9A84C]">Entdecken →</span>
              </div>
            </Link>
          ))}
        </div>
      </PageSection>

      {/* ─── CORE FEATURES ─── */}
      <PageSection label="Plattform Highlights">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              icon: '🪙',
              title: 'Rubbel-Karten & GPS Secrets',
              desc: 'GPS-geschützte Geheimtipps unter Goldfolie. Jeder Scratch offenbart ein verifiziertes lokales Kleinod.',
              link: '/scratch',
            },
            {
              icon: '🧬',
              title: 'WanderBond™ 130-Hobby DNA',
              desc: 'Wähle aus über 130 Hobbys. Unser Algorithmus matcht dich mit Gleichgesinnten und maßgeschneiderten Trecks.',
              link: '/wanderbond',
            },
            {
              icon: '🐕',
              title: 'Hund & Kinderwagen Verifiziert',
              desc: '100% klare Angaben zu Stufenfreiheit, Trittsicherheit, Leinenpflicht und Wasserstellen für jede Route.',
              link: '/explore',
            },
            {
              icon: '👟',
              title: 'GPX-Touren & 1-Klick Kalender',
              desc: 'Routen von echten Wanderern mit Höhenprofilen. 1-Klick Download für Komoot, Garmin und Google Calendar.',
              link: '/tours',
            },
            {
              icon: '🏷️',
              title: '460+ Badges & Physischer Merch',
              desc: 'Sammle digitale Rang-Badges und bestelle sie als 300 DPI gestickte Aufnäher oder Leder-Pässe frei Haus.',
              link: '/badges',
            },
            {
              icon: '🤖',
              title: 'DNA-Aware AI Concierge',
              desc: 'Persönlicher KI-Reiseberater mit Zugriff auf Gezeiten, Wetter und das gesamte Secret-Spot-Archiv.',
              link: '/ai',
            },
          ].map(f => (
            <Link key={f.title} to={f.link} className="card p-5 group cursor-pointer">
              <span className="text-3xl block mb-3">{f.icon}</span>
              <h3 className="font-display text-[#C9A84C] text-[0.95rem] font-bold mb-2 group-hover:text-[#E8C460] transition-colors">
                {f.title}
              </h3>
              <p className="font-body text-[#8A9AAA] text-[0.9rem] leading-relaxed">{f.desc}</p>
            </Link>
          ))}
        </div>
      </PageSection>

      {/* ─── RECENT STORY PINS ─── */}
      <PageSection label="Verifizierte Secret Spots">
        <div className="grid md:grid-cols-3 gap-5 mb-6">
          {storyPins.slice(0, 3).map(pin => (
            <div key={pin.id} className="card overflow-hidden group flex flex-col justify-between">
              <div>
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={pin.image}
                    alt={pin.location}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#152539] to-transparent" />
                  <span className="absolute top-2 left-2 font-mono text-[0.58rem] bg-[#0C1825]/90 border border-[rgba(201,168,76,0.3)] text-[#F4E4C1] px-2 py-0.5 rounded-full font-bold">
                    {pin.countryFlag} {pin.city}
                  </span>
                  <span className="absolute bottom-2 left-3 font-mono text-[0.62rem] text-[#C9A84C] border border-[rgba(201,168,76,0.3)] px-2 py-0.5 rounded-full bg-[#0C1825]/80">
                    {pin.tag}
                  </span>
                </div>
                <div className="p-4">
                  <p className="font-display text-[#F4E4C1] text-sm font-semibold mb-1">{pin.location}</p>
                  <p className="font-body text-[#8A9AAA] text-xs leading-relaxed line-clamp-3">{pin.story}</p>
                </div>
              </div>
              <div className="p-4 pt-0">
                <div className="flex items-center justify-between pt-2 border-t border-[rgba(201,168,76,0.1)]">
                  <span className="font-mono text-[#C9A84C] text-[0.65rem]">★ {pin.rating}</span>
                  <span className="font-mono text-emerald-400 text-[0.65rem] font-bold">+{pin.xp} XP</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Link to="/explore" className="btn btn-secondary">
            Alle 24+ Secret Spots ansehen →
          </Link>
        </div>
      </PageSection>

      {/* ─── CTA STRIP ─── */}
      <div className="mx-6 sm:mx-8 mb-12 rounded-xl parchment p-8 text-center relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(ellipse_at_50%_0%,#8B3A2A,transparent_70%)]" />
        <p className="font-script text-3xl text-[#8B3A2A] mb-2 relative z-10">Your journey awaits…</p>
        <h2 className="font-display text-2xl font-bold text-[#2C1810] mb-4 relative z-10">
          Werde Teil von Scratch'n'Travel mit <span style={{ color: '#8B3A2A' }}>Explorer {user.name}</span>
        </h2>
        <div className="flex flex-wrap justify-center gap-3 relative z-10">
          <Link to="/pricing" className="btn btn-primary font-bold shadow-md">
            Pläne &amp; Mitgliedschaften
          </Link>
          <Link
            to="/host"
            className="btn"
            style={{
              background: '#2C1810',
              color: '#F4E4C1',
              border: '1px solid rgba(44,24,16,0.3)',
            }}
          >
            Host Portal (0% Fee)
          </Link>
        </div>
      </div>
    </div>
  )
}
