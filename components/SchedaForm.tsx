"use client";

import { track } from "@vercel/analytics";
import { useActionState, useEffect, useId, useRef } from "react";
import Link from "next/link";
import { pagaScheda } from "@/actions/paga-scheda";
import { richiediScheda, type StatoScheda } from "@/actions/richiedi-scheda";
import { EXTRA, euro, scheda } from "@/lib/scheda";

const initial: StatoScheda = { status: "idle" };

export function SchedaForm({ whatsapp, pagamenti }: { whatsapp: string | null; pagamenti: boolean }) {
  const [state, action, pending] = useActionState(richiediScheda, initial);
  const id = useId();
  const okRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (state.status === "success") {
      track("Google Maps richiesta", { extra: state.extra ?? "nessuno" });
      okRef.current?.focus();
    }
  }, [state]);

  if (state.status === "success") {
    const totale = `${euro(scheda.prezzoMese)} al mese${state.extra ? ` + ${euro(EXTRA[state.extra].prezzo)} una volta sola per ${state.extra === "card" ? "la card" : "il piedistallo"}` : ""}`;
    return (
      <div ref={okRef} tabIndex={-1} role="status" className="tt-success tt-stack-4" style={{ outline: "none" }}>
        <h3 className="tt-heading"><span className="tt-ok">Richiesta ricevuta.</span> Grazie.</h3>
        {pagamenti && state.token ? (
          <>
            <p className="tt-body">Ultimo passo: attiva il servizio con il pagamento sicuro. Totale: <strong>{totale}</strong>. Disdici quando vuoi.</p>
            <form action={pagaScheda.bind(null, state.token)}>
              <button className="tt-btn tt-btn--block tt-btn--lg">Paga e attiva <span aria-hidden="true">→</span></button>
            </form>
            <p className="tt-small tt-muted">Pagamento con carta tramite Stripe. Preferisci parlarne prima? {whatsapp ? <a href={whatsapp}>Scrivici su WhatsApp</a> : "Ti scriviamo noi su WhatsApp"}.</p>
          </>
        ) : (
          <>
            <p className="tt-body">Ti contattiamo a breve per completare l&apos;attivazione{state.extra ? ` e spedirti ${state.extra === "card" ? "la card" : "il piedistallo"}` : ""}. Ti abbiamo mandato anche una email di conferma.</p>
            {whatsapp && <a href={whatsapp} className="tt-btn tt-btn--secondary tt-btn--block">Hai una domanda? Scrivici su WhatsApp</a>}
          </>
        )}
      </div>
    );
  }

  const err = state.status === "error" ? state.fieldErrors ?? {} : {};
  const val = state.status === "error" ? state.values ?? {} : {};
  const f = (name: string) => ({
    id: `${id}-${name}`, name, defaultValue: val[name],
    "aria-invalid": err[name] ? true : undefined,
    "aria-describedby": err[name] ? `${id}-${name}-err` : undefined,
  });
  const cls = (name: string) => `tt-field${err[name] ? " tt-field--error" : ""}`;
  const errore = (name: string, aiuto?: string) =>
    err[name] ? <p id={`${id}-${name}-err`} className="tt-field__help">Errore: {err[name]}</p> : aiuto ? <p className="tt-field__help">{aiuto}</p> : null;

  return (
    <form key={state.status === "error" ? state.attempt : 0} action={action} noValidate className="tt-form tt-scheda-form">
      {state.status === "error" && <p role="alert" className="tt-alert">Errore: {state.message}</p>}

      <div className={cls("attivita")}><label htmlFor={`${id}-attivita`}>Nome dell&apos;attività</label><input {...f("attivita")} autoComplete="organization" required />{errore("attivita")}</div>
      <div className={cls("citta")}><label htmlFor={`${id}-citta`}>Città</label><input {...f("citta")} autoComplete="address-level2" required />{errore("citta")}</div>
      <div className={cls("nome")}><label htmlFor={`${id}-nome`}>Nome e cognome</label><input {...f("nome")} autoComplete="name" required />{errore("nome")}</div>
      <div className={cls("whatsapp")}><label htmlFor={`${id}-whatsapp`}>Numero WhatsApp</label><input {...f("whatsapp")} type="tel" inputMode="tel" autoComplete="tel" required />{errore("whatsapp", "Ti scriviamo qui. Niente chiamate a sorpresa.")}</div>
      <div className={cls("email")}><label htmlFor={`${id}-email`}>Email</label><input {...f("email")} type="email" inputMode="email" autoComplete="email" required />{errore("email")}</div>
      <div className={cls("link_maps")}>
        <label htmlFor={`${id}-link_maps`}>Link della tua attività su Google Maps (facoltativo)</label>
        <input {...f("link_maps")} type="url" inputMode="url" placeholder="https://maps.app.goo.gl/…" />
        {errore("link_maps", "Su Google Maps cerca la tua attività, tocca Condividi e copia il link. Se non lo trovi, lascia vuoto: serve solo per card e piedistallo.")}
      </div>

      <fieldset className="tt-scelta-extra">
        <legend>Vuoi anche un extra da mettere sul bancone? (facoltativo)</legend>
        <label className="tt-option" htmlFor={`${id}-nfc-no`}>
          <input id={`${id}-nfc-no`} name="nfc" type="radio" value="" defaultChecked={!val.nfc} />
          <span>Nessuno, grazie</span>
        </label>
        {(Object.keys(EXTRA) as (keyof typeof EXTRA)[]).map((k) => (
          <label key={k} className="tt-option" htmlFor={`${id}-nfc-${k}`}>
            <input id={`${id}-nfc-${k}`} name="nfc" type="radio" value={k} defaultChecked={val.nfc === k} />
            <span>{EXTRA[k].nome}<small>{euro(EXTRA[k].prezzo)} una volta sola, spedizione inclusa</small></span>
          </label>
        ))}
      </fieldset>

      {/* Compare solo se si sceglie card o piedistallo (CSS :has, funziona anche senza JavaScript). */}
      <fieldset className="tt-spedizione tt-form">
        <legend className="tt-subheading">Dove te lo spediamo?</legend>
        <div className={cls("sped_presso")}><label htmlFor={`${id}-sped_presso`}>Presso (facoltativo)</label><input {...f("sped_presso")} autoComplete="organization" />{errore("sped_presso", "Es. il nome dell'attività, se è diverso dal tuo.")}</div>
        <div className={cls("sped_via")}><label htmlFor={`${id}-sped_via`}>Via e numero civico</label><input {...f("sped_via")} autoComplete="address-line1" />{errore("sped_via")}</div>
        <div className={cls("sped_cap")}><label htmlFor={`${id}-sped_cap`}>CAP</label><input {...f("sped_cap")} inputMode="numeric" autoComplete="postal-code" maxLength={5} />{errore("sped_cap")}</div>
        <div className={cls("sped_citta")}><label htmlFor={`${id}-sped_citta`}>Città</label><input {...f("sped_citta")} autoComplete="address-level2" />{errore("sped_citta")}</div>
        <div className={cls("sped_provincia")}><label htmlFor={`${id}-sped_provincia`}>Provincia</label><input {...f("sped_provincia")} maxLength={2} placeholder="MI" style={{ textTransform: "uppercase" }} />{errore("sped_provincia", "Sigla di due lettere.")}</div>
      </fieldset>

      <div aria-hidden="true" className="tt-honeypot"><label htmlFor={`${id}-sito_web`}>Lascia vuoto</label><input id={`${id}-sito_web`} name="sito_web" tabIndex={-1} autoComplete="off" /></div>

      <div className={err.privacy ? "tt-field tt-field--error" : undefined}>
        <label className="tt-check" htmlFor={`${id}-privacy`}>
          <input id={`${id}-privacy`} name="privacy" type="checkbox" defaultChecked={val.privacy === "on"} required />
          <span>Ho letto l&apos;<Link href="/privacy">informativa privacy</Link> e acconsento a essere ricontattato per questo servizio.</span>
        </label>
        {errore("privacy")}
      </div>

      <button type="submit" disabled={pending} className="tt-btn tt-btn--block tt-btn--lg">
        {pending ? (pagamenti ? "Ti portiamo al pagamento…" : "Invio in corso…") : <>{pagamenti ? "Continua al pagamento" : "Invia la richiesta"} <span aria-hidden="true">→</span></>}
      </button>
      <p className="tt-small tt-muted">{pagamenti ? `Al passo successivo paghi con carta sul sito sicuro di Stripe: ${euro(scheda.prezzoMese)} al mese${"\u00a0"}e il servizio è attivo. Disdici quando vuoi.` : "Nessun pagamento adesso: ti contattiamo per completare l\u2019attivazione."}</p>
    </form>
  );
}
