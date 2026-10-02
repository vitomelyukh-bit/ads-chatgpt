import Link from "next/link";
import { AiAnswerMock } from "@/components/AiAnswerMock";
import { ChatQuestions } from "@/components/ChatQuestions";
import { Container } from "@/components/Container";
import { Faq } from "@/components/Faq";
import { HowItWorks } from "@/components/HowItWorks";
import { JsonLd } from "@/components/JsonLd";
import { LinkList } from "@/components/LinkList";
import { TrialForm } from "@/components/TrialForm";
import { getGuide, getSettori, settoreOptions } from "@/lib/content";
import { faqHome } from "@/lib/faq";
import { breadcrumbList, faqPage, organization, website } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "TiTrovano: l'AI consiglia la tua attività? Scoprilo gratis",
  description:
    "I clienti chiedono a ChatGPT, Gemini e Perplexity a chi rivolgersi. L'AI risponde con due o tre nomi. Scopri gratis se c'è anche il tuo.",
  path: "/",
});

const domandeHome = [
  { testo: "Mi consigli un dentista a Torino che faccia impianti senza farmi aspettare mesi?" },
  { testo: "Un idraulico a Roma che venga anche la domenica per una perdita?" },
  { testo: "Ristorante di pesce a Bari non turistico, dove mangiano i baresi?" },
  { testo: "Best place to rent a car near Catania airport without hidden fees?", lingua: "en" as const },
  { testo: "Una ditta seria per un trasloco da Milano a Bologna, che pensi anche allo smontaggio dei mobili?" },
  { testo: "Centro estetico a Verona per la laser epilazione, con personale preparato?" },
];

export default function Home() {
  const settori = getSettori();
  const guide = getGuide().slice(0, 6);
  return (
    <>
      <JsonLd data={[organization(), website(), breadcrumbList([]), faqPage(faqHome)]} />

      {/* Apertura */}
      <section className="border-b border-line/60 bg-gradient-to-b from-paper-alt to-paper">
        <Container className="grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl">
              Quando un cliente chiede all&apos;AI, esce il tuo nome?
            </h1>
            <p className="mt-6 text-lg text-ink-soft">
              Oggi i clienti chiedono a ChatGPT, Gemini e Perplexity a chi rivolgersi. L&apos;AI risponde con due
              o tre nomi. Non con una pagina di risultati.
            </p>
            <p className="mt-3 text-lg font-medium text-ink">Puoi scoprire gratis se il tuo c&apos;è.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="#prova"
                className="inline-flex justify-center rounded-xl bg-accent px-6 py-4 font-semibold text-white hover:bg-accent-strong"
              >
                Richiedi la prova gratuita
              </Link>
              <Link href="#come-funziona" className="px-2 py-2 text-center font-medium text-ink-soft hover:text-accent">
                Come funziona
              </Link>
            </div>
          </div>
          <AiAnswerMock />
        </Container>
      </section>

      {/* Domande */}
      <section className="py-20">
        <Container narrow>
          <h2 className="text-3xl font-semibold tracking-tight">Le domande che i clienti fanno davvero</h2>
          <p className="mt-4 text-lg text-ink-soft">
            Non scrivono più due parole come su Google. Fanno domande intere, con la città, i dubbi e le
            preferenze. E l&apos;AI risponde con dei nomi.
          </p>
          <div className="mt-10">
            <ChatQuestions domande={domandeHome} />
          </div>
          <p className="mt-8 text-ink-soft">
            Vuoi vedere le domande del tuo settore?{" "}
            <Link href="/settori" className="font-semibold text-accent hover:underline">Guarda i settori</Link>
          </p>
        </Container>
      </section>

      {/* Perché conta */}
      <section className="bg-paper-alt py-20">
        <Container narrow>
          <h2 className="text-3xl font-semibold tracking-tight">Perché conta</h2>
          <div className="mt-6 space-y-4 text-lg text-ink-soft">
            <p>
              Su Google, se non sei primo, puoi essere quarto o quinto e qualcuno ti trova lo stesso.
            </p>
            <p>
              Con l&apos;AI no. Di solito la risposta contiene pochi nomi. Chi c&apos;è riceve la telefonata. Chi
              non c&apos;è, per quel cliente, non esiste.
            </p>
            <p>
              E non lo sai: nessuno ti avvisa quando l&apos;AI consiglia un concorrente al posto tuo.
            </p>
          </div>
        </Container>
      </section>

      {/* Come funziona */}
      <section id="come-funziona" className="scroll-mt-8 py-20">
        <Container>
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight">Come funziona la prova gratuita</h2>
            <p className="mt-4 text-lg text-ink-soft">Tre passi. Tu fai solo il primo.</p>
          </div>
          <div className="mt-10">
            <HowItWorks />
          </div>
          <p className="mt-8 max-w-2xl text-ink-soft">
            Una cosa chiara fin da subito: nessuno può garantire che l&apos;AI consigli la tua attività. La prova
            ti mostra come stanno le cose oggi, con domande vere.
          </p>
        </Container>
      </section>

      {/* Settori e guide */}
      <section className="bg-paper-alt py-20">
        <Container>
          <h2 className="text-3xl font-semibold tracking-tight">Cosa chiedono all&apos;AI i clienti del tuo settore</h2>
          <div className="mt-8">
            <LinkList
              items={settori.map((s) => ({ href: `/settori/${s.slug}`, label: s.nome, sub: s.domande[0].testo }))}
            />
          </div>
          <h2 className="mt-16 text-3xl font-semibold tracking-tight">Per capire come ragiona l&apos;AI</h2>
          <div className="mt-8">
            <LinkList items={guide.map((g) => ({ href: `/guide/${g.slug}`, label: g.h1 }))} />
          </div>
          <p className="mt-6">
            <Link href="/guide" className="font-semibold text-accent hover:underline">Tutte le guide →</Link>
          </p>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <Container narrow>
          <h2 className="text-3xl font-semibold tracking-tight">Domande frequenti</h2>
          <div className="mt-8">
            <Faq items={faqHome} />
          </div>
        </Container>
      </section>

      {/* Form */}
      <section id="prova" className="scroll-mt-8 bg-paper-alt py-20">
        <Container narrow>
          <h2 className="text-3xl font-semibold tracking-tight">Richiedi la prova gratuita</h2>
          <p className="mt-4 text-lg text-ink-soft">
            Lasciaci i dati della tua attività. Facciamo le domande e ti ricontattiamo noi.
          </p>
          <div className="mt-10 rounded-2xl border border-line bg-white p-5 sm:p-8">
            <TrialForm settori={settoreOptions()} headingLevel={3} />
          </div>
        </Container>
      </section>
    </>
  );
}
