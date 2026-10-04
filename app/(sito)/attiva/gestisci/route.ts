import { db } from "@/lib/db";
import { leggiRichiesta } from "@/lib/scheda-token";
import { site } from "@/lib/site";
import { pagamentiAttivi, stripe } from "@/lib/stripe";

// Link "Gestisci o disdici" delle email: apre il portale clienti di Stripe.
export async function GET(req: Request) {
  const id = leggiRichiesta(new URL(req.url).searchParams.get("t"));
  if (!id || !pagamentiAttivi()) return Response.redirect(`${site.url}/`, 302);
  const [r] = (await db()`select stripe_customer from richieste_scheda where id = ${id}`) as { stripe_customer: string | null }[];
  if (!r?.stripe_customer) return Response.redirect(`${site.url}/`, 302);
  const s = await stripe().billingPortal.sessions.create({ customer: r.stripe_customer, return_url: `${site.url}/`, locale: "it" });
  return Response.redirect(s.url, 303);
}
