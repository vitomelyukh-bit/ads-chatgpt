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
          <Link href="/#sito">SEO del sito</Link>
          <Link href="/#risultati">Risultati</Link>
          <Link href="/scheda-google">Scheda Google</Link>
          <Link href="/annunci-chatgpt">Annunci online</Link>
        </span>
        <Link href="/#attiva" className="tt-btn">Consulenza gratuita</Link>
      </nav>
    </header>
  );
}
