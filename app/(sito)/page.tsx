import { Suspense } from "react";
import Link from "next/link";
import { FaqList } from "@/components/ds/FaqList";
import { SectionHead } from "@/components/ds/SectionHead";
import { StepList } from "@/components/ds/StepList";
import { JsonLd } from "@/components/JsonLd";
import { MisureConfronto, ProdottoFoto } from "@/components/ProdottoFoto";
import { MapsCard } from "@/components/ds/MapsCard";
import { ServiceCards } from "@/components/ds/ServiceCards";
import { ReviewReply } from "@/components/ds/ReviewReply";
import { ConsulenzaForm } from "@/components/ConsulenzaForm";
import { Slideshow } from "@/components/Slideshow";
import type { Faq } from "@/lib/content";
import { breadcrumbList, faqPage, organization, serviceMaps, serviceSeo, website } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/metadata";
import { EXTRA, linkWhatsApp } from "@/lib/scheda";
import { ESEMPI_RISPOSTE } from "@/lib/esempi-risposte";
import { PROVE } from "@/lib/seo-locale";
import { Reveal } from "@/components/home/Reveal";
import { SerpDemo } from "@/components/home/SerpDemo";
import { ReportDemo } from "@/components/home/ReportDemo";
import { Confronto } from "@/components/home/Confronto";
import { NonBastano } from "@/components/home/NonBastano";
import { ComeFunziona } from "@/components/home/ComeFunziona";

// Ordine del business: 1) SEO del sito, 2) scheda Google Maps, 3) il resto.
export const metadata = pageMetadata({
  title: "SEO locale: il tuo sito, trovato su Google · TiTrovano",
  description:
    "Rendiamo il sito della tua attività leggibile da Google e dalle AI e lo riempiamo delle pagine che i clienti cercano nella tua zona. Su WordPress, Wix, Shopify o qualunque sito.",
  path: "/",
});

const problemi = [
  { titolo: "Google non capisce cosa fai, né dove", testo: "Titoli generici, una sola pagina \"Servizi\" per tutto, la città che non compare da nessuna parte. Chi cerca il tuo servizio nella tua zona trova qualcun altro." },
  { titolo: "Il sito risponde a domande che nessuno fa", testo: "Chi cerca scrive \"massaggio linfodrenante Talenti prezzo\" o \"come sbloccare il conto di un defunto\", non \"benvenuti nel nostro studio\". Se quella pagina non c'è, non ti trova." },
  { titolo: "Il testo non arriva a chi legge in fretta", testo: "Molti siti moderni mostrano i contenuti solo dopo che la pagina si è caricata nel browser. Alcuni programmi che leggono il web, compresi diversi assistenti AI, rischiano di vedere una pagina quasi vuota." },
  { titolo: "È fermo da anni", testo: "Nessuna pagina nuova, nessuna risposta alle domande dei clienti, nessun collegamento con la scheda Google. Un sito così non ha niente di nuovo da far trovare." },
];

const cosaFacciamo = [
  { titolo: "Controllo tecnico di ogni pagina", testo: "Titoli, descrizioni, velocità da telefono, link rotti, sitemap, dati strutturati: guardiamo il sito come lo legge Google, sistemiamo quello che non va e lo ricontrolliamo in automatico." },
  { titolo: "Una pagina per ogni servizio, nella tua zona", testo: "Ogni servizio importante ha la sua pagina chiara, con il posto in cui lavori. Mai pagine copia-incolla città per città." },
  { titolo: "Guide sulle domande vere dei tuoi clienti", testo: "Ogni settimana nuove pagine su quello che i clienti cercano prima di scegliere. Niente riempitivi, niente numeri inventati, niente promesse." },
  { titolo: "Leggibile anche dalle AI", testo: "Testi già nell'HTML, dati strutturati, file llms.txt: ChatGPT, Gemini e Perplexity possono leggere il sito e trovare le risposte che servono per consigliarti." },
  { titolo: "Ogni mese i numeri veri", testo: "Colleghiamo Google Search Console: per quali ricerche compari, quante persone ti hanno visto e quante hanno cliccato. Niente grafici gonfiati." },
];

const piattaforme = [
  { nome: "WordPress", testo: "Lavoriamo dal tuo pannello: pagine, titoli, plugin SEO, velocità." },
  { nome: "Wix e Squarespace", testo: "Usiamo gli strumenti SEO della piattaforma e aggiungiamo pagine e guide." },
  { nome: "Shopify", testo: "Schede prodotto, collezioni e guide per chi cerca prima di comprare." },
  { nome: "Siti su misura", testo: "Aggiungiamo un motore che a ogni pubblicazione genera pagine leggibili da Google, sitemap e llms.txt." },
];

const perLaScheda = [
  { titolo: "Una novità ogni settimana", testo: "Un piatto, un prodotto, un'offerta, un evento: chi ti trova vede un'attività aperta e curata." },
  { titolo: "Una risposta a ogni recensione", testo: "A nome tuo, con il tono giusto. Grazie a chi è contento, calma e soluzioni a chi si lamenta." },
  { titolo: "Più recensioni dai clienti veri", testo: "Link, QR e un messaggio pronto per WhatsApp. Senza regali in cambio, come chiedono le regole di Google." },
  { titolo: "Orari sempre giusti", testo: "Ferie, festivi, orari nuovi: ci mandi un messaggio e su Google è tutto aggiornato." },
];


const faq: Faq[] = [
  { domanda: "Devo rifare il sito?", risposta: "No. Lavoriamo sul sito che hai già, qualunque sia la piattaforma. Se una cosa sulla tua piattaforma non si può sistemare, te lo diciamo in consulenza, prima di iniziare." },
  { domanda: "Funziona con WordPress, Wix o Shopify?", risposta: "Sì. Su WordPress, Wix, Squarespace, Shopify e sui siti su misura. Su alcune piattaforme certe impostazioni tecniche sono bloccate: le compensiamo con pagine e contenuti, che contano di più." },
  { domanda: "In quanto tempo vedo i risultati?", risposta: "La SEO è un lavoro di mesi, non di giorni. Nel primo mese il sito viene sistemato e le prime pagine nuove vanno online; da lì Google inizia a mostrarle e il report mensile ti dice come va. La scheda Google Maps, invece, cambia aspetto da subito." },
  { domanda: "Mi garantite il primo posto su Google?", risposta: "No, e diffida di chi lo fa: nessuno decide al posto di Google. Ti garantiamo il lavoro fatto ogni settimana e i numeri veri di Google per vedere tu i risultati." },
  { domanda: "Quanto costa?", risposta: "Dipende da cosa ti serve: il sito, la scheda Google o tutti e due, e da quante pagine servono. In consulenza ti diciamo un prezzo mensile chiaro, prima di iniziare. La consulenza è gratuita e senza impegno." },
  { domanda: "Cosa vi serve da me?", risposta: "Un accesso al pannello del sito e a Google Search Console (se non ce l'hai lo creiamo insieme). Per la scheda Google approvi la nostra richiesta di accesso, senza darci password. Puoi rivedere le pagine prima che vadano online." },
  { domanda: "Non ho un sito. Potete aiutarmi lo stesso?", risposta: "Sì. Si può partire dalla scheda Google Maps, che per un'attività locale è la prima cosa che i clienti vedono. Se serve un sito, te lo diciamo in consulenza." },
  { domanda: "Come chiedete le recensioni? È tutto in regola?", risposta: "Sì. Solo ai tuoi clienti veri, senza regali o sconti in cambio e senza filtrare solo quelle positive, come chiedono le regole di Google. Niente recensioni finte." },
  { domanda: "Posso disdire?", risposta: "Sì, quando vuoi, senza penali. Ti basta un messaggio su WhatsApp o una email." },
  { domanda: "Funziona in tutta Italia?", risposta: "Sì. La consulenza è al telefono e il resto si fa online, senza incontri di persona. Per qualsiasi cosa ci trovi su WhatsApp." },
];

export default function Home() {
  const wa = linkWhatsApp();
  const cta = (secondario?: boolean) => (
    <a href="#attiva" className={`tt-btn tt-btn--block-mobile${secondario ? " tt-btn--secondary" : ""}`}>Prenota la consulenza gratuita <span aria-hidden="true">→</span></a>
  );

  return (
    <>
      <JsonLd data={[organization(), website(), serviceSeo(), serviceMaps(), breadcrumbList([]), faqPage(faq)]} />

      <Reveal />

      {/* Apertura: la SEO del sito, con la demo prima/dopo */}
      <div className="tt-wrap tt-page-head">
        <div className="tt-hero2">
          <div className="tt-stack-6">
            <p className="tt-eyebrow" style={{ margin: 0 }}>SEO locale · per attività e professionisti</p>
            <h1 className="tt-display-xl">Il tuo sito, <span className="tt-mark">finalmente trovato su Google.</span></h1>
            <p className="tt-lead">
              Quando un cliente cerca quello che fai nella tua zona, deve trovare te. Sistemiamo il tuo sito, gli aggiungiamo ogni
              settimana le pagine giuste e curiamo la scheda Google Maps. Su qualunque sito, senza rifarlo.
            </p>
            <div className="tt-actions">
              {cta()}
              <Link href="/controllo-sito" className="tt-btn tt-btn--secondary tt-btn--block-mobile">Controlla il tuo sito gratis</Link>
            </div>
            <ul className="tt-hero2__trust">
              <li>Consulenza gratuita con Vitaliy</li>
              <li>WordPress, Wix, Shopify</li>
              <li>Niente password</li>
            </ul>
          </div>
          <SerpDemo />
        </div>
      </div>

      <section className="tt-section tt-section--sunk">
        <div className="tt-wrap">
          <SectionHead n="01" occhiello="Il problema">Un bel sito <span className="tt-mark">che nessuno trova.</span></SectionHead>
          <div className="tt-section-body" data-reveal>
            <ul className="tt-points tt-points--2">{problemi.map((m) => <li key={m.titolo}><h3>{m.titolo}</h3><p>{m.testo}</p></li>)}</ul>
          </div>
        </div>
      </section>

      <section id="sito" className="tt-section" style={{ scrollMarginTop: "var(--space-8)" }}>
        <div className="tt-wrap tt-split">
          <div className="tt-split__aside">
            <SectionHead n="02" occhiello="Cosa facciamo" testo="Google mostra pagine, non siti. Più pagine giuste hai, più ricerche dei tuoi clienti puoi intercettare.">
              Da tre pagine <span className="tt-mark">a una per ogni domanda.</span>
            </SectionHead>
            <div className="tt-pd tt-section-body" data-reveal aria-label="Esempio: le pagine di un sito prima e dopo, su Olizen">
              <div className="tt-pd__col tt-pd__col--prima">
                <span className="tt-pd__label">Prima</span>
                <ul><li>Home</li><li>Servizi</li><li>Contatti</li></ul>
              </div>
              <div className="tt-pd__col tt-pd__col--dopo">
                <span className="tt-pd__label">Dopo</span>
                <ul>
                  <li>Massaggio linfodrenante a Roma</li>
                  <li>Massaggi a Talenti</li>
                  <li>Massaggio in gravidanza: da che mese?</li>
                  <li>Ogni quanto fare un massaggio?</li>
                  <li>…e altre ogni settimana</li>
                </ul>
              </div>
            </div>
            <p className="tt-small tt-muted">Esempio reale: le pagine del sito di Olizen, centro massaggi a Roma.</p>
          </div>
          <div className="tt-section-body" data-reveal><StepList passi={cosaFacciamo} /></div>
        </div>
      </section>

      <section className="tt-section tt-section--sunk">
        <div className="tt-wrap">
          <SectionHead n="03" occhiello="Su qualunque sito" testo="Non serve cambiare piattaforma né rifare il sito. Lavoriamo su quello che hai.">
            WordPress, Wix, Shopify… <span className="tt-mark">va bene tutto.</span>
          </SectionHead>
          <div className="tt-grid-3 tt-section-body" data-reveal>
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
          <SectionHead n="04" occhiello="Hai già provato?" testo="Scorciatoie che promettono di farti trovare su Google, ma non portano clienti.">
            Strumenti che promettono, <span className="tt-mark">ma non bastano.</span>
          </SectionHead>
          <div className="tt-section-body"><NonBastano /></div>
        </div>
      </section>

      <section id="report" className="tt-section tt-section--sunk" style={{ scrollMarginTop: "var(--space-8)" }}>
        <div className="tt-wrap tt-split">
          <div className="tt-split__aside">
            <SectionHead n="05" occhiello="Ogni mese, i numeri" testo="Niente sigle e niente grafici gonfiati: i dati veri di Google, spiegati in parole semplici.">
              Vedi con i tuoi occhi <span className="tt-mark">se funziona.</span>
            </SectionHead>
            <ul className="tt-ticks tt-section-body">
              <li>Quante persone ti hanno visto su Google</li>
              <li>Quante hanno cliccato sul tuo sito</li>
              <li>Per quali ricerche compari, e in che posizione</li>
            </ul>
          </div>
          <div className="tt-section-body" data-reveal><ReportDemo /></div>
        </div>
      </section>

      <section id="risultati" className="tt-section" style={{ scrollMarginTop: "var(--space-8)" }}>
        <div className="tt-wrap">
          <SectionHead n="06" occhiello="Già al lavoro" testo="Lo stesso metodo gira ogni giorno su siti veri. Apri gli esempi: sono pagine online adesso.">
            Non una promessa: <span className="tt-mark">siti che puoi aprire.</span>
          </SectionHead>
          <div className="tt-grid-3 tt-grid-3--tre tt-section-body" data-reveal>
            {PROVE.map((p) => (
              <article key={p.nome} className="tt-card tt-stack-4">
                <div>
                  <p className="tt-eyebrow" style={{ margin: 0 }}>{p.settore}</p>
                  <h3 className="tt-heading" style={{ margin: "var(--space-2) 0 0" }}>{p.nome}</h3>
                </div>
                <p className="tt-body" style={{ margin: 0 }}>{p.cosa}</p>
                <ul className="tt-ticks tt-small" style={{ margin: 0 }}>{p.numeri.map((n) => <li key={n}>{n}</li>)}</ul>
                {p.link.url.startsWith("/") ? (
                  <Link href={p.link.url} className="tt-small">{p.link.testo} →</Link>
                ) : (
                  <a href={p.link.url} className="tt-small" target="_blank" rel="noopener">Leggi: {p.link.testo} ↗</a>
                )}
              </article>
            ))}
          </div>
          <p className="tt-small tt-muted" style={{ marginTop: "var(--space-4)" }}>
            Numeri contati sulle sitemap e sui siti pubblici il 10 ottobre 2026. Crescono ogni settimana. Le regole che seguiamo sono
            quelle della <a href="https://developers.google.com/search/docs/fundamentals/seo-starter-guide?hl=it">guida SEO di Google</a>.
          </p>
        </div>
      </section>

      <section id="maps" className="tt-section tt-section--sunk" style={{ scrollMarginTop: "var(--space-8)" }}>
        <div className="tt-wrap">
          <div className="tt-fatto">
            <div>
              <SectionHead
                n="07"
                occhiello="E la scheda Google Maps"
                testo="Per chi cerca vicino, la prima cosa che vede è la tua scheda Google. La curiamo noi, ogni settimana, insieme al sito."
              >
                Sito e Maps, <span className="tt-mark">che lavorano insieme.</span>
              </SectionHead>
              <div className="tt-section-body tt-stack-6">
                <StepList passi={perLaScheda} />
                <p className="tt-body" style={{ margin: 0 }}><Link href="/scheda-google">Come funziona la gestione della scheda Google →</Link></p>
              </div>
            </div>
            <div className="tt-fatto__esempio">
              <p className="tt-label" style={{ margin: "0 0 var(--space-3)" }}>Il risultato, su Google Maps</p>
              <MapsCard />
            </div>
          </div>

          <div className="tt-risposte">
            <div className="tt-risposte__head">
              <h3 className="tt-heading" style={{ margin: 0 }}>Come rispondiamo alle recensioni</h3>
              <p className="tt-body tt-muted" style={{ margin: 0 }}>A nome tuo, con il tono giusto per ognuna. Esempi con nomi di fantasia.</p>
            </div>
            <Slideshow etichetta="Esempi di risposte alle recensioni">
              {ESEMPI_RISPOSTE.map((e) => (
                <li key={e.autore} className="tt-risposta">
                  <p className="tt-risposta__tipo"><span className="tt-tag">{e.tipo}</span> <span className="tt-muted">{e.settore}</span></p>
                  <ReviewReply autore={e.autore} voto={e.voto} testo={e.testo} risposta={e.risposta} />
                </li>
              ))}
            </Slideshow>
          </div>
        </div>
      </section>

      <section className="tt-section">
        <div className="tt-wrap">
          <SectionHead n="08" occhiello="Perché noi">Con noi, <span className="tt-mark">o con gli altri.</span></SectionHead>
          <div className="tt-section-body" data-reveal><Confronto /></div>
        </div>
      </section>

      <section id="come-funziona" className="tt-section tt-section--sunk" style={{ scrollMarginTop: "var(--space-8)" }}>
        <div className="tt-wrap">
          <SectionHead n="09" occhiello="Come funziona">Si parte da <span className="tt-mark">una chiacchierata.</span></SectionHead>
          <div className="tt-section-body tt-stack-8">
            <ComeFunziona />
            <aside className="tt-callout" style={{ maxWidth: "var(--measure)" }}>
              <span className="tt-tag">Importante</span>
              <h3>Non ci dai nessuna password</h3>
              <p>Per Google approvi una richiesta di accesso via email, e la scheda resta tua. Per il sito ci crei un utente che puoi togliere quando vuoi.</p>
            </aside>
          </div>
        </div>
      </section>

      <section id="attiva" className="tt-section" style={{ scrollMarginTop: "var(--space-8)" }}>
        <div className="tt-wrap tt-split tt-split--form">
          <div className="tt-split__aside">
            <SectionHead
              n="10"
              occhiello="Consulenza gratuita"
              testo={wa ? "Due minuti per il modulo, poi scegli tu l'orario della call. Se preferisci, scrivici su WhatsApp." : "Due minuti per il modulo, poi scegli tu l'orario della call."}
            >
              Parliamone, <span className="tt-mark">gratis.</span>
            </SectionHead>
            <ul className="tt-ticks tt-section-body">
              <li>Guardiamo il tuo sito e la tua scheda prima della call</li>
              <li>Ti diciamo cosa sistemare, anche se poi fai da solo</li>
              <li>Prezzo chiaro prima di iniziare, nessun impegno</li>
              <li>Non ci dai nessuna password</li>
            </ul>
            {wa && <p className="tt-body"><a href={wa}>Preferisci scrivere? WhatsApp →</a></p>}
          </div>
          <div className="tt-card tt-section-body">
            <Suspense fallback={null}>
              <ConsulenzaForm pagina="/" />
            </Suspense>
          </div>
        </div>
      </section>

      <section className="tt-section tt-section--sunk">
        <div className="tt-wrap tt-split">
          <div className="tt-split__aside">
            <SectionHead occhiello="Domande frequenti">Prima che tu <span className="tt-mark">lo chieda.</span></SectionHead>
            <div className="tt-section-body">{cta()}</div>
          </div>
          <div className="tt-section-body"><FaqList items={faq} /></div>
        </div>
      </section>

      <section id="da-banco" className="tt-section" style={{ scrollMarginTop: "var(--space-8)" }}>
        <div className="tt-wrap tt-wrap--read">
          <SectionHead
            occhiello="Card e piedistallo"
            testo="Da mettere sul bancone o vicino alla cassa: il cliente avvicina il telefono e si apre subito la pagina per lasciarti una recensione. Niente app, niente ricerche."
          >
            Recensioni con un tocco <span className="tt-mark">del telefono.</span>
          </SectionHead>
          <div className="tt-extra-grid tt-section-body">
            {(Object.keys(EXTRA) as (keyof typeof EXTRA)[]).map((k) => (
              <div key={k} className="tt-product">
                <ProdottoFoto tipo={k} />
                <h3>{EXTRA[k].nome}</h3>
                <p className="tt-muted" style={{ margin: 0 }}>{EXTRA[k].misure}</p>
                <p>{EXTRA[k].descrizione}</p>
                <Link href={`/compra/${k}`} className="tt-btn tt-btn--block">Compralo ora <span aria-hidden="true">→</span></Link>
              </div>
            ))}
          </div>
          <MisureConfronto />
          <p className="tt-body" style={{ marginTop: "var(--space-6)" }}>Arrivano già pronti, collegati alla tua attività. Puoi comprarli da soli, oppure aggiungerli al servizio: ne parliamo in consulenza.</p>
        </div>
      </section>

      <section className="tt-section tt-section--sunk">
        <div className="tt-wrap">
          <SectionHead
            occhiello="Per crescere ancora"
            testo="Quando sito e scheda sono a posto, il passo successivo può essere la pubblicità. Ti diciamo in una call gratuita quale canale ha senso per te."
          >
            Anche annunci online, <span className="tt-mark">quando servono.</span>
          </SectionHead>
          <div className="tt-section-body">
            <ServiceCards servizi={[
              { href: "/scheda-google", nome: "Google Maps", testo: "Scheda curata, recensioni con risposta, novità ogni settimana.", piu: "Consulenza gratuita", scena: "mappa", logo: "googlemaps" },
              { href: "/analisi-gratuita", nome: "Annunci su Google", testo: "Sei il primo risultato quando cercano quello che fai.", piu: "Consulenza gratuita", scena: "ricerca", logo: "google" },
              { href: "/analisi-gratuita", nome: "Annunci su Meta", testo: "Ti vedono su Facebook e Instagram le persone della tua zona.", piu: "Consulenza gratuita", scena: "feed", logo: "meta" },
              { href: "/annunci-chatgpt", nome: "Annunci su ChatGPT", testo: "Compari accanto alla risposta quando chiedono un consiglio.", piu: "Consulenza gratuita", scena: "chat" },
            ]} />
          </div>
        </div>
      </section>
    </>
  );
}
