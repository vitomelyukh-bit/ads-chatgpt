import Link from "next/link";
import { getGuide, getSettori } from "@/lib/content";
import { titolare } from "@/lib/titolare";
import { Logo } from "./Logo";

export function Footer() {
  const settori = getSettori();
  const guide = getGuide().slice(0, 6);
  const link = "text-paper/75 hover:text-accent";
  return (
    <footer className="mt-28 bg-ink text-paper">
      <div className="mx-auto max-w-6xl px-4 pt-16 sm:px-6">
        <div className="flex flex-col gap-6 border-b border-paper/15 pb-12 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-xl font-serif text-4xl leading-tight sm:text-5xl">
            Quando un cliente chiede all&apos;AI, esce <em className="hl whitespace-nowrap text-ink">il tuo nome</em>?
          </p>
          <Link
            href="/prova-gratuita"
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-accent px-6 py-3.5 font-semibold text-ink transition hover:bg-paper sm:self-auto"
          >
            Scoprilo gratis <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1.4fr_1fr]">
          <div className="space-y-3">
            <Logo inverse />
            <p className="text-sm text-paper/70">
              Scopri gratis se ChatGPT, Gemini e Perplexity consigliano la tua attività.
            </p>
          </div>
          <div>
            <h2 className="label-mono text-paper/60">Settori</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {settori.map((s) => (
                <li key={s.slug}><Link href={`/settori/${s.slug}`} className={link}>{s.nome}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="label-mono text-paper/60">Guide</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {guide.map((g) => (
                <li key={g.slug}><Link href={`/guide/${g.slug}`} className={link}>{g.h1}</Link></li>
              ))}
              <li><Link href="/guide" className="font-semibold text-accent hover:underline">Tutte le guide →</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="label-mono text-paper/60">Informazioni</h2>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/prova-gratuita" className={link}>Prova gratuita</Link></li>
              <li><Link href="/privacy" className={link}>Privacy policy</Link></li>
              <li><Link href="/cookie" className={link}>Cookie policy</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-paper/15">
        <p className="mx-auto max-w-6xl px-4 py-6 text-xs text-paper/60 sm:px-6">
          © {new Date().getFullYear()} TiTrovano è un progetto di {titolare.nome} · P.IVA {titolare.piva} ·{" "}
          {titolare.citta}. ChatGPT, Gemini e Perplexity sono marchi dei rispettivi proprietari. TiTrovano non è
          affiliato a nessuno di loro.
        </p>
      </div>
    </footer>
  );
}
