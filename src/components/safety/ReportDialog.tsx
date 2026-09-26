// --- Styles ----------------------------------------------------------------

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'var(--scrim, rgba(20, 16, 12, 0.55))',
  backdropFilter: 'blur(6px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1rem',
  zIndex: 10000,
}

const dialogStyle: React.CSSProperties = {
  background: 'var(--card)',
  border: '1px solid var(--line)',
  borderRadius: 16,
  padding: '1.4rem',
  maxHeight: '88vh',
  overflowY: 'auto',
  width: '100%',
  boxShadow: '0 24px 60px var(--shadow-lg)',
}

const errorStyle: React.CSSProperties = {
  background: 'var(--terracotta-wash)',
  border: '1px solid var(--terracotta-wash)',
  borderRadius: 8,
  padding: '0.6rem 0.8rem',
  marginBottom: '0.9rem',
  color: 'var(--terracotta)',
  fontSize: '0.75rem',
}

const blockCardStyle: React.CSSProperties = {
  background: 'var(--line)',
  border: '1px solid var(--line)',
  borderRadius: 10,
  padding: '0.9rem',
  marginBottom: '1rem',
}

const closeButtonStyle: React.CSSProperties = {
  background: 'var(--line)',
  border: 'none',
  color: 'var(--ink-faint)',
  width: 28,
  height: 28,
  borderRadius: 8,
  cursor: 'pointer',
  fontSize: '0.8rem',
  flexShrink: 0,
}

const primaryButtonStyle: React.CSSProperties = {
  width: '100%',
  marginTop: '0.75rem',
  padding: '0.65rem',
  background: 'var(--sun)',
  border: 'none',
  borderRadius: 10,
  color: 'var(--card)',
  fontWeight: 700,
  fontSize: '0.8rem',
  cursor: 'pointer',
}

const dangerButtonStyle: React.CSSProperties = {
  padding: '0.5rem 0.9rem',
  background: 'var(--terracotta-wash)',
  border: '1px solid var(--terracotta-wash)',
  borderRadius: 8,
  color: 'var(--terracotta)',
  fontWeight: 600,
  fontSize: '0.78rem',
  cursor: 'pointer',
}

const textareaStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  background: 'var(--card)',
  border: '1px solid var(--line)',
  borderRadius: 8,
  padding: '0.6rem',
  color: 'var(--ink)',
  fontSize: '0.78rem',
  fontFamily: 'inherit',
  resize: 'vertical',
}

function categoryOptionStyle(selected: boolean): React.CSSProperties {
  return {
    display: 'flex',
    gap: '0.6rem',
    alignItems: 'flex-start',
    padding: '0.5rem 0.65rem',
    borderRadius: 8,
    border: `1px solid ${selected ? 'var(--sun-wash)' : 'var(--line)'}`,
    background: selected ? 'var(--sun-wash)' : 'transparent',
    cursor: 'pointer',
  }
}


/**
 * ReportDialog — blockieren und melden in einem Schritt.
 *
 * Design-Entscheidungen:
 * - Blockieren ist EINE Aktion, ohne Rechtfertigung. Wer blockiert, muss
 *   nicht sagen warum. Das ist der wichtigste Schutzfaktor den wir anbieten.
 * - Melden ist optional und wird als zweite Wahl angeboten.
 * - Kein "Bist du sicher?"-Modal beim Blockieren.
 */
import { useState } from 'react'
import { REPORT_CATEGORIES } from '../../lib/trust'
import { blockUser, reportUser } from '../../lib/community'

interface Props {
  open: boolean
  onClose: () => void
  myId: string
  targetId: string
  targetName: string
  alreadyBlocked?: boolean
  onDone?: (action: 'blocked' | 'reported') => void
}

export default function ReportDialog({
  open,
  onClose,
  myId,
  targetId,
  targetName,
  alreadyBlocked = false,
  onDone,
}: Props) {
  const [category, setCategory] = useState('')
  const [details, setDetails] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState<'blocked' | 'reported' | null>(null)

  if (!open) return null

  const close = () => {
    setCategory('')
    setDetails('')
    setError(null)
    setDone(null)
    onClose()
  }

  const doBlock = async () => {
    setBusy(true)
    setError(null)
    try {
      await blockUser(myId, targetId)
      setDone('blocked')
      onDone?.('blocked')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Blockieren fehlgeschlagen.')
    } finally {
      setBusy(false)
    }
  }

  const doReport = async () => {
    if (!category) {
      setError('Bitte wähle eine Kategorie aus.')
      return
    }
    setBusy(true)
    setError(null)
    try {
      await reportUser(myId, targetId, category, details.trim() || undefined)
      setDone('reported')
      onDone?.('reported')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Meldung fehlgeschlagen.')
    } finally {
      setBusy(false)
    }
  }

  if (done) {
    return (
      <div style={overlayStyle} onClick={close}>
        <div style={{ ...dialogStyle, maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
          <div style={{ textAlign: 'center', padding: '1.5rem 0.5rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>
              {done === 'blocked' ? '🚫' : '📨'}
            </div>
            <h3 style={{ margin: '0 0 0.5rem', color: 'var(--ink)', fontSize: '1.05rem' }}>
              {done === 'blocked' ? 'Blockiert' : 'Danke für die Meldung'}
            </h3>
            <p style={{ margin: 0, color: 'var(--ink-faint)', fontSize: '0.82rem', lineHeight: 1.6 }}>
              {done === 'blocked' ? (
                <>
                  {targetName} kann dich nicht mehr kontaktieren und sieht dein Profil nicht.
                  <br />
                  <span style={{ color: 'var(--ink-ghost)' }}>Du musst dafür nichts begründen.</span>
                </>
              ) : (
                <>
                  Unsere Moderation schaut sich das an. Du bekommst keine Auskunft über das
                  Ergebnis — das ist Absicht, damit niemand herausfindet, wer gemeldet hat.
                </>
              )}
            </p>
            <button onClick={close} style={primaryButtonStyle}>Fertig</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={overlayStyle} onClick={close}>
      <div style={{ ...dialogStyle, maxWidth: 460 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ margin: 0, color: 'var(--ink)', fontSize: '1.05rem' }}>Sicherheit</h3>
            <p style={{ margin: '0.25rem 0 0', color: 'var(--ink-faint)', fontSize: '0.75rem' }}>{targetName}</p>
          </div>
          <button onClick={close} style={closeButtonStyle} aria-label="Schließen">✕</button>
        </div>

        {error && <div style={errorStyle}>{error}</div>}

        <div style={blockCardStyle}>
          <p style={{ margin: '0 0 0.3rem', color: 'var(--ink)', fontSize: '0.85rem', fontWeight: 600 }}>
            🚫 Sofort blockieren
          </p>
          <p style={{ margin: '0 0 0.75rem', color: 'var(--ink-faint)', fontSize: '0.72rem', lineHeight: 1.5 }}>
            {alreadyBlocked
              ? `${targetName} ist bereits blockiert.`
              : 'Sofortige Wirkung, keine Begründung nötig. Die Person kann dich nicht mehr kontaktieren.'}
          </p>
          {!alreadyBlocked && (
            <button onClick={doBlock} disabled={busy} style={dangerButtonStyle}>
              {busy ? 'Wird ausgeführt…' : 'Blockieren'}
            </button>
          )}
        </div>

        <div>
          <p style={{ margin: '0 0 0.5rem', color: 'var(--ink)', fontSize: '0.85rem', fontWeight: 600 }}>
            📨 Der Plattform melden
          </p>
          <p style={{ margin: '0 0 0.75rem', color: 'var(--ink-faint)', fontSize: '0.72rem', lineHeight: 1.5 }}>
            Für Belästigung, Betrug oder unsichere Treffen. Deine Identität bleibt anonym.
          </p>

          <div style={{ display: 'grid', gap: '0.4rem', marginBottom: '0.75rem' }}>
            {REPORT_CATEGORIES.map((c) => (
              <label key={c.value} style={categoryOptionStyle(category === c.value)}>
                <input
                  type="radio"
                  name="report-category"
                  checked={category === c.value}
                  onChange={() => setCategory(c.value)}
                  style={{ marginTop: 2, accentColor: 'var(--sun)' }}
                />
                <span style={{ minWidth: 0 }}>
                  <span style={{ display: 'block', color: 'var(--ink)', fontSize: '0.78rem' }}>{c.label}</span>
                  <span style={{ display: 'block', color: 'var(--ink-ghost)', fontSize: '0.68rem' }}>{c.hint}</span>
                </span>
              </label>
            ))}
          </div>

          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Was ist passiert? (optional)"
            rows={3}
            style={textareaStyle}
          />

          <button onClick={doReport} disabled={busy} style={primaryButtonStyle}>
            {busy ? 'Wird gesendet…' : 'Meldung senden'}
          </button>
        </div>
      </div>
    </div>
  )
}

