type Domanda = { testo: string; lingua?: "it" | "en" };

// La prima copia di ogni fila è letta da tutti (anche dai crawler); la
// seconda serve solo all'effetto ed è nascosta ai lettori di schermo.
function Row({ items, reverse }: { items: Domanda[]; reverse?: boolean }) {
  const chip = (d: Domanda, i: number) => (
    <li key={i} lang={d.lingua === "en" ? "en" : undefined}
      className="shrink-0 whitespace-nowrap rounded-full border border-line bg-surface px-5 py-2.5 text-[15px] text-fg-soft">
      <span className="mr-2 font-mono text-xs text-accent">{d.lingua === "en" ? "EN" : "›"}</span>
      {d.testo}
    </li>
  );
  return (
    <div className="flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
      <div className={`flex w-max gap-3 pr-3 ${reverse ? "animate-marquee-rev" : "animate-marquee"} hover:[animation-play-state:paused]`}>
        <ul className="flex gap-3">{items.map(chip)}</ul>
        <ul className="flex gap-3" aria-hidden="true">{items.map(chip)}</ul>
      </div>
    </div>
  );
}

export function QuestionMarquee({ domande }: { domande: Domanda[] }) {
  const meta = Math.ceil(domande.length / 2);
  return (
    <div className="space-y-3" aria-label="Domande che i clienti fanno all'AI">
      <Row items={domande.slice(0, meta)} />
      <Row items={domande.slice(meta)} reverse />
    </div>
  );
}
