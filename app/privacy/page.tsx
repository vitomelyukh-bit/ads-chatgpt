import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Container } from "@/components/Container";
import { Prose } from "@/components/Prose";
import { pageMetadata } from "@/lib/metadata";
import { policyAggiornata, titolare } from "@/lib/titolare";

export const metadata = pageMetadata({
  title: "Privacy policy · TiTrovano",
  description: "Come TiTrovano tratta i dati di chi richiede la prova gratuita e di chi visita il sito.",
  path: "/privacy",
  noindex: true,
});

const data = new Date(`${policyAggiornata}T12:00:00Z`).toLocaleDateString("it-IT", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default function Page() {
  const mail = <a href={`mailto:${titolare.email}`}>{titolare.email}</a>;
  return (
    <Container narrow className="py-10 sm:py-14">
      <Breadcrumbs items={[{ name: "Privacy policy", path: "/privacy" }]} />
      <h1 className="mt-10 font-serif text-5xl tracking-tight sm:text-6xl">Privacy policy</h1>
      <p className="mt-4 text-sm text-ink-mute">
        Aggiornata il <time dateTime={policyAggiornata}>{data}</time>
      </p>
      <div className="mt-10">
        <Prose>
          <p>
            Questa pagina spiega quali dati raccogliamo su titrovano.it, perché, per quanto tempo e quali diritti hai,
            come previsto dall&apos;articolo 13 del Regolamento (UE) 2016/679 (GDPR).
          </p>

          <h2>Chi è il titolare del trattamento</h2>
          <p>
            {titolare.nome}, ditta individuale, P.IVA {titolare.piva}, con sede a {titolare.citta}.
            <br />
            Per qualsiasi domanda sui tuoi dati: {mail}.
          </p>

          <h2>Quali dati raccogliamo</h2>
          <h3>Quando richiedi la prova gratuita</h3>
          <p>
            Nel modulo ci lasci: nome e cognome, nome dell&apos;attività, settore, città, email e telefono. Tutti i
            campi sono necessari per fare la prova e ricontattarti: senza, non possiamo dare seguito alla richiesta.
          </p>
          <h3>Quando visiti il sito</h3>
          <ul>
            <li>
              <strong>Dati tecnici di navigazione.</strong> Il server che ospita il sito registra in automatico alcuni
              dati, come l&apos;indirizzo IP, il tipo di browser e le pagine richieste. Servono a far funzionare il
              sito e a proteggerlo da abusi.
            </li>
            <li>
              <strong>Statistiche anonime.</strong> Usiamo Vercel Web Analytics per sapere quante visite riceve ogni
              pagina e quante richieste di prova arrivano, suddivise per settore. Lo strumento non usa cookie e non
              ci permette di sapere chi sei.
            </li>
          </ul>

          <h2>Perché li usiamo e su quale base</h2>
          <ul>
            <li>
              <strong>Fare la prova gratuita e ricontattarti</strong>, perché ce l&apos;hai chiesto tu. Base giuridica:
              esecuzione di misure precontrattuali adottate su tua richiesta (art. 6.1.b GDPR).
            </li>
            <li>
              <strong>Mandarti una email di conferma</strong> della richiesta. Stessa base giuridica.
            </li>
            <li>
              <strong>Proteggere il modulo da spam e abusi</strong>, per esempio limitando gli invii ripetuti dallo
              stesso indirizzo IP. Base giuridica: nostro legittimo interesse alla sicurezza del sito (art. 6.1.f GDPR).
            </li>
            <li>
              <strong>Capire come viene usato il sito</strong>, con statistiche anonime. Base giuridica: legittimo
              interesse (art. 6.1.f GDPR).
            </li>
          </ul>
          <p>
            Non usiamo i tuoi dati per pubblicità, non li vendiamo e non li cediamo a terzi per i loro scopi. Non
            prendiamo decisioni automatizzate che ti riguardano.
          </p>
          <p>
            Per la prova facciamo domande agli assistenti AI (ChatGPT, Gemini e Perplexity) come le farebbe un cliente
            qualunque. In quelle domande non inseriamo i tuoi dati personali, come email o telefono.
          </p>

          <h2>A chi arrivano i dati</h2>
          <p>Per far funzionare il sito ci appoggiamo a questi fornitori, che trattano i dati per nostro conto:</p>
          <ul>
            <li>
              <strong>Vercel Inc.</strong> (Stati Uniti): ospita il sito, riceve le richieste del modulo e fornisce le
              statistiche anonime.
            </li>
            <li>
              <strong>Resend</strong> (Stati Uniti): invia le email di richiesta e di conferma.
            </li>
            <li>
              <strong>Google</strong>: la casella email in cui riceviamo le richieste e rispondiamo.
            </li>
          </ul>
          <p>
            Alcuni di questi fornitori hanno sede o server fuori dall&apos;Unione europea. In questi casi il
            trasferimento avviene con le garanzie previste dal GDPR, cioè il Data Privacy Framework UE-USA per i
            fornitori che vi aderiscono, oppure le clausole contrattuali standard approvate dalla Commissione europea.
          </p>

          <h2>Per quanto tempo li teniamo</h2>
          <ul>
            <li>
              <strong>Dati della richiesta di prova:</strong> 24 mesi dall&apos;ultimo contatto con te, poi li
              cancelliamo. Se ce lo chiedi, li cancelliamo prima.
            </li>
            <li>
              <strong>Dati tecnici di navigazione:</strong> per il tempo breve stabilito dal fornitore di hosting per
              sicurezza e funzionamento.
            </li>
          </ul>

          <h2>I tuoi diritti</h2>
          <p>In qualsiasi momento puoi chiederci di:</p>
          <ul>
            <li>sapere quali dati abbiamo su di te e averne una copia;</li>
            <li>correggerli o aggiornarli;</li>
            <li>cancellarli;</li>
            <li>limitarne l&apos;uso o opporti al trattamento;</li>
            <li>riceverli in un formato leggibile per passarli a qualcun altro.</li>
          </ul>
          <p>
            Basta scrivere a {mail}. Ti rispondiamo entro un mese. Se pensi che i tuoi dati siano trattati in modo non
            corretto, puoi anche presentare reclamo al{" "}
            <a href="https://www.garanteprivacy.it">Garante per la protezione dei dati personali</a>.
          </p>

          <h2>Cookie</h2>
          <p>
            Il sito non usa cookie di profilazione né cookie di terze parti. I dettagli sono nella{" "}
            <a href="/cookie">cookie policy</a>.
          </p>

          <h2>Modifiche</h2>
          <p>
            Se cambiamo il modo in cui trattiamo i dati, aggiorniamo questa pagina e la data in alto.
          </p>
        </Prose>
      </div>
    </Container>
  );
}
