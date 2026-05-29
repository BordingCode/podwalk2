import { useEffect, useRef } from 'react'
import L from 'leaflet'
import { ORDER } from '../lib/store.js'
import { pick } from '../lib/i18n.js'

// CARTO Voyager — free, no API key, far prettier than raw OSM raster.
const TILE = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
const ATTR =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'

function pinIcon(label, color) {
  return L.divIcon({
    className: '',
    html: `<div class="marker-pin" style="background:${color}"><span>${label}</span></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28]
  })
}
const meIcon = L.divIcon({ className: '', html: '<div class="me-dot"></div>', iconSize: [18, 18], iconAnchor: [9, 9] })

export default function MapView({ stops, userPos, routeColor, color = '#0f1b2d', onSelect, fitTo }) {
  const elRef = useRef(null)
  const mapRef = useRef(null)
  const layersRef = useRef({ markers: L.layerGroup(), line: null, me: null })

  // Init once.
  useEffect(() => {
    const map = L.map(elRef.current, { zoomControl: false, attributionControl: true }).setView([56.156, 10.207], 15)
    L.tileLayer(TILE, { attribution: ATTR, maxZoom: 20, subdomains: 'abcd' }).addTo(map)
    L.control.zoom({ position: 'bottomleft' }).addTo(map)
    layersRef.current.markers.addTo(map)
    mapRef.current = map
    setTimeout(() => map.invalidateSize(), 80)
    return () => { map.remove(); mapRef.current = null }
  }, [])

  // Draw markers + route line.
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    const g = layersRef.current.markers
    g.clearLayers()
    if (layersRef.current.line) { map.removeLayer(layersRef.current.line); layersRef.current.line = null }

    if (routeColor && stops.length > 1) {
      layersRef.current.line = L.polyline(stops.map((s) => [s.lat, s.lng]), {
        color: routeColor, weight: 4, opacity: 0.8, dashArray: '1,8', lineCap: 'round'
      }).addTo(map)
    }

    stops.forEach((s, i) => {
      const label = routeColor ? i + 1 : ORDER.get(s.id) || i + 1
      const m = L.marker([s.lat, s.lng], { icon: pinIcon(label, routeColor || color) })
      m.bindPopup(`<b>${pick(s.name)}</b><br>${s.address || ''}`)
      if (onSelect) m.on('click', () => onSelect(s.id))
      g.addLayer(m)
    })

    if (fitTo !== false && stops.length > 1) {
      const b = L.latLngBounds(stops.map((s) => [s.lat, s.lng])).pad(0.25)
      map.fitBounds(b, { animate: false, maxZoom: 16 })
    } else if (stops.length === 1) {
      map.setView([stops[0].lat, stops[0].lng], 16, { animate: false })
    }
  }, [stops, routeColor, color, onSelect, fitTo])

  // User position dot.
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    if (layersRef.current.me) { map.removeLayer(layersRef.current.me); layersRef.current.me = null }
    if (userPos) {
      layersRef.current.me = L.marker([userPos.lat, userPos.lng], { icon: meIcon, zIndexOffset: 1000 }).addTo(map)
    }
  }, [userPos])

  return <div ref={elRef} style={{ height: '100%', width: '100%' }} />
}

// Exposed so other screens can pan the map imperatively if needed later.
export { TILE, ATTR }
