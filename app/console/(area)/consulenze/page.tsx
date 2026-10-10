import { salvaStatoConsulenza } from "@/actions/consulenze";
import { elencoConsulenze, STATI_CONSULENZA } from "@/lib/consulenze";

export const dynamic = "force-dynamic";

const ETICHETTA: Record<string, string> = {
  "da-chiamare": "Da chiamare", chiamato: "Chiamato", "proposta-inviata": "Proposta inviata", cliente: "Cliente", perso: "Perso",
};

export default async function Consulenze() {
  const tutte = await elencoConsulenze();
  const conta = (s: string) => tutte.filter((c) => c.stato === s).length;
  const quando = (d: string) => new Date(d).toLocaleString("it-IT", { timeZone: "Europe/Rome", dateStyle: "short", timeStyle: "short" });
  return (
    <div className="tt-stack-8">
      <div>
        <h1 className="tt-display-lg">Consulenze</h1>
        <p className="tt-body tt-muted">
          {STATI_CONSULENZA.map((s) => `${ETICHETTA[s]}: ${conta(s)}`).join(" · ")}
        </p>
      </div>
      {tutte.length === 0 ? (
        <p className="tt-body tt-muted">Nessuna richiesta ancora.</p>
      ) : (
        <ul className="tt-stack-4" style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {tutte.map((c) => (
            <li key={c.id} className="tt-soft__box tt-stack-2">
              <p style={{ margin: 0 }}>
                <b>{c.attivita}</b> · {c.citta} <span className="tt-muted">· {quando(c.creata_il)} · {c.interesse}</span>
              </p>
              <p className="tt-small" style={{ margin: 0 }}>
                {c.nome} · <a href={`tel:${c.telefono.replace(/\s/g, "")}`}>{c.telefono}</a> · <a href={`mailto:${c.email}`}>{c.email}</a>
                {c.sito && <> · <a href={c.sito.startsWith("http") ? c.sito : `https://${c.sito}`} target="_blank" rel="noopener">{c.sito}</a></>}
                {c.piattaforma && <> · {c.piattaforma}</>}
              </p>
              <p className="tt-small tt-muted" style={{ margin: 0 }}>Da: {c.pagina || "—"}{c.ref && ` · ${c.ref}`}</p>
              <form action={salvaStatoConsulenza.bind(null, c.id)} className="tt-row" style={{ gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                <select name="stato" defaultValue={c.stato}>
                  {STATI_CONSULENZA.map((s) => <option key={s} value={s}>{ETICHETTA[s]}</option>)}
                </select>
                <input name="note" defaultValue={c.note} placeholder="Note" style={{ flex: "1 1 220px" }} />
                <button className="tt-btn tt-btn--secondary tt-btn--sm">Salva</button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
