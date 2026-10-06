import { urlCassa } from "@/lib/scheda-checkout";

// Link diretto alla cassa: lo usa il modulo della home appena la richiesta è
// salvata, e l'email "Completa l'attivazione" per chi non ha finito di pagare.
// Ogni visita crea una sessione Stripe nuova, quindi il link non scade.
export async function GET(req: Request) {
  const t = new URL(req.url).searchParams.get("t") ?? "";
  const dove = await urlCassa(t).catch((e) => {
    console.error("[attiva/paga]", e);
    return "/?errore_pagamento=1#attiva";
  });
  return Response.redirect(new URL(dove, req.url), 303);
}
