import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqList } from "@/components/ds/FaqList";
import { SectionHead } from "@/components/ds/SectionHead";
import { StepList } from "@/components/ds/StepList";
import { JsonLd } from "@/components/JsonLd";
import { LeadForm } from "@/components/LeadForm";
import { passi } from "@/components/Steps";
import { settoreOptions } from "@/lib/content";
import { faqAnalisi } from "@/lib/faq";
import { faqPage } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Analisi gratuita: annunci su ChatGPT · TiTrovano",
  description:
    "Scopri se gli annunci su ChatGPT hanno senso per la tua attività o azienda, o quale canale ne ha di più tra Google, Meta e SEO. Analisi gratuita in call.",
  path: "/analisi-gratuita",
});

export default function AnalisiPage() {
  return (
    <>
      <JsonLd data={faqPage(faqAnalisi)} />
      <div className="tt-wrap tt-wrap--read tt-page-head">
        <Breadcrumbs items={[{ name: "Analisi gratuita", path: "/analisi-gratuita" }]} />
        <div className="tt-stack-6">
          <p className="tt-eyebrow" style={{ margin: 0 }}>Gratis e senza impegno</p>
          <h1 className="tt-display-xl">
            Richiedi l&apos;<span className="tt-mark">analisi gratuita</span>
          </h1>
          <p className="tt-lead">
            Lasciaci i tuoi dati e ti chiamiamo per una breve call: vediamo cosa chiedono i tuoi clienti a ChatGPT, se gli
            annunci hanno senso per te e con quale budget di partenza. Se ChatGPT non fa per te, ti diciamo quale canale
            ha più senso: Google, Meta o SEO.
          </p>
        </div>
        <div className="tt-card" style={{ marginTop: "var(--space-12)" }}>
          <LeadForm settori={settoreOptions()} />
        </div>
      </div>

      <section className="tt-section tt-section--sunk">
        <div className="tt-wrap tt-wrap--read">
          <SectionHead n="01" occhiello="Dopo l'invio">Cosa succede <span className="tt-mark">dopo</span></SectionHead>
          <div className="tt-section-body"><StepList passi={passi} /></div>
        </div>
      </section>

      <section className="tt-section">
        <div className="tt-wrap tt-wrap--read">
          <SectionHead n="02" occhiello="Domande frequenti">Prima che tu <span className="tt-mark">lo chieda</span></SectionHead>
          <div className="tt-section-body"><FaqList items={faqAnalisi} /></div>
        </div>
      </section>
    </>
  );
}
