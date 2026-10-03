import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Container } from "@/components/Container";
import { CtaBox } from "@/components/CtaBox";
import { LinkList } from "@/components/LinkList";
import { getGuide } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Guide su ChatGPT, AI e annunci · TiTrovano",
  description:
    "Guide semplici su come ChatGPT, Gemini e Perplexity rispondono ai clienti, su come funzionano gli annunci su ChatGPT e su quando conviene usarli.",
  path: "/guide",
});

export default function GuidePage() {
  return (
    <Container className="py-10 sm:py-14">
      <Breadcrumbs items={[{ name: "Guide", path: "/guide" }]} />
      <h1 className="mt-10 text-4xl font-semibold tracking-tight sm:text-6xl">Guide</h1>
      <p className="mt-6 max-w-2xl text-lg text-fg-soft">
        Come rispondono ChatGPT, Gemini e Perplexity ai clienti e come funzionano gli annunci su ChatGPT. Spiegato senza gergo.
      </p>
      <div className="mt-12">
        <LinkList items={getGuide().map((g) => ({ href: `/guide/${g.slug}`, label: g.h1, sub: g.description }))} />
      </div>
      <div className="mt-20">
        <CtaBox />
      </div>
    </Container>
  );
}
