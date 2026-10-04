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
      "Dipende da cosa vendi, da quanto vale un cliente e da cosa chiedono le persone all'AI nel tuo settore. È esattamente quello che valutiamo nell'analisi gratuita. Se ChatGPT non ha senso per te, te lo diciamo e ti indichiamo il canale che ne ha di più.",
  },
  {
    domanda: "Serve un sito?",
    risposta:
      "Serve una pagina dove mandare chi clicca sull'annuncio. Se quella che hai non è adatta, te lo diciamo e ti proponiamo come sistemarla.",
  },
  {
    domanda: "Cos'è l'analisi gratuita?",
    risposta:
      "Una breve call in cui valutiamo il tuo caso: cosa chiedono i tuoi clienti a ChatGPT, se conviene esserci e quale canale ha più senso per te tra ChatGPT, Google, Meta e SEO, con quale budget di partenza. È gratis e senza impegno.",
  },
];

export const faqCanali: Faq = {
  domanda: "Lavorate solo con ChatGPT?",
  risposta:
    "No. ChatGPT è la nostra specialità, ma non è sempre il canale giusto. Nell'analisi gratuita guardiamo anche Google Ads, Meta (Facebook e Instagram) e SEO, e ti proponiamo quello che ha più senso per la tua attività, da solo o insieme agli altri.",
};
faqHome.splice(6, 0, faqCanali);

export const faqAnalisi: Faq[] = [faqHome[8], faqCanali, faqHome[5], faqHome[3], faqHome[4]];
