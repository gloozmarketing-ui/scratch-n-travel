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
  getPlaceChannels,
  getChatPosts,
  sendChatPost,
  registerPlaceChannel,
} from '../lib/community'
import type { Conversation, PlaceChannel, ChatPost } from '../lib/community'
import ReportDialog from '../components/safety/ReportDialog'
import TrustBadge from '../components/safety/TrustBadge'

export default function Chat() {
  const { user, profile, trustTier } = useAuth()
  const [params] = useSearchParams()
  const targetId = params.get('with')
  const placeParam = params.get('place')

  const [activeTab, setActiveTab] = useState<'direct' | 'place'>(
    placeParam ? 'place' : 'direct'
  )

  // --- 1:1 Zustand ---
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [messages, setMessages] = useState<unknown[]>([])
  const [draft, setDraft] = useState('')
  const [nudge, setNudge] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // --- Orts-Chat Zustand (SNT-346) ---
  const [channels, setChannels] = useState<PlaceChannel[]>([])
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null)
  const [channelPosts, setChannelPosts] = useState<ChatPost[]>([])
  const [channelDraft, setChannelDraft] = useState('')
  const [channelSending, setChannelSending] = useState(false)
  const [channelLoading, setChannelLoading] = useState(false)

  // Report-Dialog
  const [reportTarget, setReportTarget] = useState<{ id: string; name: string } | null>(null)

  const bottomRef = useRef<HTMLDivElement>(null)
  const channelBottomRef = useRef<HTMLDivElement>(null)

  const isDemo = isDemoMode()

  // 1:1 Konversationen laden
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

  // 1:1 Nachrichten laden
  useEffect(() => {
    if (!activeId || !user || activeTab !== 'direct') {
      if (activeTab === 'direct') setMessages([])
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
  }, [activeId, user, activeTab])

  // Orts-Kanäle laden (SNT-346)
  useEffect(() => {
    if (!user || activeTab !== 'place') return
    void (async () => {
      setChannelLoading(true)
      try {
        if (placeParam) {
          const reg = await registerPlaceChannel(placeParam)
          if (reg?.channel_id) {
            setActiveChannelId(reg.channel_id)
          }
        }
        const chs = await getPlaceChannels(profile?.city ?? undefined)
        setChannels(chs)
        if (!activeChannelId && chs.length > 0) {
          setActiveChannelId(chs[0].id)
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Orts-Kanäle konnten nicht geladen werden.')
      } finally {
        setChannelLoading(false)
      }
    })()
  }, [user, activeTab, placeParam])

  // Orts-Chat-Beiträge laden
  useEffect(() => {
    if (!activeChannelId || activeTab !== 'place') return
    void (async () => {
      try {
        const posts = await getChatPosts(activeChannelId)
        setChannelPosts(posts)
        setTimeout(() => channelBottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Beiträge konnten nicht geladen werden.')
      }
    })()
  }, [activeChannelId, activeTab])

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

  const handleChannelSend = useCallback(async () => {
    if (!user || !activeChannelId || !channelDraft.trim()) return
    setChannelSending(true)
    setError(null)
    try {
      const res = await sendChatPost(
        activeChannelId,
        user.id,
        channelDraft,
        trustTier ?? profile?.trust_tier ?? 'member',
      )
      if (!res.ok) {
        setError(res.error ?? 'Beitrag konnte nicht gesendet werden.')
        return
      }
      setChannelDraft('')
      const posts = await getChatPosts(activeChannelId)
      setChannelPosts(posts)
      setTimeout(() => channelBottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Beitrag konnte nicht gesendet werden.')
    } finally {
      setChannelSending(false)
    }
  }, [user, activeChannelId, channelDraft])

  const activeConv = conversations.find((c) => c.id === activeId)
  const activeChannel = channels.find((c) => c.id === activeChannelId)

  if (!user) {
    return (
      <div style={centerStyle}>
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💬</div>
        <p style={{ color: 'var(--ink)', fontSize: '0.95rem', margin: '0 0 0.4rem' }}>
          Zum Schreiben anmelden
        </p>
        <p style={{ color: 'var(--ink-faint)', fontSize: '0.8rem', margin: '0 0 1rem', lineHeight: 1.6 }}>
          Nachrichten und Orts-Chats sind nur für angemeldete Personen zugänglich.
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
        <h1 style={{ fontSize: '1.4rem', color: 'var(--ink)', margin: '0.3rem 0 0' }}>Austausch & Chat</h1>
      </header>

      {/* Tab-Umschalter: 1:1 vs. Orts-Chat (SNT-346) */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <button
          onClick={() => setActiveTab('direct')}
          style={{
            padding: '0.45rem 0.9rem',
            borderRadius: 8,
            border: `1px solid ${activeTab === 'direct' ? 'var(--sun)' : 'var(--line)'}`,
            background: activeTab === 'direct' ? 'var(--sun-wash)' : 'var(--card)',
            color: activeTab === 'direct' ? 'var(--ink)' : 'var(--ink-faint)',
            fontWeight: activeTab === 'direct' ? 700 : 500,
            fontSize: '0.8rem',
            cursor: 'pointer',
          }}
        >
          💬 Direkt-Nachrichten (1:1)
        </button>
        <button
          onClick={() => setActiveTab('place')}
          style={{
            padding: '0.45rem 0.9rem',
            borderRadius: 8,
            border: `1px solid ${activeTab === 'place' ? 'var(--sun)' : 'var(--line)'}`,
            background: activeTab === 'place' ? 'var(--sun-wash)' : 'var(--card)',
            color: activeTab === 'place' ? 'var(--ink)' : 'var(--ink-faint)',
            fontWeight: activeTab === 'place' ? 700 : 500,
            fontSize: '0.8rem',
            cursor: 'pointer',
          }}
        >
          📍 Orts-Chat (5 km Radius)
        </button>
      </div>

      {isDemo && (
        <div style={demoNoteStyle}>
          <strong style={{ color: 'var(--sun)' }}>Demo-Modus.</strong> Ohne Supabase gibt es keine
          echten Nachrichten. Die Oberfläche zeigt, wie es später aussieht.
        </div>
      )}

      {error && <div style={errorStyle}>{error}</div>}

      {/* --- MODUS 1: Direkt-Nachrichten (1:1) --- */}
      {activeTab === 'direct' && (
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
            {!activeConv ? (
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
                      {activeConv.otherUser?.full_name ?? 'Unbekannt'}
                    </p>
                    {activeConv.otherUser && (
                      <span style={{ fontSize: '0.68rem' }}>
                        <TrustBadge tier={activeConv.otherUser.trust_tier} compact />
                        {activeConv.otherUser.city && (
                          <span style={{ color: 'var(--ink-ghost)', marginLeft: '0.4rem' }}>
                            {activeConv.otherUser.city}
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                  {activeConv.otherUser && !activeConv.otherUser.id.startsWith('demo-') && (
                    <button
                      onClick={() => setReportTarget({ id: activeConv.otherUser!.id, name: activeConv.otherUser!.full_name ?? 'Diese Person' })}
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
      )}

      {/* --- MODUS 2: Orts-Chat (SNT-346, ADR-002) --- */}
      {activeTab === 'place' && (
        <div style={layoutStyle}>
          <aside style={listStyle}>
            <p style={{ color: 'var(--ink-ghost)', fontSize: '0.62rem', letterSpacing: '0.12em', margin: '0 0 0.6rem' }}>
              ORTE IM UMKREIS (5 KM)
            </p>
            {channels.length === 0 ? (
              <p style={{ color: 'var(--ink-ghost)', fontSize: '0.74rem', lineHeight: 1.6 }}>
                Keine aktiven Orts-Kanäle in deiner Nähe. Öffne einen Spot in{' '}
                <Link to="/explore" style={{ color: 'var(--sun)' }}>Entdecken</Link>, um einen Kanal zu starten.
              </p>
            ) : (
              <div style={{ display: 'grid', gap: '0.35rem' }}>
                {channels.map((ch) => (
                  <button
                    key={ch.id}
                    onClick={() => setActiveChannelId(ch.id)}
                    style={{
                      ...convButtonStyle,
                      background: ch.id === activeChannelId ? 'var(--sun-wash)' : 'transparent',
                      borderColor: ch.id === activeChannelId ? 'var(--sun-wash)' : 'transparent',
                    }}
                  >
                    <span style={{ color: 'var(--ink)', fontSize: '0.78rem', display: 'block', fontWeight: 600 }}>
                      📍 {ch.spot?.title ?? ch.city}
                    </span>
                    <span style={convPreviewStyle}>
                      Aktiv bis {new Date(ch.valid_until).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} Uhr
                    </span>
                  </button>
                ))}
              </div>
            )}
          </aside>

          <section style={threadStyle}>
            {/* Consent- & Privacy-Banner (ADR-002) */}
            <div style={{ background: 'var(--leaf-wash)', padding: '0.6rem 0.9rem', fontSize: '0.72rem', color: 'var(--ink-soft)', borderBottom: '1px solid var(--line)', lineHeight: 1.5 }}>
              🛡️ <strong>Schutz & Privatsphäre:</strong> Dieser Kanal gehört dem Ort, nicht einzelnen Personen. Keine Entfernungsanzeige, kein Live-GPS-Tracking. Beiträge sind öffentlich lesbar; Schreiben erfordert Trust-Stufe <em>member</em>.
            </div>

            {!activeChannel ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                <p style={{ color: 'var(--ink-faint)', fontSize: '0.85rem' }}>
                  {channelLoading ? 'Lade Orts-Kanäle…' : 'Wähle einen Ort aus oder öffne einen Spot über Entdecken.'}
                </p>
              </div>
            ) : (
              <>
                <div style={threadHeaderStyle}>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ margin: 0, color: 'var(--ink)', fontSize: '0.9rem', fontWeight: 600 }}>
                      📍 {activeChannel.spot?.title ?? activeChannel.city}
                    </p>
                    <span style={{ fontSize: '0.68rem', color: 'var(--ink-ghost)' }}>
                      Schutzradius: 5 km · Stadt: {activeChannel.city}
                    </span>
                  </div>
                </div>

                <div style={messagesStyle}>
                  {channelPosts.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                      <p style={{ color: 'var(--ink-faint)', fontSize: '0.8rem', lineHeight: 1.7, margin: 0 }}>
                        Noch keine Beiträge an diesem Spot.
                        <br />
                        <span style={{ color: 'var(--ink-ghost)', fontSize: '0.74rem' }}>
                          Teile einen aktuellen Tipp (Wetter, Sonnenuntergang, Andrang) mit der Community.
                        </span>
                      </p>
                    </div>
                  ) : (
                    channelPosts.map((post) => {
                      const mine = post.author_id === user.id
                      return (
                        <div
                          key={post.id}
                          style={{
                            alignSelf: mine ? 'flex-end' : 'flex-start',
                            background: mine ? 'var(--sun-wash)' : 'var(--line)',
                            border: `1px solid ${mine ? 'var(--sun-wash)' : 'var(--line)'}`,
                            borderRadius: 12,
                            padding: '0.55rem 0.75rem',
                            maxWidth: '85%',
                            color: 'var(--ink-soft)',
                            fontSize: '0.8rem',
                            lineHeight: 1.55,
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                            <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--ink)' }}>
                              {post.author?.full_name ?? post.author?.handle ?? 'Local / Reisender'}
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                              <TrustBadge tier={post.author?.trust_tier ?? post.trust_tier} compact />
                              {!mine && (
                                <button
                                  onClick={() => setReportTarget({ id: post.author_id, name: post.author?.full_name ?? 'Beitrag' })}
                                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '0.75rem' }}
                                  title="Beitrag melden"
                                >
                                  🛡️
                                </button>
                              )}
                            </div>
                          </div>
                          <div>{post.body}</div>
                          <span style={{ fontSize: '0.62rem', color: 'var(--ink-ghost)', display: 'block', textAlign: 'right', marginTop: '0.2rem' }}>
                            {new Date(post.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      )
                    })
                  )}
                  <div ref={channelBottomRef} />
                </div>

                <div style={composerStyle}>
                  <input
                    value={channelDraft}
                    onChange={(e) => setChannelDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        void handleChannelSend()
                      }
                    }}
                    placeholder="Tipp oder Hinweis für diesen Ort hinterlassen…"
                    disabled={channelSending}
                    style={inputStyle}
                  />
                  <button onClick={handleChannelSend} disabled={channelSending || !channelDraft.trim()} style={sendButtonStyle}>
                    {channelSending ? '…' : '➤'}
                  </button>
                </div>
              </>
            )}
          </section>
        </div>
      )}

      {/* Globaler Sicherheits- & ReportDialog */}
      {reportTarget && (
        <ReportDialog
          open={Boolean(reportTarget)}
          onClose={() => setReportTarget(null)}
          myId={user.id}
          targetId={reportTarget.id}
          targetName={reportTarget.name}
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
