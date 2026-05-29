// Loads the bundled content and exposes lookups. The JSON is imported directly
// (Vite bundles it), so there's no fetch and it works offline from first load.
import raw from '../data/locations.json'
import { ROUTES } from '../data/routes.js'
import { pick } from './i18n.js'

export const LOCATIONS = (raw.locations || raw).filter((l) => typeof l.lat === 'number')

const byId = new Map(LOCATIONS.map((l) => [l.id, l]))
export function getLocation(id) {
  return byId.get(id) || null
}

export function getRoutes() {
  return ROUTES
}
export function getRoute(id) {
  return ROUTES.find((r) => r.id === id) || null
}
export function getRouteStops(routeId) {
  const r = getRoute(routeId)
  if (!r) return []
  return r.stops.map((id) => byId.get(id)).filter(Boolean)
}

export function searchLocations(q) {
  if (!q) return LOCATIONS
  const s = q.toLowerCase()
  return LOCATIONS.filter(
    (l) => pick(l.name).toLowerCase().includes(s) || (l.address || '').toLowerCase().includes(s)
  )
}

// Order numbers (1..n) for map markers, stable by appearance in LOCATIONS.
export const ORDER = new Map(LOCATIONS.map((l, i) => [l.id, i + 1]))
