// Offerta SEO locale (landing riservata /proposta/seo-locale).
// Le prove sono progetti reali: numeri verificati sui siti il 10 ottobre 2026.

export const SETTORE_SEO = "SEO locale";

export const PIATTAFORME = [
  "WordPress",
  "Wix",
  "Shopify",
  "Squarespace",
  "Jimdo o altri costruttori",
  "Sito su misura",
  "Non lo so",
  "Non ho ancora un sito",
] as const;

export type Prova = {
  nome: string;
  settore: string;
  cosa: string;
  numeri: string[];
  link: { testo: string; url: string };
};

export const PROVE: Prova[] = [
  {
    nome: "Olizen",
    settore: "Centro massaggi, Roma",
    cosa: "Una pagina per ogni trattamento e una guida a ogni domanda vera dei clienti, con prezzi presi direttamente dal gestionale delle prenotazioni.",
    numeri: ["38 pagine in sitemap", "13 guide"],
    link: { testo: "Ogni quanto fare un massaggio?", url: "https://olizen.it/blog/ogni-quanto-fare-un-massaggio/" },
  },
  {
    nome: "Studio Legale Ricci",
    settore: "Avvocato, Roma",
    cosa: "Articoli sui problemi legali che le persone cercano su Google, e un controllo automatico che verifica titoli, descrizioni e link di ogni pagina.",
    numeri: ["63 pagine in sitemap", "controllo tecnico automatico"],
    link: { testo: "Conto corrente di un defunto: come sbloccarlo", url: "https://riccistudiolegale.it/news/conto-corrente-defunto-come-sbloccarlo" },
  },
  {
    nome: "Mima&Lulù",
    settore: "E-commerce, Roma",
    cosa: "Guide in più lingue per chi cerca regali e capi ricamati, schede prodotto leggibili da Google e inviti automatici a lasciare una recensione dopo la consegna.",
    numeri: ["117 pagine in sitemap", "41 articoli in più lingue"],
    link: { testo: "BTS embroidered shirt", url: "https://mimaelulu7.com/blog/bts-embroidered-shirt" },
  },
  {
    nome: "White Garden Tattoo",
    settore: "Studio di tatuaggi, Roma",
    cosa: "Guide sulle domande di chi deve fare un tatuaggio, collegate alle pagine degli stili e degli artisti.",
    numeri: ["41 pagine in sitemap", "9 guide"],
    link: { testo: "Come curare un tatuaggio nei primi giorni", url: "https://whitegardentattoo.it/blog/come-curare-un-tatuaggio-nei-primi-giorni/" },
  },
  {
    nome: "Studio Iamundo & Candido",
    settore: "Commercialisti, Roma",
    cosa: "Ogni giorno l'AI propone notizie prese da INPS, Agenzia delle Entrate e ministeri. Lo studio le approva e il sito resta sempre aggiornato.",
    numeri: ["notizie proposte ogni giorno", "approvazione dello studio"],
    link: { testo: "Le news dello studio", url: "https://studioiamundocandido.it/news" },
  },
  {
    nome: "TiTrovano",
    settore: "Questo sito",
    cosa: "Tre guide al giorno sui problemi della scheda Google, scritte, controllate e pubblicate in automatico.",
    numeri: ["oltre 30 guide in una settimana", "3 al giorno"],
    link: { testo: "Tutte le guide", url: "/guide" },
  },
];
