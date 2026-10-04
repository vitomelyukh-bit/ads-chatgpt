import Link from "next/link";

// SiteHeader del design system: nome composto in testo, tre voci e il bottone.
export function Header() {
  return (
    <header className="tt-header">
      <Link href="/" className="tt-wordmark" aria-label="TiTrovano, torna alla home">
        TiTrovano
      </Link>
      <nav aria-label="Principale">
        <Link href="/#come-funziona">Come funziona</Link>
        <Link href="/settori">Settori</Link>
        <Link href="/guide">Guide</Link>
        <Link href="/analisi-gratuita" className="tt-btn">Analisi gratuita</Link>
      </nav>
    </header>
  );
}
