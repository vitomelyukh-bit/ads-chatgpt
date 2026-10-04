import Link from "next/link";
import { notFound } from "next/navigation";
import { eliminaCliente, nuovaLanding, statoCreativita, statoRichiesta } from "@/actions/console";
import { ClienteForm } from "@/components/console/ClienteForm";
import { Uploader } from "@/components/console/Uploader";
import { getCliente, type Creativita, type Landing, type Richiesta } from "@/lib/clienti";
import { db } from "@/lib/db";

const STATI = ["nuova", "contattata", "appuntamento", "cliente", "non interessata"];
const data = (s: string) => new Date(s).toLocaleString("it-IT", { timeZone: "Europe/Rome", dateStyle: "short", timeStyle: "short" });

export default async function ClientePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = await getCliente(id);
  if (!c) notFound();
  const landing = (await db()`select * from landing where cliente_id=${id} order by creata_il`) as Landing[];
  const creativita = (await db()`select * from creativita where cliente_id=${id} order by creata_il desc`) as Creativita[];
  const richieste = (await db()`select * from richieste where cliente_id=${id} order by creata_il desc limit 200`) as Richiesta[];
  const titoli = new Map(landing.map((l) => [l.id, l.titolo]));

  return (
    <div className="tt-stack-8">
      <nav aria-label="Percorso" className="tt-crumbs"><ol><li><Link href="/console">Clienti</Link> / </li><li>{c.nome}</li></ol></nav>
      <h1 className="tt-display-lg">{c.nome}</h1>
      {!c.privacy_url && (
        <aside className="tt-callout"><span className="tt-tag">Importante</span><p style={{ marginTop: "var(--space-3)" }}>Manca il link all&apos;informativa privacy del cliente: le landing non si possono pubblicare. Aggiungilo nei dati qui sotto.</p></aside>
      )}

      <section className="tt-stack-6" style={{ paddingTop: "var(--space-8)" }}>
        <h2 className="tt-heading">Landing</h2>
        {landing.length > 0 && (
          <ul className="tt-links">
            {landing.map((l) => (
              <li key={l.id}>
                <Link href={`/console/clienti/${id}/landing/${l.id}`} className="tt-link">
                  <span>{l.titolo}<small>{l.pubblicata ? `Online · titrovano.it/l/${c.slug}/${l.slug}` : "Bozza"}</small></span>
                </Link>
              </li>
            ))}
          </ul>
        )}
        <form action={nuovaLanding.bind(null, id)} className="tt-row">
          <div className="tt-field" style={{ flex: 1, maxWidth: 520 }}>
            <label htmlFor="nl">Titolo della nuova landing</label>
            <input id="nl" name="titolo" required placeholder="Es. Separazioni consensuali a Milano" />
          </div>
          <button className="tt-btn tt-btn--secondary" style={{ alignSelf: "end" }}>Crea landing</button>
        </form>
      </section>

      <section className="tt-stack-6" style={{ paddingTop: "var(--space-8)" }}>
        <div className="tt-row" style={{ justifyContent: "space-between" }}>
          <h2 className="tt-heading">Richieste ({richieste.length})</h2>
          {richieste.length > 0 && <a href={`/api/console/richieste/${id}`}>Scarica in Excel (CSV) →</a>}
        </div>
        {richieste.length === 0 ? <p className="tt-body tt-muted">Nessuna richiesta ancora.</p> : (
          <div style={{ overflowX: "auto" }}>
            <table className="tt-table">
              <thead><tr>{["Data", "Persona", "Pagina", "Provenienza", "Stato"].map((h) => <th key={h}>{h}</th>)}</tr></thead>
              <tbody>
                {richieste.map((r) => (
                  <tr key={r.id}>
                    <td>{data(r.creata_il)}</td>
                    <td><strong>{r.nome}</strong><br /><a href={`tel:${r.telefono}`}>{r.telefono}</a>{r.email && <><br />{r.email}</>}{r.messaggio && <><br /><span className="tt-muted">{r.messaggio}</span></>}</td>
                    <td>{r.landing_id ? titoli.get(r.landing_id) : "—"}</td>
                    <td>{Object.entries(r.utm).map(([k, v]) => `${k.replace("utm_", "")}: ${v}`).join(", ") || "—"}</td>
                    <td><form className="tt-chips">{STATI.map((s) => <button key={s} aria-pressed={r.stato === s} formAction={statoRichiesta.bind(null, id, r.id, s)} className="tt-chip">{s}</button>)}</form></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="tt-stack-6" style={{ paddingTop: "var(--space-8)" }}>
        <h2 className="tt-heading">Creatività</h2>
        <p className="tt-body tt-muted">Video e immagini per annunci e landing. Nelle landing si usano solo quelle approvate.</p>
        <Uploader clienteId={id} />
        <ul className="tt-grid-3" style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {creativita.map((k) => (
            <li key={k.id} className="tt-card tt-stack-2" style={{ padding: "var(--space-4)" }}>
              {k.tipo === "video" ? <video src={k.url} controls preload="metadata" className="tt-media" /> : <img src={k.url} alt="" className="tt-media" />}
              <p className="tt-small"><strong>{k.titolo}</strong></p>
              <form className="tt-chips">
                {(["da_approvare", "approvata", "scartata"] as const).map((s) => (
                  <button key={s} aria-pressed={k.stato === s} formAction={statoCreativita.bind(null, id, k.id, s)} className="tt-chip">{s.replace("_", " ")}</button>
                ))}
              </form>
              <a href={k.url} target="_blank" rel="noopener" className="tt-small">Apri il file →</a>
            </li>
          ))}
        </ul>
      </section>

      <section className="tt-stack-6" style={{ paddingTop: "var(--space-8)" }}>
        <h2 className="tt-heading">Dati del cliente</h2>
        <ClienteForm cliente={c} />
        <form action={eliminaCliente.bind(null, id)}><button className="tt-chip" style={{ color: "var(--danger)", borderColor: "var(--danger)" }}>Elimina cliente e tutti i suoi dati</button></form>
      </section>
    </div>
  );
}
