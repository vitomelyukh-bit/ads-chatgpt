import { Resend } from "resend";
import type Stripe from "stripe";
import { db } from "@/lib/db";
import { email, TITROVANO, type Blocco } from "@/lib/email";
import { bozzaSpedizione } from "@/lib/packlink";
import { EXTRA, isTipoExtra, linkWhatsApp, type TipoExtra } from "@/lib/scheda";
import { site } from "@/lib/site";

// Ordini di card e piedistallo comprati da soli. Il cliente compila tutto sul sito:
// l'ordine nasce "da-pagare", diventa "da-spedire" quando Stripe conferma, poi "spedito".
export type OrdineBanco = {
  id: number; tipo: TipoExtra; nome: string; email: string; telefono: string; attivita: string;
  via: string; cap: string; citta: string; provincia: string; presso: string | null; indirizzo: string;
  spedizione_servizio: string | null; spedizione_costo: number | null; corriere: string | null;
  punto_ritiro: string | null; punto_ritiro_id: string | null; prezzo_prodotto: number | null; stato: string; packlink_ref: string | null;
};

export async function creaOrdineBanco(d: Omit<OrdineBanco, "id" | "indirizzo" | "stato" | "packlink_ref">) {
  const indirizzo = [d.nome, d.presso ? `c/o ${d.presso}` : "", d.via, `${d.cap} ${d.citta} (${d.provincia})`].filter(Boolean).join("\n");
  const [o] = (await db()`insert into ordini_banco (tipo, nome, email, telefono, attivita, via, cap, citta, provincia, presso, indirizzo,
      spedizione_servizio, spedizione_costo, corriere, punto_ritiro, punto_ritiro_id, prezzo_prodotto, importo, stato)
    values (${d.tipo}, ${d.nome}, ${d.email}, ${d.telefono}, ${d.attivita}, ${d.via}, ${d.cap}, ${d.citta}, ${d.provincia}, ${d.presso}, ${indirizzo},
      ${d.spedizione_servizio}, ${d.spedizione_costo}, ${d.corriere}, ${d.punto_ritiro}, ${d.punto_ritiro_id}, ${d.prezzo_prodotto},
      ${(d.prezzo_prodotto ?? 0) + (d.spedizione_costo ?? 0)}, 'da-pagare') returning *`) as OrdineBanco[];
  return o;
}

const eur = (n: number | null) => `${Number(n ?? 0).toFixed(2).replace(".", ",")} €`;
const righe = (o: OrdineBanco): [string, string][] => [
  ["Prodotto", `${EXTRA[o.tipo].nome} · ${eur(o.prezzo_prodotto)}`],
  ["Spedizione", `${o.corriere ?? "Corriere"} · ${o.punto_ritiro ? `ritiro al punto: ${o.punto_ritiro}` : "a domicilio"} · ${eur(o.spedizione_costo)}`],
  ["Totale", eur((o.prezzo_prodotto ?? 0) + (o.spedizione_costo ?? 0))],
  ["Attività / link", o.attivita || "—"],
  ["Cliente", `${o.nome} · ${o.telefono} · ${o.email}`],
  ["Indirizzo", o.indirizzo],
];

async function invia(o: OrdineBanco, perTe: { oggetto: string; titolo: string; blocchi: Blocco[] }, perCliente: { oggetto: string; titolo: string; blocchi: Blocco[] }) {
  const key = process.env.RESEND_API_KEY, from = process.env.RESEND_FROM;
  const to = process.env.LEAD_TO_EMAIL?.split(",").map((x) => x.trim()).filter(Boolean);
  if (!key || !from || !to?.length) return;
  const resend = new Resend(key);
  await Promise.allSettled([
    resend.emails.send({ from, to, replyTo: o.email, subject: perTe.oggetto, ...email({ marchio: TITROVANO, anteprima: `${o.attivita || o.nome} · ${o.citta}`, titolo: perTe.titolo, blocchi: perTe.blocchi }) }),
    resend.emails.send({ from, to: o.email, replyTo: to[0], subject: perCliente.oggetto, ...email({ marchio: TITROVANO, anteprima: "Ecco il riepilogo del tuo ordine.", titolo: perCliente.titolo, blocchi: perCliente.blocchi }) }),
  ]).then((r) => r.forEach((x) => x.status === "rejected" && console.error("[banco] email", x.reason)));
}

// Senza pagamenti online: l'ordine resta "da-pagare", ti arriva tutto per email e scrivi tu al cliente.
export async function ordineSenzaPagamento(o: OrdineBanco) {
  const wa = `https://wa.me/${o.telefono.replace(/\D/g, "").replace(/^(?!39)(\d{9,10})$/, "39$1")}`;
  await invia(o,
    { oggetto: `Nuovo ordine da pagare: ${EXTRA[o.tipo].nome}`, titolo: "Nuovo ordine: concorda il pagamento", blocchi: [
      { tipo: "righe", righe: righe(o) },
      { tipo: "bottone", testo: `Scrivi a ${o.nome.split(" ")[0]} su WhatsApp →`, url: wa },
      { tipo: "nota", testo: "Pagamento online non ancora attivo: manda al cliente il modo per pagare, poi spedisci." },
    ] },
    { oggetto: `Ordine ricevuto: ${EXTRA[o.tipo].nome}`, titolo: `Grazie ${o.nome.split(" ")[0]}, ordine ricevuto`, blocchi: [
      { tipo: "righe", righe: righe(o).slice(0, 3) },
      { tipo: "passi", passi: ["Ti scriviamo a breve su WhatsApp o per email per il pagamento.", "Colleghiamo il prodotto alla pagina delle recensioni della tua attività.", "Lo spediamo come hai scelto e ti avvisiamo quando parte."] },
      ...(linkWhatsApp() ? [{ tipo: "bottone" as const, testo: "Scrivici su WhatsApp →", url: linkWhatsApp()! }] : []),
    ] });
}

// Stripe ha confermato il pagamento: idempotente (pagina di ritorno e webhook).
export async function registraOrdineBanco(s: Stripe.Checkout.Session) {
  const id = Number(s.metadata?.ordine_id);
  if (s.metadata?.ordine !== "banco" || !id || s.payment_status !== "paid") return null;
  const [o] = (await db()`update ordini_banco set stato = 'da-spedire', stripe_session = ${s.id} where id = ${id} and stato = 'da-pagare' returning *`) as OrdineBanco[];
  if (!o || !isTipoExtra(o.tipo)) return null; // già registrato

  // Bozza su Packlink (gratis: l'etichetta la paghi dal pannello quando il pacco è pronto).
  const rif = await bozzaSpedizione({
    tipo: o.tipo, serviceId: o.spedizione_servizio ?? "", nome: o.nome, email: o.email, telefono: o.telefono,
    via: o.via, via2: o.presso ? `c/o ${o.presso}` : "", cap: o.cap, citta: o.citta, provincia: o.provincia,
    valore: Number(o.prezzo_prodotto ?? EXTRA[o.tipo].prezzo), riferimento: `TT-${o.id}`, puntoId: o.punto_ritiro_id ?? undefined,
  }).catch((e) => { console.error("[banco] bozza Packlink", e); return null; });
  if (rif) await db()`update ordini_banco set packlink_ref = ${rif} where id = ${o.id}`;

  await invia(o,
    { oggetto: `Ordine pagato: ${EXTRA[o.tipo].nome} da spedire`, titolo: `${EXTRA[o.tipo].nome} da spedire`, blocchi: [
      { tipo: "righe", righe: [...righe(o), ["Packlink", rif ? `bozza ${rif}: paga l'etichetta dal pannello` : "bozza non creata: creala a mano su Packlink"]] },
      { tipo: "p", testo: "Cosa fare: scrivi sul chip il link per le recensioni della sua attività (con NFC Tools), imballa, paga l'etichetta su Packlink e spedisci. Poi segnalo come spedito in console." },
      { tipo: "bottone", testo: "Apri la console →", url: `${site.url}/console/maps` },
    ] },
    { oggetto: `Pagamento ricevuto: ${EXTRA[o.tipo].nome}`, titolo: `Grazie ${o.nome.split(" ")[0]}, è tutto a posto`, blocchi: [
      { tipo: "righe", righe: righe(o).slice(0, 3) },
      { tipo: "passi", passi: [`Prepariamo ${o.tipo === "card" ? "la tua card" : "il tuo piedistallo"} e lo colleghiamo alla pagina delle recensioni della tua attività.`, o.punto_ritiro ? `Lo spediamo al punto di ritiro: ${o.punto_ritiro}. Ti arriva un avviso quando è pronto da ritirare.` : "Lo spediamo al tuo indirizzo e ti avvisiamo quando parte.", "Quando arriva, mettilo vicino alla cassa: il cliente avvicina il telefono e lascia la recensione."] },
      ...(linkWhatsApp() ? [{ tipo: "bottone" as const, testo: "Domande? Scrivici su WhatsApp →", url: linkWhatsApp()! }] : []),
    ] });
  return o;
}
