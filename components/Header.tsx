import Link from "next/link";
import { Logo } from "./Logo";

export function Header() {
  return (
    <header className="relative z-10">
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" aria-label="TiTrovano, torna alla home">
          <Logo />
        </Link>
        <nav aria-label="Principale" className="flex items-center gap-1 sm:gap-6">
          <Link href="/settori" className="label-mono hidden px-1 py-2 text-ink-soft hover:text-ink sm:inline-block">Settori</Link>
          <Link href="/guide" className="label-mono hidden px-1 py-2 text-ink-soft hover:text-ink sm:inline-block">Guide</Link>
          <Link href="/prova-gratuita" className="btn-ink !px-4 !py-2.5 text-sm">
            Prova gratuita
          </Link>
        </nav>
      </div>
    </header>
  );
}
