import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Container } from "@/components/Container";
import { CtaBox } from "@/components/CtaBox";
import { LinkList } from "@/components/LinkList";
import { getSettori } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Cosa chiedono i clienti all'AI, settore per settore · TiTrovano",
  description:
    "Le domande che i clienti fanno a ChatGPT, Gemini e Perplexity prima di scegliere un dentista, un hotel, un idraulico o un ristorante.",
  path: "/settori",
});

export default function SettoriPage() {
  const settori = getSettori();
  return (
    <Container className="py-10 sm:py-14">
      <Breadcrumbs items={[{ name: "Settori", path: "/settori" }]} />
      <h1 className="mt-8 text-4xl font-semibold tracking-tight sm:text-5xl">Cosa chiedono i tuoi clienti all&apos;AI</h1>
      <p className="mt-6 max-w-2xl text-lg text-ink-soft">
        Ogni settore ha le sue domande. Scegli il tuo e guarda cosa scrivono i clienti a ChatGPT, Gemini e
        Perplexity prima di decidere a chi rivolgersi.
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
