"use client";

import { useEffect, useRef, useState } from "react";

// Slideshow orizzontale: scorre da solo, si ferma quando ci passi sopra o lo tocchi.
// Funziona anche senza JavaScript (si scorre col dito), e senza animazioni per chi le ha disattivate.
export function Slideshow({ children, etichetta, intervallo = 5000 }: { children: React.ReactNode; etichetta: string; intervallo?: number }) {
  const track = useRef<HTMLUListElement>(null);
  const [fermo, setFermo] = useState(false);

  const vai = (dir: 1 | -1) => {
    const t = track.current;
    if (!t) return;
    const passo = (t.firstElementChild as HTMLElement | null)?.getBoundingClientRect().width ?? t.clientWidth;
    const fine = t.scrollLeft + t.clientWidth >= t.scrollWidth - 4;
    if (dir === 1 && fine) t.scrollTo({ left: 0, behavior: "smooth" });
    else t.scrollBy({ left: dir * (passo + 16), behavior: "smooth" });
  };

  useEffect(() => {
    if (fermo || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => vai(1), intervallo);
    return () => clearInterval(id);
  }, [fermo, intervallo]);

  return (
    <div className="tt-slide" onMouseEnter={() => setFermo(true)} onMouseLeave={() => setFermo(false)} onTouchStart={() => setFermo(true)} onFocusCapture={() => setFermo(true)}>
      <ul ref={track} className="tt-slide__track" aria-label={etichetta}>{children}</ul>
      <div className="tt-slide__nav">
        <button type="button" className="tt-slide__btn" onClick={() => { setFermo(true); vai(-1); }} aria-label="Precedente">←</button>
        <button type="button" className="tt-slide__btn" onClick={() => { setFermo(true); vai(1); }} aria-label="Successivo">→</button>
      </div>
    </div>
  );
}
