import Link from "next/link";
import { Logo } from "./Logo";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-bg/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" aria-label="TiTrovano, torna alla home">
          <Logo />
        </Link>
        <nav aria-label="Principale" className="flex items-center gap-1 text-sm sm:gap-7">
          <Link href="/#come-funziona" className="hidden text-fg-soft hover:text-fg md:inline">Come funziona</Link>
          <Link href="/settori" className="hidden text-fg-soft hover:text-fg sm:inline">Settori</Link>
          <Link href="/guide" className="hidden text-fg-soft hover:text-fg sm:inline">Guide</Link>
          <Link href="/analisi-gratuita" className="btn-accent !px-4 !py-2 text-sm">Analisi gratuita</Link>
        </nav>
      </div>
    </header>
  );
}
