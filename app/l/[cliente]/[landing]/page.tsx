import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import { LandingForm } from "@/components/console/LandingForm";
import { getLandingPubblica } from "@/lib/clienti";
import "./landing.css";

export const dynamic = "force-dynamic";

type P = { params: Promise<{ cliente: string; landing: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { cliente, landing } = await params;
  const l = await getLandingPubblica(cliente, landing);
  if (!l) return { robots: { index: false } };
  return {
    title: { absolute: `${l.titolo} · ${l.cliente.nome}` },
    description: l.sottotitolo ?? undefined,
    robots: { index: false, follow: false },
    openGraph: { title: l.titolo, description: l.sottotitolo ?? undefined, images: l.media_tipo === "immagine" && l.media_url ? [l.media_url] : [] },
  };
}

export default async function LandingPage({ params }: P) {
  const { cliente, landing } = await params;
  const l = await getLandingPubblica(cliente, landing);
  if (!l || !l.cliente.privacy_url) notFound();
  const c = l.cliente;
  return (
    <div className="lp" style={{ ["--lp-accent" as string]: c.colore }}>
      {c.meta_pixel_id && (
        <Script id="meta-pixel" strategy="afterInteractive">{`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${c.meta_pixel_id}');fbq('track','PageView');`}</Script>
      )}
      <header className="lp-head">
        {c.logo_url ? <img src={c.logo_url} alt={c.nome} height={40} /> : <strong>{c.nome}</strong>}
        {c.telefono && <a href={`tel:${c.telefono.replace(/\s/g, "")}`} className="lp-tel">{c.telefono}</a>}
      </header>
      <main id="contenuto">
        <section className="lp-hero">
          <div>
            <h1>{l.titolo}</h1>
            {l.sottotitolo && <p className="lp-sub">{l.sottotitolo}</p>}
            <a href="#contatto" className="lp-btn">{l.cta}</a>
          </div>
          {l.media_url && (l.media_tipo === "video"
            ? <video src={l.media_url} controls playsInline preload="metadata" className="lp-media" />
            : <img src={l.media_url} alt="" className="lp-media" />)}
        </section>
        {l.punti.length > 0 && (
          <section className="lp-sec"><ul className="lp-punti">{l.punti.map((p) => <li key={p}>{p}</li>)}</ul></section>
        )}
        {l.chi_siamo && <section className="lp-sec"><h2>Chi siamo</h2><p className="lp-p">{l.chi_siamo}</p></section>}
        {l.faq.length > 0 && (
          <section className="lp-sec"><h2>Domande frequenti</h2>
            {l.faq.map((f, i) => <details key={i} open={i === 0}><summary>{f.domanda}</summary><p>{f.risposta}</p></details>)}
          </section>
        )}
        <section id="contatto" className="lp-sec lp-contatto">
          <h2>{l.cta}</h2>
          <LandingForm landingId={l.id} cta={l.cta} domanda={l.domanda_form} nomeCliente={c.nome} privacyUrl={c.privacy_url!} />
        </section>
      </main>
      <footer className="lp-foot">
        <p>{c.nome}{c.citta ? ` · ${c.citta}` : ""} · <a href={c.privacy_url!} target="_blank" rel="noopener">Privacy</a></p>
      </footer>
    </div>
  );
}
