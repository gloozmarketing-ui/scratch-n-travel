import { Link } from 'react-router-dom'
import { useState } from 'react'
import ScratchCard from '../components/ScratchCard'
import { storyPins, tours } from '../data/data'

// ─── INLINE DECORATIVES ──────────────────────────────────────
function DottedPath() {
  return (
    <div className="hidden lg:flex items-center justify-center gap-0 absolute top-1/2 -translate-y-1/2 left-[18%] right-[18%] z-0 pointer-events-none">
      <svg width="100%" height="30" viewBox="0 0 600 30" preserveAspectRatio="none">
        <path d="M0,15 Q150,5 300,15 Q450,25 600,15" stroke="rgba(201,168,76,0.3)" strokeWidth="1.5"
          strokeDasharray="6 6" fill="none" />
        <circle cx="0" cy="15" r="4" fill="#C9A84C" opacity="0.5" />
        <circle cx="200" cy="11" r="3" fill="#C9A84C" opacity="0.3" />
        <circle cx="400" cy="19" r="3" fill="#C9A84C" opacity="0.3" />
        <circle cx="600" cy="15" r="4" fill="#C9A84C" opacity="0.5" />
      </svg>
    </div>
  )
}

function TerrainDivider({ flip = false }: { flip?: boolean }) {
  return (
    <div className={`w-full overflow-hidden ${flip ? 'rotate-180' : ''}`} style={{ height: 32 }}>
      <svg viewBox="0 0 1440 32" className="w-full h-full" preserveAspectRatio="none">
        <path d="M0,16 C240,4 480,28 720,16 C960,4 1200,28 1440,16 L1440,32 L0,32 Z"
          fill="rgba(201,168,76,0.04)" />
        <path d="M0,20 C360,8 720,28 1080,14 C1260,7 1380,22 1440,20"
          stroke="rgba(201,168,76,0.12)" strokeWidth="1" fill="none" />
      </svg>
    </div>
  )
}

function Coord({ text }: { text: string }) {
  return <span className="coord">{text}</span>
}

// ─── HOME ─────────────────────────────────────────────────────
export default function Home() {
  const [scratched, setScratched] = useState(false)

  return (
    <div className="overflow-hidden">

      {/* ══════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════ */}
      <section className="relative min-h-[90vh] flex flex-col justify-center px-8 py-16 overflow-hidden">
        {/* Atmosphere layers */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_40%,rgba(26,46,90,0.7),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_85%_60%,rgba(201,168,76,0.05),transparent)]" />
        <div className="absolute top-0 right-0 w-96 h-96 opacity-5"
          style={{background:'radial-gradient(circle,#F4E4C1 0%,transparent 70%)'}} />

        {/* Map-grid accent lines */}
        <div className="absolute inset-0 opacity-40 map-grid" />

        {/* Compass watermark */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-[0.04] hidden xl:block">
          <svg width="320" height="320" viewBox="0 0 100 100">
            <polygon points="50,2 44,50 56,50"  fill="#C9A84C"/>
            <polygon points="50,98 44,50 56,50" fill="#C9A84C"/>
            <polygon points="98,50 50,44 50,56" fill="#C9A84C"/>
            <polygon points="2,50 50,44 50,56"  fill="#C9A84C"/>
            <polygon points="50,2 72,28 50,50"  fill="#C9A84C"/>
            <polygon points="50,2 28,28 50,50"  fill="#C9A84C"/>
            <circle cx="50" cy="50" r="8" fill="#C9A84C"/>
            <circle cx="50" cy="50" r="4" fill="#0C1825"/>
            {[0,45,90,135,180,225,270,315].map(a => (
              <line key={a}
                x1={50 + 12*Math.sin(a*Math.PI/180)}
                y1={50 - 12*Math.cos(a*Math.PI/180)}
                x2={50 + 48*Math.sin(a*Math.PI/180)}
                y2={50 - 48*Math.cos(a*Math.PI/180)}
                stroke="#C9A84C" strokeWidth="0.5" />
            ))}
          </svg>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto w-full">
          <div className="grid lg:grid-cols-[1fr_auto] gap-12 items-center">

            {/* Left: Copy */}
            <div className="max-w-xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-[0.65rem] text-[rgba(201,168,76,0.65)] tracking-[0.22em] uppercase">Pre-Launch Beta · Limited Slots Open</span>
              </div>

              <p className="font-script text-[rgba(201,168,76,0.55)] text-2xl mb-2 -ml-0.5">
                — das Reisen neu entdecken
              </p>
              <h1 className="font-display font-black text-5xl lg:text-[3.6rem] leading-[1.06] text-[#F4E4C1] mb-5">
                Entdecke was<br />
                <span className="gold-text">kein Reiseführer</span><br />
                dir zeigt
              </h1>
              <p className="font-body text-[1.1rem] text-[#8A9AAA] leading-relaxed mb-8">
                Scratch'n'Travel verbindet Reisende mit echten lokalen Geheimnissen — GPS-Koordinaten, die hinter einer Kratz-Folie versteckt sind. Verbinde dich mit Locals, deren Hobbys zu deinen passen. Sammle deine Reise als Luxus-Artefakt.
              </p>

              <div className="flex flex-wrap gap-3 mb-10">
                <Link to="/scratch" className="btn btn-primary pulse-gold text-sm px-6 py-3">
                  🪙 Kostenlos starten
                </Link>
                <Link to="/explore" className="btn btn-secondary text-sm px-6 py-3">
                  🗺️ Karte erkunden
                </Link>
              </div>

              {/* Live stats */}
              <div className="flex gap-8 pt-6 border-t border-[rgba(201,168,76,0.1)]">
                {[['400+','Badge-Designs'],['130','Hobby-DNA-Tags'],['50 k+','Geheimnisse enthüllt']].map(([n,l]) => (
                  <div key={l}>
                    <p className="font-display text-[#C9A84C] font-bold text-2xl leading-none">{n}</p>
                    <p className="font-mono text-[0.6rem] text-[#8A9AAA] tracking-wide uppercase mt-1">{l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Interactive Scratch Demo */}
            <div className="flex flex-col items-center gap-5 lg:pr-4">
              <div className="text-center">
                <p className="font-mono text-[0.62rem] text-[rgba(201,168,76,0.5)] tracking-[0.2em] uppercase mb-1">· Live-Demo ·</p>
                <p className="font-script text-[rgba(201,168,76,0.4)] text-base">Kratz einfach drüber…</p>
              </div>
              <div className="float-anim">
                <ScratchCard width={300} height={195} onComplete={() => setScratched(true)}>
                  <div className="text-center px-6 py-4 w-full">
                    <p className="font-mono text-[0.6rem] text-[rgba(201,168,76,0.7)] mb-1.5">📍 Geheimort — Portugal</p>
                    <p className="font-display text-[#F4E4C1] text-xl font-bold mb-1">Praia da Ursa</p>
                    <Coord text={'38°47\'29"N · 9°28\'32"W'} />
                    <div className="flex items-center justify-center gap-3 mt-3">
                      <span className="font-mono text-emerald-400 text-sm font-semibold">+120 XP</span>
                      <span className="text-[rgba(201,168,76,0.25)]">·</span>
                      <span className="font-mono text-[#C9A84C] text-xs">Explorer Rang 1</span>
                    </div>
                  </div>
                </ScratchCard>
              </div>
              {scratched ? (
                <div className="text-center fade-up">
                  <p className="font-script text-emerald-400 text-lg">Dein erster Geheimort! 🎉</p>
                  <Link to="/scratch" className="btn btn-secondary text-xs mt-2">Mehr enthüllen →</Link>
                </div>
              ) : (
                <div className="text-center">
                  <p className="font-body text-[rgba(201,168,76,0.3)] text-sm italic">mit Finger oder Maus kratzen</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <TerrainDivider />

      {/* ══════════════════════════════════════════════════════
          HOW IT WORKS — Die Expedition
      ══════════════════════════════════════════════════════ */}
      <section className="py-16 px-8 bg-[#0E1F33]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="font-script text-[rgba(201,168,76,0.5)] text-xl mb-1">die Expedition</p>
            <h2 className="font-display text-4xl text-[#F4E4C1] font-bold mb-3">
              Wie es funktioniert
            </h2>
            <p className="font-body text-[#8A9AAA] max-w-lg mx-auto">
              In drei Schritten vom Touristen zum echten Entdecker — mit Geheimnissen, die nur Locals kennen.
            </p>
          </div>

          <div className="relative grid lg:grid-cols-4 gap-6">
            <DottedPath />
            {[
              {
                step: '01', icon: '🧬', title: 'Hobbys wählen',
                desc: 'Wähle aus 130 Reise-Hobbys. Unser WanderBond-Algorithmus berechnet deine Kompatibilität mit echten Locals — nach Leidenschaft, nicht nach Zeitplan.',
                coord: '38°N · 9°W', tag: 'Persönlichkeit'
              },
              {
                step: '02', icon: '🪙', title: 'Kratzen & Enthüllen',
                desc: 'Hinter jeder Kratz-Folie verbirgt sich eine echte GPS-Koordinate — verifiziert von Locals. Erhalte XP, steige im Rang auf und sammle deine Route.',
                coord: '+120 XP earned', tag: 'Entdeckung'
              },
              {
                step: '03', icon: '🤝', title: 'Mit Locals verbinden',
                desc: 'Golden Story Pins verbinden dich mit den Menschen hinter den Orten. Echte Namen, echte Geschichten, echte Begegnungen — kein Algorithmus-Tourismus.',
                coord: '94% Match · Pedro', tag: 'Verbindung'
              },
              {
                step: '04', icon: '🏷️', title: 'Reise sammeln',
                desc: 'Deine enthüllten Orte werden zum Luxus-Artefakt: Gold-geprägte Reisepässe, gestickte Patches, gravierte Keychains mit deinen GPS-Koordinaten.',
                coord: 'Serie I · 2026', tag: 'Kollektion'
              },
            ].map((s, i) => (
              <div key={i} className="relative z-10 flex flex-col">
                {/* Step card */}
                <div className="card p-5 flex-1 group hover:border-[rgba(201,168,76,0.4)] transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-3xl">{s.icon}</span>
                    <span className="font-mono text-[0.58rem] text-[rgba(201,168,76,0.3)] font-bold">{s.step}</span>
                  </div>
                  <span className="font-mono text-[0.58rem] border border-[rgba(201,168,76,0.2)] text-[rgba(201,168,76,0.6)] px-2 py-0.5 rounded-full mb-3 inline-block">{s.tag}</span>
                  <h3 className="font-display text-[#F4E4C1] font-bold text-base mb-2 group-hover:text-[#C9A84C] transition-colors">{s.title}</h3>
                  <p className="font-body text-[#8A9AAA] text-sm leading-relaxed flex-1">{s.desc}</p>
                  <p className="coord mt-3">{s.coord}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TerrainDivider flip />

      {/* ══════════════════════════════════════════════════════
          WAS DU GEWINNST — Benefits
      ══════════════════════════════════════════════════════ */}
      <section className="py-16 px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-14 items-center">

            {/* Left: Parchment quote panel */}
            <div className="parchment rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-4 right-6 font-display text-[5rem] text-[rgba(44,24,16,0.06)] leading-none select-none">"</div>
              <p className="font-script text-[#8B3A2A] text-2xl mb-4 relative z-10">
                Kein Reiseführer, keine Werbung, kein Algorithmus.
              </p>
              <p className="font-body text-[#2C1810] text-[1.05rem] leading-relaxed mb-6 relative z-10">
                Scratch'n'Travel ist die erste Plattform, die <strong>GPS-Geheimnisse von echten Locals</strong> hinter einer digitalen Kratz-Folie versteckt. Du enthüllst, was Touristen nie sehen — und sammelst deine Reise als physisches Luxus-Artefakt.
              </p>
              <div className="flex gap-4 relative z-10">
                {[['🔒','Kein Tracking'],['🇩🇪','DSGVO'],['📵','Werbefrei']].map(([ic,l]) => (
                  <div key={l} className="text-center">
                    <p className="text-xl">{ic}</p>
                    <p className="font-mono text-[0.58rem] text-[#8B3A2A] uppercase tracking-wide">{l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Benefit list */}
            <div className="space-y-4">
              <div className="mb-6">
                <p className="font-script text-[rgba(201,168,76,0.5)] text-xl mb-1">dein Vorteil</p>
                <h2 className="font-display text-3xl text-[#F4E4C1] font-bold">
                  Was du als Explorer bekommst
                </h2>
              </div>
              {[
                { icon:'🗺️', title:'Echte Geheimnisse, keine Werbung', desc:'Alle Story Pins stammen von verifizierten Locals — keine gesponserten Inhalte, keine Touristenfallen.' },
                { icon:'📍', title:'Genaue GPS-Koordinaten', desc:'Pro-Nutzer erhalten exakte Koordinaten zum Navigieren. Free-Nutzer sehen bewusst unscharf — als Motivation zu entdecken.' },
                { icon:'🧬', title:'130-Hobby DNA-Match', desc:'Finde Locals, die dieselben Leidenschaften teilen — ob Freediving, Fado oder Fermentation. Kein Smalltalk, echte Verbindung.' },
                { icon:'🏷️', title:'Deine Reise als Artefakt', desc:'Enthüllte Orte werden zum gravierten Keychain, gestickten Patch oder gold-geprägten Reisepass. Erinnerungen zum Anfassen.' },
                { icon:'🤖', title:'KI-Reisebegleiter', desc:'Live-Wetter, Wassertemperatur, Gezeitenzeiten — dein KI-Assistent generiert in Sekunden personalisierte Routen mit GPX-Export.' },
              ].map((b, i) => (
                <div key={i} className="card p-4 flex gap-4 items-start group hover:border-[rgba(201,168,76,0.35)] transition-all">
                  <span className="text-2xl flex-shrink-0 mt-0.5">{b.icon}</span>
                  <div>
                    <p className="font-display text-[#F4E4C1] font-bold text-sm mb-1 group-hover:text-[#C9A84C] transition-colors">{b.title}</p>
                    <p className="font-body text-[#8A9AAA] text-sm leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FÜR WEN? — Explorer-Typen
      ══════════════════════════════════════════════════════ */}
      <section className="py-14 px-8 bg-[#0E1F33]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="font-script text-[rgba(201,168,76,0.5)] text-xl mb-1">für alle Entdecker</p>
            <h2 className="font-display text-3xl text-[#F4E4C1] font-bold">Wer profitiert?</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon:'🏄', who:'Abenteuer-Reisende', desc:'Surf-Spots, Kliff-Pfade und Wildwasser-Zugänge, die in keiner App auftauchen. Nur von Locals verifiziert.' },
              { icon:'🍽️', who:'Food-Explorers', desc:'Restaurants ohne Schild, Märkte ohne Werbung, Weinkeller ohne Öffnungszeiten — die echten Adressen der Region.' },
              { icon:'👨‍👩‍👧', who:'Familien', desc:'Sichere, verifizierte Ausflugsziele, Hunde-Strände, Familien-Checklisten und sanfte Routen — alles gefiltert.' },
              { icon:'📸', who:'Fotografen', desc:'GPS-Koordinaten für versteckte Sonnenaufgang-Spots, Langzeitbelichtungs-Plätze und unberührte Küstenabschnitte.' },
              { icon:'🏢', who:'Gastgeber & Businesses', desc:'Listing ohne Provision. Zero-Commission-Modell, direkter Gäste-Kontakt, Gold-Verifizierungs-Badge.' },
              { icon:'🌿', who:'Slow Traveller', desc:'Lerne die Sprache eines Ortes kennen — nicht seine Attraktionen. Tiefe Verbindungen statt Stempel im Reisepass.' },
            ].map((e, i) => (
              <div key={i} className="card p-5">
                <p className="text-3xl mb-3">{e.icon}</p>
                <p className="font-display text-[#C9A84C] font-bold mb-2">{e.who}</p>
                <p className="font-body text-[#8A9AAA] text-sm leading-relaxed">{e.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          STORY PINS PREVIEW
      ══════════════════════════════════════════════════════ */}
      <section className="py-16 px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
            <div>
              <p className="font-script text-[rgba(201,168,76,0.5)] text-xl mb-1">aktuelle Geheimisse</p>
              <h2 className="font-display text-3xl text-[#F4E4C1] font-bold">Golden Story Pins</h2>
            </div>
            <Link to="/stories" className="btn btn-secondary text-sm">Alle ansehen →</Link>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {storyPins.slice(0, 3).map(pin => (
              <div key={pin.id} className="card overflow-hidden group">
                <div className="relative h-40">
                  <img src={pin.image} alt={pin.location} className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#152539] via-[rgba(12,24,37,0.2)] to-transparent" />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="font-mono text-[0.58rem] bg-[rgba(12,24,37,0.85)] border border-[rgba(201,168,76,0.25)] text-[rgba(201,168,76,0.9)] px-2 py-0.5 rounded-full">{pin.tag}</span>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <span className="font-mono text-[0.58rem] text-emerald-400/80 bg-[rgba(12,24,37,0.7)] px-2 py-0.5 rounded-full">+{pin.xp} XP</span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-full gold-gradient flex items-center justify-center font-display font-bold text-[#0C1825] text-xs flex-shrink-0">
                      {pin.avatar}
                    </div>
                    <div>
                      <p className="font-display text-[#F4E4C1] text-xs font-semibold">{pin.local}</p>
                      <p className="font-mono text-[0.58rem] text-[#8A9AAA]">{pin.location}</p>
                    </div>
                  </div>
                  <p className="font-body text-[#8A9AAA] text-sm leading-relaxed line-clamp-2 mb-3">{pin.story}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[#C9A84C] text-xs">{'★'.repeat(Math.floor(pin.rating))} <span className="text-[#8A9AAA]">{pin.rating}</span></span>
                    {pin.locked ? (
                      <span className="font-mono text-[0.58rem] text-[rgba(201,168,76,0.5)] border border-[rgba(201,168,76,0.15)] px-2 py-0.5 rounded-full">GPS gesperrt</span>
                    ) : (
                      <span className="font-mono text-[0.58rem] text-emerald-400/70 border border-emerald-400/20 px-2 py-0.5 rounded-full">GPS enthüllt</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FEATURED ROUTE
      ══════════════════════════════════════════════════════ */}
      <section className="py-4 px-8 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
            <div>
              <p className="font-script text-[rgba(201,168,76,0.5)] text-xl mb-1">top route</p>
              <h2 className="font-display text-3xl text-[#F4E4C1] font-bold">Community Tours</h2>
            </div>
            <Link to="/tours" className="btn btn-secondary text-sm">Alle Routen →</Link>
          </div>
          {tours[0] && (
            <div className="card overflow-hidden flex flex-col md:flex-row">
              <div className="md:w-72 lg:w-80 flex-shrink-0">
                <img src={tours[0].image} alt={tours[0].title} className="w-full h-52 md:h-full object-cover opacity-75" />
              </div>
              <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex gap-2 mb-3 flex-wrap">
                    {tours[0].tags.slice(0,3).map(t => (
                      <span key={t} className="font-mono text-[0.58rem] border border-[rgba(201,168,76,0.2)] text-[rgba(201,168,76,0.7)] px-2 py-0.5 rounded-full">{t}</span>
                    ))}
                  </div>
                  <h3 className="font-display text-[#F4E4C1] text-xl font-bold mb-1">{tours[0].title}</h3>
                  <p className="font-body text-[#8A9AAA] text-sm mb-4">von {tours[0].creator} · ★ {tours[0].rating} · {tours[0].reviews} Bewertungen</p>
                  <div className="grid grid-cols-3 gap-3">
                    {[['📏',tours[0].distance,'Distanz'],['⏱',tours[0].duration,'Dauer'],['🏃',tours[0].difficulty,'Niveau']].map(([ic,v,l]) => (
                      <div key={String(l)} className="bg-[#0C1825] rounded-lg py-2.5 text-center">
                        <p className="text-lg mb-0.5">{ic}</p>
                        <p className="font-display text-[#F4E4C1] text-sm font-bold">{v}</p>
                        <p className="font-mono text-[0.55rem] text-[#8A9AAA]">{l}</p>
                      </div>
                    ))}
                  </div>
                  <p className="font-mono text-[0.65rem] text-[#8A9AAA] mt-3">Beste Zeit: <span className="text-[#C9A84C]">{tours[0].bestTime}</span></p>
                </div>
                <div className="flex gap-3 mt-5">
                  <button className="btn btn-primary">↓ GPX exportieren</button>
                  <Link to="/tours" className="btn btn-secondary">Alle Routen →</Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          COLLECTOR SECTION — Badge preview
      ══════════════════════════════════════════════════════ */}
      <section className="py-14 px-8 bg-[#0E1F33]">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="font-script text-[rgba(201,168,76,0.5)] text-xl mb-1">deine Reise als Artefakt</p>
              <h2 className="font-display text-3xl text-[#F4E4C1] font-bold mb-4">
                Sammel was du entdeckst
              </h2>
              <p className="font-body text-[#8A9AAA] leading-relaxed mb-6">
                Jeder enthüllte Ort wird Teil deiner digitalen Kollektion — und kann als physisches Produkt bestellt werden. Gestickte Patches, Gravur-Keychains mit deinen GPS-Koordinaten und gold-geprägte Reisepässe in Handarbeit.
              </p>
              <div className="space-y-3 mb-6">
                {[
                  ['🧵','Iron-on Patches','3D bestickter Rand, Wärme-Klebeschicht — für Jacken, Rucksäcke, Hüte'],
                  ['🔑','Metal Keychains','Matte-Black, Laser-Gravur mit deinen GPS-Koordinaten + Username'],
                  ['📔','Hardcover Journal','Gold-geprägter Einband mit Länder-Vektorkarten deiner Reisen'],
                ].map(([ic,ti,de]) => (
                  <div key={String(ti)} className="flex gap-3 items-start">
                    <span className="text-xl flex-shrink-0">{ic}</span>
                    <div>
                      <p className="font-display text-[#F4E4C1] text-sm font-bold">{ti}</p>
                      <p className="font-body text-[#8A9AAA] text-xs leading-relaxed">{de}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/badges" className="btn btn-primary">Badge-Shop ansehen →</Link>
            </div>

            {/* Badge showcase */}
            <div className="grid grid-cols-3 gap-3">
              {[
                {emoji:'🌱', name:'First Scratch', tier:'bronze', unlocked:true},
                {emoji:'🗺️', name:'Wanderer', tier:'bronze', unlocked:true},
                {emoji:'🤝', name:'Local Whisperer', tier:'silver', unlocked:true},
                {emoji:'🛡️', name:'Safety Guardian', tier:'bronze', unlocked:true},
                {emoji:'🚀', name:'Beta Pioneer', tier:'platinum', unlocked:true},
                {emoji:'🌍', name:'Globe Trotter', tier:'silver', unlocked:false},
                {emoji:'⛰️', name:'Summit Chaser', tier:'gold', unlocked:false},
                {emoji:'💎', name:'Diamond Member', tier:'platinum', unlocked:false},
                {emoji:'🌋', name:'Volcano Walker', tier:'gold', unlocked:false, isNew:true},
              ].map((b, i) => {
                const tg: Record<string,string> = {
                  bronze:'linear-gradient(135deg,#8B5A1A,#CD7F32)',
                  silver:'linear-gradient(135deg,#6A7A8A,#A0B0C0)',
                  gold:'linear-gradient(135deg,#C9A84C,#E8C460)',
                  platinum:'linear-gradient(135deg,#6A8FAF,#C0D8EE,#8B6BAE)',
                }
                return (
                  <div key={i} className={`card p-3 text-center flex flex-col items-center gap-1.5 transition-all hover:scale-105 ${!b.unlocked ? 'opacity-40' : ''}`}>
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl"
                      style={{background:tg[b.tier], filter:b.unlocked?'none':'grayscale(1)'}}>
                      {b.unlocked ? b.emoji : '🔒'}
                    </div>
                    <p className="font-mono text-[0.55rem] text-[#8A9AAA] leading-tight">{b.name}</p>
                    {(b as any).isNew && <span className="font-mono text-[0.5rem] font-bold text-[#0C1825] px-1 py-0.5 rounded shimmer-anim">NEW</span>}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          TRUST STRIP
      ══════════════════════════════════════════════════════ */}
      <section className="py-10 px-8 border-y border-[rgba(201,168,76,0.08)]">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-8">
          {[
            ['🔒','Kein Tracking, keine Werbecookies'],
            ['🇩🇪','DSGVO & GDPR-konform'],
            ['📵','Offline-Modus (PWA)'],
            ['✅','Community-verifizierte Inhalte'],
            ['💳','Stripe · Sicher · Cancel anytime'],
          ].map(([ic, l]) => (
            <div key={String(l)} className="flex items-center gap-2">
              <span>{ic}</span>
              <span className="font-mono text-[0.65rem] text-[#8A9AAA]">{l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════════════════ */}
      <section className="py-16 px-8">
        <div className="max-w-3xl mx-auto parchment rounded-2xl p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(ellipse_at_50%_0%,#8B3A2A,transparent_60%)]" />
          <div className="relative z-10">
            <p className="font-script text-[#8B3A2A] text-3xl mb-2">Dein nächstes Abenteuer beginnt hier.</p>
            <h2 className="font-display text-2xl font-black text-[#2C1810] mb-3">
              Kostenlos starten — keine Karte nötig
            </h2>
            <p className="font-body text-[#2C1810]/70 mb-6 max-w-md mx-auto">
              3 Scratch-Karten & 2 KI-Anfragen pro Tag gratis. Upgrade jederzeit — oder verdiene 30 Tage Pro durch einen verifizierten Story-Pin.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/login" className="btn btn-parchment text-sm px-6 py-3" style={{border:'1px solid rgba(139,58,42,0.35)'}}>
                🪙 Jetzt kostenlos starten
              </Link>
              <Link to="/pricing" className="btn text-sm px-6 py-3 border border-[rgba(44,24,16,0.2)] text-[#2C1810] hover:bg-[rgba(44,24,16,0.07)]">
                Preise ansehen
              </Link>
            </div>
            <p className="font-mono text-[0.6rem] text-[#8B3A2A]/60 mt-5 uppercase tracking-widest">
              Pre-Launch Beta · Limited City Slots · Join the Expedition
            </p>
          </div>
        </div>
      </section>

    </div>
  )
}
