"use client";

import { useEffect } from "react";

// Fa entrare con un'animazione morbida gli elementi [data-reveal] che sono sotto la piega.
// Quelli già visibili al caricamento non vengono mai nascosti; senza JavaScript si vede tutto.
export function Reveal() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const els = [...document.querySelectorAll<HTMLElement>("[data-reveal]")].filter(
      (el) => el.getBoundingClientRect().top > innerHeight * 0.9,
    );
    els.forEach((el) => el.classList.add("tt-rv--off"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.remove("tt-rv--off");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
