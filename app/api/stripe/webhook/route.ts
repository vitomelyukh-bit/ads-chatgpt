import type Stripe from "stripe";
import { db } from "@/lib/db";
import { attivaDaCheckout } from "@/lib/scheda-attivazione";
import { stripe } from "@/lib/stripe";

// Eventi Stripe: pagamento completato (attiva) e abbonamento chiuso (disdetta).
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return new Response("webhook non configurato", { status: 503 });
  let ev: Stripe.Event;
  try {
    ev = stripe().webhooks.constructEvent(await req.text(), req.headers.get("stripe-signature") ?? "", secret);
  } catch {
    return new Response("firma non valida", { status: 400 });
  }
  if (ev.type === "checkout.session.completed") await attivaDaCheckout(ev.data.object as Stripe.Checkout.Session);
  if (ev.type === "customer.subscription.deleted") {
    const sub = ev.data.object as Stripe.Subscription;
    await db()`update richieste_scheda set stato = 'disdetta' where stripe_subscription = ${sub.id}`;
  }
  return Response.json({ ricevuto: true });
}
