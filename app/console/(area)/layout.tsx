import Link from "next/link";
import { logout } from "@/actions/console";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ConsoleLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <>
      <header className="tt-header">
        <Link href="/console" className="tt-wordmark">TiTrovano · console</Link>
        <nav aria-label="Console">
          <Link href="/console">Clienti</Link>
          <Link href="/console/scheda">Scheda Google</Link>
          <Link href="/" target="_blank">Sito</Link>
          <form action={logout}><button className="tt-btn tt-btn--secondary">Esci</button></form>
        </nav>
      </header>
      <main id="contenuto" className="tt-wrap" style={{ padding: "var(--space-12) var(--space-12) var(--space-24)" }}>{children}</main>
    </>
  );
}
