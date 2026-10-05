import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SceltaSpedizione } from "@/components/ordine/SceltaSpedizione";
import { ProdottoFoto } from "@/components/ProdottoFoto";
import { pageMetadata } from "@/lib/metadata";
import { EXTRA, euro, isTipoExtra } from "@/lib/scheda";

export const dynamicParams = false;
export function generateStaticParams() {
  return [{ tipo: "card" }, { tipo: "piedistallo" }];
}

export async function generateMetadata({ params }: PageProps<"/compra/[tipo]">) {
  const { tipo } = await params;
  if (!isTipoExtra(tipo)) return {};
  return { ...pageMetadata({ title: `Ordina il ${EXTRA[tipo].nome.toLowerCase()} per le recensioni · TiTrovano`, description: `${EXTRA[tipo].nome} con NFC per le recensioni Google: ${euro(EXTRA[tipo].prezzo)}. Scegli il corriere e il punto di ritiro.`, path: `/compra/${tipo}` }), robots: { index: false, follow: true } };
}

// Ordine di card o piedistallo: prodotto, scelta della spedizione (come su Vinted), pagamento.
export default async function Compra({ params }: PageProps<"/compra/[tipo]">) {
  const { tipo } = await params;
  if (!isTipoExtra(tipo)) notFound();
  const x = EXTRA[tipo];
  return (
    <div className="tt-wrap tt-page-head">
      <Breadcrumbs items={[{ name: `Ordina il ${x.nome.toLowerCase()}`, path: `/compra/${tipo}` }]} />
      <div className="tt-compra">
        <div className="tt-compra__prod">
          <ProdottoFoto tipo={tipo} />
          <h1 className="tt-display-lg" style={{ margin: 0 }}>{x.nome}</h1>
          <p className="tt-product__price" style={{ margin: 0 }}>{euro(x.prezzo)} <small>una volta sola + spedizione</small></p>
          <p className="tt-body" style={{ margin: 0 }}>{x.descrizione}</p>
          <p className="tt-muted" style={{ margin: 0 }}>{x.misure}</p>
          <p className="tt-muted" style={{ margin: 0 }}>Arriva già collegato alla pagina delle recensioni della tua attività.</p>
        </div>
        <div className="tt-compra__sped">
          <h2 className="tt-heading" style={{ margin: "0 0 var(--space-4)" }}>Spedizione</h2>
          <SceltaSpedizione tipo={tipo} prezzo={x.prezzo} />
        </div>
      </div>
    </div>
  );
}
