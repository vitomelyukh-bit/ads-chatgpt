import { statoScheda } from "@/actions/console";
import { db } from "@/lib/db";

type R = {
  id: number; creata_il: string; attivita: string; citta: string; categoria: string; nome: string; whatsapp: string; email: string;
  link_maps: string | null; card_nfc: boolean; sped_via: string | null; sped_cap: string | null; sped_citta: string | null;
  sped_provincia: string | null; sped_presso: string | null; stato: string;
};
const STATI = ["nuova", "contattata", "attiva", "card spedita", "non interessata", "disdetta"];
const wa = (n: string) => `https://wa.me/${n.replace(/\D/g, "").replace(/^(?!39)(\d{9,10})$/, "39$1")}`;

export default async function SchedaConsole() {
  const righe = (await db()`select * from richieste_scheda order by creata_il desc limit 500`) as R[];
  const attive = righe.filter((r) => r.stato === "attiva").length;
  const card = righe.filter((r) => r.card_nfc && r.stato !== "card spedita" && r.stato !== "non interessata").length;
  return (
    <div className="tt-stack-8">
      <div className="tt-row" style={{ justifyContent: "space-between" }}>
        <h1 className="tt-display-lg">Scheda Google</h1>
        {righe.length > 0 && <a href="/api/console/scheda">Scarica in Excel (CSV) →</a>}
      </div>
      <p className="tt-body tt-muted">{righe.length} richieste · {attive} attive · {card} card NFC da spedire</p>
      {righe.length === 0 ? <p className="tt-body tt-muted">Nessuna richiesta ancora.</p> : (
        <div style={{ overflowX: "auto" }}>
          <table className="tt-table">
            <thead><tr>{["Data", "Attività", "Contatto", "Scheda Maps", "Card NFC", "Stato"].map((h) => <th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {righe.map((r) => (
                <tr key={r.id}>
                  <td>{new Date(r.creata_il).toLocaleString("it-IT", { timeZone: "Europe/Rome", dateStyle: "short", timeStyle: "short" })}</td>
                  <td><strong>{r.attivita}</strong><br />{r.categoria} · {r.citta}</td>
                  <td>{r.nome}<br /><a href={wa(r.whatsapp)} target="_blank" rel="noopener">WhatsApp {r.whatsapp}</a><br /><a href={`mailto:${r.email}`}>{r.email}</a></td>
                  <td>{r.link_maps ? <a href={r.link_maps} target="_blank" rel="noopener">Apri scheda →</a> : "—"}</td>
                  <td>{r.card_nfc ? <><span className="tt-tag">Sì</span><br />{r.sped_presso && <>c/o {r.sped_presso}<br /></>}{r.sped_via}<br />{r.sped_cap} {r.sped_citta} ({r.sped_provincia})</> : "No"}</td>
                  <td><form className="tt-chips">{STATI.map((s) => <button key={s} aria-pressed={r.stato === s} formAction={statoScheda.bind(null, r.id, s)} className="tt-chip">{s}</button>)}</form></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
