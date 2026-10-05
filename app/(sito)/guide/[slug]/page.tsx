import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CtaBox } from "@/components/CtaBox";
import { CtaBoxMaps } from "@/components/CtaBoxMaps";
import { FaqList } from "@/components/ds/FaqList";
import { JsonLd } from "@/components/JsonLd";
import { LinkCards } from "@/components/ds/LinkCards";
import { Mdx } from "@/components/Mdx";
import { getGuida, getGuide, getSettori, guideCorrelateA, resolve } from "@/lib/content";
import { article, faqPage } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/metadata";

export const dynamicParams = false;

export function generateStaticParams() {
  return getGuide().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps<"/guide/[slug]">) {
  const { slug } = await params;
  const g = getGuida(slug);
  if (!g) return {};
  return pageMetadata({
    title: g.title,
    description: g.description,
    path: `/guide/${g.slug}`,
    type: "article",
    publishedTime: g.datePublished,
    modifiedTime: g.dateModified,
  });
}

const formatData = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" });

export default async function GuidaPage({ params }: PageProps<"/guide/[slug]">) {
  const { slug } = await params;
  const g = getGuida(slug);
  if (!g) notFound();
  const path = `/guide/${g.slug}`;
  const settori = resolve(getSettori(), g.settoriCorrelati, `guide/${g.slug}`);
  const altre = guideCorrelateA(g);

  return (
    <>
      <JsonLd
        data={[
          article({ title: g.h1, description: g.description, path, datePublished: g.datePublished, dateModified: g.dateModified }),
          ...(g.faq.length ? [faqPage(g.faq)] : []),
        ]}
      />
      <div className="tt-wrap tt-wrap--read tt-page-head">
        <Breadcrumbs items={[{ name: "Guide", path: "/guide" }, { name: g.h1, path }]} />
        <article className="tt-stack-8">
          <header className="tt-stack-4">
            <p className="tt-eyebrow" style={{ margin: 0 }}>
              {g.tema === "maps" ? "Guida Google Maps" : "Guida"} · <time dateTime={g.dateModified}>{formatData(g.dateModified)}</time>
            </p>
            <h1 className="tt-display-lg">{g.h1}</h1>
          </header>
          <aside className="tt-callout">
            <span className="tt-tag">In breve</span>
            <p style={{ marginTop: "var(--space-3)" }}>{g.rispostaBreve}</p>
          </aside>
          <Mdx source={g.body} />
          {g.faq.length > 0 && (
            <section className="tt-stack-6" style={{ paddingTop: "var(--space-8)" }}>
              <h2 className="tt-heading">Domande frequenti</h2>
              <FaqList items={g.faq} />
            </section>
          )}
        </article>

        <div style={{ marginTop: "var(--space-16)" }}>
          {g.tema === "maps" ? <CtaBoxMaps /> : <CtaBox />}
        </div>

        {altre.length > 0 && (
          <section className="tt-stack-6" style={{ marginTop: "var(--space-16)" }}>
            <h2 className="tt-heading">Leggi anche</h2>
            <LinkCards items={altre.map((x) => ({ href: `/guide/${x.slug}`, label: x.h1 }))} />
          </section>
        )}
        {settori.length > 0 && g.tema !== "maps" && (
          <section className="tt-stack-6" style={{ marginTop: "var(--space-12)" }}>
            <h2 className="tt-heading">Cosa chiedono all&apos;AI i clienti di questi settori</h2>
            <LinkCards items={settori.map((x) => ({ href: `/settori/${x.slug}`, label: x.nome }))} />
          </section>
        )}
      </div>
    </>
  );
}
