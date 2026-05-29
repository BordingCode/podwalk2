# Aarhus Music Walk — v2

A musical walking tour of Aarhus' music history (medieval church music → modern jazz),
rebuilt from [podwalk v1](https://github.com/BordingCode/podwalk). 17 stops, 3 curated
routes, bilingual Danish/English, live map, GPS walk mode, and on-device audio narration.

**Live:** https://bordingcode.github.io/podwalk2/

## What's new vs v1
- Full visual + UX redesign (mobile-first PWA).
- **Walk mode:** live "you are here", nearest/next-stop guidance with distance, route
  progress, and arrival prompts that offer narration hands-free.
- **Real audio narration** via the browser's built-in speech (offline, free, DA/EN).
- Prettier **CARTO Voyager** map tiles, offline tile caching.
- Fixed broken route stop references from v1.

## Tech
React + Vite, Leaflet, `vite-plugin-pwa`. Built output is committed to `/docs` and served
by GitHub Pages — **no build step needed to deploy**, just push.

## Develop
```bash
npm install
npm run dev      # local dev server
npm run build    # outputs to /docs (commit this to deploy)
```

Content is based on Mette Sonne Friis' thesis, Aarhus University (2019).
