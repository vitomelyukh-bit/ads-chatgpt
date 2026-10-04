import Link from "next/link";
import { FaqList } from "@/components/ds/FaqList";
import { LinkCards } from "@/components/ds/LinkCards";
import { SectionHead } from "@/components/ds/SectionHead";
import { StepList } from "@/components/ds/StepList";
import { JsonLd } from "@/components/JsonLd";
import { MapsMock } from "@/components/MapsMock";
import { NfcCardMock } from "@/components/NfcCardMock";
import { SchedaForm } from "@/components/SchedaForm";
import type { Faq } from "@/lib/content";
import { breadcrumbList, faqPage, organization, serviceMaps, website } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/metadata";
import { EXTRA, euro, linkWhatsApp, scheda } from "@/lib/scheda";
import { pagamentiAttivi } from "@/lib/stripe";

export const metadata = pageMetadata({
  title: "Più clienti da Google Maps per la tua attività · TiTrovano",
  description:
    "Teniamo aggiornata la tua attività su Google Maps, rispondiamo a tutte le recensioni e ti aiutiamo a riceverne di nuove. 59 € al mese, senza vincoli. Tu devi solo approvare l'accesso.",
  path: "/",
});

const perche = [
  { titolo: "Si cerca dal telefono, nei dintorni", testo: "«Pizzeria vicino a me», «parrucchiere aperto ora», «idraulico a Monza». Google risponde con una mappa e le attività della zona." },
  { titolo: "Le recensioni contano", testo: "Secondo Google, numero e punteggio delle recensioni sono tra i fattori che decidono chi compare più in alto nei risultati locali." },
  { titolo: "Una scheda ferma fa scappare i clienti", testo: "Orari sbagliati, recensioni senza risposta, nessuna novità da mesi: chi guarda pensa che sei chiuso, o che non ti importa, e sceglie il vicino." },
];

const cosaFacciamo = [
  { titolo: "Novità ogni settimana", testo: "Pubblichiamo un aggiornamento sulla tua attività: un piatto, un prodotto, un'offerta, un evento. Chi ti trova vede che sei attivo." },
  { titolo: "Rispondiamo a tutte le recensioni", testo: "Positive e negative, con un tono gentile e professionale, a nome tuo. Chi legge capisce che ci tieni." },
  { titolo: "Ti aiutiamo a riceverne di nuove", testo: "Un link, un QR da stampare e un messaggio pronto da mandare su WhatsApp ai clienti contenti. Lasciare una recensione diventa un attimo." },
  { titolo: "Orari e informazioni sempre giusti", testo: "Festività, ferie, chiusure: ci scrivi su WhatsApp e aggiorniamo noi." },
  { titolo: "Ogni mese, i tuoi numeri", testo: "Un messaggio semplice: quante persone ti hanno visto su Google, quante ti hanno chiamato, quante hanno chiesto le indicazioni. Così vedi tu se funziona." },
];

const passi = [
  { titolo: "Ci lasci i tuoi dati", testo: "Compili il modulo qui sotto o ci scrivi su WhatsApp. Ci vogliono due minuti." },
  { titolo: "Tocchi «Approva»", testo: "Ti arriva una email da Google con la nostra richiesta di accesso alla tua attività. Un tocco e hai finito. Non ci dai nessuna password." },
  { titolo: "Al resto pensiamo noi", testo: "Ogni settimana, senza che tu debba ricordarti niente. Se vuoi, ci mandi foto o novità su WhatsApp e le usiamo." },
];

const faq: Faq[] = [
  { domanda: "Devo fare qualcosa?", risposta: "Solo all'inizio: ti arriva una email da Google con la nostra richiesta di accesso alla tua attività e tocchi Approva. Poi facciamo tutto noi. Se vuoi, ci mandi foto o novità su WhatsApp." },
  { domanda: "Vi devo dare la password del mio account Google?", risposta: "No. Google ha un sistema apposta per far gestire un'attività anche a un'altra persona, senza password. Resti tu il proprietario e puoi toglierci l'accesso quando vuoi." },
  { domanda: "Non ho ancora la mia attività su Google Maps. Va bene lo stesso?", risposta: "Sì. Ti aiutiamo a crearla. Google chiede una verifica che fai tu, di solito un breve video o un codice: ti guidiamo noi, passo per passo, su WhatsApp." },
  { domanda: "Quando avrò già tante recensioni, serve ancora?", risposta: "Sì. Chi legge guarda soprattutto le recensioni più recenti: se le ultime sono di un anno fa, l'attività sembra ferma. Per questo il lavoro continua: nuove recensioni, risposte, novità ogni settimana. E ogni mese vedi i numeri, così decidi tu se ti conviene continuare." },
  { domanda: "Mi garantite più clienti?", risposta: "No, e diffida di chi te lo garantisce: nessuno decide al posto di Google chi compare per primo. Ti garantiamo il lavoro fatto ogni settimana e un riepilogo mensile con i numeri veri della tua attività su Google." },
  { domanda: "Come chiedete le recensioni? È tutto in regola?", risposta: "Sì. Le chiediamo solo ai tuoi clienti veri, senza regali o sconti in cambio e senza filtrare solo quelle positive, come chiedono le regole di Google. Niente recensioni finte: rischiano di farti penalizzare." },
  { domanda: "Cosa succede alle recensioni negative?", risposta: "Rispondiamo anche a quelle, con calma e in modo professionale, per mostrare a chi legge che l'attività ascolta. Non possiamo cancellarle: solo Google può rimuovere le recensioni che violano le sue regole. Se ne troviamo una così, te lo segnaliamo." },
  { domanda: "Posso disdire?", risposta: "Sì, quando vuoi, senza vincoli e senza penali. Lo fai da solo dal link che ti mandiamo per email, oppure con un messaggio su WhatsApp." },
  { domanda: "Come ricevo la card o il piedistallo?", risposta: "Te lo spediamo all'indirizzo che indichi nel modulo, già pronto all'uso con il link della tua attività. La spedizione è inclusa e ti avvisiamo quando parte." },
  { domanda: "Funziona in tutta Italia?", risposta: "Sì. Si attiva tutto online, senza incontri di persona: ci sentiamo su WhatsApp." },
];

export default function Home() {
  const wa = linkWhatsApp();
  const cta = (secondario?: boolean) => (
    <a href="#attiva" className={`tt-btn tt-btn--lg tt-btn--block-mobile${secondario ? " tt-btn--secondary" : ""}`}>Inizia ora <span aria-hidden="true">→</span></a>
  );

  return (
    <>
      <JsonLd data={[organization(), website(), serviceMaps(), breadcrumbList([]), faqPage(faq)]} />

      <section className="tt-section">
        <div className="tt-wrap tt-hero">
          <div className="tt-stack-6">
            <p className="tt-eyebrow" style={{ margin: 0 }}>Per bar, ristoranti, negozi, artigiani e studi</p>
            <h1 className="tt-display-xl">
              Più clienti da Google Maps, <span className="tt-mark">senza muovere un dito.</span>
            </h1>
            <p className="tt-lead">
              Quando qualcuno cerca «vicino a me», Google mostra le attività della zona. Noi teniamo la tua sempre
              aggiornata, rispondiamo a tutte le recensioni e ti aiutiamo a riceverne di nuove. Tu pensi a lavorare.
            </p>
            <div className="tt-actions">
              {cta()}
              {wa ? <a href={wa} className="tt-btn tt-btn--secondary tt-btn--lg tt-btn--block-mobile">Scrivici su WhatsApp</a> : <a href="#come-funziona" className="tt-btn tt-btn--secondary tt-btn--lg">Come funziona</a>}
            </div>
            <p className="tt-small tt-muted">{euro(scheda.prezzoMese)} al mese · nessun costo di attivazione · disdici quando vuoi</p>
          </div>
          <MapsMock />
        </div>
      </section>

      <section className="tt-section tt-section--sunk">
        <div className="tt-wrap tt-wrap--read">
          <SectionHead n="01" occhiello="Perché Google Maps">
            Chi ti cerca su Maps <span className="tt-mark">è a due passi da te.</span>
          </SectionHead>
          <div className="tt-section-body tt-stack-6">
            <ul className="tt-points">{perche.map((m) => <li key={m.titolo}><h3>{m.titolo}</h3><p>{m.testo}</p></li>)}</ul>
            <p className="tt-small tt-muted">
              Fonte: Google, <a href="https://support.google.com/business/answer/7091?hl=it">Suggerimenti per migliorare il posizionamento locale</a>.
            </p>
          </div>
        </div>
      </section>

      <section className="tt-section">
        <div className="tt-wrap tt-wrap--read">
          <SectionHead n="02" occhiello="Cosa facciamo">
            La tua attività su Google, <span className="tt-mark">sempre viva.</span>
          </SectionHead>
          <div className="tt-section-body"><StepList passi={cosaFacciamo} /></div>
        </div>
      </section>

      <section id="come-funziona" className="tt-section tt-section--sunk" style={{ scrollMarginTop: "var(--space-8)" }}>
        <div className="tt-wrap tt-wrap--read">
          <SectionHead n="03" occhiello="Come funziona">
            Tre passi, <span className="tt-mark">uno solo è tuo.</span>
          </SectionHead>
          <div className="tt-section-body"><StepList passi={passi} /></div>
        </div>
      </section>

      <section id="prezzo" className="tt-section" style={{ scrollMarginTop: "var(--space-8)" }}>
        <div className="tt-wrap tt-wrap--read">
          <SectionHead n="04" occhiello="Prezzo">Un prezzo, <span className="tt-mark">tutto incluso.</span></SectionHead>
          <div className="tt-card tt-stack-6 tt-section-body">
            <p className="tt-prezzo">{euro(scheda.prezzoMese)} <small>al mese</small></p>
            <ul className="tt-check-list tt-body">
              <li>Novità ogni settimana sulla tua attività su Google Maps</li>
              <li>Risposta a tutte le recensioni, positive e negative</li>
              <li>Link, QR e messaggio pronto per chiedere recensioni</li>
              <li>Orari e informazioni sempre aggiornati</li>
              <li>Ogni mese i tuoi numeri: visite, chiamate, indicazioni</li>
              <li>Nessun costo di attivazione, disdici quando vuoi</li>
            </ul>
            <div>{cta()}</div>
          </div>
        </div>
      </section>

      <section id="da-banco" className="tt-section tt-section--sunk" style={{ scrollMarginTop: "var(--space-8)" }}>
        <div className="tt-wrap tt-wrap--read">
          <SectionHead
            n="05"
            occhiello="Extra facoltativi"
            testo="Da mettere sul bancone o vicino alla cassa: il cliente avvicina il telefono e si apre subito la pagina per lasciarti una recensione. Niente app, niente ricerche."
          >
            Recensioni con un tocco <span className="tt-mark">del telefono.</span>
          </SectionHead>
          <div className="tt-extra-grid tt-section-body">
            {(Object.keys(EXTRA) as (keyof typeof EXTRA)[]).map((k) => (
              <div key={k} className="tt-card">
                <div className="tt-extra-visual"><NfcCardMock tipo={k} /></div>
                <h3 className="tt-subheading" style={{ margin: 0 }}>{EXTRA[k].nome}</h3>
                <p className="tt-body" style={{ margin: 0 }}>{EXTRA[k].descrizione}</p>
                <p className="tt-prezzo" style={{ fontSize: 44 }}>{euro(EXTRA[k].prezzo)} <small>una volta sola</small></p>
                <ul className="tt-check-list tt-body">
                  <li>Spedizione inclusa</li>
                  <li>Arriva già pronto, collegato alla tua attività</li>
                </ul>
              </div>
            ))}
          </div>
          <p className="tt-small tt-muted" style={{ marginTop: "var(--space-4)" }}>Immagini indicative: il prodotto definitivo può essere diverso. Li scegli nel modulo qui sotto.</p>
        </div>
      </section>

      <section className="tt-section">
        <div className="tt-wrap tt-wrap--read">
          <SectionHead
            n="06"
            occhiello="Vuoi crescere ancora?"
            testo="Quando la tua attività su Google è a posto, il passo successivo è la pubblicità: annunci su ChatGPT, Google e Meta. Ti diciamo in una call gratuita quale ha senso per te."
          >
            Anche annunci online, <span className="tt-mark">quando servono.</span>
          </SectionHead>
          <div className="tt-section-body">
            <LinkCards items={[
              { href: "/annunci-chatgpt", label: "Annunci su ChatGPT", sub: "La nostra specialità: farti trovare quando i clienti chiedono all'AI" },
              { href: "/canali", label: "Quale canale fa per te?", sub: "ChatGPT, Google Ads, Meta Ads o SEO" },
            ]} />
          </div>
        </div>
      </section>

      <section className="tt-section tt-section--sunk">
        <div className="tt-wrap tt-wrap--read">
          <SectionHead n="07" occhiello="Domande frequenti">Prima che tu <span className="tt-mark">lo chieda.</span></SectionHead>
          <div className="tt-section-body"><FaqList items={faq} /></div>
        </div>
      </section>

      <section id="attiva" className="tt-section" style={{ scrollMarginTop: "var(--space-8)" }}>
        <div className="tt-wrap tt-wrap--read">
          <SectionHead
            occhiello="Inizia ora"
            testo={wa ? "Compila il modulo, oppure scrivici su WhatsApp se preferisci parlarne prima." : "Compila il modulo: ti scriviamo noi su WhatsApp."}
          >
            Più clienti da Maps, <span className="tt-mark">da questa settimana.</span>
          </SectionHead>
          {wa && <div className="tt-section-body"><a href={wa} className="tt-btn tt-btn--secondary tt-btn--block-mobile">Scrivici su WhatsApp →</a></div>}
          <div className="tt-card tt-section-body"><SchedaForm whatsapp={wa} pagamenti={pagamentiAttivi()} /></div>
          <p className="tt-small tt-muted" style={{ marginTop: "var(--space-4)" }}>
            Cerchi gli annunci su ChatGPT? <Link href="/annunci-chatgpt">Vai alla pagina dedicata →</Link>
          </p>
        </div>
      </section>
    </>
  );
}
