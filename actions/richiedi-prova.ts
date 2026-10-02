"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { z } from "zod";
import { isRateLimited } from "@/lib/rate-limit";
import { site } from "@/lib/site";

export type FormState =
  | { status: "idle" }
  | { status: "success"; settore: string }
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
  attivita: z.string().trim().min(2, "Scrivi il nome della tua attività.").max(120),
  settore: z.string({ message: "Scegli un settore." }).trim().min(1, "Scegli un settore.").max(80),
  citta: z.string().trim().min(2, "Scrivi la città.").max(80),
  email: z.string().trim().email("Controlla l'indirizzo email.").max(160),
  telefono: z
    .string()
    .trim()
    .regex(/^[+\d][\d\s./-]{5,19}$/, "Controlla il numero di telefono."),
  privacy: z.literal("on", { message: "Serve il consenso per poterti ricontattare." }),
});

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function richiediProva(prev: FormState, formData: FormData): Promise<FormState> {
  const attempt = (prev.status === "error" ? prev.attempt : 0) + 1;
  const values = Object.fromEntries(
    ["nome", "attivita", "settore", "citta", "email", "telefono", "privacy"].map((k) => [k, String(formData.get(k) ?? "")]),
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
      console.warn("[richiedi-prova] Resend non configurato, richiesta solo registrata:", d);
      return { status: "success", settore: d.settore };
    }
    console.error("[richiedi-prova] Mancano RESEND_API_KEY, RESEND_FROM o LEAD_TO_EMAIL.");
    return { status: "error", message: "Al momento non riusciamo a ricevere la richiesta. Riprova più tardi.", values, attempt };
  }

  const resend = new Resend(apiKey);
  const righe: [string, string][] = [
    ["Nome", d.nome],
    ["Attività", d.attivita],
    ["Settore", d.settore],
    ["Città", d.citta],
    ["Email", d.email],
    ["Telefono", d.telefono],
  ];

  const interna = await resend.emails.send({
    from,
    to,
    replyTo: d.email,
    subject: `Nuova richiesta di prova: ${d.attivita} (${d.citta})`,
    text: righe.map(([k, v]) => `${k}: ${v}`).join("\n") + `\n\nConsenso privacy: sì\nInviata il: ${new Date().toISOString()}`,
    html:
      `<h2>Nuova richiesta di prova gratuita</h2><table cellpadding="6">` +
      righe.map(([k, v]) => `<tr><td><strong>${k}</strong></td><td>${escape(v)}</td></tr>`).join("") +
      `</table><p>Consenso privacy: sì<br>Inviata il: ${new Date().toISOString()}</p>`,
  });

  if (interna.error) {
    console.error("[richiedi-prova] Invio interno fallito:", interna.error);
    return { status: "error", message: "Non siamo riusciti a inviare la richiesta. Riprova tra qualche minuto.", values, attempt };
  }

  // Ricevuta per chi ha compilato. Se fallisce la richiesta è comunque arrivata:
  // lo registriamo e mostriamo lo stesso la conferma.
  const ricevuta = await resend.emails.send({
    from,
    to: d.email,
    replyTo: to[0],
    subject: `Abbiamo ricevuto la tua richiesta · ${site.name}`,
    text: [
      `Ciao ${d.nome},`,
      "",
      `abbiamo ricevuto la richiesta di prova gratuita per ${d.attivita} (${d.citta}).`,
      "",
      "Cosa succede adesso:",
      "1. Prepariamo 20 domande che i clienti di un'attività come la tua farebbero a ChatGPT, Gemini e Perplexity.",
      "2. Le facciamo davvero e annotiamo chi viene consigliato.",
      "3. Ti consegniamo una pagina con quante volte esce il tuo nome, quante quello dei concorrenti, e perché.",
      "",
      "Ti ricontattiamo noi. Se vuoi aggiungere qualcosa, rispondi a questa email.",
      "",
      `${site.name}`,
      site.url,
    ].join("\n"),
  });
  if (ricevuta.error) console.error("[richiedi-prova] Ricevuta non inviata:", ricevuta.error);

  return { status: "success", settore: d.settore };
}
