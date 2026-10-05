import QRCode from "qrcode";
import { approva, bloccaNovita, esciArea, salvaNovita, salvaSpunti } from "@/actions/area";
import { Copia } from "@/components/Copia";
import { Stars } from "@/components/ds/Stars";
import { requireCliente } from "@/lib/area-auth";
import { db } from "@/lib/db";
import { getClienteMaps, type Novita, type Recensione } from "@/lib/maps";
import { firmaRichiesta } from "@/lib/scheda-token";

export const dynamic = "force-dynamic";

const STATO: Record<string, string> = {
  pubblicata: "Risposta pubblicata", "da-pubblicare": "Risposta pronta, in pubblicazione", "da-approvare": "Aspetta il tuo ok",
  nuova: "Stiamo preparando la risposta", errore: "Stiamo pubblicando la risposta", ignorata: "Senza risposta",
};
const data = (s: string | null) => (s ? new Date(s).toLocaleDateString("it-IT", { timeZone: "Europe/Rome", day: "numeric", month: "long" }) : "");
const quando = (s: string) => new Date(s).toLocaleString("it-IT", { timeZone: "Europe/Rome", weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });

export default async function Area() {
  const id = await requireCliente();
  const c = await getClienteMaps(id);
  if (!c) return <div className="tt-wrap tt-wrap--read tt-page-head"><p className="tt-lead">Account non trovato. Scrivici su WhatsApp.</p></div>;

  const daApprovare = (await db()`select * from maps_recensioni where cliente_id = ${id} and stato = 'da-approvare' order by creata_il`) as Recensione[];
  const ultime = (await db()`select * from maps_recensioni where cliente_id = ${id} and stato <> 'da-approvare' order by coalesce(scritta_il, creata_il) desc limit 8`) as Recensione[];
  const novita = (await db()`select * from maps_novita where cliente_id = ${id} and stato in ('programmata', 'bloccata') order by pubblica_il limit 1`) as Novita[];
  const uscite = (await db()`select * from maps_novita where cliente_id = ${id} and stato in ('pubblicata', 'da-pubblicare') order by coalesce(pubblicata_il, pubblica_il) desc limit 3`) as Novita[];
  const [report] = (await db()`select mese, dati from maps_report where cliente_id = ${id} order by mese desc limit 1`) as { mese: string; dati: { visti: number; chiamate: number; indicazioni: number; sito: number; prima: { visti: number; chiamate: number; indicazioni: number } | null } }[];
  const [ric] = c.richiesta_id ? ((await db()`select link_recensioni, pagata from richieste_scheda where id = ${c.richiesta_id}`) as { link_recensioni: string | null; pagata: boolean }[]) : [];
  const [nfc] = (await db()`select count(*)::int as codici, coalesce(sum(n.tocchi), 0)::int as tocchi, min(n.tipo) as tipo,
      (select count(*) from nfc_tocchi t join nfc_codici k on k.codice = t.codice where k.cliente_id = ${id} and t.quando >= date_trunc('month', now()))::int as mese
    from nfc_codici n where n.cliente_id = ${id}`) as { codici: number; tocchi: number; tipo: string | null; mese: number }[];

  const linkRecensioni = c.link_recensioni || ric?.link_recensioni || c.link_maps;
  const qr = linkRecensioni ? await QRCode.toDataURL(linkRecensioni, { margin: 1, width: 360, color: { dark: "#16140f", light: "#ffffff" } }) : null;
  const messaggio = linkRecensioni ? `Ciao, grazie per essere passato da ${c.attivita}. Se ti sei trovato bene, ci aiuteresti con una recensione su Google? Ci vuole un minuto: ${linkRecensioni}` : "";
  const n = novita[0];
  const diff = (a: number, b?: number) => (b === undefined || b === null ? null : a - b);

  return (
    <div className="tt-wrap tt-wrap--read tt-page-head tt-stack-12">
      <div className="tt-stack-4">
        <p className="tt-eyebrow" style={{ margin: 0 }}>{c.attivita}{c.citta ? ` · ${c.citta}` : ""}</p>
        <h1 className="tt-display-lg">Ciao{c.nome ? ` ${c.nome.split(" ")[0]}` : ""}.</h1>
        <p className="tt-lead">
          {daApprovare.length
            ? <>Hai <span className="tt-mark">{daApprovare.length === 1 ? "una risposta" : `${daApprovare.length} risposte`} da approvare.</span></>
            : "È tutto a posto: al resto pensiamo noi."}
        </p>
      </div>

      {daApprovare.length > 0 && (
        <section className="tt-stack-6" aria-labelledby="h-approva">
          <h2 id="h-approva" className="tt-heading">Da approvare</h2>
          <p className="tt-body tt-muted" style={{ margin: 0 }}>Le recensioni sotto le 4 stelle le facciamo vedere a te prima di rispondere. Correggi se vuoi, poi pubblica.</p>
          {daApprovare.map((r) => (
            <div key={r.id} id={`r${r.id}`} className="tt-review" style={{ maxWidth: "none", scrollMarginTop: "var(--space-8)" }}>
              <div className="tt-review__box"><p className="tt-review__who">{r.autore || "Cliente"} <Stars voto={r.stelle} etichetta={`${r.stelle} stelle su 5`} /></p><p>{r.testo || <span className="tt-muted">Nessun testo, solo le stelle.</span>}</p></div>
              <form action={approva.bind(null, r.id)} className="tt-review__box tt-review__box--reply tt-form">
                <div className="tt-field"><label htmlFor={`risp-${r.id}`}>La risposta che abbiamo preparato</label><textarea id={`risp-${r.id}`} name="risposta" rows={6} defaultValue={r.bozza ?? ""} required /></div>
                <button className="tt-btn tt-btn--block">Pubblica questa risposta <span aria-hidden="true">→</span></button>
              </form>
            </div>
          ))}
        </section>
      )}

      <section id="novita" className="tt-stack-6" aria-labelledby="h-novita" style={{ scrollMarginTop: "var(--space-8)" }}>
        <h2 id="h-novita" className="tt-heading">La novità della settimana</h2>
        {n ? (
          <div className="tt-card tt-stack-4">
            <p className="tt-body" style={{ margin: 0 }}>
              {n.stato === "bloccata" ? <strong>Bloccata: non verrà pubblicata.</strong> : <>Esce <strong>{quando(n.pubblica_il)}</strong>. Se ti va bene non devi fare niente.</>}
            </p>
            <form action={salvaNovita.bind(null, n.id)} className="tt-form">
              <div className="tt-field"><label htmlFor="testo-novita">Testo</label><textarea id="testo-novita" name="testo" rows={6} defaultValue={n.testo} /></div>
              <div className="tt-actions">
                <button className="tt-btn">Salva le modifiche</button>
                <button formAction={bloccaNovita.bind(null, n.id, n.stato !== "bloccata")} className="tt-btn tt-btn--secondary">{n.stato === "bloccata" ? "Sblocca e pubblica" : "Blocca questa novità"}</button>
              </div>
            </form>
          </div>
        ) : (
          <p className="tt-body tt-muted">La prossima la prepariamo lunedì e ti avvisiamo per email.</p>
        )}
        <form action={salvaSpunti} className="tt-form tt-card">
          <div className="tt-field">
            <label htmlFor="spunti">Hai qualcosa da raccontare? (facoltativo)</label>
            <textarea id="spunti" name="spunti" rows={3} defaultValue={c.spunti} placeholder="Es. da venerdì c'è il menù d'autunno, chiusi per ferie dal 10 al 20 agosto…" />
            <p className="tt-field__help">La usiamo per la prossima novità. Scrivi come ti viene: la sistemiamo noi.</p>
          </div>
          <button className="tt-btn tt-btn--secondary">Salva</button>
        </form>
        {uscite.length > 0 && (
          <details className="tt-more"><summary className="tt-btn tt-btn--secondary">Novità già uscite</summary>
            <ul className="tt-stack-4" style={{ listStyle: "none", padding: 0, marginTop: "var(--space-4)" }}>
              {uscite.map((u) => <li key={u.id} className="tt-card"><p className="tt-small tt-muted" style={{ margin: 0 }}>{data(u.pubblicata_il ?? u.pubblica_il)}</p><p className="tt-body" style={{ margin: 0 }}>{u.testo}</p></li>)}
            </ul>
          </details>
        )}
      </section>

      <section className="tt-stack-6" aria-labelledby="h-numeri">
        <h2 id="h-numeri" className="tt-heading">I tuoi numeri</h2>
        {report ? (
          <>
            <p className="tt-body tt-muted" style={{ margin: 0 }}>Mese di {new Date(`${report.mese}-15`).toLocaleDateString("it-IT", { month: "long", year: "numeric" })}, dati di Google.</p>
            <ul className="tt-numeri">
              {[["Ti hanno visto", report.dati.visti, report.dati.prima?.visti], ["Ti hanno chiamato", report.dati.chiamate, report.dati.prima?.chiamate], ["Indicazioni chieste", report.dati.indicazioni, report.dati.prima?.indicazioni], ["Clic sul sito", report.dati.sito, undefined]].map(([l, v, p]) => {
                const d = diff(v as number, p as number | undefined);
                return <li key={l as string}><span className="tt-numeri__n">{v as number}</span><span>{l as string}</span>{d !== null && <small>{d >= 0 ? `+${d}` : d} sul mese prima</small>}</li>;
              })}
            </ul>
          </>
        ) : <p className="tt-body tt-muted">Il primo riepilogo arriva nei primi giorni del mese prossimo, anche per email.</p>}
        {nfc.codici > 0 && (
          <div className="tt-card tt-stack-2">
            <p className="tt-label" style={{ margin: 0 }}>{nfc.codici > 1 ? "Card e piedistalli da banco" : nfc.tipo === "piedistallo" ? "Il tuo piedistallo da banco" : "La tua card da banco"}</p>
            <p className="tt-body" style={{ margin: 0 }}><span className="tt-numeri__n">{nfc.mese}</span> {nfc.mese === 1 ? "tocco" : "tocchi"} questo mese · {nfc.tocchi} in tutto</p>
            <p className="tt-small tt-muted" style={{ margin: 0 }}>Ogni tocco è un cliente che ha aperto la pagina per lasciarti una recensione. Più è in vista, vicino alla cassa, più funziona.</p>
          </div>
        )}
      </section>

      {linkRecensioni && (
        <section className="tt-stack-6" aria-labelledby="h-chiedi">
          <h2 id="h-chiedi" className="tt-heading">Chiedi recensioni ai clienti contenti</h2>
          <div className="tt-card tt-stack-4">
            <p className="tt-body" style={{ margin: 0 }}>Mandalo su WhatsApp a chi è appena stato da te:</p>
            <p className="tt-body" style={{ margin: 0, padding: "var(--space-4)", background: "var(--paper-sunk)", borderRadius: "var(--radius-md)" }}>{messaggio}</p>
            <div className="tt-actions">
              <a className="tt-btn" href={`https://wa.me/?text=${encodeURIComponent(messaggio)}`} target="_blank" rel="noopener">Manda su WhatsApp <span aria-hidden="true">→</span></a>
              <Copia testo={messaggio} etichetta="Copia il messaggio" />
            </div>
            <p className="tt-small tt-muted" style={{ margin: 0 }}>Mandalo a tutti i clienti, non solo a quelli che pensi siano contenti: lo chiedono le regole di Google.</p>
          </div>
          {qr && (
            <div className="tt-card tt-stack-4" style={{ justifyItems: "start" }}>
              <p className="tt-body" style={{ margin: 0 }}>Oppure stampa il QR e mettilo vicino alla cassa:</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qr} alt="QR per lasciare una recensione" width={180} height={180} style={{ border: "var(--border-thick) solid var(--ink)", borderRadius: "var(--radius-md)" }} />
              <a className="tt-btn tt-btn--secondary" href={qr} download={`qr-recensioni-${c.id}.png`}>Scarica il QR</a>
            </div>
          )}
        </section>
      )}

      <section className="tt-stack-6" aria-labelledby="h-recensioni">
        <h2 id="h-recensioni" className="tt-heading">Ultime recensioni</h2>
        {ultime.length === 0 ? <p className="tt-body tt-muted">Appena arrivano le vedi qui, con la nostra risposta.</p> : ultime.map((r) => (
          <div key={r.id} className="tt-review" style={{ maxWidth: "none" }}>
            <div className="tt-review__box">
              <p className="tt-review__who">{r.autore || "Cliente"} <Stars voto={r.stelle} etichetta={`${r.stelle} stelle su 5`} /> <span className="tt-small tt-muted" style={{ fontWeight: 400 }}>{data(r.scritta_il ?? r.creata_il)}</span></p>
              {r.testo && <p>{r.testo}</p>}
            </div>
            {(r.risposta || r.bozza) && <div className="tt-review__box tt-review__box--reply"><p className="tt-review__who">{STATO[r.stato] ?? r.stato}</p><p>{r.risposta ?? r.bozza}</p></div>}
          </div>
        ))}
      </section>

      <section className="tt-stack-4" style={{ borderTop: "1px solid var(--line)", paddingTop: "var(--space-8)" }}>
        <div className="tt-actions">
          {ric?.pagata && c.richiesta_id && <a className="tt-btn tt-btn--secondary" href={`/attiva/gestisci?t=${firmaRichiesta(c.richiesta_id)}`}>Abbonamento e fatture</a>}
          <form action={esciArea}><button className="tt-btn tt-btn--secondary">Esci</button></form>
        </div>
      </section>
    </div>
  );
}
