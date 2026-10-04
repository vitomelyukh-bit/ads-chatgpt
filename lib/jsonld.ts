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
    url: absoluteUrl("/"),
  };
}
