"use client";

import { useActionState } from "react";
import { login } from "@/actions/console";

export default function Login() {
  const [state, action, pending] = useActionState(login, null);
  return (
    <main id="contenuto" className="tt-wrap tt-wrap--read tt-page-head">
      <p className="tt-wordmark" style={{ font: "700 28px/1 var(--font-display)" }}>TiTrovano · console</p>
      <form action={action} className="tt-form tt-card" style={{ marginTop: "var(--space-8)", maxWidth: 440 }}>
        <div className="tt-field">
          <label htmlFor="pw">Password</label>
          <input id="pw" name="password" type="password" autoFocus required />
          {state?.errore && <p className="tt-field__help" style={{ color: "var(--danger)", fontWeight: 700 }}>Errore: {state.errore}</p>}
        </div>
        <button disabled={pending} className="tt-btn tt-btn--block">Entra</button>
      </form>
    </main>
  );
}
