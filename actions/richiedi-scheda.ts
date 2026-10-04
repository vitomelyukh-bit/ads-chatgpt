"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { z } from "zod";
import { db } from "@/lib/db";
import { email, TITROVANO } from "@/lib/email";
import { isRateLimited } from "@/lib/rate-limit";
import { isLinkMaps, linkWhatsApp, scheda } from "@/lib/scheda";

export type StatoScheda =
  | { status: "idle" }
  | { status: "success"; nfc: boolean }
  | { status: "error"; message: string; fieldErrors?: Record<string, string>; values?: Record<string, string>; attempt: number };

const CAMPI = ["attivita", "citta", "categoria", "nome", "whatsapp", "email", "link_maps", "nfc", "sped_via", "sped_cap", "sped_citta", "sped_provincia", "sped_presso", "privacy"];

const base = z.object({
  attivita: z.string().trim().min(2, "Scrivi il nome della tua attività.").max(120),
  citta: z.string().trim().min(2, "Scrivi la città.").max(80),
  categoria: z.string({ message: "Scegli una categoria." }).trim().min(1, "Scegli una categoria.").max(80),
  nome: z.string().trim().min(2, "Scrivi nome e cognome.").max(80),
  whatsapp: z.string().trim().regex(/^[+\d][\d\s./-]{5,19}$/, "Controlla il numero WhatsApp."),
  email: z.string().trim().email("Controlla l'indirizzo email.").max(160),
  link_maps: z.string().trim().max(500).optional().default(""),
  privacy: z.literal("on", { message: "Serve il consenso per poterti ricontattare." }),
});

export async function richiediScheda(prev: StatoScheda, fd: FormData): Promise<StatoScheda> {
  const attempt = (prev.status === "error" ? prev.attempt : 0) + 1;
  const values = Object.fromEntries(CAMPI.map((k) => [k, String(fd.get(k) ?? "")]));
  if (String(fd.get("sito_web") ?? "").trim()) return { status: "success", nfc: false }; // honeypot

  const nfc = fd.get("nfc") === "on";
  const fieldErrors: Record<string, string> = {};
  const p = base.safeParse(Object.fromEntries(fd));
  if (!p.success) for (const i of p.error.issues) fieldErrors[String(i.path[0])] ??= i.message;

  const link = values.link_maps.trim();
  if (link && !isLinkMaps(link)) fieldErrors.link_maps = "Incolla il link della tua scheda Google Maps (inizia con google.com/maps, maps.app.goo.gl, g.page o g.co).";
  if (nfc && !link) fieldErrors.link_maps = "Per la card NFC serve il link della tua scheda Google Maps.";
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

  try {
    await db()`insert into richieste_scheda (attivita, citta, categoria, nome, whatsapp, email, link_maps, card_nfc,
        sped_via, sped_cap, sped_citta, sped_provincia, sped_presso)
      values (${d.attivita}, ${d.citta}, ${d.categoria}, ${d.nome}, ${d.whatsapp}, ${d.email}, ${link || null}, ${nfc},
        ${nfc ? sped.via : null}, ${nfc ? sped.cap : null}, ${nfc ? sped.citta : null}, ${nfc ? sped.provincia : null}, ${nfc ? sped.presso || null : null})`;
  } catch (e) {
    console.error("[richiedi-scheda] salvataggio", e);
    return { status: "error", message: "Non siamo riusciti a ricevere la richiesta. Riprova tra qualche minuto o scrivici su WhatsApp.", values, attempt };
  }

  const key = process.env.RESEND_API_KEY, from = process.env.RESEND_FROM;
  const to = process.env.LEAD_TO_EMAIL?.split(",").map((s) => s.trim()).filter(Boolean);
  if (key && from && to?.length) {
    const resend = new Resend(key);
    const totale = scheda.prezzoMese + (nfc ? ` €/mese + ${scheda.prezzoCard} € una tantum (card NFC)` : " €/mese");
    const righe: [string, string][] = [
      ["Attività", d.attivita], ["Città", d.citta], ["Categoria", d.categoria], ["Nome", d.nome],
      ["WhatsApp", d.whatsapp], ["Email", d.email], ["Scheda Google Maps", link || "—"],
      ["Card NFC", nfc ? "Sì" : "No"],
      ...(nfc ? ([["Spedizione", `${sped.presso ? `c/o ${sped.presso}\n` : ""}${sped.via}\n${sped.cap} ${sped.citta} (${sped.provincia})`]] as [string, string][]) : []),
      ["Totale", totale],
    ];
    const wa = `https://wa.me/${d.whatsapp.replace(/\D/g, "").replace(/^(?!39)(\d{9,10})$/, "39$1")}`;
    const notifica = email({
      marchio: TITROVANO,
      anteprima: `${d.attivita} · ${d.citta}${nfc ? " · con card NFC" : ""}`,
      titolo: `Nuova richiesta Scheda Google: ${d.attivita}`,
      evidenzia: "Scheda Google",
      blocchi: [
        { tipo: "righe", righe },
        { tipo: "bottone", testo: `Scrivi a ${d.nome} su WhatsApp →`, url: wa },
        { tipo: "nota", testo: "Pagamento non ancora attivo: concorda attivazione e pagamento direttamente con il cliente." },
      ],
    });
    const ricevuta = email({
      marchio: TITROVANO,
      anteprima: "Ti scriviamo su WhatsApp per attivare il servizio.",
      titolo: `Ciao ${d.nome}, abbiamo ricevuto la tua richiesta`,
      evidenzia: "ricevuto",
      blocchi: [
        { tipo: "p", testo: `Grazie: abbiamo ricevuto la richiesta di ${scheda.nome} per ${d.attivita}.` },
        { tipo: "righe", righe: [["Servizio", `${scheda.prezzoMese} €/mese, nessun costo di attivazione, disdici quando vuoi`], ...(nfc ? ([["Card NFC da banco", `${scheda.prezzoCard} € una tantum, spedizione inclusa`]] as [string, string][]) : [])] },
        { tipo: "titoletto", testo: "Cosa succede adesso" },
        { tipo: "passi", passi: [
          "Ti scriviamo su WhatsApp per attivare il servizio.",
          "Ci dai l'accesso alla tua scheda Google una volta sola: ti guidiamo noi, passo per passo.",
          nfc ? "Da lì aggiorniamo la scheda ogni settimana e ti spediamo la card già configurata." : "Da lì aggiorniamo la scheda ogni settimana: tu vedi i risultati su Google Maps.",
        ] },
        ...(linkWhatsApp() ? [{ tipo: "bottone" as const, testo: "Scrivici su WhatsApp →", url: linkWhatsApp()! }] : []),
        { tipo: "nota", testo: "Hai domande? Rispondi a questa email." },
      ],
    });
    await Promise.allSettled([
      resend.emails.send({ from, to, replyTo: d.email, subject: `Nuova richiesta Scheda Google: ${d.attivita} (${d.citta})${nfc ? " + card NFC" : ""}`, ...notifica }),
      resend.emails.send({ from, to: d.email, replyTo: to[0], subject: `Abbiamo ricevuto la tua richiesta · ${scheda.nome}`, ...ricevuta }),
    ]).then((r) => r.forEach((x) => x.status === "rejected" && console.error("[richiedi-scheda] email", x.reason)));
  } else if (process.env.NODE_ENV !== "production") {
    console.warn("[richiedi-scheda] Resend non configurato: richiesta salvata, email non inviate.");
  }
  return { status: "success", nfc };
}
