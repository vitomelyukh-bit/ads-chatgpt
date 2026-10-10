import { Suspense } from "react";
import Link from "next/link";
import { FaqList } from "@/components/ds/FaqList";
import { SectionHead } from "@/components/ds/SectionHead";
import { StepList } from "@/components/ds/StepList";
import { ConsulenzaForm } from "@/components/ConsulenzaForm";
import type { Faq } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { linkWhatsApp } from "@/lib/scheda";
import { PROVE } from "@/lib/seo-locale";

// Pagina riservata: si raggiunge solo dal link diretto (outbound, WhatsApp, porta a porta).
// Non è nel menu, né nella sitemap, né in llms.txt, e chiede ai motori di non indicizzarla.
export const metadata = pageMetadata({
  title: "SEO locale: il tuo sito, finalmente trovato su Google · TiTrovano",
  description:
    "Rendiamo il tuo sito leggibile da Google e dalle AI e lo riempiamo delle pagine che i tuoi clienti cercano nella tua zona. Su WordPress, Wix, Shopify o qualunque sito.",
  path: "/proposta/seo-locale",
  noindex: true,
});

const problemi = [
  { titolo: "Google non capisce cosa fai, né dove", testo: "Titoli generici, una sola pagina \"Servizi\" per tutto, la città che non compare da nessuna parte. Chi cerca il tuo servizio nella tua zona trova qualcun altro." },
  { titolo: "Il sito risponde a domande che nessuno fa", testo: "Chi cerca scrive \"massaggio linfodrenante Talenti prezzo\" o \"come sbloccare il conto di un defunto\", non \"benvenuti nel nostro studio\". Se quella pagina non c'è, non ti trova." },
  { titolo: "Il testo non arriva a chi legge in fretta", testo: "Molti siti moderni mostrano i contenuti solo dopo che la pagina si è caricata nel browser. Alcuni programmi che leggono il web, compresi diversi assistenti AI, rischiano di vedere una pagina quasi vuota." },
  { titolo: "È fermo da anni", testo: "Nessuna pagina nuova, nessuna risposta alle domande dei clienti, nessun collegamento con la scheda Google. Un sito così non ha niente di nuovo da far trovare." },
];

const cosaFacciamo = [
  { titolo: "Controllo tecnico di ogni pagina", testo: "Titoli, descrizioni, velocità da telefono, link rotti, sitemap, dati strutturati: guardiamo il sito come lo legge Google e sistemiamo quello che non va. Poi lo ricontrolliamo in automatico." },
  { titolo: "Una pagina per ogni servizio, nella tua zona", testo: "\"Massaggio linfodrenante\", \"Ricorso contro una multa\", \"Trasloco di un ufficio\": ogni servizio importante ha la sua pagina chiara, con il posto in cui lavori. Mai pagine copia-incolla città per città." },
  { titolo: "Guide sulle domande vere dei tuoi clienti", testo: "Ogni settimana nuove pagine che rispondono a quello che i tuoi clienti cercano prima di scegliere. Scritte con regole severe: niente riempitivi, niente numeri inventati, niente promesse." },
  { titolo: "Leggibile anche dalle AI", testo: "Testi presenti già nell'HTML, dati strutturati, file llms.txt: ChatGPT, Gemini e Perplexity possono leggere il sito e trovare le risposte che servono per consigliarti." },
  { titolo: "Collegato alla scheda Google Maps", testo: "Stesso nome, indirizzo, telefono e orari ovunque, e le pagine del sito collegate alla scheda. Per chi cerca in zona sito e scheda lavorano insieme." },
  { titolo: "Ogni mese i numeri veri", testo: "Colleghiamo Google Search Console e ti mandiamo per quali ricerche compari, quante persone ti hanno visto e quante hanno cliccato. Niente grafici gonfiati: i dati di Google." },
];

const piattaforme = [
  { nome: "WordPress", testo: "Lavoriamo dal tuo pannello: pagine, titoli, plugin SEO, velocità." },
  { nome: "Wix e Squarespace", testo: "Usiamo gli strumenti SEO della piattaforma e aggiungiamo pagine e guide." },
  { nome: "Shopify", testo: "Schede prodotto, collezioni e guide per chi cerca prima di comprare." },
  { nome: "Siti su misura", testo: "Aggiungiamo un motore che a ogni pubblicazione genera pagine leggibili da Google, sitemap e llms.txt." },
];

const faq: Faq[] = [
  { domanda: "Devo rifare il sito?", risposta: "No. Lavoriamo sul sito che hai già, qualunque sia la piattaforma. Se una cosa sulla tua piattaforma non si può sistemare, te lo diciamo in consulenza, prima di iniziare." },
  { domanda: "Funziona con WordPress, Wix o Shopify?", risposta: "Sì. Su WordPress, Wix, Squarespace, Shopify e sui siti su misura. Su alcune piattaforme certe impostazioni tecniche sono bloccate: le aggiriamo con le pagine e i contenuti, che contano di più." },
  { domanda: "In quanto tempo vedo i risultati?", risposta: "La SEO è un lavoro di mesi, non di giorni. Nel primo mese il sito viene sistemato e le prime pagine nuove vanno online; da lì Google inizia a mostrarle e i numeri del report mensile ti dicono come va." },
  { domanda: "Mi garantite il primo posto su Google?", risposta: "No, e diffida di chi lo fa: nessuno decide al posto di Google. Ti garantiamo il lavoro fatto ogni settimana e i numeri veri di Search Console per vedere tu i risultati." },
  { domanda: "Quanto costa?", risposta: "Dipende dal sito e da quante pagine servono. In consulenza ti diciamo un prezzo mensile chiaro, prima di iniziare. La consulenza è gratuita." },
  { domanda: "Cosa vi serve da me?", risposta: "Un accesso al pannello del sito e a Google Search Console (se non ce l'hai, lo creiamo insieme). Per il resto facciamo noi: puoi rivedere le pagine prima che vadano online." },
  { domanda: "E la scheda Google Maps?", risposta: "Va di pari passo: se vuoi la gestiamo noi ogni settimana, con novità, risposte alle recensioni e i numeri del mese. È il nostro servizio principale." },
];

export default function SeoLocalePage() {
  const wa = linkWhatsApp();
  return (
    <>
      <div className="tt-wrap tt-page-head">
        <div className="tt-fatto">
          <div className="tt-stack-6">
            <p className="tt-eyebrow" style={{ margin: 0 }}>SEO locale · per chi ha già un sito</p>
            <h1 className="tt-display-xl">Hai un sito. <span className="tt-mark">Ora deve farsi trovare.</span></h1>
            <p className="tt-lead">
              Lo rendiamo leggibile da Google e dalle AI, lo riempiamo delle pagine che i tuoi clienti cercano nella tua zona e
              lo colleghiamo alla scheda Google Maps. Su WordPress, Wix, Shopify o qualunque sito tu abbia, senza rifarlo.
            </p>
            <div className="tt-actions">
              <a href="#analisi" className="tt-btn tt-btn--block-mobile">Prenota la consulenza gratuita <span aria-hidden="true">→</span></a>
              {wa && <a href={wa} className="tt-btn tt-btn--secondary tt-btn--block-mobile">Scrivici su WhatsApp</a>}
            </div>
            <p className="tt-body-strong" style={{ margin: 0, fontSize: 17 }}>Consulenza gratuita con Vitaliy · guardiamo il tuo sito e ti diciamo cosa sistemare, anche se poi fai da solo</p>
          </div>
          <div className="tt-fatto__esempio">
            <div className="tt-card tt-stack-4" aria-label="Esempio: come Google vede un sito prima e dopo">
              <p className="tt-eyebrow" style={{ margin: 0 }}>Come Google vede il sito</p>
              <div>
                <p className="tt-small tt-muted" style={{ margin: "0 0 var(--space-2)" }}>Prima</p>
                <ul className="tt-small" style={{ margin: 0, paddingLeft: 18 }}>
                  <li>Home</li>
                  <li>Servizi</li>
                  <li>Contatti</li>
                </ul>
              </div>
              <div>
                <p className="tt-small tt-muted" style={{ margin: "0 0 var(--space-2)" }}>Dopo, per esempio su Olizen</p>
                <ul className="tt-ticks tt-small" style={{ margin: 0 }}>
                  <li>Massaggio linfodrenante a Roma</li>
                  <li>Massaggi a Talenti</li>
                  <li>Massaggio in gravidanza: da che mese?</li>
                  <li>Ogni quanto fare un massaggio?</li>
                  <li>Mal di schiena da scrivania e massaggio</li>
                  <li>…e altre pagine ogni settimana</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="tt-section tt-section--sunk">
        <div className="tt-wrap tt-wrap--read">
          <SectionHead n="01" occhiello="Il problema">Un bel sito <span className="tt-mark">che nessuno trova.</span></SectionHead>
          <div className="tt-section-body"><StepList passi={problemi} /></div>
        </div>
      </section>

      <section className="tt-section">
        <div className="tt-wrap tt-wrap--read">
          <SectionHead n="02" occhiello="Cosa facciamo">Il tuo sito, <span className="tt-mark">trasformato in un posto da trovare.</span></SectionHead>
          <div className="tt-section-body"><StepList passi={cosaFacciamo} /></div>
        </div>
      </section>

      <section className="tt-section tt-section--sunk">
        <div className="tt-wrap tt-wrap--read">
          <SectionHead
            n="03"
            occhiello="Su qualunque sito"
            testo="Non serve cambiare piattaforma né rifare il sito. Lavoriamo su quello che hai."
          >
            WordPress, Wix, Shopify… <span className="tt-mark">va bene tutto.</span>
          </SectionHead>
          <div className="tt-grid-3 tt-section-body">
            {piattaforme.map((p) => (
              <div key={p.nome} className="tt-card tt-stack-2">
                <h3 className="tt-heading" style={{ margin: 0 }}>{p.nome}</h3>
                <p className="tt-body tt-muted" style={{ margin: 0 }}>{p.testo}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="tt-section">
        <div className="tt-wrap">
          <SectionHead
            n="04"
            occhiello="Già al lavoro"
            testo="Lo stesso metodo gira ogni giorno su siti veri. Apri gli esempi: sono pagine online adesso."
          >
            Non una promessa: <span className="tt-mark">siti che puoi aprire.</span>
          </SectionHead>
          <div className="tt-grid-3 tt-grid-3--tre tt-section-body">
            {PROVE.map((p) => (
              <article key={p.nome} className="tt-card tt-stack-4">
                <div>
                  <p className="tt-eyebrow" style={{ margin: 0 }}>{p.settore}</p>
                  <h3 className="tt-heading" style={{ margin: "var(--space-2) 0 0" }}>{p.nome}</h3>
                </div>
                <p className="tt-body" style={{ margin: 0 }}>{p.cosa}</p>
                <ul className="tt-ticks tt-small" style={{ margin: 0 }}>
                  {p.numeri.map((n) => <li key={n}>{n}</li>)}
                </ul>
                {p.link.url.startsWith("/") ? (
                  <Link href={p.link.url} className="tt-small">{p.link.testo} →</Link>
                ) : (
                  <a href={p.link.url} className="tt-small" target="_blank" rel="noopener">Leggi: {p.link.testo} ↗</a>
                )}
              </article>
            ))}
          </div>
          <p className="tt-small tt-muted" style={{ marginTop: "var(--space-4)" }}>
            Numeri contati sulle sitemap e sui siti pubblici il 10 ottobre 2026. Crescono ogni settimana.
          </p>
        </div>
      </section>

      <section className="tt-section tt-section--sunk">
        <div className="tt-wrap tt-wrap--read">
          <SectionHead n="05" occhiello="Cosa aspettarti">Risultati veri, <span className="tt-mark">misurati da Google.</span></SectionHead>
          <div className="tt-section-body tt-stack-6">
            <StepList
              passi={[
                { titolo: "Il primo mese", testo: "Il sito viene sistemato, le pagine dei servizi e le prime guide vanno online, Search Console è collegata." },
                { titolo: "I mesi successivi", testo: "Ogni settimana pagine nuove. Google inizia a mostrarle per le ricerche della tua zona: nel report vedi per quali ricerche compari, quante persone ti vedono e quante cliccano." },
                { titolo: "Nel tempo", testo: "Il sito diventa la risposta alle domande dei tuoi clienti, su Google e negli assistenti AI. Ogni pagina continua a lavorare anche quando tu non ci pensi." },
              ]}
            />
            <aside className="tt-callout">
              <span className="tt-tag">Onestà</span>
              <h3>Nessuno può garantirti il primo posto</h3>
              <p>
                Google decide in base a pertinenza, distanza e notorietà. Noi garantiamo il lavoro fatto ogni settimana e i numeri
                veri per vedere come va. Le regole sono quelle della{" "}
                <a href="https://developers.google.com/search/docs/fundamentals/seo-starter-guide?hl=it">guida SEO di Google</a>.
              </p>
            </aside>
          </div>
        </div>
      </section>

      <section className="tt-section">
        <div className="tt-wrap tt-wrap--read">
          <SectionHead n="06" occhiello="Domande frequenti">Sulla SEO <span className="tt-mark">del tuo sito.</span></SectionHead>
          <div className="tt-section-body"><FaqList items={faq} /></div>
        </div>
      </section>

      <section id="analisi" className="tt-section tt-section--sunk" style={{ scrollMarginTop: "var(--space-8)" }}>
        <div className="tt-wrap tt-wrap--read">
          <SectionHead
            occhiello="Consulenza gratuita"
            testo={wa ? "Compila il modulo e scegli l'orario della call, oppure scrivici su WhatsApp se preferisci." : "Compila il modulo e scegli l'orario della call."}
          >
            Guardiamo il tuo sito <span className="tt-mark">come lo vede Google.</span>
          </SectionHead>
          <div className="tt-card tt-section-body">
            <Suspense fallback={null}>
              <ConsulenzaForm interesse="Sito trovato su Google (SEO)" pagina="/proposta/seo-locale" />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  );
}
