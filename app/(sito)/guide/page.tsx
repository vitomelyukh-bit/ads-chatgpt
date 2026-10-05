import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CtaBoxMaps } from "@/components/CtaBoxMaps";
import { LinkCards } from "@/components/ds/LinkCards";
import { getGuide } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Guide: Google Maps, recensioni, ChatGPT e annunci · TiTrovano",
  description:
    "Guide pratiche per titolari: come rispondere alle recensioni, averne di nuove, risolvere i problemi della scheda Google Maps. E come funzionano ChatGPT e i suoi annunci.",
  path: "/guide",
});

export default function GuidePage() {
  const tutte = getGuide();
  const gruppi = [
    { id: "google-maps", titolo: "Google Maps e recensioni", guide: tutte.filter((g) => g.tema === "maps") },
    { id: "chatgpt", titolo: "ChatGPT, AI e annunci", guide: tutte.filter((g) => g.tema !== "maps") },
  ].filter((x) => x.guide.length > 0);

  return (
    <div className="tt-wrap tt-wrap--read tt-page-head">
      <Breadcrumbs items={[{ name: "Guide", path: "/guide" }]} />
      <div className="tt-stack-6">
        <h1 className="tt-display-xl">Guide</h1>
        <p className="tt-lead">
          Problemi veri della tua attività su Google Maps, risolti passo per passo. E come funzionano ChatGPT e i suoi annunci.
          Senza gergo.
        </p>
      </div>
      {gruppi.map((x) => (
        <section key={x.id} id={x.id} className="tt-stack-6" style={{ marginTop: "var(--space-12)" }}>
          <h2 className="tt-heading">{x.titolo}</h2>
          <LinkCards items={x.guide.map((g) => ({ href: `/guide/${g.slug}`, label: g.h1, sub: g.description }))} />
        </section>
      ))}
      <div style={{ marginTop: "var(--space-16)" }}>
        <CtaBoxMaps />
      </div>
    </div>
  );
}
