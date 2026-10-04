import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ChatAd } from "@/components/ds/ChatAd";
import { FaqList } from "@/components/ds/FaqList";
import { LinkCards } from "@/components/ds/LinkCards";
import { SectionHead } from "@/components/ds/SectionHead";
import { StepList } from "@/components/ds/StepList";
import { JsonLd } from "@/components/JsonLd";
import { LeadForm } from "@/components/LeadForm";
import { Mdx } from "@/components/Mdx";
import { passi } from "@/components/Steps";
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

      <section className="tt-section" style={{ paddingTop: "var(--space-12)" }}>
        <div className="tt-wrap">
          <Breadcrumbs items={[{ name: "Settori", path: "/settori" }, { name: s.nome, path: `/settori/${s.slug}` }]} />
          <div className="tt-hero" style={{ marginTop: "var(--space-8)" }}>
            <div className="tt-stack-6">
              <p className="tt-eyebrow" style={{ margin: 0 }}>Annunci su ChatGPT · {s.nome}</p>
              <h1 className="tt-display-xl">{s.h1}</h1>
              <p className="tt-lead">{s.intro}</p>
              <div className="tt-actions">
                <a href="#analisi" className="tt-btn tt-btn--lg">Richiedi l&apos;analisi gratuita <span aria-hidden="true">→</span></a>
              </div>
            </div>
            <ChatAd domanda={s.esempioRisposta.domanda} inserzionista={s.annuncio.inserzionista} descrizione={s.annuncio.descrizione} />
          </div>
        </div>
      </section>

      <section className="tt-section tt-section--sunk">
        <div className="tt-wrap tt-wrap--read">
          <SectionHead
            n="01"
            occhiello="Le domande"
            testo={<>Sono le conversazioni in cui un annuncio può comparire.{haInglese && " Alcune le fanno clienti stranieri, in inglese."}</>}
          >
            Cosa chiedono a ChatGPT <span className="tt-mark">i tuoi clienti</span>
          </SectionHead>
          <ul className="tt-questions tt-section-body" aria-label="Domande che i clienti fanno all'AI">
            {s.domande.map((d, i) => (
              <li key={i}>
                <p className="tt-bubble tt-bubble--user" lang={d.lingua === "en" ? "en" : undefined}>{d.testo}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="tt-section">
        <div className="tt-wrap tt-wrap--read"><Mdx source={s.body} /></div>
      </section>

      <section className="tt-section tt-section--sunk">
        <div className="tt-wrap tt-wrap--read">
          <SectionHead n="02" occhiello="Come funziona">
            Dall&apos;analisi gratuita <span className="tt-mark">alla campagna</span>
          </SectionHead>
          <div className="tt-section-body"><StepList passi={passi} /></div>
        </div>
      </section>

      {s.faq.length > 0 && (
        <section className="tt-section">
          <div className="tt-wrap tt-wrap--read">
            <SectionHead n="03" occhiello="Domande frequenti">
              Prima che tu <span className="tt-mark">lo chieda</span>
            </SectionHead>
            <div className="tt-section-body"><FaqList items={s.faq} /></div>
          </div>
        </section>
      )}

      <section id="analisi" className="tt-section tt-section--sunk" style={{ scrollMarginTop: "var(--space-8)" }}>
        <div className="tt-wrap tt-wrap--read">
          <SectionHead occhiello="Analisi gratuita" testo="Gratis e senza impegno. Se ChatGPT non è il canale giusto per la tua attività, ti diciamo quale lo è.">
            Scopri se gli annunci su ChatGPT <span className="tt-mark">fanno per te</span>
          </SectionHead>
          <div className="tt-card tt-section-body">
            <LeadForm settori={settoreOptions()} defaultSettore={s.nome} headingLevel={3} />
          </div>
        </div>
      </section>

      <section className="tt-section">
        <div className="tt-wrap tt-two">
          {guide.length > 0 && (
            <div className="tt-stack-6">
              <h2 className="tt-heading">Guide utili</h2>
              <LinkCards items={guide.map((g) => ({ href: `/guide/${g.slug}`, label: g.h1 }))} />
            </div>
          )}
          <div className="tt-stack-6">
            <h2 className="tt-heading">Altri settori</h2>
            <LinkCards items={altri.map((x) => ({ href: `/settori/${x.slug}`, label: x.nome }))} />
          </div>
        </div>
      </section>
    </>
  );
}
