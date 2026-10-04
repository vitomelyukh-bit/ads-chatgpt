import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { attivaDaCheckout, type RichiestaScheda } from "@/lib/scheda-attivazione";
import { firmaRichiesta, leggiRichiesta } from "@/lib/scheda-token";
import { linkWhatsApp, scheda } from "@/lib/scheda";
import { pagamentiAttivi, stripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: { absolute: "Grazie · TiTrovano" }, robots: { index: false, follow: false } };

// Ritorno dalla cassa Stripe: verifica il pagamento e attiva il servizio.
export default async function Grazie({ searchParams }: { searchParams: Promise<{ session_id?: string; r?: string }> }) {
  const { session_id, r } = await searchParams;
  let richiesta: RichiestaScheda | null = null;
  if (session_id && pagamentiAttivi()) {
    const s = await stripe().checkout.sessions.retrieve(session_id).catch(() => null);
    if (s?.payment_status === "paid") {
      await attivaDaCheckout(s);
      const [row] = (await db()`select * from richieste_scheda where id = ${Number(s.metadata?.richiesta_id)}`) as RichiestaScheda[];
      richiesta = row ?? null;
    }
  } else if (leggiRichiesta(r)) {
    const [row] = (await db()`select * from richieste_scheda where id = ${leggiRichiesta(r)} and pagata`) as RichiestaScheda[];
    richiesta = row ?? null;
  }
  const wa = linkWhatsApp();

  return (
    <div className="tt-wrap tt-wrap--read tt-page-head tt-stack-8">
      {richiesta ? (
        <>
          <div className="tt-stack-4">
            <p className="tt-eyebrow" style={{ margin: 0 }}>{scheda.nome}</p>
            <h1 className="tt-display-lg">Fatto: <span className="tt-mark">la tua scheda è attiva</span></h1>
            <p className="tt-lead">Grazie {richiesta.nome}. Ti abbiamo mandato una email di conferma con il link per gestire o disdire l&apos;abbonamento.</p>
          </div>
          <ol className="tt-steps">
            <li><div><h2 className="tt-heading" style={{ fontSize: 28 }}>Ti scriviamo su WhatsApp</h2><p>Per avere l&apos;accesso alla tua scheda Google: ti guidiamo noi, bastano un paio di minuti.</p></div></li>
            <li><div><h2 className="tt-heading" style={{ fontSize: 28 }}>Aggiorniamo ogni settimana</h2><p>Post e risposte a tutte le recensioni, senza che tu debba fare niente.</p></div></li>
            {richiesta.card_nfc && <li><div><h2 className="tt-heading" style={{ fontSize: 28 }}>Ti spediamo la card</h2><p>Arriva già configurata. Ti avvisiamo quando parte.</p></div></li>}
          </ol>
          <div className="tt-actions">
            {wa && <a href={wa} className="tt-btn tt-btn--lg tt-btn--block-mobile">Scrivici su WhatsApp →</a>}
            <a href={`/scheda-google/gestisci?t=${firmaRichiesta(richiesta.id)}`} className="tt-btn tt-btn--secondary tt-btn--lg tt-btn--block-mobile">Gestisci l&apos;abbonamento</a>
          </div>
        </>
      ) : (
        <div className="tt-stack-6">
          <h1 className="tt-display-lg">Pagamento non trovato</h1>
          <p className="tt-lead">Non riusciamo a confermare il pagamento. Se hai pagato, scrivici: lo verifichiamo subito.</p>
          <div className="tt-actions">
            {wa && <a href={wa} className="tt-btn tt-btn--lg">Scrivici su WhatsApp →</a>}
            <Link href="/scheda-google#richiesta" className="tt-btn tt-btn--secondary tt-btn--lg">Torna al modulo</Link>
          </div>
        </div>
      )}
    </div>
  );
}
