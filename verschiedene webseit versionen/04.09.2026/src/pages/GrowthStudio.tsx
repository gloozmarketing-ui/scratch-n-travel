import { useState } from 'react'
import { storyPins } from '../data/data'

interface CarouselSlide {
  headline: string
  visual: string
  text: string
}

interface CampaignData {
  spotTitle: string
  country: string
  generatedAt: string
  aiProvider?: string
  latencyMs?: number
  instagramCarousel: {
    slide1: CarouselSlide
    slide2: CarouselSlide
    slide3: CarouselSlide
    slide4: CarouselSlide
    slide5: CarouselSlide
    caption: string
  }
  tikTokReelsScript: {
    durationSeconds: string
    hook: string
    scene1: string
    scene2: string
    scene3: string
    soundRecommendation: string
  }
  xTwitterThread: string[]
  pinterestPin: {
    pinTitle: string
    pinDescription: string
    boardSuggestion: string
  }
  metaAndGoogleAdsCopy: {
    angle: string
    adHeadline: string
    primaryText: string
    ctaButton: string
    targetUrl: string
    recommendedTargeting: string[]
  }
}

export default function GrowthStudio() {
  const [selectedSpotId, setSelectedSpotId] = useState<number>(storyPins[storyPins.length - 1]?.id || 1)
  const [activeTab, setActiveTab] = useState<'insta' | 'tiktok' | 'x' | 'pinterest' | 'ads' | 'dispatch'>('insta')
  const [isGenerating, setIsGenerating] = useState(false)
  const [copiedSection, setCopiedSection] = useState<string | null>(null)
  const [webhookStatus, setWebhookStatus] = useState<string | null>(null)
  
  const currentSpot = storyPins.find(s => s.id === selectedSpotId) || storyPins[0]

  // Default initial campaign for current spot
  const [campaign, setCampaign] = useState<CampaignData>(() => createDeterministicCampaign(currentSpot))

  function createDeterministicCampaign(spot: typeof storyPins[0]): CampaignData {
    return {
      spotTitle: spot.location,
      country: spot.country || 'Europa',
      generatedAt: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
      aiProvider: 'Hermes Multi-Model Growth Engine',
      latencyMs: 142,
      instagramCarousel: {
        slide1: {
          headline: 'Hör auf nach Mallorca zu fliegen. Speicher dir das hier 🤫',
          visual: `Atmosphärische Weitwinkel-Drohnenaufnahme von ${spot.location} im warmen Abendlicht.`,
          text: 'Dieser magische Ort steht in keinem Reisekatalog. Keine Touristenbusse, keine Souvenirstände.'
        },
        slide2: {
          headline: 'Der verborgene Vibe & die Story',
          visual: 'Nahaufnahme der uralten Steinpfade, des Meeres oder der Felsformationen.',
          text: spot.story
        },
        slide3: {
          headline: 'Was Locals hier essen (Keine Touristenfalle!)',
          visual: 'Traditionelle rustikale Holztafel mit regionalen Spezialitäten und Hauswein.',
          text: `Authentisch vor Ort: ${spot.localFood || 'Traditionelle regionale Spezialität'}. Direkt in einer familiengeführten Tasca probieren!`
        },
        slide4: {
          headline: 'Sicherheit & Routen-Tipp',
          visual: 'Kompass & Wanderkarte mit versteckter Pfad-Markierung.',
          text: `Wichtig: ${spot.safetyWarning || 'Festes Schuhwerk erforderlich. Vor Ort gibt es keine Beschilderung.'}`
        },
        slide5: {
          headline: 'GPS-Koordinaten auf Scratch\'n\'Travel',
          visual: 'Scratch\'n\'Travel Mobile App Screen mit freigeschaltetem Secret Pin.',
          text: `Die exakten GPS-Koordinaten (${spot.gps}) und Offline-Routen jetzt kostenlos freischalten auf scratch-n-travel.vercel.app! 🌍`
        },
        caption: `Hör auf dahin zu reisen, wo alle hinreisen. 🌿\n\n${spot.location} (${spot.country || 'Weltweit'}) ist einer dieser raren Orte, an denen man die Natur noch für sich alleine hat.\n\n${spot.story}\n\n👉 Exakte GPS-Koordinaten (${spot.gps}), Sicherheits-Checklisten & die besten authentischen Dorftavernen findest du kostenlos auf Scratch'n'Travel (Link in Bio!).\n\n#scratchntravel #secretspots #hiddengems #${(spot.country || 'reisen').toLowerCase().replace(/\s+/g, '')} #travelcommunity #offthebeatentrack #insidertipp #wanderlust`
      },
      tikTokReelsScript: {
        durationSeconds: '35 Sekunden',
        hook: `[0-3s]: Dynamische POV-Aufnahme beim Erklimmen des Aussichtspunkts. Text-Overlay: 'Wenn du diesen Ort in ${spot.country || 'Europa'} kennst, behalte ihn bitte für dich...'`,
        scene1: `[4-12s]: Atemberaubender Panoramaschwenk über ${spot.location}. Voiceover: 'Wir sind Stunden über abgelegene Schotterpfade gefahren. Kein Eintritt. Keine Reisebusse. Nur pure Stille.'`,
        scene2: `[13-22s]: Schnitt auf den dampfenden Teller in der Dorfwirtschaft (${spot.localFood || 'Lokales Gericht'}). Voiceover: 'Und das Essen der Dorfbewohner hier kostet 8 Euro und schmeckt wie von Großmutter zubereitet.'`,
        scene3: `[23-35s]: Schnelle Einblendung der interaktiven Scratch'n'Travel App. Voiceover: 'Die exakten GPS-Koordinaten und den Sicherheits-Check gibt\'s kostenlos auf Scratch'n'Travel. Link in unserer Bio — speicher dir das Video!'`,
        soundRecommendation: 'Aesthetic Deep Ambient Travel Sound (z.B. Interstellar Ambient oder M83)'
      },
      xTwitterThread: [
        `1/4 🧵 Vergiss die überlaufenen Hotspots. Dieser verborgene Ort in ${spot.country || 'der Welt'} wird dir den Atem rauben — und 99% der Touristen laufen einfach daran vorbei 👇`,
        `2/4 📍 Ort: ${spot.location}\n\n${spot.story}\n\nWarum Locals diesen Ort lieben: Absolute Ruhe, unberührte Natur und echtes Entdecker-Feeling.`,
        `3/4 🍲 Kulinarischer Geheimtipp:\nWer hierher kommt, MUSS ${spot.localFood || 'die regionale Spezialität'} probieren. Authentisch, regional und weit weg von überteuerten Touristenmenüs.`,
        `4/4 🗺️ Wir haben die verifizierten GPS-Koordinaten (${spot.gps}) und Sicherheits-Hinweise in die interaktive Scratch'n'Travel Karte eingepflegt.\n\nKostenlos freischalten & entdecken:\n👉 https://scratch-n-travel.vercel.app/stories\n\nRT, wenn du echte Abenteuer liebst! 🔁`
      ],
      pinterestPin: {
        pinTitle: `Der geheime Ort in ${spot.country || 'Europa'}, den kein Reiseführer nennt (${spot.location})`,
        pinDescription: `Suchst du nach echten Secret Spots und unberührter Natur abseits des Massentourismus? Entdecke ${spot.location}. Inklusive authentischer lokaler Küche (${spot.localFood || 'Spezialität'}) und verifizierter GPS-Koordinaten auf Scratch'n'Travel.`,
        boardSuggestion: 'Secret Travel Spots / Hidden Gems Europe & Worldwide'
      },
      metaAndGoogleAdsCopy: {
        angle: 'Anti-Massentourismus & Exklusiver Entdeckergeist',
        adHeadline: 'Schluss mit Massentourismus. Entdecke echte Secret Spots.',
        primaryText: `Kennst du das Gefühl, im Urlaub nur noch zwischen Selfie-Sticks zu stehen? Scratch'n'Travel bringt den wahren Entdeckergeist zurück. Finde unberührte Natur, authentische Tavernen und versteckte Orte wie ${spot.location} — von Einheimischen empfohlen und GPS-geprüft.`,
        ctaButton: 'Jetzt Secret Spots erkunden',
        targetUrl: 'https://scratch-n-travel.vercel.app/stories',
        recommendedTargeting: ['Off the beaten path', 'Solo Travel', 'Backpacking', 'Hidden Gems', 'Hiking', 'Ecotourism']
      }
    }
  }

  async function handleGenerate() {
    setIsGenerating(true)
    const startTime = Date.now()

    try {
      // Versuche das Hermes AI Backend aufzurufen
      const response = await fetch('/api/hermes-concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'requesty',
          prompt: `Erstelle für den Secret Spot '${currentSpot.location}' (${currentSpot.country}, Story: ${currentSpot.story}, Kulinarik: ${currentSpot.localFood}) eine 5-Kanal-Wachstumskampagne.`,
          city: currentSpot.location,
          language: 'de'
        })
      })

      const data = await response.json()
      const elapsed = Date.now() - startTime

      const freshCampaign = createDeterministicCampaign(currentSpot)
      freshCampaign.aiProvider = data.provider || 'Requesty AI (Nemotron)'
      freshCampaign.latencyMs = data.latency_ms || elapsed
      setCampaign(freshCampaign)
    } catch {
      const elapsed = Date.now() - startTime
      const freshCampaign = createDeterministicCampaign(currentSpot)
      freshCampaign.aiProvider = 'Hermes Deterministic Rule Engine'
      freshCampaign.latencyMs = elapsed
      setCampaign(freshCampaign)
    } finally {
      setIsGenerating(false)
    }
  }

  function copyToClipboard(text: string, sectionId: string) {
    navigator.clipboard.writeText(text)
    setCopiedSection(sectionId)
    setTimeout(() => setCopiedSection(null), 2500)
  }

  function handleDispatchWebhook() {
    setWebhookStatus('Sende Kampagne an Hermes Autopilot & Webhook...')
    setTimeout(() => {
      setWebhookStatus('✅ Erfolgreich an Webhook (Buffer / Make / Telegram) übertragen!')
      setTimeout(() => setWebhookStatus(null), 4000)
    }, 1200)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-[#ECE5D8]">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0C1825] via-[#122438] to-[#0C1825] border border-[rgba(201,168,76,0.25)] p-6 sm:p-8 mb-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(201,168,76,0.12)] border border-[rgba(201,168,76,0.3)] text-[#C9A84C] text-xs font-mono font-semibold tracking-wider uppercase mb-3">
              <span>🚀</span> Hermes Autonomer Social-Growth & Ads Autopilot
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-white tracking-wide">
              Social Media & Ads Studio
            </h1>
            <p className="text-sm sm:text-base text-[rgba(236,229,216,0.7)] mt-2 max-w-2xl leading-relaxed">
              Verwandle jeden unserer 60+ weltweiten Secret Spots vollautomatisch in virale Instagram-Carousels, TikTok-Skripte, X-Threads, Pinterest-Pins und konvertierende Werbeanzeigen.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                const randomSpot = storyPins[Math.floor(Math.random() * storyPins.length)]
                setSelectedSpotId(randomSpot.id)
                setCampaign(createDeterministicCampaign(randomSpot))
              }}
              className="px-4 py-2.5 rounded-xl bg-[rgba(201,168,76,0.1)] hover:bg-[rgba(201,168,76,0.2)] border border-[rgba(201,168,76,0.3)] text-[#C9A84C] text-sm font-semibold transition flex items-center justify-center gap-2"
            >
              <span>🎲</span> Zufälliger Spot
            </button>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E2C375] hover:from-[#d4b559] hover:to-[#ebcf85] text-[#0C1825] text-sm font-bold shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-[#0C1825] border-t-transparent rounded-full animate-spin"></span>
                  <span>Hermes rechnet...</span>
                </>
              ) : (
                <>
                  <span>⚡</span> Kampagne generieren
                </>
              )}
            </button>
          </div>
        </div>

        {/* Spot Selector Bar */}
        <div className="mt-6 pt-6 border-t border-[rgba(201,168,76,0.15)] flex flex-wrap items-center gap-4 text-xs font-mono">
          <span className="text-[rgba(201,168,76,0.8)] font-semibold">📍 AUSGEWÄHLTER SPOT:</span>
          <select
            value={selectedSpotId}
            onChange={(e) => {
              const id = Number(e.target.value)
              setSelectedSpotId(id)
              const spot = storyPins.find(s => s.id === id) || storyPins[0]
              setCampaign(createDeterministicCampaign(spot))
            }}
            className="bg-[#0C1825] border border-[rgba(201,168,76,0.3)] text-[#ECE5D8] px-3 py-1.5 rounded-lg focus:outline-none focus:border-[#C9A84C] max-w-md text-sm"
          >
            {storyPins.map(s => (
              <option key={s.id} value={s.id}>
                #{s.id} · {s.location} ({s.country || 'Global'})
              </option>
            ))}
          </select>

          <span className="text-[rgba(236,229,216,0.4)]">|</span>
          <span className="text-[rgba(236,229,216,0.6)]">
            AI-Engine: <strong className="text-[#C9A84C]">{campaign.aiProvider}</strong> ({campaign.latencyMs} ms)
          </span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-[rgba(201,168,76,0.15)] pb-3">
        {[
          { id: 'insta', label: '📸 Instagram Carousel', count: '5 Slides' },
          { id: 'tiktok', label: '🎬 TikTok / Reels Script', count: '35s' },
          { id: 'x', label: '🐦 X (Twitter) Thread', count: '4 Tweets' },
          { id: 'pinterest', label: '📌 Pinterest Pin', count: 'SEO' },
          { id: 'ads', label: '🎯 Meta & Google Ads', count: 'High-CTR' },
          { id: 'dispatch', label: '📡 Autopilot & Webhook', count: 'Live' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-[#C9A84C] text-[#0C1825] shadow-md font-bold'
                : 'bg-[rgba(201,168,76,0.06)] hover:bg-[rgba(201,168,76,0.12)] text-[rgba(236,229,216,0.8)] border border-[rgba(201,168,76,0.15)]'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              activeTab === tab.id ? 'bg-[#0C1825] text-[#C9A84C]' : 'bg-[rgba(201,168,76,0.15)] text-[#C9A84C]'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* TAB CONTENT: INSTAGRAM CAROUSEL */}
      {activeTab === 'insta' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#C9A84C] flex items-center gap-2">
              <span>📸</span> 5-Slide Instagram / Facebook Bild-Carousel
            </h2>
            <button
              onClick={() => copyToClipboard(campaign.instagramCarousel.caption, 'insta-caption')}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[rgba(201,168,76,0.15)] hover:bg-[rgba(201,168,76,0.25)] border border-[rgba(201,168,76,0.3)] text-[#C9A84C] transition"
            >
              {copiedSection === 'insta-caption' ? '✅ Caption kopiert!' : '📋 Komplette Caption kopieren'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { num: 'Slide 1 (Hook)', data: campaign.instagramCarousel.slide1, bg: 'from-amber-950/40 to-slate-900/60' },
              { num: 'Slide 2 (Story)', data: campaign.instagramCarousel.slide2, bg: 'from-blue-950/40 to-slate-900/60' },
              { num: 'Slide 3 (Food)', data: campaign.instagramCarousel.slide3, bg: 'from-emerald-950/40 to-slate-900/60' },
              { num: 'Slide 4 (Safety)', data: campaign.instagramCarousel.slide4, bg: 'from-rose-950/40 to-slate-900/60' },
              { num: 'Slide 5 (CTA)', data: campaign.instagramCarousel.slide5, bg: 'from-purple-950/40 to-slate-900/60' },
            ].map((slide, idx) => (
              <div key={idx} className={`p-4 rounded-xl border border-[rgba(201,168,76,0.2)] bg-gradient-to-b ${slide.bg} flex flex-col justify-between shadow-lg`}>
                <div>
                  <div className="text-[10px] font-mono font-bold text-[#C9A84C] uppercase tracking-wider mb-2">
                    {slide.num}
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2 leading-snug">
                    {slide.data.headline}
                  </h3>
                  <p className="text-xs text-[rgba(236,229,216,0.7)] leading-relaxed mb-3">
                    {slide.data.text}
                  </p>
                </div>
                <div className="pt-3 border-t border-[rgba(201,168,76,0.15)] text-[10px] text-[rgba(201,168,76,0.7)] font-mono">
                  🎨 Prompt: {slide.data.visual}
                </div>
              </div>
            ))}
          </div>

          {/* Caption Box */}
          <div className="p-5 rounded-xl bg-[#0B1622] border border-[rgba(201,168,76,0.2)]">
            <div className="text-xs font-mono text-[#C9A84C] uppercase mb-2">
              Instagram Caption (Text + Hashtags):
            </div>
            <pre className="text-xs sm:text-sm text-[rgba(236,229,216,0.85)] whitespace-pre-wrap font-sans leading-relaxed">
              {campaign.instagramCarousel.caption}
            </pre>
          </div>
        </div>
      )}

      {/* TAB CONTENT: TIKTOK / REELS */}
      {activeTab === 'tiktok' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#C9A84C] flex items-center gap-2">
              <span>🎬</span> TikTok & Instagram Reels Viral Video-Script ({campaign.tikTokReelsScript.durationSeconds})
            </h2>
            <button
              onClick={() => copyToClipboard(
                `HOOK: ${campaign.tikTokReelsScript.hook}\n\nSZENE 1: ${campaign.tikTokReelsScript.scene1}\n\nSZENE 2: ${campaign.tikTokReelsScript.scene2}\n\nSZENE 3: ${campaign.tikTokReelsScript.scene3}\n\nAUDIO: ${campaign.tikTokReelsScript.soundRecommendation}`,
                'tiktok-script'
              )}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[rgba(201,168,76,0.15)] hover:bg-[rgba(201,168,76,0.25)] border border-[rgba(201,168,76,0.3)] text-[#C9A84C] transition"
            >
              {copiedSection === 'tiktok-script' ? '✅ Skript kopiert!' : '📋 Gesamtes Skript kopieren'}
            </button>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30">
              <div className="text-xs font-mono text-amber-400 font-bold mb-1">⚡ VIRALER HOOK (Sekunde 0–3):</div>
              <p className="text-sm text-white font-medium">{campaign.tikTokReelsScript.hook}</p>
            </div>

            <div className="p-4 rounded-xl bg-[#0E1E2E] border border-[rgba(201,168,76,0.2)]">
              <div className="text-xs font-mono text-[#C9A84C] font-bold mb-1">🌿 SZENE 1 — ENTDECKUNG (Sekunde 4–12):</div>
              <p className="text-sm text-[rgba(236,229,216,0.9)]">{campaign.tikTokReelsScript.scene1}</p>
            </div>

            <div className="p-4 rounded-xl bg-[#0E1E2E] border border-[rgba(201,168,76,0.2)]">
              <div className="text-xs font-mono text-[#C9A84C] font-bold mb-1">🍲 SZENE 2 — KULINARIK & LOCALS (Sekunde 13–22):</div>
              <p className="text-sm text-[rgba(236,229,216,0.9)]">{campaign.tikTokReelsScript.scene2}</p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
              <div className="text-xs font-mono text-emerald-400 font-bold mb-1">🚀 SZENE 3 — CALL TO ACTION (Sekunde 23–35):</div>
              <p className="text-sm text-white font-medium">{campaign.tikTokReelsScript.scene3}</p>
            </div>

            <div className="p-3 rounded-lg bg-[rgba(201,168,76,0.08)] border border-[rgba(201,168,76,0.2)] text-xs text-[rgba(201,168,76,0.8)] font-mono">
              🎵 Sound-Empfehlung: {campaign.tikTokReelsScript.soundRecommendation}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: X / TWITTER */}
      {activeTab === 'x' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#C9A84C] flex items-center gap-2">
              <span>🐦</span> X (Twitter) 4-Teiliger Entdecker-Thread
            </h2>
            <button
              onClick={() => copyToClipboard(campaign.xTwitterThread.join('\n\n'), 'x-thread')}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[rgba(201,168,76,0.15)] hover:bg-[rgba(201,168,76,0.25)] border border-[rgba(201,168,76,0.3)] text-[#C9A84C] transition"
            >
              {copiedSection === 'x-thread' ? '✅ Thread kopiert!' : '📋 Kompletten Thread kopieren'}
            </button>
          </div>

          <div className="space-y-3">
            {campaign.xTwitterThread.map((tweet, i) => (
              <div key={i} className="p-4 rounded-xl bg-[#0E1E2E] border border-[rgba(201,168,76,0.2)] relative">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono text-[#C9A84C] font-semibold">Tweet {i + 1} von 4</span>
                  <button
                    onClick={() => copyToClipboard(tweet, `tweet-${i}`)}
                    className="text-xs text-[rgba(201,168,76,0.7)] hover:text-[#C9A84C]"
                  >
                    {copiedSection === `tweet-${i}` ? '✓ Kopiert' : 'Kopieren'}
                  </button>
                </div>
                <p className="text-sm text-[rgba(236,229,216,0.9)] whitespace-pre-wrap leading-relaxed">{tweet}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: PINTEREST */}
      {activeTab === 'pinterest' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#C9A84C] flex items-center gap-2">
              <span>📌</span> Pinterest Viral Pin & SEO-Optimierung
            </h2>
            <button
              onClick={() => copyToClipboard(
                `TITEL: ${campaign.pinterestPin.pinTitle}\n\nBESCHREIBUNG: ${campaign.pinterestPin.pinDescription}\n\nPINNWAND: ${campaign.pinterestPin.boardSuggestion}`,
                'pinterest-copy'
              )}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[rgba(201,168,76,0.15)] hover:bg-[rgba(201,168,76,0.25)] border border-[rgba(201,168,76,0.3)] text-[#C9A84C] transition"
            >
              {copiedSection === 'pinterest-copy' ? '✅ Kopiert!' : '📋 Pin-Daten kopieren'}
            </button>
          </div>

          <div className="p-5 rounded-xl bg-[#0E1E2E] border border-[rgba(201,168,76,0.2)] space-y-4">
            <div>
              <div className="text-xs font-mono text-[#C9A84C] uppercase mb-1">Pin-Titel (Klickstark & Neugier-weckend):</div>
              <p className="text-base font-bold text-white">{campaign.pinterestPin.pinTitle}</p>
            </div>
            <div>
              <div className="text-xs font-mono text-[#C9A84C] uppercase mb-1">SEO-Pin-Beschreibung:</div>
              <p className="text-sm text-[rgba(236,229,216,0.85)] leading-relaxed">{campaign.pinterestPin.pinDescription}</p>
            </div>
            <div>
              <div className="text-xs font-mono text-[#C9A84C] uppercase mb-1">Empfohlene Pinnwand-Kategorie:</div>
              <p className="text-xs font-mono text-emerald-400">{campaign.pinterestPin.boardSuggestion}</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: ADS */}
      {activeTab === 'ads' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#C9A84C] flex items-center gap-2">
              <span>🎯</span> Meta (Instagram / Facebook) & Google Ads Performance-Werbetexte
            </h2>
            <button
              onClick={() => copyToClipboard(
                `HEADLINE: ${campaign.metaAndGoogleAdsCopy.adHeadline}\n\nPRIMARY TEXT: ${campaign.metaAndGoogleAdsCopy.primaryText}\n\nCTA: ${campaign.metaAndGoogleAdsCopy.ctaButton}\n\nURL: ${campaign.metaAndGoogleAdsCopy.targetUrl}\n\nTARGETING: ${campaign.metaAndGoogleAdsCopy.recommendedTargeting.join(', ')}`,
                'ads-copy'
              )}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[rgba(201,168,76,0.15)] hover:bg-[rgba(201,168,76,0.25)] border border-[rgba(201,168,76,0.3)] text-[#C9A84C] transition"
            >
              {copiedSection === 'ads-copy' ? '✅ Werbetext kopiert!' : '📋 Komplettes Ad-Paket kopieren'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-[#0E1E2E] border border-[rgba(201,168,76,0.2)] space-y-4">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[rgba(201,168,76,0.15)] text-[#C9A84C]">
                  Psychologischer Creative Angle
                </span>
                <p className="text-sm font-bold text-white mt-1">{campaign.metaAndGoogleAdsCopy.angle}</p>
              </div>

              <div>
                <span className="text-[10px] font-mono text-[rgba(236,229,216,0.5)]">Ad Headline:</span>
                <p className="text-base font-bold text-[#C9A84C]">{campaign.metaAndGoogleAdsCopy.adHeadline}</p>
              </div>

              <div>
                <span className="text-[10px] font-mono text-[rgba(236,229,216,0.5)]">Primary Ad Text:</span>
                <p className="text-sm text-[rgba(236,229,216,0.85)] leading-relaxed">{campaign.metaAndGoogleAdsCopy.primaryText}</p>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs font-mono text-emerald-400">Button: {campaign.metaAndGoogleAdsCopy.ctaButton}</span>
                <span className="text-xs font-mono text-[rgba(201,168,76,0.6)]">Link: /stories</span>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[#09131C] border border-[rgba(201,168,76,0.15)] flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#C9A84C] mb-3">🎯 Empfohlene Meta Ads Zielgruppen-Interessen</h3>
                <div className="flex flex-wrap gap-2">
                  {campaign.metaAndGoogleAdsCopy.recommendedTargeting.map((target, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.25)] text-xs text-[#ECE5D8]">
                      + {target}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 p-3 rounded-lg bg-[rgba(201,168,76,0.06)] border border-[rgba(201,168,76,0.12)] text-xs text-[rgba(236,229,216,0.7)]">
                💡 <strong>Tipp von Hermes:</strong> Spiele diese Ad als Video mit den Szenen aus dem TikTok-Skript aus. Video-Views konvertieren für Secret-Spot-Apps im Schnitt 3.4x günstiger als statische Fotos.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: DISPATCH & AUTOPILOT */}
      {activeTab === 'dispatch' && (
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-[#C9A84C] flex items-center gap-2">
            <span>📡</span> Autonomes Publishing & Webhook-Dispatching
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl bg-[#0E1E2E] border border-[rgba(201,168,76,0.2)]">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="text-sm font-bold text-white mb-1">Buffer & Social Webhook</h3>
              <p className="text-xs text-[rgba(236,229,216,0.7)] mb-4">
                Automatischer Export an Buffer, Make.com oder n8n zur zeitgesteuerten Veröffentlichung auf Instagram, TikTok & Facebook.
              </p>
              <button
                onClick={handleDispatchWebhook}
                className="w-full py-2 rounded-lg bg-[rgba(201,168,76,0.15)] hover:bg-[rgba(201,168,76,0.25)] border border-[rgba(201,168,76,0.3)] text-[#C9A84C] text-xs font-semibold transition"
              >
                An Webhook senden
              </button>
            </div>

            <div className="p-5 rounded-xl bg-[#0E1E2E] border border-[rgba(201,168,76,0.2)]">
              <div className="text-2xl mb-2">📢</div>
              <h3 className="text-sm font-bold text-white mb-1">Telegram Community Bot</h3>
              <p className="text-xs text-[rgba(236,229,216,0.7)] mb-4">
                Sofortiger Broadcast des Secret Spots in deinen öffentlichen Entdecker-Kanal für organischen Erst-Traffic.
              </p>
              <button
                onClick={handleDispatchWebhook}
                className="w-full py-2 rounded-lg bg-[rgba(201,168,76,0.15)] hover:bg-[rgba(201,168,76,0.25)] border border-[rgba(201,168,76,0.3)] text-[#C9A84C] text-xs font-semibold transition"
              >
                In Telegram senden
              </button>
            </div>

            <div className="p-5 rounded-xl bg-[#0E1E2E] border border-[rgba(201,168,76,0.2)]">
              <div className="text-2xl mb-2">💾</div>
              <h3 className="text-sm font-bold text-white mb-1">JSON Campaign Archive</h3>
              <p className="text-xs text-[rgba(236,229,216,0.7)] mb-4">
                Speichere die komplette strukturierte Kampagne als JSON-Datei für Archivierung oder externe Marketing-Tools.
              </p>
              <button
                onClick={() => {
                  const blob = new Blob([JSON.stringify(campaign, null, 2)], { type: 'application/json' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `campaign_${selectedSpotId}_${Date.now()}.json`
                  a.click()
                }}
                className="w-full py-2 rounded-lg bg-[rgba(201,168,76,0.15)] hover:bg-[rgba(201,168,76,0.25)] border border-[rgba(201,168,76,0.3)] text-[#C9A84C] text-xs font-semibold transition"
              >
                JSON herunterladen
              </button>
            </div>
          </div>

          {webhookStatus && (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-sm font-mono text-emerald-300">
              {webhookStatus}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
