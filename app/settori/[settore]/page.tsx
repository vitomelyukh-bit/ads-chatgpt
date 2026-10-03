import { notFound } from "next/navigation";
import { AdMock } from "@/components/AdMock";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ChatQuestions } from "@/components/ChatQuestions";
import { Container } from "@/components/Container";
import { Faq } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { LeadForm } from "@/components/LeadForm";
import { LinkList } from "@/components/LinkList";
import { Mdx } from "@/components/Mdx";
import { SectionLabel } from "@/components/SectionLabel";
import { Steps } from "@/components/Steps";
import { getSettore, getSettori, guidePerSettore, settoreOptions } from "@/lib/content";
import { faqPage } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/metadata";

export const dynamicParams = false;

export function generateStaticParams() {
  return getSettori().map((s) => ({ settore: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/settori/[settore]">) {
  const { settore } = await params;
  const s = getSettore(settore);
  if (!s) return {};
  return pageMetadata({ title: s.title, description: s.description, path: `/settori/${s.slug}` });
}

const h2 = "mt-5 text-3xl font-semibold tracking-tight sm:text-4xl";

export default async function SettorePage({ params }: PageProps<"/settori/[settore]">) {
  const { settore } = await params;
  const s = getSettore(settore);
  if (!s) notFound();
  const guide = guidePerSettore(s);
  const altri = getSettori().filter((x) => x.slug !== s.slug);
  const haInglese = s.domande.some((d) => d.lingua === "en");

  return (
    <>
      {s.faq.length > 0 && <JsonLd data={faqPage(s.faq)} />}
      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,#000_15%,transparent_65%)]" />
        <Container className="relative pt-8 pb-20">
          <Breadcrumbs items={[{ name: "Settori", path: "/settori" }, { name: s.nome, path: `/settori/${s.slug}` }]} />
          <div className="mt-12 grid items-center gap-14 lg:grid-cols-[1.15fr_1fr]">
            <div>
              <SectionLabel>Annunci su ChatGPT · {s.nome}</SectionLabel>
              <h1 className="mt-5 text-4xl font-semibold leading-[1.04] tracking-tight sm:text-[3.4rem]">{s.h1}</h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-fg-soft">{s.intro}</p>
              <a href="#analisi" className="btn-accent mt-9">Richiedi l&apos;analisi gratuita <span aria-hidden="true">→</span></a>
            </div>
            <AdMock domanda={s.esempioRisposta.domanda} inserzionista={s.annuncio.inserzionista} descrizione={s.annuncio.descrizione} />
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-surface/50 py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <SectionLabel n="01">Le domande</SectionLabel>
              <h2 className={h2}>Cosa chiedono a ChatGPT i tuoi clienti</h2>
              <p className="mt-6 text-lg text-fg-soft">
                Sono le conversazioni in cui un annuncio può comparire.
                {haInglese && " Alcune le fanno clienti stranieri, in inglese."}
              </p>
            </div>
            <ChatQuestions domande={s.domande} />
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container narrow><Mdx source={s.body} /></Container>
      </section>

      <section className="py-16">
        <Container>
          <SectionLabel n="02">Come funziona</SectionLabel>
          <h2 className={h2}>Dall&apos;analisi gratuita alla campagna</h2>
          <div className="mt-10"><Steps /></div>
        </Container>
      </section>

      {s.faq.length > 0 && (
        <section className="py-16">
          <Container narrow>
            <SectionLabel n="03">Domande frequenti</SectionLabel>
            <h2 className={h2}>Prima che tu lo chieda</h2>
            <div className="mt-10"><Faq items={s.faq} /></div>
          </Container>
        </section>
      )}

      <section id="analisi" className="scroll-mt-20 py-12">
        <Container>
          <div className="card grid gap-10 p-6 sm:p-10 lg:grid-cols-[1fr_1.4fr] lg:gap-14 lg:p-14">
            <div>
              <SectionLabel>Analisi gratuita</SectionLabel>
              <h2 className={h2}>Scopri se gli annunci su ChatGPT fanno per te</h2>
              <p className="mt-5 text-fg-soft">Gratis e senza impegno. Se non ha senso per la tua attività, te lo diciamo.</p>
            </div>
            <LeadForm settori={settoreOptions()} defaultSettore={s.nome} headingLevel={3} />
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <div className="grid gap-14 lg:grid-cols-2">
            {guide.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">Guide utili</h2>
                <div className="mt-6"><LinkList items={guide.map((g) => ({ href: `/guide/${g.slug}`, label: g.h1 }))} /></div>
              </div>
            )}
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Altri settori</h2>
              <div className="mt-6"><LinkList items={altri.map((x) => ({ href: `/settori/${x.slug}`, label: x.nome }))} /></div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
