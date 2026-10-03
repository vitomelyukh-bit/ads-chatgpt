"use client";

import { useActionState, useEffect, useId, useRef } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { richiediProva, type FormState } from "@/actions/richiedi-prova";

const initial: FormState = { status: "idle" };

export function TrialForm({
  settori,
  defaultSettore = "",
  headingLevel = 2,
}: {
  settori: string[];
  defaultSettore?: string;
  headingLevel?: 2 | 3;
}) {
  const [state, action, pending] = useActionState(richiediProva, initial);
  const id = useId();
  const confermaRef = useRef<HTMLDivElement>(null);
  const tracked = useRef(false);

  useEffect(() => {
    if (state.status === "success" && !tracked.current) {
      tracked.current = true;
      if (state.settore) track("Prova richiesta", { settore: state.settore });
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
        className="rounded-2xl border-2 border-ink bg-accent-soft p-6 outline-none sm:p-8"
      >
        <Heading className="font-serif text-4xl leading-tight text-ink"><span className="hl">Richiesta ricevuta.</span> Grazie.</Heading>
        <p className="mt-3 text-ink-soft">
          Ti abbiamo mandato una email di conferma. Se non la vedi, controlla nella posta indesiderata.
        </p>
        <p className="mt-3 text-ink-soft">
          Adesso prepariamo le domande e le facciamo a ChatGPT, Gemini e Perplexity. Poi ti ricontattiamo noi
          con il risultato.
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
      <p id={`${id}-${name}-err`} className="mt-1.5 text-sm text-red-700">
        {err[name]}
      </p>
    ) : null;

  const input =
    "mt-2 block w-full rounded-xl border border-ink/20 bg-paper/60 px-4 py-3 text-base text-ink placeholder:text-ink-mute focus:border-ink focus:bg-card focus:outline-none focus:ring-4 focus:ring-accent/60 aria-[invalid=true]:border-red-700";
  const label = "label-mono block text-ink-soft";

  return (
    <form
      // La key fa ripartire il form con i valori restituiti dopo un errore.
      key={state.status === "error" ? state.attempt : 0}
      action={action}
      noValidate
      className="space-y-5"
    >
      {state.status === "error" && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">
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
          <label htmlFor={`${id}-attivita`} className={label}>Nome dell&apos;attività</label>
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
          <label htmlFor={`${id}-citta`} className={label}>Città</label>
          <input {...field("citta")} type="text" autoComplete="address-level2" required className={input} />
          {errorText("citta")}
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
            className="mt-1 size-5 shrink-0 rounded border-ink accent-[var(--color-ink)]"
          />
          <label htmlFor={`${id}-privacy`} className="text-sm text-ink-soft">
            Ho letto l&apos;<Link href="/privacy" className="link-ul text-ink">informativa privacy</Link>{" "}
            e acconsento a essere ricontattato per la prova gratuita.
          </label>
        </div>
        {errorText("privacy")}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="btn-ink w-full text-base disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Invio in corso…" : <>Richiedi la prova gratuita <span aria-hidden="true">→</span></>}
      </button>
      <p className="text-sm text-ink-mute">Gratis e senza impegno. Ti ricontattiamo noi.</p>
    </form>
  );
}
