import Link from "next/link";
import { notFound } from "next/navigation";
import { eliminaLanding, pubblicaLanding } from "@/actions/console";
import { LandingEditor } from "@/components/console/LandingEditor";
import { getCliente, type Creativita, type Landing } from "@/lib/clienti";
import { db } from "@/lib/db";

export default async function LandingAdmin({ params }: { params: Promise<{ id: string; landingId: string }> }) {
  const { id, landingId } = await params;
  const c = await getCliente(id);
  const [l] = (await db()`select * from landing where id=${landingId} and cliente_id=${id}`) as Landing[];
  if (!c || !l) notFound();
  const media = (await db()`select * from creativita where cliente_id=${id} and stato='approvata' order by creata_il desc`) as Creativita[];
  const url = `/l/${c.slug}/${l.slug}`;
  return (
    <div className="tt-stack-8">
      <nav aria-label="Percorso" className="tt-crumbs"><ol><li><Link href="/console">Clienti</Link> / </li><li><Link href={`/console/clienti/${id}`}>{c.nome}</Link> / </li><li>Landing</li></ol></nav>
      <h1 className="tt-display-lg">{l.titolo}</h1>
      <div className="tt-card tt-stack-4">
        <p className="tt-body"><span className="tt-tag">{l.pubblicata ? "Online" : "Bozza"}</span></p>
        {l.pubblicata && (
          <>
            <p className="tt-body"><a href={url} target="_blank" rel="noopener">titrovano.it{url} →</a></p>
            <p className="tt-small tt-muted">Negli annunci aggiungi i parametri UTM, per esempio: titrovano.it{url}?utm_source=meta&amp;utm_campaign=nome-campagna</p>
          </>
        )}
        {c.privacy_url ? (
          <form action={pubblicaLanding.bind(null, id, landingId, !l.pubblicata)}>
            <button className={l.pubblicata ? "tt-btn tt-btn--secondary" : "tt-btn"}>{l.pubblicata ? "Metti offline" : "Pubblica"}</button>
          </form>
        ) : (
          <p className="tt-body">Per pubblicare aggiungi il link all&apos;informativa privacy nei dati del cliente.</p>
        )}
      </div>
      <LandingEditor l={l} media={media} />
      <form action={eliminaLanding.bind(null, id, landingId)}><button className="tt-chip" style={{ color: "var(--danger)", borderColor: "var(--danger)" }}>Elimina questa landing</button></form>
    </div>
  );
}
