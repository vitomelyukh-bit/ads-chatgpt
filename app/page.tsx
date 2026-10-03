import Link from "next/link";
import { AiAnswerMock } from "@/components/AiAnswerMock";
import { Container } from "@/components/Container";
import { Faq } from "@/components/Faq";
import { HowItWorks } from "@/components/HowItWorks";
import { JsonLd } from "@/components/JsonLd";
import { LinkList } from "@/components/LinkList";
import { QuestionMarquee } from "@/components/QuestionMarquee";
import { ReportPreview } from "@/components/ReportPreview";
import { SectionLabel } from "@/components/SectionLabel";
import { TrialForm } from "@/components/TrialForm";
import { getGuide, getSettori, settoreOptions } from "@/lib/content";
import { faqHome } from "@/lib/faq";
import { breadcrumbList, faqPage, organization, website } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "TiTrovano: l'AI consiglia la tua attività? Scoprilo gratis",
  description:
    "I clienti chiedono a ChatGPT, Gemini e Perplexity a chi rivolgersi. L'AI risponde con due o tre nomi. Scopri gratis se c'è anche il tuo.",
  path: "/",
});

export default function Home() {
  const settori = getSettori();
  const guide = getGuide().slice(0, 6);
  // Domande vere prese dai settori: due per settore, alternate.
  const domande = settori.flatMap((s) => s.domande.slice(0, 2));
  const alternate = [...domande.filter((_, i) => i % 2 === 0), ...domande.filter((_, i) => i % 2 === 1)];

  return (
    <>
      <JsonLd data={[organization(), website(), breadcrumbList([]), faqPage(faqHome)]} />

      {/* Apertura */}
      <section className="overflow-hidden">
        <Container className="grid items-center gap-16 pt-8 pb-20 sm:pt-14 lg:grid-cols-[1.15fr_1fr] lg:gap-12 lg:pb-28">
          <div>
            <p className="label-mono flex flex-wrap items-center gap-x-3 gap-y-1 text-ink-mute">
              <span className="inline-block size-2 rounded-full bg-ink" aria-hidden="true" />
              Prova gratuita <span aria-hidden="true">/</span> ChatGPT · Gemini · Perplexity
            </p>
            <h1 className="mt-6 font-serif text-[3.1rem] leading-[0.98] tracking-tight text-ink sm:text-7xl lg:text-[5.4rem]">
              Quando un cliente chiede all&apos;AI, esce <em className="hl whitespace-nowrap">il tuo nome</em>?
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink-soft sm:text-xl">
              Oggi i clienti chiedono a ChatGPT, Gemini e Perplexity a chi rivolgersi. L&apos;AI non risponde con una
              pagina di risultati: risponde con <strong className="font-semibold text-ink">due o tre nomi</strong>.
              Scopri gratis se il tuo c&apos;è.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link href="#prova" className="btn-ink text-base">
                Richiedi la prova gratuita <span aria-hidden="true">→</span>
              </Link>
              <Link href="#come-funziona" className="link-ul px-1 py-2 text-center font-medium text-ink">
                Come funziona
              </Link>
            </div>
          </div>
          <div className="pb-6 lg:pb-0">
            <AiAnswerMock />
          </div>
        </Container>
      </section>

      {/* 01 · Domande */}
      <section className="border-y border-ink/15 bg-paper-alt/60 py-16 sm:py-20">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr] lg:items-end">
            <div>
              <SectionLabel n="01">Le domande</SectionLabel>
              <h2 className="mt-4 font-serif text-4xl leading-[1.05] tracking-tight sm:text-5xl">
                I clienti non scrivono più due parole. Fanno domande intere.
              </h2>
            </div>
            <p className="text-lg text-ink-soft lg:pb-2">
              Con la città, i dubbi, le preferenze. E l&apos;AI risponde con dei nomi. Queste sono domande come quelle che
              facciamo nella prova.
            </p>
          </div>
        </Container>
        <div className="mt-12">
          <QuestionMarquee domande={alternate} />
        </div>
        <Container>
          <p className="mt-10">
            <Link href="/settori" className="link-ul font-medium text-ink">
              Guarda le domande del tuo settore →
            </Link>
          </p>
        </Container>
      </section>

      {/* 02 · Perché conta */}
      <section className="bg-ink py-20 text-paper sm:py-28">
        <Container>
          <SectionLabel n="02" inverse>
            Perché conta
          </SectionLabel>
          <h2 className="mt-5 max-w-3xl font-serif text-4xl leading-[1.05] tracking-tight sm:text-6xl">
            Google ti dava una pagina. L&apos;AI dà <em className="whitespace-nowrap text-accent">tre nomi</em>.
          </h2>
          <div className="mt-14 grid gap-10 lg:grid-cols-2">
            <div className="rounded-2xl border border-paper/15 p-6 sm:p-8">
              <p className="label-mono text-paper/60">Ricerca classica</p>
              <ol className="mt-6 space-y-3" aria-label="Una lista di risultati">
                {Array.from({ length: 8 }).map((_, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="w-5 font-mono text-xs text-paper/50">{i + 1}</span>
                    <span
                      className={`block h-2.5 rounded-full ${i === 4 ? "w-3/5 bg-accent" : "bg-paper/20"}`}
                      style={i === 4 ? undefined : { width: `${80 - ((i * 13) % 35)}%` }}
                    />
                    {i === 4 && <span className="label-mono text-accent">tu, quinto</span>}
                  </li>
                ))}
              </ol>
              <p className="mt-6 text-paper/75">Se sei quinto, qualcuno scorre e ti trova lo stesso.</p>
            </div>
            <div className="rounded-2xl border border-accent/60 p-6 sm:p-8">
              <p className="label-mono text-accent">Risposta dell&apos;AI</p>
              <ol className="mt-6 space-y-4" aria-label="Tre nomi consigliati">
                {["w-44", "w-32", "w-40"].map((w, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="w-5 font-mono text-xs text-paper/50">{i + 1}</span>
                    <span className={`redact ${w} !bg-paper`} />
                  </li>
                ))}
                <li className="flex items-center gap-3">
                  <span className="w-5 font-mono text-xs text-paper/50">—</span>
                  <span className="flex h-8 w-44 items-center justify-center rounded border border-dashed border-accent/80 font-serif text-lg italic text-accent">
                    tu?
                  </span>
                </li>
              </ol>
              <p className="mt-6 text-paper/75">
                Chi è tra i nomi riceve la telefonata. Chi non c&apos;è, per quel cliente, non esiste. E nessuno ti avvisa.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 03 · Come funziona */}
      <section id="come-funziona" className="scroll-mt-8 py-20 sm:py-28">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <SectionLabel n="03">Come funziona</SectionLabel>
              <h2 className="mt-4 font-serif text-4xl leading-[1.05] tracking-tight sm:text-5xl">
                La prova gratuita, in tre passi. Tu fai solo il primo.
              </h2>
              <p className="mt-6 max-w-xl text-lg text-ink-soft">
                Alla fine ricevi una pagina come questa, con i dati veri della tua attività.
              </p>
              <p className="mt-4 max-w-xl text-ink-soft">
                Una cosa chiara fin da subito: <strong className="text-ink">nessuno può garantire</strong> che
                l&apos;AI consigli la tua attività. La prova ti mostra come stanno le cose oggi, con domande vere.
              </p>
            </div>
            <ReportPreview />
          </div>
          <div className="mt-16">
            <HowItWorks />
          </div>
        </Container>
      </section>

      {/* 04 · Settori */}
      <section className="border-t border-ink/15 py-20 sm:py-24">
        <Container>
          <SectionLabel n="04">Settori</SectionLabel>
          <h2 className="mt-4 max-w-3xl font-serif text-4xl leading-[1.05] tracking-tight sm:text-5xl">
            Cosa chiedono all&apos;AI i clienti del tuo settore
          </h2>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {settori.map((s, i) => (
              <li key={s.slug}>
                <Link
                  href={`/settori/${s.slug}`}
                  className="group flex h-full flex-col justify-between gap-6 rounded-2xl border border-ink/15 bg-card p-5 transition hover:-translate-y-0.5 hover:border-ink hover:shadow-[4px_4px_0_var(--color-ink)]"
                >
                  <span className="font-mono text-xs text-ink-mute">{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <span className="block font-serif text-2xl leading-tight text-ink">{s.nome}</span>
                    <span className="mt-2 line-clamp-3 block text-sm text-ink-soft">“{s.domande[0].testo}”</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* 05 · Guide */}
      <section className="py-20 sm:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
            <div>
              <SectionLabel n="05">Guide</SectionLabel>
              <h2 className="mt-4 font-serif text-4xl leading-[1.05] tracking-tight sm:text-5xl">
                Per capire come ragiona l&apos;AI
              </h2>
              <p className="mt-6">
                <Link href="/guide" className="link-ul font-medium text-ink">Tutte le guide →</Link>
              </p>
            </div>
            <LinkList items={guide.map((g) => ({ href: `/guide/${g.slug}`, label: g.h1 }))} />
          </div>
        </Container>
      </section>

      {/* 06 · FAQ */}
      <section className="py-20 sm:py-24">
        <Container narrow>
          <SectionLabel n="06">Domande frequenti</SectionLabel>
          <h2 className="mt-4 font-serif text-4xl leading-[1.05] tracking-tight sm:text-5xl">Prima che tu lo chieda</h2>
          <div className="mt-10">
            <Faq items={faqHome} />
          </div>
        </Container>
      </section>

      {/* Form */}
      <section id="prova" className="scroll-mt-8 py-12 sm:py-16">
        <Container>
          <div className="grid gap-10 rounded-[2rem] border-2 border-ink bg-card p-6 shadow-[8px_8px_0_var(--color-ink)] sm:p-10 lg:grid-cols-[1fr_1.4fr] lg:gap-14 lg:p-14">
            <div>
              <SectionLabel>Prova gratuita</SectionLabel>
              <h2 className="mt-4 font-serif text-4xl leading-[1.05] tracking-tight sm:text-5xl">
                Scopri se <span className="hl">esce il tuo nome.</span>
              </h2>
              <p className="mt-6 text-lg text-ink-soft">
                Lasciaci i dati della tua attività. Facciamo le domande e ti ricontattiamo noi.
              </p>
              <ul className="mt-8 space-y-2 font-mono text-sm text-ink-soft">
                <li>→ 20 domande vere</li>
                <li>→ ChatGPT, Gemini e Perplexity</li>
                <li>→ gratis e senza impegno</li>
              </ul>
            </div>
            <TrialForm settori={settoreOptions()} headingLevel={3} />
          </div>
        </Container>
      </section>
    </>
  );
}
