import type { NextConfig } from "next";
import { PHASE_PRODUCTION_BUILD } from "next/constants";

// La build di produzione si ferma se manca il dominio: così non si va online
// con canonical, sitemap e JSON-LD che puntano a un segnaposto.
function assertSiteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL;
  if (!raw) {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL non è impostata. Impostala (es. https://titrovano.it) prima di eseguire la build.",
    );
  }
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new Error(`NEXT_PUBLIC_SITE_URL non è un URL valido: "${raw}"`);
  }
  if (url.pathname !== "/" || url.search || url.hash) {
    throw new Error(
      `NEXT_PUBLIC_SITE_URL deve essere solo l'origine, senza percorso: "${raw}"`,
    );
  }
}

export default function config(phase: string): NextConfig {
  if (phase === PHASE_PRODUCTION_BUILD) assertSiteUrl();
  return {
    poweredByHeader: false,
    reactStrictMode: true,
    async redirects() {
      return [{ source: "/prova-gratuita", destination: "/analisi-gratuita", permanent: true }];
    },
  };
}
