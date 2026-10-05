import type Stripe from "stripe";
import { db } from "@/lib/db";
import { registraOrdineBanco } from "@/lib/banco";
import { attivaDaCheckout } from "@/lib/scheda-attivazione";
import { stripe } from "@/lib/stripe";

// Eventi Stripe: pagamento completato (attiva o ordine da banco) e abbonamento chiuso (disdetta).
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return new Response("webhook non configurato", { status: 503 });
  let ev: Stripe.Event;
  try {
    ev = stripe().webhooks.constructEvent(await req.text(), req.headers.get("stripe-signature") ?? "", secret);
  } catch {
    return new Response("firma non valida", { status: 400 });
  }
  if (ev.type === "checkout.session.completed") {
    const s = ev.data.object as Stripe.Checkout.Session;
    if (s.metadata?.ordine === "banco") await registraOrdineBanco(s);
    else await attivaDaCheckout(s);
  }
  if (ev.type === "customer.subscription.deleted") {
    const sub = ev.data.object as Stripe.Subscription;
    await db()`update richieste_scheda set stato = 'disdetta' where stripe_subscription = ${sub.id}`;
  }
  return Response.json({ ricevuto: true });
}
