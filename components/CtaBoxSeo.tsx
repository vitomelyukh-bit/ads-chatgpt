import Link from "next/link";

// Invito finale delle guide SEO: porta alla consulenza gratuita in home.
export function CtaBoxSeo() {
  return (
    <aside className="tt-card tt-stack-4">
      <h2 className="tt-heading">Vuoi che il tuo sito lo sistemiamo noi?</h2>
      <p className="tt-body">
        Guardiamo il tuo sito come lo vede Google, ti diciamo cosa sistemare e, se vuoi, ogni settimana aggiungiamo le pagine che
        i tuoi clienti cercano. Su WordPress, Wix, Shopify o qualunque sito, senza rifarlo.
      </p>
      <p className="tt-body-strong" style={{ margin: 0 }}>Consulenza gratuita con Vitaliy · ti diciamo cosa fare, anche se poi fai da solo</p>
      <p className="tt-actions" style={{ margin: 0 }}>
        <Link href="/#attiva" className="tt-btn">Prenota la consulenza gratuita <span aria-hidden="true">→</span></Link>
        <Link href="/controllo-sito" className="tt-btn tt-btn--secondary">Controlla il tuo sito gratis</Link>
      </p>
    </aside>
  );
}
