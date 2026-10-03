import Link from "next/link";
import { getGuide, getSettori } from "@/lib/content";
import { titolare } from "@/lib/titolare";
import { Logo } from "./Logo";

export function Footer() {
  const settori = getSettori();
  const guide = getGuide().slice(0, 6);
  const link = "text-fg-soft hover:text-fg";
  return (
    <footer className="mt-32 border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.3fr_1fr_1.4fr_1fr]">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm text-fg-mute">
            Annunci su ChatGPT per attività e aziende italiane. Strategia, campagne e report.
          </p>
          <Link href="/analisi-gratuita" className="btn-accent !px-4 !py-2 text-sm">Analisi gratuita</Link>
        </div>
        <div>
          <h2 className="label-mono text-fg-mute">Settori</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {settori.map((s) => <li key={s.slug}><Link href={`/settori/${s.slug}`} className={link}>{s.nome}</Link></li>)}
          </ul>
        </div>
        <div>
          <h2 className="label-mono text-fg-mute">Guide</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {guide.map((g) => <li key={g.slug}><Link href={`/guide/${g.slug}`} className={link}>{g.h1}</Link></li>)}
            <li><Link href="/guide" className="text-accent hover:underline">Tutte le guide →</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="label-mono text-fg-mute">Informazioni</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/analisi-gratuita" className={link}>Analisi gratuita</Link></li>
            <li><Link href="/privacy" className={link}>Privacy policy</Link></li>
            <li><Link href="/cookie" className={link}>Cookie policy</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-6xl px-4 py-6 text-xs text-fg-mute sm:px-6">
          © {new Date().getFullYear()} TiTrovano è un progetto di {titolare.nome} · P.IVA {titolare.piva} · {titolare.citta}.
          ChatGPT è un marchio di OpenAI; Gemini di Google; Perplexity dei rispettivi proprietari. TiTrovano è un servizio
          indipendente e non è affiliato a nessuno di loro.
        </p>
      </div>
    </footer>
  );
}
