import Link from "next/link";
import { AdMock } from "@/components/AdMock";
import { Container } from "@/components/Container";
import { Faq } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { LeadForm } from "@/components/LeadForm";
import { LinkList } from "@/components/LinkList";
import { QuestionMarquee } from "@/components/QuestionMarquee";
import { SectionLabel } from "@/components/SectionLabel";
import { Steps } from "@/components/Steps";
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

const h2 = "text-3xl font-semibold tracking-tight sm:text-5xl";

const servizi = [
  { t: "Strategia", d: "Capiamo cosa chiedono i tuoi clienti all'AI e in quali conversazioni ha senso esserci." },
  { t: "Account e configurazione", d: "Apriamo e configuriamo l'account pubblicitario, il tracciamento e il budget." },
  { t: "Annunci", d: "Scriviamo messaggi chiari e concreti, pensati per chi sta facendo una domanda precisa." },
  { t: "Pagina di destinazione", d: "Controlliamo che chi clicca trovi subito quello che cercava, e un modo semplice per contattarti." },
  { t: "Ottimizzazione", d: "Seguiamo la campagna, spostiamo il budget su ciò che rende e togliamo il resto." },
  { t: "Report chiari", d: "Ogni mese: quanto hai speso, cosa ti ha portato, cosa cambiamo. Senza gergo." },
];

export default function Home() {
  const settori = getSettori();
  const guide = getGuide().slice(0, 6);
  const domande = settori.flatMap((s) => s.domande.slice(0, 2));
  const alternate = [...domande.filter((_, i) => i % 2 === 0), ...domande.filter((_, i) => i % 2 === 1)];
  const locali = settori.filter((s) => !["e-commerce", "aziende-b2b"].includes(s.slug));
  const aziende = settori.filter((s) => ["e-commerce", "aziende-b2b"].includes(s.slug));

  return (
    <>
      <JsonLd data={[organization(), website(), service(), breadcrumbList([]), faqPage(faqHome)]} />

      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,#000_20%,transparent_70%)]" />
        <div aria-hidden="true" className="absolute left-1/2 top-[-20%] h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-16 px-4 pt-16 pb-24 sm:px-6 sm:pt-24 lg:grid-cols-[1.15fr_1fr] lg:gap-14 lg:pb-32">
          <div>
            <p className="label-mono inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-fg-soft">
              <span className="size-1.5 rounded-full bg-accent" /> Annunci su ChatGPT · Italia
            </p>
            <h1 className="mt-7 text-[2.7rem] font-semibold leading-[1.02] tracking-[-0.035em] sm:text-6xl lg:text-[3.9rem]">
              <span className="text-gradient">I tuoi clienti chiedono a ChatGPT.</span>{" "}
              <span className="text-accent">Fatti trovare con gli annunci.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-fg-soft">
              Dal 24 agosto 2026 ChatGPT mostra annunci sponsorizzati anche in Italia. Progettiamo e gestiamo le tue
              campagne, per attività locali e aziende: strategia, annunci, budget e report.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="#analisi" className="btn-accent">Richiedi l&apos;analisi gratuita <span aria-hidden="true">→</span></Link>
              <Link href="#come-funziona" className="btn-ghost">Come funziona</Link>
            </div>
            <p className="mt-6 text-sm text-fg-mute">Analisi gratuita e senza impegno. Se non fa per te, te lo diciamo.</p>
          </div>
          <AdMock />
        </div>
      </section>

      <section className="border-y border-line bg-surface/50 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionLabel n="01">Perché ora</SectionLabel>
          <h2 className={`mt-5 max-w-3xl ${h2}`}>Le persone non cercano più. Chiedono.</h2>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {[
              { t: "Domande con un'intenzione chiara", d: "Chi scrive a ChatGPT spesso sa già cosa vuole: un servizio, una zona, un'esigenza precisa. È il momento in cui sta decidendo." },
              { t: "Un canale nuovo in Italia", d: "Gli annunci su ChatGPT sono arrivati in Italia il 24 agosto 2026. Chi impara a usarli adesso parte prima degli altri." },
              { t: "Pertinenti alla conversazione", d: "Secondo OpenAI, in Europa all'inizio gli annunci non sono personalizzati sul profilo della persona: contano l'argomento e il contesto della domanda." },
            ].map((c) => (
              <div key={c.t} className="card p-6">
                <h3 className="text-lg font-semibold tracking-tight">{c.t}</h3>
                <p className="mt-3 leading-relaxed text-fg-soft">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-14">
          <QuestionMarquee domande={alternate} />
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          <SectionLabel n="02">Annuncio e risposta</SectionLabel>
          <h2 className={`mt-5 max-w-3xl ${h2}`}>Un annuncio non compra la risposta. Ti mette accanto.</h2>
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            <div className="card p-7">
              <p className="label-mono text-fg-mute">La risposta di ChatGPT</p>
              <p className="mt-4 leading-relaxed text-fg-soft">
                Dipende da quello che l&apos;AI trova e da come lo collega alla domanda. Non si compra e nessuno può garantire
                di comparire.
              </p>
            </div>
            <div className="card border-accent/40 p-7">
              <p className="label-mono text-accent">L&apos;annuncio sponsorizzato</p>
              <p className="mt-4 leading-relaxed text-fg-soft">
                È uno spazio a pagamento, separato e segnalato come sponsorizzato. Si decide dove comparire, con che messaggio
                e con quanto budget, e si misura cosa porta.
              </p>
            </div>
          </div>
          <p className="mt-6 text-fg-mute">
            Approfondisci:{" "}
            <Link href="/guide/consigliati-o-sponsorizzati-su-chatgpt" className="link-ul">
              essere consigliati o essere sponsorizzati su ChatGPT
            </Link>
            .
          </p>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          <SectionLabel n="03">Cosa facciamo</SectionLabel>
          <h2 className={`mt-5 max-w-3xl ${h2}`}>Pensiamo noi alla campagna. Tu pensi alla tua attività.</h2>
          <ul className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {servizi.map((s, i) => (
              <li key={s.t} className="bg-bg p-7">
                <span className="font-mono text-xs text-fg-mute">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-4 text-lg font-semibold tracking-tight">{s.t}</h3>
                <p className="mt-2 leading-relaxed text-fg-soft">{s.d}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section id="come-funziona" className="scroll-mt-20 py-20 sm:py-28">
        <Container>
          <SectionLabel n="04">Come funziona</SectionLabel>
          <h2 className={`mt-5 max-w-3xl ${h2}`}>Dall&apos;analisi gratuita alla campagna, in quattro passi.</h2>
          <div className="mt-12"><Steps /></div>
          <p className="mt-8 max-w-2xl text-fg-mute">
            Nessuno può garantire risultati con la pubblicità. Noi ti garantiamo trasparenza: sai sempre quanto spendi e cosa ti porta.
          </p>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          <SectionLabel n="05">Per chi</SectionLabel>
          <h2 className={`mt-5 max-w-3xl ${h2}`}>Per attività locali e per aziende.</h2>
          <div className="mt-12 grid gap-4 lg:grid-cols-2">
            <div className="card p-7">
              <h3 className="text-2xl font-semibold tracking-tight">Attività locali</h3>
              <p className="mt-3 text-fg-soft">Quando un cliente vale molto e lo cerca nella sua zona: studi medici, dentisti, hotel, noleggi, traslochi, artigiani.</p>
              <div className="mt-6"><LinkList items={locali.map((s) => ({ href: `/settori/${s.slug}`, label: s.nome }))} /></div>
            </div>
            <div className="card p-7">
              <h3 className="text-2xl font-semibold tracking-tight">Aziende ed e-commerce</h3>
              <p className="mt-3 text-fg-soft">Quando le persone chiedono all&apos;AI quale prodotto, servizio o fornitore scegliere.</p>
              <div className="mt-6"><LinkList items={aziende.map((s) => ({ href: `/settori/${s.slug}`, label: s.nome }))} /></div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
            <div>
              <SectionLabel n="06">Guide</SectionLabel>
              <h2 className={`mt-5 ${h2}`}>Capire l&apos;AI prima di investire.</h2>
              <p className="mt-6"><Link href="/guide" className="link-ul text-fg-soft">Tutte le guide →</Link></p>
            </div>
            <LinkList items={guide.map((g) => ({ href: `/guide/${g.slug}`, label: g.h1 }))} />
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container narrow>
          <SectionLabel n="07">Domande frequenti</SectionLabel>
          <h2 className={`mt-5 ${h2}`}>Le domande che ci fanno di più.</h2>
          <div className="mt-10"><Faq items={faqHome} /></div>
        </Container>
      </section>

      <section id="analisi" className="scroll-mt-20 py-12">
        <Container>
          <div className="card relative grid gap-10 overflow-hidden p-6 sm:p-10 lg:grid-cols-[1fr_1.4fr] lg:gap-14 lg:p-14">
            <div aria-hidden="true" className="absolute -left-32 -top-32 size-96 rounded-full bg-accent/10 blur-3xl" />
            <div className="relative">
              <SectionLabel>Analisi gratuita</SectionLabel>
              <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">Scopri se gli annunci su ChatGPT fanno per te.</h2>
              <p className="mt-5 text-fg-soft">Ti diciamo cosa chiedono i tuoi clienti all&apos;AI, se conviene esserci e con quale budget di partenza.</p>
              <ul className="mt-8 space-y-3 text-sm text-fg-soft">
                {["Gratis e senza impegno", "Risposta da una persona, non da un bot", "Se non ha senso per te, te lo diciamo"].map((x) => (
                  <li key={x} className="flex gap-3"><span className="text-accent">✓</span>{x}</li>
                ))}
              </ul>
            </div>
            <div className="relative"><LeadForm settori={settoreOptions()} headingLevel={3} /></div>
          </div>
        </Container>
      </section>
    </>
  );
}
