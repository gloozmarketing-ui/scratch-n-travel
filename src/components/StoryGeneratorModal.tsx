import React, { useRef, useEffect, useState } from 'react'
import { track } from '../lib/analytics'

interface StoryGeneratorModalProps {
  isOpen: boolean
  onClose: () => void
  data: {
    title: string
    location: string
    gps: string
    xp: number
    image?: string
    badgeName?: string
    userName?: string
  }
}

export default function StoryGeneratorModal({ isOpen, onClose, data }: StoryGeneratorModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [generating, setGenerating] = useState(true)

  useEffect(() => {
    if (!isOpen) return
    setGenerating(true)

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Standard 9:16 Instagram Story Resolution
    canvas.width = 1080
    canvas.height = 1920

    // Hintergrund: Lagerfeuer-Nacht. Das exportierte Bild ist immer dunkel,
    // unabhängig vom Theme der App — es wird in Social Media geteilt.
    ctx.fillStyle = '#16120D'
    ctx.fillRect(0, 0, 1080, 1920)

    // Load background image or luxury gradient
    const bgImg = new Image()
    bgImg.crossOrigin = 'anonymous'
    bgImg.src = data.image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1080&h=1920&fit=crop'

    const drawCard = () => {
      // Draw image cover with dark gradient overlay
      if (bgImg.complete && bgImg.naturalWidth > 0) {
        ctx.drawImage(bgImg, 0, 0, 1080, 1920)
      }
      const grad = ctx.createLinearGradient(0, 0, 0, 1920)
      grad.addColorStop(0, 'rgba(12,9,6,0.85)')
      grad.addColorStop(0.3, 'rgba(12,9,6,0.4)')
      grad.addColorStop(0.7, 'rgba(12,9,6,0.7)')
      grad.addColorStop(1, 'rgba(12,9,6,0.98)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, 1080, 1920)

      // Gold Decorative Luxury Border
      ctx.strokeStyle = 'rgba(176,125,36,0.4)'
      ctx.lineWidth = 4
      ctx.strokeRect(60, 60, 960, 1800)

      ctx.strokeStyle = 'rgba(176,125,36,0.2)'
      ctx.lineWidth = 2
      ctx.strokeRect(76, 76, 928, 1768)

      // Compass Rose at Top
      ctx.fillStyle = '#B07D24'
      ctx.font = 'bold 38px Fraunces, Georgia, serif'
      ctx.textAlign = 'center'
      ctx.fillText('✦  SCRATCH \'N\' TRAVEL  ✦', 540, 160)

      ctx.font = '30px ui-monospace, monospace'
      ctx.fillStyle = 'rgba(176,125,36,0.7)'
      ctx.fillText('OFFICIAL EXPEDITION LOG', 540, 210)

      // Center Cartouche Badge Box
      ctx.fillStyle = 'rgba(36,30,23,0.9)'
      ctx.strokeStyle = '#B07D24'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.roundRect(140, 480, 800, 860, 36)
      ctx.fill()
      ctx.stroke()

      // Large Circular Gold Passport Stamp
      ctx.strokeStyle = 'rgba(176,125,36,0.8)'
      ctx.lineWidth = 6
      ctx.beginPath()
      ctx.arc(540, 720, 160, 0, Math.PI * 2)
      ctx.stroke()

      ctx.strokeStyle = 'rgba(176,125,36,0.4)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(540, 720, 140, 0, Math.PI * 2)
      ctx.stroke()

      ctx.font = 'bold 80px Fraunces, Georgia, serif'
      ctx.fillStyle = '#D19A3A'
      ctx.fillText('★ GPS ★', 540, 710)

      ctx.font = 'bold 36px ui-monospace, monospace'
      ctx.fillStyle = '#B07D24'
      ctx.fillText('VERIFIED SECRET', 540, 770)

      // Secret Name & Location
      ctx.font = 'bold 64px Fraunces, Georgia, serif'
      ctx.fillStyle = '#F2EADC'
      ctx.fillText(data.title.length > 22 ? data.title.slice(0, 20) + '…' : data.title, 540, 980)

      ctx.font = '40px ui-monospace, monospace'
      ctx.fillStyle = 'rgba(176,125,36,0.9)'
      ctx.fillText(data.location, 540, 1050)

      ctx.font = '36px ui-monospace, monospace'
      ctx.fillStyle = '#8FBF7C'
      ctx.fillText(`GPS: ${data.gps}`, 540, 1120)

      // XP Reward Badge
      ctx.fillStyle = 'rgba(176,125,36,0.2)'
      ctx.beginPath()
      ctx.roundRect(360, 1180, 360, 90, 45)
      ctx.fill()

      ctx.font = 'bold 44px ui-monospace, monospace'
      ctx.fillStyle = '#D19A3A'
      ctx.fillText(`+${data.xp} EXP EARNED`, 540, 1242)

      // Footer: Traveler Info & Social Tag
      ctx.font = '36px ui-monospace, monospace'
      ctx.fillStyle = '#9C9083'
      ctx.fillText(`Explorer: ${data.userName || 'Maria Santos'}`, 540, 1540)

      ctx.font = 'bold 42px Fraunces, Georgia, serif'
      ctx.fillStyle = '#B07D24'
      ctx.fillText('Tag @scratchntravel to get featured!', 540, 1620)

      ctx.font = '30px ui-monospace, monospace'
      ctx.fillStyle = 'rgba(176,125,36,0.6)'
      ctx.fillText('scratchntravel.com · Unlocking Earth\'s Secrets', 540, 1680)

      setGenerating(false)
    }

    bgImg.onload = drawCard
    bgImg.onerror = drawCard
  }, [isOpen, data])

  if (!isOpen) return null

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `scratchntravel-story-${data.title.toLowerCase().replace(/\s+/g, '-')}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const handleShare = async () => {
    const canvas = canvasRef.current
    if (!canvas) return
    try {
      canvas.toBlob(async blob => {
        if (!blob) return
        const file = new File([blob], 'scratchntravel-story.png', { type: 'image/png' })
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `Scratch'n'Travel: ${data.title}`,
            text: `Ich habe gerade "${data.title}" auf Scratch'n'Travel freigeschaltet! 🧭✨ #scratchntravel`,
            files: [file],
          })
          // Nur wenn der Teilen-Dialog wirklich durchlief — Abbruch zählt nicht.
          track('share_clicked')
        } else {
          handleDownload()
        }
      })
    } catch (err) {
      handleDownload()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="card w-full max-w-md p-6 max-h-[90vh] flex flex-col items-center overflow-y-auto">
        <div className="flex items-center justify-between w-full mb-4">
          <div>
            <h3 className="font-display text-ink text-lg font-bold">9:16 Social Story Card</h3>
            <p className="font-mono text-[0.62rem] text-sun">Ready for Instagram, TikTok & WhatsApp</p>
          </div>
          <button onClick={onClose} className="text-ink-faint hover:text-ink text-xl font-bold">
            ✕
          </button>
        </div>

        {/* Canvas preview */}
        <div className="w-full max-w-[260px] aspect-[9/16] rounded-xl overflow-hidden shadow-2xl border border-sun mb-5 bg-paper-deep relative">
          {generating && (
            <div className="absolute inset-0 flex items-center justify-center text-xs font-mono text-sun">
              Generating 9:16 story…
            </div>
          )}
          <canvas ref={canvasRef} className="w-full h-full object-contain" />
        </div>

        <div className="flex gap-3 w-full">
          <button onClick={handleShare} className="btn btn-primary flex-1 text-xs py-2.5">
            📲 Share to Story
          </button>
          <button onClick={handleDownload} className="btn btn-secondary flex-1 text-xs py-2.5">
            💾 Download PNG
          </button>
        </div>
      </div>
    </div>
  )
}
