import { Resend } from "resend";
import type Stripe from "stripe";
import { db } from "@/lib/db";
import { email, TITROVANO, type Blocco } from "@/lib/email";
import { firmaRichiesta } from "@/lib/scheda-token";
import { scheda } from "@/lib/scheda";
import { site } from "@/lib/site";

export type RichiestaScheda = {
  id: number; attivita: string; citta: string; categoria: string; nome: string; whatsapp: string; email: string;
  link_maps: string | null; card_nfc: boolean; sped_via: string | null; sped_cap: string | null; sped_citta: string | null;
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
  if (r.card_nfc) {
    const [c] = (await db()`update nfc_codici set richiesta_id = ${r.id}, assegnato_il = now()
      where codice = (select codice from nfc_codici where richiesta_id is null and tipo = 'card' order by creato_il, codice limit 1 for update skip locked)
      returning codice`) as { codice: string }[];
    codice = c?.codice ?? null;
  }
  await emailAttivazione(r, codice);
  return r;
}

function blocchiCard(card: boolean, codice: string | null, indirizzo: string): Blocco[] {
  if (!card) return [];
  if (!codice) return [{ tipo: "evidenza", etichetta: "Attenzione", testo: "Codici NFC esauriti: genera nuovi codici dalla console e assegnane uno." }];
  return [
    { tipo: "evidenza", etichetta: "Card da spedire", testo: `Codice ${codice}` },
    { tipo: "righe", righe: [["Indirizzo", indirizzo], ["Link della card", `${site.url}/r/${codice}`]] },
  ];
}

async function emailAttivazione(r: RichiestaScheda, codice: string | null) {
  const key = process.env.RESEND_API_KEY, from = process.env.RESEND_FROM;
  const to = process.env.LEAD_TO_EMAIL?.split(",").map((s) => s.trim()).filter(Boolean);
  if (!key || !from || !to?.length) return;
  const resend = new Resend(key);
  const gestisci = `${site.url}/scheda-google/gestisci?t=${firmaRichiesta(r.id)}`;
  const indirizzo = r.card_nfc ? `${r.sped_presso ? `c/o ${r.sped_presso}\n` : ""}${r.sped_via}\n${r.sped_cap} ${r.sped_citta} (${r.sped_provincia})` : "";

  const interna = email({
    marchio: TITROVANO,
    anteprima: `${r.attivita}: pagamento ricevuto${r.card_nfc ? " · card da spedire" : ""}`,
    titolo: `Pagamento ricevuto: ${r.attivita}`,
    evidenzia: "Pagamento ricevuto",
    blocchi: [
      { tipo: "righe", righe: [["Attività", `${r.attivita} · ${r.citta}`], ["Cliente", `${r.nome} · ${r.whatsapp}`], ["Scheda Google Maps", r.link_maps ?? "—"]] },
      ...blocchiCard(r.card_nfc, codice, indirizzo),
      { tipo: "p", testo: "Prossimi passi: scrivi al cliente su WhatsApp per avere l'accesso alla scheda Google e imposta in console il link per le recensioni." },
      { tipo: "bottone", testo: "Apri la console →", url: `${site.url}/console/scheda` },
    ],
  });
  const cliente = email({
    marchio: TITROVANO,
    anteprima: "Il servizio è attivo: ecco cosa succede adesso.",
    titolo: `Ciao ${r.nome}, la tua scheda Google è attiva`,
    evidenzia: "attiva",
    blocchi: [
      { tipo: "p", testo: `Grazie: abbiamo ricevuto il pagamento per ${scheda.nome} di ${r.attivita}.` },
      { tipo: "titoletto", testo: "Cosa succede adesso" },
      { tipo: "passi", passi: [
        "Ti scriviamo su WhatsApp per avere l'accesso alla tua scheda Google: ti guidiamo noi.",
        "Da lì aggiorniamo la scheda ogni settimana e rispondiamo alle recensioni.",
        r.card_nfc ? "Ti spediamo la card NFC già configurata e ti avvisiamo quando parte." : "Tu vedi i risultati direttamente su Google Maps.",
      ] },
      { tipo: "bottone", testo: "Gestisci o disdici l'abbonamento →", url: gestisci },
      { tipo: "nota", testo: "Puoi disdire quando vuoi da quel link: il servizio resta attivo fino alla fine del mese già pagato. Conserva questa email." },
    ],
  });
  await Promise.allSettled([
    resend.emails.send({ from, to, replyTo: r.email, subject: `Pagamento ricevuto: ${r.attivita}${r.card_nfc ? " · card da spedire" : ""}`, ...interna }),
    resend.emails.send({ from, to: r.email, replyTo: to[0], subject: `La tua scheda Google è attiva · ${site.name}`, ...cliente }),
  ]).then((x) => x.forEach((y) => y.status === "rejected" && console.error("[scheda] email attivazione", y.reason)));
}
