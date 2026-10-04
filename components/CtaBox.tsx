import Link from "next/link";

export function CtaBox({
  titolo = "Scopri se gli annunci su ChatGPT fanno per te",
  testo = "Analisi gratuita: ti diciamo se il tuo settore ha senso su ChatGPT, con quali messaggi e con quale budget di partenza.",
}: { titolo?: string; testo?: string }) {
  return (
    <aside className="tt-card tt-stack-4">
      <h2 className="tt-heading">{titolo}</h2>
      <p className="tt-body">{testo}</p>
      <p><Link href="/analisi-gratuita" className="tt-btn">Richiedi l&apos;analisi gratuita <span aria-hidden="true">→</span></Link></p>
    </aside>
  );
}
