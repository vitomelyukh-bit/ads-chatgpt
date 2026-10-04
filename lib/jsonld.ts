import { absoluteUrl, site } from "./site";
import type { Faq } from "./content";

export type Crumb = { name: string; path: string };

const orgId = `${site.url}/#organization`;
const websiteId = `${site.url}/#website`;

export function organization() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": orgId,
    name: site.name,
    url: absoluteUrl("/"),
    description: site.description,
  };
}

export function website() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": websiteId,
    name: site.name,
    url: absoluteUrl("/"),
    inLanguage: site.lang,
    publisher: { "@id": orgId },
  };
}

export function breadcrumbList(crumbs: Crumb[]) {
  const items = [{ name: "Home", path: "/" }, ...crumbs];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

export function faqPage(faq: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.domanda,
      acceptedAnswer: { "@type": "Answer", text: f.risposta },
    })),
  };
}

export function article(a: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.description,
    inLanguage: site.lang,
    datePublished: a.datePublished,
    dateModified: a.dateModified,
    mainEntityOfPage: absoluteUrl(a.path),
    url: absoluteUrl(a.path),
    image: absoluteUrl("/opengraph-image"),
    author: { "@type": "Organization", "@id": orgId, name: site.name },
    publisher: { "@type": "Organization", "@id": orgId, name: site.name },
  };
}

export function service() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Gestione annunci su ChatGPT",
    serviceType: "Pubblicità su ChatGPT, Google Ads, Meta Ads e SEO",
    description:
      "Strategia, configurazione, creazione e ottimizzazione di campagne pubblicitarie su ChatGPT per attività locali e aziende in Italia. Se ChatGPT non è il canale giusto, campagne su Google Ads, Meta Ads o SEO.",
    areaServed: { "@type": "Country", name: "Italia" },
    availableLanguage: "it",
    provider: { "@id": orgId },
    url: absoluteUrl("/annunci-chatgpt"),
  };
}

// Servizio principale "Più clienti da Google Maps" con le offerte.
export function serviceMaps() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Più clienti da Google Maps",
    serviceType: "Gestione del profilo dell'attività su Google (Google Business Profile)",
    description:
      "Aggiornamenti ogni settimana sul profilo Google Maps dell'attività, risposta a tutte le recensioni, link e QR per chiedere recensioni. Card e piedistallo da banco facoltativi per raccogliere recensioni avvicinando il telefono.",
    areaServed: { "@type": "Country", name: "Italia" },
    availableLanguage: "it",
    provider: { "@id": orgId },
    url: absoluteUrl("/"),
    offers: [
      {
        "@type": "Offer",
        name: "Più clienti da Google Maps",
        price: "59.00",
        priceCurrency: "EUR",
        priceSpecification: { "@type": "UnitPriceSpecification", price: "59.00", priceCurrency: "EUR", unitText: "mese", billingDuration: "P1M" },
        url: absoluteUrl("/#prezzo"),
      },
      {
        "@type": "Offer",
        name: "Card da banco per le recensioni",
        price: "40.00",
        priceCurrency: "EUR",
        description: "Una tantum, spedizione inclusa, arriva pronta all'uso.",
        url: absoluteUrl("/#da-banco"),
      },
      {
        "@type": "Offer",
        name: "Piedistallo da banco per le recensioni",
        price: "49.99",
        priceCurrency: "EUR",
        description: "Una tantum, spedizione inclusa, arriva pronto all'uso.",
        url: absoluteUrl("/#da-banco"),
      },
    ],
  };
}
