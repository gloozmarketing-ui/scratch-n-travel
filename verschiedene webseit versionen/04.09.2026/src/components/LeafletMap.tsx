import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet default marker icons in Vite bundler
const defaultIcon = L.Icon.Default.prototype as Record<string, unknown>
delete defaultIcon._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

export interface MapPin {
  id: string | number
  lat: number
  lng: number
  title: string
  icon?: string
  color?: string
  category?: 'badge' | 'scam' | 'hazard' | 'spot'
  description?: string
}

interface LeafletMapProps {
  pins?: MapPin[]
  center?: [number, number]
  zoom?: number
  height?: string
  onPinClick?: (pin: MapPin) => void
}

/** LeafletMap — CartoCDN dark tiles. FREE, no API key required. */
export default function LeafletMap({
  pins = [],
  center = [38.75, -9.2],
  zoom = 8,
  height = '420px',
  onPinClick,
}: LeafletMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.Layer[]>([])

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return
    const map = L.map(containerRef.current, {
      center,
      zoom,
      minZoom: 3,
      maxZoom: 16,
      maxBounds: [[-85, -180], [85, 180]],
      maxBoundsViscosity: 1.0,
      zoomControl: false
    })
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; DeLorme, NAVTEQ',
      minZoom: 3,
      maxZoom: 16,
      noWrap: true,
      bounds: [[-85, -180], [85, 180]],
    }).addTo(map)
    L.control.zoom({ position: 'bottomright' }).addTo(map)
    mapRef.current = map
    return () => { map.remove(); mapRef.current = null }
  }, []) // eslint-disable-line

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    markersRef.current.forEach(m => map.removeLayer(m))
    markersRef.current = []
    pins.forEach(pin => {
      const emoji = pin.icon || (pin.category === 'badge' ? 'medal' : pin.category === 'scam' ? 'scam' : 'pin')
      const color = pin.color || (pin.category === 'badge' ? '#D4AF37' : pin.category === 'scam' ? '#EF4444' : '#14B8A6')
      const icon = L.divIcon({
        className: '',
        html: `<div style="display:flex;flex-direction:column;align-items:center"><div style="width:36px;height:36px;border-radius:50%;background:#0a1018;border:2px solid ${color};box-shadow:0 0 12px ${color}80;display:flex;align-items:center;justify-content:center;font-size:1.1rem">${emoji}</div><div style="font-size:0.58rem;font-weight:800;color:${color};background:rgba(0,0,0,0.85);padding:2px 5px;border-radius:4px;margin-top:2px;max-width:90px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${pin.title}</div></div>`,
        iconSize: [36, 52],
        iconAnchor: [18, 18],
      })
      const marker = L.marker([pin.lat, pin.lng], { icon })
      if (onPinClick) marker.on('click', () => onPinClick(pin))
      else marker.bindPopup(`<b>${pin.title}</b>${pin.description ? '<br>' + pin.description : ''}`)
      marker.addTo(map)
      markersRef.current.push(marker)
    })
  }, [pins, onPinClick])

  return <div ref={containerRef} style={{ height, width: '100%', borderRadius: '16px', overflow: 'hidden' }} />
}
