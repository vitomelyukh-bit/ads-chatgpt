import Link from "next/link";
import { FaqList } from "@/components/ds/FaqList";
import { SectionHead } from "@/components/ds/SectionHead";
import { StepList } from "@/components/ds/StepList";
import { JsonLd } from "@/components/JsonLd";
import { MapScene } from "@/components/ds/MapScene";
import { MapsCard } from "@/components/ds/MapsCard";
import { ServiceCards } from "@/components/ds/ServiceCards";
import { ReviewReply } from "@/components/ds/ReviewReply";
import { SchedaForm } from "@/components/SchedaForm";
import type { Faq } from "@/lib/content";
import { breadcrumbList, faqPage, organization, serviceMaps, website } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/metadata";
import { EXTRA, euro, linkWhatsApp, scheda } from "@/lib/scheda";
import { pagamentiAttivi } from "@/lib/stripe";

export const metadata = pageMetadata({
  title: "Più clienti da Google Maps per la tua attività · TiTrovano",
  description:
    "Se la tua scheda Google è ferma, i clienti scelgono il vicino. Ogni settimana pubblichiamo novità, rispondiamo a tutte le recensioni e ti aiutiamo a riceverne di nuove. 59 € al mese, senza vincoli.",
  path: "/",
});

// I problemi che il titolare vive ogni giorno, detti con le sue parole.
const problemi = [
  { titolo: "Il cliente decide in pochi secondi", testo: "Cerca dal telefono «pizzeria vicino a me», guarda stelle, ultime recensioni e orari, e sceglie. Se la tua scheda dice poco, sceglie il vicino. E tu non saprai mai di averlo perso." },
  { titolo: "Chi è contento non scrive. Chi è arrabbiato sì.", testo: "Cento clienti escono soddisfatti e non lasciano traccia. Uno esce scontento e scrive tre righe. Su Google resta solo quella." },
  { titolo: "Una critica senza risposta resta lì per mesi", testo: "La legge chiunque ti cerca. Senza una risposta sembra che tu non te ne sia accorto, o che non ti importi. Con una risposta calma, la stessa critica dice: qui ci tengono." },
  { titolo: "Il concorrente ti passa davanti", testo: "Lavora peggio di te, ma ha più recensioni e più recenti. Secondo Google numero e punteggio delle recensioni contano per chi compare più in alto: così i clienti della zona vanno da lui." },
  { titolo: "E tu non hai tempo", testo: "Apri presto, chiudi tardi, pensi a fornitori, conti e clienti. Google è sempre l'ultima cosa della lista. Per questo la scheda resta ferma." },
];

// Ogni servizio detto come problema risolto.
const cosaFacciamo = [
  { titolo: "La tua attività sembra viva", testo: "Ogni settimana pubblichiamo una novità: un piatto, un prodotto, un'offerta, un evento. Chi ti trova vede un'attività aperta e curata, non una scheda dimenticata." },
  { titolo: "Nessuna recensione resta senza risposta", testo: "Rispondiamo a tutte, positive e negative, a nome tuo e con il tono giusto. Grazie a chi è contento, calma e soluzioni a chi si lamenta." },
  { titolo: "I clienti contenti finalmente scrivono", testo: "Spesso vorrebbero, ma non sanno come e lasciano stare. Gli diamo un link, un QR e un messaggio pronto da mandare su WhatsApp: un tocco e hanno fatto." },
  { titolo: "Mai più clienti davanti alla porta chiusa", testo: "Ferie, festività, orari nuovi: ci mandi un messaggio su WhatsApp e su Google è tutto giusto. Nessuno arriva e trova chiuso." },
  { titolo: "Sai sempre cosa succede", testo: "Ogni mese un riepilogo semplice: quante persone ti hanno visto su Google, quante ti hanno chiamato, quante hanno chiesto le indicazioni. Vedi tu, coi numeri, se ti conviene." },
];

// Recensioni e risposte di fantasia, per far vedere il tono: positiva, con una critica, negativa.
const esempiRisposte = [
  {
    tipo: "Recensione positiva · bar",
    autore: "Giulia M.",
    voto: 5,
    testo: "Cappuccino buonissimo e cornetti appena sfornati. Personale gentilissimo, ormai ci passo ogni mattina.",
    risposta: "Grazie Giulia, che bello leggerti. Ti aspettiamo domattina: il cornetto al pistacchio esce verso le 8.",
  },
  {
    tipo: "Recensione con una critica · parrucchiere",
    autore: "Sara T.",
    voto: 4,
    testo: "Taglio perfetto, esattamente come lo volevo. Unica cosa: ho aspettato un po' nonostante l'appuntamento.",
    risposta: "Grazie Sara, felici che il taglio ti piaccia. Hai ragione sull'attesa: stiamo distanziando meglio gli appuntamenti. A presto.",
  },
  {
    tipo: "Recensione negativa · ristorante",
    autore: "Luca R.",
    voto: 2,
    testo: "Abbiamo aspettato quaranta minuti per due primi. Peccato, il posto è bello.",
    risposta: "Buongiorno Luca, ha ragione e ci scusiamo: sabato eravamo in difficoltà in cucina. Ci farebbe piacere rimediare, ci scriva quando torna.",
  },
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
    <a href="#attiva" className={`tt-btn tt-btn--block-mobile${secondario ? " tt-btn--secondary" : ""}`}>Inizia ora <span aria-hidden="true">→</span></a>
  );

  return (
    <>
      <JsonLd data={[organization(), website(), serviceMaps(), breadcrumbList([]), faqPage(faq)]} />

      <section className="tt-hero-map">
        <div className="tt-wrap">
          <MapScene>
            <p className="tt-eyebrow" style={{ margin: "0 0 var(--space-3)" }}>Per ogni attività che vuole farsi trovare</p>
            <h1>Più clienti da Google Maps, <span className="tt-mark">senza muovere un dito.</span></h1>
            <p>
              I clienti della tua zona ti cercano su Google Maps. Se la tua scheda è ferma, scelgono il vicino. Noi la
              teniamo viva ogni settimana: novità, risposte a tutte le recensioni, recensioni nuove. Tu pensi a lavorare.
            </p>
            <div className="tt-map__cta">
              {cta()}
              {wa ? <a href={wa} className="tt-btn tt-btn--secondary tt-btn--block-mobile">Scrivici su WhatsApp</a> : <a href="#come-funziona" className="tt-btn tt-btn--secondary">Come funziona</a>}
            </div>
            <p className="tt-map__price"><b>{euro(scheda.prezzoMese)} al mese</b> · nessun costo di attivazione · disdici quando vuoi</p>
          </MapScene>
        </div>
      </section>

      <section className="tt-section tt-section--sunk">
        <div className="tt-wrap tt-wrap--read">
          <SectionHead n="01" occhiello="Il problema">
            Lavori bene. Ma su Google <span className="tt-mark">non si vede.</span>
          </SectionHead>
          <div className="tt-section-body tt-stack-6">
            <ul className="tt-points">{problemi.map((m) => <li key={m.titolo}><h3>{m.titolo}</h3><p>{m.testo}</p></li>)}</ul>
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
        <div className="tt-wrap tt-wrap--read">
          <SectionHead n="02" occhiello="Cosa facciamo">
            Lo facciamo noi, <span className="tt-mark">ogni settimana.</span>
          </SectionHead>
          <div className="tt-section-body tt-stack-8">
            <StepList passi={cosaFacciamo} />
            <MapsCard />
            <div className="tt-stack-6">
              <p className="tt-label" style={{ margin: 0 }}>Esempi di risposte</p>
              {esempiRisposte.map((e) => (
                <div key={e.autore} className="tt-stack-2">
                  <p className="tt-small tt-muted" style={{ margin: 0 }}>{e.tipo}</p>
                  <ReviewReply autore={e.autore} voto={e.voto} testo={e.testo} risposta={e.risposta} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="come-funziona" className="tt-section tt-section--sunk" style={{ scrollMarginTop: "var(--space-8)" }}>
        <div className="tt-wrap tt-wrap--read">
          <SectionHead n="03" occhiello="Come funziona">
            Tre passi, <span className="tt-mark">uno solo è tuo.</span>
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

      <section id="prezzo" className="tt-section" style={{ scrollMarginTop: "var(--space-8)" }}>
        <div className="tt-wrap tt-wrap--read">
          <SectionHead
            n="04"
            occhiello="Prezzo"
            testo="Meno di 2 € al giorno. Per molte attività basta un cliente in più al mese per ripagarlo."
          >
            Un prezzo, <span className="tt-mark">tutto incluso.</span>
          </SectionHead>
          <div className="tt-price tt-section-body">
            <span className="tt-tag">Tutto incluso</span>
            <p className="tt-price__amount">{euro(scheda.prezzoMese)} <small>al mese</small></p>
            <ul className="tt-ticks">
              <li>Una novità pubblicata ogni settimana</li>
              <li>Risposta a tutte le recensioni</li>
              <li>Aiuto per chiederne di nuove: link, QR e messaggio pronto</li>
              <li>Orari e informazioni sempre giusti</li>
              <li>Report ogni mese: quante persone ti hanno visto, chiamato o chiesto indicazioni</li>
            </ul>
            <a href="#attiva" className="tt-btn tt-btn--lg tt-btn--block">Inizia ora <span aria-hidden="true">→</span></a>
            <p className="tt-price__note">Nessun costo di attivazione. Disdici quando vuoi.</p>
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
              <div key={k} className="tt-product">
                <span className="tt-tag tt-tag--start">Facoltativo</span>
                <h3>{EXTRA[k].nome}</h3>
                <p className="tt-product__price">{euro(EXTRA[k].prezzo)} <small>una volta sola, spedizione inclusa</small></p>
                <p>{EXTRA[k].descrizione}</p>
              </div>
            ))}
          </div>
          <p className="tt-body" style={{ marginTop: "var(--space-6)" }}>Arrivano già pronti, collegati alla tua attività. Li scegli nel modulo qui sotto, separati dai {euro(scheda.prezzoMese)} al mese.</p>
        </div>
      </section>

      <section className="tt-section">
        <div className="tt-wrap">
          <SectionHead
            n="06"
            occhiello="Per crescere ancora"
            testo="Quando la tua attività su Google è a posto, il passo successivo è la pubblicità: annunci su ChatGPT, Google e Meta. Ti diciamo in una call gratuita quale ha senso per te."
          >
            Anche annunci online, <span className="tt-mark">quando servono.</span>
          </SectionHead>
          <div className="tt-section-body">
            <ServiceCards servizi={[
              { href: "#prezzo", nome: "Google Maps", testo: "Scheda curata, recensioni con risposta, novità ogni settimana.", piu: `${euro(scheda.prezzoMese)} al mese` },
              { href: "/canali#google", nome: "Annunci su Google", testo: "Sei il primo risultato quando cercano quello che fai.", piu: "Consulenza gratuita" },
              { href: "/annunci-chatgpt", nome: "Annunci su ChatGPT", testo: "Compari accanto alla risposta quando chiedono un consiglio.", piu: "Consulenza gratuita" },
              { href: "/canali#meta", nome: "Annunci su Meta", testo: "Ti vedono su Facebook e Instagram le persone della tua zona.", piu: "Consulenza gratuita" },
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
