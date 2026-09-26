/**
 * Startseite.
 *
 * Bewusste Entscheidung: Das Erste, was ein Mensch sieht, ist kein
 * Feature-Brett, sondern eine Einladung. Die Community steht oben,
 * weil sie das Produkt ist — nicht die Geheimtipps.
 *
 * Ton: wie ein Reisefreund, der erzählt, was er gerade erlebt.
 * Kein Produktjargon, keine Zahlen, die verkaufen wollen.
 */
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTravel } from '../context/TravelContext'
import { ThemeToggle } from '../context/ThemeContext'
import { MEETUP_VIBES } from '../lib/community'

/** Wellige Linie — wie ein Horizont, keine harte Trennlinie. */
function Horizon({ flip = false }: { flip?: boolean }) {
  return (
    <div
      aria-hidden="true"
      style={{ height: 40, transform: flip ? 'rotate(180deg)' : undefined }}
    >
      <svg viewBox="0 0 1440 40" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
        <path
          d="M0,22 C240,8 480,34 720,22 C960,8 1200,34 1440,22 L1440,40 L0,40 Z"
          fill="var(--sun-wash)"
        />
        <path
          d="M0,26 C360,14 720,34 1080,20 C1260,13 1380,28 1440,26"
          stroke="var(--sun)"
          strokeOpacity="0.25"
          strokeWidth="1"
          fill="none"
        />
      </svg>
    </div>
  )
}

export default function Home() {
  const { user } = useTravel()
  const [copied, setCopied] = useState(false)

  const copyInvite = () => {
    const link = `${window.location.origin}/login?invite=${user.name.replace(/\s+/g, '_').toLowerCase()}`
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="fade-up">

      {/* ══════════════════ EINLADUNG ══════════════════ */}
      <section style={{ position: 'relative', padding: '4.5rem 1.5rem 3.5rem', textAlign: 'center' }}>
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', top: '-8rem', left: '50%', transform: 'translateX(-50%)',
            width: '38rem', height: '38rem', borderRadius: '50%',
            background: 'radial-gradient(circle, var(--sun-wash) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', maxWidth: 720, margin: '0 auto' }}>
          <p className="journal" style={{ margin: '0 0 0.6rem' }}>
            Schön, dass du hier bist
          </p>

          <h1
            className="font-display"
            style={{
              margin: '0 0 1.1rem',
              fontSize: 'clamp(2rem, 5.5vw, 3.4rem)',
              lineHeight: 1.12,
              color: 'var(--ink)',
              fontWeight: 600,
              letterSpacing: '-0.02em',
            }}
          >
            Finde unterwegs die Menschen,
            <br />
            die deine Reise{' '}
            <span style={{ color: 'var(--sun)', fontStyle: 'italic' }}>wirklich</span> teilen
          </h1>

          <p
            style={{
              margin: '0 auto 2rem',
              maxWidth: 540,
              color: 'var(--ink-soft)',
              fontSize: '1.05rem',
              lineHeight: 1.7,
            }}
          >
            Kein Swiping, keine Werbung. Nur Menschen, die auch wandern gehen,
            auch schlecht kochen oder auch einfach einen Kaffee trinken wollen —
            und offen sagen, worauf sie stehen.
          </p>

          <div style={{ display: 'flex', gap: '0.7rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/people" className="btn btn-primary">
              🤝 Gleichgesinnte finden
            </Link>
            <Link to="/meetups" className="btn btn-secondary">
              ☕ Kleines Meetup
            </Link>
            <Link to="/explore" className="btn btn-ghost">
              🗺️ Geheimtipps stöbern
            </Link>
          </div>

          <p style={{ margin: '1.1rem 0 0', color: 'var(--ink-ghost)', fontSize: '0.78rem' }}>
            Stöbern geht ohne Anmeldung. Schreiben und Mitspielen nicht.
          </p>
        </div>
      </section>

      <Horizon />

      {/* ══════════════════ WARUM DAS HIER ANDERS IST ══════════════════ */}
      <section style={{ padding: '3.5rem 1.5rem' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <h2
            className="font-display"
            style={{ margin: '0 0 0.5rem', fontSize: '1.6rem', color: 'var(--ink)', fontWeight: 600, textAlign: 'center' }}
          >
            Was uns wichtig ist
          </h2>
          <p style={{ margin: '0 0 2.5rem', color: 'var(--ink-faint)', textAlign: 'center', fontSize: '0.95rem' }}>
            Drei Versprechen, die wir halten — auch wenn es unbequem wird.
          </p>

          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
            {[
              {
                icon: '🔍',
                title: 'Wir sagen, woher es kommt',
                body:
                  'Ein Geheimtipp von uns hat ein anderes Zeichen als einer von einer Person ' +
                  'vor Ort. Nichts wird automatisch als „verifiziert" verkauft.',
              },
              {
                icon: '🚶',
                title: 'Kleine Gruppen, öffentliche Orte',
                body:
                  'Maximal acht Leute, fast immer in einem Café oder an einem Markt. ' +
                  'Keine Privatadresse beim ersten Treffen.',
              },
              {
                icon: '🚪',
                title: 'Du darfst jederzeit gehen',
                body:
                  'Ohne Begründung, ohne Rechtfertigung. Blockieren geht mit einem Klick, ' +
                  'und wir erfahren nicht, wer wen blockiert hat.',
              },
            ].map((item) => (
              <article key={item.title} className="card" style={{ padding: '1.4rem' }}>
                <div style={{ fontSize: '1.6rem', marginBottom: '0.6rem' }}>{item.icon}</div>
                <h3 className="font-display" style={{ margin: '0 0 0.5rem', fontSize: '1.05rem', color: 'var(--ink)', fontWeight: 600 }}>
                  {item.title}
                </h3>
                <p style={{ margin: 0, color: 'var(--ink-soft)', fontSize: '0.88rem', lineHeight: 1.65 }}>
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ WAS MAN HIER MACHEN KANN ══════════════════ */}
      <section style={{ padding: '1rem 1.5rem 3.5rem' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <h2
            className="font-display"
            style={{ margin: '0 0 0.4rem', fontSize: '1.6rem', color: 'var(--ink)', fontWeight: 600, textAlign: 'center' }}
          >
            So sieht ein Treffen aus
          </h2>
          <p style={{ margin: '0 0 2rem', color: 'var(--ink-faint)', textAlign: 'center', fontSize: '0.95rem' }}>
            Kein Programm, kein Bewerbungsgespräch. Du suchst dir aus, was dich interessiert.
          </p>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {MEETUP_VIBES.map((vibe) => (
              <span key={vibe.value} className="chip chip-sun" title={vibe.hint}>
                {vibe.icon} {vibe.label}
              </span>
            ))}
          </div>

          <div
            className="card card-accent"
            style={{ marginTop: '2rem', padding: '1.3rem 1.5rem' }}
          >
            <p className="journal" style={{ margin: '0 0 0.4rem' }}>
              Und wenn es nicht passt?
            </p>
            <p style={{ margin: 0, color: 'var(--ink-soft)', fontSize: '0.9rem', lineHeight: 1.65 }}>
              Dann gehst du. Das ist der ganze Punkt. Wir verkaufen keine Hoffnung,
              wir vermitteln Kontakt — und{' '}
              <Link to="/safety" style={{ color: 'var(--sun)', fontWeight: 600 }}>
                zeigen dir vorher, worauf du achten kannst
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <Horizon flip />

      {/* ══════════════════ EINLADUNG WEITERGEBEN ══════════════════ */}
      <section style={{ padding: '2.5rem 1.5rem 4rem' }}>
        <div style={{ maxWidth: 460, margin: '0 auto', textAlign: 'center' }}>
          <h2 className="font-display" style={{ margin: '0 0 0.4rem', fontSize: '1.25rem', color: 'var(--ink)', fontWeight: 600 }}>
            Kennst du jemanden, der mitreisen würde?
          </h2>
          <p style={{ margin: '0 0 1.2rem', color: 'var(--ink-faint)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Gute Ideen wachsen durch Empfehlung, nicht durch Werbung.
          </p>
          <button onClick={copyInvite} className="btn btn-ghost">
            {copied ? '✓ Link kopiert' : '🔗 Einladungslink kopieren'}
          </button>
        </div>
      </section>

      {/* ══════════════════ ERSCHEINUNDBILD ══════════════════ */}
      <div
        className="no-print"
        style={{
          display: 'flex', justifyContent: 'center', padding: '0 1.5rem 2.5rem',
        }}
      >
        <ThemeToggle />
      </div>
    </div>
  )
}