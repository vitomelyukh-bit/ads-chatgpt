import Link from "next/link";
import { Container } from "@/components/Container";

export default function NotFound() {
  return (
    <Container narrow className="py-24">
      <h1 className="text-3xl font-semibold tracking-tight">Pagina non trovata</h1>
      <p className="mt-4 text-ink-soft">La pagina che cerchi non esiste o è stata spostata.</p>
      <p className="mt-6">
        <Link href="/" className="font-semibold text-accent hover:underline">Torna alla home</Link>
      </p>
    </Container>
  );
}
