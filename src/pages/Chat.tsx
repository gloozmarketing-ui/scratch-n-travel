/**
 * Chat — 1:1-Nachrichten.
 *
 * Sicherheits-Entscheidungen (bewusst so gebaut):
 * - Kein Gruppenchat. Der Haupthebel für Belästigung sind offene Räume.
 * - Der „Sicherheit"-Button ist IMMER sichtbar, nicht hinter einem Menü.
 * - Beim ersten Kontakt gibt es einen sanften Hinweis auf Kontext — nicht als
 *   Zwang, sondern als Vorschlag.
 * - Links in der ersten Nachricht werden markiert: Geld über unbekannte Kanäle
 *   ist der häufigste Betrugsvektor.
 */
import { useEffect, useState, useRef, useCallback } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  getConversations,
  getMessages,
  getOrCreateConversation,
  sendMessage,
  isDemoMode,
} from '../lib/community'
import type { Conversation } from '../lib/community'
import ReportDialog from '../components/safety/ReportDialog'
import TrustBadge from '../components/safety/TrustBadge'

export default function Chat() {
  const { user } = useAuth()
  const [params] = useSearchParams()
  const targetId = params.get('with')

  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [messages, setMessages] = useState<unknown[]>([])
  const [draft, setDraft] = useState('')
  const [nudge, setNudge] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showReport, setShowReport] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const isDemo = isDemoMode()

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }
    void (async () => {
      try {
        const convs = await getConversations(user.id)
        setConversations(convs)

        if (targetId) {
          const found = convs.find((c) => c.otherUser?.id === targetId)
          if (found) {
            setActiveId(found.id)
          } else {
            const newId = await getOrCreateConversation(user.id, targetId)
            if (newId) setActiveId(newId)
          }
        } else if (convs.length > 0) {
          setActiveId(convs[0].id)
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Unterhaltungen konnten nicht geladen werden.')
      } finally {
        setLoading(false)
      }
    })()
  }, [user, targetId])

  useEffect(() => {
    if (!activeId || !user) {
      setMessages([])
      return
    }
    void (async () => {
      try {
        const msgs = await getMessages(activeId)
        setMessages(msgs)
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Nachrichten konnten nicht geladen werden.')
      }
    })()
  }, [activeId, user])

  const handleSend = useCallback(async () => {
    if (!user || !activeId || !draft.trim()) return
    setSending(true)
    setError(null)
    try {
      const result = await sendMessage(activeId, user.id, draft)
      if (!result.ok) {
        setError('Nachricht konnte nicht gesendet werden.')
        return
      }
      setDraft('')
      setNudge(
        result.nudge === 'first_contact'
          ? 'Tipp: Sag kurz, worüber ihr euch gefunden habt — das macht Antworten viel wahrscheinlicher.'
          : result.nudge === 'link'
            ? 'Hinweis: Geldüberweisungen oder Zahlungen über fremde Links sind das häufigste Betrugsmuster. Sei vorsichtig.'
            : null,
      )
      const msgs = await getMessages(activeId)
      setMessages(msgs)
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Nachricht konnte nicht gesendet werden.')
    } finally {
      setSending(false)
    }
  }, [user, activeId, draft])

  const active = conversations.find((c) => c.id === activeId)

  if (!user) {
    return (
      <div style={centerStyle}>
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💬</div>
        <p style={{ color: 'var(--ink)', fontSize: '0.95rem', margin: '0 0 0.4rem' }}>
          Zum Schreiben anmelden
        </p>
        <p style={{ color: 'var(--ink-faint)', fontSize: '0.8rem', margin: '0 0 1rem', lineHeight: 1.6 }}>
          Nachrichten sind nur zwischen angemeldeten Personen moeglich.
        </p>
        <Link to="/login" style={ctaStyle}>Anmelden</Link>
      </div>
    )
  }


  return (
    <div style={{ maxWidth: 780, margin: '0 auto', padding: '1.5rem 1rem 4rem' }}>
      <header style={{ marginBottom: '1rem' }}>
        <p className="font-mono text-[0.6rem] tracking-[0.25em] uppercase" style={{ color: 'var(--sun)', margin: 0 }}>
          Community
        </p>
        <h1 style={{ fontSize: '1.4rem', color: 'var(--ink)', margin: '0.3rem 0 0' }}>Nachrichten</h1>
      </header>

      {isDemo && (
        <div style={demoNoteStyle}>
          <strong style={{ color: 'var(--sun)' }}>Demo-Modus.</strong> Ohne Supabase gibt es keine
          echten Nachrichten. Die Oberfläche zeigt, wie es später aussieht.
        </div>
      )}

      {error && <div style={errorStyle}>{error}</div>}

      <div style={layoutStyle}>
        <aside style={listStyle}>
          <p style={{ color: 'var(--ink-ghost)', fontSize: '0.62rem', letterSpacing: '0.12em', margin: '0 0 0.6rem' }}>
            UNTERHALTUNGEN
          </p>
          {conversations.length === 0 ? (
            <p style={{ color: 'var(--ink-ghost)', fontSize: '0.74rem', lineHeight: 1.6 }}>
              Noch keine Unterhaltungen. Geh zu{' '}
              <Link to="/people" style={{ color: 'var(--sun)' }}>Menschen</Link> und schreib jemandem an.
            </p>
          ) : (
            <div style={{ display: 'grid', gap: '0.35rem' }}>
              {conversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveId(c.id)}
                  style={{
                    ...convButtonStyle,
                    background: c.id === activeId ? 'var(--sun-wash)' : 'transparent',
                    borderColor: c.id === activeId ? 'var(--sun-wash)' : 'transparent',
                  }}
                >
                  <span style={{ color: 'var(--ink)', fontSize: '0.78rem', display: 'block' }}>
                    {c.otherUser?.full_name ?? 'Unbekannt'}
                  </span>
                  <span style={convPreviewStyle}>{c.lastMessage ?? 'Keine Nachrichten'}</span>
                </button>
              ))}
            </div>
          )}
        </aside>


        <section style={threadStyle}>
          {!active ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
              <p style={{ color: 'var(--ink-faint)', fontSize: '0.85rem' }}>
                {loading ? 'Lade Unterhaltungen…' : 'Wähle eine Unterhaltung aus.'}
              </p>
            </div>
          ) : (
            <>
              <div style={threadHeaderStyle}>
                <div style={{ minWidth: 0 }}>
                  <p style={{ margin: 0, color: 'var(--ink)', fontSize: '0.9rem' }}>
                    {active.otherUser?.full_name ?? 'Unbekannt'}
                  </p>
                  {active.otherUser && (
                    <span style={{ fontSize: '0.68rem' }}>
                      <TrustBadge tier={active.otherUser.trust_tier} compact />
                      {active.otherUser.city && (
                        <span style={{ color: 'var(--ink-ghost)', marginLeft: '0.4rem' }}>
                          {active.otherUser.city}
                        </span>
                      )}
                    </span>
                  )}
                </div>
                {active.otherUser && !active.otherUser.id.startsWith('demo-') && (
                  <button
                    onClick={() => setShowReport(true)}
                    style={safetyButtonStyle}
                    title="Blockieren oder melden"
                    aria-label="Sicherheit: blockieren oder melden"
                  >
                    🛡️
                  </button>
                )}
              </div>

              <div style={messagesStyle}>
                {messages.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                    <p style={{ color: 'var(--ink-faint)', fontSize: '0.8rem', lineHeight: 1.7, margin: 0 }}>
                      Sag Hallo und erwähne kurz, warum du schreibst.
                      <br />
                      <span style={{ color: 'var(--ink-ghost)', fontSize: '0.74rem' }}>
                        Ein konkreter Bezug macht Antworten viel wahrscheinlicher.
                      </span>
                    </p>
                  </div>
                ) : (
                  messages.map((m) => {
                    const msg = m as { id: string; body: string; sender_id: string; deleted_at: string | null }
                    const mine = msg.sender_id === user.id
                    return (
                      <div
                        key={msg.id}
                        style={{
                          alignSelf: mine ? 'flex-end' : 'flex-start',
                          background: mine ? 'var(--sun-wash)' : 'var(--line)',
                          border: `1px solid ${mine ? 'var(--sun-wash)' : 'var(--line)'}`,
                          borderRadius: 12,
                          padding: '0.55rem 0.75rem',
                          maxWidth: '80%',
                          color: 'var(--ink-soft)',
                          fontSize: '0.8rem',
                          lineHeight: 1.55,
                        }}
                      >
                        {msg.deleted_at ? (
                          <em style={{ color: 'var(--ink-ghost)' }}>Nachricht gelöscht</em>
                        ) : (
                          msg.body
                        )}
                      </div>
                    )
                  })
                )}
                <div ref={bottomRef} />
              </div>

              {nudge && (
                <div style={{ padding: '0.5rem 0.9rem', fontSize: '0.72rem', color: 'var(--ink-faint)', lineHeight: 1.55 }}>
                  💡 {nudge}
                </div>
              )}

              <div style={composerStyle}>
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      void handleSend()
                    }
                  }}
                  placeholder="Nachricht schreiben…"
                  disabled={sending}
                  style={inputStyle}
                />
                <button onClick={handleSend} disabled={sending || !draft.trim()} style={sendButtonStyle}>
                  {sending ? '…' : '➤'}
                </button>
              </div>
            </>
          )}
        </section>
      </div>

      {showReport && active?.otherUser && (
        <ReportDialog
          open={showReport}
          onClose={() => setShowReport(false)}
          myId={user.id}
          targetId={active.otherUser.id}
          targetName={active.otherUser.full_name ?? 'Diese Person'}
        />
      )}
    </div>
  )
}

// --- Styles ----------------------------------------------------------------

const layoutStyle: React.CSSProperties = {
  display: 'grid', gridTemplateColumns: 'minmax(150px, 230px) 1fr',
  gap: '1rem', alignItems: 'start',
}
const listStyle: React.CSSProperties = {
  background: 'var(--card)', border: '1px solid var(--line)',
  borderRadius: 12, padding: '0.85rem',
}
const convButtonStyle: React.CSSProperties = {
  width: '100%', textAlign: 'left', border: '1px solid transparent',
  borderRadius: 8, padding: '0.45rem 0.55rem', cursor: 'pointer',
}
const convPreviewStyle: React.CSSProperties = {
  color: 'var(--ink-ghost)', fontSize: '0.68rem', display: 'block',
  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
}
const threadStyle: React.CSSProperties = {
  background: 'var(--card)', border: '1px solid var(--line)',
  borderRadius: 12, display: 'flex', flexDirection: 'column',
  minHeight: 420, overflow: 'hidden',
}
const threadHeaderStyle: React.CSSProperties = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  gap: '0.75rem', padding: '0.75rem 0.9rem',
  borderBottom: '1px solid var(--line)', flexShrink: 0,
}
const messagesStyle: React.CSSProperties = {
  flex: 1, overflowY: 'auto', padding: '0.9rem', display: 'flex',
  flexDirection: 'column', gap: '0.5rem', minHeight: 260,
}
const composerStyle: React.CSSProperties = {
  display: 'flex', gap: '0.5rem', padding: '0.7rem 0.9rem',
  borderTop: '1px solid var(--line)', flexShrink: 0,
}
const inputStyle: React.CSSProperties = {
  flex: 1, background: 'var(--card)', border: '1px solid var(--line)',
  borderRadius: 9, padding: '0.55rem 0.75rem', color: 'var(--ink)',
  fontSize: '0.8rem', fontFamily: 'inherit',
}
const sendButtonStyle: React.CSSProperties = {
  width: 40, background: 'var(--sun)', border: 'none', borderRadius: 9,
  color: 'var(--card)', fontWeight: 700, cursor: 'pointer', flexShrink: 0,
}
const safetyButtonStyle: React.CSSProperties = {
  background: 'var(--leaf-wash)', border: '1px solid var(--leaf-wash)',
  borderRadius: 8, padding: '0.35rem 0.55rem', cursor: 'pointer',
  fontSize: '0.9rem', flexShrink: 0,
}
const centerStyle: React.CSSProperties = {
  maxWidth: 420, margin: '3rem auto', textAlign: 'center', padding: '1.5rem',
}
const ctaStyle: React.CSSProperties = {
  display: 'inline-block', padding: '0.5rem 1rem', background: 'var(--sun)',
  color: 'var(--card)', borderRadius: 8, fontSize: '0.78rem',
  fontWeight: 700, textDecoration: 'none',
}
const demoNoteStyle: React.CSSProperties = {
  background: 'var(--sun-wash)', border: '1px solid var(--sun-wash)',
  borderRadius: 10, padding: '0.7rem 0.9rem', marginBottom: '1rem',
  color: 'var(--ink-faint)', fontSize: '0.75rem', lineHeight: 1.6,
}
const errorStyle: React.CSSProperties = {
  background: 'var(--terracotta-wash)', border: '1px solid var(--terracotta-wash)',
  borderRadius: 8, padding: '0.7rem 0.9rem', color: 'var(--terracotta)',
  fontSize: '0.78rem', marginBottom: '1rem',
}
