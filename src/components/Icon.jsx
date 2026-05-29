// Crisp inline SVG icons (stroke-based, currentColor) — render identically on
// every device, unlike emoji which depend on the platform font.
const P = {
  home: 'M3 11.5 12 4l9 7.5M5 10v10h14V10',
  pin: 'M12 21s7-6.4 7-11a7 7 0 1 0-14 0c0 4.6 7 11 7 11Z|M12 10.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z',
  headphones: 'M4 14v-2a8 8 0 0 1 16 0v2|M4 14a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2Z|M20 14a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2 2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2Z',
  map: 'M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z|M9 4v14|M15 6v14',
  play: 'M7 5v14l12-7L7 5Z',
  pause: 'M8 5v14M16 5v14',
  stop: 'M6 6h12v12H6z',
  locate: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z|M12 2v3M12 19v3M2 12h3M19 12h3',
  nav: 'M12 2 4.5 20l7.5-4 7.5 4L12 2Z',
  volume: 'M11 5 6 9H3v6h3l5 4V5Z|M15.5 8.5a5 5 0 0 1 0 7|M18.5 5.5a9 9 0 0 1 0 13',
  compass: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z|M16 8l-2.5 5.5L8 16l2.5-5.5L16 8Z',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM21 21l-4.3-4.3',
  note: 'M9 18V6l10-2v12|M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM19 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
  arrow: 'M12 5v14M5 12l7-7 7 7'
}

export default function Icon({ name, size = 22, fill = false, stroke = 2, style }) {
  const paths = (P[name] || '').split('|')
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} aria-hidden="true">
      {paths.map((d, i) => (
        <path key={i} d={d} stroke="currentColor" strokeWidth={stroke} strokeLinecap="round"
          strokeLinejoin="round" fill={fill ? 'currentColor' : 'none'} />
      ))}
    </svg>
  )
}
