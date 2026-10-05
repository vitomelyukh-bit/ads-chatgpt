"use client";

import { useState } from "react";

// Bottone "Copia": copia un testo negli appunti e lo conferma a parole.
export function Copia({ testo, etichetta = "Copia" }: { testo: string; etichetta?: string }) {
  const [fatto, setFatto] = useState(false);
  return (
    <button type="button" className="tt-btn tt-btn--secondary" onClick={async () => { await navigator.clipboard.writeText(testo); setFatto(true); setTimeout(() => setFatto(false), 2500); }}>
      {fatto ? "Copiato ✓" : etichetta}
    </button>
  );
}
