import Link from "next/link";
import { assegnaCodice, salvaLinkRecensioni, segnaSpedita, statoScheda } from "@/actions/console";
import { db } from "@/lib/db";
import type { RichiestaScheda } from "@/lib/scheda-attivazione";

type R = RichiestaScheda & { creata_il: string; pagata_il: string | null; codice: string | null; tocchi: number | null; spedito_il: string | null };
const STATI = ["nuova", "contattata", "attiva", "card spedita", "non interessata", "disdetta"];
const wa = (n: string) => `https://wa.me/${n.replace(/\D/g, "").replace(/^(?!39)(\d{9,10})$/, "39$1")}`;
const data = (s: string) => new Date(s).toLocaleString("it-IT", { timeZone: "Europe/Rome", dateStyle: "short", timeStyle: "short" });

export default async function SchedaConsole() {
  const righe = (await db()`select s.*, n.codice, n.tocchi, n.spedito_il from richieste_scheda s
    left join nfc_codici n on n.richiesta_id = s.id order by s.creata_il desc limit 500`) as R[];
  const [liberi] = (await db()`select count(*)::int as n from nfc_codici where richiesta_id is null and tipo='card'`) as { n: number }[];
  const pagate = righe.filter((r) => r.pagata).length;
  const daSpedire = righe.filter((r) => r.pagata && r.card_nfc && !r.spedito_il).length;
  return (
    <div className="tt-stack-8">
      <div className="tt-row" style={{ justifyContent: "space-between" }}>
        <h1 className="tt-display-lg">Scheda Google</h1>
        <div className="tt-row">
          <Link href="/console/scheda/codici">Codici NFC ({liberi.n} liberi) →</Link>
          {righe.length > 0 && <a href="/api/console/scheda">Scarica CSV →</a>}
        </div>
      </div>
      <p className="tt-body tt-muted">{righe.length} richieste · {pagate} pagate · {daSpedire} card da spedire{liberi.n < 5 ? ` · attenzione: solo ${liberi.n} codici liberi` : ""}</p>
      {righe.length === 0 ? <p className="tt-body tt-muted">Nessuna richiesta ancora.</p> : (
        <div style={{ overflowX: "auto" }}>
          <table className="tt-table">
            <thead><tr>{["Data", "Attività e contatto", "Pagamento", "Card NFC", "Link recensioni", "Stato"].map((h) => <th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {righe.map((r) => (
                <tr key={r.id}>
                  <td>{data(r.creata_il)}</td>
                  <td><strong>{r.attivita}</strong> · {r.citta}<br />{r.categoria}<br />{r.nome} · <a href={wa(r.whatsapp)} target="_blank" rel="noopener">WhatsApp</a> · <a href={`mailto:${r.email}`}>email</a>{r.link_maps && <><br /><a href={r.link_maps} target="_blank" rel="noopener">Scheda Maps →</a></>}</td>
                  <td>{r.pagata ? <><span className="tt-tag">Pagata</span><br />{r.pagata_il && data(r.pagata_il)}</> : "Non pagata"}</td>
                  <td>
                    {!r.card_nfc ? "No" : (
                      <>
                        {r.codice ? <><strong>{r.codice}</strong> · {r.tocchi ?? 0} tocchi<br /><a href={`/r/${r.codice}`} target="_blank" rel="noopener">Prova il link →</a></> : r.pagata ? <form action={assegnaCodice.bind(null, r.id)}><button className="tt-chip">Assegna codice</button></form> : "Codice dopo il pagamento"}
                        <br />{r.sped_presso && <>c/o {r.sped_presso}<br /></>}{r.sped_via}<br />{r.sped_cap} {r.sped_citta} ({r.sped_provincia})
                        {r.codice && (r.spedito_il ? <><br /><span className="tt-muted">Spedita il {data(r.spedito_il)}</span></> : <form action={segnaSpedita.bind(null, r.id)}><button className="tt-chip" style={{ marginTop: 8 }}>Segna spedita</button></form>)}
                      </>
                    )}
                  </td>
                  <td>
                    <form action={salvaLinkRecensioni.bind(null, r.id)} className="tt-stack-2" style={{ minWidth: 220 }}>
                      <input name="link_recensioni" defaultValue={r.link_recensioni ?? ""} placeholder="https://g.page/r/…/review" style={{ width: "100%", minHeight: 40, padding: "0 8px", border: "2px solid var(--line-strong)", borderRadius: 8 }} />
                      <button className="tt-chip">Salva</button>
                    </form>
                    <span className="tt-small tt-muted">Se vuoto, la card apre la scheda Maps.</span>
                  </td>
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
