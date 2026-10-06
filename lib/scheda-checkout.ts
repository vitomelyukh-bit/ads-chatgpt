import { db } from "@/lib/db";
import type { RichiestaScheda } from "@/lib/scheda-attivazione";
import { EXTRA, isTipoExtra } from "@/lib/scheda";
import { leggiRichiesta } from "@/lib/scheda-token";
import { site } from "@/lib/site";
import { pagamentiAttivi, stripe } from "@/lib/stripe";

// Dove mandare il cliente per pagare una richiesta: la cassa Stripe, oppure
// indietro al modulo se il pagamento non si può fare. Una sola strada per il
// modulo della home, il link nell'email e il bottone "Paga e attiva".
export async function urlCassa(token: string): Promise<string> {
  const id = leggiRichiesta(token);
  if (!id || !pagamentiAttivi()) return "/#attiva";
  const [r] = (await db()`select * from richieste_scheda where id = ${id}`) as RichiestaScheda[];
  if (!r) return "/#attiva";
  if (r.pagata) return `/attiva/grazie?r=${token}`;

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
    cancel_url: `${site.url}/?annullato=1&t=${encodeURIComponent(token)}#attiva`,
  });
  return session.url!;
}
