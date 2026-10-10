// In sviluppo si usa localhost; in build next.config.ts blocca tutto se manca.
const rawUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const site = {
  name: "TiTrovano",
  url: rawUrl.replace(/\/+$/, ""),
  locale: "it_IT",
  lang: "it-IT",
  description:
    "SEO locale per le attività: il tuo sito trovato su Google e dagli assistenti AI, con pagine e guide nuove ogni settimana. Poi la scheda Google Maps curata ogni settimana, e annunci online quando servono.",
};

export function absoluteUrl(path = "/") {
  return path === "/" ? `${site.url}/` : `${site.url}${path}`;
}
