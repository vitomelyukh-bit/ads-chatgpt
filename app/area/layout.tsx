import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { linkWhatsApp } from "@/lib/scheda";

export const metadata: Metadata = { title: { absolute: "La tua area · TiTrovano" }, robots: { index: false, follow: false } };

// Area dei clienti: testata semplice, niente menu del sito.
export default function AreaLayout({ children }: { children: React.ReactNode }) {
  const wa = linkWhatsApp();
  return (
    <>
      <header className="tt-header">
        <Link href="/area" className="tt-logo" aria-label="TiTrovano, la tua area"><Logo /></Link>
        <nav aria-label="Area"><span className="tt-nav-links"><span className="tt-small tt-muted">La tua area</span></span></nav>
      </header>
      <main id="contenuto">{children}</main>
      {wa && <WhatsAppFloat href={wa} />}
    </>
  );
}
