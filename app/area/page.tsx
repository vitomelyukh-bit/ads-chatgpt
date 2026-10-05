import QRCode from "qrcode";
import { approva, bloccaNovita, esciArea, salvaNovita, salvaSpunti, salvaValore } from "@/actions/area";
import { Copia } from "@/components/Copia";
import { Stars } from "@/components/ds/Stars";
import { requireCliente } from "@/lib/area-auth";
import { db } from "@/lib/db";
import { getClienteMaps, prossimaUscita, totaliDallInizio, type Novita, type Recensione } from "@/lib/maps";
import { linkWhatsApp } from "@/lib/scheda";
import { firmaRichiesta } from "@/lib/scheda-token";

export const dynamic = "force-dynamic";

type Dati = { visti: number; chiamate: number; indicazioni: number; sito: number };
type Evento = { quando: string; tipo: "risposta" | "novita" | "report"; titolo: string; testo: string; stelle?: number };

const giorno = (s: string | Date) => new Date(s).toLocaleDateString("it-IT", { timeZone: "Europe/Rome", day: "numeric", month: "long" });
const giornoOra = (s: string) => new Date(s).toLocaleString("it-IT", { timeZone: "Europe/Rome", weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });
const nomeMese = (m: string) => new Date(`${m}-15`).toLocaleDateString("it-IT", { month: "long" });
const n = (x: number) => x.toLocaleString("it-IT");
const contatti = (d: Dati) => d.chiamate + d.indicazioni + d.sito;

function Delta({ ora, prima }: { ora: number; prima?: number }) {
  if (prima === undefined || prima === null || prima === 0) return null;
  const p = Math.round(((ora - prima) / prima) * 100);
  return <span className={`x-delta ${p >= 0 ? "x-delta--su" : "x-delta--giu"}`}>{p >= 0 ? "▲" : "▼"} {Math.abs(p)}%</span>;
}

export default async function Area() {
  const id = await requireCliente();
  const c = await getClienteMaps(id);
  if (!c) return <div className="x-page"><p>Account non trovato. Scrivici su WhatsApp.</p></div>;

  const [daApprovare, risposte, novita, uscite, report, tot] = await Promise.all([
    db()`select * from maps_recensioni where cliente_id = ${id} and stato = 'da-approvare' order by creata_il` as unknown as Promise<Recensione[]>,
    db()`select * from maps_recensioni where cliente_id = ${id} and stato in ('pubblicata', 'da-pubblicare') and (risposta is not null) order by coalesce(pubblicata_il, creata_il) desc limit 12` as unknown as Promise<Recensione[]>,
    db()`select * from maps_novita where cliente_id = ${id} and stato in ('programmata', 'bloccata') order by pubblica_il limit 1` as unknown as Promise<Novita[]>,
    db()`select * from maps_novita where cliente_id = ${id} and stato in ('pubblicata', 'da-pubblicare') order by coalesce(pubblicata_il, pubblica_il) desc limit 12` as unknown as Promise<Novita[]>,
    db()`select mese, dati, inviato_il from maps_report where cliente_id = ${id} order by mese desc limit 6` as unknown as Promise<{ mese: string; dati: Dati; inviato_il: string | null }[]>,
    totaliDallInizio(c),
  ]);
  const [ric] = c.richiesta_id ? ((await db()`select link_recensioni, pagata from richieste_scheda where id = ${c.richiesta_id}`) as { link_recensioni: string | null; pagata: boolean }[]) : [];
  const linkRecensioni = c.link_recensioni || ric?.link_recensioni || c.link_maps;
  const qr = linkRecensioni ? await QRCode.toDataURL(linkRecensioni, { margin: 1, width: 320, color: { dark: "#16140f", light: "#ffffff" } }) : null;
  const messaggio = linkRecensioni ? `Ciao, grazie per essere passato da ${c.attivita}. Se ti sei trovato bene, ci aiuteresti con una recensione su Google? Ci vuole un minuto: ${linkRecensioni}` : "";
  const prossima = novita[0];
  const ultimo = report[0], precedente = report[1];
  const storico = [...report].reverse();
  const massimo = Math.max(1, ...storico.map((r) => contatti(r.dati)));
  const stima = ultimo && c.valore_cliente ? Math.round((contatti(ultimo.dati) / 4) * c.valore_cliente) : null;

  // Diario: tutto quello che abbiamo fatto, dal più recente.
  const diario: Evento[] = [
    ...risposte.map((r) => ({ quando: r.pubblicata_il ?? r.creata_il, tipo: "risposta" as const, titolo: `Risposta a ${r.autore || "un cliente"}`, testo: r.risposta ?? "", stelle: r.stelle })),
    ...uscite.map((u) => ({ quando: u.pubblicata_il ?? u.pubblica_il, tipo: "novita" as const, titolo: "Novità pubblicata", testo: u.testo })),
    ...report.filter((r) => r.inviato_il).map((r) => ({ quando: r.inviato_il!, tipo: "report" as const, titolo: `Resoconto di ${nomeMese(r.mese)}`, testo: `${n(contatti(r.dati))} contatti da Google: ${n(r.dati.chiamate)} chiamate, ${n(r.dati.indicazioni)} indicazioni, ${n(r.dati.sito)} clic sul sito.` })),
  ].sort((a, b) => +new Date(b.quando) - +new Date(a.quando)).slice(0, 12);

  // Percorso dei primi giorni: finché non c'è il primo resoconto.
  const oggi = new Date();
  const primoReport = new Date(Date.UTC(oggi.getUTCFullYear(), oggi.getUTCMonth() + 1, 2));
  const tappe = [
    { fatto: true, titolo: "Servizio attivo", sub: `dal ${giorno(c.creato_il)}` },
    { fatto: Boolean(c.google_location), titolo: "Colleghiamo la tua scheda Google", sub: c.google_location ? "fatto" : "ci pensiamo noi, ti scriviamo se serve qualcosa" },
    { fatto: tot.novita > 0, titolo: "Prima novità sulla tua scheda", sub: tot.novita > 0 ? "pubblicata" : prossima ? giornoOra(prossima.pubblica_il) : `mercoledì ${giorno(prossimaUscita())}` },
    { fatto: tot.risposte > 0, titolo: "Risposte alle recensioni", sub: tot.risposte > 0 ? `${tot.risposte} già pubblicate` : "appena arriva una recensione" },
    { fatto: Boolean(ultimo), titolo: "Primo resoconto con i tuoi numeri", sub: ultimo ? "arrivato" : `intorno al ${giorno(primoReport)}` },
  ];

  return (
    <div className="x-page">
      <div className="x-wrap">
        <section className="x-hero">
          <div className="x-hero__top">
            <p className="x-over">{c.attivita}{c.citta ? ` · ${c.citta}` : ""}</p>
            <span className="x-live"><span aria-hidden="true" /> Servizio attivo</span>
          </div>
          <h1 className="x-hero__title">Ciao{c.nome ? ` ${c.nome.split(" ")[0]}` : ""}, la tua scheda Google è <span className="x-hl">in buone mani.</span></h1>
          <p className="x-hero__lead">Ogni settimana pubblichiamo una novità, rispondiamo alle recensioni e ti mostriamo cosa ti porta Google. Tu pensi al lavoro.</p>
          {(tot.risposte > 0 || tot.novita > 0 || tot.recensioni > 0) && (
            <ul className="x-chips">
              {tot.risposte > 0 && <li><strong>{n(tot.risposte)}</strong> {tot.risposte === 1 ? "risposta pubblicata" : "risposte pubblicate"}</li>}
              {tot.novita > 0 && <li><strong>{n(tot.novita)}</strong> {tot.novita === 1 ? "novità pubblicata" : "novità pubblicate"}</li>}
              {tot.recensioni > 0 && <li><strong>{n(tot.recensioni)}</strong> {tot.recensioni === 1 ? "recensione nuova" : "recensioni nuove"}{tot.media ? ` · ${String(tot.media).replace(".", ",")} ★` : ""}</li>}
              {tot.tocchi > 0 && <li><strong>{n(tot.tocchi)}</strong> {tot.tocchi === 1 ? "tocco" : "tocchi"} sulla card</li>}
            </ul>
          )}
        </section>

        {daApprovare.length > 0 && (
          <section id="approva" className="x-card x-card--azione">
            <h2 className="x-h2">{daApprovare.length === 1 ? "Una risposta aspetta il tuo ok" : `${daApprovare.length} risposte aspettano il tuo ok`}</h2>
            <p className="x-muted">Le recensioni sotto le 4 stelle le facciamo vedere a te prima di rispondere. Correggi se vuoi, poi pubblica.</p>
            {daApprovare.map((r) => (
              <div key={r.id} id={`r${r.id}`} className="x-review">
                <p className="x-who">{r.autore || "Cliente"} <Stars voto={r.stelle} etichetta={`${r.stelle} stelle su 5`} /></p>
                <p className="x-quote">{r.testo || "Nessun testo, solo le stelle."}</p>
                <form action={approva.bind(null, r.id)} className="x-form">
                  <label htmlFor={`risp-${r.id}`}>La risposta che abbiamo preparato</label>
                  <textarea id={`risp-${r.id}`} name="risposta" rows={5} defaultValue={r.bozza ?? ""} required />
                  <button className="x-btn">Pubblica la risposta</button>
                </form>
              </div>
            ))}
          </section>
        )}

        {ultimo ? (
          <section className="x-card x-numeri">
            <div>
              <p className="x-over">A {nomeMese(ultimo.mese)} Google ti ha portato</p>
              <p className="x-big">{n(contatti(ultimo.dati))} <span>contatti</span> <Delta ora={contatti(ultimo.dati)} prima={precedente ? contatti(precedente.dati) : undefined} /></p>
              <p className="x-muted">{n(ultimo.dati.chiamate)} chiamate · {n(ultimo.dati.indicazioni)} indicazioni · {n(ultimo.dati.sito)} clic sul sito · {n(ultimo.dati.visti)} persone ti hanno visto</p>
              {stima !== null ? (
                <p className="x-money">Se anche solo 1 su 4 è diventato cliente: <strong>circa {n(stima)} €</strong></p>
              ) : (
                <form action={salvaValore} className="x-valore">
                  <label htmlFor="valore">Quanto ti fa guadagnare in media un cliente? Te lo trasformiamo in euro.</label>
                  <span><input id="valore" name="valore" inputMode="numeric" placeholder="50" /> €</span>
                  <button className="x-btn x-btn--small">Calcola</button>
                </form>
              )}
            </div>
            {storico.length > 1 && (
              <ol className="x-bars" aria-label="Contatti per mese">
                {storico.map((r) => <li key={r.mese}><span className="x-bars__v">{n(contatti(r.dati))}</span><span className="x-bars__b" style={{ height: `${Math.max(8, (contatti(r.dati) / massimo) * 100)}%` }} /><span className="x-bars__m">{nomeMese(r.mese).slice(0, 3)}</span></li>)}
              </ol>
            )}
          </section>
        ) : (
          <section className="x-card">
            <h2 className="x-h2">I primi passi</h2>
            <ol className="x-path">
              {tappe.map((t) => (
                <li key={t.titolo} className={t.fatto ? "is-ok" : undefined}>
                  <span className="x-path__dot" aria-hidden="true">{t.fatto ? "✓" : ""}</span>
                  <div><p className="x-path__t">{t.titolo}</p><p className="x-muted">{t.sub}</p></div>
                </li>
              ))}
            </ol>
          </section>
        )}

        <div className="x-cols">
          <section className="x-card">
            <h2 className="x-h2">Cosa abbiamo fatto per te</h2>
            {diario.length === 0 ? (
              <p className="x-muted">Qui comparirà, settimana dopo settimana, ogni cosa che facciamo per {c.attivita}: le risposte alle recensioni, le novità pubblicate e i resoconti.</p>
            ) : (
              <ol className="x-feed">
                {diario.map((e, i) => (
                  <li key={i}>
                    <span className={`x-feed__icon x-feed__icon--${e.tipo}`} aria-hidden="true">{e.tipo === "risposta" ? "★" : e.tipo === "novita" ? "✎" : "↗"}</span>
                    <div>
                      <p className="x-feed__t">{e.titolo} {e.stelle ? <Stars voto={e.stelle} etichetta={`${e.stelle} stelle su 5`} /> : null} <span className="x-muted">· {giorno(e.quando)}</span></p>
                      <p className="x-feed__x">{e.testo}</p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </section>

          <aside className="x-side">
            {prossima && (
              <section id="novita" className="x-card">
                <h2 className="x-h3">Prossima novità</h2>
                <p className="x-muted">{prossima.stato === "bloccata" ? "Bloccata: non verrà pubblicata." : `Esce ${giornoOra(prossima.pubblica_il)}. Se ti va bene, non fare niente.`}</p>
                <form action={salvaNovita.bind(null, prossima.id)} className="x-form">
                  <textarea aria-label="Testo della novità" name="testo" rows={6} defaultValue={prossima.testo} />
                  <div className="x-row">
                    <button className="x-btn x-btn--ghost">Salva</button>
                    <button formAction={bloccaNovita.bind(null, prossima.id, prossima.stato !== "bloccata")} className="x-btn x-btn--ghost">{prossima.stato === "bloccata" ? "Sblocca" : "Blocca"}</button>
                  </div>
                </form>
              </section>
            )}

            {linkRecensioni && (
              <section className="x-card">
                <h2 className="x-h3">Chiedi una recensione</h2>
                <p className="x-muted">Un messaggio pronto per chi è appena stato da te.</p>
                <a className="x-btn" href={`https://wa.me/?text=${encodeURIComponent(messaggio)}`} target="_blank" rel="noopener">Manda su WhatsApp</a>
                <Copia testo={messaggio} etichetta="Copia il messaggio" />
                {qr && (
                  <div className="x-qr">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={qr} alt="QR per lasciare una recensione" width={88} height={88} />
                    <p className="x-muted">Oppure stampa il QR per la cassa. <a href={qr} download={`qr-recensioni-${c.id}.png`}>Scarica</a></p>
                  </div>
                )}
              </section>
            )}

            <section className="x-card">
              <h2 className="x-h3">Hai una novità da raccontare?</h2>
              <form action={salvaSpunti} className="x-form">
                <textarea aria-label="La tua novità" name="spunti" rows={3} defaultValue={c.spunti} placeholder="Un nuovo trattamento, una promozione, una chiusura per ferie… scrivila come ti viene." />
                <button className="x-btn x-btn--ghost">Salva, la usiamo noi</button>
              </form>
            </section>
          </aside>
        </div>

        <footer className="x-foot">
          {ric?.pagata && c.richiesta_id && <a href={`/attiva/gestisci?t=${firmaRichiesta(c.richiesta_id)}`}>Abbonamento e fatture</a>}
          {linkWhatsApp() && <a href={linkWhatsApp()!} target="_blank" rel="noopener">Assistenza su WhatsApp</a>}
          <form action={esciArea}><button className="x-link">Esci</button></form>
        </footer>
      </div>
    </div>
  );
}
