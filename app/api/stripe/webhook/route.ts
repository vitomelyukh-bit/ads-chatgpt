import type Stripe from "stripe";
import { db } from "@/lib/db";
import { registraOrdineBanco } from "@/lib/banco";
import { attivaDaCheckout } from "@/lib/scheda-attivazione";
import { stripe } from "@/lib/stripe";
import { Resend } from "resend";
import { email, TITROVANO } from "@/lib/email";

// Avviso interno (disdette, pagamenti falliti): se Resend non è configurato lo scrive solo nei log.
async function avvisa(titolo: string, righe: [string, string][]) {
  const from = process.env.RESEND_FROM;
  const to = process.env.LEAD_TO_EMAIL?.split(",").map((s) => s.trim()).filter(Boolean);
  if (!process.env.RESEND_API_KEY || !from || !to?.length) return console.warn("[stripe]", titolo, righe);
  const r = await new Resend(process.env.RESEND_API_KEY).emails.send({
    from, to, subject: titolo,
    ...email({ marchio: TITROVANO, anteprima: titolo, titolo, blocchi: [{ tipo: "righe", righe }] }),
  });
  if (r.error) console.error("[stripe] avviso non inviato:", r.error);
}

// Eventi Stripe: pagamento completato (attiva o ordine da banco), abbonamento chiuso (disdetta: il servizio si ferma)
// e pagamento di rinnovo fallito (avviso interno per ricontattare il cliente).
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
    const richieste = (await db()`update richieste_scheda set stato = 'disdetta' where stripe_subscription = ${sub.id} returning id, attivita, email`) as { id: number; attivita: string; email: string }[];
    // Il giro Maps, i report e l'area clienti lavorano solo sui clienti 'attivo': la disdetta li ferma tutti.
    for (const r of richieste) {
      await db()`update maps_clienti set stato = 'disdetto' where richiesta_id = ${r.id}`;
      await avvisa(`Disdetta: ${r.attivita}`, [["Attività", r.attivita], ["Email", r.email], ["Effetto", "Servizio fermato: niente più novità, report e accesso all'area."]]);
    }
  }
  if (ev.type === "invoice.payment_failed") {
    const inv = ev.data.object as Stripe.Invoice & { subscription?: string | null };
    const subId = typeof inv.subscription === "string" ? inv.subscription : (inv as { parent?: { subscription_details?: { subscription?: string } } }).parent?.subscription_details?.subscription;
    const [r] = subId ? ((await db()`select attivita, email, whatsapp from richieste_scheda where stripe_subscription = ${subId}`) as { attivita: string; email: string; whatsapp: string }[]) : [];
    await avvisa(`Pagamento non riuscito: ${r?.attivita ?? inv.customer_email ?? "cliente"}`, [
      ["Attività", r?.attivita ?? "—"],
      ["Email", r?.email ?? inv.customer_email ?? "—"],
      ["WhatsApp", r?.whatsapp ?? "—"],
      ["Cosa fare", "Stripe riprova da solo nei prossimi giorni. Conviene scrivere al cliente per aggiornare la carta."],
    ]);
  }
  return Response.json({ ricevuto: true });
}
