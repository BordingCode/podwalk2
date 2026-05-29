# Aarhus Music Walk v2 — research-driven plan

This is the plan I drafted from a normal web search, then reworked after deeper
research into each part. It reuses **all content** from v1 (17 music-history stops,
3 routes, bilingual DA/EN text, facts, coordinates) and rebuilds the app.

## 1. What separates great audio-walk apps (normal search)
Studying VoiceMap, Action Tour Guide, STQRY, Tour-in-a-Box:
- **GPS-triggered, hands-free audio** is the defining feature — narration plays when you
  reach a place so you can look up from the screen.
- **Offline-first** — tours must work without signal.
- **Self-paced** — start/stop anywhere, no forced linear progression.
- **Clear "where am I / where next"** guidance with distance + direction.

## 2. Reworked plan after deeper research per part

### Map & geolocation
- `navigator.geolocation.watchPosition` with `enableHighAccuracy` for a live "you are here".
- **Geofence radius:** research shows phone GPS is only ~20–50 m accurate; 100–150 m is the
  "safe" trigger size, but Aarhus old-town stops sit close together, so a large fence
  over-triggers. → I use a **~55 m arrival radius** against the *single nearest* stop, plus
  a manual tap fallback. Avoids false/overlapping triggers.
- Map: **Leaflet + CARTO Voyager** raster tiles (free, no API key, much nicer than raw OSM).
  Custom teardrop pins numbered per stop; route polyline in the route's colour.

### Audio narration
- **Web Speech API (`speechSynthesis`)**, `da-DK` / `en-GB`. Works **offline**, free, no files.
- Research caveat baked in: iOS requires a **user gesture** to start speech and may expose
  only low-quality voices → narration is always tap-started; if no matching voice exists we
  show a note and the text is still fully readable. Long text is split into sentence chunks
  (some engines truncate long single utterances).

### PWA / offline
- `vite-plugin-pwa` (Workbox). Precache the app shell + bundled `locations.json`.
  **Runtime cache** CARTO tiles with `CacheFirst` so a walked area stays available offline.

### Visual / UX
- Mobile-first design system (navy + gold, serif display headings), `100svh` + safe-area
  insets, animated screen transitions, route progress bar, polished location pages.

## 3. Build (this repo)
- React + Vite (plain JSX), Leaflet direct. Built output committed to `/docs` so GitHub
  Pages serves it with **no build step** for Mathias. `base: '/podwalk2/'`.

## 4. Fixes vs v1
- v1's routes referenced `tagskægget` / `aarhus-mølle` but the real ids are
  `tagskaegget` / `aarhus-moelle`, so those stops silently dropped out — **fixed**.

## Sources
- VoiceMap walking-tour app — https://voicemap.me/walking-tour-app
- STQRY, GPS-triggered audio tours — https://www.stqry.com/blog/how-to-create-a-gps-triggered-audio-tour
- Geofence accuracy — https://radar.com/blog/how-accurate-is-geofencing
- Web Speech recommended voices — https://github.com/HadrienGardeur/web-speech-recommended-voices
- MDN Web Speech API — https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API
- vite-plugin-pwa Workbox / runtime caching — https://vite-pwa-org.netlify.app/workbox/generate-sw
