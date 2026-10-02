# Come scrivere una guida di TiTrovano

Questa guida la segue la routine automatica che pubblica le guide su titrovano.it. Va seguita per intero, ogni volta.

## Cos'è TiTrovano

Un sito con un solo messaggio: oggi i clienti chiedono a ChatGPT, Gemini e Perplexity a chi rivolgersi, l'AI risponde con due o tre nomi, e un'attività può scoprire gratis se il suo c'è.

Un solo obiettivo: far richiedere la **prova gratuita** (`/prova-gratuita`). La prova: poniamo 20 domande reali che i clienti di quell'attività farebbero a tre assistenti AI, e consegniamo una pagina con quante volte viene consigliata l'attività, quante i concorrenti e perché.

Il sito **non vende servizi**. Le guide informano e portano alla prova. Basta.

## Chi legge

Il titolare di un'attività locale italiana: dentista, ristoratore, idraulico, albergatore, centro estetico, noleggio, traslochi, clinica. Non sa cosa sia la SEO. Ha poco tempo. Legge dal telefono.

## Regole che non si violano mai

Se una regola non si può rispettare, l'articolo non si pubblica.

1. **Mai le parole "citare", "citato", "citata", "citazione", "cita"** e simili. Usa "trovare", "consigliare", "esce il tuo nome", "fa il tuo nome".
2. **Niente numeri inventati.** Nessuna statistica, percentuale, quota di mercato o "studio" senza fonte verificata. Se non trovi una fonte affidabile, scrivi la cosa senza numeri o non scriverla. "Non ci sono dati affidabili" è una frase accettabile.
3. **Niente casi studio, clienti, testimonianze o recensioni inventati.** Niente "un nostro cliente", "abbiamo aiutato", "un dentista di Bologna ci ha detto".
4. **Mai promettere** di essere consigliati dall'AI, di salire, di "posizionarsi". Nessuno può garantirlo, e va detto quando serve.
5. **Niente prezzi**, né nostri né di altri.
6. **Non vendere servizi.** Non parlare di pacchetti, consulenze, SEO, campagne o pubblicità come offerta nostra. L'unica azione proposta è la prova gratuita.
7. **Gli annunci sponsorizzati su ChatGPT** (in Italia dal 24 agosto 2026, comunicato OpenAI del 18 agosto 2026 "ChatGPT Ads expands across Europe": https://openai.com/index/chatgpt-ads-expands-across-europe/) si possono nominare **solo come informazione**, mai come cosa che facciamo noi.
8. **Niente pagine "settore × città"** ("Dentisti a Milano", "Idraulici a Roma"…). Le città compaiono solo come esempio dentro le domande dei clienti.
9. **Niente loghi o immagini** di marchi. I nomi ChatGPT, Gemini, Perplexity, Google si possono scrivere come testo.
10. **Fatti su prodotti e aziende** (come funziona la ricerca di ChatGPT, cosa fa Gemini, regole di Google): solo se li verifichi su una fonte ufficiale o affidabile durante il lavoro, e quando è utile la linki. Se non sei sicuro, usa formule prudenti ("secondo OpenAI", "per quanto se ne sa") o lascia perdere. Non inventare nomi di funzioni, date o regole.
11. **Mai copiare** testo da altri siti. Scrivi con parole tue.

## Stile

- Italiano diretto. Frasi corte. Paragrafi di 2-4 frasi.
- Dai del "tu" al lettore.
- Niente gergo: se proprio serve un termine tecnico, spiegalo in una frase.
- Esempi concreti presi dai settori del sito (domande vere che un cliente farebbe).
- Tono calmo e onesto. Niente allarmismo ("se non lo fai sei finito"), niente entusiasmo da venditore.
- Niente frasi riempitive tipo "In questo articolo vedremo", "In conclusione", "Nel mondo di oggi".

## Struttura obbligatoria

1. **Titolo** sotto forma di domanda o di risposta a un dubbio reale del titolare.
2. **Risposta breve** (`rispostaBreve`): 2-3 frasi che rispondono subito e davvero alla domanda del titolo. È la prima cosa che si legge ed è quella che gli assistenti AI riprendono più facilmente.
3. **Corpo** in MDX: da 500 a 1.200 parole, sezioni con `##` e, se servono, `###`. **Mai `#`** (l'H1 lo mette la pagina). Liste puntate quando aiutano. Niente tabelle (non sono supportate).
4. Almeno **un link interno a una guida esistente** o a un settore (`/guide/<slug>`, `/settori/<slug>`), dove ha senso nel testo.
5. **Chiusura**: un paragrafo breve che collega la guida alla [prova gratuita](/prova-gratuita), senza enfasi.
6. **FAQ** facoltative (2-3 domande) solo se aggiungono qualcosa, con risposte brevi. Compaiono nella pagina e nel JSON-LD.

## Frontmatter

File: `content/guide/<slug>.mdx`. Lo slug è in minuscolo, parole separate da trattini, senza articoli inutili, al massimo 60 caratteri.

```yaml
---
title: "Titolo per Google, max 70 caratteri incluso ' · TiTrovano'"
description: "Descrizione per Google, 120-170 caratteri, concreta, senza promesse."
h1: "Titolo visibile, di solito una domanda"
rispostaBreve: "Due o tre frasi che rispondono subito."
ordine: 100
datePublished: "AAAA-MM-GG"   # data di oggi (Europe/Rome)
dateModified: "AAAA-MM-GG"    # uguale a datePublished
settoriCorrelati:             # 1-3 slug esistenti in content/settori
  - "dentisti"
guideCorrelate:               # 1-3 slug esistenti in content/guide
  - "come-sceglie-chatgpt-chi-consigliare"
faq:                          # facoltativo
  - domanda: "…?"
    risposta: "…"
---
```

Settori esistenti: guarda i file in `content/settori/`. Non creare nuovi settori.

## Procedura

1. Leggi questo file, `content-engine/topics.json` e i titoli e le risposte brevi di **tutte** le guide in `content/guide/`.
2. Scegli dal backlog il primo argomento con `"stato": "da-fare"` che **non si sovrappone** a una guida esistente. Se tutti sono fatti o sovrapposti, aggiungi tu nuovi argomenti al backlog rispettando le regole (vedi sotto) e usa il primo.
3. Se l'argomento richiede fatti su prodotti, aziende o regole, verificali con una ricerca web e tieni i link delle fonti ufficiali.
4. Scrivi la guida seguendo struttura, stile e regole.
5. Rileggila **da critico**: togli ogni frase che promette, che vende, che contiene numeri senza fonte, che ripete un'altra guida, che non servirebbe a un titolare.
6. In `content-engine/topics.json` segna l'argomento come `"stato": "fatto"` con `"slug"` e `"data"`.
7. Esegui i controlli (sotto). Se falliscono, correggi e riprova.

## Nuovi argomenti per il backlog

Buoni argomenti sono **domande vere che un titolare si fa** su AI e clienti:

- come l'AI sceglie, legge, confronta, descrive le attività;
- cosa fare (in modo concreto e onesto) per essere più chiari per l'AI: sito, scheda, recensioni, informazioni coerenti;
- differenze tra assistenti (ChatGPT, Gemini, Perplexity), tra AI e ricerca classica;
- errori e falsi miti (chi promette di "far consigliare" a pagamento, recensioni false…);
- domande tipiche di un settore esistente, spiegate dal punto di vista del titolare.

Non vanno bene: notizie di attualità che invecchiano in un giorno, argomenti tecnici per addetti ai lavori, temi senza legame con attività locali, varianti della stessa guida con una parola cambiata, pagine per città.

## Controlli obbligatori prima del push

```bash
npm ci || npm install
node content-engine/check-content.mjs
NEXT_PUBLIC_SITE_URL=https://titrovano.it npx next build
```

Tutti e tre devono passare. Lo script di controllo blocca parole vietate, numeri sospetti, prezzi, titoli troppo lunghi, `#` nel corpo, link interni rotti, testi troppo corti o troppo lunghi, slug con nomi di città.
