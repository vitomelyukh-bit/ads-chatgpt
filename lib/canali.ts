// I quattro canali, spiegati in modo onesto. Nessun numero inventato.
export const canali = [
  {
    id: "chatgpt",
    nome: "Annunci su ChatGPT",
    breve: "Per chi viene cercato con domande precise, quando un cliente vale molto.",
    cosa: "Annunci segnalati come sponsorizzati che compaiono mentre una persona fa una domanda a ChatGPT. In Italia ci sono dal 24 agosto 2026.",
    quando: [
      "i tuoi clienti fanno domande precise prima di scegliere (\"chi mi consigli per…\")",
      "un cliente vale abbastanza da giustificare il costo di un clic",
      "vuoi arrivare su un canale nuovo prima dei concorrenti",
    ],
    limiti: [
      "è un canale nuovo: costi e risultati in Italia vanno ancora misurati",
      "OpenAI non mostra annunci vicino ad argomenti sensibili, salute compresa",
      "in Europa all'inizio gli annunci non sono personalizzati e li vede solo chi usa ChatGPT gratis o Go",
    ],
  },
  {
    id: "google",
    nome: "Google Ads",
    breve: "Per chi viene cercato su Google e su Maps, anche per le urgenze.",
    cosa: "Annunci nei risultati di ricerca di Google e su Google Maps, mostrati a chi cerca un servizio o un prodotto.",
    quando: [
      "le persone ti cercano già su Google, per nome del servizio e zona",
      "lavori con le urgenze o con richieste da soddisfare subito",
      "vuoi un canale collaudato, con risultati misurabili da subito",
    ],
    limiti: [
      "in alcuni settori la concorrenza fa salire il costo di ogni clic",
      "servono pagine di destinazione chiare e un buon tracciamento",
    ],
  },
  {
    id: "meta",
    nome: "Meta Ads (Facebook e Instagram)",
    breve: "Per farti scoprire da chi non ti sta ancora cercando.",
    cosa: "Annunci nel feed e nelle storie di Facebook e Instagram, mostrati per interessi, zona e comportamento.",
    quando: [
      "vendi qualcosa che si capisce con un'immagine o un video",
      "hai offerte, eventi, prodotti o un e-commerce",
      "vuoi farti conoscere in una zona o da un pubblico preciso",
    ],
    limiti: [
      "le persone non stanno cercando: servono messaggi e immagini che fermino lo scorrimento",
      "per servizi tecnici o urgenti di solito rende meno della ricerca",
    ],
  },
  {
    id: "seo",
    nome: "SEO e presenza online",
    breve: "Per farti trovare gratis nel tempo, su Google e nelle risposte dell'AI.",
    cosa: "Sito, contenuti, scheda Google e recensioni curati perché Google e gli assistenti AI ti trovino e ti consiglino senza pagare ogni clic.",
    quando: [
      "puoi aspettare qualche mese per vedere i risultati",
      "vuoi ridurre nel tempo la dipendenza dalla pubblicità",
      "il tuo sito, la scheda Google o le recensioni oggi non ti rappresentano bene",
    ],
    limiti: [
      "i risultati arrivano lentamente e nessuno può garantire posizioni",
      "richiede lavoro costante su contenuti e informazioni",
    ],
  },
];
