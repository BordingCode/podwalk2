import { useState, useMemo, useEffect } from 'react'
import { useI18n, pick } from '../lib/i18n.js'
import { getRoute, getRouteStops } from '../lib/store.js'
import { useGeolocation } from '../lib/useGeo.js'
import { distance, formatDistance } from '../lib/geo.js'
import MapView from './MapView.jsx'
import Icon from './Icon.jsx'

const ARRIVE_RADIUS = 55 // metres — tuned for ~20-50m GPS accuracy in dense old town

export default function RouteView({ routeId, go }) {
  const { t } = useI18n()
  const route = getRoute(routeId)
  const stops = useMemo(() => getRouteStops(routeId), [routeId])
  const [walking, setWalking] = useState(false)
  const [visited, setVisited] = useState(() => new Set())
  const { pos, status, request } = useGeolocation(walking)

  // Current target = first stop not yet visited.
  const currentIdx = stops.findIndex((s) => !visited.has(s.id))
  const current = currentIdx >= 0 ? stops[currentIdx] : null
  const distToCurrent = pos && current ? distance(pos, current) : Infinity
  const arrived = walking && distToCurrent <= ARRIVE_RADIUS

  // Auto-mark the current stop visited once you arrive.
  useEffect(() => {
    if (arrived && current) {
      setVisited((prev) => (prev.has(current.id) ? prev : new Set(prev).add(current.id)))
    }
  }, [arrived, current])

  if (!route) return <div className="empty">∅</div>
  const pct = Math.round((visited.size / stops.length) * 100)

  return (
    <div className="screen" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 230, flex: '0 0 auto' }}>
        <MapView stops={stops} userPos={pos} routeColor={route.color} onSelect={(id) => go({ name: 'place', id })} />
      </div>

      {walking ? (
        <div className="walkbar">
          <div className="prog">
            <div style={{ fontWeight: 800, fontSize: 14 }}>
              {arrived ? t('arrived') : current ? `${t('nextStop')}: ${pick(current.name)}` : t('progress')}
            </div>
            <div style={{ fontSize: 12, color: '#9fb0c9' }}>
              {current && isFinite(distToCurrent)
                ? `${formatDistance(distToCurrent)} ${t('away')} · ${visited.size}/${stops.length}`
                : `${visited.size}/${stops.length} ${t('stops')}`}
            </div>
            <div className="track"><div className="fill" style={{ width: pct + '%' }} /></div>
          </div>
          <button className="end" onClick={() => { setWalking(false); setVisited(new Set()) }}>{t('endRoute')}</button>
        </div>
      ) : (
        <div style={{ padding: '14px 16px 4px' }}>
          <h2 style={{ margin: '0 0 4px', fontFamily: 'var(--serif)', fontSize: 22 }}>{pick(route.name)}</h2>
          <p style={{ margin: '0 0 12px', color: 'var(--muted)', fontSize: 14, lineHeight: 1.5 }}>{pick(route.desc)}</p>
          <button className="btn btn-navy" onClick={() => setWalking(true)}><Icon name="headphones" size={18} /> {t('startRoute')}</button>
          {status === 'denied' && <div className="banner-note">{t('enableLocation')}</div>}
        </div>
      )}

      {arrived && current && (
        <button className="bigcta" style={{ width: 'calc(100% - 32px)' }} onClick={() => go({ name: 'place', id: current.id, autoPlay: true })}>
          <span className="ic"><Icon name="volume" size={24} /></span>
          <span><div className="t">{pick(current.name)}</div><div className="s">{t('nearbyPlay')}</div></span>
        </button>
      )}

      <div className="stoplist">
        {stops.map((s, i) => {
          const done = visited.has(s.id)
          const isCurrent = walking && current && s.id === current.id
          const d = pos ? distance(pos, s) : Infinity
          return (
            <button key={s.id} className={'stoprow' + (done ? ' done' : '') + (isCurrent ? ' current' : '')}
              onClick={() => go({ name: 'place', id: s.id })}>
              <div className="dot">{done ? '✓' : i + 1}</div>
              <div className="info">
                <h4>{pick(s.name)}</h4>
                <p>{s.address}{walking && pos && isFinite(d) ? ` · ${formatDistance(d)}` : ''}</p>
              </div>
              {isCurrent && <span className="tag">{t('current')}</span>}
              {done && !isCurrent && <span className="tag" style={{ color: 'var(--muted)' }}>{t('visited')}</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
