"use client";

import { useEffect, useState } from "react";

// Dimostrazione illustrativa: la stessa ricerca su Google, prima e dopo il lavoro sul sito.
const ALTRI = [
  { sito: "portalecasa.it", titolo: "Idraulici a Roma: confronta 200 professionisti", testo: "Richiedi preventivi gratuiti agli idraulici della tua zona…" },
  { sito: "idraulicobianchi.it", titolo: "Idraulico Bianchi · Pronto intervento", testo: "Riparazioni, perdite, scarichi. Roma e provincia." },
];

function Risultato({ sito, titolo, testo, tuo }: { sito: string; titolo: string; testo: string; tuo?: boolean }) {
  return (
    <li className={`tt-serp__res${tuo ? " tt-serp__res--tuo" : ""}`}>
      {tuo && <span className="tt-serp__badge">Il tuo sito</span>}
      <span className="tt-serp__url">{sito}</span>
      <span className="tt-serp__title">{titolo}</span>
      <span className="tt-serp__text">{testo}</span>
      {tuo && (
        <span className="tt-serp__links">
          <span>Prezzi</span><span>Perdite d&apos;acqua</span><span>Scaldabagno</span>
        </span>
      )}
    </li>
  );
}

export function SerpDemo() {
  const [dopo, setDopo] = useState(false);
  const [toccato, setToccato] = useState(false);

  // Si gira da solo una volta, poi decide chi guarda.
  useEffect(() => {
    if (toccato || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setDopo(true), 2600);
    return () => clearTimeout(t);
  }, [toccato]);

  const scegli = (v: boolean) => { setToccato(true); setDopo(v); };

  return (
    <figure className="tt-serp" aria-label="Esempio illustrativo: la stessa ricerca su Google prima e dopo il lavoro sul sito">
      <div className="tt-serp__switch" role="tablist" aria-label="Prima o dopo">
        <button type="button" role="tab" aria-selected={!dopo} onClick={() => scegli(false)}>Prima</button>
        <button type="button" role="tab" aria-selected={dopo} onClick={() => scegli(true)}>Dopo</button>
      </div>
      <div className="tt-serp__phone">
        <div className="tt-serp__search">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 5 5" /></svg>
          <span>idraulico roma nord</span>
        </div>
        <ul className={`tt-serp__list${dopo ? " is-dopo" : ""}`}>
          {dopo && (
            <Risultato tuo sito="idraulicorossi.it" titolo="Idraulico a Roma Nord: pronto intervento" testo="Perdite, scarichi e scaldabagni. Prezzi chiari, arriviamo in giornata." />
          )}
          {ALTRI.map((r) => <Risultato key={r.sito} {...r} />)}
          {!dopo && <li className="tt-serp__manca">Il tuo sito non compare</li>}
        </ul>
      </div>
      <figcaption className="tt-small tt-muted">Esempio illustrativo con nomi di fantasia.</figcaption>
    </figure>
  );
}
