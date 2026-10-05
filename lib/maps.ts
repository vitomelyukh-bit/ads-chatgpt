import { Resend } from "resend";
import { linkArea } from "@/lib/area-auth";
import { db } from "@/lib/db";
import { email, TITROVANO, type Blocco } from "@/lib/email";
import { googleCollegato, leggiRecensioni, METRICHE, numeriMese, pubblicaNovitaGoogle, rispondiRecensione, type Metrica } from "@/lib/gbp";
import { commentoReport, novitaSettimanale, rispostaRecensione, type ProfiloCliente } from "@/lib/maps-ai";
import { site } from "@/lib/site";

// Motore del servizio "Più clienti da Google Maps": recensioni, novità settimanali, report mensili.
// Senza API Google (in attesa di approvazione) prepara tutto e lo lascia "da pubblicare" a mano.

export type Cliente = ProfiloCliente & {
  id: number; richiesta_id: number | null; nome: string; email: string; whatsapp: string; link_maps: string | null;
  spunti: string; google_account: string | null; google_location: string | null; stato: string; creato_il: string;
};
export type Recensione = {
  id: number; cliente_id: number; google_id: string | null; autore: string; stelle: number; testo: string; scritta_il: string | null;
  bozza: string | null; risposta: string | null; stato: string; notificata_il: string | null; pubblicata_il: string | null; errore: string | null; creata_il: string;
};
export type Novita = { id: number; cliente_id: number; testo: string; stato: string; pubblica_il: string; pubblicata_il: string | null; errore: string | null; creata_il: string };

export const STELLE_AUTOMATICHE = 4; // da 4 stelle in su la risposta esce da sola

export async function getClienteMaps(id: number) {
  const [c] = (await db()`select * from maps_clienti where id = ${id}`) as Cliente[];
  return c ?? null;
}
const suGoogle = (c: Cliente) => Boolean(c.google_account && c.google_location);
const errore = (e: unknown) => (e instanceof Error ? e.message : String(e)).slice(0, 500);

// ---------- Email ----------
async function invia(to: string, subject: string, contenuto: { html: string; text: string }) {
  const key = process.env.RESEND_API_KEY, from = process.env.RESEND_FROM;
  if (!key || !from) return console.warn("[maps] Resend non configurato:", subject);
  const replyTo = process.env.LEAD_TO_EMAIL?.split(",")[0]?.trim();
  const r = await new Resend(key).emails.send({ from, to, subject, replyTo, ...contenuto });
  if (r.error) console.error("[maps] email", r.error);
}
const mail = (anteprima: string, titolo: string, evidenzia: string, blocchi: Blocco[]) => email({ marchio: TITROVANO, anteprima, titolo, evidenzia, blocchi });

// ---------- Recensioni ----------
async function pubblicaRisposta(c: Cliente, r: Recensione, testo: string) {
  if (suGoogle(c) && r.google_id && (await googleCollegato())) {
    try {
      await rispondiRecensione(c.google_account!, c.google_location!, r.google_id, testo);
      await db()`update maps_recensioni set risposta = ${testo}, stato = 'pubblicata', pubblicata_il = now(), errore = null where id = ${r.id}`;
      return "pubblicata";
    } catch (e) {
      await db()`update maps_recensioni set risposta = ${testo}, stato = 'errore', errore = ${errore(e)} where id = ${r.id}`;
      return "errore";
    }
  }
  // Niente API: resta pronta, la pubblichi tu (o Grok Bot) e la segni come fatta in console.
  await db()`update maps_recensioni set risposta = ${testo}, stato = 'da-pubblicare' where id = ${r.id}`;
  return "da-pubblicare";
}

// Scrive la bozza; da 4 stelle la pubblica, sotto la manda al cliente per l'ok.
export async function elaboraRecensione(c: Cliente, r: Recensione) {
  let bozza = r.bozza;
  if (!bozza) {
    try {
      bozza = await rispostaRecensione(c, r);
      await db()`update maps_recensioni set bozza = ${bozza}, errore = null where id = ${r.id}`;
    } catch (e) {
      await db()`update maps_recensioni set errore = ${`AI: ${errore(e)}`} where id = ${r.id}`;
      return "errore";
    }
  }
  if (r.stelle >= STELLE_AUTOMATICHE) return pubblicaRisposta(c, r, bozza);
  await db()`update maps_recensioni set stato = 'da-approvare' where id = ${r.id}`;
  await notificaRecensione(c, { ...r, bozza });
  return "da-approvare";
}

async function notificaRecensione(c: Cliente, r: Recensione) {
  await invia(c.email, `Nuova recensione da ${r.stelle} ${r.stelle === 1 ? "stella" : "stelle"}: controlla la risposta`, mail(
    "Abbiamo preparato la risposta: approvala o correggila.",
    `${c.nome ? `${c.nome}, ` : ""}è arrivata una recensione da ${r.stelle} ${r.stelle === 1 ? "stella" : "stelle"}`,
    "recensione",
    [
      { tipo: "evidenza", etichetta: `${r.autore || "Un cliente"} · ${"★".repeat(r.stelle)}${"☆".repeat(5 - r.stelle)}`, testo: r.testo || "(nessun testo, solo le stelle)" },
      { tipo: "titoletto", testo: "La risposta che abbiamo preparato" },
      { tipo: "p", testo: r.bozza ?? "" },
      { tipo: "bottone", testo: "Approva o correggi →", url: linkArea(c.id, `#r${r.id}`) },
      { tipo: "nota", testo: "Le recensioni negative le facciamo approvare a te: sono quelle dove ogni parola conta. Finché non approvi, la risposta non esce." },
    ],
  ));
  await db()`update maps_recensioni set notificata_il = now() where id = ${r.id}`;
}

export async function approvaRisposta(clienteId: number, recensioneId: number, testo: string) {
  const c = await getClienteMaps(clienteId);
  const [r] = (await db()`select * from maps_recensioni where id = ${recensioneId} and cliente_id = ${clienteId}`) as Recensione[];
  if (!c || !r || !testo.trim()) return null;
  return pubblicaRisposta(c, r, testo.trim().slice(0, 4000));
}

// Recensione incollata a mano (quando le API Google non sono ancora attive).
export async function aggiungiRecensioneManuale(clienteId: number, d: { autore: string; stelle: number; testo: string }) {
  const c = await getClienteMaps(clienteId);
  if (!c) return;
  const [r] = (await db()`insert into maps_recensioni (cliente_id, autore, stelle, testo, scritta_il) values (${clienteId}, ${d.autore}, ${d.stelle}, ${d.testo}, now()) returning *`) as Recensione[];
  await elaboraRecensione(c, r);
}

export async function sincronizzaRecensioni(c: Cliente, maxNuove = 15) {
  if (!suGoogle(c) || !(await googleCollegato())) return 0;
  const lette = await leggiRecensioni(c.google_account!, c.google_location!);
  let nuove = 0;
  for (const g of lette) {
    const [r] = (await db()`insert into maps_recensioni (cliente_id, google_id, autore, stelle, testo, scritta_il, risposta, stato, pubblicata_il)
      values (${c.id}, ${g.id}, ${g.autore}, ${g.stelle}, ${g.testo}, ${g.scritta}, ${g.risposta}, ${g.risposta ? "pubblicata" : "nuova"}, ${g.risposta ? new Date().toISOString() : null})
      on conflict (cliente_id, google_id) where google_id is not null do nothing returning *`) as Recensione[];
    if (r && r.stato === "nuova" && nuove < maxNuove) {
      await elaboraRecensione(c, r);
      nuove++;
    }
  }
  // Recensioni rimaste a metà (AI non disponibile, errori): riprova.
  const sospese = (await db()`select * from maps_recensioni where cliente_id = ${c.id} and stato = 'nuova' order by creata_il limit 10`) as Recensione[];
  for (const r of sospese) await elaboraRecensione(c, r);
  return nuove;
}

// ---------- Novità settimanali ----------
// Prossimo mercoledì alle 10 (ora italiana), almeno 36 ore da adesso: c'è tempo per bloccarla.
export function prossimaUscita(da = new Date()) {
  const d = new Date(da.getTime() + 36 * 3600_000);
  for (let i = 0; i < 8; i++) {
    const giorno = new Date(d.getTime() + i * 86400_000);
    const p = Object.fromEntries(new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Rome", weekday: "short", year: "numeric", month: "2-digit", day: "2-digit", timeZoneName: "shortOffset" }).formatToParts(giorno).map((x) => [x.type, x.value]));
    if (p.weekday !== "Wed") continue;
    const offset = Number((p.timeZoneName.match(/GMT([+-]\d+)/) ?? [, "1"])[1]);
    const uscita = new Date(Date.UTC(Number(p.year), Number(p.month) - 1, Number(p.day), 10 - offset));
    if (uscita.getTime() > da.getTime() + 36 * 3600_000) return uscita;
  }
  return new Date(da.getTime() + 3 * 86400_000);
}

export async function preparaNovita(c: Cliente, forza = false) {
  const [inCoda] = (await db()`select count(*)::int as n from maps_novita where cliente_id = ${c.id} and stato in ('programmata', 'da-pubblicare')`) as { n: number }[];
  const [recente] = (await db()`select count(*)::int as n from maps_novita where cliente_id = ${c.id} and pubblicata_il > now() - interval '5 days'`) as { n: number }[];
  if (!forza && (inCoda.n > 0 || recente.n > 0)) return null;
  const precedenti = ((await db()`select testo from maps_novita where cliente_id = ${c.id} order by creata_il desc limit 8`) as { testo: string }[]).map((x) => x.testo);
  const testo = await novitaSettimanale(c, precedenti);
  const quando = prossimaUscita();
  const [n] = (await db()`insert into maps_novita (cliente_id, testo, pubblica_il) values (${c.id}, ${testo}, ${quando.toISOString()}) returning *`) as Novita[];
  await db()`update maps_clienti set spunti = '' where id = ${c.id}`;
  const giorno = quando.toLocaleDateString("it-IT", { timeZone: "Europe/Rome", weekday: "long", day: "numeric", month: "long" });
  await invia(c.email, `La novità di questa settimana esce ${giorno}`, mail(
    `Esce ${giorno}: puoi modificarla o bloccarla.`,
    "La novità di questa settimana è pronta",
    "novità",
    [
      { tipo: "p", testo: `La pubblichiamo sulla tua attività su Google ${giorno} alle 10. Se ti va bene non devi fare niente.` },
      { tipo: "evidenza", etichetta: "Novità", testo },
      { tipo: "bottone", testo: "Modifica o blocca →", url: linkArea(c.id, "#novita") },
      { tipo: "nota", testo: "Hai una cosa da raccontare la prossima settimana (un piatto nuovo, un evento, una chiusura)? Scrivila nella tua area: la usiamo noi." },
    ],
  ));
  return n;
}

export async function pubblicaNovitaDovute() {
  const dovute = (await db()`select n.*, c.google_account, c.google_location from maps_novita n join maps_clienti c on c.id = n.cliente_id
    where n.stato = 'programmata' and n.pubblica_il <= now() and c.stato = 'attivo' order by n.pubblica_il limit 50`) as (Novita & { google_account: string | null; google_location: string | null })[];
  const collegato = await googleCollegato();
  for (const n of dovute) {
    if (!collegato || !n.google_account || !n.google_location) {
      await db()`update maps_novita set stato = 'da-pubblicare' where id = ${n.id}`;
      continue;
    }
    try {
      const gid = await pubblicaNovitaGoogle(n.google_account, n.google_location, n.testo);
      await db()`update maps_novita set stato = 'pubblicata', pubblicata_il = now(), google_id = ${gid}, errore = null where id = ${n.id}`;
    } catch (e) {
      await db()`update maps_novita set stato = 'errore', errore = ${errore(e)} where id = ${n.id}`;
    }
  }
  return dovute.length;
}

// ---------- Report mensile ----------
export async function preparaReport(c: Cliente, anno: number, mese: number) {
  const chiave = `${anno}-${String(mese).padStart(2, "0")}`;
  const [gia] = (await db()`select 1 from maps_report where cliente_id = ${c.id} and mese = ${chiave}`) as unknown[];
  if (gia || !suGoogle(c) || !(await googleCollegato())) return null;
  const numeri = await numeriMese(c.google_location!, anno, mese);
  const prima = mese === 1 ? await numeriMese(c.google_location!, anno - 1, 12).catch(() => null) : await numeriMese(c.google_location!, anno, mese - 1).catch(() => null);
  const [rec] = (await db()`select count(*)::int as ricevute, count(*) filter (where stato = 'pubblicata')::int as risposte
    from maps_recensioni where cliente_id = ${c.id} and coalesce(scritta_il, creata_il) >= ${`${chiave}-01`}::date and coalesce(scritta_il, creata_il) < (${`${chiave}-01`}::date + interval '1 month')`) as { ricevute: number; risposte: number }[];
  const [nov] = (await db()`select count(*)::int as n from maps_novita where cliente_id = ${c.id} and stato = 'pubblicata' and to_char(pubblicata_il, 'YYYY-MM') = ${chiave}`) as { n: number }[];
  const [tocchi] = c.richiesta_id ? ((await db()`select coalesce(sum(tocchi), 0)::int as n from nfc_codici where richiesta_id = ${c.richiesta_id}`) as { n: number }[]) : [{ n: 0 }];
  const visti = (x: Record<Metrica, number>) => x.BUSINESS_IMPRESSIONS_MOBILE_MAPS + x.BUSINESS_IMPRESSIONS_DESKTOP_MAPS + x.BUSINESS_IMPRESSIONS_MOBILE_SEARCH + x.BUSINESS_IMPRESSIONS_DESKTOP_SEARCH;
  const dati = {
    visti: visti(numeri), chiamate: numeri.CALL_CLICKS, indicazioni: numeri.BUSINESS_DIRECTION_REQUESTS, sito: numeri.WEBSITE_CLICKS,
    prima: prima ? { visti: visti(prima), chiamate: prima.CALL_CLICKS, indicazioni: prima.BUSINESS_DIRECTION_REQUESTS, sito: prima.WEBSITE_CLICKS } : null,
    recensioni: rec.ricevute, risposte: rec.risposte, novita: nov.n, tocchi: tocchi.n,
  };
  const righe = [
    `Persone che ti hanno visto su Google e Maps: ${dati.visti}${dati.prima ? ` (mese prima: ${dati.prima.visti})` : ""}`,
    `Chiamate: ${dati.chiamate}${dati.prima ? ` (mese prima: ${dati.prima.chiamate})` : ""}`,
    `Richieste di indicazioni: ${dati.indicazioni}${dati.prima ? ` (mese prima: ${dati.prima.indicazioni})` : ""}`,
    `Clic sul sito: ${dati.sito}`, `Recensioni nuove: ${dati.recensioni}, risposte date: ${dati.risposte}`, `Novità pubblicate: ${dati.novita}`,
  ].join("\n");
  const commento = await commentoReport(c, chiave, righe).catch(() => "");
  await db()`insert into maps_report (cliente_id, mese, dati, commento) values (${c.id}, ${chiave}, ${JSON.stringify(dati)}, ${commento})`;
  const nomeMese = new Date(Date.UTC(anno, mese - 1, 15)).toLocaleDateString("it-IT", { month: "long", year: "numeric" });
  await invia(c.email, `I tuoi numeri di ${nomeMese} su Google`, mail(
    `${dati.visti} persone ti hanno visto, ${dati.chiamate} ti hanno chiamato.`,
    `I tuoi numeri di ${nomeMese}`,
    "numeri",
    [
      { tipo: "righe", righe: [
        ["Ti hanno visto su Google e Maps", String(dati.visti)], ["Ti hanno chiamato", String(dati.chiamate)],
        ["Hanno chiesto le indicazioni", String(dati.indicazioni)], ["Clic sul tuo sito", String(dati.sito)],
        ["Recensioni nuove", String(dati.recensioni)], ["Risposte date", String(dati.risposte)], ["Novità pubblicate", String(dati.novita)],
        ...(dati.tocchi ? ([["Tocchi su card o piedistallo (in tutto)", String(dati.tocchi)]] as [string, string][]) : []),
      ] },
      ...(commento ? ([{ tipo: "p", testo: commento }] as Blocco[]) : []),
      { tipo: "bottone", testo: "Apri la tua area →", url: linkArea(c.id) },
      { tipo: "nota", testo: "Numeri forniti da Google per la tua attività. Possono differire leggermente da quelli che vedi nell'app." },
    ],
  ));
  await db()`update maps_report set inviato_il = now() where cliente_id = ${c.id} and mese = ${chiave}`;
  return dati;
}

// ---------- Giro automatico (cron) ----------
export async function giro() {
  const log: string[] = [];
  const ora = new Date();
  const roma = Object.fromEntries(new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Rome", weekday: "short", day: "numeric", hour: "numeric", hourCycle: "h23" }).formatToParts(ora).map((x) => [x.type, x.value]));
  const clienti = (await db()`select * from maps_clienti where stato = 'attivo' order by id`) as Cliente[];
  for (const c of clienti) {
    try {
      const n = await sincronizzaRecensioni(c);
      if (n) log.push(`${c.attivita}: ${n} recensioni nuove`);
      // Recensioni negative non approvate da 3 giorni: un promemoria (una volta).
      const ferme = (await db()`select * from maps_recensioni where cliente_id = ${c.id} and stato = 'da-approvare' and notificata_il < now() - interval '3 days' and notificata_il > now() - interval '4 days'`) as Recensione[];
      for (const r of ferme) await notificaRecensione(c, r);
      // Lunedì e martedì: prepara la novità della settimana se manca.
      if (["Mon", "Tue"].includes(roma.weekday)) {
        const nov = await preparaNovita(c).catch((e) => { log.push(`${c.attivita}: novità non preparata (${errore(e)})`); return null; });
        if (nov) log.push(`${c.attivita}: novità programmata`);
      }
      // Dal 2 al 5 del mese: report del mese prima.
      const giornoMese = Number(roma.day);
      if (giornoMese >= 2 && giornoMese <= 5) {
        const d = new Date(Date.UTC(ora.getUTCFullYear(), ora.getUTCMonth() - 1, 15));
        const rep = await preparaReport(c, d.getUTCFullYear(), d.getUTCMonth() + 1).catch((e) => { log.push(`${c.attivita}: report non riuscito (${errore(e)})`); return null; });
        if (rep) log.push(`${c.attivita}: report inviato`);
      }
    } catch (e) {
      log.push(`${c.attivita}: ${errore(e)}`);
    }
  }
  const pubblicate = await pubblicaNovitaDovute();
  if (pubblicate) log.push(`${pubblicate} novità in uscita`);
  return log;
}

// Da una richiesta pagata nasce il cliente del servizio (idempotente).
export async function creaClienteDaRichiesta(richiestaId: number) {
  const [c] = (await db()`insert into maps_clienti (richiesta_id, attivita, citta, nome, email, whatsapp, link_maps)
    select id, attivita, citta, nome, email, whatsapp, link_maps from richieste_scheda where id = ${richiestaId}
    on conflict (richiesta_id) where richiesta_id is not null do nothing returning *`) as Cliente[];
  return c ?? null;
}

export const METRICHE_ETICHETTE = METRICHE;
export const urlArea = () => `${site.url}/area`;
