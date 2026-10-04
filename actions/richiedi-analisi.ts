"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { z } from "zod";
import { isRateLimited } from "@/lib/rate-limit";
import { firmaLead } from "@/lib/lead-token";
import { email, TITROVANO } from "@/lib/email";
import { site } from "@/lib/site";

export type FormState =
  | { status: "idle" }
  | { status: "success"; settore: string; token?: string | null }
  | {
      status: "error";
      message: string;
      fieldErrors?: Record<string, string>;
      // Valori inviati: React svuota il form dopo l'invio, li rimettiamo noi.
      values?: Record<string, string>;
      attempt: number;
    };

const schema = z.object({
  nome: z.string().trim().min(2, "Scrivi il tuo nome.").max(80),
  attivita: z.string().trim().min(2, "Scrivi il nome dell'attività o dell'azienda.").max(120),
  sito: z.string().trim().max(200).optional().default(""),
  settore: z.string({ message: "Scegli un settore." }).trim().min(1, "Scegli un settore.").max(80),
  citta: z.string().trim().max(80).optional().default(""),
  budget: z.string({ message: "Scegli un'opzione." }).trim().min(1, "Scegli un'opzione.").max(60),
  email: z.string().trim().email("Controlla l'indirizzo email.").max(160),
  telefono: z
    .string()
    .trim()
    .regex(/^[+\d][\d\s./-]{5,19}$/, "Controlla il numero di telefono."),
  privacy: z.literal("on", { message: "Serve il consenso per poterti ricontattare." }),
});

const tokenLead = (d: { nome: string; attivita: string; sito: string; settore: string; citta: string; budget: string; email: string; telefono: string }) =>
  firmaLead({ nome: d.nome, attivita: d.attivita, sito: d.sito, settore: d.settore, citta: d.citta, budget: d.budget, email: d.email, telefono: d.telefono });


export async function richiediAnalisi(prev: FormState, formData: FormData): Promise<FormState> {
  const attempt = (prev.status === "error" ? prev.attempt : 0) + 1;
  const values = Object.fromEntries(
    ["nome", "attivita", "sito", "settore", "citta", "budget", "email", "telefono", "privacy"].map((k) => [k, String(formData.get(k) ?? "")]),
  );

  // Honeypot: un campo invisibile che solo i bot compilano. Rispondiamo
  // "ok" senza inviare nulla, così il bot non capisce di essere stato fermato.
  if (String(formData.get("sito_web") ?? "").trim() !== "") {
    return { status: "success", settore: "" };
  }

  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      fieldErrors[key] ??= issue.message;
    }
    return { status: "error", message: "Controlla i campi evidenziati.", fieldErrors, values, attempt };
  }
  const d = parsed.data;

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "sconosciuto";
  if (isRateLimited(ip)) {
    return {
      status: "error",
      message: "Hai già inviato diverse richieste. Riprova tra qualche minuto.",
      values,
      attempt,
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  const to = process.env.LEAD_TO_EMAIL?.split(",").map((s) => s.trim()).filter(Boolean);

  if (!apiKey || !from || !to?.length) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[richiedi-analisi] Resend non configurato, richiesta solo registrata:", d);
      return { status: "success", settore: d.settore, token: tokenLead(d) };
    }
    console.error("[richiedi-analisi] Mancano RESEND_API_KEY, RESEND_FROM o LEAD_TO_EMAIL.");
    return { status: "error", message: "Al momento non riusciamo a ricevere la richiesta. Riprova più tardi.", values, attempt };
  }

  const resend = new Resend(apiKey);
  const righe: [string, string][] = [
    ["Nome", d.nome],
    ["Attività / azienda", d.attivita],
    ["Sito", d.sito || "—"],
    ["Settore", d.settore],
    ["Città / zona", d.citta || "—"],
    ["Budget pubblicitario indicativo", d.budget],
    ["Email", d.email],
    ["Telefono", d.telefono],
  ];

  const quando = new Date().toLocaleString("it-IT", { timeZone: "Europe/Rome", dateStyle: "long", timeStyle: "short" });
  const notifica = email({
    marchio: TITROVANO,
    anteprima: `${d.attivita} · ${d.settore} · budget ${d.budget}`,
    titolo: `Nuova richiesta di analisi: ${d.attivita}`,
    evidenzia: "analisi",
    blocchi: [
      { tipo: "righe", righe },
      { tipo: "bottone", testo: `Chiama ${d.nome} →`, url: `tel:${d.telefono.replace(/\s/g, "")}` },
      { tipo: "nota", testo: `Inviata il ${quando}. Consenso privacy: sì.\nSe ha scelto un orario, ti arriva anche l'email "Call prenotata".` },
    ],
  });
  const interna = await resend.emails.send({
    from,
    to,
    replyTo: d.email,
    subject: `Nuova richiesta di analisi: ${d.attivita}${d.citta ? ` (${d.citta})` : ""}`,
    ...notifica,
  });

  if (interna.error) {
    console.error("[richiedi-analisi] Invio interno fallito:", interna.error);
    return { status: "error", message: "Non siamo riusciti a inviare la richiesta. Riprova tra qualche minuto.", values, attempt };
  }

  // Ricevuta per chi ha compilato. Se fallisce la richiesta è comunque arrivata:
  // lo registriamo e mostriamo lo stesso la conferma.
  const ricevutaEmail = email({
    marchio: TITROVANO,
    anteprima: "Ecco cosa succede adesso.",
    titolo: `Ciao ${d.nome}, abbiamo ricevuto la tua richiesta`,
    evidenzia: "ricevuto",
    blocchi: [
      { tipo: "p", testo: `Grazie: abbiamo ricevuto la richiesta di analisi gratuita per ${d.attivita}.` },
      { tipo: "titoletto", testo: "Cosa succede adesso" },
      { tipo: "passi", passi: [
        "Guardiamo il tuo settore e le domande che i tuoi clienti fanno a ChatGPT.",
        "Valutiamo se gli annunci su ChatGPT hanno senso per te, quale canale conviene di più (ChatGPT, Google, Meta o SEO) e con quale budget di partenza.",
        "Ti chiamiamo per fissare una breve call e parlarne. Se non fanno per te, te lo diciamo.",
      ] },
      { tipo: "p", testo: "Se vuoi aggiungere qualcosa, rispondi a questa email." },
      { tipo: "bottone", testo: "Leggi le guide su ChatGPT →", url: `${site.url}/guide` },
    ],
  });
  const ricevuta = await resend.emails.send({
    from,
    to: d.email,
    replyTo: to[0],
    subject: `Abbiamo ricevuto la tua richiesta · ${site.name}`,
    ...ricevutaEmail,
  });
  if (ricevuta.error) console.error("[richiedi-analisi] Ricevuta non inviata:", ricevuta.error);

  return { status: "success", settore: d.settore, token: tokenLead(d) };
}
