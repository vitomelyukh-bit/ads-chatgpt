import type { Metadata } from "next";
import Link from "next/link";
import { registraOrdineBanco } from "@/lib/banco";
import { EXTRA, isTipoExtra, linkWhatsApp } from "@/lib/scheda";
import { stripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: { absolute: "Ordine ricevuto · TiTrovano" }, robots: { index: false, follow: false } };

// Ritorno dalla cassa per card e piedistallo comprati da soli.
export default async function GrazieAcquisto({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams;
  const s = session_id && process.env.STRIPE_SECRET_KEY ? await stripe().checkout.sessions.retrieve(session_id).catch(() => null) : null;
  const ok = s?.payment_status === "paid" && s.metadata?.ordine === "banco" && isTipoExtra(s.metadata?.tipo);
  if (ok) await registraOrdineBanco(s);
  const wa = linkWhatsApp();
  const nome = ok ? EXTRA[s.metadata!.tipo as "card" | "piedistallo"].nome.toLowerCase() : "";
  return (
    <div className="tt-wrap tt-wrap--read tt-page-head tt-stack-8">
      {ok ? (
        <div className="tt-stack-6">
          <h1 className="tt-display-lg">Fatto: <span className="tt-mark">ordine ricevuto</span></h1>
          <p className="tt-lead">Prepariamo il tuo {nome}, lo colleghiamo alla pagina delle recensioni della tua attività e te lo spediamo. Ti abbiamo mandato una email di conferma.</p>
          <div className="tt-actions">
            <Link href="/" className="tt-btn">Più clienti anche da Google Maps →</Link>
            {wa && <a href={wa} className="tt-btn tt-btn--secondary">Scrivici su WhatsApp</a>}
          </div>
        </div>
      ) : (
        <div className="tt-stack-6">
          <h1 className="tt-display-lg">Pagamento non trovato</h1>
          <p className="tt-lead">Se hai pagato, scrivici: lo verifichiamo subito.</p>
          {wa && <a href={wa} className="tt-btn">Scrivici su WhatsApp →</a>}
        </div>
      )}
    </div>
  );
}
