import { CountUp } from "./CountUp";

// Esempio del report mensile (dati di fantasia, dichiarati come tali).
// Grafico a una sola serie: colore unico, nessuna legenda, valore al passaggio/tocco e tabella accessibile.
const MESI = [
  { m: "Mag", v: 42 },
  { m: "Giu", v: 58 },
  { m: "Lug", v: 77 },
  { m: "Ago", v: 96 },
  { m: "Set", v: 131 },
  { m: "Ott", v: 168 },
];
const MAX = 200;
const RICERCHE = [
  { q: "idraulico roma nord", pos: 3 },
  { q: "perdita acqua sotto il lavandino", pos: 2 },
  { q: "quanto costa cambiare lo scaldabagno", pos: 4 },
  { q: "pronto intervento idraulico talenti", pos: 5 },
];

export function ReportDemo() {
  return (
    <figure className="tt-report" aria-label="Esempio di report mensile con dati di fantasia">
      <div className="tt-report__bar">
        <span className="tt-report__dots" aria-hidden="true"><i /><i /><i /></span>
        <span>Il tuo report · ottobre</span>
      </div>
      <div className="tt-report__body">
        <div className="tt-report__kpis">
          <div className="tt-report__kpi">
            <span className="tt-report__n"><CountUp value={6240} /></span>
            <span className="tt-report__l">persone ti hanno visto su Google</span>
          </div>
          <div className="tt-report__kpi">
            <span className="tt-report__n"><CountUp value={168} /></span>
            <span className="tt-report__l">clic sul tuo sito</span>
          </div>
          <div className="tt-report__kpi">
            <span className="tt-report__n"><CountUp value={74} /></span>
            <span className="tt-report__l">ricerche diverse in cui compari</span>
          </div>
        </div>

        <div className="tt-report__chart">
          <p className="tt-report__h">Clic sul sito, mese per mese</p>
          <div className="tt-chart" role="img" aria-label={`Clic al mese: ${MESI.map((x) => `${x.m} ${x.v}`).join(", ")}`}>
            <div className="tt-chart__grid" aria-hidden="true"><span data-v="200" /><span data-v="100" /><span data-v="0" /></div>
            <ol className="tt-chart__cols">
              {MESI.map((x, i) => (
                <li key={x.m} tabIndex={0} aria-label={`${x.m}: ${x.v} clic`}>
                  <span className="tt-chart__col" style={{ height: `${(x.v / MAX) * 100}%`, ["--i" as string]: i }}>
                    <span className={`tt-chart__val${i === MESI.length - 1 ? " is-last" : ""}`}>{x.v}</span>
                  </span>
                  <span className="tt-chart__m">{x.m}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="tt-report__q">
          <p className="tt-report__h">Ricerche in cui compari</p>
          <ul>
            {RICERCHE.map((r) => (
              <li key={r.q}><span>«{r.q}»</span><b>{r.pos}° posto</b></li>
            ))}
          </ul>
        </div>

        <details className="tt-report__table">
          <summary>Vedi i numeri in tabella</summary>
          <table>
            <thead><tr><th scope="col">Mese</th><th scope="col">Clic sul sito</th></tr></thead>
            <tbody>{MESI.map((x) => <tr key={x.m}><td>{x.m}</td><td>{x.v}</td></tr>)}</tbody>
          </table>
        </details>
      </div>
      <figcaption className="tt-small tt-muted">Esempio con dati di fantasia. I numeri veri della tua attività arrivano da Google Search Console, ogni mese.</figcaption>
    </figure>
  );
}
