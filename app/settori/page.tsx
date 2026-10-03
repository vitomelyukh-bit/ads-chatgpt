import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Container } from "@/components/Container";
import { CtaBox } from "@/components/CtaBox";
import { LinkList } from "@/components/LinkList";
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
  return (
    <Container className="py-10 sm:py-14">
      <Breadcrumbs items={[{ name: "Settori", path: "/settori" }]} />
      <h1 className="mt-10 max-w-4xl text-4xl font-semibold leading-[1.04] tracking-tight sm:text-6xl">Annunci su ChatGPT, settore per settore</h1>
      <p className="mt-6 max-w-2xl text-lg text-fg-soft">
        Ogni settore ha le sue domande e i suoi numeri. Scegli il tuo: vedi cosa chiedono i clienti a ChatGPT e quando un annuncio ha senso.
      </p>
      <div className="mt-12">
        <LinkList
          items={settori.map((s) => ({ href: `/settori/${s.slug}`, label: s.nome, sub: `“${s.domande[0].testo}”` }))}
        />
      </div>
      <div className="mt-20">
        <CtaBox />
      </div>
    </Container>
  );
}
