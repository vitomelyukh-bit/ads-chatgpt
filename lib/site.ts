// In sviluppo si usa localhost; in build next.config.ts blocca tutto se manca.
const rawUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const site = {
  name: "TiTrovano",
  url: rawUrl.replace(/\/+$/, ""),
  locale: "it_IT",
  lang: "it-IT",
  description:
    "Più clienti da Google Maps per le attività locali: aggiornamenti ogni settimana, risposte a tutte le recensioni e nuove recensioni. E annunci su ChatGPT, Google e Meta.",
};

export function absoluteUrl(path = "/") {
  return path === "/" ? `${site.url}/` : `${site.url}${path}`;
}
