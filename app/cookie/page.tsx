import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Container } from "@/components/Container";
import { Prose } from "@/components/Prose";
import { pageMetadata } from "@/lib/metadata";
import { policyAggiornata, titolare } from "@/lib/titolare";

export const metadata = pageMetadata({
  title: "Cookie policy · TiTrovano",
  description: "TiTrovano non usa cookie di profilazione né di terze parti. Le statistiche sono anonime e senza cookie.",
  path: "/cookie",
  noindex: true,
});

const data = new Date(`${policyAggiornata}T12:00:00Z`).toLocaleDateString("it-IT", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default function Page() {
  return (
    <Container narrow className="py-10 sm:py-14">
      <Breadcrumbs items={[{ name: "Cookie policy", path: "/cookie" }]} />
      <h1 className="mt-10 font-serif text-5xl tracking-tight sm:text-6xl">Cookie policy</h1>
      <p className="mt-4 text-sm text-ink-mute">
        Aggiornata il <time dateTime={policyAggiornata}>{data}</time>
      </p>
      <div className="mt-10">
        <Prose>
          <p>
            I cookie sono piccoli file che un sito salva nel tuo browser. Alcuni servono a far funzionare il sito, altri
            a seguirti per mostrarti pubblicità.
          </p>

          <h2>In breve</h2>
          <p>
            <strong>
              TiTrovano non usa cookie di profilazione, cookie pubblicitari o cookie di terze parti.
            </strong>{" "}
            Per questo non ti chiediamo il consenso con un banner.
          </p>

          <h2>Statistiche senza cookie</h2>
          <p>
            Per contare le visite usiamo Vercel Web Analytics. Lo strumento non salva cookie nel tuo browser e non ci
            permette di riconoscerti: vediamo solo numeri aggregati, come le visite a ogni pagina e il numero di
            richieste di prova.
          </p>

          <h2>Cookie tecnici</h2>
          <p>
            Il fornitore che ospita il sito, Vercel, può impostare cookie tecnici strettamente necessari, per esempio
            per proteggere il sito durante un attacco informatico. Sono consentiti senza consenso perché servono solo a
            far funzionare e a proteggere il sito.
          </p>

          <h2>Come gestire i cookie</h2>
          <p>
            Puoi vedere e cancellare i cookie dalle impostazioni del tuo browser. Bloccare i cookie tecnici potrebbe
            impedire ad alcune parti del sito di funzionare.
          </p>

          <h2>Contatti</h2>
          <p>
            Titolare: {titolare.nome}, P.IVA {titolare.piva}. Per qualsiasi domanda:{" "}
            <a href={`mailto:${titolare.email}`}>{titolare.email}</a>. Per sapere come trattiamo i dati personali,
            leggi la <a href="/privacy">privacy policy</a>.
          </p>
        </Prose>
      </div>
    </Container>
  );
}
