import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTravel } from '../context/TravelContext'
import { storyPins, tours, hobbyCategories } from '../data/data'
import { createGoogleCalendarUrl } from '../utils/calendarExport'

interface Message {
  id: string
  role: 'user' | 'ai'
  text: string
  time: string
  action?: {
    type: 'explore' | 'gpx' | 'calendar' | 'wanderbond'
    label: string
    payload?: any
  }
}

const quickPrompts = [
  { icon: '🧬', text: 'Meine WanderBond DNA Empfehlungen' },
  { icon: '🐕', text: 'Hundefreundliche Secret Spots (Stufe 1-2)' },
  { icon: '👶', text: 'Kinderwagen-taugliche Klippenpfade & Strände' },
  { icon: '🏄', text: 'Beste Surfspots & Gezeiten heute' },
  { icon: '🍷', text: 'Authentische Wein- & Fado-Routen' },
  { icon: '⛰️', text: 'Anspruchsvolle Bergtouren (Stufe 4-5)' },
]

function now() {
  return new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
}

export default function AIConcierge() {
  const { user, triggerHaptic } = useTravel()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      role: 'ai',
      text: `Olá, ${user.name}! 🌟 Ich bin dein persönlicher AI Travel Concierge. Ich kenne deine ${user.hobbies.length} WanderBond™ Hobbys (${user.hobbies.slice(0, 3).join(', ')}...), verifizierte Hunde- & Kinderwagen-Trails sowie alle 1–5 Schwierigkeitsstufen. Was möchtest du heute entdecken?`,
      time: now(),
      action: {
        type: 'wanderbond',
        label: '🧬 WanderBond™ DNA ansehen',
      },
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const generateAnswer = (query: string): { text: string; action?: Message['action'] } => {
    const q = query.toLowerCase()

    // 1. WanderBond DNA match
    if (q.includes('dna') || q.includes('hobby') || q.includes('empfehlung') || q.includes('wanderbond')) {
      const matchedPins = storyPins.filter(p => user.hobbies.some(h => p.story.toLowerCase().includes(h.toLowerCase()) || p.tag.toLowerCase().includes(h.toLowerCase())))
      return {
        text: `Basierend auf deiner DNA (${user.hobbies.join(', ')}):\n\nIch empfehle dir ${matchedPins.length > 0 ? matchedPins[0].location : 'die Magoito Klippen'} und ${tours[0].title}. Beide Routen passen zu deinem Entdecker-Profil (Level ${user.level} · ${user.rank})!`,
        action: { type: 'explore', label: '🗺️ Auf Karte anzeigen' },
      }
    }

    // 2. Dog Friendly
    if (q.includes('hund') || q.includes('dog') || q.includes('pet')) {
      const dogPins = storyPins.filter(p => p.dogFriendly)
      return {
        text: `🐕 Hier sind verifizierte hundefreundliche Spots:\n\n1. ${dogPins[0]?.location || 'Praia do Magoito'} (Schwierigkeit: Stufe ${dogPins[0]?.difficulty || 2}/5) — ${dogPins[0]?.dogDetails || 'Ganzjährig erlaubt, Süßwasser vorhanden'}.\n2. ${dogPins[1]?.location || 'Ponta da Piedade'} (Stufe ${dogPins[1]?.difficulty || 1}/5) — Leinenpflicht am Holzsteg, schattige Buchten.\n\nSoll ich dir die GPX-Route mit Trinkstellen herunterladen?`,
        action: { type: 'explore', label: '🐕 Hundefreundliche Spots filtern' },
      }
    }

    // 3. Stroller / Family
    if (q.includes('kinderwagen') || q.includes('baby') || q.includes('kind') || q.includes('familie') || q.includes('stroller')) {
      const strollerPins = storyPins.filter(p => p.strollerFriendly)
      return {
        text: `👶 Perfekte kinderwagen- und kleinkindtaugliche Routen (Stufe 1–2):\n\n1. ${strollerPins[0]?.location || 'Cascais Promenade'} — Breiter Asphalt, keine Stufen, Cafés mit Wickeltisch.\n2. ${strollerPins[1]?.location || 'Sintra Schlosspark Flachweg'} — Befestigte Wege, schattig.\n\nAlle diese Touren sind stufenfrei geprüft.`,
        action: { type: 'explore', label: '👶 Kinderwagen-Spots anzeigen' },
      }
    }

    // 4. Surf
    if (q.includes('surf') || q.includes('welle') || q.includes('ocean')) {
      return {
        text: `🏄 Live-Surf-Bedingungen: Wassertemperatur 18°C, Dünung 1.4m mit leichtem Offshore-Wind.\n\n• Praia de Coxos (Ericeira): Perfekt für Fortgeschrittene (08:00–11:00).\n• Praia Grande (Sintra): Konstanter Beachbreak, Stufe 3/5.\n• Praia de São Julião: Ideal für entspannte Sessions & Vanlife.`,
        action: { type: 'gpx', label: '📥 Surf-Spots GPX herunterladen' },
      }
    }

    // 5. Alpine / Extreme Difficulty
    if (q.includes('extrem') || q.includes('alpin') || q.includes('stufe 4') || q.includes('stufe 5') || q.includes('schwer')) {
      return {
        text: `🧗 Anspruchsvolle Touren (Stufe 4–5 / Trittsicherheit & Schwindelfreiheit erforderlich):\n\n1. Cabo da Roca Riff-Klippenabstieg (Stufe 4/5) — Steiles Geröll, Seilpassagen, unberührte Brandung.\n2. Fóia Gipfelgrat Serra de Monchique (Stufe 4/5) — 900m Anstieg, Windböen.\n\n⚠️ Nur mit festem Schuhwerk und ausreichend Wasser begehen!`,
        action: { type: 'explore', label: '🧗 Stufe 4-5 Touren anzeigen' },
      }
    }

    // Fallback
    return {
      text: `Ich habe 3 passende Vorschläge aus unseren ${storyPins.length} Secret Spots und ${tours.length} GPX-Touren gefunden. Aktuelle lokale Wetterlage: 22°C, sonnig. Beste Erkundungszeit: 08:30–12:00 Uhr.\n\nMöchtest du eine vollständige Route mit GPX-Download und Kalendereintrag erstellen?`,
      action: { type: 'explore', label: '🗺️ Explore Map öffnen' },
    }
  }

  const send = (text: string) => {
    if (!text.trim() || loading) return
    triggerHaptic(10)
    const userMsg: Message = { id: `u_${Date.now()}`, role: 'user', text, time: now() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    setTimeout(() => {
      triggerHaptic(15)
      const res = generateAnswer(text)
      const aiMsg: Message = {
        id: `a_${Date.now()}`,
        role: 'ai',
        text: res.text,
        time: now(),
        action: res.action,
      }
      setMessages(prev => [...prev, aiMsg])
      setLoading(false)
    }, 600)
  }

  return (
    <div>
      <div className="page-header">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="coord mb-1">DNA Aware · 1–5 Difficulty · Dog &amp; Stroller Intelligence</p>
            <h1 className="font-display text-3xl text-[#F4E4C1] font-bold">AI Travel Concierge</h1>
            <p className="font-script text-[rgba(201,168,76,0.5)] text-lg">dein persönlicher Reisebegleiter</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[0.68rem] text-emerald-400 font-bold">ONLINE &amp; SYNCED</span>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-4xl mx-auto space-y-6 pb-28 md:pb-8">
        {/* Quick Prompts */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {quickPrompts.map(p => (
            <button
              key={p.text}
              onClick={() => send(p.text)}
              className="btn btn-ghost text-xs py-2 px-3 whitespace-nowrap flex items-center gap-1.5 flex-shrink-0 bg-[#152539]/60 hover:bg-[#152539]"
            >
              <span>{p.icon}</span>
              <span>{p.text}</span>
            </button>
          ))}
        </div>

        {/* Chat window */}
        <div className="card p-4 sm:p-6 min-h-[440px] flex flex-col justify-between border border-[rgba(201,168,76,0.2)]">
          <div className="space-y-4 mb-4 flex-1 overflow-y-auto max-h-[500px] pr-2">
            {messages.map(m => (
              <div
                key={m.id}
                className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'ai' && (
                  <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center font-display font-bold text-[#0C1825] text-xs flex-shrink-0">
                    🤖
                  </div>
                )}
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-gradient-to-r from-[#C9A84C] to-[#8A7040] text-[#0C1825] font-semibold'
                      : 'bg-[#0C1825] border border-[rgba(201,168,76,0.2)] text-[#F4E4C1]'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[rgba(201,168,76,0.15)] text-[0.62rem] opacity-75">
                    <span>{m.role === 'ai' ? 'Hermes AI' : user.name}</span>
                    <span>{m.time}</span>
                  </div>

                  {m.action && (
                    <div className="mt-3 pt-2">
                      <Link
                        to={m.action.type === 'wanderbond' ? '/wanderbond' : '/explore'}
                        className="btn btn-secondary text-xs py-1.5 px-3 inline-flex items-center gap-1.5 font-bold"
                      >
                        {m.action.label} →
                      </Link>
                    </div>
                  )}
                </div>
                {m.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-[#1e344f] border border-[rgba(201,168,76,0.4)] flex items-center justify-center font-display font-bold text-[#C9A84C] text-xs flex-shrink-0">
                    {user.initials}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 items-center text-xs font-mono text-[#C9A84C]">
                <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center font-display font-bold text-[#0C1825] text-xs">
                  🤖
                </div>
                <div className="bg-[#0C1825] border border-[rgba(201,168,76,0.2)] rounded-2xl p-3 flex items-center gap-2">
                  <span className="animate-spin text-sm">🧭</span>
                  <span>Hermes AI analysiert Wetter, Gezeiten &amp; Secret Spots...</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input field */}
          <div className="pt-3 border-t border-[rgba(201,168,76,0.15)] flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') send(input)
              }}
              placeholder="Frag nach Hundestränden, Stufe 1-5 Trails, Surf-Bedingungen..."
              className="field flex-1"
            />
            <button
              onClick={() => send(input)}
              disabled={!input.trim() || loading}
              className="btn btn-primary px-5 font-bold flex items-center gap-1"
            >
              <span>Senden</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
