// Grafici dell'area clienti in SVG puro (niente librerie, si vedono anche senza JavaScript).
// Con esempio=true sono in grigio: servono a far vedere cosa arriverà, mai spacciati per dati veri.

const BLU = "#1f3fd6", BLU_CHIARO = "#c9d3fb", VERDE = "#1a9e7a", GIALLO = "#ffd53d", GRIGIO = "#d9d3c7", GRIGIO_CHIARO = "#ece8df";
const n = (x: number) => x.toLocaleString("it-IT");

export function Area({ punti, etichette, esempio = false, altezza = 220 }: { punti: number[]; etichette: string[]; esempio?: boolean; altezza?: number }) {
  const W = 1000, H = altezza, P = { t: 28, r: 20, b: 32, l: 20 };
  const max = Math.max(1, ...punti) * 1.15;
  const x = (i: number) => P.l + (i * (W - P.l - P.r)) / Math.max(1, punti.length - 1);
  const y = (v: number) => H - P.b - (v / max) * (H - P.t - P.b);
  const linea = punti.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const area = `${linea} L${x(punti.length - 1)},${H - P.b} L${x(0)},${H - P.b} Z`;
  const colore = esempio ? GRIGIO : BLU;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="g-svg" role="img" aria-label={esempio ? "Grafico di esempio" : `Contatti per mese: ${punti.map((v, i) => `${etichette[i]} ${v}`).join(", ")}`}>
      {[0.25, 0.5, 0.75].map((f) => <line key={f} x1={P.l} x2={W - P.r} y1={P.t + f * (H - P.t - P.b)} y2={P.t + f * (H - P.t - P.b)} stroke={GRIGIO_CHIARO} />)}
      <path d={area} fill={esempio ? GRIGIO_CHIARO : "#e3e8fb"} />
      <path d={linea} fill="none" stroke={colore} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      {punti.map((v, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(v)} r={i === punti.length - 1 ? 6 : 4} fill={i === punti.length - 1 && !esempio ? GIALLO : "#fff"} stroke={colore} strokeWidth="2.5" />
          {!esempio && <text x={x(i)} y={y(v) - 12} textAnchor="middle" className="g-val">{n(v)}</text>}
          <text x={x(i)} y={H - 10} textAnchor="middle" className="g-lab">{etichette[i]}</text>
        </g>
      ))}
    </svg>
  );
}

export function Ciambella({ parti, esempio = false }: { parti: { etichetta: string; valore: number }[]; esempio?: boolean }) {
  const colori = esempio ? [GRIGIO, "#e6e1d6", GRIGIO_CHIARO] : [BLU, VERDE, GIALLO];
  const tot = Math.max(1, parti.reduce((t, p) => t + p.valore, 0));
  const R = 70, C = 2 * Math.PI * R;
  let off = 0;
  return (
    <div className="g-donut">
      <svg viewBox="0 0 180 180" className="g-svg" role="img" aria-label={esempio ? "Grafico di esempio" : parti.map((p) => `${p.etichetta} ${p.valore}`).join(", ")}>
        <circle cx="90" cy="90" r={R} fill="none" stroke={GRIGIO_CHIARO} strokeWidth="26" />
        {parti.map((p, i) => {
          const len = (p.valore / tot) * C;
          const el = <circle key={i} cx="90" cy="90" r={R} fill="none" stroke={colori[i]} strokeWidth="26" strokeDasharray={`${len} ${C - len}`} strokeDashoffset={-off} transform="rotate(-90 90 90)" />;
          off += len;
          return el;
        })}
        <text x="90" y="88" textAnchor="middle" className="g-big">{esempio ? "–" : n(tot)}</text>
        <text x="90" y="110" textAnchor="middle" className="g-lab">contatti</text>
      </svg>
      <ul className="g-leg">
        {parti.map((p, i) => <li key={p.etichetta}><span style={{ background: colori[i] }} />{p.etichetta}<strong>{esempio ? "" : `${Math.round((p.valore / tot) * 100)}%`}</strong></li>)}
      </ul>
    </div>
  );
}

export function Stelle({ conteggi, esempio = false }: { conteggi: number[]; esempio?: boolean }) {
  // conteggi[0] = 5 stelle … conteggi[4] = 1 stella
  const tot = conteggi.reduce((t, v) => t + v, 0);
  const max = Math.max(1, ...conteggi);
  const media = tot ? conteggi.reduce((t, v, i) => t + v * (5 - i), 0) / tot : 0;
  return (
    <div className="g-stars">
      <div className="g-stars__media"><strong>{esempio || !tot ? "–" : media.toFixed(1).replace(".", ",")}</strong><span>★ media</span><small>{esempio ? "" : `${n(tot)} recensioni`}</small></div>
      <ul>
        {conteggi.map((v, i) => (
          <li key={i}><span>{5 - i} ★</span><span className="g-stars__bar"><span style={{ width: `${(v / max) * 100}%`, background: esempio ? GRIGIO : i < 2 ? GIALLO : i === 2 ? "#f2c14e" : "#e98b7d" }} /></span><span>{esempio ? "" : n(v)}</span></li>
        ))}
      </ul>
    </div>
  );
}

export function Anello({ percento, esempio = false, sotto }: { percento: number; esempio?: boolean; sotto: string }) {
  const R = 54, C = 2 * Math.PI * R, p = Math.max(0, Math.min(100, percento));
  return (
    <div className="g-ring">
      <svg viewBox="0 0 140 140" className="g-svg" role="img" aria-label={esempio ? "Grafico di esempio" : `${p}% ${sotto}`}>
        <circle cx="70" cy="70" r={R} fill="none" stroke={GRIGIO_CHIARO} strokeWidth="14" />
        <circle cx="70" cy="70" r={R} fill="none" stroke={esempio ? GRIGIO : VERDE} strokeWidth="14" strokeLinecap="round" strokeDasharray={`${(p / 100) * C} ${C}`} transform="rotate(-90 70 70)" />
        <text x="70" y="78" textAnchor="middle" className="g-big">{esempio ? "–" : `${p}%`}</text>
      </svg>
      <p>{sotto}</p>
    </div>
  );
}

export function Spark({ punti, esempio = false }: { punti: number[]; esempio?: boolean }) {
  if (punti.length < 2) return null;
  const W = 120, H = 36, max = Math.max(1, ...punti), min = Math.min(...punti);
  const x = (i: number) => (i * W) / (punti.length - 1);
  const y = (v: number) => H - 4 - ((v - min) / Math.max(1, max - min)) * (H - 8);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="g-spark" aria-hidden="true">
      <path d={punti.map((v, i) => `${i ? "L" : "M"}${x(i)},${y(v)}`).join(" ")} fill="none" stroke={esempio ? GRIGIO : BLU} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
