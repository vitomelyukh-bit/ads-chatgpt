import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Container } from "@/components/Container";
import { Faq } from "@/components/Faq";
import { HowItWorks } from "@/components/HowItWorks";
import { JsonLd } from "@/components/JsonLd";
import { SectionLabel } from "@/components/SectionLabel";
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
        <div className="mt-10">
          <SectionLabel>20 domande · 3 assistenti AI · gratis</SectionLabel>
        </div>
        <h1 className="mt-5 font-serif text-5xl leading-[1] tracking-tight sm:text-7xl">
          Richiedi la <span className="hl">prova gratuita</span>
        </h1>
        <p className="mt-7 text-lg leading-relaxed text-ink-soft">
          Facciamo 20 domande vere a ChatGPT, Gemini e Perplexity, come le farebbero i tuoi clienti. Poi ti
          diciamo quante volte esce il tuo nome, quante volte quello dei concorrenti, e perché.
        </p>
        <div className="mt-12 rounded-[2rem] border-2 border-ink bg-card p-6 shadow-[8px_8px_0_var(--color-ink)] sm:p-10">
          <TrialForm settori={settoreOptions()} />
        </div>
      </Container>

      <section className="py-16">
        <Container>
          <SectionLabel n="01">Dopo l&apos;invio</SectionLabel>
          <h2 className="mt-4 font-serif text-4xl tracking-tight sm:text-5xl">Cosa succede dopo</h2>
          <div className="mt-10">
            <HowItWorks />
          </div>
        </Container>
      </section>

      <section className="pb-8">
        <Container narrow>
          <SectionLabel n="02">Domande frequenti</SectionLabel>
          <h2 className="mt-4 font-serif text-4xl tracking-tight sm:text-5xl">Prima che tu lo chieda</h2>
          <div className="mt-8">
            <Faq items={faqProva} />
          </div>
        </Container>
      </section>
    </>
  );
}
