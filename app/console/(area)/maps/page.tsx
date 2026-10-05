import Link from "next/link";
import { eseguiGiro, nuovoClienteMaps, segnaOrdineSpedito } from "@/actions/maps-console";
import { db } from "@/lib/db";
import { googleCollegato, googleConfigurato } from "@/lib/gbp";

type Riga = { id: number; attivita: string; citta: string; email: string; stato: string; google_location: string | null; da_approvare: number; da_pubblicare: number; in_coda: number; errori: number };

export default async function MapsConsole({ searchParams }: { searchParams: Promise<{ google?: string; giro?: string; errore?: string }> }) {
  const q = await searchParams;
  const righe = (await db()`select c.id, c.attivita, c.citta, c.email, c.stato, c.google_location,
      (select count(*) from maps_recensioni r where r.cliente_id = c.id and r.stato = 'da-approvare')::int as da_approvare,
      ((select count(*) from maps_recensioni r where r.cliente_id = c.id and r.stato = 'da-pubblicare') + (select count(*) from maps_novita n where n.cliente_id = c.id and n.stato = 'da-pubblicare'))::int as da_pubblicare,
      (select count(*) from maps_novita n where n.cliente_id = c.id and n.stato = 'programmata')::int as in_coda,
      ((select count(*) from maps_recensioni r where r.cliente_id = c.id and r.stato = 'errore') + (select count(*) from maps_novita n where n.cliente_id = c.id and n.stato = 'errore'))::int as errori
    from maps_clienti c order by c.stato = 'attivo' desc, c.creato_il desc`) as Riga[];
  const ordini = (await db()`select * from ordini_banco order by (stato = 'da-spedire') desc, creato_il desc limit 30`) as { id: number; creato_il: string; tipo: string; nome: string; email: string; telefono: string; indirizzo: string; attivita: string; stato: string }[];
  const configurato = googleConfigurato();
  const collegato = await googleCollegato();

  return (
    <div className="tt-soft__page">
      <div className="tt-row" style={{ justifyContent: "space-between" }}>
        <h1 className="tt-soft__title">Clienti Google Maps</h1>
        <form action={eseguiGiro}><button className="tt-btn tt-btn--secondary">Esegui il giro adesso</button></form>
      </div>
      {q.giro && <p role="status" className="tt-card tt-body">Giro fatto: {q.giro}</p>}

      <aside className="tt-dash__card">
        <span className="tt-tag" style={{ justifySelf: "start" }}>{collegato ? "Google collegato" : "Google non collegato"}</span>
        {collegato ? (
          <p style={{ marginTop: "var(--space-3)" }}>Le risposte e le novità escono da sole sulle schede collegate. <Link href="/api/google/oauth">Ricollega l&apos;account</Link></p>
        ) : configurato ? (
          <p style={{ marginTop: "var(--space-3)" }}>Collega l&apos;account Google che i clienti approvano come gestore. <Link href="/api/google/oauth">Collega Google →</Link></p>
        ) : (
          <p style={{ marginTop: "var(--space-3)" }}>Finché Google non è collegato, il sistema prepara risposte e novità e tu le pubblichi a mano (le trovi nella scheda di ogni cliente).</p>
        )}
        {q.google && q.google !== "ok" && <p style={{ marginTop: "var(--space-2)", color: "var(--danger)", fontWeight: 700 }}>Errore: {q.google}</p>}
      </aside>

      {righe.length === 0 ? <p className="tt-body tt-muted">Nessun cliente ancora. Arrivano da soli quando qualcuno paga dal sito, oppure aggiungili qui sotto.</p> : (
        <div className="tt-dash__card" style={{ overflowX: "auto" }}>
          <table className="tt-table">
            <thead><tr>{["Attività", "Scheda Google", "Da approvare (cliente)", "Da pubblicare a mano", "Novità in coda", "Stato"].map((h) => <th key={h}>{h}</th>)}</tr></thead>
            <tbody>{righe.map((r) => (
              <tr key={r.id}>
                <td><Link href={`/console/maps/${r.id}`}><strong>{r.attivita}</strong></Link>{r.citta && ` · ${r.citta}`}<br /><span className="tt-small tt-muted">{r.email}</span></td>
                <td>{r.google_location ? "Collegata" : <span className="tt-muted">Da collegare</span>}</td>
                <td>{r.da_approvare || "–"}</td>
                <td>{r.da_pubblicare ? <strong>{r.da_pubblicare}</strong> : "–"}{r.errori ? <><br /><span style={{ color: "var(--danger)" }}>{r.errori} errori</span></> : null}</td>
                <td>{r.in_coda || "–"}</td>
                <td>{r.stato}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}

      {ordini.length > 0 && (
        <section className="tt-soft__box">
          <h2 className="tt-soft__h2">Card e piedistalli comprati {ordini.some((o) => o.stato === "da-spedire") && <span className="tt-soft__badge">{ordini.filter((o) => o.stato === "da-spedire").length}</span>}</h2>
          {ordini.map((o) => (
            <div key={o.id} className="tt-soft__item">
              <p className="tt-soft__who">{o.tipo === "card" ? "Card" : "Piedistallo"} · {o.attivita || o.nome} <span className="tt-soft__pill">{o.stato === "spedito" ? "spedito" : "da spedire"}</span></p>
              <p className="tt-soft__muted" style={{ whiteSpace: "pre-line" }}>{o.indirizzo}{o.telefono ? `\n${o.telefono}` : ""}{o.email ? ` · ${o.email}` : ""}</p>
              {o.stato !== "spedito" && <form action={segnaOrdineSpedito.bind(null, o.id)}><button className="tt-btn tt-btn--secondary">Segna spedito</button></form>}
            </div>
          ))}
        </section>
      )}

      <form action={nuovoClienteMaps} className="tt-soft__box tt-form">
        <h2 className="tt-dash__h2">Nuovo cliente</h2>
        <p className="tt-dash__muted">Bastano questi tre dati: al resto pensa il sistema. Chi paga dal sito compare da solo.</p>
        {q.errore && <p role="alert" className="tt-alert">Errore: servono almeno nome dell&apos;attività ed email.</p>}
        {[["attivita", "Nome dell'attività", "text"], ["email", "Email del titolare", "email"], ["link_maps", "Link Google Maps (facoltativo)", "url"]].map(([k, l, tipo]) => (
          <div key={k} className="tt-field"><label htmlFor={`n-${k}`}>{l}</label><input id={`n-${k}`} name={k} type={tipo} /></div>
        ))}
        <button className="tt-btn">Crea cliente</button>
      </form>
    </div>
  );
}
