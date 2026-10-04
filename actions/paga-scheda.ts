"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import type { RichiestaScheda } from "@/lib/scheda-attivazione";
import { leggiRichiesta } from "@/lib/scheda-token";
import { site } from "@/lib/site";
import { pagamentiAttivi, stripe } from "@/lib/stripe";

// Crea il pagamento Stripe per una richiesta e porta il cliente alla cassa.
export async function pagaScheda(token: string) {
  const id = leggiRichiesta(token);
  if (!id || !pagamentiAttivi()) redirect("/scheda-google#richiesta");
  const [r] = (await db()`select * from richieste_scheda where id = ${id}`) as RichiestaScheda[];
  if (!r) redirect("/scheda-google#richiesta");
  if (r.pagata) redirect(`/scheda-google/grazie?r=${token}`);

  const line_items: { price: string; quantity: number }[] = [{ price: process.env.STRIPE_PRICE_SCHEDA!, quantity: 1 }];
  if (r.card_nfc && process.env.STRIPE_PRICE_CARD) line_items.push({ price: process.env.STRIPE_PRICE_CARD, quantity: 1 });

  const session = await stripe().checkout.sessions.create({
    mode: "subscription",
    line_items,
    customer_email: r.email,
    locale: "it",
    client_reference_id: String(r.id),
    metadata: { richiesta_id: String(r.id), attivita: r.attivita },
    subscription_data: { metadata: { richiesta_id: String(r.id), attivita: r.attivita } },
    success_url: `${site.url}/scheda-google/grazie?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${site.url}/scheda-google?annullato=1#richiesta`,
  });
  redirect(session.url!);
}
