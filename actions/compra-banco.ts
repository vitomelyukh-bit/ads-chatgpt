"use server";

import { redirect } from "next/navigation";
import { opzioneScelta, tariffaItalia } from "@/lib/packlink";
import { EXTRA, isTipoExtra, linkWhatsApp } from "@/lib/scheda";
import { site } from "@/lib/site";
import { stripe } from "@/lib/stripe";

// Pagamento una tantum di card o piedistallo, con la spedizione scelta dal cliente (corriere, a casa o punto di ritiro).
// Il browser manda solo l'id del servizio: il prezzo lo richiede di nuovo il server a Packlink.
// Se i pagamenti non sono attivi, porta su WhatsApp con il messaggio già scritto.
export async function compraBanco(tipo: string, cap = "", servizioId = "", punto = "") {
  if (!isTipoExtra(tipo)) redirect("/#da-banco");
  const prezzo = process.env[EXTRA[tipo].priceEnv];
  if (!process.env.STRIPE_SECRET_KEY || !prezzo) {
    const wa = linkWhatsApp()?.replace(/\?text=.*/, "");
    redirect(wa ? `${wa}?text=${encodeURIComponent(`Ciao, vorrei ordinare il ${EXTRA[tipo].nome.toLowerCase()} per le recensioni`)}` : "/#attiva");
  }

  const scelta = /^\d{5}$/.test(cap) && servizioId ? await opzioneScelta(tipo, cap, servizioId).catch(() => null) : null;
  const t = scelta ?? (await tariffaItalia(tipo));
  const [puntoId, puntoNome] = scelta?.puntoRitiro ? punto.split("|") : ["", ""];
  if (scelta?.puntoRitiro && !puntoId) redirect(`/compra/${tipo}?errore=punto`);
  const etichetta = scelta ? `${scelta.corriere} · ${scelta.puntoRitiro ? "ritiro al punto" : "a domicilio"}` : "Spedizione con corriere";
  const giorni = "giorni" in t ? t.giorni : null;

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
        display_name: etichetta.slice(0, 100),
        ...(giorni ? { delivery_estimate: { minimum: { unit: "business_day" as const, value: giorni }, maximum: { unit: "business_day" as const, value: giorni + 2 } } } : {}),
      },
    }],
    custom_fields: [{ key: "attivita", label: { type: "custom", custom: "Nome attività o link Google Maps" }, type: "text" }],
    ...(puntoNome ? { custom_text: { shipping_address: { message: `Ritiro al punto: ${puntoNome.slice(0, 200)}. L'indirizzo qui sotto serve al corriere per contattarti.` } } } : {}),
    metadata: { ordine: "banco", tipo, servizio: "serviceId" in t ? t.serviceId : t.id, corriere: t.corriere, spedizione: String(t.prezzo), cap_scelto: cap, punto: puntoId, punto_nome: (puntoNome ?? "").slice(0, 400) },
    payment_intent_data: { metadata: { ordine: "banco", tipo } },
    success_url: `${site.url}/acquisto/grazie?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${site.url}/compra/${tipo}`,
  });
  redirect(session.url!);
}
