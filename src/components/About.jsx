import { useI18n } from '../lib/i18n.js'
import { LOCATIONS, getRoutes } from '../lib/store.js'
import Icon from './Icon.jsx'

export default function About() {
  const { t } = useI18n()
  const sections = [
    { ic: 'headphones', title: t('howToUse'), text: t('howToText') },
    { ic: 'volume', title: t('narrationTitle'), text: t('narrationText') },
    { ic: 'map', title: t('offlineTitle'), text: t('offlineText') },
    { ic: 'note', title: t('creditsTitle'), text: t('creditsText') }
  ]
  return (
    <div className="screen">
      <div className="hero" style={{ paddingBottom: 22 }}>
        <div className="note">♪</div>
        <div className="eyebrow">{getRoutes().length} {t('routes').toLowerCase()} · {LOCATIONS.length} {t('stops')}</div>
        <h1 style={{ fontSize: 28 }}>{t('appName')}</h1>
        <p>{t('tagline')}</p>
      </div>
      <div className="about" style={{ paddingTop: 8 }}>
        {sections.map((s) => (
          <div key={s.title} style={{ marginBottom: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, color: 'var(--navy)', marginBottom: 6 }}>
              <Icon name={s.ic} size={20} />
              <h2 style={{ margin: 0, fontSize: 16, textTransform: 'none', letterSpacing: 0, color: 'var(--ink)' }}>{s.title}</h2>
            </div>
            <p style={{ margin: 0 }}>{s.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
