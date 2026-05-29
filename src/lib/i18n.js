// Tiny bilingual (Danish / English) layer. Danish is the default.
import { useSyncExternalStore } from 'react'

const STRINGS = {
  appName: { da: 'Aarhus Music Walk', en: 'Aarhus Music Walk' },
  tagline: {
    da: 'En musikalsk byvandring gennem Aarhus',
    en: 'A musical walk through Aarhus'
  },
  navHome: { da: 'Hjem', en: 'Home' },
  navPlaces: { da: 'Steder', en: 'Places' },
  navRoutes: { da: 'Ruter', en: 'Routes' },
  navMap: { da: 'Kort', en: 'Map' },
  startWalk: { da: 'Start en vandring', en: 'Start a walk' },
  explorePlaces: { da: 'Udforsk alle steder', en: 'Explore all places' },
  allPlaces: { da: 'Alle steder', en: 'All places' },
  routes: { da: 'Ruter', en: 'Routes' },
  search: { da: 'Søg efter sted eller adresse…', en: 'Search place or address…' },
  stops: { da: 'stop', en: 'stops' },
  stop: { da: 'Stop', en: 'Stop' },
  facts: { da: 'Fakta', en: 'Facts' },
  readMore: { da: 'Læs mere', en: 'Read more' },
  readLess: { da: 'Vis mindre', en: 'Show less' },
  listen: { da: 'Lyt', en: 'Listen' },
  pause: { da: 'Pause', en: 'Pause' },
  resume: { da: 'Fortsæt', en: 'Resume' },
  stopAudio: { da: 'Stop', en: 'Stop' },
  directions: { da: 'Rutevejledning', en: 'Directions' },
  startRoute: { da: 'Gå denne rute', en: 'Walk this route' },
  endRoute: { da: 'Afslut vandring', en: 'End walk' },
  walking: { da: 'Vandrer', en: 'Walking' },
  locateMe: { da: 'Find mig', en: 'Locate me' },
  youAreHere: { da: 'Du er her', en: 'You are here' },
  nearestStop: { da: 'Nærmeste stop', en: 'Nearest stop' },
  nextStop: { da: 'Næste stop', en: 'Next stop' },
  away: { da: 'væk', en: 'away' },
  arrived: { da: 'Du er fremme!', en: "You've arrived!" },
  nearbyPlay: { da: 'Du er tæt på — tryk for at lytte', en: 'You are close — tap to listen' },
  visited: { da: 'Besøgt', en: 'Visited' },
  current: { da: 'Nu', en: 'Now' },
  progress: { da: 'Fremgang', en: 'Progress' },
  about: { da: 'Om', en: 'About' },
  aboutText: {
    da: 'Aarhus Music Walk fortæller byens musikhistorie fra middelalderens kirkemusik til moderne jazz. Indholdet bygger på Mette Sonne Friis’ speciale fra Aarhus Universitet (2019).',
    en: "Aarhus Music Walk tells the city's music history from medieval church music to modern jazz. The content is based on Mette Sonne Friis' thesis from Aarhus University (2019)."
  },
  noAudioVoice: {
    da: 'Din enhed har ingen dansk stemme — teksten kan stadig læses.',
    en: 'Your device has no Danish voice — you can still read the text.'
  },
  enableLocation: {
    da: 'Slå placering til for at se hvor du er.',
    en: 'Enable location to see where you are.'
  }
}

let lang = (typeof localStorage !== 'undefined' && localStorage.getItem('amw2-lang')) || 'da'
const listeners = new Set()

export function getLang() {
  return lang
}
export function setLang(l) {
  lang = l
  try {
    localStorage.setItem('amw2-lang', l)
  } catch {}
  document.documentElement.lang = l
  listeners.forEach((fn) => fn())
}
function subscribe(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

// Pick the right language out of a {da,en} object (falls back gracefully).
export function pick(obj) {
  if (obj == null) return ''
  if (typeof obj === 'string') return obj
  return obj[lang] ?? obj.da ?? obj.en ?? ''
}

// React hook: re-renders on language change, returns {t, lang, setLang, pick}.
export function useI18n() {
  const l = useSyncExternalStore(subscribe, getLang, getLang)
  const t = (key) => STRINGS[key]?.[l] ?? STRINGS[key]?.da ?? key
  return { t, lang: l, setLang, pick }
}
