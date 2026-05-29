import { useState, useCallback, useEffect } from 'react'
import { useI18n } from './lib/i18n.js'
import { getLocation } from './lib/store.js'
import { stop as stopSpeech } from './lib/speech.js'
import Home from './components/Home.jsx'
import { PlacesList, RouteList } from './components/Lists.jsx'
import MapScreen from './components/MapScreen.jsx'
import RouteView from './components/RouteView.jsx'
import LocationDetail from './components/LocationDetail.jsx'
import Icon from './components/Icon.jsx'

const TABS = ['home', 'places', 'routes', 'map']

export default function App() {
  const { t, lang, setLang } = useI18n()
  // Simple history stack of view objects: {name, id?, autoPlay?}
  const [stack, setStack] = useState([{ name: 'home' }])
  const view = stack[stack.length - 1]

  const go = useCallback((v) => {
    stopSpeech()
    // Tab switches reset the stack; detail views push.
    if (TABS.includes(v.name)) setStack([v])
    else setStack((s) => [...s, v])
    document.querySelector('.screen')?.scrollTo?.(0, 0)
  }, [])

  const back = useCallback(() => {
    stopSpeech()
    setStack((s) => (s.length > 1 ? s.slice(0, -1) : s))
  }, [])

  // Android back button / browser back support.
  useEffect(() => {
    const onPop = () => back()
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [back])

  const tab = TABS.includes(view.name) ? view.name : stackTab(stack)
  const canBack = stack.length > 1

  return (
    <div className="app">
      <header className="topbar">
        {canBack ? (
          <button className="iconbtn" onClick={back} aria-label="Back" style={{ fontSize: 24, paddingBottom: 3 }}>‹</button>
        ) : (
          <div className="iconbtn" aria-hidden><Icon name="note" size={18} /></div>
        )}
        <div className="grow">
          <div className="title">{headerTitle(view, t)}</div>
          {!canBack && <div className="sub">{t('tagline')}</div>}
        </div>
        <button className="langtoggle" onClick={() => setLang(lang === 'da' ? 'en' : 'da')}>
          {lang === 'da' ? 'EN' : 'DA'}
        </button>
      </header>

      <Screen view={view} go={go} />

      <nav className="bottomnav">
        {TABS.map((name) => (
          <button key={name} className={tab === name ? 'active' : ''} onClick={() => go({ name })}>
            <span className="ic"><Icon name={ICONS[name]} size={22} /></span>
            {t('nav' + cap(name))}
          </button>
        ))}
      </nav>
    </div>
  )
}

const ICONS = { home: 'home', places: 'pin', routes: 'headphones', map: 'map' }
const cap = (s) => s[0].toUpperCase() + s.slice(1)

function stackTab(stack) {
  for (let i = stack.length - 1; i >= 0; i--) {
    if (stack[i].name === 'route') return 'routes'
    if (stack[i].name === 'place') return 'places'
    if (TABS.includes(stack[i].name)) return stack[i].name
  }
  return 'home'
}

function headerTitle(view, t) {
  if (view.name === 'place') return t('appName')
  if (view.name === 'route') return t('routes')
  if (TABS.includes(view.name)) return view.name === 'home' ? t('appName') : t('nav' + cap(view.name))
  return t('appName')
}

function Screen({ view, go }) {
  switch (view.name) {
    case 'home': return <Home go={go} />
    case 'places': return <PlacesList go={go} />
    case 'routes': return <RouteList go={go} />
    case 'map': return <MapScreen go={go} />
    case 'route': return <RouteView routeId={view.id} go={go} />
    case 'place': return <div className="screen"><LocationDetail loc={getLocation(view.id)} autoPlay={view.autoPlay} /></div>
    default: return <Home go={go} />
  }
}
