import { notFound } from "next/navigation";
import { AiAnswerMock } from "@/components/AiAnswerMock";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ChatQuestions } from "@/components/ChatQuestions";
import { Container } from "@/components/Container";
import { Faq } from "@/components/Faq";
import { HowItWorks } from "@/components/HowItWorks";
import { JsonLd } from "@/components/JsonLd";
import { LinkList } from "@/components/LinkList";
import { Mdx } from "@/components/Mdx";
import { SectionLabel } from "@/components/SectionLabel";
import { TrialForm } from "@/components/TrialForm";
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

const h2 = "mt-4 font-serif text-4xl leading-[1.05] tracking-tight sm:text-5xl";

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

      <section className="overflow-hidden">
        <Container className="pt-6 pb-20 sm:pt-10">
          <Breadcrumbs items={[{ name: "Settori", path: "/settori" }, { name: s.nome, path: `/settori/${s.slug}` }]} />
          <div className="mt-10 grid items-center gap-16 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
            <div>
              <SectionLabel>Settore · {s.nome}</SectionLabel>
              <h1 className="mt-5 font-serif text-5xl leading-[1] tracking-tight sm:text-6xl">{s.h1}</h1>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-soft">{s.intro}</p>
              <a href="#prova" className="btn-ink mt-9 text-base">
                Richiedi la prova gratuita <span aria-hidden="true">→</span>
              </a>
            </div>
            <div className="pb-6 lg:pb-0">
              <AiAnswerMock domanda={s.esempioRisposta.domanda} lingua={s.esempioRisposta.lingua} />
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-ink/15 bg-paper-alt/60 py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <SectionLabel n="01">Le domande</SectionLabel>
              <h2 className={h2}>Cosa chiedono all&apos;AI i tuoi clienti</h2>
              <p className="mt-6 text-lg text-ink-soft">
                Domande come queste. Ognuna riceve una risposta con pochi nomi.
                {haInglese && " Alcune le fanno i clienti stranieri, in inglese."}
              </p>
            </div>
            <ChatQuestions domande={s.domande} />
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container narrow>
          <Mdx source={s.body} />
        </Container>
      </section>

      <section className="border-t border-ink/15 py-20">
        <Container>
          <SectionLabel n="02">Come funziona</SectionLabel>
          <h2 className={`${h2} max-w-3xl`}>La prova gratuita, in tre passi</h2>
          <div className="mt-10">
            <HowItWorks />
          </div>
        </Container>
      </section>

      {s.faq.length > 0 && (
        <section className="pb-20">
          <Container narrow>
            <SectionLabel n="03">Domande frequenti</SectionLabel>
            <h2 className={h2}>Prima che tu lo chieda</h2>
            <div className="mt-10">
              <Faq items={s.faq} />
            </div>
          </Container>
        </section>
      )}

      <section id="prova" className="scroll-mt-8 py-12">
        <Container>
          <div className="grid gap-10 rounded-[2rem] border-2 border-ink bg-card p-6 shadow-[8px_8px_0_var(--color-ink)] sm:p-10 lg:grid-cols-[1fr_1.4fr] lg:gap-14 lg:p-14">
            <div>
              <SectionLabel>Prova gratuita</SectionLabel>
              <h2 className={h2}>
                Scopri se l&apos;AI consiglia <span className="hl">la tua attività</span>
              </h2>
              <p className="mt-6 text-lg text-ink-soft">
                Facciamo 20 domande come queste a ChatGPT, Gemini e Perplexity. Poi ti diciamo cosa abbiamo trovato.
              </p>
            </div>
            <TrialForm settori={settoreOptions()} defaultSettore={s.nome} headingLevel={3} />
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <div className="grid gap-14 lg:grid-cols-2">
            {guide.length > 0 && (
              <div>
                <h2 className="font-serif text-3xl tracking-tight">Guide utili</h2>
                <div className="mt-6">
                  <LinkList items={guide.map((g) => ({ href: `/guide/${g.slug}`, label: g.h1 }))} />
                </div>
              </div>
            )}
            <div>
              <h2 className="font-serif text-3xl tracking-tight">Altri settori</h2>
              <div className="mt-6">
                <LinkList items={altri.map((x) => ({ href: `/settori/${x.slug}`, label: x.nome }))} />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
