"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import type { RichiestaScheda } from "@/lib/scheda-attivazione";
import { EXTRA, isTipoExtra } from "@/lib/scheda";
import { leggiRichiesta } from "@/lib/scheda-token";
import { site } from "@/lib/site";
import { pagamentiAttivi, stripe } from "@/lib/stripe";

// Crea il pagamento Stripe per una richiesta e porta il cliente alla cassa.
export async function pagaScheda(token: string) {
  const id = leggiRichiesta(token);
  if (!id || !pagamentiAttivi()) redirect("/#attiva");
  const [r] = (await db()`select * from richieste_scheda where id = ${id}`) as RichiestaScheda[];
  if (!r) redirect("/#attiva");
  if (r.pagata) redirect(`/attiva/grazie?r=${token}`);

  const line_items: { price: string; quantity: number }[] = [{ price: process.env.STRIPE_PRICE_SCHEDA!, quantity: 1 }];
  const prezzoExtra = isTipoExtra(r.nfc_tipo) ? process.env[EXTRA[r.nfc_tipo].priceEnv] : undefined;
  if (prezzoExtra) line_items.push({ price: prezzoExtra, quantity: 1 });

  const session = await stripe().checkout.sessions.create({
    mode: "subscription",
    line_items,
    customer_email: r.email,
    locale: "it",
    client_reference_id: String(r.id),
    metadata: { richiesta_id: String(r.id), attivita: r.attivita },
    subscription_data: { metadata: { richiesta_id: String(r.id), attivita: r.attivita } },
    success_url: `${site.url}/attiva/grazie?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${site.url}/?annullato=1#attiva`,
  });
  redirect(session.url!);
}
