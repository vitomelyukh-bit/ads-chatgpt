import Link from "next/link";
import { Container } from "@/components/Container";

export default function NotFound() {
  return (
    <Container narrow className="py-24">
      <h1 className="font-serif text-5xl tracking-tight">Pagina non trovata</h1>
      <p className="mt-4 text-ink-soft">La pagina che cerchi non esiste o è stata spostata.</p>
      <p className="mt-6">
        <Link href="/" className="link-ul font-semibold text-ink">Torna alla home</Link>
      </p>
    </Container>
  );
}
