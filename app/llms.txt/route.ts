import { getGuide, getSettori } from "@/lib/content";
import { absoluteUrl, site } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const settori = getSettori();
  const guide = getGuide();
  const body = `# ${site.name}

> ${site.name} progetta e gestisce annunci su ChatGPT per attività locali e aziende italiane: strategia, configurazione dell'account, annunci, pagina di destinazione, ottimizzazione del budget e report mensili. Si parte da un'analisi gratuita.

Gli annunci su ChatGPT sono in Italia dal 24 agosto 2026. Secondo OpenAI sono mostrati separati dalle risposte, segnalati come sponsorizzati, e non influenzano ciò che ChatGPT risponde. ${site.name} non garantisce risultati: misura la spesa e i risultati e li riporta con trasparenza. ${site.name} è indipendente e non è affiliato a OpenAI.

## Pagine principali

- [Home](${absoluteUrl("/")}): cosa sono gli annunci su ChatGPT, cosa fa ${site.name} e come funziona
- [Analisi gratuita](${absoluteUrl("/analisi-gratuita")}): richiesta di valutazione gratuita (attività, sito, settore, budget indicativo, contatti)

## Settori

Per ogni settore: le domande che i clienti fanno a ChatGPT e quando gli annunci hanno senso.

${settori.map((s) => `- [${s.nome}](${absoluteUrl(`/settori/${s.slug}`)}): ${s.description}`).join("\n")}

## Guide

${guide.map((g) => `- [${g.h1}](${absoluteUrl(`/guide/${g.slug}`)}): ${g.rispostaBreve}`).join("\n")}
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
