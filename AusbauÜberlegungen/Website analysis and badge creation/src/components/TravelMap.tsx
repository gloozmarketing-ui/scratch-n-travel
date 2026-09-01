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
      zoomControl: false,
    })

    // Custom Obsidian Dark Tiles from CartoDB Dark Matter
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
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
          background: ${pin.isUnlocked ? 'linear-gradient(135deg, #C9A84C, #E8C460)' : '#152539'};
          border: 2px solid ${pin.isUnlocked ? '#F4E4C1' : 'rgba(201,168,76,0.5)'};
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          box-shadow: 0 0 12px ${pin.isUnlocked ? 'rgba(201,168,76,0.6)' : 'rgba(0,0,0,0.5)'};
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
        <div style="font-family: 'Cinzel', serif; color: #0C1825; padding: 4px; min-width: 160px;">
          <h4 style="font-weight: 700; margin: 0 0 4px 0; font-size: 13px; color: #2C1810;">${pin.title}</h4>
          <p style="font-family: 'DM Mono', monospace; font-size: 10px; margin: 0 0 6px 0; color: #8B3A2A;">${pin.location}</p>
          <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: bold; border-top: 1px solid rgba(44,24,16,0.2); padding-top: 4px;">
            <span>★ ${pin.rating}</span>
            <span style="color: #2e7d32;">+${pin.xp} XP</span>
          </div>
        </div>
      `

      const marker = L.marker([pin.lat, pin.lng], { icon }).addTo(map)
      marker.bindPopup(popupContent)
    })
  }, [pins])

  return (
    <div className="relative rounded-xl overflow-hidden border border-[rgba(201,168,76,0.25)] shadow-2xl">
      <div ref={mapContainerRef} style={{ height, width: '100%' }} />
      <div className="absolute top-3 left-3 z-[1000] bg-[#0C1825]/90 border border-[rgba(201,168,76,0.3)] rounded-lg px-3 py-1.5 backdrop-blur-sm pointer-events-none">
        <span className="font-mono text-[0.62rem] text-[#C9A84C] tracking-widest uppercase">
          ✦ Obsidian Live Map · Portugal
        </span>
      </div>
    </div>
  )
}
