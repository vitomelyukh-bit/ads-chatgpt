"use client";

import { useActionState, useEffect, useId, useRef } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { richiediAnalisi, type FormState } from "@/actions/richiedi-analisi";

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
        className="rounded-2xl border border-accent/50 bg-accent-soft p-6 outline-none sm:p-8"
      >
        <Heading className="text-3xl font-semibold tracking-tight text-fg">Richiesta ricevuta. Grazie.</Heading>
        <p className="mt-3 text-fg-soft">
          Ti abbiamo mandato una email di conferma. Se non la vedi, controlla nella posta indesiderata.
        </p>
        <p className="mt-3 text-fg-soft">
          Guardiamo il tuo settore e ti ricontattiamo per parlarne. Se gli annunci su ChatGPT non fanno per te, te lo diciamo.
        </p>
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
    err[name] ? (
      <p id={`${id}-${name}-err`} className="mt-1.5 text-sm text-red-400">
        {err[name]}
      </p>
    ) : null;

  const input =
    "mt-2 block w-full rounded-xl border border-line-strong bg-surface-2 px-4 py-3 text-base text-fg placeholder:text-fg-mute focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/20 aria-[invalid=true]:border-red-400";
  const label = "label-mono block text-fg-mute";

  return (
    <form
      // La key fa ripartire il form con i valori restituiti dopo un errore.
      key={state.status === "error" ? state.attempt : 0}
      action={action}
      noValidate
      className="space-y-5"
    >
      {state.status === "error" && (
        <p role="alert" className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {state.message}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-nome`} className={label}>Nome e cognome</label>
          <input {...field("nome")} type="text" autoComplete="name" required className={input} />
          {errorText("nome")}
        </div>
        <div>
          <label htmlFor={`${id}-attivita`} className={label}>Attività o azienda</label>
          <input {...field("attivita")} type="text" autoComplete="organization" required className={input} />
          {errorText("attivita")}
        </div>
        <div>
          <label htmlFor={`${id}-settore`} className={label}>Settore</label>
          <select {...field("settore")} required defaultValue={val.settore || defaultSettore} className={input}>
            <option value="" disabled>Scegli…</option>
            {settori.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {errorText("settore")}
        </div>
        <div>
          <label htmlFor={`${id}-citta`} className={label}>Città o zona <span className="normal-case tracking-normal">(se locale)</span></label>
          <input {...field("citta")} type="text" autoComplete="address-level2" className={input} />
          {errorText("citta")}
        </div>
        <div>
          <label htmlFor={`${id}-sito`} className={label}>Sito web <span className="normal-case tracking-normal">(se c&apos;è)</span></label>
          <input {...field("sito")} type="text" inputMode="url" autoComplete="url" placeholder="esempio.it" className={input} />
          {errorText("sito")}
        </div>
        <div>
          <label htmlFor={`${id}-budget`} className={label}>Budget pubblicitario indicativo</label>
          <select {...field("budget")} required defaultValue={val.budget || ""} className={input}>
            <option value="" disabled>Scegli…</option>
            {BUDGET.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
          {errorText("budget")}
        </div>
        <div>
          <label htmlFor={`${id}-email`} className={label}>Email</label>
          <input {...field("email")} type="email" autoComplete="email" inputMode="email" required className={input} />
          {errorText("email")}
        </div>
        <div>
          <label htmlFor={`${id}-telefono`} className={label}>Telefono</label>
          <input {...field("telefono")} type="tel" autoComplete="tel" inputMode="tel" required className={input} />
          {errorText("telefono")}
        </div>
      </div>

      {/* Honeypot: nascosto a persone e lettori di schermo, i bot lo compilano. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${id}-sito_web`}>Lascia vuoto questo campo</label>
        <input id={`${id}-sito_web`} name="sito_web" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <div className="flex items-start gap-3">
          <input
            {...field("privacy")}
            defaultValue={undefined}
            defaultChecked={val.privacy === "on"}
            type="checkbox"
            required
            className="mt-1 size-5 shrink-0 rounded accent-[var(--color-accent)]"
          />
          <label htmlFor={`${id}-privacy`} className="text-sm text-fg-soft">
            Ho letto l&apos;<Link href="/privacy" className="link-ul text-fg">informativa privacy</Link>{" "}
            e acconsento a essere ricontattato per l&apos;analisi gratuita.
          </label>
        </div>
        {errorText("privacy")}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="btn-accent w-full text-base disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Invio in corso…" : <>Richiedi l&apos;analisi gratuita <span aria-hidden="true">→</span></>}
      </button>
      <p className="text-sm text-fg-mute">Gratis e senza impegno. Ti ricontattiamo noi.</p>
    </form>
  );
}
