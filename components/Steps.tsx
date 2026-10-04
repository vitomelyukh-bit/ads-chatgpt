export const passi = [
  { titolo: "Analisi gratuita in call", testo: "In una breve call guardiamo il tuo settore, cosa chiedono i tuoi clienti all'AI e se gli annunci su ChatGPT hanno senso per te. Se non ne hanno, te lo diciamo." },
  { titolo: "Strategia e budget", testo: "Ti proponiamo dove comparire, con quali messaggi e con quale budget di partenza. Tutto scritto, prima di spendere un euro." },
  { titolo: "Lancio", testo: "Prepariamo account, annunci e pagina di destinazione, e mettiamo online la campagna." },
  { titolo: "Ottimizzazione e report", testo: "Seguiamo la campagna, tagliamo quello che non rende e ti mandiamo un report chiaro: quanto hai speso e cosa ti ha portato." },
];

export function Steps({ headingLevel = 3 }: { headingLevel?: 2 | 3 }) {
  const H = `h${headingLevel}` as "h2" | "h3";
  return (
    <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {passi.map((p, i) => (
        <li key={p.titolo} className="card relative p-6">
          <span className="font-mono text-sm text-accent">0{i + 1}</span>
          <H className="mt-6 text-lg font-semibold tracking-tight text-fg">{p.titolo}</H>
          <p className="mt-2 text-[15px] leading-relaxed text-fg-soft">{p.testo}</p>
        </li>
      ))}
    </ol>
  );
}
