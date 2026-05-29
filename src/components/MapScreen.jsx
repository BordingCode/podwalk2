import { useMemo } from 'react'
import { useI18n, pick } from '../lib/i18n.js'
import { LOCATIONS } from '../lib/store.js'
import { useGeolocation } from '../lib/useGeo.js'
import { nearest, formatDistance, bearing } from '../lib/geo.js'
import MapView from './MapView.jsx'
import Icon from './Icon.jsx'

export default function MapScreen({ go }) {
  const { t } = useI18n()
  const { pos, status, request } = useGeolocation(true)
  const near = useMemo(() => (pos ? nearest(pos, LOCATIONS) : null), [pos])
  const arrow = pos && near?.item ? bearing(pos, near.item) : 0

  return (
    <div className="screen" style={{ overflow: 'hidden' }}>
      <div className="mapwrap">
        <MapView stops={LOCATIONS} userPos={pos} onSelect={(id) => go({ name: 'place', id })} />

        {near?.item ? (
          <div className="map-banner">
            <div className="arrow" style={{ transform: `rotate(${arrow}deg)` }}><Icon name="nav" size={22} fill /></div>
            <div>
              <div className="t">{t('nearestStop')}: {pick(near.item.name)}</div>
              <div className="s">{formatDistance(near.dist)} {t('away')}</div>
            </div>
            <button className="go" onClick={() => go({ name: 'place', id: near.item.id })}>{t('stop')} ›</button>
          </div>
        ) : status === 'denied' || status === 'unavailable' ? (
          <div className="map-banner"><div className="s">{t('enableLocation')}</div></div>
        ) : null}

        <button className="map-fab" onClick={request} aria-label={t('locateMe')}><Icon name="locate" size={24} /></button>
      </div>
    </div>
  )
}
