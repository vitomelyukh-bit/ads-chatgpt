"use server";

import { redirect } from "next/navigation";
import { EXTRA, isTipoExtra, linkWhatsApp } from "@/lib/scheda";
import { tariffaItalia } from "@/lib/packlink";
import { site } from "@/lib/site";
import { stripe } from "@/lib/stripe";

// "Compralo ora": pagamento una tantum su Stripe, con indirizzo di spedizione, telefono e spedizione Packlink.
// Se i pagamenti non sono attivi, porta su WhatsApp con il messaggio già scritto.
export async function compraBanco(tipo: string) {
  if (!isTipoExtra(tipo)) redirect("/#da-banco");
  const prezzo = process.env[EXTRA[tipo].priceEnv];
  if (!process.env.STRIPE_SECRET_KEY || !prezzo) {
    const wa = linkWhatsApp()?.replace(/\?text=.*/, "");
    redirect(wa ? `${wa}?text=${encodeURIComponent(`Ciao, vorrei ordinare il ${EXTRA[tipo].nome.toLowerCase()} per le recensioni`)}` : "/#attiva");
  }
  // Spedizione: tariffa Packlink calcolata adesso dal server (il cliente non può modificarla).
  const t = await tariffaItalia(tipo);
  const session = await stripe().checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: prezzo, quantity: 1 }],
    locale: "it",
    shipping_address_collection: { allowed_countries: ["IT", "SM", "VA"] },
    phone_number_collection: { enabled: true },
    shipping_options: [{
      shipping_rate_data: {
        type: "fixed_amount",
        fixed_amount: { amount: Math.round(t.prezzo * 100), currency: "eur" },
        display_name: t.forfait ? "Spedizione con corriere" : `${t.corriere} · consegna a domicilio`,
        ...(t.giorni ? { delivery_estimate: { minimum: { unit: "business_day" as const, value: t.giorni }, maximum: { unit: "business_day" as const, value: t.giorni + 3 } } } : {}),
      },
    }],
    custom_fields: [{ key: "attivita", label: { type: "custom", custom: "Nome attività o link Google Maps" }, type: "text" }],
    metadata: { ordine: "banco", tipo, servizio: t.serviceId, corriere: t.corriere, spedizione: String(t.prezzo) },
    payment_intent_data: { metadata: { ordine: "banco", tipo } },
    success_url: `${site.url}/acquisto/grazie?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${site.url}/#da-banco`,
  });
  redirect(session.url!);
}
