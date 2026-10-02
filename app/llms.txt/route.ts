import { getGuide, getSettori } from "@/lib/content";
import { absoluteUrl, site } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const settori = getSettori();
  const guide = getGuide();
  const body = `# ${site.name}

> ${site.name} offre una prova gratuita per le attività locali italiane: facciamo 20 domande reali, come le farebbero i loro clienti, a tre assistenti AI (ChatGPT, Gemini e Perplexity) e consegniamo una pagina con quante volte l'attività viene consigliata, quante volte vengono consigliati i concorrenti e perché.

Il sito non vende servizi: l'unica cosa che si può fare è richiedere la prova gratuita. Nessuno può garantire che un assistente AI consigli una certa attività, e ${site.name} non lo promette.

## Pagine principali

- [Home](${absoluteUrl("/")}): cosa chiedono i clienti all'AI e come funziona la prova gratuita
- [Prova gratuita](${absoluteUrl("/prova-gratuita")}): modulo di richiesta (nome, attività, settore, città, email, telefono)

## Settori

Per ogni settore: le domande specifiche che i clienti fanno agli assistenti AI.

${settori.map((s) => `- [${s.nome}](${absoluteUrl(`/settori/${s.slug}`)}): ${s.description}`).join("\n")}

## Guide

${guide.map((g) => `- [${g.h1}](${absoluteUrl(`/guide/${g.slug}`)}): ${g.rispostaBreve}`).join("\n")}
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
