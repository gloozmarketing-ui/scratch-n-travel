import React, { useEffect, useRef, useState } from 'react'
import type * as LeafletNamespace from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface PinData {
  id: number
  title: string
  location: string
  lat: number
  lng: number
  category: string
  rating: number
  xp: number
  isUnlocked: boolean
  onUnlock?: () => void
}

interface TravelMapProps {
  pins: PinData[]
  height?: string
}

/**
 * Karte mit lazy geladenem Leaflet.
 *
 * Vorher stand `import L from 'leaflet'` am Modul-Anfang. Damit landete Leaflet
 * (~148 KB) im Haupt-Chunk und wurde bei jedem Seitenaufruf geladen — auch auf
 * Seiten ohne Karte. Jetzt wird die Bibliothek erst bei der ersten echten
 * Karten-Nutzung nachgeladen; bis dahin steht ein Platzhalter an derselben
 * Stelle, damit das Layout nicht springt.
 */
export default function TravelMap({ pins, height = '420px' }: TravelMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<LeafletNamespace.Map | null>(null)
  const LRef = useRef<typeof LeafletNamespace | null>(null)
  const pinsRef = useRef(pins)
  pinsRef.current = pins
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!mapContainerRef.current) return
    if (mapInstanceRef.current) return

    let cancelled = false

    void import('leaflet').then((mod) => {
      if (cancelled || !mapContainerRef.current) return
      const L = (mod.default ?? mod) as unknown as typeof LeafletNamespace
      LRef.current = L

      const map = L.map(mapContainerRef.current, {
        center: [38.75, -9.2],
        zoom: 9,
        minZoom: 3,
        maxZoom: 16,
        maxBounds: [[-85, -180], [85, 180]],
        maxBoundsViscosity: 1.0,
        zoomControl: false,
      })

      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; DeLorme, NAVTEQ',
        minZoom: 3,
        maxZoom: 16,
        noWrap: true,
        bounds: [[-85, -180], [85, 180]],
      }).addTo(map)

      L.control.zoom({ position: 'bottomright' }).addTo(map)

      mapInstanceRef.current = map
      setLoading(false)
      // Pins koennen zwischenzeitlich gesetzt worden sein.
      renderPins(pinsRef.current)
    })

    return () => {
      cancelled = true
      const map = mapInstanceRef.current
      if (map) {
        map.remove()
        mapInstanceRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const renderPins = (pinList: PinData[]) => {
    const map = mapInstanceRef.current
    const L = LRef.current
    if (!map || !L) return

    map.eachLayer(layer => {
      if (layer instanceof L.Marker || layer instanceof L.Circle) {
        map.removeLayer(layer)
      }
    })

    pinList.forEach(pin => {
      const customHtml = `
        <div style="
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: ${pin.isUnlocked ? 'linear-gradient(135deg, #B07D24, #D19A3A)' : '#4A5A52'};
          border: 2px solid ${pin.isUnlocked ? '#F2EADC' : 'rgba(176,125,36,0.5)'};
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          box-shadow: 0 0 12px ${pin.isUnlocked ? 'rgba(176,125,36,0.5)' : 'rgba(0,0,0,0.35)'};
          cursor: pointer;
        ">
          ${pin.isUnlocked ? '📍' : '🔒'}
        </div>
      `

      const icon = L.divIcon({
        className: 'custom-leaflet-pin',
        html: customHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      })

      const popupContent = `
        <div style="font-family: 'Fraunces', Georgia, serif; color: #23302A; padding: 4px; min-width: 160px;">
          <h4 style="font-weight: 700; margin: 0 0 4px 0; font-size: 13px; color: #23302A;">${pin.title}</h4>
          <p style="font-family: ui-monospace, monospace; font-size: 10px; margin: 0 0 6px 0; color: #B85C38;">${pin.location}</p>
          <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: bold; border-top: 1px solid rgba(35,48,42,0.2); padding-top: 4px;">
            <span>★ ${pin.rating}</span>
            <span style="color: #4A7C3F;">+${pin.xp} XP</span>
          </div>
        </div>
      `

      const marker = L.marker([pin.lat, pin.lng], { icon }).addTo(map)
      marker.bindPopup(popupContent)
    })
  }

  useEffect(() => {
    if (!mapInstanceRef.current) return
    renderPins(pins)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pins])

  return (
    <div className="relative rounded-xl overflow-hidden border border-sun shadow-2xl">
      <div ref={mapContainerRef} style={{ height, width: '100%' }} />
      {loading && (
        <div
          aria-live="polite"
          style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--paper-deep)', color: 'var(--ink-faint)', fontSize: '0.78rem',
          }}
        >
          Karte wird geladen …
        </div>
      )}
      <div className="absolute top-3 left-3 z-[1000] bg-paper-deep/90 border border-sun rounded-lg px-3 py-1.5 backdrop-blur-sm pointer-events-none">
        <span className="font-mono text-[0.62rem] text-sun tracking-widest uppercase">
          ✦ Obsidian Live Map · Portugal
        </span>
      </div>
    </div>
  )
}
