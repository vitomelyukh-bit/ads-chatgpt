"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { creaOrdineBanco, ordineSenzaPagamento } from "@/lib/banco";
import { opzioneScelta } from "@/lib/packlink";
import { isRateLimited } from "@/lib/rate-limit";
import { EXTRA, isTipoExtra } from "@/lib/scheda";
import { site } from "@/lib/site";
import { stripe } from "@/lib/stripe";

// Checkout di card e piedistallo sul sito: spedizione + dati del cliente insieme, poi Stripe solo per la carta.
// Il prezzo della spedizione lo richiede di nuovo il server a Packlink: il browser manda solo l'id del servizio.
export type StatoOrdine = { errore?: string; campi?: Record<string, string>; valori?: Record<string, string> } | null;

const schema = z.object({
  nome: z.string().trim().min(3, "Scrivi nome e cognome.").max(80),
  email: z.string().trim().email("Controlla l'email.").max(160),
  telefono: z.string().trim().regex(/^[+\d][\d\s./-]{5,19}$/, "Controlla il numero di telefono."),
  attivita: z.string().trim().min(2, "Scrivi il nome della tua attività o il link Google Maps.").max(300),
  via: z.string().trim().min(3, "Scrivi via e numero civico.").max(120),
  citta: z.string().trim().min(2, "Scrivi la città.").max(80),
  provincia: z.string().trim().toUpperCase().regex(/^[A-Z]{2}$/, "Sigla della provincia, es. RM."),
  presso: z.string().trim().max(80).optional().default(""),
});

export async function ordinaBanco(_: StatoOrdine, fd: FormData): Promise<StatoOrdine> {
  const tipo = String(fd.get("tipo") ?? ""), cap = String(fd.get("cap") ?? ""), servizio = String(fd.get("servizio") ?? "");
  const [puntoId, ...puntoNome] = String(fd.get("punto") ?? "").split("|");
  const valori = Object.fromEntries(["nome", "email", "telefono", "attivita", "via", "citta", "provincia", "presso"].map((k) => [k, String(fd.get(k) ?? "")]));
  if (!isTipoExtra(tipo) || !/^\d{5}$/.test(cap) || !servizio) return { errore: "Scegli prima la spedizione.", valori };
  const p = schema.safeParse(Object.fromEntries(fd));
  if (!p.success) {
    const campi: Record<string, string> = {};
    for (const i of p.error.issues) campi[String(i.path[0])] ??= i.message;
    return { errore: "Controlla i campi evidenziati.", campi, valori };
  }
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "?";
  if (isRateLimited(`ordine:${ip}`, Date.now(), 10)) return { errore: "Troppi tentativi, riprova tra qualche minuto.", valori };

  const sped = await opzioneScelta(tipo, cap, servizio).catch(() => null);
  if (!sped) return { errore: "La spedizione scelta non è più disponibile per questo CAP: scegline un'altra.", valori };
  if (sped.puntoRitiro && !puntoId) return { errore: "Scegli il punto di ritiro sulla mappa.", valori };

  const d = p.data;
  const o = await creaOrdineBanco({
    tipo, nome: d.nome, email: d.email, telefono: d.telefono, attivita: d.attivita, via: d.via, cap, citta: d.citta, provincia: d.provincia, presso: d.presso || null,
    spedizione_servizio: sped.id, spedizione_costo: sped.prezzo, corriere: sped.corriere,
    punto_ritiro: sped.puntoRitiro ? puntoNome.join("|") : null, punto_ritiro_id: sped.puntoRitiro ? puntoId : null, prezzo_prodotto: EXTRA[tipo].prezzo,
  });

  const prezzo = process.env[EXTRA[tipo].priceEnv];
  if (!process.env.STRIPE_SECRET_KEY || !prezzo) {
    await ordineSenzaPagamento(o);
    redirect("/acquisto/grazie?ricevuto=1");
  }
  const session = await stripe().checkout.sessions.create({
    mode: "payment",
    customer_email: d.email,
    locale: "it",
    line_items: [
      { price: prezzo, quantity: 1 },
      { quantity: 1, price_data: { currency: "eur", unit_amount: Math.round(sped.prezzo * 100), product_data: { name: `Spedizione · ${sped.corriere} · ${sped.puntoRitiro ? "ritiro al punto" : "a domicilio"}`.slice(0, 120) } } },
    ],
    metadata: { ordine: "banco", ordine_id: String(o.id), tipo },
    payment_intent_data: { metadata: { ordine: "banco", ordine_id: String(o.id) } },
    success_url: `${site.url}/acquisto/grazie?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${site.url}/compra/${tipo}`,
  });
  redirect(session.url!);
}
