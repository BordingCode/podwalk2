// Geo helpers for the walk experience.

// Haversine distance in metres between two {lat,lng}-ish points.
export function distance(a, b) {
  if (!a || !b) return Infinity
  const R = 6371000
  const toRad = (d) => (d * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const h = Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2)
  return 2 * R * Math.asin(Math.sqrt(h))
}

// Initial bearing from a -> b in degrees (0 = north, clockwise).
export function bearing(a, b) {
  const toRad = (d) => (d * Math.PI) / 180
  const toDeg = (r) => (r * 180) / Math.PI
  const y = Math.sin(toRad(b.lng - a.lng)) * Math.cos(toRad(b.lat))
  const x =
    Math.cos(toRad(a.lat)) * Math.sin(toRad(b.lat)) -
    Math.sin(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.cos(toRad(b.lng - a.lng))
  return (toDeg(Math.atan2(y, x)) + 360) % 360
}

// Human-friendly distance string.
export function formatDistance(m) {
  if (!isFinite(m)) return ''
  if (m < 1000) return `${Math.round(m)} m`
  return `${(m / 1000).toFixed(1)} km`.replace('.', ',')
}

// Nearest item (with .lat/.lng) to a position; returns {item, dist}.
export function nearest(pos, items) {
  let best = null
  let bestD = Infinity
  for (const it of items) {
    const d = distance(pos, it)
    if (d < bestD) {
      bestD = d
      best = it
    }
  }
  return { item: best, dist: bestD }
}

// 8-point compass arrow for a bearing, rotated relative to where the user faces
// north (we don't have heading on web reliably, so this points map-north).
export function compass(deg) {
  const dirs = ['N', 'NØ', 'Ø', 'SØ', 'S', 'SV', 'V', 'NV']
  return dirs[Math.round(deg / 45) % 8]
}
