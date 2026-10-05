import Link from "next/link";
import { notFound } from "next/navigation";
import { aggiornaNovita, generaNovita, mandaAccessoCliente, recensioneManuale, rispostaDaAdmin, salvaClienteMaps, segnaRecensione } from "@/actions/maps-console";
import { Copia } from "@/components/Copia";
import { Stars } from "@/components/ds/Stars";
import { linkArea } from "@/lib/area-auth";
import { db } from "@/lib/db";
import { elencaSchede, googleCollegato, type SchedaGoogle } from "@/lib/gbp";
import { codiceCard, getClienteMaps, linkCard, type Novita, type Recensione } from "@/lib/maps";

const data = (s: string | null) => (s ? new Date(s).toLocaleString("it-IT", { timeZone: "Europe/Rome", dateStyle: "short", timeStyle: "short" }) : "");
const STATI_N: Record<string, string> = { programmata: "Programmata", bloccata: "Bloccata", pubblicata: "Pubblicata", "da-pubblicare": "Da pubblicare a mano", errore: "Errore" };

export default async function ClienteMaps({ params }: PageProps<"/console/maps/[id]">) {
  const id = Number((await params).id);
  const c = await getClienteMaps(id);
  if (!c) notFound();
  const recensioni = (await db()`select * from maps_recensioni where cliente_id = ${id} order by (stato in ('da-pubblicare','errore','da-approvare')) desc, coalesce(scritta_il, creata_il) desc limit 60`) as Recensione[];
  const novita = (await db()`select * from maps_novita where cliente_id = ${id} order by pubblica_il desc limit 20`) as Novita[];
  const report = (await db()`select mese, dati, inviato_il from maps_report where cliente_id = ${id} order by mese desc limit 6`) as { mese: string; dati: Record<string, number>; inviato_il: string | null }[];
  let schede: SchedaGoogle[] = [];
  let erroreSchede = "";
  if (await googleCollegato()) schede = await elencaSchede().catch((e) => { erroreSchede = (e as Error).message; return []; });
  const link = linkArea(c.id);
  const card = linkCard(await codiceCard(c.id));
  const [tocchi] = (await db()`select coalesce(sum(n.tocchi), 0)::int as tutti,
      (select count(*) from nfc_tocchi t join nfc_codici k on k.codice = t.codice where k.cliente_id = ${id} and t.quando >= date_trunc('month', now()))::int as mese
    from nfc_codici n where n.cliente_id = ${id}`) as { tutti: number; mese: number }[];

  return (
    <div className="tt-stack-12">
      <div className="tt-stack-2">
        <nav aria-label="Percorso" className="tt-crumbs"><ol><li><Link href="/console/maps">Google Maps</Link> / </li><li>{c.attivita}</li></ol></nav>
        <h1 className="tt-display-lg">{c.attivita}</h1>
        <div className="tt-actions">
          <form action={mandaAccessoCliente.bind(null, c.id)}><button className="tt-btn">Manda al cliente l&apos;accesso all&apos;area</button></form>
          <Copia testo={link} etichetta="Copia il link dell'area (14 giorni)" />
          {c.link_maps && <a className="tt-btn tt-btn--secondary" href={c.link_maps} target="_blank" rel="noopener">Apri su Maps</a>}
        </div>
      </div>

      <section className="tt-stack-6">
        <h2 className="tt-heading">Card e piedistallo</h2>
        <div className="tt-card tt-stack-4">
          <p className="tt-body" style={{ margin: 0 }}>Il link di {c.attivita} per card e piedistallo (sempre lo stesso, vale per tutti i pezzi):</p>
          <p className="tt-heading" style={{ margin: 0, fontSize: 24, wordBreak: "break-all" }}>{card.replace(/^https?:\/\//, "")}</p>
          <div className="tt-actions"><Copia testo={card} etichetta="Copia il link" /><a className="tt-btn tt-btn--secondary" href={card} target="_blank" rel="noopener">Prova il link</a></div>
          <ol className="tt-body" style={{ margin: 0, paddingLeft: "var(--space-6)" }}>
            <li>Apri l&apos;app gratuita NFC Tools sul telefono.</li>
            <li>Scrivi → Aggiungi un record → URL, e incolla il link.</li>
            <li>Tocca Scrivi e avvicina la card o il piedistallo. Fatto.</li>
          </ol>
          <p className="tt-body" style={{ margin: 0 }}><strong>{tocchi.mese}</strong> {tocchi.mese === 1 ? "tocco" : "tocchi"} questo mese · {tocchi.tutti} in tutto</p>
          <p className="tt-small tt-muted" style={{ margin: 0 }}>Il link porta al &ldquo;link diretto per le recensioni&rdquo; (impostazioni sotto) o alla scheda Maps. Un tocco conta chi ha aperto la pagina, non chi ha scritto la recensione.</p>
        </div>
      </section>

      <section className="tt-stack-6">
        <h2 className="tt-heading">Recensioni</h2>
        <form action={recensioneManuale.bind(null, c.id)} className="tt-card tt-form">
          <p className="tt-body tt-muted" style={{ margin: 0 }}>Finché Google non è collegato, incolla qui le recensioni nuove: l&apos;AI scrive la risposta, da 4 stelle è pronta subito, sotto la mandiamo al cliente per l&apos;ok.</p>
          <div className="tt-field"><label htmlFor="m-autore">Nome di chi l&apos;ha scritta</label><input id="m-autore" name="autore" /></div>
          <div className="tt-field"><label htmlFor="m-stelle">Stelle</label><select id="m-stelle" name="stelle" defaultValue="5">{[5, 4, 3, 2, 1].map((s) => <option key={s} value={s}>{s}</option>)}</select></div>
          <div className="tt-field"><label htmlFor="m-testo">Testo</label><textarea id="m-testo" name="testo" rows={3} /></div>
          <button className="tt-btn tt-btn--secondary">Aggiungi e prepara la risposta</button>
        </form>
        {recensioni.map((r) => (
          <div key={r.id} className="tt-review" style={{ maxWidth: "none" }}>
            <div className="tt-review__box">
              <p className="tt-review__who">{r.autore || "Cliente"} <Stars voto={r.stelle} etichetta={`${r.stelle} stelle su 5`} /> <span className="tt-tag">{r.stato}</span> <span className="tt-small tt-muted" style={{ fontWeight: 400 }}>{data(r.scritta_il ?? r.creata_il)}</span></p>
              {r.testo && <p>{r.testo}</p>}
              {r.errore && <p className="tt-small" style={{ color: "var(--danger)" }}>Errore: {r.errore}</p>}
            </div>
            {r.stato === "pubblicata" || r.stato === "ignorata" ? (
              r.risposta && <div className="tt-review__box tt-review__box--reply"><p className="tt-review__who">Risposta</p><p>{r.risposta}</p></div>
            ) : (
              <form action={rispostaDaAdmin.bind(null, c.id, r.id)} className="tt-review__box tt-review__box--reply tt-form">
                <div className="tt-field"><label htmlFor={`a-${r.id}`}>{r.stato === "da-pubblicare" ? "Pronta: pubblicala su Google e segnala come fatta" : "Risposta"}</label><textarea id={`a-${r.id}`} name="risposta" rows={4} defaultValue={r.risposta ?? r.bozza ?? ""} /></div>
                <div className="tt-actions">
                  <button className="tt-btn">{r.stato === "da-approvare" ? "Approva al posto del cliente" : "Salva e pubblica"}</button>
                  {(r.risposta || r.bozza) && <Copia testo={r.risposta ?? r.bozza ?? ""} />}
                  <button formAction={segnaRecensione.bind(null, c.id, r.id, "pubblicata")} className="tt-chip">Segna pubblicata</button>
                  <button formAction={segnaRecensione.bind(null, c.id, r.id, "ignorata")} className="tt-chip">Ignora</button>
                </div>
              </form>
            )}
          </div>
        ))}
      </section>

      <section className="tt-stack-6">
        <div className="tt-row" style={{ justifyContent: "space-between" }}>
          <h2 className="tt-heading">Novità</h2>
          <form action={generaNovita.bind(null, c.id)}><button className="tt-btn tt-btn--secondary">Genera una novità adesso</button></form>
        </div>
        {novita.length === 0 && <p className="tt-body tt-muted">Ancora nessuna. Il lunedì il sistema prepara quella della settimana.</p>}
        {novita.map((n) => (
          <form key={n.id} action={aggiornaNovita.bind(null, c.id, n.id)} className="tt-card tt-form">
            <p className="tt-body" style={{ margin: 0 }}><span className="tt-tag">{STATI_N[n.stato] ?? n.stato}</span> {n.stato === "pubblicata" ? `il ${data(n.pubblicata_il)}` : `uscita ${data(n.pubblica_il)}`}</p>
            {n.errore && <p className="tt-small" style={{ color: "var(--danger)" }}>Errore: {n.errore}</p>}
            <div className="tt-field"><label htmlFor={`n-${n.id}`}>Testo</label><textarea id={`n-${n.id}`} name="testo" rows={4} defaultValue={n.testo} /></div>
            <div className="tt-actions">
              <button name="azione" value="salva" className="tt-btn tt-btn--secondary">Salva</button>
              <Copia testo={n.testo} />
              {n.stato !== "pubblicata" && <button name="azione" value="pubblicata" className="tt-chip">Segna pubblicata</button>}
              {n.stato === "programmata" && <button name="azione" value="blocca" className="tt-chip">Blocca</button>}
              {(n.stato === "bloccata" || n.stato === "errore") && <button name="azione" value="programma" className="tt-chip">Riprogramma</button>}
              <button name="azione" value="elimina" className="tt-chip">Elimina</button>
            </div>
          </form>
        ))}
      </section>

      {report.length > 0 && (
        <section className="tt-stack-6">
          <h2 className="tt-heading">Report inviati</h2>
          <table className="tt-table"><thead><tr>{["Mese", "Visti", "Chiamate", "Indicazioni", "Sito", "Inviato"].map((h) => <th key={h}>{h}</th>)}</tr></thead>
            <tbody>{report.map((r) => <tr key={r.mese}><td>{r.mese}</td><td>{r.dati.visti}</td><td>{r.dati.chiamate}</td><td>{r.dati.indicazioni}</td><td>{r.dati.sito}</td><td>{data(r.inviato_il)}</td></tr>)}</tbody>
          </table>
        </section>
      )}

      <section className="tt-stack-6">
        <h2 className="tt-heading">Impostazioni</h2>
        <form action={salvaClienteMaps.bind(null, c.id)} className="tt-card tt-form">
          <div className="tt-field">
            <label htmlFor="s-scheda">Scheda Google collegata</label>
            <select id="s-scheda" name="scheda" defaultValue={c.google_account && c.google_location ? `${c.google_account}|${c.google_location}` : ""}>
              <option value="">Nessuna (pubblicazione a mano)</option>
              {c.google_account && c.google_location && !schede.some((s) => s.location === c.google_location) && <option value={`${c.google_account}|${c.google_location}`}>{c.google_location}</option>}
              {schede.map((s) => <option key={s.location} value={`${s.account}|${s.location}`}>{s.titolo}{s.indirizzo ? ` · ${s.indirizzo}` : ""}</option>)}
            </select>
            <p className="tt-field__help">{erroreSchede ? `Errore: ${erroreSchede}` : schede.length ? "Le schede che l'account Google di TiTrovano gestisce. Se manca, il cliente non ha ancora approvato l'accesso." : "Compaiono qui quando Google è collegato."}</p>
          </div>
          {([["attivita", "Nome dell'attività", c.attivita], ["citta", "Città", c.citta], ["nome", "Nome del titolare", c.nome], ["email", "Email (accesso all'area e notifiche)", c.email], ["whatsapp", "WhatsApp", c.whatsapp], ["link_maps", "Link Google Maps", c.link_maps ?? ""], ["link_recensioni", "Link diretto per lasciare una recensione (facoltativo)", c.link_recensioni ?? ""], ["firma", "Firma in fondo alle risposte (facoltativa)", c.firma]] as const).map(([k, l, v]) => (
            <div key={k} className="tt-field"><label htmlFor={`s-${k}`}>{l}</label><input id={`s-${k}`} name={k} defaultValue={v} /></div>
          ))}
          <div className="tt-field"><label htmlFor="s-tono">Tono</label><input id="s-tono" name="tono" defaultValue={c.tono} /><p className="tt-field__help">Es. &ldquo;cordiale e familiare, dando del tu&rdquo; oppure &ldquo;professionale, dando del lei&rdquo;.</p></div>
          <div className="tt-field"><label htmlFor="s-info">Informazioni vere sull&apos;attività</label><textarea id="s-info" name="info" rows={6} defaultValue={c.info} /><p className="tt-field__help">Servizi, prodotti, punti forti, orari, cose da sapere. L&apos;AI usa solo questo: più è ricco, migliori sono novità e risposte.</p></div>
          <div className="tt-field"><label htmlFor="s-spunti">Spunti per la prossima novità</label><textarea id="s-spunti" name="spunti" rows={3} defaultValue={c.spunti} /></div>
          <div className="tt-field"><label htmlFor="s-stato">Stato</label><select id="s-stato" name="stato" defaultValue={c.stato}><option value="attivo">Attivo</option><option value="pausa">In pausa</option><option value="disdetto">Disdetto</option></select></div>
          <button className="tt-btn">Salva</button>
        </form>
      </section>
    </div>
  );
}
