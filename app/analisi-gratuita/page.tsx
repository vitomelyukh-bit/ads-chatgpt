import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Container } from "@/components/Container";
import { Faq } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { LeadForm } from "@/components/LeadForm";
import { SectionLabel } from "@/components/SectionLabel";
import { Steps } from "@/components/Steps";
import { settoreOptions } from "@/lib/content";
import { faqAnalisi } from "@/lib/faq";
import { faqPage } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Analisi gratuita: annunci su ChatGPT · TiTrovano",
  description:
    "Scopri se gli annunci su ChatGPT hanno senso per la tua attività o azienda, con quali messaggi e con quale budget di partenza. Gratis e senza impegno.",
  path: "/analisi-gratuita",
});

export default function AnalisiPage() {
  return (
    <>
      <JsonLd data={faqPage(faqAnalisi)} />
      <Container className="pt-8 pb-16">
        <Breadcrumbs items={[{ name: "Analisi gratuita", path: "/analisi-gratuita" }]} />
        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <SectionLabel>Gratis e senza impegno</SectionLabel>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
              Richiedi l&apos;<span className="text-accent">analisi gratuita</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-fg-soft">
              Lasciaci i tuoi dati e ti chiamiamo per una breve call: vediamo cosa chiedono i tuoi clienti a ChatGPT, se gli
              annunci hanno senso per te e con quale budget di partenza. Se non ne hanno, te lo diciamo.
            </p>
          </div>
          <div className="card p-6 sm:p-10">
            <LeadForm settori={settoreOptions()} />
          </div>
        </div>
      </Container>

      <section className="py-16">
        <Container>
          <SectionLabel n="01">Dopo l&apos;invio</SectionLabel>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">Cosa succede dopo</h2>
          <div className="mt-10"><Steps /></div>
        </Container>
      </section>

      <section className="py-16">
        <Container narrow>
          <SectionLabel n="02">Domande frequenti</SectionLabel>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">Prima che tu lo chieda</h2>
          <div className="mt-10"><Faq items={faqAnalisi} /></div>
        </Container>
      </section>
    </>
  );
}
