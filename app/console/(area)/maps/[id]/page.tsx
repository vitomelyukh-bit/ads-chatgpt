import Link from "next/link";
import { notFound } from "next/navigation";
import { aggiornaNovita, generaNovita, mandaAccessoCliente, recensioneManuale, rispostaDaAdmin, salvaClienteMaps, segnaRecensione } from "@/actions/maps-console";
import { Copia } from "@/components/Copia";
import { Stars } from "@/components/ds/Stars";
import { linkArea } from "@/lib/area-auth";
import { db } from "@/lib/db";
import { elencaSchede, googleCollegato, type SchedaGoogle } from "@/lib/gbp";
import { codiceCard, getClienteMaps, linkCard, totaliDallInizio, type Novita, type Recensione } from "@/lib/maps";

const data = (s: string | null) => (s ? new Date(s).toLocaleString("it-IT", { timeZone: "Europe/Rome", dateStyle: "short", timeStyle: "short" }) : "");
const STATI_R: Record<string, string> = { "da-approvare": "Aspetta il cliente", "da-pubblicare": "Da pubblicare a mano", errore: "Errore", nuova: "In preparazione", pubblicata: "Pubblicata", ignorata: "Ignorata" };
const STATI_N: Record<string, string> = { programmata: "Programmata", bloccata: "Bloccata", pubblicata: "Pubblicata", "da-pubblicare": "Da pubblicare a mano", errore: "Errore" };

export default async function ClienteMaps({ params }: PageProps<"/console/maps/[id]">) {
  const id = Number((await params).id);
  const c = await getClienteMaps(id);
  if (!c) notFound();
  const [daFare, fatte, novita, tot] = await Promise.all([
    db()`select * from maps_recensioni where cliente_id = ${id} and stato not in ('pubblicata', 'ignorata') order by creata_il desc limit 40` as unknown as Promise<Recensione[]>,
    db()`select * from maps_recensioni where cliente_id = ${id} and stato in ('pubblicata', 'ignorata') order by coalesce(pubblicata_il, creata_il) desc limit 20` as unknown as Promise<Recensione[]>,
    db()`select * from maps_novita where cliente_id = ${id} order by pubblica_il desc limit 12` as unknown as Promise<Novita[]>,
    totaliDallInizio(c),
  ]);
  let schede: SchedaGoogle[] = [];
  let erroreSchede = "";
  if (await googleCollegato()) schede = await elencaSchede().catch((e) => { erroreSchede = (e as Error).message; return []; });
  const card = linkCard(await codiceCard(c.id));
  const attive = novita.filter((n) => n.stato !== "pubblicata");
  const uscite = novita.filter((n) => n.stato === "pubblicata");

  return (
    <div className="tt-dash__wrap" style={{ maxWidth: "none" }}>
      <header className="tt-dash__head">
        <div>
          <nav aria-label="Percorso" className="tt-crumbs"><ol><li><Link href="/console/maps">Google Maps</Link> / </li><li>{c.attivita}</li></ol></nav>
          <h1 className="tt-dash__title">{c.attivita}</h1>
          <p className="tt-dash__muted">{c.email}{c.google_location ? " · scheda Google collegata" : " · pubblicazione a mano"}{c.stato !== "attivo" ? ` · ${c.stato}` : ""}</p>
        </div>
        <div className="tt-actions">
          <form action={mandaAccessoCliente.bind(null, c.id)}><button className="tt-btn">Manda l&apos;accesso al cliente</button></form>
          <Copia testo={linkArea(c.id)} etichetta="Copia link area" />
          {c.link_maps && <a className="tt-btn tt-btn--secondary" href={c.link_maps} target="_blank" rel="noopener">Maps</a>}
        </div>
      </header>

      <ul className="tt-kpi tt-kpi--4">
        <li><span className="tt-kpi__n">{tot.risposte}</span><span className="tt-kpi__l">risposte pubblicate</span></li>
        <li><span className="tt-kpi__n">{tot.novita}</span><span className="tt-kpi__l">novità uscite</span></li>
        <li><span className="tt-kpi__n">{tot.recensioni}</span><span className="tt-kpi__l">recensioni{tot.media ? ` · ${String(tot.media).replace(".", ",")} ★` : ""}</span></li>
        <li><span className="tt-kpi__n">{tot.tocchi}</span><span className="tt-kpi__l">tocchi card</span></li>
      </ul>

      <div className="tt-dash__grid">
        <section className="tt-dash__card">
          <h2 className="tt-dash__h2">Recensioni da gestire {daFare.length > 0 && <span className="tt-delta tt-delta--giu">{daFare.length}</span>}</h2>
          {daFare.length === 0 && <p className="tt-dash__muted">Niente da fare: tutte le risposte sono uscite.</p>}
          {daFare.map((r) => (
            <form key={r.id} action={rispostaDaAdmin.bind(null, c.id, r.id)} className="tt-dash__review tt-form">
              <p className="tt-dash__who">{r.autore || "Cliente"} <Stars voto={r.stelle} etichetta={`${r.stelle} stelle su 5`} /> <span className="tt-tag">{STATI_R[r.stato] ?? r.stato}</span></p>
              {r.testo && <p>{r.testo}</p>}
              {r.errore && <p className="tt-small" style={{ color: "var(--danger)" }}>Errore: {r.errore}</p>}
              <textarea aria-label="Risposta" name="risposta" rows={4} defaultValue={r.risposta ?? r.bozza ?? ""} />
              <div className="tt-actions">
                <button className="tt-btn">{r.stato === "da-approvare" ? "Approva tu" : "Salva e pubblica"}</button>
                {(r.risposta || r.bozza) && <Copia testo={r.risposta ?? r.bozza ?? ""} />}
                <button formAction={segnaRecensione.bind(null, c.id, r.id, "pubblicata")} className="tt-chip">Fatta</button>
                <button formAction={segnaRecensione.bind(null, c.id, r.id, "ignorata")} className="tt-chip">Ignora</button>
              </div>
            </form>
          ))}
          <details className="tt-more">
            <summary className="tt-btn tt-btn--secondary">Aggiungi una recensione a mano</summary>
            <form action={recensioneManuale.bind(null, c.id)} className="tt-form" style={{ marginTop: "var(--space-4)" }}>
              <p className="tt-dash__muted">Finché Google non è collegato: incollala qui e l&apos;AI prepara la risposta.</p>
              <div className="tt-field"><label htmlFor="m-autore">Nome</label><input id="m-autore" name="autore" /></div>
              <div className="tt-field"><label htmlFor="m-stelle">Stelle</label><select id="m-stelle" name="stelle" defaultValue="5">{[5, 4, 3, 2, 1].map((s) => <option key={s} value={s}>{s}</option>)}</select></div>
              <div className="tt-field"><label htmlFor="m-testo">Testo</label><textarea id="m-testo" name="testo" rows={3} /></div>
              <button className="tt-btn">Prepara la risposta</button>
            </form>
          </details>
          {fatte.length > 0 && (
            <details className="tt-more"><summary className="tt-btn tt-btn--secondary">Risposte già uscite ({fatte.length})</summary>
              <ul className="tt-dash__list" style={{ marginTop: "var(--space-4)" }}>
                {fatte.map((r) => <li key={r.id}><p className="tt-dash__who">{r.autore || "Cliente"} <Stars voto={r.stelle} etichetta={`${r.stelle} stelle su 5`} /></p>{r.testo && <p>{r.testo}</p>}{r.risposta && <p className="tt-dash__reply">{r.risposta}</p>}</li>)}
              </ul>
            </details>
          )}
        </section>

        <div className="tt-dash__wrap" style={{ gap: "var(--space-6)", alignContent: "start" }}>
          <section className="tt-dash__card">
            <div className="tt-row" style={{ justifyContent: "space-between" }}>
              <h2 className="tt-dash__h2">Novità</h2>
              <form action={generaNovita.bind(null, c.id)}><button className="tt-chip">Genera adesso</button></form>
            </div>
            {attive.length === 0 && <p className="tt-dash__muted">Il lunedì il sistema prepara quella della settimana.</p>}
            {attive.map((n) => (
              <form key={n.id} action={aggiornaNovita.bind(null, c.id, n.id)} className="tt-form">
                <p className="tt-dash__muted"><span className="tt-tag">{STATI_N[n.stato] ?? n.stato}</span> uscita {data(n.pubblica_il)}</p>
                {n.errore && <p className="tt-small" style={{ color: "var(--danger)" }}>Errore: {n.errore}</p>}
                <textarea aria-label="Testo della novità" name="testo" rows={5} defaultValue={n.testo} />
                <div className="tt-actions">
                  <button name="azione" value="salva" className="tt-chip">Salva</button>
                  <Copia testo={n.testo} />
                  <button name="azione" value="pubblicata" className="tt-chip">Fatta</button>
                  {n.stato === "programmata" ? <button name="azione" value="blocca" className="tt-chip">Blocca</button> : <button name="azione" value="programma" className="tt-chip">Riprogramma</button>}
                  <button name="azione" value="elimina" className="tt-chip">Elimina</button>
                </div>
              </form>
            ))}
            {uscite.length > 0 && <p className="tt-dash__muted">{uscite.length} uscite, l&apos;ultima il {data(uscite[0].pubblicata_il)}.</p>}
          </section>

          <section className="tt-dash__card">
            <h2 className="tt-dash__h2">Card e piedistallo</h2>
            <p className="tt-dash__msg" style={{ wordBreak: "break-all", fontWeight: 700 }}>{card.replace(/^https?:\/\//, "")}</p>
            <div className="tt-actions"><Copia testo={card} etichetta="Copia il link" /><a className="tt-chip" href={card} target="_blank" rel="noopener" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}>Prova</a></div>
            <p className="tt-dash__muted">Con l&apos;app NFC Tools: Scrivi → Aggiungi un record → URL → incolla → Scrivi, e avvicina la card.</p>
          </section>
        </div>
      </div>

      <details className="tt-dash__card">
        <summary className="tt-dash__h2" style={{ cursor: "pointer" }}>Impostazioni (facoltative)</summary>
        <form action={salvaClienteMaps.bind(null, c.id)} className="tt-form" style={{ marginTop: "var(--space-4)" }}>
          <div className="tt-field"><label htmlFor="s-info">Cosa sapere sull&apos;attività</label><textarea id="s-info" name="info" rows={4} defaultValue={c.info} placeholder="Servizi, prodotti, punti forti, orari. Due righe bastano: l'AI usa solo questo." /></div>
          <div className="tt-field"><label htmlFor="s-tono">Tono</label><input id="s-tono" name="tono" defaultValue={c.tono} /></div>
          <div className="tt-field">
            <label htmlFor="s-scheda">Scheda Google</label>
            <select id="s-scheda" name="scheda" defaultValue={c.google_account && c.google_location ? `${c.google_account}|${c.google_location}` : ""}>
              <option value="">Nessuna (pubblicazione a mano)</option>
              {c.google_account && c.google_location && !schede.some((s) => s.location === c.google_location) && <option value={`${c.google_account}|${c.google_location}`}>{c.google_location}</option>}
              {schede.map((s) => <option key={s.location} value={`${s.account}|${s.location}`}>{s.titolo}{s.indirizzo ? ` · ${s.indirizzo}` : ""}</option>)}
            </select>
            <p className="tt-field__help">{erroreSchede ? `Errore: ${erroreSchede}` : schede.length ? "Se manca, il cliente non ha ancora approvato l'accesso." : "Compaiono quando Google è collegato."}</p>
          </div>
          {([["attivita", "Nome dell'attività", c.attivita], ["email", "Email", c.email], ["nome", "Nome del titolare", c.nome], ["citta", "Città", c.citta], ["whatsapp", "WhatsApp", c.whatsapp], ["link_maps", "Link Google Maps", c.link_maps ?? ""], ["link_recensioni", "Link diretto per le recensioni", c.link_recensioni ?? ""], ["firma", "Firma delle risposte", c.firma], ["valore_cliente", "Valore medio di un cliente (€)", c.valore_cliente ? String(c.valore_cliente) : ""], ["spunti", "Spunti per la prossima novità", c.spunti]] as const).map(([k, l, v]) => (
            <div key={k} className="tt-field"><label htmlFor={`s-${k}`}>{l}</label><input id={`s-${k}`} name={k} defaultValue={v} /></div>
          ))}
          <div className="tt-field"><label htmlFor="s-stato">Stato</label><select id="s-stato" name="stato" defaultValue={c.stato}><option value="attivo">Attivo</option><option value="pausa">In pausa</option><option value="disdetto">Disdetto</option></select></div>
          <button className="tt-btn">Salva</button>
        </form>
      </details>
    </div>
  );
}
