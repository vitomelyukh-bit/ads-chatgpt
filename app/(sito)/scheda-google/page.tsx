import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqList } from "@/components/ds/FaqList";
import { MapsCard } from "@/components/ds/MapsCard";
import { SectionHead } from "@/components/ds/SectionHead";
import { StepList } from "@/components/ds/StepList";
import { JsonLd } from "@/components/JsonLd";
import { ProdottoFoto } from "@/components/ProdottoFoto";
import { SchedaForm } from "@/components/SchedaForm";
import type { Faq } from "@/lib/content";
import { faqPage, serviceMaps } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/metadata";
import { EXTRA, euro, linkWhatsApp, scheda } from "@/lib/scheda";
import { pagamentiAttivi } from "@/lib/stripe";

// Pagina per chi cerca "gestione scheda Google": stesso servizio della home, testi propri.
export const metadata = pageMetadata({
  title: "Gestione scheda Google per attività locali, 59 € al mese · TiTrovano",
  description:
    "Gestiamo la scheda Google della tua attività: una novità ogni settimana, risposta a ogni recensione, orari sempre giusti e i numeri del mese. 59 € al mese, senza vincoli.",
  path: "/scheda-google",
});

const cosaComprende = [
  { titolo: "Una novità ogni settimana", testo: "Pubblichiamo un aggiornamento sulla tua scheda Google: un prodotto, un servizio, un'offerta, un evento. La scheda resta viva e chi la apre vede un'attività che lavora." },
  { titolo: "Una risposta a ogni recensione", testo: "Rispondiamo a tutte, a nome tuo. Alle positive subito; quelle sotto le 4 stelle te le facciamo approvare prima, perché lì ogni parola conta." },
  { titolo: "Più recensioni dai clienti veri", testo: "Ti diamo un link, un QR e un messaggio pronto da mandare su WhatsApp. Senza regali in cambio e senza filtrare i clienti, come chiedono le regole di Google." },
  { titolo: "Orari e informazioni sempre giusti", testo: "Ferie, festivi, nuovi orari: ci scrivi un messaggio e la scheda è aggiornata. Nessun cliente trova la porta chiusa." },
  { titolo: "I numeri del mese, in chiaro", testo: "Ogni mese ti mandiamo quante persone ti hanno visto su Google e Maps, quante ti hanno chiamato e quante hanno chiesto le indicazioni." },
];

const passi = [
  { titolo: "Ci mandi i tuoi dati", testo: "Il modulo in fondo alla pagina, o un messaggio su WhatsApp. Due minuti." },
  { titolo: "Approvi l'accesso", testo: "Google ti manda una email con la nostra richiesta di gestire la scheda: tocchi Approva. Non ci dai nessuna password e la scheda resta tua." },
  { titolo: "Da lì facciamo noi", testo: "Ogni settimana, senza che tu debba ricordarti niente. Puoi toglierci l'accesso quando vuoi." },
];

const faq: Faq[] = [
  { domanda: "Cos'è la scheda Google di un'attività?", risposta: "È il riquadro che compare su Google e su Google Maps quando qualcuno cerca la tua attività o un servizio vicino: nome, stelle, recensioni, orari, foto, telefono e indicazioni. Google la chiama Profilo dell'attività." },
  { domanda: "Cosa vuol dire gestire una scheda Google?", risposta: "Tenerla aggiornata e viva: pubblicare novità, rispondere alle recensioni, correggere orari e informazioni, aiutare i clienti contenti a lasciare una recensione. È quello che facciamo noi, ogni settimana, al posto tuo." },
  { domanda: "Quanto costa la gestione della scheda Google?", risposta: "59 € al mese, tutto incluso. Nessun costo di attivazione e nessun vincolo: disdici quando vuoi." },
  { domanda: "Non ho ancora la scheda o non è verificata. Potete aiutarmi?", risposta: "Sì. Ti aiutiamo a crearla e a verificarla: Google chiede una verifica che fai tu, di solito un breve video o un codice, e ti guidiamo passo per passo su WhatsApp." },
  { domanda: "Mi garantite di salire su Google Maps?", risposta: "No: nessuno decide al posto di Google chi compare per primo. Secondo Google contano pertinenza, distanza e notorietà, e le recensioni fanno parte della notorietà. Ti garantiamo il lavoro fatto ogni settimana e i numeri per vedere tu come va." },
  { domanda: "Posso togliervi l'accesso?", risposta: "Sì, in qualsiasi momento, dalle impostazioni della scheda. Sei sempre tu il proprietario." },
];

export default function SchedaGooglePage() {
  const wa = linkWhatsApp();
  return (
    <>
      <JsonLd data={[serviceMaps(), faqPage(faq)]} />

      <div className="tt-wrap tt-page-head">
        <Breadcrumbs items={[{ name: "Gestione scheda Google", path: "/scheda-google" }]} />
        <div className="tt-fatto" style={{ marginTop: "var(--space-6)" }}>
          <div className="tt-stack-6">
            <p className="tt-eyebrow" style={{ margin: 0 }}>Gestione scheda Google Maps</p>
            <h1 className="tt-display-xl">La tua scheda Google, <span className="tt-mark">gestita da noi.</span></h1>
            <p className="tt-lead">
              Novità ogni settimana, una risposta a ogni recensione e orari sempre giusti. Così chi ti trova su Google e su
              Google Maps vede un&apos;attività curata, e sceglie te.
            </p>
            <div className="tt-actions">
              <a href="#attiva" className="tt-btn tt-btn--block-mobile">Attiva la gestione <span aria-hidden="true">→</span></a>
              {wa && <a href={wa} className="tt-btn tt-btn--secondary tt-btn--block-mobile">Scrivici su WhatsApp</a>}
            </div>
            <p className="tt-body-strong" style={{ margin: 0, fontSize: 17 }}>{euro(scheda.prezzoMese)} al mese · nessun costo di attivazione · disdici quando vuoi</p>
          </div>
          <div className="tt-fatto__esempio"><MapsCard /></div>
        </div>
      </div>

      <section className="tt-section tt-section--sunk">
        <div className="tt-wrap tt-wrap--read">
          <SectionHead n="01" occhiello="Cosa comprende">Tutto quello che serve <span className="tt-mark">alla tua scheda.</span></SectionHead>
          <div className="tt-section-body tt-stack-6">
            <StepList passi={cosaComprende} />
            <p className="tt-small tt-muted" style={{ margin: 0 }}>
              Come Google ordina i risultati locali: <a href="https://support.google.com/business/answer/7091?hl=it">Suggerimenti per migliorare il posizionamento locale</a>.
            </p>
          </div>
        </div>
      </section>

      <section className="tt-section">
        <div className="tt-wrap tt-wrap--read">
          <SectionHead n="02" occhiello="Come si attiva">Tre passi, <span className="tt-mark">uno solo è tuo.</span></SectionHead>
          <div className="tt-section-body tt-stack-8">
            <StepList passi={passi} />
            <aside className="tt-callout">
              <span className="tt-tag">Importante</span>
              <h3>Non ci dai nessuna password</h3>
              <p>Google ti manda una richiesta di accesso via email e tu la approvi. La scheda resta tua.</p>
            </aside>
          </div>
        </div>
      </section>

      <section id="prezzo" className="tt-section tt-section--sunk" style={{ scrollMarginTop: "var(--space-8)" }}>
        <div className="tt-wrap tt-wrap--read">
          <SectionHead n="03" occhiello="Prezzo">Gestione completa, <span className="tt-mark">un prezzo solo.</span></SectionHead>
          <div className="tt-price tt-section-body">
            <span className="tt-tag">Tutto incluso</span>
            <p className="tt-price__amount">{euro(scheda.prezzoMese)} <small>al mese</small></p>
            <ul className="tt-ticks">
              <li>Una novità sulla scheda ogni settimana</li>
              <li>Una risposta a ogni recensione</li>
              <li>Link, QR e messaggio pronto per chiedere recensioni</li>
              <li>Orari e informazioni sempre aggiornati</li>
              <li>Ogni mese i numeri della tua scheda</li>
            </ul>
            <a href="#attiva" className="tt-btn tt-btn--block">Attiva la gestione <span aria-hidden="true">→</span></a>
            <p className="tt-price__note">Nessun costo di attivazione. Disdici quando vuoi.</p>
          </div>
        </div>
      </section>

      <section className="tt-section">
        <div className="tt-wrap tt-wrap--read">
          <SectionHead
            n="04"
            occhiello="Card e piedistallo"
            testo="Il cliente avvicina il telefono e si apre la pagina per lasciarti la recensione. Arrivano già configurati con il link della tua scheda."
          >
            Più recensioni, <span className="tt-mark">dal bancone.</span>
          </SectionHead>
          <div className="tt-extra-grid tt-section-body">
            {(Object.keys(EXTRA) as (keyof typeof EXTRA)[]).map((k) => (
              <div key={k} className="tt-product">
                <ProdottoFoto tipo={k} />
                <h3>{EXTRA[k].nome}</h3>
                <p className="tt-muted" style={{ margin: 0 }}>{EXTRA[k].misure}</p>
                <p className="tt-product__price">{euro(EXTRA[k].prezzo)} <small>una volta sola</small></p>
                <Link href={`/compra/${k}`} className="tt-btn tt-btn--secondary tt-btn--block">Compralo da solo →</Link>
              </div>
            ))}
          </div>
          <p className="tt-body" style={{ marginTop: "var(--space-6)" }}>Con la gestione della scheda li aggiungi nel modulo qui sotto, con la spedizione inclusa.</p>
        </div>
      </section>

      <section className="tt-section tt-section--sunk">
        <div className="tt-wrap tt-wrap--read">
          <SectionHead n="05" occhiello="Domande frequenti">Sulla gestione <span className="tt-mark">della scheda Google.</span></SectionHead>
          <div className="tt-section-body"><FaqList items={faq} /></div>
        </div>
      </section>

      <section id="attiva" className="tt-section" style={{ scrollMarginTop: "var(--space-8)" }}>
        <div className="tt-wrap tt-wrap--read">
          <SectionHead occhiello="Attiva la gestione" testo={wa ? "Compila il modulo, oppure scrivici su WhatsApp se preferisci parlarne prima." : "Compila il modulo: ti scriviamo noi su WhatsApp."}>
            La tua scheda Google, <span className="tt-mark">da questa settimana.</span>
          </SectionHead>
          <div className="tt-card tt-section-body"><SchedaForm whatsapp={wa} pagamenti={pagamentiAttivi()} /></div>
          <p className="tt-small tt-muted" style={{ marginTop: "var(--space-4)" }}>
            Vuoi sapere perché conta? <Link href="/">Più clienti da Google Maps →</Link>
          </p>
        </div>
      </section>
    </>
  );
}
