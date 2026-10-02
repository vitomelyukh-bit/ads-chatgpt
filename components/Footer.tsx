import Link from "next/link";
import { getGuide, getSettori } from "@/lib/content";
import { Logo } from "./Logo";

export function Footer() {
  const settori = getSettori();
  const guide = getGuide().slice(0, 6);
  const link = "text-ink-soft hover:text-accent";
  return (
    <footer className="mt-24 border-t border-line/70 bg-paper-alt">
      <div className="mx-auto grid max-w-5xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        <div className="space-y-3">
          <Logo />
          <p className="text-sm text-ink-soft">
            Scopri gratis se ChatGPT, Gemini e Perplexity consigliano la tua attività.
          </p>
          <Link href="/prova-gratuita" className="inline-block text-sm font-semibold text-accent hover:underline">
            Richiedi la prova gratuita →
          </Link>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-ink">Settori</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {settori.map((s) => (
              <li key={s.slug}><Link href={`/settori/${s.slug}`} className={link}>{s.nome}</Link></li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-1">
          <h2 className="text-sm font-semibold text-ink">Guide</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {guide.map((g) => (
              <li key={g.slug}><Link href={`/guide/${g.slug}`} className={link}>{g.h1}</Link></li>
            ))}
            <li><Link href="/guide" className="font-semibold text-accent hover:underline">Tutte le guide →</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-ink">Informazioni</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/prova-gratuita" className={link}>Prova gratuita</Link></li>
            <li><Link href="/privacy" className={link}>Privacy policy</Link></li>
            <li><Link href="/cookie" className={link}>Cookie policy</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line/70">
        <p className="mx-auto max-w-5xl px-4 py-6 text-xs text-ink-mute sm:px-6">
          © {new Date().getFullYear()} TiTrovano. ChatGPT, Gemini e Perplexity sono marchi dei rispettivi proprietari.
          TiTrovano non è affiliato a nessuno di loro.
        </p>
      </div>
    </footer>
  );
}
