import { Suspense } from "react";
import { FaqList } from "@/components/ds/FaqList";
import { MapsCard } from "@/components/ds/MapsCard";
import { ComeFunziona } from "@/components/home/ComeFunziona";
import { Confronto } from "@/components/home/Confronto";
import { ReportDemo } from "@/components/home/ReportDemo";
import { Reveal } from "@/components/home/Reveal";
import { SerpDemo } from "@/components/home/SerpDemo";
import { ControlloSito } from "@/components/controllo/ControlloSito";
import type { Faq } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { linkWhatsApp } from "@/lib/scheda";
import { PROVE } from "@/lib/seo-locale";

// Pagina da mostrare di persona al cliente (tablet o telefono). Non indicizzata, non nel menu.
export const metadata = pageMetadata({
  title: "Come funziona TiTrovano, spiegato semplice · TiTrovano",
  description: "Il tuo sito trovato su Google, spiegato in 8 passi semplici.",
  path: "/presentazione",
  noindex: true,
});

const CAPITOLI = [
  ["problema", "Il problema"],
  ["cosa", "Cosa facciamo"],
  ["esempio", "Un esempio vero"],
  ["mese", "Cosa ricevi"],
  ["tu", "Cosa fai tu"],
  ["perche", "Perché noi"],
  ["controllo", "Il tuo sito"],
  ["domande", "Domande"],
] as const;

const faq: Faq[] = [
  { domanda: "Devo rifare il sito?", risposta: "No. Lavoriamo sul sito che hai già: WordPress, Wix, Shopify o qualunque altro. Il sito resta tuo e resta com'è; noi lo sistemiamo e gli aggiungiamo pagine." },
  { domanda: "Cos'è la SEO, in parole semplici?", risposta: "È tutto il lavoro che serve perché Google capisca cosa fai e dove lavori, e quindi ti mostri a chi cerca proprio quello. Come una vetrina: se è sporca e vuota la gente passa oltre, se è pulita e piena di cose giuste entra." },
  { domanda: "Quanto ci vuole per vedere i risultati?", risposta: "La scheda Google Maps cambia aspetto da subito. Il sito su Google è un lavoro di mesi: nel primo mese lo sistemiamo e mettiamo online le prime pagine, poi Google inizia a mostrarle. Ogni mese vedi i numeri e capisci tu se sta funzionando." },
  { domanda: "Mi garantite il primo posto su Google?", risposta: "No, e chi lo garantisce ti sta prendendo in giro: decide Google, non noi. Ti garantiamo il lavoro fatto ogni settimana e i numeri veri, presi direttamente da Google." },
  { domanda: "Quanto costa?", risposta: "Un abbonamento mensile, con un prezzo chiaro che ti diciamo prima di iniziare, in base al tuo sito e a quante pagine servono. Nessun costo nascosto." },
  { domanda: "Ci sono contratti lunghi o penali?", risposta: "No. Se a un certo punto non ti conviene più, smetti. Il sito e le pagine che abbiamo fatto restano tuoi." },
  { domanda: "Devo darvi le mie password?", risposta: "No. Per Google approvi una richiesta di accesso con un tocco, e la scheda resta tua. Per il sito ci crei un utente separato che puoi togliere quando vuoi." },
  { domanda: "Cosa devo fare io, in pratica?", risposta: "Quasi niente: approvare l'accesso all'inizio e, se ti va, mandarci ogni tanto una foto o una novità su WhatsApp. Al resto pensiamo noi." },
  { domanda: "E se non ho tempo di leggere i report?", risposta: "Il report è di una pagina, con tre numeri grandi. E se vuoi te lo spieghiamo in due minuti al telefono." },
  { domanda: "Funziona anche con ChatGPT e gli assistenti AI?", risposta: "Sì: le stesse pagine chiare che servono a Google servono anche a ChatGPT, Gemini e Perplexity per leggere il tuo sito. Nessuno però può garantire che un'AI ti consigli." },
  { domanda: "Che differenza c'è con la pubblicità su Google?", risposta: "La pubblicità ti fa comparire finché paghi; quando smetti, sparisci. Le pagine del sito restano e continuano a lavorare anche dopo. Le due cose possono convivere, ma si parte dal sito." },
  { domanda: "Chi siete?", risposta: "TiTrovano è un servizio di Vitaliy Omelyukh, Roma. Parli sempre con la stessa persona: niente call center, niente passaggi di mano." },
];

function Capitolo({ n, id, titolo, sotto, children }: { n: number; id: string; titolo: React.ReactNode; sotto: string; children: React.ReactNode }) {
  return (
    <section id={id} className={`tt-pres__cap${n % 2 === 0 ? " tt-section--sunk" : ""}`}>
      <div className="tt-wrap tt-pres__wrap">
        <p className="tt-pres__n"><span>{n}</span> di {CAPITOLI.length}</p>
        <h2 className="tt-pres__h">{titolo}</h2>
        <p className="tt-pres__sotto">{sotto}</p>
        <div className="tt-pres__body" data-reveal>{children}</div>
      </div>
    </section>
  );
}

export default function Presentazione() {
  const wa = linkWhatsApp();
  return (
    <div className="tt-pres">
      <Reveal />
      <nav className="tt-pres__nav" aria-label="Capitoli">
        {CAPITOLI.map(([id, t], i) => <a key={id} href={`#${id}`}><b>{i + 1}</b> {t}</a>)}
      </nav>

      <header className="tt-wrap tt-pres__wrap tt-pres__intro">
        <p className="tt-eyebrow" style={{ margin: 0 }}>TiTrovano, spiegato semplice</p>
        <h1 className="tt-display-xl">Il tuo sito, <span className="tt-mark">finalmente trovato su Google.</span></h1>
        <p className="tt-pres__sotto">In 8 passi, senza parole difficili: cosa succede oggi, cosa facciamo noi e cosa fai tu.</p>
        <a href="#problema" className="tt-btn tt-btn--lg">Cominciamo <span aria-hidden="true">↓</span></a>
      </header>

      <Capitolo n={1} id="problema" titolo={<>Oggi i clienti <span className="tt-mark">non ti trovano.</span></>} sotto="Quando qualcuno cerca quello che fai nella tua zona, guarda i primi risultati di Google e chiama uno di quelli. Se tu non ci sei, per lui non esisti.">
        <div className="tt-pres__split">
          <SerpDemo />
          <ul className="tt-pres__punti">
            <li><b>Tocca «Prima» e «Dopo»</b> sul telefono qui accanto: è la stessa ricerca, prima e dopo il nostro lavoro.</li>
            <li><b>Prima:</b> compaiono i portali e i concorrenti. Il tuo sito c'è, ma Google non lo mostra.</li>
            <li><b>Dopo:</b> il tuo sito compare in alto, con le pagine dei tuoi servizi.</li>
          </ul>
        </div>
      </Capitolo>

      <Capitolo n={2} id="cosa" titolo={<>Cosa facciamo, <span className="tt-mark">in tre cose.</span></>} sotto="Pensa al tuo sito come a una vetrina: noi la puliamo, la riempiamo delle cose giuste e la teniamo sempre in ordine.">
        <ol className="tt-pres__tre">
          <li><span>1</span><h3>Sistemiamo il sito</h3><p>Togliamo quello che impedisce a Google di capirlo: titoli sbagliati, pagine lente, impostazioni dimenticate.</p></li>
          <li><span>2</span><h3>Aggiungiamo pagine, ogni settimana</h3><p>Una pagina per ogni tuo servizio e per ogni domanda che fanno i tuoi clienti. Più pagine giuste, più ricerche in cui comparire.</p></li>
          <li><span>3</span><h3>Curiamo la scheda Google Maps</h3><p>Novità, risposte alle recensioni, orari giusti. È la prima cosa che vede chi ti cerca vicino.</p></li>
        </ol>
        <div className="tt-pres__maps"><MapsCard /></div>
      </Capitolo>

      <Capitolo n={3} id="esempio" titolo={<>Un esempio <span className="tt-mark">vero.</span></>} sotto="A sinistra com'è fatto il sito tipico di un'attività. A destra alcune pagine vere di Olizen, centro massaggi a Roma: ognuna risponde a una ricerca precisa dei clienti.">
        <div className="tt-pd">
          <div className="tt-pd__col tt-pd__col--prima">
            <span className="tt-pd__label">Sito tipico</span>
            <ul><li>Home</li><li>Servizi</li><li>Contatti</li></ul>
          </div>
          <div className="tt-pd__col tt-pd__col--dopo">
            <span className="tt-pd__label">Olizen</span>
            <ul>
              <li>Massaggio linfodrenante a Roma</li>
              <li>Massaggi a Talenti</li>
              <li>Massaggio in gravidanza: da che mese?</li>
              <li>Ogni quanto fare un massaggio?</li>
              <li>…e altre ogni settimana</li>
            </ul>
          </div>
        </div>
        <p className="tt-pres__nota">Altri siti dove lo stesso metodo è già al lavoro:</p>
        <ul className="tt-pres__prove">
          {PROVE.filter((p) => !p.link.url.startsWith("/")).map((p) => (
            <li key={p.nome}><a href={p.link.url} target="_blank" rel="noopener"><b>{p.nome}</b><span>{p.settore} · {p.numeri[0]}</span></a></li>
          ))}
        </ul>
      </Capitolo>

      <Capitolo n={4} id="mese" titolo={<>Ogni mese vedi <span className="tt-mark">se funziona.</span></>} sotto="Ti mandiamo un report di una pagina con i numeri veri di Google: quante persone ti hanno visto, quante hanno cliccato e per quali ricerche compari.">
        <ReportDemo />
      </Capitolo>

      <Capitolo n={5} id="tu" titolo={<>Cosa devi fare tu? <span className="tt-mark">Quasi niente.</span></>} sotto="Si parte da una chiacchierata gratuita. Se decidi di partire, il lavoro lo facciamo noi.">
        <ComeFunziona />
        <ul className="tt-pres__check">
          <li>Nessuna password da darci</li>
          <li>Nessun contratto lungo, smetti quando vuoi</li>
          <li>Il sito e le pagine restano tuoi</li>
          <li>Parli sempre con la stessa persona</li>
        </ul>
      </Capitolo>

      <Capitolo n={6} id="perche" titolo={<>Con noi, <span className="tt-mark">o con gli altri.</span></>} sotto="Le differenze, una riga alla volta.">
        <Confronto />
      </Capitolo>

      <Capitolo n={7} id="controllo" titolo={<>Guardiamo il tuo sito, <span className="tt-mark">adesso.</span></>} sotto="Scrivi l'indirizzo del tuo sito: in 10 secondi vediamo insieme cosa vede Google.">
        <Suspense fallback={null}><ControlloSito /></Suspense>
      </Capitolo>

      <Capitolo n={8} id="domande" titolo={<>Le domande <span className="tt-mark">di tutti.</span></>} sotto="Tocca una domanda per leggere la risposta.">
        <FaqList items={faq} />
      </Capitolo>

      <section className="tt-pres__fine">
        <div className="tt-wrap tt-pres__wrap tt-stack-6">
          <h2 className="tt-display-lg" style={{ margin: 0 }}>E adesso?</h2>
          <p className="tt-pres__sotto" style={{ color: "inherit" }}>Fissiamo la consulenza gratuita: guardiamo il tuo sito con i dati veri di Google e ti diciamo prezzo e tempi. Senza impegno.</p>
          <div className="tt-actions">
            <a href="/#attiva" className="tt-btn tt-btn--lg">Prenota la consulenza gratuita <span aria-hidden="true">→</span></a>
            {wa && <a href={wa} className="tt-btn tt-btn--lg tt-btn--secondary">Scrivici su WhatsApp</a>}
          </div>
        </div>
      </section>
    </div>
  );
}
