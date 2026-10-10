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
      { name: 'Sevilla', coords: [37.3891, -5.9845], zoom: 13 },
    ]
  },
  FR: {
    center: [46.6, 2.2],
    zoom: 6,
    subregions: [
      { name: 'Paris', coords: [48.8830, 2.3480], zoom: 13 },
      { name: 'Côte d\'Azur', coords: [43.2130, 5.5320], zoom: 11 },
      { name: 'Marseille', coords: [43.2965, 5.3698], zoom: 13 },
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
      { name: 'Berlin Alexanderplatz', coords: [52.5219, 13.4132], zoom: 14 },
      { name: 'Bayern', coords: [48.1351, 11.5820], zoom: 10 },
    ]
  },
  AT: {
    center: [47.5, 14.5],
    zoom: 7,
    subregions: [
      { name: 'Wien', coords: [48.2190, 16.3920], zoom: 13 },
      { name: 'Tirol', coords: [47.2692, 11.4041], zoom: 10 },
      { name: 'Salzburg', coords: [47.8095, 13.0550], zoom: 13 },
    ]
  },
  CH: {
    center: [46.8, 8.2],
    zoom: 8,
    subregions: [
      { name: 'Zürich', coords: [47.3697, 8.5436], zoom: 13 },
      { name: 'Zermatt', coords: [45.9763, 7.7491], zoom: 12 },
      { name: 'Genf', coords: [46.2044, 6.1432], zoom: 13 },
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
      { name: 'Osaka Dotonbori', coords: [34.6687, 135.5013], zoom: 14 },
    ]
  },
  US: {
    center: [39.5, -98.3],
    zoom: 4,
    subregions: [
      { name: 'New York Times Sq', coords: [40.7580, -73.9855], zoom: 14 },
      { name: 'Miami South Beach', coords: [25.7826, -80.1340], zoom: 13 },
      { name: 'San Francisco Tenderloin', coords: [37.7844, -122.4144], zoom: 14 },
      { name: 'Grand Canyon', coords: [36.0544, -112.1401], zoom: 11 },
    ]
  },
  GB: {
    center: [54.5, -3.2],
    zoom: 6,
    subregions: [
      { name: 'London Westminster', coords: [51.5014, -0.1419], zoom: 13 },
      { name: 'Edinburgh', coords: [55.9533, -3.1883], zoom: 13 },
    ]
  },
  GR: {
    center: [38.5, 23.5],
    zoom: 7,
    subregions: [
      { name: 'Athen Monastiraki', coords: [37.9763, 23.7258], zoom: 14 },
      { name: 'Santorini Oia', coords: [36.4618, 25.3753], zoom: 13 },
      { name: 'Kreta Chania', coords: [35.5138, 24.0180], zoom: 12 },
    ]
  },
  TR: {
    center: [39.0, 35.2],
    zoom: 6,
    subregions: [
      { name: 'Istanbul Sultanahmet', coords: [41.0054, 28.9768], zoom: 14 },
      { name: 'Antalya Altstadt', coords: [36.8841, 30.7056], zoom: 13 },
      { name: 'Kappadokien Göreme', coords: [38.6431, 34.8289], zoom: 12 },
    ]
  },
  HR: {
    center: [45.1, 15.2],
    zoom: 7,
    subregions: [
      { name: 'Dubrovnik Altstadt', coords: [42.6412, 18.1100], zoom: 14 },
      { name: 'Split Diokletianpalast', coords: [43.5081, 16.4402], zoom: 14 },
      { name: 'Istrien Rovinj', coords: [45.0812, 13.6387], zoom: 13 },
    ]
  },
  TH: {
    center: [15.2, 101.0],
    zoom: 6,
    subregions: [
      { name: 'Bangkok Khaosan Rd', coords: [13.7588, 100.4974], zoom: 14 },
      { name: 'Phuket Patong', coords: [7.8960, 98.2980], zoom: 13 },
      { name: 'Chiang Mai Altstadt', coords: [18.7883, 98.9853], zoom: 13 },
    ]
  },
  ID: {
    center: [-0.7, 114.0],
    zoom: 5,
    subregions: [
      { name: 'Bali Kuta Beach', coords: [-8.7185, 115.1686], zoom: 13 },
      { name: 'Bali Ubud Monkey Forest', coords: [-8.5194, 115.2606], zoom: 14 },
      { name: 'Lombok Kuta', coords: [-8.8911, 116.2783], zoom: 12 },
    ]
  },
  VN: {
    center: [14.0, 108.2],
    zoom: 6,
    subregions: [
      { name: 'Hanoi Old Quarter', coords: [21.0333, 105.8500], zoom: 14 },
      { name: 'Ho Chi Minh Distrikt 1', coords: [10.7769, 106.7009], zoom: 14 },
      { name: 'Da Nang My Khe', coords: [16.0544, 108.2439], zoom: 13 },
    ]
  },
  EG: {
    center: [26.8, 30.8],
    zoom: 6,
    subregions: [
      { name: 'Kairo & Pyramiden Gizeh', coords: [29.9792, 31.1342], zoom: 13 },
      { name: 'Hurghada Rotes Meer', coords: [27.2579, 33.8116], zoom: 12 },
      { name: 'Luxor Karnak', coords: [25.7188, 32.6573], zoom: 13 },
    ]
  },
  MA: {
    center: [31.7, -7.0],
    zoom: 6,
    subregions: [
      { name: 'Marrakesch Jemaa el-Fna', coords: [31.6258, -7.9891], zoom: 14 },
      { name: 'Fès Medina', coords: [34.0625, -4.9814], zoom: 14 },
      { name: 'Taghazout Surf Coast', coords: [30.5439, -9.7094], zoom: 13 },
    ]
  },
  ZA: {
    center: [-30.5, 22.9],
    zoom: 5,
    subregions: [
      { name: 'Kapstadt Long Street', coords: [-33.9249, 18.4241], zoom: 14 },
      { name: 'Johannesburg CBD', coords: [-26.2041, 28.0473], zoom: 13 },
      { name: 'Kruger Nationalpark', coords: [-23.9884, 31.5547], zoom: 9 },
    ]
  },
  MX: {
    center: [23.6, -102.5],
    zoom: 5,
    subregions: [
      { name: 'Cancún Zona Hotelera', coords: [21.1391, -86.7497], zoom: 13 },
      { name: 'Mexiko-Stadt Zócalo', coords: [19.4326, -99.1332], zoom: 14 },
      { name: 'Tulum Ruinas', coords: [20.2151, -87.4294], zoom: 13 },
    ]
  },
  BR: {
    center: [-14.2, -51.9],
    zoom: 4,
    subregions: [
      { name: 'Rio de Janeiro Copacabana', coords: [-22.9711, -43.1822], zoom: 14 },
      { name: 'São Paulo Paulista', coords: [-23.5615, -46.6559], zoom: 14 },
      { name: 'Salvador Pelourinho', coords: [-12.9714, -38.5113], zoom: 14 },
    ]
  },
  AU: {
    center: [-25.2, 133.7],
    zoom: 4,
    subregions: [
      { name: 'Sydney Bondi Beach', coords: [-33.8915, 151.2767], zoom: 13 },
      { name: 'Cairns Great Barrier Reef', coords: [-16.9186, 145.7781], zoom: 11 },
      { name: 'Melbourne CBD', coords: [-37.8136, 144.9631], zoom: 13 },
    ]
  },
  NZ: {
    center: [-40.9, 174.8],
    zoom: 6,
    subregions: [
      { name: 'Queenstown Adventure', coords: [-45.0312, 168.6626], zoom: 13 },
      { name: 'Auckland Viaduct', coords: [-36.8446, 174.7618], zoom: 13 },
    ]
  },
  NO: {
    center: [60.4, 8.4],
    zoom: 6,
    subregions: [
      { name: 'Oslo Karl Johans gate', coords: [59.9139, 10.7522], zoom: 13 },
      { name: 'Lofoten Reine', coords: [67.9333, 13.0833], zoom: 11 },
    ]
  },
  SE: {
    center: [60.1, 18.6],
    zoom: 5,
    subregions: [
      { name: 'Stockholm Gamla Stan', coords: [59.3251, 18.0709], zoom: 14 },
      { name: 'Gotland Visby', coords: [57.6348, 18.2948], zoom: 13 },
    ]
  },
  DK: {
    center: [56.2, 9.5],
    zoom: 7,
    subregions: [
      { name: 'Kopenhagen Nyhavn', coords: [55.6795, 12.5910], zoom: 14 },
      { name: 'Nordsee Hvide Sande', coords: [56.0028, 8.1278], zoom: 11 },
    ]
  },
  NL: {
    center: [52.1, 5.2],
    zoom: 8,
    subregions: [
      { name: 'Amsterdam De Wallen', coords: [52.3725, 4.8970], zoom: 14 },
      { name: 'Rotterdam Blaak', coords: [51.9197, 4.4920], zoom: 13 },
    ]
  },
  BE: {
    center: [50.5, 4.4],
    zoom: 8,
    subregions: [
      { name: 'Brüssel Grand-Place', coords: [50.8467, 4.3524], zoom: 14 },
      { name: 'Brüssel Gare du Midi', coords: [50.8357, 4.3359], zoom: 15 },
    ]
  },
  PL: {
    center: [51.9, 19.1],
    zoom: 6,
    subregions: [
      { name: 'Krakau Rynek Główny', coords: [50.0619, 19.9373], zoom: 14 },
      { name: 'Warschau Altstadt', coords: [52.2497, 21.0122], zoom: 14 },
    ]
  },
  CZ: {
    center: [49.8, 15.4],
    zoom: 7,
    subregions: [
      { name: 'Prag Karlsbrücke', coords: [50.0865, 14.4114], zoom: 15 },
      { name: 'Prag Wenzelsplatz', coords: [50.0813, 14.4281], zoom: 14 },
    ]
  },
  HU: {
    center: [47.1, 19.5],
    zoom: 7,
    subregions: [
      { name: 'Budapest Jüdisches Viertel', coords: [47.4984, 19.0645], zoom: 14 },
      { name: 'Budapest Burgpalast', coords: [47.4962, 19.0396], zoom: 14 },
    ]
  },
  CA: {
    center: [56.1, -106.3],
    zoom: 4,
    subregions: [
      { name: 'Vancouver Gastown', coords: [49.2839, -123.1093], zoom: 14 },
      { name: 'Banff Nationalpark', coords: [51.1784, -115.5708], zoom: 12 },
    ]
  },
  IN: {
    center: [20.5, 78.9],
    zoom: 5,
    subregions: [
      { name: 'Neu-Delhi Paharganj', coords: [28.6432, 77.2144], zoom: 14 },
      { name: 'Goa Anjuna', coords: [15.5807, 73.7432], zoom: 13 },
      { name: 'Mumbai Colaba', coords: [18.9220, 72.8347], zoom: 14 },
    ]
  },
}

export default function RadarThreatMap({
  countryCode,
  threats,
  isProUser,
  onUnlockPro,
  height = '520px'
}: RadarThreatMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<LeafletNamespace.Map | null>(null)
  const tileLayerRef = useRef<LeafletNamespace.TileLayer | null>(null)
  const LRef = useRef<typeof LeafletNamespace | null>(null)
  const [mapStyle, setMapStyle] = useState<'esri_dark' | 'osm_clean'>('esri_dark')
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

      const countryConf = COUNTRY_CENTERS[countryCode] || { center: [30.0, 10.0], zoom: 3 }

      const map = L.map(mapContainerRef.current, {
        center: countryConf.center,
        zoom: countryConf.zoom,
        minZoom: 2,
        maxZoom: 18,
        zoomControl: false,
      })

      // Clean, elegant Dark Esri Canvas Tiles without any watermarks (Matches our #042c2e theme)
      const tileUrl = mapStyle === 'esri_dark'
        ? 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

      const tileLayer = L.tileLayer(tileUrl, {
        attribution: mapStyle === 'esri_dark'
          ? 'Tiles &copy; Esri &mdash; DeLorme, NAVTEQ'
          : '&copy; OpenStreetMap Contributors',
        minZoom: 2,
        maxZoom: 18,
      }).addTo(map)

      tileLayerRef.current = tileLayer
      L.control.zoom({ position: 'bottomright' }).addTo(map)

      mapInstanceRef.current = map
      setLoading(false)
      renderThreatLayers(threats)

      // Invalidate size after layout calculation to prevent any gray / cut-off tiles
      setTimeout(() => {
        if (!cancelled && mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize()
        }
      }, 200)
    })

    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize()
      }
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelled = true
      window.removeEventListener('resize', handleResize)
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Switch tile layer cleanly when mapStyle toggles
  useEffect(() => {
    const map = mapInstanceRef.current
    const L = LRef.current
    if (!map || !L) return

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current)
    }

    const tileUrl = mapStyle === 'esri_dark'
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

    const newLayer = L.tileLayer(tileUrl, {
      attribution: mapStyle === 'esri_dark'
        ? 'Tiles &copy; Esri &mdash; DeLorme, NAVTEQ'
        : '&copy; OpenStreetMap Contributors',
      minZoom: 2,
      maxZoom: 18,
    }).addTo(map)

    tileLayerRef.current = newLayer
    map.invalidateSize()
  }, [mapStyle])

  // Update center when countryCode changes & invalidate size
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    const countryConf = COUNTRY_CENTERS[countryCode] || { center: [30.0, 10.0], zoom: 3 }
    map.flyTo(countryConf.center, countryConf.zoom, { duration: 1.2 })
    setTimeout(() => {
      map.invalidateSize()
    }, 300)
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
            border: 2px solid ${isLocked ? '#D9D19B' : color};
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
          ">
            ${item.icon || '⚠️'}
            ${isLocked ? '<span style="position: absolute; -top: 4px; right: -4px; background: #D9D19B; color: #042C2E; font-size: 9px; font-weight: 900; border-radius: 99px; padding: 1px 3px; border: 1px solid #042C2E;">PRO</span>' : ''}
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

      {/* ── Top Left: Style Toggle & World View ── */}
      <div className="absolute top-14 left-3 z-[400] flex items-center gap-1.5 bg-paper/90 backdrop-blur-md px-2 py-1 rounded-xl border border-line shadow-md">
        <button
          onClick={() => setMapStyle(prev => prev === 'esri_dark' ? 'osm_clean' : 'esri_dark')}
          className="text-[0.7rem] font-mono font-bold px-2 py-0.5 rounded-lg bg-card hover:bg-sun-wash border border-line text-ink transition-all shadow-sm"
          title="Kartenstil wechseln (100% Watermark-frei)"
        >
          {mapStyle === 'esri_dark' ? '🌑 Dark Canvas' : '🗺️ OpenStreetMap'}
        </button>
        <button
          onClick={() => {
            if (mapInstanceRef.current) {
              mapInstanceRef.current.flyTo([25.0, 10.0], 2, { duration: 1.2 })
            }
          }}
          className="text-[0.7rem] font-mono font-bold px-2 py-0.5 rounded-lg bg-card hover:bg-sun-wash border border-line text-ink transition-all shadow-sm"
          title="Globale Weltansicht anzeigen"
        >
          🌍 Weltansicht
        </button>
      </div>

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
