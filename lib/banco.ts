import { Resend } from "resend";
import type Stripe from "stripe";
import { db } from "@/lib/db";
import { email, TITROVANO } from "@/lib/email";
import { EXTRA, isTipoExtra, linkWhatsApp } from "@/lib/scheda";
import { site } from "@/lib/site";

// Acquisto diretto di card o piedistallo (senza abbonamento). Idempotente: pagina di ritorno e webhook.
export async function registraOrdineBanco(s: Stripe.Checkout.Session) {
  const tipo = s.metadata?.tipo;
  if (s.metadata?.ordine !== "banco" || !isTipoExtra(tipo) || s.payment_status !== "paid") return null;
  const sped = s.collected_information?.shipping_details ?? (s as unknown as { shipping_details?: { name?: string; address?: Stripe.Address } }).shipping_details;
  const a = sped?.address;
  const indirizzo = a ? [sped?.name, a.line1, a.line2, `${a.postal_code ?? ""} ${a.city ?? ""} ${a.state ? `(${a.state})` : ""}`.trim()].filter(Boolean).join("\n") : "";
  const attivita = s.custom_fields?.find((f) => f.key === "attivita")?.text?.value ?? "";
  const [o] = (await db()`insert into ordini_banco (tipo, stripe_session, nome, email, telefono, indirizzo, attivita, importo)
    values (${tipo}, ${s.id}, ${s.customer_details?.name ?? sped?.name ?? ""}, ${s.customer_details?.email ?? ""}, ${s.customer_details?.phone ?? ""}, ${indirizzo}, ${attivita}, ${(s.amount_total ?? 0) / 100})
    on conflict (stripe_session) do nothing returning *`) as { id: number; nome: string; email: string; telefono: string; indirizzo: string; attivita: string }[];
  if (!o) return null; // già registrato
  const key = process.env.RESEND_API_KEY, from = process.env.RESEND_FROM;
  const to = process.env.LEAD_TO_EMAIL?.split(",").map((x) => x.trim()).filter(Boolean);
  if (key && from && to?.length) {
    const resend = new Resend(key);
    const nome = EXTRA[tipo].nome;
    await Promise.allSettled([
      resend.emails.send({ from, to, replyTo: o.email || undefined, subject: `Nuovo ordine: ${nome} da spedire`, ...email({
        marchio: TITROVANO, anteprima: `${o.attivita || o.nome} · da spedire`, titolo: `${nome} da spedire`, evidenzia: "da spedire",
        blocchi: [
          { tipo: "righe", righe: [["Attività / link", o.attivita || "—"], ["Cliente", `${o.nome}${o.telefono ? ` · ${o.telefono}` : ""}`], ["Email", o.email], ["Indirizzo", o.indirizzo || "—"]] },
          { tipo: "p", testo: "Cosa fare: scrivi sul chip il link per le recensioni della sua attività (con NFC Tools) e spedisci. Poi segnalo come spedito in console." },
          { tipo: "bottone", testo: "Apri la console →", url: `${site.url}/console/maps` },
        ],
      }) }),
      o.email ? resend.emails.send({ from, to: o.email, replyTo: to[0], subject: `Ordine ricevuto: ${nome}`, ...email({
        marchio: TITROVANO, anteprima: "Lo prepariamo e te lo spediamo.", titolo: `Grazie${o.nome ? ` ${o.nome.split(" ")[0]}` : ""}, ordine ricevuto`, evidenzia: "ordine ricevuto",
        blocchi: [
          { tipo: "passi", passi: [`Prepariamo ${tipo === "card" ? "la tua card" : "il tuo piedistallo"} e lo colleghiamo alla pagina delle recensioni della tua attività.`, "Te lo spediamo all'indirizzo che hai indicato e ti avvisiamo quando parte.", "Quando arriva, mettilo vicino alla cassa: il cliente avvicina il telefono e lascia la recensione."] },
          { tipo: "nota", testo: "Se il link della tua attività non ci è chiaro ti scriviamo prima di spedire. Domande? Rispondi a questa email." },
          ...(linkWhatsApp() ? [{ tipo: "bottone" as const, testo: "Scrivici su WhatsApp →", url: linkWhatsApp()! }] : []),
        ],
      }) }) : Promise.resolve(),
    ]).then((r) => r.forEach((x) => x.status === "rejected" && console.error("[banco] email", x.reason)));
  }
  return o;
}
