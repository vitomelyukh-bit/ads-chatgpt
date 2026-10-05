import Link from "next/link";
import { Logo } from "./Logo";

// SiteHeader del design system: logo, tre voci e il bottone.
export function Header() {
  return (
    <header className="tt-header">
      <Link href="/" className="tt-logo" aria-label="TiTrovano, torna alla home">
        <Logo />
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
