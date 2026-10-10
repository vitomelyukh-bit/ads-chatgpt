import { Suspense } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqList } from "@/components/ds/FaqList";
import { JsonLd } from "@/components/JsonLd";
import { ControlloSito } from "@/components/controllo/ControlloSito";
import type { Faq } from "@/lib/content";
import { faqPage } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/metadata";
import { absoluteUrl, site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Controllo SEO gratis del tuo sito in 10 secondi · TiTrovano",
  description:
    "Scrivi l'indirizzo del tuo sito: controlliamo gratis se Google e le AI possono trovarlo, cosa blocca la SEO e cosa sistemare. Per WordPress, Wix, Shopify e ogni sito.",
  path: "/controllo-sito",
});

const faq: Faq[] = [
  { domanda: "Cosa controlla esattamente?", risposta: "La prima pagina del sito, come la riceve Google: blocchi all'indicizzazione, connessione sicura, titolo, descrizione, testo leggibile senza JavaScript, impostazione per il telefono, velocità di risposta, mappa del sito, dati strutturati e descrizione delle immagini." },
  { domanda: "È davvero gratis?", risposta: "Sì, senza registrazione. Se vuoi, sotto il risultato puoi prenotare una consulenza gratuita: anche quella è senza impegno." },
  { domanda: "Il punteggio è quello di Google?", risposta: "No. È un nostro punteggio semplice per farti vedere a colpo d'occhio cosa è a posto e cosa no. Google non dà voti ai siti: per sapere per quali ricerche compari servono i dati di Google Search Console." },
  { domanda: "Funziona con WordPress, Wix e Shopify?", risposta: "Sì, con qualunque sito pubblico. Il controllo prova anche a riconoscere con cosa è fatto." },
];

export default function ControlloSitoPage() {
  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Controllo SEO gratuito del sito",
            url: absoluteUrl("/controllo-sito"),
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
            provider: { "@type": "Organization", name: site.name, url: absoluteUrl("/") },
          },
          faqPage(faq),
        ]}
      />
      <div className="tt-wrap tt-wrap--read tt-page-head">
        <Breadcrumbs items={[{ name: "Controllo gratuito del sito", path: "/controllo-sito" }]} />
        <div className="tt-stack-6" style={{ marginTop: "var(--space-6)" }}>
          <p className="tt-eyebrow" style={{ margin: 0 }}>Controllo SEO gratuito</p>
          <h1 className="tt-display-xl">Il tuo sito si fa trovare? <span className="tt-mark">Scoprilo in 10 secondi.</span></h1>
          <p className="tt-lead">Scrivi l&apos;indirizzo del tuo sito: ti diciamo in parole semplici cosa vede Google, cosa lo blocca e cosa sistemare per primo.</p>
          <Suspense fallback={null}>
            <ControlloSito />
          </Suspense>
        </div>
      </div>
      <section className="tt-section tt-section--sunk">
        <div className="tt-wrap tt-wrap--read">
          <h2 className="tt-heading">Domande frequenti</h2>
          <div className="tt-section-body"><FaqList items={faq} /></div>
        </div>
      </section>
    </>
  );
}
