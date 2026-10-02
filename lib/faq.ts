import type { Faq } from "./content";

export const faqHome: Faq[] = [
  {
    domanda: "La prova è davvero gratuita?",
    risposta: "Sì. Non ti chiediamo pagamenti né carte di credito, e non ti impegni a nulla.",
  },
  {
    domanda: "Cosa ricevo, esattamente?",
    risposta:
      "Una pagina con le 20 domande che abbiamo fatto, quante volte l'AI ha fatto il tuo nome, quante volte ha fatto quello dei concorrenti e perché, secondo noi, ha scelto loro.",
  },
  {
    domanda: "A quali assistenti AI fate le domande?",
    risposta: "A tre: ChatGPT, Gemini e Perplexity.",
  },
  {
    domanda: "Come scegliete le domande?",
    risposta:
      "Scriviamo le domande che farebbe un tuo cliente: il tuo servizio, la tua città, i dubbi tipici del tuo settore. Se lavori con turisti, ne facciamo anche in inglese.",
  },
  {
    domanda: "Potete garantire che l'AI consigli la mia attività?",
    risposta:
      "No, e diffida di chi lo promette. Nessuno controlla le risposte dell'AI. La prova serve a vedere come stanno le cose oggi.",
  },
  {
    domanda: "Perché proprio 20 domande?",
    risposta:
      "Perché l'AI non risponde sempre allo stesso modo: basta cambiare qualche parola, o fare la stessa domanda in un altro momento, e i nomi possono cambiare. Una domanda sola non basta per farsi un'idea.",
  },
  {
    domanda: "Devo darvi accesso a qualcosa?",
    risposta:
      "No. Facciamo le domande come le farebbe un cliente qualunque. Ci servono solo nome dell'attività, settore e città.",
  },
  {
    domanda: "E dopo la prova cosa succede?",
    risposta: "Ti spieghiamo di persona cosa abbiamo trovato. Poi decidi tu.",
  },
];

export const faqProva: Faq[] = [
  faqHome[0],
  faqHome[1],
  faqHome[4],
  {
    domanda: "Cosa fate con i miei dati?",
    risposta:
      "Li usiamo solo per fare la prova e per ricontattarti. Trovi i dettagli nell'informativa privacy.",
  },
  faqHome[7],
];
