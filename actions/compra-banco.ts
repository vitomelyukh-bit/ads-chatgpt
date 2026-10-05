"use server";

import { redirect } from "next/navigation";
import { EXTRA, isTipoExtra, linkWhatsApp } from "@/lib/scheda";
import { site } from "@/lib/site";
import { stripe } from "@/lib/stripe";

// "Compralo ora": pagamento una tantum su Stripe, con indirizzo di spedizione e telefono.
// Se i pagamenti non sono attivi, porta su WhatsApp con il messaggio già scritto.
export async function compraBanco(tipo: string) {
  if (!isTipoExtra(tipo)) redirect("/#da-banco");
  const prezzo = process.env[EXTRA[tipo].priceEnv];
  if (!process.env.STRIPE_SECRET_KEY || !prezzo) {
    const wa = linkWhatsApp()?.replace(/\?text=.*/, "");
    redirect(wa ? `${wa}?text=${encodeURIComponent(`Ciao, vorrei ordinare il ${EXTRA[tipo].nome.toLowerCase()} per le recensioni`)}` : "/#attiva");
  }
  const session = await stripe().checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: prezzo, quantity: 1 }],
    locale: "it",
    shipping_address_collection: { allowed_countries: ["IT", "SM", "VA"] },
    phone_number_collection: { enabled: true },
    custom_fields: [{ key: "attivita", label: { type: "custom", custom: "Nome attività o link Google Maps" }, type: "text" }],
    metadata: { ordine: "banco", tipo },
    payment_intent_data: { metadata: { ordine: "banco", tipo } },
    success_url: `${site.url}/acquisto/grazie?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${site.url}/#da-banco`,
  });
  redirect(session.url!);
}
