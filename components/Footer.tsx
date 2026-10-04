import Link from "next/link";
import { getGuide, getSettori } from "@/lib/content";
import { titolare } from "@/lib/titolare";

// Piè di pagina composto con gli stili di testo del design system.
export function Footer() {
  const settori = getSettori();
  const guide = getGuide().slice(0, 6);
  return (
    <footer className="tt-footer">
      <div className="tt-wrap">
        <div className="tt-footer-grid">
          <div className="tt-stack-4">
            <Link href="/" className="tt-wordmark">TiTrovano</Link>
            <p className="tt-small tt-muted">Annunci su ChatGPT per attività e aziende italiane. Strategia, campagne e report.</p>
          </div>
          <div>
            <h2 className="tt-label">Settori</h2>
            <ul>{settori.map((s) => <li key={s.slug}><Link href={`/settori/${s.slug}`}>{s.nome}</Link></li>)}</ul>
          </div>
          <div>
            <h2 className="tt-label">Guide</h2>
            <ul>
              {guide.map((g) => <li key={g.slug}><Link href={`/guide/${g.slug}`}>{g.h1}</Link></li>)}
              <li><Link href="/guide">Tutte le guide →</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="tt-label">Informazioni</h2>
            <ul>
              <li><Link href="/analisi-gratuita">Analisi gratuita</Link></li>
              <li><Link href="/scheda-google">Scheda Google sempre viva</Link></li>
              <li><Link href="/canali">Canali: ChatGPT, Google, Meta, SEO</Link></li>
              <li><Link href="/privacy">Privacy policy</Link></li>
              <li><Link href="/cookie">Cookie policy</Link></li>
            </ul>
          </div>
        </div>
        <p className="tt-small tt-muted tt-footer-legal">
          © {new Date().getFullYear()} TiTrovano è un progetto di {titolare.nome} · P.IVA {titolare.piva} · {titolare.citta}.
          ChatGPT è un marchio di OpenAI; Gemini di Google; Perplexity dei rispettivi proprietari. TiTrovano è un servizio
          indipendente e non è affiliato a nessuno di loro.
        </p>
      </div>
    </footer>
  );
}
