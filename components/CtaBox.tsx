import Link from "next/link";

export function CtaBox({
  titolo = "Scopri se gli annunci su ChatGPT fanno per te",
  testo = "Analisi gratuita: ti diciamo se il tuo settore ha senso su ChatGPT, con quali messaggi e con quale budget di partenza.",
}: { titolo?: string; testo?: string }) {
  return (
    <aside className="card relative overflow-hidden p-8 sm:p-12">
      <div aria-hidden="true" className="absolute -right-24 -top-24 size-72 rounded-full bg-accent/20 blur-3xl" />
      <h2 className="relative max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">{titolo}</h2>
      <p className="relative mt-4 max-w-xl text-fg-soft">{testo}</p>
      <Link href="/analisi-gratuita" className="btn-accent relative mt-8">
        Richiedi l&apos;analisi gratuita <span aria-hidden="true">→</span>
      </Link>
    </aside>
  );
}
