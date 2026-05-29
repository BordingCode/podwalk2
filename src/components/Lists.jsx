import { useState } from 'react'
import { useI18n, pick } from '../lib/i18n.js'
import { searchLocations, getRoutes, ORDER } from '../lib/store.js'
import Icon from './Icon.jsx'

export function PlacesList({ go }) {
  const { t } = useI18n()
  const [q, setQ] = useState('')
  const results = searchLocations(q)
  return (
    <div className="screen">
      <div className="searchbar">
        <div className="searchfield">
          <span className="si"><Icon name="search" size={18} /></span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('search')} />
          {q && <button className="clear" onClick={() => setQ('')} aria-label="Clear">×</button>}
        </div>
      </div>
      <div className="list">
        {results.map((l) => (
          <button key={l.id} className="card placecard" onClick={() => go({ name: 'place', id: l.id })}>
            <div className="num">{ORDER.get(l.id)}</div>
            <div className="body">
              <h3>{pick(l.name)}</h3>
              <p>{pick(l.shortText)}</p>
              {l.address && <div className="meta" style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Icon name="pin" size={13} /> {l.address}</div>}
            </div>
          </button>
        ))}
        {results.length === 0 && <div className="empty">∅</div>}
      </div>
    </div>
  )
}

export function RouteList({ go }) {
  const { t } = useI18n()
  const routes = getRoutes()
  return (
    <div className="screen">
      <div className="section" style={{ paddingTop: 18 }}><h2>{t('routes')}</h2></div>
      <div className="list">
        {routes.map((r) => (
          <button key={r.id} className="card routecard" onClick={() => go({ name: 'route', id: r.id })}>
            <div className="banner" style={{ background: `linear-gradient(135deg, ${r.color}, ${r.color}cc)` }}>
              <h3>{pick(r.name)}</h3>
              <span className="chip">{r.stops.length} {t('stops')}</span>
            </div>
            <div className="desc">{pick(r.desc)}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
