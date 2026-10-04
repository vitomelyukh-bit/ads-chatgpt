import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqList } from "@/components/ds/FaqList";
import { SectionHead } from "@/components/ds/SectionHead";
import { StepList } from "@/components/ds/StepList";
import { JsonLd } from "@/components/JsonLd";
import { NfcCardMock } from "@/components/NfcCardMock";
import { SchedaForm } from "@/components/SchedaForm";
import type { Faq } from "@/lib/content";
import { faqPage, serviceScheda } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/metadata";
import { linkWhatsApp, scheda } from "@/lib/scheda";

export const metadata = pageMetadata({
  title: "Scheda Google sempre viva: post e recensioni, 59 €/mese · TiTrovano",
  description:
    "Post ogni settimana sulla tua scheda Google Maps, risposta a tutte le recensioni e QR per chiederne di nuove. 59 €/mese, nessun costo di attivazione, disdici quando vuoi.",
  path: scheda.path,
});

const benefici = [
  { titolo: "La tua scheda sembra sempre aperta", testo: "Ogni settimana pubblichiamo un post: novità, prodotti, orari, eventi. Chi ti trova su Google Maps vede un'attività curata e attiva." },
  { titolo: "Ogni recensione ha una risposta", testo: "Rispondiamo a tutte le recensioni, positive e negative, con un tono gentile e professionale. Chi legge capisce che ci tieni." },
  { titolo: "Più recensioni, senza imbarazzo", testo: "Ti diamo un link e un QR da stampare o da mandare su WhatsApp ai clienti contenti: lasciare una recensione diventa un attimo." },
];

const passi = [
  { titolo: "Ci dai l'accesso una volta", testo: "Ci aggiungi come gestori della tua scheda Google. Ti guidiamo noi su WhatsApp: bastano un paio di minuti." },
  { titolo: "Noi aggiorniamo ogni settimana", testo: "Pubblichiamo i post e rispondiamo alle recensioni. Se vuoi, ci mandi foto o novità su WhatsApp e le usiamo." },
  { titolo: "Tu vedi i risultati su Maps", testo: "Apri Google Maps e trovi la tua scheda sempre aggiornata, con le risposte a tutte le recensioni." },
];

const faq: Faq[] = [
  { domanda: "Devo fare qualcosa?", risposta: "Solo all'inizio: ci aggiungi come gestori della tua scheda Google, e ti guidiamo noi passo per passo. Poi facciamo tutto noi. Se vuoi, ci mandi foto o novità su WhatsApp." },
  { domanda: "Posso disdire?", risposta: "Sì, quando vuoi, senza vincoli e senza penali: basta un messaggio su WhatsApp o una email." },
  { domanda: "Cosa succede alle recensioni negative?", risposta: "Rispondiamo anche a quelle, con calma e in modo professionale, per mostrare a chi legge che l'attività ascolta. Non possiamo cancellarle: solo Google può rimuovere le recensioni che violano le sue regole. Se ne troviamo una così, te lo segnaliamo." },
  { domanda: "Come ricevo la card?", risposta: "Te la spediamo all'indirizzo che indichi nel modulo, già configurata con il link della tua scheda. La spedizione è inclusa e ti avvisiamo su WhatsApp quando parte." },
  { domanda: "Funziona in tutta Italia?", risposta: "Sì. Si attiva tutto online, senza incontri di persona: ci sentiamo su WhatsApp." },
];

export default function SchedaGooglePage() {
  const wa = linkWhatsApp();
  const ctaPrincipale = wa ? (
    <a href={wa} className="tt-btn tt-btn--lg tt-btn--block-mobile">Scrivici su WhatsApp <span aria-hidden="true">→</span></a>
  ) : (
    <a href="#richiesta" className="tt-btn tt-btn--lg tt-btn--block-mobile">Richiedi il servizio <span aria-hidden="true">→</span></a>
  );

  return (
    <>
      <JsonLd data={[serviceScheda(), faqPage(faq)]} />

      <div className="tt-wrap tt-wrap--read tt-page-head">
        <Breadcrumbs items={[{ name: scheda.nome, path: scheda.path }]} />
        <div className="tt-stack-6">
          <p className="tt-eyebrow" style={{ margin: 0 }}>{scheda.nome}</p>
          <h1 className="tt-display-xl">
            Più clienti da Google Maps, <span className="tt-mark">senza muovere un dito</span>
          </h1>
          <p className="tt-lead">
            Ogni settimana aggiorniamo la tua scheda Google, rispondiamo a tutte le recensioni e ti diamo un modo semplice
            per chiederne di nuove. Per ristoranti, bar, negozi, artigiani e studi in tutta Italia.
          </p>
          <div className="tt-actions">{ctaPrincipale}</div>
          {wa && <p className="tt-body"><a href="#richiesta">Preferisci un modulo? Compilalo qui →</a></p>}
        </div>
      </div>

      <section className="tt-section tt-section--sunk">
        <div className="tt-wrap tt-wrap--read">
          <SectionHead n="01" occhiello="Cosa ottieni">Una scheda Google <span className="tt-mark">sempre viva</span></SectionHead>
          <div className="tt-section-body">
            <ul className="tt-points">{benefici.map((b) => <li key={b.titolo}><h3>{b.titolo}</h3><p>{b.testo}</p></li>)}</ul>
          </div>
        </div>
      </section>

      <section className="tt-section">
        <div className="tt-wrap tt-wrap--read">
          <SectionHead n="02" occhiello="Come funziona">Tre passi, <span className="tt-mark">uno solo è tuo</span></SectionHead>
          <div className="tt-section-body"><StepList passi={passi} /></div>
        </div>
      </section>

      <section id="prezzo" className="tt-section tt-section--sunk">
        <div className="tt-wrap tt-wrap--read">
          <SectionHead n="03" occhiello="Prezzo">Un prezzo, <span className="tt-mark">tutto incluso</span></SectionHead>
          <div className="tt-card tt-stack-6 tt-section-body">
            <p className="tt-prezzo">{scheda.prezzoMese} € <small>/ mese</small></p>
            <ul className="tt-check-list tt-body">
              <li>Post settimanali sulla tua scheda Google Maps</li>
              <li>Risposta a tutte le recensioni, positive e negative</li>
              <li>Link e QR per chiedere recensioni, da stampare o mandare su WhatsApp</li>
              <li>Nessun costo di attivazione</li>
              <li>Disdici quando vuoi</li>
            </ul>
            <div>{ctaPrincipale}</div>
          </div>
        </div>
      </section>

      <section id="card-nfc" className="tt-section">
        <div className="tt-wrap">
          <div className="tt-read" style={{ marginInline: 0 }}>
            <SectionHead n="04" occhiello="Extra facoltativo">La card NFC <span className="tt-mark">da banco</span></SectionHead>
          </div>
          <div className="tt-nfc-box tt-section-body">
            <NfcCardMock />
            <div className="tt-card tt-stack-4">
              <p className="tt-body">Una card da appoggiare sul bancone: il cliente avvicina il telefono e si apre subito la pagina per lasciare la recensione.</p>
              <p className="tt-prezzo" style={{ fontSize: 44 }}>{scheda.prezzoCard} € <small>una tantum</small></p>
              <ul className="tt-check-list tt-body">
                <li>Spedizione inclusa</li>
                <li>Arriva già configurata con la tua scheda</li>
              </ul>
              <p className="tt-small tt-muted">La scegli nel modulo: ti chiediamo il link della tua scheda Google Maps e l&apos;indirizzo di spedizione.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="tt-section tt-section--sunk">
        <div className="tt-wrap tt-wrap--read">
          <SectionHead n="05" occhiello="Domande frequenti">Prima che tu <span className="tt-mark">lo chieda</span></SectionHead>
          <div className="tt-section-body"><FaqList items={faq} /></div>
        </div>
      </section>

      <section id="richiesta" className="tt-section" style={{ scrollMarginTop: "var(--space-8)" }}>
        <div className="tt-wrap tt-wrap--read">
          <SectionHead occhiello="Richiedi il servizio" testo={wa ? "Più veloce su WhatsApp, oppure compila il modulo: ti scriviamo noi per attivare tutto." : "Compila il modulo: ti scriviamo noi su WhatsApp per attivare tutto."}>
            Attiva la tua <span className="tt-mark">scheda sempre viva</span>
          </SectionHead>
          {wa && <div className="tt-section-body"><a href={wa} className="tt-btn tt-btn--secondary tt-btn--block-mobile">Scrivici su WhatsApp →</a></div>}
          <div className="tt-card tt-section-body"><SchedaForm whatsapp={wa} /></div>
        </div>
      </section>
    </>
  );
}
