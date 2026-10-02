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
import { TrialForm } from "@/components/TrialForm";
import { getGuide, getSettore, getSettori, resolve, settoreOptions } from "@/lib/content";
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

export default async function SettorePage({ params }: PageProps<"/settori/[settore]">) {
  const { settore } = await params;
  const s = getSettore(settore);
  if (!s) notFound();

  const guide = resolve(getGuide(), s.guideCorrelate, `settori/${s.slug}`);
  const altri = getSettori().filter((x) => x.slug !== s.slug);
  const haInglese = s.domande.some((d) => d.lingua === "en");

  return (
    <>
      {s.faq.length > 0 && <JsonLd data={faqPage(s.faq)} />}

      <section className="border-b border-line/60 bg-gradient-to-b from-paper-alt to-paper">
        <Container className="py-10 sm:py-14">
          <Breadcrumbs items={[{ name: "Settori", path: "/settori" }, { name: s.nome, path: `/settori/${s.slug}` }]} />
          <div className="mt-8 grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">{s.h1}</h1>
              <p className="mt-6 text-lg text-ink-soft">{s.intro}</p>
              <a
                href="#prova"
                className="mt-8 inline-flex rounded-xl bg-accent px-6 py-4 font-semibold text-white hover:bg-accent-strong"
              >
                Richiedi la prova gratuita
              </a>
            </div>
            <AiAnswerMock domanda={s.esempioRisposta.domanda} lingua={s.esempioRisposta.lingua} />
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container narrow>
          <h2 className="text-3xl font-semibold tracking-tight">Cosa chiedono all&apos;AI i tuoi clienti</h2>
          <p className="mt-4 text-lg text-ink-soft">
            Domande come queste. Ognuna riceve una risposta con pochi nomi.
            {haInglese && " Quelle segnate EN le fanno i clienti stranieri, in inglese."}
          </p>
          <div className="mt-10">
            <ChatQuestions domande={s.domande} />
          </div>
        </Container>
      </section>

      <section className="bg-paper-alt py-20">
        <Container narrow>
          <Mdx source={s.body} />
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <h2 className="max-w-2xl text-3xl font-semibold tracking-tight">Come funziona la prova gratuita</h2>
          <div className="mt-10">
            <HowItWorks />
          </div>
        </Container>
      </section>

      {s.faq.length > 0 && (
        <section className="pb-20">
          <Container narrow>
            <h2 className="text-3xl font-semibold tracking-tight">Domande frequenti</h2>
            <div className="mt-8">
              <Faq items={s.faq} />
            </div>
          </Container>
        </section>
      )}

      <section id="prova" className="scroll-mt-8 bg-paper-alt py-20">
        <Container narrow>
          <h2 className="text-3xl font-semibold tracking-tight">Scopri se l&apos;AI consiglia la tua attività</h2>
          <p className="mt-4 text-lg text-ink-soft">
            Facciamo 20 domande come queste a ChatGPT, Gemini e Perplexity. Poi ti diciamo cosa abbiamo trovato.
          </p>
          <div className="mt-10 rounded-2xl border border-line bg-white p-5 sm:p-8">
            <TrialForm settori={settoreOptions()} defaultSettore={s.nome} headingLevel={3} />
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          {guide.length > 0 && (
            <>
              <h2 className="text-2xl font-semibold tracking-tight">Guide utili</h2>
              <div className="mt-6">
                <LinkList items={guide.map((g) => ({ href: `/guide/${g.slug}`, label: g.h1 }))} />
              </div>
            </>
          )}
          <h2 className="mt-14 text-2xl font-semibold tracking-tight">Altri settori</h2>
          <div className="mt-6">
            <LinkList items={altri.map((x) => ({ href: `/settori/${x.slug}`, label: x.nome }))} />
          </div>
        </Container>
      </section>
    </>
  );
}
