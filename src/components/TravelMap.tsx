import React, { useEffect, useRef } from 'react'
import L from 'leaflet'
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

export default function TravelMap({ pins, height = '420px' }: TravelMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!mapContainerRef.current) return
    if (mapInstanceRef.current) return

    // Center on Portugal / Iberian Atlantic by default
    const map = L.map(mapContainerRef.current, {
      center: [38.75, -9.2],
      zoom: 9,
      minZoom: 3,
      maxZoom: 16,
      maxBounds: [[-85, -180], [85, 180]],
      maxBoundsViscosity: 1.0,
      zoomControl: false,
    })

    // Custom Obsidian Dark Tiles from CartoDB Dark Matter
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; DeLorme, NAVTEQ',
      minZoom: 3,
      maxZoom: 16,
      noWrap: true,
      bounds: [[-85, -180], [85, 180]],
    }).addTo(map)

    L.control.zoom({ position: 'bottomright' }).addTo(map)

    mapInstanceRef.current = map

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    // Clear previous markers
    map.eachLayer(layer => {
      if (layer instanceof L.Marker || layer instanceof L.Circle) {
        map.removeLayer(layer)
      }
    })

    // Add luxury gold compass markers
    pins.forEach(pin => {
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

      // Leaflet rendert ausserhalb von React, daher Inline-Farben.
      // Hell/Papier, damit das Popup in beiden Themes lesbar bleibt.
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
  }, [pins])

  return (
    <div className="relative rounded-xl overflow-hidden border border-sun shadow-2xl">
      <div ref={mapContainerRef} style={{ height, width: '100%' }} />
      <div className="absolute top-3 left-3 z-[1000] bg-paper-deep/90 border border-sun rounded-lg px-3 py-1.5 backdrop-blur-sm pointer-events-none">
        <span className="font-mono text-[0.62rem] text-sun tracking-widest uppercase">
          ✦ Obsidian Live Map · Portugal
        </span>
      </div>
    </div>
  )
}
