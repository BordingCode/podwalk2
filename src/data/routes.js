// The 3 curated walks, ported from podwalk v1.
// NOTE: v1 referenced stop ids "tagskægget" and "aarhus-mølle" (with æ/ø) which
// did NOT match the real ids "tagskaegget" / "aarhus-moelle" — so those stops
// silently dropped out of the routes in v1. Fixed here.
export const ROUTES = [
  {
    id: 'jazz',
    name: { da: 'Jazzens Aarhus', en: 'Jazz Aarhus' },
    desc: {
      da: 'Fra jazzens indtog i 1919 til de levende spillesteder — en vandring gennem byens jazzhistorie.',
      en: "From the arrival of jazz in 1919 to today's live venues — a walk through the city's jazz history."
    },
    color: '#e0a528',
    stops: ['jazzens-indtog', 'aarhus-hallen', 'musikhuset', 'hotel-royal', 'tagskaegget', 'vestergade-58', 'bent-j', 'frederiksgade-72']
  },
  {
    id: 'musicians',
    name: { da: 'Musikernes Aarhus', en: "Musicians' Aarhus" },
    desc: {
      da: 'Stederne hvor byens musikere mødtes, øvede og optrådte gennem tiden.',
      en: "The places where the city's musicians met, rehearsed and performed over the years."
    },
    color: '#4c8dff',
    stops: ['vestergade-58', 'frederiksgade-72', 'aarhus-hallen', 'musikhuset', 'kasino-teatret', 'vennelyst', 'bent-j']
  },
  {
    id: 'old',
    name: { da: 'Det gamle Aarhus', en: 'Old Aarhus' },
    desc: {
      da: 'Fra middelalderens kirkemusik til 1800-tallets teaterliv i den ældste del af byen.',
      en: 'From medieval church music to 19th-century theatre life in the oldest part of town.'
    },
    color: '#b07a4f',
    stops: ['byens-tidligste-musik', 'vor-frue-kirke', 'aarhus-domkirke', 'det-forenede-dramatiske-selskab', 'polyhymnia', 'aarhus-moelle', 'aarhus-teater', 'vennelyst']
  }
]
