import QRCode from "qrcode";
import { approva, bloccaNovita, esciArea, salvaNovita, salvaSpunti, salvaValore } from "@/actions/area";
import { Copia } from "@/components/Copia";
import { Stars } from "@/components/ds/Stars";
import { requireCliente } from "@/lib/area-auth";
import { db } from "@/lib/db";
import { getClienteMaps, totaliDallInizio, type Novita, type Recensione } from "@/lib/maps";
import { firmaRichiesta } from "@/lib/scheda-token";

export const dynamic = "force-dynamic";

type Dati = { visti: number; chiamate: number; indicazioni: number; sito: number; tocchi?: number };
const STATO: Record<string, string> = {
  pubblicata: "Risposta pubblicata", "da-pubblicare": "Risposta pronta, in pubblicazione", "da-approvare": "Aspetta il tuo ok",
  nuova: "Stiamo preparando la risposta", errore: "Stiamo pubblicando la risposta", ignorata: "Senza risposta",
};
const data = (s: string | null) => (s ? new Date(s).toLocaleDateString("it-IT", { timeZone: "Europe/Rome", day: "numeric", month: "long" }) : "");
const quando = (s: string) => new Date(s).toLocaleString("it-IT", { timeZone: "Europe/Rome", weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });
const nomeMese = (m: string, conAnno = false) => new Date(`${m}-15`).toLocaleDateString("it-IT", { month: "long", ...(conAnno ? { year: "numeric" } : {}) });
const n = (x: number) => x.toLocaleString("it-IT");
const contatti = (d: Dati) => d.chiamate + d.indicazioni + d.sito;

function Delta({ ora, prima }: { ora: number; prima?: number }) {
  if (prima === undefined || prima === null) return null;
  if (prima === 0) return ora > 0 ? <span className="tt-delta tt-delta--su">nuovo</span> : null;
  const p = Math.round(((ora - prima) / prima) * 100);
  return <span className={`tt-delta ${p >= 0 ? "tt-delta--su" : "tt-delta--giu"}`}>{p >= 0 ? "▲" : "▼"} {Math.abs(p)}%</span>;
}

export default async function Area() {
  const id = await requireCliente();
  const c = await getClienteMaps(id);
  if (!c) return <div className="tt-wrap tt-wrap--read tt-page-head"><p className="tt-lead">Account non trovato. Scrivici su WhatsApp.</p></div>;

  const [daApprovare, ultime, novita, uscite, report, tot] = await Promise.all([
    db()`select * from maps_recensioni where cliente_id = ${id} and stato = 'da-approvare' order by creata_il` as unknown as Promise<Recensione[]>,
    db()`select * from maps_recensioni where cliente_id = ${id} and stato <> 'da-approvare' order by coalesce(scritta_il, creata_il) desc limit 6` as unknown as Promise<Recensione[]>,
    db()`select * from maps_novita where cliente_id = ${id} and stato in ('programmata', 'bloccata') order by pubblica_il limit 1` as unknown as Promise<Novita[]>,
    db()`select * from maps_novita where cliente_id = ${id} and stato in ('pubblicata', 'da-pubblicare') order by coalesce(pubblicata_il, pubblica_il) desc limit 3` as unknown as Promise<Novita[]>,
    db()`select mese, dati from maps_report where cliente_id = ${id} order by mese desc limit 6` as unknown as Promise<{ mese: string; dati: Dati }[]>,
    totaliDallInizio(c),
  ]);
  const [ric] = c.richiesta_id ? ((await db()`select link_recensioni, pagata from richieste_scheda where id = ${c.richiesta_id}`) as { link_recensioni: string | null; pagata: boolean }[]) : [];
  const linkRecensioni = c.link_recensioni || ric?.link_recensioni || c.link_maps;
  const qr = linkRecensioni ? await QRCode.toDataURL(linkRecensioni, { margin: 1, width: 360, color: { dark: "#16140f", light: "#ffffff" } }) : null;
  const messaggio = linkRecensioni ? `Ciao, grazie per essere passato da ${c.attivita}. Se ti sei trovato bene, ci aiuteresti con una recensione su Google? Ci vuole un minuto: ${linkRecensioni}` : "";
  const prossima = novita[0];

  const ultimo = report[0];
  const precedente = report[1];
  const storico = [...report].reverse();
  const massimo = Math.max(1, ...storico.map((r) => contatti(r.dati)));
  const stima = ultimo && c.valore_cliente ? Math.round((contatti(ultimo.dati) / 4) * c.valore_cliente) : null;

  return (
    <div className="tt-dash">
      <div className="tt-wrap tt-dash__wrap">
        <header className="tt-dash__head">
          <div>
            <p className="tt-dash__over">{c.attivita}{c.citta ? ` · ${c.citta}` : ""}</p>
            <h1 className="tt-dash__title">Ciao{c.nome ? ` ${c.nome.split(" ")[0]}` : ""}</h1>
          </div>
          {daApprovare.length > 0 && (
            <a href="#approva" className="tt-dash__alert">
              <strong>{daApprovare.length === 1 ? "1 risposta" : `${daApprovare.length} risposte`}</strong> aspetta il tuo ok <span aria-hidden="true">→</span>
            </a>
          )}
        </header>

        <section className="tt-dash__hero" aria-labelledby="h-hero">
          {ultimo ? (
            <>
              <p id="h-hero" className="tt-dash__over tt-dash__over--chiaro">A {nomeMese(ultimo.mese)} Google ti ha portato</p>
              <p className="tt-dash__big">{n(contatti(ultimo.dati))} <span>contatti</span> <Delta ora={contatti(ultimo.dati)} prima={precedente ? contatti(precedente.dati) : undefined} /></p>
              <p className="tt-dash__split">{n(ultimo.dati.chiamate)} chiamate · {n(ultimo.dati.indicazioni)} richieste di indicazioni · {n(ultimo.dati.sito)} clic sul sito</p>
              {stima !== null ? (
                <p className="tt-dash__money">Se anche solo 1 su 4 è diventato cliente: <strong>circa {n(stima)} €</strong> di lavoro.</p>
              ) : (
                <form action={salvaValore} className="tt-dash__valore">
                  <label htmlFor="valore">Quanto ti fa guadagnare in media un cliente?</label>
                  <span><input id="valore" name="valore" inputMode="numeric" placeholder="40" /> €</span>
                  <button className="tt-btn">Calcola</button>
                </form>
              )}
            </>
          ) : (
            <>
              <p id="h-hero" className="tt-dash__over tt-dash__over--chiaro">I tuoi numeri</p>
              <p className="tt-dash__big tt-dash__big--attesa">Il primo resoconto arriva a inizio mese</p>
              <p className="tt-dash__split">Ti diremo quante persone ti hanno visto su Google, quante ti hanno chiamato, chiesto le indicazioni o aperto il sito. E quanto valgono, in euro.</p>
            </>
          )}
        </section>

        {ultimo && (
          <div className="tt-dash__grid">
            <section className="tt-dash__card" aria-labelledby="h-graf">
              <h2 id="h-graf" className="tt-dash__h2">Contatti da Google, mese per mese</h2>
              <ol className="tt-bars">
                {storico.map((r) => (
                  <li key={r.mese}><span className="tt-bars__v">{n(contatti(r.dati))}</span><span className="tt-bars__b" style={{ height: `${Math.max(6, (contatti(r.dati) / massimo) * 100)}%` }} /><span className="tt-bars__m">{nomeMese(r.mese).slice(0, 3)}</span></li>
                ))}
              </ol>
            </section>
            <section className="tt-dash__card" aria-labelledby="h-kpi">
              <h2 id="h-kpi" className="tt-dash__h2">Il mese in dettaglio</h2>
              <ul className="tt-kpi">
                {([["Ti hanno visto", "visti"], ["Chiamate", "chiamate"], ["Indicazioni", "indicazioni"], ["Clic sul sito", "sito"]] as const).map(([l, k]) => (
                  <li key={k}><span className="tt-kpi__l">{l}</span><span className="tt-kpi__n">{n(ultimo.dati[k])}</span><Delta ora={ultimo.dati[k]} prima={precedente?.dati[k]} /></li>
                ))}
              </ul>
            </section>
          </div>
        )}

        <section className="tt-dash__card" aria-labelledby="h-fatto">
          <h2 id="h-fatto" className="tt-dash__h2">Il lavoro fatto per te{tot.mesi > 1 ? ` in ${tot.mesi} mesi` : ""}</h2>
          <ul className="tt-kpi tt-kpi--4">
            <li><span className="tt-kpi__n">{n(tot.risposte)}</span><span className="tt-kpi__l">risposte alle recensioni</span></li>
            <li><span className="tt-kpi__n">{n(tot.novita)}</span><span className="tt-kpi__l">novità pubblicate</span></li>
            <li><span className="tt-kpi__n">{n(tot.recensioni)}</span><span className="tt-kpi__l">recensioni nuove{tot.media ? ` · ${String(tot.media).replace(".", ",")} ★` : ""}</span></li>
            <li><span className="tt-kpi__n">{n(tot.tocchi)}</span><span className="tt-kpi__l">tocchi su card e piedistallo</span></li>
          </ul>
        </section>

        {daApprovare.length > 0 && (
          <section id="approva" className="tt-dash__card tt-dash__card--mark" aria-labelledby="h-approva">
            <h2 id="h-approva" className="tt-dash__h2">Da approvare</h2>
            <p className="tt-dash__muted">Le recensioni sotto le 4 stelle le facciamo vedere a te prima di rispondere. Correggi se vuoi, poi pubblica.</p>
            {daApprovare.map((r) => (
              <div key={r.id} id={`r${r.id}`} className="tt-dash__review">
                <p className="tt-dash__who">{r.autore || "Cliente"} <Stars voto={r.stelle} etichetta={`${r.stelle} stelle su 5`} /></p>
                <p>{r.testo || <span className="tt-dash__muted">Nessun testo, solo le stelle.</span>}</p>
                <form action={approva.bind(null, r.id)} className="tt-form">
                  <div className="tt-field"><label htmlFor={`risp-${r.id}`}>La risposta che abbiamo preparato</label><textarea id={`risp-${r.id}`} name="risposta" rows={5} defaultValue={r.bozza ?? ""} required /></div>
                  <button className="tt-btn tt-btn--block">Pubblica questa risposta <span aria-hidden="true">→</span></button>
                </form>
              </div>
            ))}
          </section>
        )}

        <div className="tt-dash__grid">
          <section id="novita" className="tt-dash__card" aria-labelledby="h-novita">
            <h2 id="h-novita" className="tt-dash__h2">La novità della settimana</h2>
            {prossima ? (
              <form action={salvaNovita.bind(null, prossima.id)} className="tt-form">
                <p className="tt-dash__muted">{prossima.stato === "bloccata" ? <strong>Bloccata: non verrà pubblicata.</strong> : <>Esce <strong>{quando(prossima.pubblica_il)}</strong>. Se ti va bene, non fare niente.</>}</p>
                <textarea aria-label="Testo della novità" name="testo" rows={6} defaultValue={prossima.testo} />
                <div className="tt-actions">
                  <button className="tt-btn tt-btn--secondary">Salva le modifiche</button>
                  <button formAction={bloccaNovita.bind(null, prossima.id, prossima.stato !== "bloccata")} className="tt-btn tt-btn--secondary">{prossima.stato === "bloccata" ? "Sblocca" : "Blocca"}</button>
                </div>
              </form>
            ) : uscite[0] ? (
              <><p className="tt-dash__muted">Ultima uscita il {data(uscite[0].pubblicata_il ?? uscite[0].pubblica_il)}:</p><p>{uscite[0].testo}</p></>
            ) : <p className="tt-dash__muted">La prepariamo lunedì e ti avvisiamo per email.</p>}
            <form action={salvaSpunti} className="tt-form" style={{ marginTop: "var(--space-6)" }}>
              <div className="tt-field">
                <label htmlFor="spunti">Hai qualcosa da raccontare la prossima volta?</label>
                <textarea id="spunti" name="spunti" rows={2} defaultValue={c.spunti} placeholder="Es. nuovo trattamento, chiusura per ferie…" />
              </div>
              <button className="tt-btn tt-btn--secondary">Salva</button>
            </form>
          </section>

          {linkRecensioni && (
            <section className="tt-dash__card" aria-labelledby="h-chiedi">
              <h2 id="h-chiedi" className="tt-dash__h2">Chiedi una recensione</h2>
              <p className="tt-dash__muted">Mandalo a chi è appena stato da te. A tutti, non solo a chi pensi sia contento.</p>
              <p className="tt-dash__msg">{messaggio}</p>
              <div className="tt-actions">
                <a className="tt-btn" href={`https://wa.me/?text=${encodeURIComponent(messaggio)}`} target="_blank" rel="noopener">Manda su WhatsApp <span aria-hidden="true">→</span></a>
                <Copia testo={messaggio} etichetta="Copia" />
              </div>
              {qr && (
                <div className="tt-dash__qr">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qr} alt="QR per lasciare una recensione" width={112} height={112} />
                  <div><p style={{ margin: 0 }}>Oppure stampa il QR e mettilo vicino alla cassa.</p><a href={qr} download={`qr-recensioni-${c.id}.png`}>Scarica il QR</a></div>
                </div>
              )}
            </section>
          )}
        </div>

        <section className="tt-dash__card" aria-labelledby="h-recensioni">
          <h2 id="h-recensioni" className="tt-dash__h2">Ultime recensioni e risposte</h2>
          {ultime.length === 0 ? <p className="tt-dash__muted">Appena arrivano le vedi qui, con la nostra risposta.</p> : (
            <ul className="tt-dash__list">
              {ultime.map((r) => (
                <li key={r.id}>
                  <p className="tt-dash__who">{r.autore || "Cliente"} <Stars voto={r.stelle} etichetta={`${r.stelle} stelle su 5`} /> <span className="tt-dash__muted">{data(r.scritta_il ?? r.creata_il)}</span></p>
                  {r.testo && <p>{r.testo}</p>}
                  {(r.risposta || r.bozza) && <p className="tt-dash__reply"><strong>{STATO[r.stato] ?? r.stato}:</strong> {r.risposta ?? r.bozza}</p>}
                </li>
              ))}
            </ul>
          )}
        </section>

        <footer className="tt-actions tt-dash__foot">
          {ric?.pagata && c.richiesta_id && <a className="tt-btn tt-btn--secondary" href={`/attiva/gestisci?t=${firmaRichiesta(c.richiesta_id)}`}>Abbonamento e fatture</a>}
          {stima !== null && <form action={salvaValore}><input type="hidden" name="valore" value="" /><button className="tt-btn tt-btn--secondary">Cambia il valore di un cliente</button></form>}
          <form action={esciArea}><button className="tt-btn tt-btn--secondary">Esci</button></form>
        </footer>
      </div>
    </div>
  );
}
