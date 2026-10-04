import Link from "next/link";
import { generaCodici } from "@/actions/console";
import { db } from "@/lib/db";
import { site } from "@/lib/site";

type C = { codice: string; tipo: string; creato_il: string; richiesta_id: number | null; attivita: string | null; tocchi: number; spedito_il: string | null };

export default async function Codici() {
  const codici = (await db()`select n.*, s.attivita from nfc_codici n left join richieste_scheda s on s.id = n.richiesta_id order by n.creato_il desc, n.codice limit 1000`) as C[];
  const liberi = codici.filter((c) => !c.richiesta_id).length;
  return (
    <div className="tt-stack-8">
      <nav aria-label="Percorso" className="tt-crumbs"><ol><li><Link href="/console/scheda">Clienti da Maps</Link> / </li><li>Codici NFC</li></ol></nav>
      <h1 className="tt-display-lg">Codici NFC</h1>
      <p className="tt-body">Ogni card o piedistallo è programmato con un link del tipo <strong>{site.url.replace(/^https?:\/\//, "")}/r/CODICE</strong>. Quando un cliente paga, gli viene assegnato il primo codice libero del tipo che ha scelto. {liberi} liberi su {codici.length}.</p>
      <form action={generaCodici} className="tt-row tt-card">
        <div className="tt-field" style={{ maxWidth: 160 }}><label htmlFor="q">Quanti</label><input id="q" name="quanti" type="number" min={1} max={500} defaultValue={50} /></div>
        <div className="tt-field" style={{ maxWidth: 220 }}><label htmlFor="t">Tipo</label><select id="t" name="tipo"><option value="card">Card</option><option value="piedistallo">Piedistallo</option></select></div>
        <button className="tt-btn" style={{ alignSelf: "end" }}>Genera codici</button>
        {codici.length > 0 && <a href="/api/console/codici" style={{ alignSelf: "end" }}>Scarica la lista per il fornitore (CSV) →</a>}
      </form>
      {codici.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <table className="tt-table">
            <thead><tr>{["Codice", "Tipo", "Link da programmare", "Assegnato a", "Tocchi"].map((h) => <th key={h}>{h}</th>)}</tr></thead>
            <tbody>{codici.map((c) => (
              <tr key={c.codice}><td><strong>{c.codice}</strong></td><td>{c.tipo}</td><td>{site.url}/r/{c.codice}</td><td>{c.attivita ?? <span className="tt-muted">libero</span>}{c.spedito_il && " · spedita"}</td><td>{c.tocchi}</td></tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
