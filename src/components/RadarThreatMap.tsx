import React, { useEffect, useRef, useState } from 'react'
import type * as LeafletNamespace from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { ThreatItem, ThreatCategory } from '../data/travelIntelligence'

interface RadarThreatMapProps {
  countryCode: string
  threats: ThreatItem[]
  isProUser: boolean
  onUnlockPro: (threat: ThreatItem) => void
  height?: string
}

const COUNTRY_CENTERS: Record<string, { center: [number, number]; zoom: number; subregions?: { name: string; coords: [number, number]; zoom: number }[] }> = {
  PT: {
    center: [38.9, -8.8],
    zoom: 7,
    subregions: [
      { name: 'Lissabon', coords: [38.7118, -9.1350], zoom: 13 },
      { name: 'Nazaré', coords: [39.6053, -9.0854], zoom: 12 },
      { name: 'Algarve', coords: [37.0988, -8.6732], zoom: 11 },
    ]
  },
  ES: {
    center: [40.4, -3.7],
    zoom: 6,
    subregions: [
      { name: 'Barcelona', coords: [41.3818, 2.1734], zoom: 13 },
      { name: 'Madrid', coords: [40.4168, -3.7038], zoom: 13 },
    ]
  },
  FR: {
    center: [46.6, 2.2],
    zoom: 6,
    subregions: [
      { name: 'Paris', coords: [48.8830, 2.3480], zoom: 13 },
      { name: 'Côte d\'Azur', coords: [43.2130, 5.5320], zoom: 11 },
    ]
  },
  IT: {
    center: [42.5, 12.5],
    zoom: 6,
    subregions: [
      { name: 'Rom', coords: [41.8902, 12.4922], zoom: 13 },
      { name: 'Neapel', coords: [40.8518, 14.2506], zoom: 13 },
      { name: 'Venedig', coords: [45.4340, 12.3380], zoom: 13 },
    ]
  },
  DE: {
    center: [51.1, 10.4],
    zoom: 6,
    subregions: [
      { name: 'Frankfurt Hbf', coords: [50.1072, 8.6638], zoom: 14 },
      { name: 'Bayern', coords: [48.1351, 11.5820], zoom: 10 },
    ]
  },
  AT: {
    center: [47.5, 14.5],
    zoom: 7,
    subregions: [
      { name: 'Wien', coords: [48.2190, 16.3920], zoom: 13 },
      { name: 'Tirol', coords: [47.2692, 11.4041], zoom: 10 },
    ]
  },
  CH: {
    center: [46.8, 8.2],
    zoom: 8,
    subregions: [
      { name: 'Zürich', coords: [47.3697, 8.5436], zoom: 13 },
      { name: 'Zermatt', coords: [45.9763, 7.7491], zoom: 12 },
    ]
  },
  IS: {
    center: [64.5, -18.5],
    zoom: 6,
    subregions: [
      { name: 'Reynisfjara Beach', coords: [63.4044, -19.0494], zoom: 13 },
      { name: 'Hochland', coords: [64.9263, -18.2155], zoom: 9 },
    ]
  },
  JP: {
    center: [36.2, 138.2],
    zoom: 6,
    subregions: [
      { name: 'Shinjuku Tokio', coords: [35.6938, 139.7034], zoom: 14 },
      { name: 'Nara Park', coords: [34.6850, 135.8430], zoom: 13 },
    ]
  }
}

export default function RadarThreatMap({
  countryCode,
  threats,
  isProUser,
  onUnlockPro,
  height = '480px'
}: RadarThreatMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<LeafletNamespace.Map | null>(null)
  const LRef = useRef<typeof LeafletNamespace | null>(null)
  const [loading, setLoading] = useState(true)

  // Color mapping helper
  const getCategoryColor = (cat: ThreatCategory) => {
    switch (cat) {
      case 'crime': return '#dc2626'
      case 'nature': return '#ea580c'
      case 'wildlife': return '#ca8a04'
      case 'connectivity': return '#0284c7'
    }
  }

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return
    if (mapInstanceRef.current) return

    let cancelled = false

    void import('leaflet').then((mod) => {
      if (cancelled || !mapContainerRef.current) return
      const L = (mod.default ?? mod) as unknown as typeof LeafletNamespace
      LRef.current = L

      const countryConf = COUNTRY_CENTERS[countryCode] || { center: [48.0, 10.0], zoom: 5 }

      const map = L.map(mapContainerRef.current, {
        center: countryConf.center,
        zoom: countryConf.zoom,
        minZoom: 3,
        maxZoom: 17,
        zoomControl: false,
      })

      // Dark elegant carto tiles matching our #042c2e theme
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 19,
      }).addTo(map)

      L.control.zoom({ position: 'bottomright' }).addTo(map)

      mapInstanceRef.current = map
      setLoading(false)
      renderThreatLayers(threats)
    })

    return () => {
      cancelled = true
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Update center when countryCode changes
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    const countryConf = COUNTRY_CENTERS[countryCode]
    if (countryConf) {
      map.flyTo(countryConf.center, countryConf.zoom, { duration: 1.2 })
    }
  }, [countryCode])

  // Re-render layers when threats or isProUser changes
  useEffect(() => {
    if (!loading && mapInstanceRef.current && LRef.current) {
      renderThreatLayers(threats)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threats, isProUser, loading])

  const renderThreatLayers = (items: ThreatItem[]) => {
    const map = mapInstanceRef.current
    const L = LRef.current
    if (!map || !L) return

    // Clear existing threat markers & circles
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Circle) {
        map.removeLayer(layer)
      }
    })

    items.forEach((item) => {
      if (!item.lat || !item.lng) return

      const color = getCategoryColor(item.category)
      const isLocked = Boolean(item.isProOnly && !isProUser)

      // 1. Draw threat zone circle
      const circle = L.circle([item.lat, item.lng], {
        radius: item.radiusMeters || 500,
        color: isLocked ? '#ca8a04' : color,
        fillColor: isLocked ? '#eab308' : color,
        fillOpacity: isLocked ? 0.18 : 0.25,
        weight: isLocked ? 2 : 1.5,
        dashArray: isLocked ? '4, 4' : undefined,
      }).addTo(map)

      // 2. Custom pulsing pin
      const pulseHtml = `
        <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; cursor: pointer;">
          <div style="
            position: absolute;
            inset: 0;
            border-radius: 50%;
            background: ${color};
            opacity: 0.35;
            animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
          "></div>
          <div style="
            position: relative;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: ${isLocked ? '#042C2E' : '#FFFFFF'};
            border: 2px solid ${isLocked ? '#FFEA70' : color};
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
          ">
            ${item.icon || '⚠️'}
            ${isLocked ? '<span style="position: absolute; -top: 4px; right: -4px; background: #FFEA70; color: #042C2E; font-size: 9px; font-weight: 900; border-radius: 99px; padding: 1px 3px; border: 1px solid #042C2E;">PRO</span>' : ''}
          </div>
        </div>
      `

      const icon = L.divIcon({
        className: 'custom-threat-pin',
        html: pulseHtml,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      })

      const marker = L.marker([item.lat, item.lng], { icon }).addTo(map)

      // Click handling
      if (isLocked) {
        marker.on('click', () => onUnlockPro(item))
        circle.on('click', () => onUnlockPro(item))
      } else {
        const popupContent = `
          <div style="font-family: system-ui, sans-serif; color: #042C2E; padding: 4px; min-width: 210px; max-width: 260px;">
            <div style="display: flex; items-center; justify-content: space-between; gap: 4px; margin-bottom: 4px;">
              <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: ${color}; background: ${color}15; padding: 2px 6px; border-radius: 4px;">
                ${item.severity === 'high' ? '🚨 Hohe Gefahr' : item.severity === 'medium' ? '⚠️ Moderat' : 'ℹ️ Hinweis'}
              </span>
              <span style="font-size: 10px; font-weight: 700; color: #4F412D;">${item.verifiedReports} Reports</span>
            </div>
            <h4 style="font-weight: 800; font-size: 13px; margin: 4px 0 2px 0; color: #042C2E; line-height: 1.25;">${item.title}</h4>
            <p style="font-size: 11px; margin: 0 0 6px 0; color: #4F412D; line-height: 1.35;">${item.area}</p>
            <div style="background: #FFF6B7; border-left: 3px solid #C99700; padding: 5px 6px; border-radius: 3px; font-size: 10.5px; color: #042C2E; line-height: 1.3;">
              <strong>Tipp:</strong> ${item.advice}
            </div>
          </div>
        `
        marker.bindPopup(popupContent)
        circle.bindPopup(popupContent)
      }
    })
  }

  const activeConf = COUNTRY_CENTERS[countryCode]

  return (
    <div className="relative rounded-2xl overflow-hidden border border-sun/40 shadow-lg bg-card">
      {/* ── Top Bar: Quick Jump to Hotspots ── */}
      {activeConf?.subregions && activeConf.subregions.length > 0 && (
        <div className="absolute top-3 left-3 z-[400] flex items-center gap-1.5 bg-paper/90 backdrop-blur-md px-2 py-1.5 rounded-xl border border-line shadow-md max-w-[90%] overflow-x-auto no-scrollbar">
          <span className="text-[0.68rem] font-bold font-mono text-ink-faint uppercase mr-1 whitespace-nowrap">
            🎯 Hotspots:
          </span>
          {activeConf.subregions.map((sub) => (
            <button
              key={sub.name}
              onClick={() => {
                if (mapInstanceRef.current) {
                  mapInstanceRef.current.flyTo(sub.coords, sub.zoom, { duration: 1.0 })
                }
              }}
              className="text-[0.72rem] font-bold px-2 py-0.5 rounded-lg bg-card hover:bg-sun-wash border border-line text-ink whitespace-nowrap transition-all shadow-sm"
            >
              {sub.name}
            </button>
          ))}
        </div>
      )}

      {/* ── Top Right: VIP Status Badge ── */}
      <div className="absolute top-3 right-3 z-[400]">
        {isProUser ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[0.7rem] font-mono font-bold bg-sun-bright text-ink border border-sun shadow-md">
            🛡️ VIP SHIELD AKTIV
          </span>
        ) : (
          <button
            onClick={() => {
              const locked = threats.find(t => t.isProOnly)
              if (locked) onUnlockPro(locked)
            }}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[0.7rem] font-mono font-bold bg-card text-ink border border-sun/60 hover:bg-sun-wash shadow-md transition-all cursor-pointer"
          >
            🔒 VIP MIKRO-HOTSPOTS (SPERREN)
          </button>
        )}
      </div>

      {/* ── Map Container ── */}
      <div
        ref={mapContainerRef}
        style={{ height, width: '100%' }}
        className="z-0"
      />

      {/* ── Bottom Legend ── */}
      <div className="p-3 bg-paper-deep/80 border-t border-line text-xs flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3 flex-wrap font-mono text-[0.7rem]">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span> 🔴 Kriminalität
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> 🟠 Natur &amp; Wetter
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span> 🟡 Wildtiere
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span> 🔵 Notfall &amp; Netze
          </span>
          <span className="flex items-center gap-1 text-ink font-bold">
            <span className="w-2.5 h-2.5 rounded-full border border-dashed border-sun bg-amber-200"></span> 🔒 VIP Radar Shield
          </span>
        </div>

        <div className="text-[0.68rem] font-mono text-ink-faint">
          Klicke auf Pins für Vorfall-Details &amp; Ausweich-Tipps
        </div>
      </div>
    </div>
  )
}
