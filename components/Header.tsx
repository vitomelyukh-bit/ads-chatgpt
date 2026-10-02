import Link from "next/link";
import { Logo } from "./Logo";

export function Header() {
  return (
    <header className="border-b border-line/70">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" aria-label="TiTrovano, torna alla home">
          <Logo />
        </Link>
        <nav aria-label="Principale" className="flex items-center gap-1 text-sm sm:gap-4">
          <Link href="/settori" className="hidden rounded-md px-2 py-2 text-ink-soft hover:text-accent sm:inline-block">Settori</Link>
          <Link href="/guide" className="hidden rounded-md px-2 py-2 text-ink-soft hover:text-accent sm:inline-block">Guide</Link>
          <Link
            href="/prova-gratuita"
            className="rounded-lg bg-accent px-3.5 py-2 font-semibold text-white hover:bg-accent-strong"
          >
            Prova gratuita
          </Link>
        </nav>
      </div>
    </header>
  );
}
