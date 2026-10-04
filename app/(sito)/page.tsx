import Link from "next/link";
import { ChatAd } from "@/components/ds/ChatAd";
import { FaqList } from "@/components/ds/FaqList";
import { LinkCards } from "@/components/ds/LinkCards";
import { SectionHead } from "@/components/ds/SectionHead";
import { StepList } from "@/components/ds/StepList";
import { JsonLd } from "@/components/JsonLd";
import { LeadForm } from "@/components/LeadForm";
import { passi } from "@/components/Steps";
import { canali } from "@/lib/canali";
import { getGuide, getSettori, settoreOptions } from "@/lib/content";
import { faqHome } from "@/lib/faq";
import { breadcrumbList, faqPage, organization, service, website } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Annunci su ChatGPT per attività e aziende · TiTrovano",
  description:
    "I tuoi clienti chiedono a ChatGPT. Progettiamo e gestiamo i tuoi annunci su ChatGPT: strategia, campagne, ottimizzazione e report. Richiedi l'analisi gratuita.",
  path: "/",
});

const servizi = [
  { titolo: "Strategia", testo: "Capiamo cosa chiedono i tuoi clienti all'AI e in quali conversazioni ha senso esserci." },
  { titolo: "Account e configurazione", testo: "Apriamo e configuriamo l'account pubblicitario, il tracciamento e il budget." },
  { titolo: "Annunci", testo: "Scriviamo messaggi chiari e concreti, pensati per chi sta facendo una domanda precisa." },
  { titolo: "Pagina di destinazione", testo: "Controlliamo che chi clicca trovi subito quello che cercava, e un modo semplice per contattarti." },
  { titolo: "Ottimizzazione", testo: "Seguiamo la campagna, spostiamo il budget su ciò che rende e togliamo il resto." },
  { titolo: "Report chiari", testo: "Ogni mese: quanto hai speso, cosa ti ha portato, cosa cambiamo. Senza gergo." },
];

const motivi = [
  { titolo: "Domande con un'intenzione chiara", testo: "Chi scrive a ChatGPT spesso sa già cosa vuole: un servizio, una zona, un'esigenza precisa. È il momento in cui sta decidendo." },
  { titolo: "Un canale nuovo in Italia", testo: "Gli annunci su ChatGPT sono arrivati in Italia il 24 agosto 2026. Chi impara a usarli adesso parte prima degli altri." },
  { titolo: "Pertinenti alla conversazione", testo: "Secondo OpenAI, in Europa all'inizio gli annunci non sono personalizzati sul profilo della persona: contano l'argomento e il contesto della domanda." },
];

export default function Home() {
  const settori = getSettori();
  const guide = getGuide().slice(0, 6);
  const domande = settori.flatMap((s) => s.domande.slice(0, 2));
  const alternate = [...domande.filter((_, i) => i % 2 === 0), ...domande.filter((_, i) => i % 2 === 1)];
  const locali = settori.filter((s) => s.tipo === "locale");
  const aziende = settori.filter((s) => s.tipo === "azienda");
  const bolla = (d: { testo: string; lingua?: "it" | "en" }, i: number) => (
    <li key={i}>
      <p className="tt-bubble tt-bubble--user" lang={d.lingua === "en" ? "en" : undefined}>{d.testo}</p>
    </li>
  );

  return (
    <>
      <JsonLd data={[organization(), website(), service(), breadcrumbList([]), faqPage(faqHome)]} />

      <section className="tt-section">
        <div className="tt-wrap tt-hero">
          <div className="tt-stack-6">
            <p className="tt-eyebrow" style={{ margin: 0 }}>Annunci su ChatGPT · Italia</p>
            <h1 className="tt-display-xl">
              I tuoi clienti chiedono a ChatGPT. <span className="tt-mark">Fatti trovare</span> con gli annunci.
            </h1>
            <p className="tt-lead">
              Dal 24 agosto 2026 ChatGPT mostra annunci sponsorizzati anche in Italia. Progettiamo e gestiamo le tue
              campagne, per attività locali e aziende: strategia, annunci, budget e report.
            </p>
            <div className="tt-actions">
              <Link href="#analisi" className="tt-btn tt-btn--lg">Richiedi l&apos;analisi gratuita <span aria-hidden="true">→</span></Link>
              <Link href="#come-funziona" className="tt-btn tt-btn--secondary tt-btn--lg">Come funziona</Link>
            </div>
            <p className="tt-small tt-muted">L&apos;analisi gratuita è una breve call, senza impegno. Se non fa per te, te lo diciamo.</p>
          </div>
          <ChatAd
            domanda="Mi consigli un buon dentista a Bologna per un impianto?"
            inserzionista="La tua attività"
            descrizione="Prima visita e piano di cura chiaro. Prenota online."
          />
        </div>
      </section>

      <section className="tt-section tt-section--sunk">
        <div className="tt-wrap tt-wrap--read">
          <SectionHead n="01" occhiello="Perché ora">
            Le persone non cercano più. <span className="tt-mark">Chiedono.</span>
          </SectionHead>
          <div className="tt-section-body">
            <ul className="tt-points">
              {motivi.map((m) => (
                <li key={m.titolo}><h3>{m.titolo}</h3><p>{m.testo}</p></li>
              ))}
            </ul>
          </div>
          <div className="tt-section-body" aria-label="Domande che i clienti fanno all'AI">
            <ul className="tt-questions">{alternate.slice(0, 6).map(bolla)}</ul>
            <details className="tt-more" style={{ marginTop: "var(--space-4)" }}>
              <summary className="tt-btn tt-btn--secondary">Altre domande dei clienti</summary>
              <ul className="tt-questions" style={{ marginTop: "var(--space-4)" }}>{alternate.slice(6).map(bolla)}</ul>
            </details>
          </div>
        </div>
      </section>

      <section className="tt-section">
        <div className="tt-wrap tt-wrap--read">
          <SectionHead n="02" occhiello="Annuncio e risposta">
            Un annuncio non compra la risposta. <span className="tt-mark">Ti mette accanto.</span>
          </SectionHead>
          <div className="tt-section-body tt-stack-6" style={{ maxWidth: "var(--measure)" }}>
            <div className="tt-card tt-stack-2">
              <p className="tt-label">La risposta di ChatGPT</p>
              <p className="tt-body">
                Dipende da quello che l&apos;AI trova e da come lo collega alla domanda. Non si compra e nessuno può garantire
                di comparire.
              </p>
            </div>
            <div className="tt-card tt-stack-2">
              <span className="tt-tag">L&apos;annuncio sponsorizzato</span>
              <p className="tt-body">
                È uno spazio a pagamento, separato e segnalato come sponsorizzato. Si decide dove comparire, con che messaggio
                e con quanto budget, e si misura cosa porta.
              </p>
            </div>
            <p className="tt-body">
              Approfondisci:{" "}
              <Link href="/guide/consigliati-o-sponsorizzati-su-chatgpt">essere consigliati o essere sponsorizzati su ChatGPT</Link>.
            </p>
          </div>
        </div>
      </section>

      <section className="tt-section tt-section--sunk">
        <div className="tt-wrap tt-wrap--read">
          <SectionHead n="03" occhiello="Cosa facciamo">
            Pensiamo noi alla campagna. <span className="tt-mark">Tu pensi alla tua attività.</span>
          </SectionHead>
          <div className="tt-section-body"><StepList passi={servizi} /></div>
        </div>
      </section>

      <section id="come-funziona" className="tt-section" style={{ scrollMarginTop: "var(--space-8)" }}>
        <div className="tt-wrap tt-wrap--read">
          <SectionHead n="04" occhiello="Come funziona">
            Dall&apos;analisi gratuita alla campagna, <span className="tt-mark">in quattro passi.</span>
          </SectionHead>
          <div className="tt-section-body tt-stack-8">
            <StepList passi={passi} />
            <p className="tt-body tt-muted">
              Nessuno può garantire risultati con la pubblicità. Noi ti garantiamo trasparenza: sai sempre quanto spendi e cosa ti porta.
            </p>
          </div>
        </div>
      </section>

      <section className="tt-section">
        <div className="tt-wrap tt-wrap--read">
          <SectionHead
            n="05"
            occhiello="Non solo ChatGPT"
            testo="ChatGPT è la nostra specialità, ma non sempre è la scelta migliore. Nell'analisi gratuita valutiamo anche gli altri canali e ti proponiamo quello che ha più senso per te."
          >
            Se ChatGPT non fa per te, <span className="tt-mark">troviamo il canale giusto.</span>
          </SectionHead>
          <div className="tt-section-body tt-stack-6">
            <LinkCards items={canali.map((c) => ({ href: `/canali#${c.id}`, label: c.nome, sub: c.breve }))} />
            <p className="tt-body"><Link href="/canali">Quale canale fa per te? →</Link></p>
          </div>
        </div>
      </section>

      <section className="tt-section tt-section--sunk">
        <div className="tt-wrap tt-wrap--read">
          <SectionHead
            n="06"
            occhiello="Scheda Google sempre viva"
            testo="Per ristoranti, bar, negozi, artigiani e studi: post ogni settimana sulla tua scheda Google Maps, risposta a tutte le recensioni e QR per chiederne di nuove."
          >
            La tua scheda Google, <span className="tt-mark">aggiornata ogni settimana.</span>
          </SectionHead>
          <div className="tt-section-body">
            <LinkCards items={[{ href: "/scheda-google", label: "Scheda Google sempre viva", sub: "59 €/mese, nessun costo di attivazione, disdici quando vuoi" }]} />
          </div>
        </div>
      </section>

      <section className="tt-section">
        <div className="tt-wrap">
          <SectionHead n="07" occhiello="Per chi">
            Per attività locali e <span className="tt-mark">per aziende.</span>
          </SectionHead>
          <div className="tt-section-body tt-two">
            <div className="tt-stack-4">
              <h3 className="tt-subheading">Attività locali</h3>
              <p className="tt-body tt-muted">Quando un cliente vale molto e lo cerca nella sua zona: studi professionali, immobiliari, imprese edili, hotel, noleggi, location, artigiani.</p>
              <LinkCards items={locali.map((s) => ({ href: `/settori/${s.slug}`, label: s.nome }))} />
            </div>
            <div className="tt-stack-4">
              <h3 className="tt-subheading">Aziende ed e-commerce</h3>
              <p className="tt-body tt-muted">Quando le persone chiedono all&apos;AI quale prodotto, servizio o fornitore scegliere.</p>
              <LinkCards items={aziende.map((s) => ({ href: `/settori/${s.slug}`, label: s.nome }))} />
            </div>
          </div>
        </div>
      </section>

      <section className="tt-section">
        <div className="tt-wrap tt-wrap--read">
          <SectionHead n="08" occhiello="Guide">
            Capire l&apos;AI <span className="tt-mark">prima di investire.</span>
          </SectionHead>
          <div className="tt-section-body tt-stack-6" style={{ maxWidth: "var(--measure)" }}>
            <LinkCards items={guide.map((g) => ({ href: `/guide/${g.slug}`, label: g.h1 }))} />
            <p className="tt-body"><Link href="/guide">Tutte le guide →</Link></p>
          </div>
        </div>
      </section>

      <section className="tt-section tt-section--sunk">
        <div className="tt-wrap tt-wrap--read">
          <SectionHead n="09" occhiello="Domande frequenti">
            Le domande che ci fanno <span className="tt-mark">di più.</span>
          </SectionHead>
          <div className="tt-section-body"><FaqList items={faqHome} /></div>
        </div>
      </section>

      <section id="analisi" className="tt-section" style={{ scrollMarginTop: "var(--space-8)" }}>
        <div className="tt-wrap tt-wrap--read">
          <SectionHead
            occhiello="Analisi gratuita"
            testo={<>Lasciaci i tuoi dati: ti chiamiamo per una breve call in cui vediamo cosa chiedono i tuoi clienti all&apos;AI, se conviene esserci, quale canale ha più senso per te e con quale budget di partenza.</>}
          >
            Scopri se gli annunci su ChatGPT <span className="tt-mark">fanno per te.</span>
          </SectionHead>
          <ul className="tt-stack-2 tt-body" style={{ listStyle: "none", padding: 0, marginTop: "var(--space-8)" }}>
            {["Gratis e senza impegno", "Una call con una persona, non un bot", "Se non ha senso per te, te lo diciamo"].map((x) => (
              <li key={x}>✓ {x}</li>
            ))}
          </ul>
          <div className="tt-card tt-section-body" style={{ maxWidth: "var(--measure)" }}>
            <LeadForm settori={settoreOptions()} headingLevel={3} />
          </div>
        </div>
      </section>
    </>
  );
}
