import { Resend } from "resend";
import type Stripe from "stripe";
import { db } from "@/lib/db";
import { email, TITROVANO, type Blocco } from "@/lib/email";
import { firmaRichiesta } from "@/lib/scheda-token";
import { EXTRA, isTipoExtra, scheda } from "@/lib/scheda";
import { site } from "@/lib/site";

export type RichiestaScheda = {
  id: number; attivita: string; citta: string; categoria: string | null; nome: string; whatsapp: string; email: string;
  link_maps: string | null; card_nfc: boolean; nfc_tipo: string | null; sped_via: string | null; sped_cap: string | null; sped_citta: string | null;
  sped_provincia: string | null; sped_presso: string | null; stato: string; pagata: boolean; link_recensioni: string | null;
};

// Attiva una richiesta dopo il pagamento. Idempotente: si può chiamare più volte
// (pagina di ritorno e webhook) e fa il lavoro una volta sola.
export async function attivaDaCheckout(session: Stripe.Checkout.Session) {
  const id = Number(session.metadata?.richiesta_id);
  if (!id || session.payment_status !== "paid") return null;
  const aggiornate = (await db()`update richieste_scheda set pagata = true, pagata_il = now(), stato = 'attiva',
      stripe_session = ${session.id},
      stripe_customer = ${typeof session.customer === "string" ? session.customer : session.customer?.id ?? null},
      stripe_subscription = ${typeof session.subscription === "string" ? session.subscription : session.subscription?.id ?? null}
    where id = ${id} and pagata = false returning *`) as RichiestaScheda[];
  const r = aggiornate[0];
  if (!r) return null; // già attivata

  let codice: string | null = null;
  if (isTipoExtra(r.nfc_tipo)) codice = await assegnaCodiceLibero(r.id, r.nfc_tipo);
  await emailAttivazione(r, codice);
  return r;
}

// Primo codice libero del tipo giusto (card o piedistallo), senza doppioni anche in parallelo.
export async function assegnaCodiceLibero(richiestaId: number, tipo: string) {
  const [c] = (await db()`update nfc_codici set richiesta_id = ${richiestaId}, assegnato_il = now()
    where codice = (select codice from nfc_codici where richiesta_id is null and tipo = ${tipo} order by creato_il, codice limit 1 for update skip locked)
    returning codice`) as { codice: string }[];
  return c?.codice ?? null;
}

function blocchiCard(tipo: string | null, codice: string | null, indirizzo: string): Blocco[] {
  if (!isTipoExtra(tipo)) return [];
  if (!codice) return [{ tipo: "evidenza", etichetta: "Attenzione", testo: `Codici "${tipo}" esauriti: generane di nuovi dalla console e assegnane uno.` }];
  return [
    { tipo: "evidenza", etichetta: `${EXTRA[tipo].nome} da spedire`, testo: `Codice ${codice}` },
    { tipo: "righe", righe: [["Indirizzo", indirizzo], ["Link della card", `${site.url}/r/${codice}`]] },
  ];
}

async function emailAttivazione(r: RichiestaScheda, codice: string | null) {
  const key = process.env.RESEND_API_KEY, from = process.env.RESEND_FROM;
  const to = process.env.LEAD_TO_EMAIL?.split(",").map((s) => s.trim()).filter(Boolean);
  if (!key || !from || !to?.length) return;
  const resend = new Resend(key);
  const gestisci = `${site.url}/attiva/gestisci?t=${firmaRichiesta(r.id)}`;
  const indirizzo = r.card_nfc ? `${r.sped_presso ? `c/o ${r.sped_presso}\n` : ""}${r.sped_via}\n${r.sped_cap} ${r.sped_citta} (${r.sped_provincia})` : "";

  const interna = email({
    marchio: TITROVANO,
    anteprima: `${r.attivita}: pagamento ricevuto${r.nfc_tipo ? ` · ${r.nfc_tipo} da spedire` : ""}`,
    titolo: `Pagamento ricevuto: ${r.attivita}`,
    evidenzia: "Pagamento ricevuto",
    blocchi: [
      { tipo: "righe", righe: [["Attività", `${r.attivita} · ${r.citta}`], ["Cliente", `${r.nome} · ${r.whatsapp}`], ["Google Maps", r.link_maps ?? "—"]] },
      ...blocchiCard(r.nfc_tipo, codice, indirizzo),
      { tipo: "p", testo: "Prossimi passi: richiedi l'accesso da gestore alla sua attività su Google (il cliente riceve l'email e approva) e imposta in console il link per le recensioni." },
      { tipo: "bottone", testo: "Apri la console →", url: `${site.url}/console/scheda` },
    ],
  });
  const cliente = email({
    marchio: TITROVANO,
    anteprima: "Il servizio è attivo: ecco cosa succede adesso.",
    titolo: `Ciao ${r.nome}, il servizio è attivo`,
    evidenzia: "attiva",
    blocchi: [
      { tipo: "p", testo: `Grazie: abbiamo ricevuto il pagamento per ${scheda.nome} di ${r.attivita}.` },
      { tipo: "titoletto", testo: "Cosa succede adesso" },
      { tipo: "passi", passi: [
        "Ti arriva una email da Google con la nostra richiesta di accesso alla tua attività: tocca Approva. Se non la trovi, ti scriviamo noi su WhatsApp.",
        "Da lì aggiorniamo la tua attività su Google ogni settimana e rispondiamo alle recensioni.",
        isTipoExtra(r.nfc_tipo) ? `Ti spediamo ${r.nfc_tipo === "card" ? "la card" : "il piedistallo"} già pronto all'uso e ti avvisiamo quando parte.` : "Tu vedi i risultati direttamente su Google Maps.",
      ] },
      { tipo: "bottone", testo: "Gestisci o disdici l'abbonamento →", url: gestisci },
      { tipo: "nota", testo: "Puoi disdire quando vuoi da quel link: il servizio resta attivo fino alla fine del mese già pagato. Conserva questa email." },
    ],
  });
  await Promise.allSettled([
    resend.emails.send({ from, to, replyTo: r.email, subject: `Pagamento ricevuto: ${r.attivita}${r.nfc_tipo ? ` · ${r.nfc_tipo} da spedire` : ""}`, ...interna }),
    resend.emails.send({ from, to: r.email, replyTo: to[0], subject: `Il servizio è attivo · ${scheda.nome}`, ...cliente }),
  ]).then((x) => x.forEach((y) => y.status === "rejected" && console.error("[scheda] email attivazione", y.reason)));
}
