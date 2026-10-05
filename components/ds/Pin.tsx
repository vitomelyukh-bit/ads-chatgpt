// Segnaposto del design system: corallo per il cliente, grigio per gli altri.
export function Pin({ muted = false, style }: { muted?: boolean; style?: React.CSSProperties }) {
  return (
    <svg className={`tt-pin${muted ? " tt-pin--muted" : ""}`} viewBox="0 0 24 30" aria-hidden="true" style={style}>
      <path d="M12 29C8 22 2 17.5 2 11.5a10 10 0 1 1 20 0C22 17.5 16 22 12 29Z" />
      <circle cx="12" cy="11.5" r="3.6" />
    </svg>
  );
}

// Sfondo della mappa: disegno nostro, generico (niente città vere, niente colori di Google).
export function MapBg({ percorso = false }: { percorso?: boolean }) {
  return (
    <svg className="tt-map__bg" viewBox="0 0 1100 560" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect className="land" width="1100" height="560" />
      <path className="park" d="M620 0h210v150H620z" />
      <path className="water" d="M880 330c80-30 160 0 220 40v190H820c0-90 10-200 60-230z" />
      <g className="road">
        <path d="M-20 140L1120 60" strokeWidth="22" /><path d="M-20 420L1120 300" strokeWidth="26" /><path d="M560-20L640 580" strokeWidth="22" />
        <path d="M860-20L800 580" strokeWidth="16" /><path d="M-20 280L1120 190" strokeWidth="12" /><path d="M700-20L760 580" strokeWidth="10" />
        <path d="M960-20L1000 580" strokeWidth="12" /><path d="M-20 520L1120 460" strokeWidth="12" />
      </g>
      {percorso && <path className="route" d="M640 470C700 380 720 300 838 236" />}
    </svg>
  );
}
