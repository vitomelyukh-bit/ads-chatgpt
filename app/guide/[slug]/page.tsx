import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Container } from "@/components/Container";
import { CtaBox } from "@/components/CtaBox";
import { Faq } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { LinkList } from "@/components/LinkList";
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
      <Container narrow className="py-10 sm:py-14">
        <Breadcrumbs items={[{ name: "Guide", path: "/guide" }, { name: g.h1, path }]} />
        <article className="mt-8">
          <header>
            <h1 className="text-4xl font-semibold leading-[1.15] tracking-tight sm:text-[2.75rem]">{g.h1}</h1>
            <p className="mt-4 text-sm text-ink-mute">
              Aggiornata il <time dateTime={g.dateModified}>{formatData(g.dateModified)}</time>
            </p>
          </header>
          <p className="mt-8 rounded-2xl border-l-4 border-accent bg-accent-soft px-5 py-5 text-lg leading-relaxed text-ink sm:px-6">
            {g.rispostaBreve}
          </p>
          <div className="mt-10">
            <Mdx source={g.body} />
          </div>
          {g.faq.length > 0 && (
            <section className="mt-14">
              <h2 className="text-2xl font-semibold tracking-tight">Domande frequenti</h2>
              <div className="mt-6">
                <Faq items={g.faq} />
              </div>
            </section>
          )}
        </article>

        <div className="mt-16">
          <CtaBox />
        </div>

        {altre.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-semibold tracking-tight">Leggi anche</h2>
            <div className="mt-6">
              <LinkList items={altre.map((x) => ({ href: `/guide/${x.slug}`, label: x.h1 }))} />
            </div>
          </section>
        )}
        {settori.length > 0 && (
          <section className="mt-14">
            <h2 className="text-2xl font-semibold tracking-tight">Cosa chiedono all&apos;AI i clienti di questi settori</h2>
            <div className="mt-6">
              <LinkList items={settori.map((x) => ({ href: `/settori/${x.slug}`, label: x.nome }))} />
            </div>
          </section>
        )}
      </Container>
    </>
  );
}
