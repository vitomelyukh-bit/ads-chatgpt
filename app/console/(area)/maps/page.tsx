import Link from "next/link";
import { eseguiGiro, nuovoClienteMaps } from "@/actions/maps-console";
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
  const configurato = googleConfigurato();
  const collegato = await googleCollegato();

  return (
    <div className="tt-dash__wrap" style={{ maxWidth: "none" }}>
      <div className="tt-row" style={{ justifyContent: "space-between" }}>
        <h1 className="tt-dash__title">Google Maps: clienti</h1>
        <form action={eseguiGiro}><button className="tt-btn tt-btn--secondary">Esegui il giro adesso</button></form>
      </div>
      {q.giro && <p role="status" className="tt-card tt-body">Giro fatto: {q.giro}</p>}

      <aside className="tt-dash__card">
        <span className="tt-tag">{collegato ? "Google collegato" : "Google non collegato"}</span>
        {collegato ? (
          <p style={{ marginTop: "var(--space-3)" }}>Le risposte e le novità escono da sole sulle schede collegate. <Link href="/api/google/oauth">Ricollega l&apos;account</Link></p>
        ) : configurato ? (
          <p style={{ marginTop: "var(--space-3)" }}>Collega l&apos;account Google che i clienti approvano come gestore. <Link href="/api/google/oauth">Collega Google →</Link></p>
        ) : (
          <p style={{ marginTop: "var(--space-3)" }}>Mancano le credenziali OAuth di Google (GOOGLE_OAUTH_CLIENT_ID e GOOGLE_OAUTH_CLIENT_SECRET). Finché manca, il sistema prepara risposte e novità e le trovi qui &ldquo;da pubblicare&rdquo; a mano.</p>
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

      <form action={nuovoClienteMaps} className="tt-dash__card tt-form" style={{ maxWidth: 560 }}>
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
