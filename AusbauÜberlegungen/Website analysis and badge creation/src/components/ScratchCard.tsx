import React, { useRef, useEffect, useState, useCallback } from 'react'
import confetti from 'canvas-confetti'
import { useTravel } from '../context/TravelContext'

interface ScratchCardProps {
  children: React.ReactNode
  width?: number
  height?: number
  onComplete?: () => void
  cardId?: number
  xpReward?: number
  locationName?: string
  gps?: string
  category?: string
}

export default function ScratchCard({
  children,
  width = 320,
  height = 200,
  onComplete,
  cardId,
  xpReward = 100,
  locationName = 'Secret Spot',
  gps = "38°47'29\"N · 9°28'32\"W",
  category = 'Nature',
}: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isDrawing = useRef(false)
  const [done, setDone] = useState(false)
  const [revealPct, setRevealPct] = useState(0)
  const completedRef = useRef(false)
  const { scratchSecret, triggerHaptic } = useTravel()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    ctx.scale(dpr, dpr)

    // Gold foil gradient
    const grad = ctx.createLinearGradient(0, 0, width, height)
    grad.addColorStop(0, '#8A6820')
    grad.addColorStop(0.25, '#C9A84C')
    grad.addColorStop(0.5, '#E8C460')
    grad.addColorStop(0.75, '#C9A84C')
    grad.addColorStop(1, '#A07830')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, width, height)

    // Map grid pattern
    ctx.strokeStyle = 'rgba(0,0,0,0.1)'
    ctx.lineWidth = 0.5
    for (let x = 0; x < width; x += 20) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }
    for (let y = 0; y < height; y += 20) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    // Compass rose hint
    const cx = width / 2
    const cy = height / 2 - 14
    ctx.fillStyle = 'rgba(0,0,0,0.22)'
    ctx.beginPath()
    ctx.moveTo(cx, cy - 18)
    ctx.lineTo(cx - 5, cy)
    ctx.lineTo(cx + 5, cy)
    ctx.closePath()
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(cx, cy + 18)
    ctx.lineTo(cx - 5, cy)
    ctx.lineTo(cx + 5, cy)
    ctx.closePath()
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(cx + 18, cy)
    ctx.lineTo(cx, cy - 5)
    ctx.lineTo(cx, cy + 5)
    ctx.closePath()
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(cx - 18, cy)
    ctx.lineTo(cx, cy - 5)
    ctx.lineTo(cx, cy + 5)
    ctx.closePath()
    ctx.fill()
    ctx.beginPath()
    ctx.arc(cx, cy, 5, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = 'rgba(0,0,0,0.35)'
    ctx.font = "bold 13px 'Cinzel', serif"
    ctx.textAlign = 'center'
    ctx.fillText('✦  SCRATCH TO REVEAL  ✦', width / 2, height / 2 + 16)
    ctx.font = "11px 'DM Mono', monospace"
    ctx.fillStyle = 'rgba(0,0,0,0.25)'
    ctx.fillText('mit Finger oder Maus rubbeln', width / 2, height / 2 + 34)
  }, [width, height])

  const calcRevealed = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return 0
    const ctx = canvas.getContext('2d')
    if (!ctx) return 0
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
    let transparent = 0
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] < 128) transparent++
    }
    return (transparent / (data.length / 4)) * 100
  }, [])

  const scratch = useCallback(
    (x: number, y: number) => {
      if (done) return
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      ctx.globalCompositeOperation = 'destination-out'
      ctx.beginPath()
      ctx.arc(x, y, 32, 0, Math.PI * 2)
      ctx.fill()

      const pct = calcRevealed()
      setRevealPct(Math.round(pct))

      if (pct > 55 && !completedRef.current) {
        completedRef.current = true
        setDone(true)

        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#C9A84C', '#E8C460', '#F4E4C1', '#2C1810'],
          })
        } catch (e) {}

        if (cardId) {
          scratchSecret(cardId, xpReward, locationName, gps, category)
        }
        onComplete?.()
      }
    },
    [done, calcRevealed, onComplete, cardId, xpReward, locationName, gps, category, scratchSecret]
  )

  const getPos = (canvas: HTMLCanvasElement, cx: number, cy: number) => {
    const rect = canvas.getBoundingClientRect()
    return { x: cx - rect.left, y: cy - rect.top }
  }

  return (
    <div className="relative select-none max-w-full" style={{ width, height }}>
      {/* Reveal content underneath */}
      <div className="absolute inset-0 rounded-xl overflow-hidden bg-[#152539] border border-[rgba(201,168,76,0.25)] flex items-center justify-center">
        {children}
      </div>

      {/* Canvas overlay */}
      {!done && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 rounded-xl cursor-crosshair touch-none"
          style={{ touchAction: 'none' }}
          onMouseDown={e => {
            isDrawing.current = true
            const p = getPos(e.currentTarget, e.clientX, e.clientY)
            scratch(p.x, p.y)
            triggerHaptic(10)
          }}
          onMouseMove={e => {
            if (!isDrawing.current) return
            const p = getPos(e.currentTarget, e.clientX, e.clientY)
            scratch(p.x, p.y)
          }}
          onMouseUp={() => {
            isDrawing.current = false
          }}
          onMouseLeave={() => {
            isDrawing.current = false
          }}
          onTouchStart={e => {
            isDrawing.current = true
            const p = getPos(e.currentTarget, e.touches[0].clientX, e.touches[0].clientY)
            scratch(p.x, p.y)
            triggerHaptic(15)
          }}
          onTouchMove={e => {
            e.preventDefault()
            const p = getPos(e.currentTarget, e.touches[0].clientX, e.touches[0].clientY)
            scratch(p.x, p.y)
          }}
          onTouchEnd={() => {
            isDrawing.current = false
          }}
        />
      )}

      {!done && revealPct > 5 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-[rgba(12,24,37,0.85)] rounded-full px-3 py-0.5 font-mono text-[0.6rem] text-[#C9A84C] pointer-events-none">
          {revealPct}% freigerubbelt
        </div>
      )}
      {done && (
        <div className="absolute top-2 right-2 bg-emerald-500/90 text-white font-mono text-[0.6rem] font-bold px-2.5 py-1 rounded-full pointer-events-none shadow-md">
          +{xpReward} XP ✓
        </div>
      )}
    </div>
  )
}
