import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CtaBox } from "@/components/CtaBox";
import { FaqList } from "@/components/ds/FaqList";
import { SectionHead } from "@/components/ds/SectionHead";
import { JsonLd } from "@/components/JsonLd";
import { canali } from "@/lib/canali";
import type { Faq } from "@/lib/content";
import { faqPage } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "ChatGPT, Google, Meta o SEO: quale canale scegliere · TiTrovano",
  description:
    "Annunci su ChatGPT, Google Ads, Meta Ads o SEO: quando ha senso ciascun canale, i suoi limiti e come scegliere quello giusto per la tua attività. Analisi gratuita.",
  path: "/canali",
});

const faq: Faq[] = [
  {
    domanda: "Qual è il canale migliore?",
    risposta: "Non esiste un canale migliore per tutti. Dipende da cosa vendi, da quanto vale un cliente, da quanto in fretta ti servono richieste e dal budget. È quello che valutiamo nell'analisi gratuita.",
  },
  {
    domanda: "Si possono usare più canali insieme?",
    risposta: "Sì, e spesso conviene: per esempio Google per chi ti cerca subito e ChatGPT per chi fa domande prima di scegliere. Di solito però si parte da uno, si misura e poi si aggiunge il resto.",
  },
  {
    domanda: "Garantite risultati su qualche canale?",
    risposta: "No, su nessuno. Ti garantiamo trasparenza: sai sempre quanto spendi, cosa ti porta e cosa stiamo cambiando.",
  },
];

export default function CanaliPage() {
  return (
    <>
      <JsonLd data={faqPage(faq)} />
      <div className="tt-wrap tt-wrap--read tt-page-head">
        <Breadcrumbs items={[{ name: "Canali", path: "/canali" }]} />
        <div className="tt-stack-6">
          <p className="tt-eyebrow" style={{ margin: 0 }}>ChatGPT · Google · Meta · SEO</p>
          <h1 className="tt-display-xl">
            Quale canale pubblicitario <span className="tt-mark">fa per te?</span>
          </h1>
          <p className="tt-lead">
            Gli annunci su ChatGPT sono la nostra specialità, ma non sono sempre la scelta giusta. Ecco quando ha senso
            ciascun canale e quando no, spiegato senza gergo.
          </p>
        </div>
      </div>

      {canali.map((c, i) => (
        <section key={c.id} id={c.id} className={`tt-section${i % 2 === 0 ? " tt-section--sunk" : ""}`} style={{ scrollMarginTop: "var(--space-8)" }}>
          <div className="tt-wrap tt-wrap--read">
            <SectionHead n={String(i + 1).padStart(2, "0")} occhiello="Canale" testo={c.breve}>
              {c.nome}
            </SectionHead>
            <div className="tt-section-body tt-stack-8">
              <p className="tt-body">{c.cosa}</p>
              <div className="tt-card tt-stack-4">
                <h3 className="tt-subheading">Ha senso quando</h3>
                <ul className="tt-prose" style={{ paddingLeft: "var(--space-6)" }}>
                  {c.quando.map((q) => <li key={q}>{q}</li>)}
                </ul>
              </div>
              <div className="tt-stack-4">
                <h3 className="tt-subheading">Da sapere</h3>
                <ul className="tt-prose" style={{ paddingLeft: "var(--space-6)" }}>
                  {c.limiti.map((q) => <li key={q}>{q}</li>)}
                </ul>
              </div>
              {c.id === "chatgpt" && (
                <p className="tt-body">
                  Approfondisci: <Link href="/guide/consigliati-o-sponsorizzati-su-chatgpt">essere consigliati o essere sponsorizzati su ChatGPT</Link>.
                </p>
              )}
            </div>
          </div>
        </section>
      ))}

      <section className="tt-section">
        <div className="tt-wrap tt-wrap--read">
          <SectionHead n="05" occhiello="Come scegliamo">
            Partiamo da te, <span className="tt-mark">non dal canale.</span>
          </SectionHead>
          <div className="tt-section-body tt-stack-8">
            <ul className="tt-points">
              <li><h3>Quanto vale un cliente</h3><p>Più vale, più ha senso pagare per farsi trovare da chi ha già un bisogno preciso.</p></li>
              <li><h3>Come ti cercano</h3><p>Con domande a ChatGPT, con ricerche su Google, oppure ti scoprono sui social: ogni modo ha il suo canale.</p></li>
              <li><h3>Quanto in fretta ti servono richieste</h3><p>La pubblicità porta contatti da subito; la SEO lavora per i prossimi mesi.</p></li>
              <li><h3>Budget e regole del settore</h3><p>Alcuni canali hanno budget minimi o limiti per certi settori, come la sanità. Lo verifichiamo prima di proporti qualsiasi cosa.</p></li>
            </ul>
            <aside className="tt-callout">
              <span className="tt-tag">Importante</span>
              <h3>Nessun canale garantisce risultati</h3>
              <p>Ti proponiamo per iscritto canale, messaggi e budget di partenza. Poi misuriamo e decidiamo insieme se continuare.</p>
            </aside>
          </div>
        </div>
      </section>

      <section className="tt-section tt-section--sunk">
        <div className="tt-wrap tt-wrap--read tt-stack-8">
          <SectionHead n="06" occhiello="Domande frequenti">Prima che tu <span className="tt-mark">lo chieda</span></SectionHead>
          <FaqList items={faq} />
          <CtaBox titolo="Scopri quale canale fa per te" testo="Analisi gratuita in call: guardiamo il tuo caso e ti diciamo se conviene ChatGPT, Google, Meta o la SEO, e con quale budget di partenza." />
        </div>
      </section>
    </>
  );
}
