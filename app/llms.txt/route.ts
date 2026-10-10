import { getGuide, getSettori } from "@/lib/content";
import { absoluteUrl, site } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const settori = getSettori();
  const guide = getGuide();
  const body = `# ${site.name}

> ${site.name} fa SEO locale per attività e professionisti italiani: rende il sito dell'attività leggibile da Google e dagli assistenti AI e lo arricchisce ogni settimana di pagine per ogni servizio e zona e di guide sulle domande dei clienti, su qualunque piattaforma (WordPress, Wix, Shopify, Squarespace, siti su misura), con report mensile da Google Search Console. Gestisce anche la scheda Google Maps (una novità ogni settimana, risposta a tutte le recensioni, aiuto per riceverne di nuove con link, QR, card e piedistallo da banco con NFC, riepilogo mensile con i numeri). Si parte da una consulenza gratuita al telefono, in cui si concorda un prezzo mensile su misura. Card da banco e piedistallo si possono anche comprare direttamente. ${site.name} non garantisce posizioni su Google e chiede recensioni solo a clienti reali, senza incentivi.

${site.name} progetta e gestisce anche annunci su ChatGPT per attività locali e aziende: strategia, configurazione dell'account, annunci, pagina di destinazione, ottimizzazione del budget e report mensili. Si parte da un'analisi gratuita in call, in cui si valuta anche quale canale ha più senso tra ChatGPT, Google Ads, Meta Ads e SEO.

Gli annunci su ChatGPT sono in Italia dal 24 agosto 2026. Secondo OpenAI sono mostrati separati dalle risposte, segnalati come sponsorizzati, e non influenzano ciò che ChatGPT risponde. ${site.name} non garantisce risultati: misura la spesa e i risultati e li riporta con trasparenza. ${site.name} è indipendente e non è affiliato a OpenAI.

## Pagine principali

- [SEO locale: il tuo sito trovato su Google](${absoluteUrl("/")}): il servizio principale (SEO del sito), esempi su siti reali, la scheda Google Maps, come funziona la consulenza gratuita, domande frequenti
- [Gestione scheda Google](${absoluteUrl("/scheda-google")}): cosa comprende la gestione della scheda Google Maps, come si attiva con una consulenza gratuita, card e piedistallo da banco, domande frequenti
- [Annunci su ChatGPT](${absoluteUrl("/annunci-chatgpt")}): cosa sono gli annunci su ChatGPT, cosa fa ${site.name} e come funziona
- [Canali](${absoluteUrl("/canali")}): quando hanno senso ChatGPT, Google Ads, Meta Ads e SEO
- [Analisi gratuita](${absoluteUrl("/analisi-gratuita")}): richiesta di valutazione gratuita (attività, sito, settore, budget indicativo, contatti)

## Settori

Per ogni settore: le domande che i clienti fanno a ChatGPT e quando gli annunci hanno senso.

${settori.map((s) => `- [${s.nome}](${absoluteUrl(`/settori/${s.slug}`)}): ${s.description}`).join("\n")}

## Guide

${guide.map((g) => `- [${g.h1}](${absoluteUrl(`/guide/${g.slug}`)}): ${g.rispostaBreve}`).join("\n")}
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
