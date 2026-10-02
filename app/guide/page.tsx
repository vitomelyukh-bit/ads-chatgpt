import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Container } from "@/components/Container";
import { CtaBox } from "@/components/CtaBox";
import { LinkList } from "@/components/LinkList";
import { getGuide } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Guide: come l'AI sceglie chi consigliare · TiTrovano",
  description:
    "Guide semplici per capire come ChatGPT, Gemini e Perplexity scelgono quali attività consigliare, e come verificare se consigliano la tua.",
  path: "/guide",
});

export default function GuidePage() {
  return (
    <Container className="py-10 sm:py-14">
      <Breadcrumbs items={[{ name: "Guide", path: "/guide" }]} />
      <h1 className="mt-8 text-4xl font-semibold tracking-tight sm:text-5xl">Guide</h1>
      <p className="mt-6 max-w-2xl text-lg text-ink-soft">
        Come ragionano ChatGPT, Gemini e Perplexity quando un cliente chiede a chi rivolgersi. Spiegato senza
        parole tecniche.
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
