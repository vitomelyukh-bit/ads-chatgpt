import type { Faq } from "./content";

export const faqHome: Faq[] = [
  {
    domanda: "Cosa sono gli annunci su ChatGPT?",
    risposta:
      "Sono annunci a pagamento che compaiono mentre una persona usa ChatGPT, separati dalla risposta e segnalati come sponsorizzati. In Italia ci sono dal 24 agosto 2026.",
  },
  {
    domanda: "Un annuncio cambia quello che risponde ChatGPT?",
    risposta:
      "No. Secondo OpenAI gli annunci sono mostrati separati dalla risposta e non la influenzano. Con un annuncio non si compra un consiglio: si compra uno spazio, chiaramente segnalato, davanti a chi sta facendo una domanda sul tuo tema.",
  },
  {
    domanda: "Chi vede gli annunci?",
    risposta:
      "Secondo OpenAI, chi usa ChatGPT con i piani Free e Go. Chi ha un abbonamento Plus, Pro o Enterprise non li vede.",
  },
  {
    domanda: "Quanto costa?",
    risposta:
      "Ci sono due voci: il budget pubblicitario, che paghi a OpenAI, e il nostro compenso per la gestione. Te le indichiamo con chiarezza dopo l'analisi, in base al tuo settore e ai tuoi obiettivi. Le regole sui budget minimi le decide OpenAI e possono cambiare.",
  },
  {
    domanda: "Garantite dei risultati?",
    risposta:
      "No, e diffida di chi lo fa. Garantiamo un lavoro fatto bene e trasparente: sai sempre quanto hai speso, cosa hai ottenuto e cosa stiamo cambiando.",
  },
  {
    domanda: "Ha senso per la mia attività?",
    risposta:
      "Dipende da cosa vendi, da quanto vale un cliente e da cosa chiedono le persone all'AI nel tuo settore. È esattamente quello che valutiamo nell'analisi gratuita. Se non ha senso, te lo diciamo.",
  },
  {
    domanda: "Serve un sito?",
    risposta:
      "Serve una pagina dove mandare chi clicca sull'annuncio. Se quella che hai non è adatta, te lo diciamo e ti proponiamo come sistemarla.",
  },
  {
    domanda: "Cos'è l'analisi gratuita?",
    risposta:
      "Una valutazione del tuo caso: cosa chiedono i tuoi clienti a ChatGPT, se e come conviene fare annunci, con quale budget di partenza. È gratis e senza impegno.",
  },
];

export const faqAnalisi: Faq[] = [faqHome[7], faqHome[5], faqHome[3], faqHome[4]];
