import Link from "next/link";
import { FaqList } from "@/components/ds/FaqList";
import { SectionHead } from "@/components/ds/SectionHead";
import { StepList } from "@/components/ds/StepList";
import { JsonLd } from "@/components/JsonLd";
import { MapScene } from "@/components/ds/MapScene";
import { MisureConfronto, ProdottoFoto } from "@/components/ProdottoFoto";
import { MapsCard } from "@/components/ds/MapsCard";
import { ServiceCards } from "@/components/ds/ServiceCards";
import { ReviewReply } from "@/components/ds/ReviewReply";
import { ConsulenzaForm } from "@/components/ConsulenzaForm";
import type { Faq } from "@/lib/content";
import { breadcrumbList, faqPage, organization, serviceMaps, website } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/metadata";
import { EXTRA, linkWhatsApp } from "@/lib/scheda";
import { ESEMPI_RISPOSTE } from "@/lib/esempi-risposte";
import { Slideshow } from "@/components/Slideshow";
import { Suspense } from "react";

export const metadata = pageMetadata({
  title: "Più clienti da Google: scheda Maps e sito per la tua attività · TiTrovano",
  description:
    "Se su Google non ti trovano, i clienti scelgono il vicino. Curiamo la tua scheda Google Maps e il tuo sito ogni settimana. Prenota una consulenza gratuita.",
  path: "/",
});

// I problemi che il titolare vive ogni giorno, detti con le sue parole.
const problemi = [
  { titolo: "Il cliente decide in pochi secondi", settore: "Pizzeria", esempio: "Una coppia in giro la sera cerca «pizzeria aperta adesso». Sul telefono vede due pizzerie vicine: una con foto recenti e risposte gentili, l'altra con l'orario di chiusura sbagliato. Prenotano nella prima, e l'altra non lo saprà mai.", testo: "Cerca dal telefono «pizzeria vicino a me», guarda stelle, ultime recensioni e orari, e sceglie. Se la tua scheda dice poco, sceglie il vicino. E tu non saprai mai di averlo perso." },
  { titolo: "Chi è contento non scrive. Chi è arrabbiato sì.", settore: "Parrucchiere", esempio: "Un salone fa decine di pieghe e tagli a settimana, tutti clienti contenti. Su Google, però, l'ultima recensione è di una cliente che ha aspettato venti minuti. È la prima cosa che legge chi lo cerca.", testo: "Cento clienti escono soddisfatti e non lasciano traccia. Uno esce scontento e scrive tre righe. Su Google resta solo quella." },
  { titolo: "Una critica senza risposta resta lì per mesi", settore: "Idraulico", esempio: "«È arrivato tardi e ha lasciato sporco», scritta mesi fa, senza risposta. Chi ha un tubo che perde e cerca un idraulico in zona la legge e passa al prossimo. Bastavano tre righe calme per cambiare tutto.", testo: "La legge chiunque ti cerca. Senza una risposta sembra che tu non te ne sia accorto, o che non ti importi. Con una risposta calma, la stessa critica dice: qui ci tengono." },
  { titolo: "Il concorrente ti passa davanti", settore: "Centro estetico", esempio: "Due centri estetici nella stessa via. Il tuo lavora meglio, ma ha poche recensioni e l'ultima è dell'anno scorso. L'altro ne riceve ogni settimana. Chi cerca «estetista vicino a me» vede prima l'altro.", testo: "Lavora peggio di te, ma ha più recensioni e più recenti. Secondo Google numero e punteggio delle recensioni contano per chi compare più in alto: così i clienti della zona vanno da lui." },
  { titolo: "E tu non hai tempo", settore: "Bar", esempio: "Il bar apre alle sei e chiude la sera. Rispondere alle recensioni dopo la chiusura, con i conti ancora da fare? Il proposito c'è sempre, ma non succede mai.", testo: "Apri presto, chiudi tardi, pensi a fornitori, conti e clienti. Google è sempre l'ultima cosa della lista. Per questo la scheda resta ferma." },
];

// Ogni servizio detto come problema risolto.
const cosaFacciamo = [
  { titolo: "La tua attività sembra viva", testo: "Ogni settimana pubblichiamo una novità: un piatto, un prodotto, un'offerta, un evento. Chi ti trova vede un'attività aperta e curata, non una scheda dimenticata." },
  { titolo: "Nessuna recensione resta senza risposta", testo: "Rispondiamo a tutte, positive e negative, a nome tuo e con il tono giusto. Grazie a chi è contento, calma e soluzioni a chi si lamenta." },
  { titolo: "I clienti contenti finalmente scrivono", testo: "Spesso vorrebbero, ma non sanno come e lasciano stare. Gli diamo un link, un QR e un messaggio pronto da mandare su WhatsApp: un tocco e hanno fatto." },
  { titolo: "Mai più clienti davanti alla porta chiusa", testo: "Ferie, festività, orari nuovi: ci mandi un messaggio su WhatsApp e su Google è tutto giusto. Nessuno arriva e trova chiuso." },
  { titolo: "Sai sempre cosa succede", testo: "Ogni mese un riepilogo semplice: quante persone ti hanno visto su Google, quante ti hanno chiamato, quante hanno chiesto le indicazioni. Vedi tu, coi numeri, se ti conviene." },
];


// Il sito: stesso metodo della SEO dei progetti in /proposta/seo-locale.
const perIlSito = [
  { titolo: "Google capisce cosa fai e dove", testo: "Sistemiamo titoli, descrizioni, velocità da telefono e link rotti, e diamo a ogni servizio la sua pagina chiara, con il posto in cui lavori." },
  { titolo: "Pagine che rispondono ai tuoi clienti", testo: "Ogni settimana nuove pagine sulle domande che i clienti fanno prima di scegliere. Niente riempitivi, niente promesse." },
  { titolo: "Leggibile anche dalle AI", testo: "ChatGPT, Gemini e Perplexity possono leggere il sito e trovare le risposte che servono per consigliarti." },
  { titolo: "Su qualunque sito", testo: "WordPress, Wix, Shopify o un sito su misura: lavoriamo su quello che hai, senza rifarlo." },
];

const passi = [
  { titolo: "Prenoti la consulenza gratuita", testo: "Compili il modulo qui sotto e scegli l'orario. Prima della call guardiamo la tua scheda Google e il tuo sito." },
  { titolo: "In call con Vitaliy", testo: "Ti mostriamo come ti vedono oggi i clienti su Google, cosa sistemare e quanto costa. Se non ti serviamo, te lo diciamo." },
  { titolo: "Se parti, pensiamo a tutto noi", testo: "Approvi la richiesta di accesso di Google con un tocco, senza darci password. Da lì lavoriamo noi, ogni settimana." },
];

const faq: Faq[] = [
  { domanda: "Devo fare qualcosa?", risposta: "Solo all'inizio: ti arriva una email da Google con la nostra richiesta di accesso alla tua attività e tocchi Approva. Poi facciamo tutto noi. Se vuoi, ci mandi foto o novità su WhatsApp." },
  { domanda: "Vi devo dare la password del mio account Google?", risposta: "No. Google ha un sistema apposta per far gestire un'attività anche a un'altra persona, senza password. Resti tu il proprietario e puoi toglierci l'accesso quando vuoi." },
  { domanda: "Non ho ancora la mia attività su Google Maps. Va bene lo stesso?", risposta: "Sì. Ti aiutiamo a crearla. Google chiede una verifica che fai tu, di solito un breve video o un codice: ti guidiamo noi, passo per passo, su WhatsApp." },
  { domanda: "Quando avrò già tante recensioni, serve ancora?", risposta: "Sì. Chi legge guarda soprattutto le recensioni più recenti: se le ultime sono di un anno fa, l'attività sembra ferma. Per questo il lavoro continua: nuove recensioni, risposte, novità ogni settimana. E ogni mese vedi i numeri, così decidi tu se ti conviene continuare." },
  { domanda: "Mi garantite più clienti?", risposta: "No, e diffida di chi te lo garantisce: nessuno decide al posto di Google chi compare per primo. Ti garantiamo il lavoro fatto ogni settimana e un riepilogo mensile con i numeri veri della tua attività su Google." },
  { domanda: "Come chiedete le recensioni? È tutto in regola?", risposta: "Sì. Le chiediamo solo ai tuoi clienti veri, senza regali o sconti in cambio e senza filtrare solo quelle positive, come chiedono le regole di Google. Niente recensioni finte: rischiano di farti penalizzare." },
  { domanda: "Cosa succede alle recensioni negative?", risposta: "Rispondiamo anche a quelle, con calma e in modo professionale, per mostrare a chi legge che l'attività ascolta. Non possiamo cancellarle: solo Google può rimuovere le recensioni che violano le sue regole. Se ne troviamo una così, te lo segnaliamo." },
  { domanda: "Quanto costa?", risposta: "Dipende da cosa ti serve: solo la scheda Google, anche il sito, o tutti e due. In consulenza ti diciamo un prezzo mensile chiaro, prima di iniziare. La consulenza è gratuita e senza impegno." },
  { domanda: "Lavorate anche sul mio sito?", risposta: "Sì. Lo rendiamo chiaro per Google e per le AI e ogni settimana aggiungiamo pagine sulle domande dei tuoi clienti. Su WordPress, Wix, Shopify o qualunque sito, senza rifarlo." },
  { domanda: "Posso disdire?", risposta: "Sì, quando vuoi, senza penali. Ti basta un messaggio su WhatsApp o una email." },
  { domanda: "Come ricevo la card o il piedistallo?", risposta: "Te lo spediamo con corriere, già pronto all'uso con il link della tua attività, e ti avvisiamo quando parte. Se lo compri da solo, il costo della spedizione lo vedi prima di pagare." },
  { domanda: "Funziona in tutta Italia?", risposta: "Sì. La consulenza è al telefono e il resto si fa online, senza incontri di persona. Per qualsiasi cosa ci trovi su WhatsApp." },
];

export default function Home() {
  const wa = linkWhatsApp();
  const cta = (secondario?: boolean) => (
    <a href="#attiva" className={`tt-btn tt-btn--block-mobile${secondario ? " tt-btn--secondary" : ""}`}>Prenota la consulenza gratuita <span aria-hidden="true">→</span></a>
  );

  return (
    <>
      <JsonLd data={[organization(), website(), serviceMaps(), breadcrumbList([]), faqPage(faq)]} />

      <section className="tt-hero-map">
        <div className="tt-wrap">
          <MapScene>
            <p className="tt-eyebrow" style={{ margin: "0 0 var(--space-3)" }}>Per ogni attività che vuole farsi trovare</p>
            <h1>Più clienti da Google, <span className="tt-mark">senza muovere un dito.</span></h1>
            <p>
              I clienti della tua zona ti cercano su Google e su Maps. Se la tua scheda è ferma e il sito non si trova,
              scelgono il vicino. Noi curiamo scheda e sito ogni settimana: novità, risposte alle recensioni, pagine che
              rispondono ai tuoi clienti. Tu pensi a lavorare.
            </p>
            <div className="tt-map__cta">
              {cta()}
              <a href="#come-funziona" className="tt-btn tt-btn--secondary tt-btn--block-mobile">Come funziona</a>
            </div>
            <p className="tt-map__price"><b>Consulenza gratuita con Vitaliy</b> · ti diciamo cosa sistemare, anche se poi fai da solo</p>
          </MapScene>
        </div>
      </section>

      <section className="tt-section tt-section--sunk">
        <div className="tt-wrap tt-wrap--read">
          <SectionHead n="01" occhiello="Il problema">
            Lavori bene. Ma su Google <span className="tt-mark">non si vede.</span>
          </SectionHead>
          <div className="tt-section-body tt-stack-6">
            <ul className="tt-points">{problemi.map((m) => <li key={m.titolo}><h3>{m.titolo}</h3><p>{m.testo}</p><p className="tt-esempio"><span className="tt-tag">Esempio · {m.settore}</span>{m.esempio}</p></li>)}</ul>
            <p className="tt-body-strong" style={{ margin: 0, fontSize: 20 }}>
              Non ti serve un&apos;agenzia, un contratto lungo o imparare un programma. Ti serve qualcuno che lo faccia al posto tuo,
              ogni settimana.
            </p>
            <p className="tt-small tt-muted">
              Fonte: Google, <a href="https://support.google.com/business/answer/7091?hl=it">Suggerimenti per migliorare il posizionamento locale</a>.
            </p>
          </div>
        </div>
      </section>

      <section className="tt-section">
        <div className="tt-wrap">
          <div className="tt-fatto">
            <div>
              <SectionHead n="02" occhiello="Cosa facciamo">
                Lo facciamo noi, <span className="tt-mark">ogni settimana.</span>
              </SectionHead>
              <div className="tt-section-body tt-stack-6"><StepList passi={cosaFacciamo} /><p className="tt-body" style={{ margin: 0 }}><Link href="/scheda-google">Come funziona la gestione della scheda Google →</Link></p></div>
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

      <section id="sito" className="tt-section" style={{ scrollMarginTop: "var(--space-8)" }}>
        <div className="tt-wrap tt-wrap--read">
          <SectionHead
            n="03"
            occhiello="Il tuo sito"
            testo="La scheda Maps porta chi ti cerca vicino. Il sito porta chi cerca il tuo servizio e vuole capire prima di scegliere."
          >
            E il sito, <span className="tt-mark">finalmente trovato.</span>
          </SectionHead>
          <div className="tt-section-body tt-stack-6">
            <StepList passi={perIlSito} />
            {cta(true)}
          </div>
        </div>
      </section>

      <section id="come-funziona" className="tt-section tt-section--sunk" style={{ scrollMarginTop: "var(--space-8)" }}>
        <div className="tt-wrap tt-wrap--read">
          <SectionHead n="04" occhiello="Come funziona">
            Si parte da <span className="tt-mark">una chiacchierata.</span>
          </SectionHead>
          <div className="tt-section-body tt-stack-8">
            <StepList passi={passi} />
            <aside className="tt-callout">
              <span className="tt-tag">Importante</span>
              <h3>Non ci dai nessuna password</h3>
              <p>Google ti manda una richiesta di accesso via email e tu la approvi. La scheda resta tua: puoi toglierci l&apos;accesso quando vuoi.</p>
            </aside>
          </div>
        </div>
      </section>






      <section id="attiva" className="tt-section tt-section--sunk" style={{ scrollMarginTop: "var(--space-8)" }}>
        <div className="tt-wrap tt-wrap--read">
          <SectionHead
            n="05"
            occhiello="Consulenza gratuita"
            testo={wa ? "Due minuti per il modulo, poi scegli tu l'orario della call. Se preferisci, scrivici su WhatsApp." : "Due minuti per il modulo, poi scegli tu l'orario della call."}
          >
            Parliamone, <span className="tt-mark">gratis.</span>
          </SectionHead>
          <div className="tt-card tt-section-body">
            <Suspense fallback={null}>
              <ConsulenzaForm pagina="/" />
            </Suspense>
          </div>
          <ul className="tt-ticks tt-small" style={{ marginTop: "var(--space-4)" }}>
            <li>Consulenza gratuita e senza impegno</li>
            <li>Ti diciamo un prezzo chiaro prima di iniziare</li>
            <li>Non ci dai nessuna password</li>
          </ul>
        </div>
      </section>
      <section className="tt-section">
        <div className="tt-wrap tt-wrap--read">
          <SectionHead n="06" occhiello="Domande frequenti">Prima che tu <span className="tt-mark">lo chieda.</span></SectionHead>
          <div className="tt-section-body tt-stack-6"><FaqList items={faq} />{cta()}</div>
        </div>
      </section>
      <section id="da-banco" className="tt-section tt-section--sunk" style={{ scrollMarginTop: "var(--space-8)" }}>
        <div className="tt-wrap tt-wrap--read">
          <SectionHead
            n="07"
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
      <section className="tt-section">
        <div className="tt-wrap">
          <SectionHead
            n="08"
            occhiello="Per crescere ancora"
            testo="Quando la tua attività su Google è a posto, il passo successivo è la pubblicità: annunci su Google, Meta e TikTok. Ti diciamo in una call gratuita quale ha senso per te."
          >
            Anche annunci online, <span className="tt-mark">quando servono.</span>
          </SectionHead>
          <div className="tt-section-body">
            <ServiceCards servizi={[
              { href: "/scheda-google", nome: "Google Maps", testo: "Scheda curata, recensioni con risposta, novità ogni settimana.", piu: "Consulenza gratuita", scena: "mappa", logo: "googlemaps" },
              { href: "/analisi-gratuita", nome: "Annunci su Google", testo: "Sei il primo risultato quando cercano quello che fai.", piu: "Consulenza gratuita", scena: "ricerca", logo: "google" },
              { href: "/analisi-gratuita", nome: "Annunci su Meta", testo: "Ti vedono su Facebook e Instagram le persone della tua zona.", piu: "Consulenza gratuita", scena: "feed", logo: "meta" },
              { href: "/analisi-gratuita", nome: "Annunci su TikTok", testo: "Un video breve che arriva a chi abita o passa vicino a te.", piu: "Consulenza gratuita", scena: "video", logo: "tiktok" },
            ]} />
          </div>
        </div>
      </section>
    </>
  );
}
