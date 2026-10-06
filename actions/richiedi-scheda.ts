"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { track } from "@vercel/analytics/server";
import { Resend } from "resend";
import { z } from "zod";
import { db } from "@/lib/db";
import { email, TITROVANO } from "@/lib/email";
import { isRateLimited } from "@/lib/rate-limit";
import { EXTRA, euro, isLinkMaps, isTipoExtra, scheda, type TipoExtra } from "@/lib/scheda";
import { firmaRichiesta } from "@/lib/scheda-token";
import { pagamentiAttivi } from "@/lib/stripe";

export type StatoScheda =
  | { status: "idle" }
  | { status: "success"; extra: TipoExtra | null; token?: string }
  | { status: "error"; message: string; fieldErrors?: Record<string, string>; values?: Record<string, string>; attempt: number };

const CAMPI = ["attivita", "citta", "nome", "whatsapp", "email", "link_maps", "nfc", "sped_via", "sped_cap", "sped_citta", "sped_provincia", "sped_presso", "privacy"];

const base = z.object({
  attivita: z.string().trim().min(2, "Scrivi il nome della tua attività.").max(120),
  citta: z.string().trim().min(2, "Scrivi la città.").max(80),
  nome: z.string().trim().min(2, "Scrivi nome e cognome.").max(80),
  whatsapp: z.string().trim().regex(/^[+\d][\d\s./-]{5,19}$/, "Controlla il numero WhatsApp."),
  email: z.string().trim().email("Controlla l'indirizzo email.").max(160),
  link_maps: z.string().trim().max(500).optional().default(""),
  privacy: z.literal("on", { message: "Serve il consenso per poterti ricontattare." }),
});

export async function richiediScheda(prev: StatoScheda, fd: FormData): Promise<StatoScheda> {
  const attempt = (prev.status === "error" ? prev.attempt : 0) + 1;
  const values = Object.fromEntries(CAMPI.map((k) => [k, String(fd.get(k) ?? "")]));
  if (String(fd.get("sito_web") ?? "").trim()) return { status: "success", extra: null }; // honeypot

  const extra = isTipoExtra(fd.get("nfc")) ? (fd.get("nfc") as TipoExtra) : null;
  const nfc = extra !== null;
  const fieldErrors: Record<string, string> = {};
  const p = base.safeParse(Object.fromEntries(fd));
  if (!p.success) for (const i of p.error.issues) fieldErrors[String(i.path[0])] ??= i.message;

  const link = values.link_maps.trim();
  if (link && !isLinkMaps(link)) fieldErrors.link_maps = "Questo non sembra un link di Google Maps. Su Maps apri la tua attività, tocca Condividi e copia il link.";
  if (nfc && !link) fieldErrors.link_maps = `Per ${extra === "card" ? "la card" : "il piedistallo"} serve il link della tua attività su Google Maps.`;
  const sped = {
    via: values.sped_via.trim(), cap: values.sped_cap.trim(), citta: values.sped_citta.trim(),
    provincia: values.sped_provincia.trim().toUpperCase(), presso: values.sped_presso.trim(),
  };
  if (nfc) {
    if (sped.via.length < 3) fieldErrors.sped_via = "Scrivi via e numero civico.";
    if (!/^\d{5}$/.test(sped.cap)) fieldErrors.sped_cap = "Il CAP ha 5 cifre.";
    if (sped.citta.length < 2) fieldErrors.sped_citta = "Scrivi la città di spedizione.";
    if (!/^[A-Z]{2}$/.test(sped.provincia)) fieldErrors.sped_provincia = "Scrivi la sigla della provincia, es. MI.";
  }
  if (Object.keys(fieldErrors).length || !p.success) {
    return { status: "error", message: "Controlla i campi evidenziati.", fieldErrors, values, attempt };
  }
  const d = p.data;

  const h = await headers();
  if (isRateLimited(`scheda:${h.get("x-forwarded-for")?.split(",")[0]?.trim() || "?"}`)) {
    return { status: "error", message: "Hai già inviato diverse richieste. Riprova tra qualche minuto.", values, attempt };
  }

  let nuovoId = 0;
  try {
    const [nuova] = (await db()`insert into richieste_scheda (attivita, citta, nome, whatsapp, email, link_maps, card_nfc, nfc_tipo,
        sped_via, sped_cap, sped_citta, sped_provincia, sped_presso)
      values (${d.attivita}, ${d.citta}, ${d.nome}, ${d.whatsapp}, ${d.email}, ${link || null}, ${nfc}, ${extra},
        ${nfc ? sped.via : null}, ${nfc ? sped.cap : null}, ${nfc ? sped.citta : null}, ${nfc ? sped.provincia : null}, ${nfc ? sped.presso || null : null}) returning id`) as { id: number }[];
    nuovoId = nuova.id;
  } catch (e) {
    console.error("[richiedi-scheda] salvataggio", e);
    return { status: "error", message: "Non siamo riusciti a ricevere la richiesta. Riprova tra qualche minuto o scrivici su WhatsApp.", values, attempt };
  }

  const token = firmaRichiesta(nuovoId);
  const pagamenti = pagamentiAttivi();
  const key = process.env.RESEND_API_KEY, from = process.env.RESEND_FROM;
  const to = process.env.LEAD_TO_EMAIL?.split(",").map((s) => s.trim()).filter(Boolean);
  if (key && from && to?.length) {
    const resend = new Resend(key);
    const totale = `${euro(scheda.prezzoMese)}/mese${extra ? ` + ${euro(EXTRA[extra].prezzo)} una tantum (${EXTRA[extra].nome.toLowerCase()})` : ""}`;
    const righe: [string, string][] = [
      ["Attività", d.attivita], ["Città", d.citta], ["Nome", d.nome],
      ["WhatsApp", d.whatsapp], ["Email", d.email], ["Google Maps", link || "—"],
      ["Da banco", extra ? EXTRA[extra].nome : "No"],
      ...(nfc ? ([["Spedizione", `${sped.presso ? `c/o ${sped.presso}\n` : ""}${sped.via}\n${sped.cap} ${sped.citta} (${sped.provincia})`]] as [string, string][]) : []),
      ["Totale", totale],
    ];
    const wa = `https://wa.me/${d.whatsapp.replace(/\D/g, "").replace(/^(?!39)(\d{9,10})$/, "39$1")}`;
    const notifica = email({
      marchio: TITROVANO,
      anteprima: `${d.attivita} · ${d.citta}${extra ? ` · con ${EXTRA[extra].nome.toLowerCase()}` : ""}`,
      titolo: `Nuova richiesta Google Maps: ${d.attivita}`,
      evidenzia: "Google Maps",
      blocchi: [
        { tipo: "righe", righe },
        { tipo: "bottone", testo: `Scrivi a ${d.nome} su WhatsApp →`, url: wa },
        { tipo: "nota", testo: pagamenti ? "Il cliente è stato mandato alla cassa: se paga, ricevi l'email \"Pagamento ricevuto\". Se non la ricevi, non ha completato il pagamento: scrivigli tu." : "Pagamento online non attivo: concorda attivazione e pagamento direttamente con il cliente." },
      ],
    });
    // Con i pagamenti attivi la ricevuta al cliente non serve: va dritto alla
    // cassa e, se paga, riceve la conferma di attivazione. Se la chiude a metà,
    // te ne accorgi dalla notifica qui sopra senza "Pagamento ricevuto".
    const ricevuta = email({
      marchio: TITROVANO,
      anteprima: "Abbiamo ricevuto la tua richiesta.",
      titolo: `Ciao ${d.nome}, abbiamo ricevuto la tua richiesta`,
      evidenzia: "ricevuto",
      blocchi: [
        { tipo: "p", testo: `Grazie: abbiamo ricevuto la richiesta di ${scheda.nome} per ${d.attivita}.` },
        { tipo: "righe", righe: [["Servizio", `${euro(scheda.prezzoMese)}/mese, nessun costo di attivazione, disdici quando vuoi`], ...(extra ? ([[EXTRA[extra].nome, `${euro(EXTRA[extra].prezzo)} una tantum, spedizione inclusa`]] as [string, string][]) : [])] },
        { tipo: "titoletto", testo: "Cosa succede adesso" },
        { tipo: "passi", passi: [
          "Ti contattiamo per completare l'attivazione.",
          "Ti arriva una email da Google con la nostra richiesta di accesso alla tua attività: tocchi Approva e basta.",
          "Da lì aggiorniamo la tua attività su Google ogni settimana.",
        ] },
        { tipo: "nota", testo: "Hai domande? Rispondi a questa email." },
      ],
    });
    await Promise.allSettled([
      resend.emails.send({ from, to, replyTo: d.email, subject: `Nuova richiesta Google Maps: ${d.attivita} (${d.citta})${extra ? ` + ${extra}` : ""}`, ...notifica }),
      ...(pagamenti ? [] : [resend.emails.send({ from, to: d.email, replyTo: to[0], subject: `Abbiamo ricevuto la tua richiesta · ${scheda.nome}`, ...ricevuta })]),
    ]).then((r) => r.forEach((x) => x.status === "rejected" && console.error("[richiedi-scheda] email", x.reason)));
  } else if (process.env.NODE_ENV !== "production") {
    console.warn("[richiedi-scheda] Resend non configurato: richiesta salvata, email non inviate.");
  }
  // Con i pagamenti attivi il modulo porta dritto alla cassa: nessun secondo
  // clic su "Paga e attiva", che era il punto in cui il funnel perdeva gente.
  if (pagamenti) {
    // L'evento del modulo non parte piu' dal browser, che lascia la pagina
    // subito: si registra qui, con lo stesso nome di prima.
    await track("Google Maps richiesta", { extra: extra ?? "nessuno" }).catch(() => {});
    redirect(`/attiva/paga?t=${encodeURIComponent(token)}`);
  }
  return { status: "success", extra, token };
}
