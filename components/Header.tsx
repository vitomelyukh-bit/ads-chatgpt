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
        <Link href="/#prezzo">Prezzo</Link>
        <Link href="/annunci-chatgpt">Annunci online</Link>
        <Link href="/#attiva" className="tt-btn">Inizia ora</Link>
      </nav>
    </header>
  );
}
