import Link from "next/link";
import { Logo } from "./Logo";

// SiteHeader del design system: logo, tre voci e il bottone.
// Su telefono: logo e bottone sulla prima riga, le tre voci sotto.
export function Header() {
  return (
    <header className="tt-header">
      <Link href="/" className="tt-logo" aria-label="TiTrovano, torna alla home">
        <Logo />
      </Link>
      <nav aria-label="Principale">
        <span className="tt-nav-links">
          <Link href="/#come-funziona">Come funziona</Link>
          <Link href="/#prezzo">Prezzo</Link>
          <Link href="/annunci-chatgpt">Annunci online</Link>
        </span>
        <Link href="/#attiva" className="tt-btn">Inizia ora</Link>
      </nav>
    </header>
  );
}
