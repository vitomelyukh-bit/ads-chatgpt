"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { richiediAccesso } from "@/actions/area";

function Modulo() {
  const [state, action, pending] = useActionState(richiediAccesso, null);
  const scaduto = useSearchParams().get("scaduto");
  if (state && "inviato" in state) {
    return (
      <div className="tt-card tt-stack-4" role="status">
        <h2 className="tt-heading">Controlla la tua email</h2>
        <p className="tt-body">Se l&apos;indirizzo è quello che ci hai dato, ti abbiamo appena mandato il link per entrare. Guarda anche nella cartella spam.</p>
      </div>
    );
  }
  return (
    <form action={action} className="tt-form tt-card">
      {scaduto && <p role="alert" className="tt-alert">Il link è scaduto: chiedine uno nuovo qui sotto.</p>}
      <div className="tt-field">
        <label htmlFor="email">La tua email</label>
        <input id="email" name="email" type="email" inputMode="email" autoComplete="email" required />
        {state && "errore" in state ? <p className="tt-field__help" style={{ color: "var(--danger)", fontWeight: 700 }}>Errore: {state.errore}</p> : <p className="tt-field__help">Quella che ci hai dato quando ti sei iscritto.</p>}
      </div>
      <button disabled={pending} className="tt-btn tt-btn--block tt-btn--lg">{pending ? "Invio…" : <>Mandami il link <span aria-hidden="true">→</span></>}</button>
      <p className="tt-small tt-muted">Niente password: ti mandiamo un link per entrare.</p>
    </form>
  );
}

export default function Accedi() {
  return (
    <div className="tt-wrap tt-wrap--read tt-page-head tt-stack-8">
      <div className="tt-stack-4">
        <h1 className="tt-display-lg">Entra nella <span className="tt-mark">tua area</span></h1>
        <p className="tt-lead">Qui approvi le risposte alle recensioni, vedi le novità prima che escano e i tuoi numeri del mese.</p>
      </div>
      <Suspense><Modulo /></Suspense>
    </div>
  );
}
