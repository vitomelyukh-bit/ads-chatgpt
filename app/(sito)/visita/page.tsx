import { Suspense } from "react";
import { FaqList } from "@/components/ds/FaqList";
import { Reveal } from "@/components/home/Reveal";
import { SerpDemo } from "@/components/home/SerpDemo";
import { ControlloSito } from "@/components/controllo/ControlloSito";
import { ConsulenzaForm } from "@/components/ConsulenzaForm";
import type { Faq } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { linkWhatsApp } from "@/lib/scheda";
import { PROVE } from "@/lib/seo-locale";

// Pagina da mostrare porta a porta, dal telefono: i problemi dei siti di oggi e
// cosa facciamo per ognuno. Non indicizzata, non nel menu né nella sitemap.
// Link con il sito già pronto: /visita?sito=nomesito.it (il controllo parte da solo).
export const metadata = pageMetadata({
  title: "Il tuo sito porta clienti? · TiTrovano",
  description: "I problemi più comuni dei siti delle attività e cosa facciamo per ognuno. Controlla il tuo sito in 10 secondi.",
  path: "/visita",
  noindex: true,
});

type Problema = { segno: string; titolo: string; succede: string; facciamo: string };

const PROBLEMI: Problema[] = [
  {
    segno: "🔍",
    titolo: "Google non capisce cosa fai, né dove",
    succede: "Il titolo della pagina è «Home» o solo il nome dell'attività. La città non compare. Chi cerca il tuo servizio in zona trova un concorrente.",
    facciamo: "Titoli e testi che dicono chiaro cosa fai e dove: così Google sa a chi mostrarti.",
  },
  {
    segno: "📄",
    titolo: "Una sola pagina «Servizi» per tutto",
    succede: "Chi cerca un servizio preciso vuole la pagina di quel servizio. Se non c'è, Google mostra chi ce l'ha.",
    facciamo: "Una pagina chiara per ogni servizio importante, con prezzi, domande e zona in cui lavori.",
  },
  {
    segno: "🕸️",
    titolo: "Fermo da anni",
    succede: "Nessuna pagina nuova, notizie vecchie, foto di anni fa. Per Google e per i clienti è un sito che non si muove.",
    facciamo: "Ogni settimana una pagina nuova sulle domande vere dei tuoi clienti. Senza che tu debba scrivere niente.",
  },
  {
    segno: "📱",
    titolo: "Dal telefono è lento o scomodo",
    succede: "Chi cerca un'attività vicina spesso lo fa dal telefono, in giro. Se la pagina tarda o i tasti sono piccoli, torna indietro.",
    facciamo: "Controlliamo velocità e lettura da telefono e sistemiamo quello che si può sul sito che hai già.",
  },
  {
    segno: "📍",
    titolo: "La scheda Google Maps è abbandonata",
    succede: "Recensioni senza risposta, orari vecchi, nessuna novità. È la prima cosa che vede chi ti cerca vicino.",
    facciamo: "Una novità a settimana, una risposta a ogni recensione, orari sempre giusti. Collegata al sito.",
  },
  {
    segno: "🤖",
    titolo: "ChatGPT e le AI non riescono a leggerlo",
    succede: "Molti siti mostrano i testi solo dopo il caricamento: alcuni programmi, compresi diversi assistenti AI, vedono una pagina quasi vuota.",
    facciamo: "Rendiamo i testi leggibili subito, con i dati che servono a Google e alle AI per capire chi sei.",
  },
  {
    segno: "📊",
    titolo: "Non sai se ti porta clienti",
    succede: "Nessuno ti dice quante persone ti hanno trovato e per quali ricerche. Paghi il sito e non sai se lavora.",
    facciamo: "Ogni mese una pagina con i numeri veri di Google: quante persone ti hanno visto e quante hanno cliccato.",
  },
];

const TU = [
  "Non rifai il sito: lavoriamo su quello che hai",
  "Nessuna password da darci",
  "Nessun contratto lungo, smetti quando vuoi",
  "Il sito e le pagine restano tuoi",
  "Parli sempre con la stessa persona",
];

const faq: Faq[] = [
  { domanda: "Devo rifare il sito?", risposta: "No. Lavoriamo sul sito che hai già: WordPress, Wix, Shopify o qualunque altro. Se manca il sito, si parte dalla scheda Google Maps." },
  { domanda: "Quanto costa?", risposta: "Un abbonamento mensile con un prezzo chiaro, che ti diciamo in consulenza prima di iniziare, in base al tuo sito e a cosa serve. Nessun costo nascosto." },
  { domanda: "In quanto tempo si vede qualcosa?", risposta: "La scheda Google Maps cambia aspetto da subito. Il sito su Google è un lavoro di mesi: nel primo mese lo sistemiamo e mettiamo online le prime pagine, poi ogni mese vedi i numeri." },
  { domanda: "Mi garantite il primo posto?", risposta: "No: decide Google, e chi lo garantisce ti prende in giro. Ti garantiamo il lavoro fatto ogni settimana e i numeri veri per giudicare tu." },
  { domanda: "Cosa devo fare io?", risposta: "Approvare l'accesso all'inizio, con un tocco. Poi, se ti va, mandarci ogni tanto una foto o una novità su WhatsApp. Al resto pensiamo noi." },
];

export default function Visita() {
  const wa = linkWhatsApp();
  const esempi = PROVE.filter((p) => !p.link.url.startsWith("/")).slice(0, 4);

  return (
    <div className="tt-vis">
      <Reveal />

      <header className="tt-vis__hero">
        <div className="tt-vis__wrap">
          <p className="tt-eyebrow" style={{ margin: 0 }}>TiTrovano · per attività e professionisti</p>
          <h1 className="tt-vis__h1">
            Quando un cliente ti cerca su Google, <span className="tt-mark">trova te o il vicino?</span>
          </h1>
          <p className="tt-vis__lead">
            Avere un sito non basta: deve farsi trovare. Ecco i problemi più comuni e cosa possiamo fare per il tuo, da subito.
          </p>
          <div className="tt-vis__cta">
            <a href="#controllo" className="tt-btn tt-btn--lg tt-btn--block-mobile">Guardiamo il tuo sito ora <span aria-hidden="true">→</span></a>
            <a href="#problemi" className="tt-btn tt-btn--lg tt-btn--secondary tt-btn--block-mobile">I problemi più comuni</a>
          </div>
        </div>
      </header>

      <section id="problemi" className="tt-vis__sez tt-section--sunk">
        <div className="tt-vis__wrap">
          <p className="tt-vis__step">1 · Il problema</p>
          <h2 className="tt-vis__h2">I problemi che vediamo <span className="tt-mark">più spesso.</span></h2>
          <p className="tt-vis__sotto">Per ognuno: cosa succede oggi e cosa facciamo noi.</p>
          <ol className="tt-vis__problemi">
            {PROBLEMI.map((p, i) => (
              <li key={p.titolo} className="tt-vis__prob" data-reveal>
                <div className="tt-vis__prob-head">
                  <span className="tt-vis__segno" aria-hidden="true">{p.segno}</span>
                  <h3><small>{i + 1}</small>{p.titolo}</h3>
                </div>
                <p className="tt-vis__succede"><b>Oggi</b>{p.succede}</p>
                <p className="tt-vis__facciamo"><b>Con noi</b>{p.facciamo}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="tt-vis__sez">
        <div className="tt-vis__wrap">
          <p className="tt-vis__step">2 · La differenza</p>
          <h2 className="tt-vis__h2">Stessa ricerca, <span className="tt-mark">prima e dopo.</span></h2>
          <p className="tt-vis__sotto">Tocca «Prima» e «Dopo»: è quello che vede chi cerca il tuo servizio nella tua zona.</p>
          <div className="tt-vis__demo"><SerpDemo /></div>
        </div>
      </section>

      <section id="controllo" className="tt-vis__sez tt-section--sunk">
        <div className="tt-vis__wrap">
          <p className="tt-vis__step">3 · Il tuo sito</p>
          <h2 className="tt-vis__h2">Guardiamo il tuo sito, <span className="tt-mark">adesso.</span></h2>
          <p className="tt-vis__sotto">Scrivi l&apos;indirizzo: in 10 secondi vediamo insieme cosa vede Google.</p>
          <div className="tt-vis__card"><Suspense fallback={null}><ControlloSito /></Suspense></div>
        </div>
      </section>

      <section className="tt-vis__sez">
        <div className="tt-vis__wrap">
          <p className="tt-vis__step">4 · Cosa fai tu</p>
          <h2 className="tt-vis__h2">Tu fai il tuo lavoro. <span className="tt-mark">Al sito pensiamo noi.</span></h2>
          <ul className="tt-vis__check">{TU.map((t) => <li key={t}>{t}</li>)}</ul>
          <p className="tt-vis__nota">Lo stesso metodo è già al lavoro su questi siti, a Roma:</p>
          <ul className="tt-vis__esempi">
            {esempi.map((p) => (
              <li key={p.nome}>
                <a href={p.link.url} target="_blank" rel="noopener">
                  <b>{p.nome}</b>
                  <span>{p.settore}</span>
                  <small>Apri una pagina vera →</small>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="tt-vis__sez tt-section--sunk">
        <div className="tt-vis__wrap">
          <p className="tt-vis__step">5 · Domande</p>
          <h2 className="tt-vis__h2">Le domande <span className="tt-mark">di tutti.</span></h2>
          <FaqList items={faq} />
        </div>
      </section>

      <section id="attiva" className="tt-vis__sez tt-vis__fine">
        <div className="tt-vis__wrap">
          <h2 className="tt-vis__h2">Partiamo dal <span className="tt-mark">tuo sito.</span></h2>
          <p className="tt-vis__sotto">
            Lascia i dati e scegli l&apos;orario: nella consulenza gratuita con Vitaliy guardiamo il tuo sito con i dati veri di Google e ti
            diciamo cosa fare per primo, prezzo e tempi. Senza impegno.
          </p>
          <div className="tt-vis__card">
            <Suspense fallback={null}><ConsulenzaForm interesse="Sito trovato su Google (SEO)" pagina="/visita (porta a porta)" /></Suspense>
          </div>
          {wa && <a href={wa} className="tt-btn tt-btn--lg tt-btn--secondary tt-btn--block-mobile">Oppure scrivici su WhatsApp</a>}
        </div>
      </section>

      {/* Barra in basso sul telefono: le due azioni sempre a portata di pollice */}
      <nav className="tt-vis__barra" aria-label="Azioni rapide">
        <a href="#controllo">Controlla il sito</a>
        <a href="#attiva" className="tt-vis__barra-main">Consulenza gratuita</a>
      </nav>
    </div>
  );
}
