import Link from "next/link";
import { notFound } from "next/navigation";
import { aggiornaNovita, generaNovita, mandaAccessoCliente, recensioneManuale, rispostaDaAdmin, salvaClienteMaps, salvaInfo, segnaRecensione } from "@/actions/maps-console";
import { Copia } from "@/components/Copia";
import { Stars } from "@/components/ds/Stars";
import { linkArea } from "@/lib/area-auth";
import { db } from "@/lib/db";
import { elencaSchede, googleCollegato, type SchedaGoogle } from "@/lib/gbp";
import { codiceCard, getClienteMaps, linkCard, totaliDallInizio, type Novita, type Recensione } from "@/lib/maps";

const data = (s: string | null) => (s ? new Date(s).toLocaleString("it-IT", { timeZone: "Europe/Rome", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "");
const STATI_R: Record<string, string> = { "da-approvare": "Aspetta il cliente", "da-pubblicare": "Da pubblicare", errore: "Errore", nuova: "In preparazione" };

export default async function ClienteMaps({ params }: PageProps<"/console/maps/[id]">) {
  const id = Number((await params).id);
  const c = await getClienteMaps(id);
  if (!c) notFound();
  const [daFare, novita, tot] = await Promise.all([
    db()`select * from maps_recensioni where cliente_id = ${id} and stato not in ('pubblicata', 'ignorata') order by creata_il desc limit 40` as unknown as Promise<Recensione[]>,
    db()`select * from maps_novita where cliente_id = ${id} and stato <> 'pubblicata' order by pubblica_il limit 3` as unknown as Promise<Novita[]>,
    totaliDallInizio(c),
  ]);
  const collegato = await googleCollegato();
  let schede: SchedaGoogle[] = [];
  let erroreSchede = "";
  if (collegato) schede = await elencaSchede().catch((e) => {
    const m = (e as Error).message;
    erroreSchede = /\b429\b|RESOURCE_EXHAUSTED/.test(m) ? "Google è collegato, ma l'accesso alle API è ancora in attesa di approvazione (limite a zero). Quando Google approva, qui compaiono le schede." : m;
    return [];
  });
  const card = linkCard(await codiceCard(c.id));

  const passi = [
    { fatto: Boolean(c.info.trim()), titolo: "Due righe sull'attività", corpo: (
      <form action={salvaInfo.bind(null, c.id)} className="tt-form">
        <textarea name="info" rows={3} defaultValue={c.info} aria-label="Cosa sapere sull'attività" placeholder="Es. Centro massaggi in zona Jonio: decontratturante, linfodrenante, Kobido. Si prenota online." />
        <button className="tt-btn">Salva</button>
      </form>
    ), aiuto: "L'AI usa solo queste informazioni per novità e risposte." },
    { fatto: Boolean(c.accesso_inviato_il), titolo: "Manda al cliente l'accesso alla sua area", corpo: (
      <div className="tt-actions">
        <form action={mandaAccessoCliente.bind(null, c.id)}><button className="tt-btn">Manda l&apos;email a {c.email}</button></form>
        <Copia testo={linkArea(c.id)} etichetta="Oppure copia il link" />
      </div>
    ), aiuto: "Gli arriva un'email con il link: niente password." },
    { fatto: Boolean(c.google_location), titolo: "Collega la sua scheda Google", corpo: (
      collegato ? (
        <form action={salvaClienteMaps.bind(null, c.id)} className="tt-form">
          {hiddenCampi(c)}
          <select name="scheda" aria-label="Scheda Google" defaultValue="">
            <option value="">Scegli la scheda…</option>
            {schede.map((s) => <option key={s.location} value={`${s.account}|${s.location}`}>{s.titolo}{s.indirizzo ? ` · ${s.indirizzo}` : ""}</option>)}
          </select>
          <button className="tt-btn">Collega</button>
        </form>
      ) : <p className="tt-soft__muted">Quando Google approva l&apos;accesso alle API la scegli da qui. Fino ad allora le risposte le pubblichi a mano.</p>
    ), aiuto: erroreSchede || "Se non la trovi, il cliente non ha ancora approvato la richiesta di accesso." },
  ];
  const daFareSetup = passi.filter((p) => !p.fatto).length;

  return (
    <div className="tt-soft__page">
      <header className="tt-soft__head">
        <div>
          <Link href="/console/maps" className="tt-soft__back">← Clienti</Link>
          <h1 className="tt-soft__title">{c.attivita}</h1>
          <p className="tt-soft__muted">{c.email}{c.google_location ? " · Google collegato" : ""}{c.stato !== "attivo" ? ` · ${c.stato}` : ""}</p>
        </div>
        <ul className="tt-soft__stats">
          <li><strong>{tot.risposte}</strong> risposte</li>
          <li><strong>{tot.novita}</strong> novità</li>
          <li><strong>{tot.recensioni}</strong> recensioni{tot.media ? ` · ${String(tot.media).replace(".", ",")}★` : ""}</li>
          <li><strong>{tot.tocchi}</strong> tocchi card</li>
        </ul>
      </header>

      {daFareSetup > 0 && (
        <section className="tt-soft__box">
          <h2 className="tt-soft__h2">Primi passi <span className="tt-soft__muted">· {passi.length - daFareSetup} di {passi.length}</span></h2>
          <ol className="tt-steps-soft">
            {passi.map((p) => (
              <li key={p.titolo} className={p.fatto ? "is-fatto" : undefined}>
                <span className="tt-steps-soft__dot" aria-hidden="true">{p.fatto ? "✓" : ""}</span>
                <div>
                  <p className="tt-steps-soft__t">{p.titolo}{p.fatto && <span className="tt-sr"> (fatto)</span>}</p>
                  {!p.fatto && <>{p.corpo}<p className="tt-soft__muted" style={{ marginTop: 8 }}>{p.aiuto}</p></>}
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {daFare.length === 0 && novita.length === 0 ? (
        <section className="tt-soft__box tt-soft__ok">
          <p><strong>Tutto in ordine.</strong> Il sistema lavora da solo: risponde alle recensioni e prepara la novità ogni lunedì.</p>
        </section>
      ) : (
        <>
          {daFare.length > 0 && (
            <section className="tt-soft__box">
              <h2 className="tt-soft__h2">Recensioni da gestire <span className="tt-soft__badge">{daFare.length}</span></h2>
              {daFare.map((r) => (
                <form key={r.id} action={rispostaDaAdmin.bind(null, c.id, r.id)} className="tt-soft__item tt-form">
                  <p className="tt-soft__who">{r.autore || "Cliente"} <Stars voto={r.stelle} etichetta={`${r.stelle} stelle su 5`} /> <span className="tt-soft__pill">{STATI_R[r.stato] ?? r.stato}</span></p>
                  {r.testo && <p>{r.testo}</p>}
                  {r.errore && <p className="tt-soft__err">Errore: {r.errore}</p>}
                  <textarea aria-label="Risposta" name="risposta" rows={3} defaultValue={r.risposta ?? r.bozza ?? ""} />
                  <div className="tt-actions">
                    <button className="tt-btn">{r.stato === "da-approvare" ? "Approva tu" : "Pubblica"}</button>
                    {(r.risposta || r.bozza) && <Copia testo={r.risposta ?? r.bozza ?? ""} />}
                    <button formAction={segnaRecensione.bind(null, c.id, r.id, "pubblicata")} className="tt-btn tt-btn--secondary">Già fatta</button>
                    <button formAction={segnaRecensione.bind(null, c.id, r.id, "ignorata")} className="tt-btn tt-btn--secondary">Ignora</button>
                  </div>
                </form>
              ))}
            </section>
          )}
          {novita.length > 0 && (
            <section className="tt-soft__box">
              <h2 className="tt-soft__h2">Novità in arrivo</h2>
              {novita.map((n) => (
                <form key={n.id} action={aggiornaNovita.bind(null, c.id, n.id)} className="tt-soft__item tt-form">
                  <p className="tt-soft__muted">{n.stato === "bloccata" ? "Bloccata" : n.stato === "da-pubblicare" ? "Da pubblicare a mano" : n.stato === "errore" ? "Errore" : `Esce ${data(n.pubblica_il)}`}</p>
                  <textarea aria-label="Testo della novità" name="testo" rows={4} defaultValue={n.testo} />
                  <div className="tt-actions">
                    <button name="azione" value="salva" className="tt-btn tt-btn--secondary">Salva</button>
                    <Copia testo={n.testo} />
                    {n.stato === "da-pubblicare" && <button name="azione" value="pubblicata" className="tt-btn tt-btn--secondary">Già pubblicata</button>}
                    {n.stato === "programmata" ? <button name="azione" value="blocca" className="tt-btn tt-btn--secondary">Blocca</button> : <button name="azione" value="programma" className="tt-btn tt-btn--secondary">Riprogramma</button>}
                  </div>
                </form>
              ))}
            </section>
          )}
        </>
      )}

      <details className="tt-soft__box tt-soft__more">
        <summary>Altro: card, recensione a mano, novità, impostazioni</summary>
        <div className="tt-soft__grid">
          <div>
            <h3 className="tt-soft__h3">Link per card e piedistallo</h3>
            <p className="tt-soft__code">{card.replace(/^https?:\/\//, "")}</p>
            <div className="tt-actions"><Copia testo={card} etichetta="Copia il link" /></div>
            <p className="tt-soft__muted">Scrivilo sulla card con l&apos;app NFC Tools: Scrivi → Aggiungi un record → URL.</p>
          </div>
          <div>
            <h3 className="tt-soft__h3">Recensione a mano</h3>
            <form action={recensioneManuale.bind(null, c.id)} className="tt-form">
              <input name="autore" placeholder="Nome" aria-label="Nome" />
              <select name="stelle" defaultValue="5" aria-label="Stelle">{[5, 4, 3, 2, 1].map((s) => <option key={s} value={s}>{s} stelle</option>)}</select>
              <textarea name="testo" rows={2} placeholder="Testo della recensione" aria-label="Testo" />
              <button className="tt-btn tt-btn--secondary">Prepara la risposta</button>
            </form>
          </div>
          <div>
            <h3 className="tt-soft__h3">Novità</h3>
            <form action={generaNovita.bind(null, c.id)}><button className="tt-btn tt-btn--secondary">Genera una novità adesso</button></form>
          </div>
        </div>
        <form action={salvaClienteMaps.bind(null, c.id)} className="tt-form tt-soft__settings">
          <h3 className="tt-soft__h3">Impostazioni</h3>
          <input type="hidden" name="scheda" value={c.google_account && c.google_location ? `${c.google_account}|${c.google_location}` : ""} />
          {([["attivita", "Nome dell'attività", c.attivita], ["email", "Email", c.email], ["nome", "Nome del titolare", c.nome], ["citta", "Città", c.citta], ["whatsapp", "WhatsApp", c.whatsapp], ["link_maps", "Link Google Maps", c.link_maps ?? ""], ["link_recensioni", "Link diretto per le recensioni", c.link_recensioni ?? ""], ["tono", "Tono", c.tono], ["firma", "Firma delle risposte", c.firma], ["valore_cliente", "Valore medio di un cliente (€)", c.valore_cliente ? String(c.valore_cliente) : ""], ["spunti", "Spunti per la prossima novità", c.spunti]] as const).map(([k, l, v]) => (
            <div key={k} className="tt-field"><label htmlFor={`s-${k}`}>{l}</label><input id={`s-${k}`} name={k} defaultValue={v} /></div>
          ))}
          <input type="hidden" name="info" value={c.info} />
          <div className="tt-field"><label htmlFor="s-stato">Stato</label><select id="s-stato" name="stato" defaultValue={c.stato}><option value="attivo">Attivo</option><option value="pausa">In pausa</option><option value="disdetto">Disdetto</option></select></div>
          <button className="tt-btn">Salva</button>
        </form>
      </details>
    </div>
  );
}

// Il form "Collega" riusa il salvataggio completo: rimanda tutti gli altri campi così come sono.
function hiddenCampi(c: NonNullable<Awaited<ReturnType<typeof getClienteMaps>>>) {
  const campi: Record<string, string> = {
    attivita: c.attivita, email: c.email, nome: c.nome, citta: c.citta, whatsapp: c.whatsapp, link_maps: c.link_maps ?? "", link_recensioni: c.link_recensioni ?? "",
    tono: c.tono, firma: c.firma, valore_cliente: c.valore_cliente ? String(c.valore_cliente) : "", spunti: c.spunti, info: c.info, stato: c.stato,
  };
  return Object.entries(campi).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />);
}
