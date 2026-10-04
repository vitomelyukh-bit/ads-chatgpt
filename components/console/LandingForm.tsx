"use client";

import { useActionState, useEffect, useState } from "react";
import { inviaRichiestaLanding as inviaRichiesta, type StatoRichiesta } from "@/actions/richiesta-landing";

declare global { interface Window { fbq?: (...a: unknown[]) => void } }

const UTM = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid"];

export function LandingForm({ landingId, cta, domanda, nomeCliente, privacyUrl }: {
  landingId: string; cta: string; domanda: string | null; nomeCliente: string; privacyUrl: string;
}) {
  const [state, action, pending] = useActionState(inviaRichiesta.bind(null, landingId), { stato: "idle" } as StatoRichiesta);
  const [utm, setUtm] = useState<Record<string, string>>({});
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    setUtm(Object.fromEntries(UTM.map((k) => [k, q.get(k) ?? ""]).filter(([, v]) => v)));
  }, []);
  useEffect(() => { if (state.stato === "ok") window.fbq?.("track", "Lead"); }, [state.stato]);

  if (state.stato === "ok") {
    return (
      <div className="lp-ok" role="status">
        <p className="lp-ok-t">Richiesta inviata. Grazie!</p>
        <p>{nomeCliente} ti ricontatterà al più presto.</p>
      </div>
    );
  }
  return (
    <form action={action} className="lp-form">
      {state.stato === "errore" && <p className="lp-err" role="alert">Errore: {state.messaggio}</p>}
      <label>Nome e cognome<input name="nome" required autoComplete="name" /></label>
      <label>Telefono<input name="telefono" type="tel" required autoComplete="tel" inputMode="tel" /></label>
      <label><span className="lp-l">Email <span>(facoltativa)</span></span><input name="email" type="email" autoComplete="email" /></label>
      <label><span className="lp-l">{domanda || "Come possiamo aiutarti?"} <span>(facoltativo)</span></span><textarea name="messaggio" rows={3} /></label>
      {Object.entries(utm).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}
      <div aria-hidden="true" style={{ position: "absolute", left: -9999 }}><input name="sito_web" tabIndex={-1} autoComplete="off" /></div>
      <label className="lp-check">
        <input type="checkbox" name="privacy" required />
        <span>Acconsento al trattamento dei miei dati da parte di {nomeCliente} per essere ricontattato, come descritto
          nell&apos;<a href={privacyUrl} target="_blank" rel="noopener">informativa privacy</a>.</span>
      </label>
      <button disabled={pending}>{pending ? "Invio…" : cta}</button>
    </form>
  );
}
