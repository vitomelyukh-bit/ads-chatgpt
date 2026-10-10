"use client";

import { useActionState, useEffect, useId, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { track } from "@vercel/analytics";
import { richiediConsulenza, type ConsulenzaState } from "@/actions/richiedi-consulenza";
import { INTERESSI, PIATTAFORME, type Interesse } from "@/lib/seo-locale";
import { PrenotaCall } from "./PrenotaCall";

const initial: ConsulenzaState = { status: "idle" };

export function ConsulenzaForm({ interesse = "", pagina = "" }: { interesse?: Interesse | ""; pagina?: string }) {
  const [state, action, pending] = useActionState(richiediConsulenza, initial);
  const id = useId();
  const confermaRef = useRef<HTMLDivElement>(null);
  const tracked = useRef(false);
  // Link dei messaggi outbound: ?a=Nome attività&ref=campagna
  const params = useSearchParams();
  const attivitaLink = params.get("a")?.slice(0, 120) ?? "";
  const ref = [params.get("ref"), params.get("utm_source"), params.get("utm_campaign")].filter(Boolean).join(" · ").slice(0, 120);

  useEffect(() => {
    if (state.status === "success" && !tracked.current) {
      tracked.current = true;
      track("Consulenza richiesta", { pagina });
      confermaRef.current?.focus();
    }
  }, [state]);

  if (state.status === "success") {
    return (
      <div ref={confermaRef} tabIndex={-1} role="status" className="tt-success">
        <h3 className="tt-heading"><span className="tt-ok">Richiesta ricevuta.</span> Grazie.</h3>
        <p className="tt-body" style={{ marginTop: "var(--space-3)" }}>
          Ti abbiamo mandato una email di conferma. Scegli qui sotto un orario per la consulenza gratuita con Vitaliy, oppure
          ti chiamiamo noi.
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
  const errorText = (name: string) =>
    err[name] ? <p id={`${id}-${name}-err`} className="tt-field__help">Errore: {err[name]}</p> : null;
  const cls = (name: string) => `tt-field${err[name] ? " tt-field--error" : ""}`;

  return (
    <form key={state.status === "error" ? state.attempt : 0} action={action} noValidate className="tt-form">
      {state.status === "error" && <p role="alert" className="tt-alert">Errore: {state.message}</p>}

      <div className={cls("interesse")}>
        <label htmlFor={`${id}-interesse`}>Cosa ti serve?</label>
        <select {...field("interesse")} required defaultValue={val.interesse || interesse}>
          <option value="" disabled>Scegli…</option>
          {INTERESSI.map((x) => <option key={x} value={x}>{x}</option>)}
        </select>
        {errorText("interesse")}
      </div>
      <div className={cls("attivita")}>
        <label htmlFor={`${id}-attivita`}>Nome dell&apos;attività</label>
        <input {...field("attivita")} defaultValue={val.attivita ?? attivitaLink} type="text" autoComplete="organization" required />
        {errorText("attivita")}
      </div>
      <div className={cls("citta")}>
        <label htmlFor={`${id}-citta`}>Città o zona in cui lavori</label>
        <input {...field("citta")} type="text" autoComplete="address-level2" required />
        {errorText("citta")}
      </div>
      <div className={cls("sito")}>
        <label htmlFor={`${id}-sito`}>Sito web <span>(se c&apos;è)</span></label>
        <input {...field("sito")} type="text" inputMode="url" autoComplete="url" placeholder="esempio.it" />
        {errorText("sito")}
      </div>
      <div className={cls("piattaforma")}>
        <label htmlFor={`${id}-piattaforma`}>Con cosa è fatto il sito?</label>
        <select {...field("piattaforma")} required defaultValue={val.piattaforma || ""}>
          <option value="" disabled>Scegli…</option>
          {PIATTAFORME.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        {errorText("piattaforma")}
      </div>
      <div className={cls("nome")}>
        <label htmlFor={`${id}-nome`}>Nome e cognome</label>
        <input {...field("nome")} type="text" autoComplete="name" required />
        {errorText("nome")}
      </div>
      <div className={cls("telefono")}>
        <label htmlFor={`${id}-telefono`}>Telefono</label>
        <input {...field("telefono")} type="tel" autoComplete="tel" inputMode="tel" required />
        {errorText("telefono")}
      </div>
      <div className={cls("email")}>
        <label htmlFor={`${id}-email`}>Email</label>
        <input {...field("email")} type="email" autoComplete="email" inputMode="email" required />
        {errorText("email")}
      </div>

      <input type="hidden" name="ref" value={val.ref ?? ref} />
      <input type="hidden" name="pagina" value={pagina} />
      {/* Honeypot: nascosto a persone e lettori di schermo, i bot lo compilano. */}
      <div aria-hidden="true" className="tt-honeypot">
        <label htmlFor={`${id}-sito_web`}>Lascia vuoto questo campo</label>
        <input id={`${id}-sito_web`} name="sito_web" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className={err.privacy ? "tt-field tt-field--error" : undefined}>
        <label className="tt-check" htmlFor={`${id}-privacy`}>
          <input {...field("privacy")} defaultValue={undefined} defaultChecked={val.privacy === "on"} type="checkbox" required />
          <span>
            Ho letto l&apos;<Link href="/privacy">informativa privacy</Link> e acconsento a essere ricontattato per
            la consulenza gratuita.
          </span>
        </label>
        {errorText("privacy")}
      </div>

      <button type="submit" disabled={pending} className="tt-btn tt-btn--block">
        {pending ? "Invio in corso…" : <>Prenota la consulenza gratuita <span aria-hidden="true">→</span></>}
      </button>
      <p className="tt-small tt-muted">Gratis e senza impegno. Dopo l&apos;invio scegli tu l&apos;orario della call.</p>
    </form>
  );
}
