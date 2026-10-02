import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Container } from "@/components/Container";
import { Faq } from "@/components/Faq";
import { HowItWorks } from "@/components/HowItWorks";
import { JsonLd } from "@/components/JsonLd";
import { TrialForm } from "@/components/TrialForm";
import { settoreOptions } from "@/lib/content";
import { faqProva } from "@/lib/faq";
import { faqPage } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Prova gratuita: scopri se l'AI ti trova · TiTrovano",
  description:
    "Facciamo 20 domande vere a ChatGPT, Gemini e Perplexity e ti diciamo quante volte esce il tuo nome, quante quello dei concorrenti e perché. Gratis.",
  path: "/prova-gratuita",
});

export default function ProvaPage() {
  return (
    <>
      <JsonLd data={faqPage(faqProva)} />
      <Container narrow className="py-10 sm:py-14">
        <Breadcrumbs items={[{ name: "Prova gratuita", path: "/prova-gratuita" }]} />
        <h1 className="mt-8 text-4xl font-semibold tracking-tight sm:text-5xl">Richiedi la prova gratuita</h1>
        <p className="mt-6 text-lg text-ink-soft">
          Facciamo 20 domande vere a ChatGPT, Gemini e Perplexity, come le farebbero i tuoi clienti. Poi ti
          diciamo quante volte esce il tuo nome, quante volte quello dei concorrenti, e perché.
        </p>
        <div className="mt-10 rounded-2xl border border-line bg-white p-5 shadow-[0_20px_50px_-30px_rgba(15,40,35,0.3)] sm:p-8">
          <TrialForm settori={settoreOptions()} />
        </div>
      </Container>

      <section className="py-16">
        <Container>
          <h2 className="text-3xl font-semibold tracking-tight">Cosa succede dopo</h2>
          <div className="mt-10">
            <HowItWorks />
          </div>
        </Container>
      </section>

      <section className="pb-8">
        <Container narrow>
          <h2 className="text-3xl font-semibold tracking-tight">Domande frequenti</h2>
          <div className="mt-8">
            <Faq items={faqProva} />
          </div>
        </Container>
      </section>
    </>
  );
}
