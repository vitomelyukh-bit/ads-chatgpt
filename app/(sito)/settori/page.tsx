import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CtaBox } from "@/components/CtaBox";
import { LinkCards } from "@/components/ds/LinkCards";
import { getSettori } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Annunci su ChatGPT per settore · TiTrovano",
  description:
    "Annunci su ChatGPT per attività locali, e-commerce e aziende B2B: cosa chiedono i clienti all'AI in ogni settore e quando conviene comparire.",
  path: "/settori",
});

export default function SettoriPage() {
  const settori = getSettori();
  const locali = settori.filter((s) => s.tipo === "locale");
  const aziende = settori.filter((s) => s.tipo === "azienda");
  return (
    <div className="tt-wrap tt-page-head">
      <Breadcrumbs items={[{ name: "Settori", path: "/settori" }]} />
      <div className="tt-stack-6">
        <h1 className="tt-display-xl">Annunci su ChatGPT, settore per settore</h1>
        <p className="tt-lead">
          Ogni settore ha le sue domande e i suoi numeri. Scegli il tuo: vedi cosa chiedono i clienti a ChatGPT e quando un annuncio ha senso.
        </p>
      </div>
      <div className="tt-two" style={{ marginTop: "var(--space-12)" }}>
        <div className="tt-stack-4">
          <h2 className="tt-subheading">Attività locali</h2>
          <LinkCards items={locali.map((s) => ({ href: `/settori/${s.slug}`, label: s.nome, sub: `“${s.domande[0].testo}”` }))} />
        </div>
        <div className="tt-stack-4">
          <h2 className="tt-subheading">Aziende ed e-commerce</h2>
          <LinkCards items={aziende.map((s) => ({ href: `/settori/${s.slug}`, label: s.nome, sub: `“${s.domande[0].testo}”` }))} />
        </div>
      </div>
      <div style={{ marginTop: "var(--space-16)", maxWidth: "var(--measure)" }}>
        <CtaBox />
      </div>
    </div>
  );
}
