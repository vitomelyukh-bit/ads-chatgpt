import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Container } from "@/components/Container";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Cookie policy · TiTrovano",
  description: "Cookie policy di TiTrovano.",
  path: "/cookie",
  noindex: true,
});

export default function Page() {
  return (
    <Container narrow className="py-10 sm:py-14">
      <Breadcrumbs items={[{ name: "Cookie policy", path: "/cookie" }]} />
      <h1 className="mt-8 text-4xl font-semibold tracking-tight">Cookie policy</h1>
      <div role="note" className="mt-8 rounded-xl border-2 border-dashed border-amber-500 bg-amber-50 p-6 text-amber-900">
        <p className="font-semibold uppercase tracking-wide">Da completare</p>
        <p className="mt-2">
          Questa pagina è un segnaposto. Il testo definitivo va scritto e verificato prima della messa online.
        </p>
      </div>
    </Container>
  );
}
