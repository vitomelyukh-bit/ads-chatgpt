// In sviluppo si usa localhost; in build next.config.ts blocca tutto se manca.
const rawUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const site = {
  name: "TiTrovano",
  url: rawUrl.replace(/\/+$/, ""),
  locale: "it_IT",
  lang: "it-IT",
  description:
    "Oggi i clienti chiedono a ChatGPT, Gemini e Perplexity a chi rivolgersi. L'AI risponde con due o tre nomi. Scopri gratis se c'è anche il tuo.",
};

export function absoluteUrl(path = "/") {
  return path === "/" ? `${site.url}/` : `${site.url}${path}`;
}
