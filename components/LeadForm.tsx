"use client";

import { useActionState, useEffect, useId, useRef } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { richiediAnalisi, type FormState } from "@/actions/richiedi-analisi";
import { PrenotaCall } from "./PrenotaCall";

const initial: FormState = { status: "idle" };

export const BUDGET = ["Non lo so ancora", "Meno di 500 € al mese", "500–1.500 € al mese", "1.500–5.000 € al mese", "Oltre 5.000 € al mese"];

export function LeadForm({
  settori,
  defaultSettore = "",
  headingLevel = 2,
}: {
  settori: string[];
  defaultSettore?: string;
  headingLevel?: 2 | 3;
}) {
  const [state, action, pending] = useActionState(richiediAnalisi, initial);
  const id = useId();
  const confermaRef = useRef<HTMLDivElement>(null);
  const tracked = useRef(false);

  useEffect(() => {
    if (state.status === "success" && !tracked.current) {
      tracked.current = true;
      if (state.settore) track("Analisi richiesta", { settore: state.settore });
      confermaRef.current?.focus();
    }
  }, [state]);

  const Heading = `h${headingLevel}` as "h2" | "h3";

  if (state.status === "success") {
    return (
      <div
        ref={confermaRef}
        tabIndex={-1}
        role="status"
        className="tt-success"
      >
        <Heading className="tt-heading"><span className="tt-ok">Richiesta ricevuta.</span> Grazie.</Heading>
        <p className="tt-body" style={{ marginTop: "var(--space-3)" }}>
          Ti abbiamo mandato una email di conferma. Se non la vedi, controlla nella posta indesiderata.
        </p>
        <p className="tt-body" style={{ marginTop: "var(--space-3)" }}>
          Ti chiamiamo per fissare una breve call in cui guardiamo insieme il tuo caso. Se gli annunci su ChatGPT non fanno per te, te lo diciamo.
        </p>
        {state.token && (
          <div className="tt-booking">
            <PrenotaCall token={state.token} />
          </div>
        )}
      </div>
    );
  }

  const err = state.status === "error" ? state.fieldErrors ?? {} : {};
  const val = state.status === "error" ? state.values ?? {} : {};
  const field = (name: string) => ({
    id: `${id}-${name}`,
    name,
    defaultValue: val[name],
    "aria-invalid": err[name] ? true : undefined,
    "aria-describedby": err[name] ? `${id}-${name}-err` : undefined,
  });
  // Errore sempre scritto, mai solo il colore (FormField del design system).
  const errorText = (name: string) =>
    err[name] ? (
      <p id={`${id}-${name}-err`} className="tt-field__help">
        Errore: {err[name]}
      </p>
    ) : null;
  const cls = (name: string) => `tt-field${err[name] ? " tt-field--error" : ""}`;

  return (
    <form
      // La key fa ripartire il form con i valori restituiti dopo un errore.
      key={state.status === "error" ? state.attempt : 0}
      action={action}
      noValidate
      className="tt-form"
    >
      {state.status === "error" && (
        <p role="alert" className="tt-alert">
          Errore: {state.message}
        </p>
      )}

      <div className={cls("nome")}>
        <label htmlFor={`${id}-nome`}>Nome e cognome</label>
        <input {...field("nome")} type="text" autoComplete="name" required />
        {errorText("nome")}
      </div>
      <div className={cls("attivita")}>
        <label htmlFor={`${id}-attivita`}>Attività o azienda</label>
        <input {...field("attivita")} type="text" autoComplete="organization" required />
        {errorText("attivita")}
      </div>
      <div className={cls("settore")}>
        <label htmlFor={`${id}-settore`}>Settore</label>
        <select {...field("settore")} required defaultValue={val.settore || defaultSettore}>
          <option value="" disabled>Scegli…</option>
          {settori.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        {errorText("settore")}
      </div>
      <div className={cls("citta")}>
        <label htmlFor={`${id}-citta`}>Città o zona <span>(se locale)</span></label>
        <input {...field("citta")} type="text" autoComplete="address-level2" />
        {errorText("citta")}
      </div>
      <div className={cls("sito")}>
        <label htmlFor={`${id}-sito`}>Sito web <span>(se c&apos;è)</span></label>
        <input {...field("sito")} type="text" inputMode="url" autoComplete="url" placeholder="esempio.it" />
        {errorText("sito")}
      </div>
      <div className={cls("budget")}>
        <label htmlFor={`${id}-budget`}>Budget pubblicitario indicativo</label>
        <select {...field("budget")} required defaultValue={val.budget || ""}>
          <option value="" disabled>Scegli…</option>
          {BUDGET.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
        {errorText("budget")}
      </div>
      <div className={cls("email")}>
        <label htmlFor={`${id}-email`}>Email</label>
        <input {...field("email")} type="email" autoComplete="email" inputMode="email" required />
        {errorText("email")}
      </div>
      <div className={cls("telefono")}>
        <label htmlFor={`${id}-telefono`}>Telefono</label>
        <input {...field("telefono")} type="tel" autoComplete="tel" inputMode="tel" required />
        {errorText("telefono")}
      </div>

      {/* Honeypot: nascosto a persone e lettori di schermo, i bot lo compilano. */}
      <div aria-hidden="true" className="tt-honeypot">
        <label htmlFor={`${id}-sito_web`}>Lascia vuoto questo campo</label>
        <input id={`${id}-sito_web`} name="sito_web" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className={err.privacy ? "tt-field tt-field--error" : undefined}>
        <label className="tt-check" htmlFor={`${id}-privacy`}>
          <input
            {...field("privacy")}
            defaultValue={undefined}
            defaultChecked={val.privacy === "on"}
            type="checkbox"
            required
          />
          <span>
            Ho letto l&apos;<Link href="/privacy">informativa privacy</Link> e acconsento a essere ricontattato per
            l&apos;analisi gratuita.
          </span>
        </label>
        {errorText("privacy")}
      </div>

      <button type="submit" disabled={pending} className="tt-btn tt-btn--block">
        {pending ? "Invio in corso…" : <>Richiedi l&apos;analisi gratuita <span aria-hidden="true">→</span></>}
      </button>
      <p className="tt-small tt-muted">Gratis e senza impegno. Ti ricontattiamo noi.</p>
    </form>
  );
}
