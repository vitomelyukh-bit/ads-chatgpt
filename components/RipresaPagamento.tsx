"use client";

import { useEffect, useState } from "react";

// Chi chiude la cassa Stripe torna qui con ?annullato=1&t=<token>: invece di
// fargli rifare il modulo, un link riapre la cassa con i dati già salvati.
export function RipresaPagamento() {
  const [token, setToken] = useState<string | null>(null);
  const [errore, setErrore] = useState(false);
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if (q.get("annullato") === "1" && q.get("t")) setToken(q.get("t"));
    if (q.get("errore_pagamento") === "1") setErrore(true);
  }, []);

  if (errore) {
    return <p role="alert" className="tt-alert">Non siamo riusciti ad aprire il pagamento. Riprova tra qualche minuto, oppure rispondi alla email che ti abbiamo mandato.</p>;
  }
  if (!token) return null;
  return (
    <div role="status" className="tt-callout tt-stack-4">
      <span className="tt-tag">Pagamento non completato</span>
      <p style={{ margin: 0 }}>I tuoi dati sono salvati: ti manca solo il pagamento per attivare il servizio.</p>
      <a href={`/attiva/paga?t=${encodeURIComponent(token)}`} className="tt-btn tt-btn--block-mobile">Riprendi il pagamento <span aria-hidden="true">→</span></a>
    </div>
  );
}
