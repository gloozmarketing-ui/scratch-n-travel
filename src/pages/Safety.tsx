/**
 * Safety — das Sicherheitszentrum.
 *
 * Diese Seite ist kein Pflichtkram, sondern ein Werkzeug. Sie beantwortet
 * drei Fragen:
 *   1. Was habe ich von dieser Plattform? (Versprechen)
 *   2. Was kann ich selbst tun? (Checkliste)
 *   3. Wo melde ich, wenn etwas nicht stimmt? (Meldeweg)
 */
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import {
  SAFETY_CHECKLIST,
  SAFETY_PROMISES,
  RED_FLAGS,
  OFFLINE_DISCLAIMER,
  tierInfo,
  nextSteps,
  tierProgress,
  TRUST_EVENTS,
} from '../lib/trust'

export default function Safety() {
  const { trustTier, trustPoints } = useAuth()
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  const toggle = (title: string) => setChecked((c) => ({ ...c, [title]: !c[title] }))

  const info = tierInfo(trustTier)
  const next = nextSteps(trustPoints)
  const progress = tierProgress(trustPoints)

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '1.5rem 1rem 4rem' }}>
      <header style={{ marginBottom: '1.5rem' }}>
        <p className="font-mono text-[0.6rem] tracking-[0.25em] uppercase" style={{ color: 'var(--leaf)', margin: 0 }}>
          Sicherheit
        </p>
        <h1 style={{ fontSize: '1.6rem', color: 'var(--ink)', margin: '0.35rem 0 0.4rem' }}>
          So machen wir Treffen sicherer
        </h1>
        <p style={{ color: 'var(--ink-faint)', fontSize: '0.85rem', margin: 0, lineHeight: 1.65 }}>
          Wir können keine Sicherheit garantieren. Wir können nur das Maximum tun, was von
          unserer Seite aus geht — und dafür sorgen, dass du selbst gut vorbereitet bist.
        </p>
      </header>

      <Section title="Was wir zusagen" icon="🤝">
        <div style={{ display: 'grid', gap: '0.6rem' }}>
          {SAFETY_PROMISES.map((p, i) => (
            <div key={i} style={cardStyle}>
              <p style={{ margin: 0, color: 'var(--leaf)', fontSize: '0.78rem', lineHeight: 1.55 }}>
                ✓ {p.we}
              </p>
              <p style={{ margin: '0.35rem 0 0', color: 'var(--ink-faint)', fontSize: '0.74rem', lineHeight: 1.55 }}>
                ✗ {p.notWe}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Vor dem ersten Treffen" icon="📋" hint="Anklicken zum Abhaken">
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {SAFETY_CHECKLIST.map((c) => {
            const isChecked = checked[c.title]
            return (
              <button
                key={c.title}
                onClick={() => toggle(c.title)}
                style={{
                  ...checkItemStyle,
                  background: isChecked ? 'var(--leaf-wash)' : 'var(--card)',
                  borderColor: isChecked ? 'var(--leaf-wash)' : 'var(--line)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                <span aria-hidden="true" style={{ fontSize: '1rem' }}>{c.icon}</span>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={{ margin: 0, color: 'var(--ink)', fontSize: '0.8rem', fontWeight: 600 }}>
                    {isChecked && <span style={{ color: 'var(--leaf)' }}>✓ </span>}
                    {c.title}
                  </p>
                  <p style={{ margin: '0.15rem 0 0', color: 'var(--ink-faint)', fontSize: '0.74rem', lineHeight: 1.55 }}>
                    {c.text}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </Section>

      <Section title="Warnsignale" icon="⚠️" hint="Behalte diese im Kopf">
        <ul style={{ margin: 0, paddingLeft: '1.1rem', display: 'grid', gap: '0.4rem' }}>
          {RED_FLAGS.map((f) => (
            <li key={f} style={{ color: 'var(--sun)', fontSize: '0.78rem', lineHeight: 1.55 }}>
              {f}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Deine Vertrauensstufe" icon={info.icon}>
        <div style={tierCardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
            <span style={{ fontSize: '1.5rem' }}>{info.icon}</span>
            <div>
              <p style={{ margin: 0, color: info.color, fontSize: '0.95rem', fontWeight: 700 }}>
                {info.label}
              </p>
              <p style={{ margin: 0, color: 'var(--ink-ghost)', fontSize: '0.7rem' }}>
                {trustPoints} Punkt{trustPoints === 1 ? '' : 'e'} gesammelt
              </p>
            </div>
          </div>

          <div style={barTrackStyle}>
            <div
              style={{
                width: `${Math.round(progress * 100)}%`,
                height: '100%',
                background: `linear-gradient(90deg, ${info.color}, var(--sun))`,
                borderRadius: 3,
                transition: 'width 0.4s ease',
              }}
            />
          </div>

          {trustTier !== 'anchor' ? (
            <>
              <p style={{ margin: '0 0 0.7rem', color: 'var(--ink-faint)', fontSize: '0.76rem', lineHeight: 1.6 }}>
                Noch {next.needed} Punkt{next.needed === 1 ? '' : 'e'} bis{' '}
                <strong style={{ color: next.tier.color }}>{next.tier.label}</strong>.
              </p>
              <div style={{ display: 'grid', gap: '0.35rem' }}>
                {next.actions.map((a) => (
                  <div key={a.type} style={{ display: 'flex', gap: '0.5rem', alignItems: 'baseline' }}>
                    <span style={{ color: 'var(--sun)', fontSize: '0.7rem', fontWeight: 700, flexShrink: 0 }}>
                      +{a.points}
                    </span>
                    <span style={{ color: 'var(--ink-soft)', fontSize: '0.75rem' }}>{a.label}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p style={{ margin: 0, color: 'var(--leaf)', fontSize: '0.76rem' }}>
              Du hast die höchste Stufe erreicht. Du kannst eigene Meetups ausrichten.
            </p>
          )}
        </div>

        <details style={{ marginTop: '0.75rem' }}>
          <summary style={{ color: 'var(--ink-faint)', fontSize: '0.75rem', cursor: 'pointer' }}>
            Alle Schritte und Voraussetzungen ansehen
          </summary>
          <div style={{ display: 'grid', gap: '0.5rem', marginTop: '0.6rem' }}>
            {[...TRUST_EVENTS].reverse().map((e) => (
              <div key={e.type} style={{ display: 'flex', gap: '0.6rem', alignItems: 'baseline' }}>
                <span style={{ color: 'var(--sun)', fontSize: '0.68rem', fontWeight: 700, minWidth: 26 }}>
                  +{e.points}
                </span>
                <span style={{ minWidth: 0 }}>
                  <span style={{ color: 'var(--ink)', fontSize: '0.76rem', display: 'block' }}>{e.label}</span>
                  <span style={{ color: 'var(--ink-ghost)', fontSize: '0.7rem', display: 'block' }}>
                    {e.description} · {e.typical} der Nutzer
                  </span>
                </span>
              </div>
            ))}
          </div>
        </details>
      </Section>

      <Section title="Wenn etwas nicht stimmt" icon="📨">
        <div style={cardStyle}>
          <p style={{ margin: '0 0 0.6rem', color: 'var(--ink-soft)', fontSize: '0.78rem', lineHeight: 1.6 }}>
            In jedem Chat und neben jedem Profil findest du das Schildsymbol. Dort kannst du
            <strong style={{ color: 'var(--ink)' }}> sofort blockieren</strong> (wirkt sofort, ohne
            Begründung) oder <strong style={{ color: 'var(--ink)' }}>melden</strong> (für Belästigung,
            Betrug oder Fake-Profile).
          </p>
          <p style={{ margin: 0, color: 'var(--ink-ghost)', fontSize: '0.72rem', lineHeight: 1.6 }}>
            Wir geben dem gemeldeten Menschen keine Auskunft über die Meldung. Das ist Absicht:
            Sonst wäre die Meldefunktion nutzlos.
          </p>
        </div>
      </Section>

      <Section title="Akute Gefahr" icon="🆘">
        <div style={emergencyStyle}>
          <p style={{ margin: '0 0 0.5rem', color: 'var(--terracotta)', fontSize: '0.85rem', fontWeight: 600 }}>
            Bei unmittelbarer Gefahr: Polizei
          </p>
          <p style={{ margin: '0 0 0.4rem', color: 'var(--ink-soft)', fontSize: '0.78rem', lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--ink)' }}>Europa: 112</strong> ·{' '}
            <strong style={{ color: 'var(--ink)' }}>Deutschland: 110</strong> (Polizei)
          </p>
          <p style={{ margin: 0, color: 'var(--ink-ghost)', fontSize: '0.72rem', lineHeight: 1.6 }}>
            {OFFLINE_DISCLAIMER}
          </p>
        </div>
      </Section>
    </div>
  )
}

function Section({
  title,
  icon,
  hint,
  children,
}: {
  title: string
  icon: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <section style={{ marginBottom: '1.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.7rem' }}>
        <h2 style={{ margin: 0, color: 'var(--ink)', fontSize: '1rem' }}>
          {icon} {title}
        </h2>
        {hint && <span style={{ color: 'var(--ink-ghost)', fontSize: '0.68rem' }}>{hint}</span>}
      </div>
      {children}
    </section>
  )
}

// --- Styles ----------------------------------------------------------------

const cardStyle: React.CSSProperties = {
  background: 'var(--card)',
  border: '1px solid var(--line)',
  borderRadius: 10,
  padding: '0.7rem 0.85rem',
}

const checkItemStyle: React.CSSProperties = {
  display: 'flex',
  gap: '0.7rem',
  border: '1px solid',
  borderRadius: 10,
  padding: '0.7rem 0.85rem',
}

const tierCardStyle: React.CSSProperties = {
  background: 'var(--card)',
  border: '1px solid var(--sun-wash)',
  borderRadius: 12,
  padding: '1rem',
}

const barTrackStyle: React.CSSProperties = {
  height: 6,
  background: 'var(--line)',
  borderRadius: 3,
  marginBottom: '0.5rem',
}

const emergencyStyle: React.CSSProperties = {
  background: 'var(--terracotta-wash)',
  border: '1px solid var(--terracotta-wash)',
  borderRadius: 12,
  padding: '1rem',
}
