import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CtaBox } from "@/components/CtaBox";
import { LinkCards } from "@/components/ds/LinkCards";
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
    <div className="tt-wrap tt-wrap--read tt-page-head">
      <Breadcrumbs items={[{ name: "Guide", path: "/guide" }]} />
      <div className="tt-stack-6">
        <h1 className="tt-display-xl">Guide</h1>
        <p className="tt-lead">
          Come rispondono ChatGPT, Gemini e Perplexity ai clienti e come funzionano gli annunci su ChatGPT. Spiegato senza gergo.
        </p>
      </div>
      <div className="tt-section-body" style={{ marginTop: "var(--space-12)" }}>
        <LinkCards items={getGuide().map((g) => ({ href: `/guide/${g.slug}`, label: g.h1, sub: g.description }))} />
      </div>
      <div style={{ marginTop: "var(--space-16)" }}>
        <CtaBox />
      </div>
    </div>
  );
}
