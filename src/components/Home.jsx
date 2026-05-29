import { useI18n } from '../lib/i18n.js'
import { getRoutes, LOCATIONS } from '../lib/store.js'
import Icon from './Icon.jsx'

export default function Home({ go }) {
  const { t, pick } = useI18n()
  const routes = getRoutes()
  return (
    <div className="screen">
      <div className="hero">
        <div className="note">♪</div>
        <div className="eyebrow">Aarhus · 1100 – nu</div>
        <h1>{t('appName')}</h1>
        <p>{t('tagline')}</p>
      </div>

      <button className="bigcta" onClick={() => go({ name: 'routes' })}>
        <span className="ic"><Icon name="headphones" size={26} /></span>
        <span>
          <div className="t">{t('startWalk')}</div>
          <div className="s">{routes.length} {t('routes').toLowerCase()} · {LOCATIONS.length} {t('stops')}</div>
        </span>
      </button>
      <button className="bigcta secondary" onClick={() => go({ name: 'places' })}>
        <span className="ic"><Icon name="pin" size={24} /></span>
        <span>
          <div className="t">{t('explorePlaces')}</div>
          <div className="s">{LOCATIONS.length} {t('stops')}</div>
        </span>
      </button>

      <div className="section"><h2>{t('routes')}</h2></div>
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

      <div className="about">
        <div className="section" style={{ padding: '4px 0 8px' }}><h2>{t('about')}</h2></div>
        <p>{t('aboutText')}</p>
      </div>
    </div>
  )
}
