import { useState } from 'react'
import { useI18n, pick } from '../lib/i18n.js'
import { ORDER } from '../lib/store.js'
import AudioPlayer from './AudioPlayer.jsx'
import MapView from './MapView.jsx'
import Icon from './Icon.jsx'

export default function LocationDetail({ loc, autoPlay }) {
  const { t, lang } = useI18n()
  const [open, setOpen] = useState(false)
  if (!loc) return null

  const short = pick(loc.shortText)
  const long = pick(loc.longText)
  const paras = String(long).split(/\n+/).map((p) => p.trim()).filter(Boolean)
  const factObj = loc.facts ? (loc.facts[lang] || loc.facts.da || {}) : {}
  const factRows = Object.entries(factObj)
  // Narration = short intro + full text.
  const narration = [short, long].filter(Boolean).join('. ')

  const gmaps = `https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}&travelmode=walking`

  return (
    <div>
      <div className="detail-hero">
        <div className="order">{t('stop')} {ORDER.get(loc.id)} · {t('appName')}</div>
        <h1>{pick(loc.name)}</h1>
        {loc.address && <div className="addr" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Icon name="pin" size={15} /> {loc.address}</div>}
      </div>
      <div className="detail-body">
        <AudioPlayer id={loc.id} text={narration} autoStart={autoPlay} />
        {short && <p className="lead">{short}</p>}

        {factRows.length > 0 && (
          <>
            <div className="section" style={{ padding: '4px 0 8px' }}><h2>{t('facts')}</h2></div>
            <div className="facts">
              {factRows.map(([k, v]) => (
                <div className="row" key={k}><div className="k">{k}</div><div className="v">{v}</div></div>
              ))}
            </div>
          </>
        )}

        {paras.length > 0 && (
          <div className="longtext">
            <p>{paras[0]}</p>
            {open && paras.slice(1).map((p, i) => <p key={i}>{p}</p>)}
            {paras.length > 1 && (
              <button className="textbtn" onClick={() => setOpen((o) => !o)}>
                {open ? t('readLess') : t('readMore') + ' ↓'}
              </button>
            )}
          </div>
        )}

        <div className="detail-actions">
          <a className="btn btn-primary" href={gmaps} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><Icon name="compass" size={18} /> {t('directions')}</a>
        </div>

        <div className="mini-map">
          <MapView stops={[loc]} fitTo={false} />
        </div>
      </div>
    </div>
  )
}
