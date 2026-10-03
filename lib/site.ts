// In sviluppo si usa localhost; in build next.config.ts blocca tutto se manca.
const rawUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const site = {
  name: "TiTrovano",
  url: rawUrl.replace(/\/+$/, ""),
  locale: "it_IT",
  lang: "it-IT",
  description:
    "Annunci su ChatGPT per attività locali e aziende italiane: strategia, campagne, ottimizzazione e report. Richiedi un'analisi gratuita.",
};

export function absoluteUrl(path = "/") {
  return path === "/" ? `${site.url}/` : `${site.url}${path}`;
}
