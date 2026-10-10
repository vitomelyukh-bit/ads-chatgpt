// Tre passi illustrati, da sinistra a destra (in colonna su telefono).
const PASSI = [
  {
    titolo: "Prenoti la consulenza",
    testo: "Compili il modulo e scegli l'orario. È gratis e senza impegno.",
    icona: (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <rect x="20" y="6" width="24" height="52" rx="5" />
        <path d="M28 51h8" />
        <path d="M27 24c2 6 5 9 10 11l3-3c1-1 2-1 3 0l3 2c1 1 1 2 0 3-3 3-7 3-12 0-5-3-9-8-10-13-1-3 0-6 2-7 1-1 2 0 3 1l2 3c1 1 0 2-1 3z" className="tt-ill__fill" />
      </svg>
    ),
  },
  {
    titolo: "Guardiamo il tuo sito",
    testo: "In call con Vitaliy ti mostriamo come ti vede Google, cosa sistemare e quanto costa.",
    icona: (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <rect x="6" y="10" width="40" height="32" rx="4" />
        <path d="M12 20h20M12 27h26M12 34h14" />
        <circle cx="42" cy="40" r="11" className="tt-ill__fill" />
        <path d="m50 48 8 8" />
        <path d="m37 40 4 4 6-8" className="tt-ill__on" />
      </svg>
    ),
  },
  {
    titolo: "Ogni settimana, pagine nuove",
    testo: "Se parti, lavoriamo noi: pagine, guide, scheda Google e ogni mese il report.",
    icona: (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <rect x="8" y="12" width="48" height="44" rx="5" />
        <path d="M8 24h48M20 6v10M44 6v10" />
        <rect x="15" y="31" width="10" height="8" rx="2" className="tt-ill__fill" />
        <rect x="27" y="31" width="10" height="8" rx="2" className="tt-ill__fill" />
        <rect x="39" y="31" width="10" height="8" rx="2" className="tt-ill__fill" />
        <rect x="15" y="43" width="10" height="8" rx="2" className="tt-ill__fill" />
      </svg>
    ),
  },
];

export function ComeFunziona() {
  return (
    <ol className="tt-how">
      {PASSI.map((p, i) => (
        <li key={p.titolo} className="tt-how__step" data-reveal style={{ ["--d" as string]: `${i * 120}ms` }}>
          <span className="tt-how__ill">{p.icona}</span>
          <span className="tt-how__n">{i + 1}</span>
          <h3>{p.titolo}</h3>
          <p>{p.testo}</p>
        </li>
      ))}
    </ol>
  );
}
