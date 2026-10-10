"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { z } from "zod";
import { isRateLimited } from "@/lib/rate-limit";
import { firmaLead } from "@/lib/lead-token";
import { email, TITROVANO } from "@/lib/email";
import { PIATTAFORME, SETTORE_SEO } from "@/lib/seo-locale";
import { site } from "@/lib/site";

export type SeoFormState =
  | { status: "idle" }
  | { status: "success"; token?: string | null }
  | { status: "error"; message: string; fieldErrors?: Record<string, string>; values?: Record<string, string>; attempt: number };

const CAMPI = ["nome", "attivita", "sito", "piattaforma", "citta", "email", "telefono", "privacy", "ref"] as const;

const schema = z.object({
  nome: z.string().trim().min(2, "Scrivi il tuo nome.").max(80),
  attivita: z.string().trim().min(2, "Scrivi il nome dell'attività.").max(120),
  sito: z.string().trim().max(200).optional().default(""),
  piattaforma: z.enum(PIATTAFORME, { message: "Scegli un'opzione." }),
  citta: z.string().trim().min(2, "Scrivi la città o la zona in cui lavori.").max(80),
  email: z.string().trim().email("Controlla l'indirizzo email.").max(160),
  telefono: z.string().trim().regex(/^[+\d][\d\s./-]{5,19}$/, "Controlla il numero di telefono."),
  privacy: z.literal("on", { message: "Serve il consenso per poterti ricontattare." }),
  ref: z.string().trim().max(120).optional().default(""),
});

export async function richiediSeo(prev: SeoFormState, formData: FormData): Promise<SeoFormState> {
  const attempt = (prev.status === "error" ? prev.attempt : 0) + 1;
  const values = Object.fromEntries(CAMPI.map((k) => [k, String(formData.get(k) ?? "")]));

  // Honeypot: i bot compilano anche il campo nascosto.
  if (String(formData.get("sito_web") ?? "").trim() !== "") return { status: "success" };

  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] ??= issue.message;
    return { status: "error", message: "Controlla i campi evidenziati.", fieldErrors, values, attempt };
  }
  const d = parsed.data;

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "sconosciuto";
  if (isRateLimited(ip)) return { status: "error", message: "Hai già inviato diverse richieste. Riprova tra qualche minuto.", values, attempt };

  // Il token permette di prenotare la call subito dopo (vedi PrenotaCall).
  const token = firmaLead({
    nome: d.nome, attivita: d.attivita, sito: d.sito, settore: SETTORE_SEO, citta: d.citta,
    budget: `Piattaforma: ${d.piattaforma}`, email: d.email, telefono: d.telefono,
  });

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  const to = process.env.LEAD_TO_EMAIL?.split(",").map((s) => s.trim()).filter(Boolean);
  if (!apiKey || !from || !to?.length) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[richiedi-seo] Resend non configurato, richiesta solo registrata:", d);
      return { status: "success", token };
    }
    console.error("[richiedi-seo] Mancano RESEND_API_KEY, RESEND_FROM o LEAD_TO_EMAIL.");
    return { status: "error", message: "Al momento non riusciamo a ricevere la richiesta. Riprova più tardi.", values, attempt };
  }

  const resend = new Resend(apiKey);
  const quando = new Date().toLocaleString("it-IT", { timeZone: "Europe/Rome", dateStyle: "long", timeStyle: "short" });
  const interna = await resend.emails.send({
    from,
    to,
    replyTo: d.email,
    subject: `Nuova richiesta SEO locale: ${d.attivita} (${d.citta})`,
    ...email({
      marchio: TITROVANO,
      anteprima: `${d.attivita} · ${d.citta} · ${d.piattaforma}`,
      titolo: `Nuova richiesta SEO locale: ${d.attivita}`,
      evidenzia: "SEO locale",
      blocchi: [
        { tipo: "righe", righe: [
          ["Nome", d.nome],
          ["Attività", d.attivita],
          ["Città / zona", d.citta],
          ["Sito", d.sito || "—"],
          ["Piattaforma", d.piattaforma],
          ["Email", d.email],
          ["Telefono", d.telefono],
          ["Provenienza", d.ref || "—"],
        ] },
        { tipo: "bottone", testo: `Chiama ${d.nome} →`, url: `tel:${d.telefono.replace(/\s/g, "")}` },
        { tipo: "nota", testo: `Inviata il ${quando} dalla pagina riservata /proposta/seo-locale. Consenso privacy: sì.` },
      ],
    }),
  });
  if (interna.error) {
    console.error("[richiedi-seo] Invio interno fallito:", interna.error);
    return { status: "error", message: "Non siamo riusciti a inviare la richiesta. Riprova tra qualche minuto.", values, attempt };
  }

  const ricevuta = await resend.emails.send({
    from,
    to: d.email,
    replyTo: to[0],
    subject: `Abbiamo ricevuto la tua richiesta · ${site.name}`,
    ...email({
      marchio: TITROVANO,
      anteprima: "Ecco cosa succede adesso.",
      titolo: `Ciao ${d.nome}, abbiamo ricevuto la tua richiesta`,
      evidenzia: "ricevuto",
      blocchi: [
        { tipo: "p", testo: `Grazie: guardiamo come ${d.attivita} si vede oggi su Google, a ${d.citta} e dintorni.` },
        { tipo: "titoletto", testo: "Cosa succede adesso" },
        { tipo: "passi", passi: [
          "Controlliamo il tuo sito come lo legge Google: pagine, titoli, velocità da telefono, scheda Google.",
          "Cerchiamo le ricerche che i tuoi clienti fanno nella tua zona e chi compare oggi al posto tuo.",
          "Ti chiamiamo e ti diciamo cosa sistemare, anche se poi decidi di farlo da solo.",
        ] },
        { tipo: "p", testo: "Se vuoi aggiungere qualcosa, rispondi a questa email." },
      ],
    }),
  });
  if (ricevuta.error) console.error("[richiedi-seo] Ricevuta non inviata:", ricevuta.error);

  return { status: "success", token };
}
