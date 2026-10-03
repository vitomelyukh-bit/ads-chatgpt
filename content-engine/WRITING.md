# Come scrivere una guida di TiTrovano

Questa guida la segue la routine automatica che pubblica le guide su titrovano.it. Va seguita per intero, ogni volta.

## Cos'è TiTrovano

Un servizio che **progetta e gestisce annunci su ChatGPT** per attività locali e aziende italiane: strategia, configurazione dell'account, annunci, pagina di destinazione, ottimizzazione del budget, report. Si parte da un'**analisi gratuita** (`/analisi-gratuita`): valutiamo se gli annunci su ChatGPT hanno senso per quel settore, con quali messaggi e con quale budget di partenza.

Le guide informano in modo onesto e portano all'analisi gratuita. Sono utili anche quando dicono "in questo caso non conviene".

## Chi legge

Titolari di attività locali (dentisti, hotel, noleggi, traslochi, artigiani, ristoranti, centri estetici, cliniche) e responsabili marketing di e-commerce e aziende B2B. Non sono tecnici. Leggono dal telefono.

## Fatti verificati sugli annunci (usali, linkando la fonte)

- In Italia gli annunci su ChatGPT ci sono dal 24 agosto 2026: comunicato OpenAI del 18 agosto 2026, https://openai.com/index/chatgpt-ads-expands-across-europe/
- Secondo OpenAI gli annunci sono segnalati come sponsorizzati, mostrati separati dalle risposte e non influenzano le risposte: https://openai.com/index/testing-ads-in-chatgpt/
- Secondo OpenAI li vedono gli utenti dei piani Free e Go; Plus, Pro ed Enterprise no.
- Regole pubblicitarie di OpenAI: https://openai.com/policies/ad-policies/

Tutto il resto (costi per clic, budget minimi, opzioni di targeting, formati) **cambia spesso**: va verificato con una ricerca web durante il lavoro, su fonti ufficiali OpenAI quando possibile, e scritto con la data ("a ottobre 2026…"). Se una fonte non è ufficiale, dillo ("secondo alcune analisi di settore…"). Se non trovi una fonte, non scriverlo.

## Regole che non si violano mai

Se una regola non si può rispettare, l'articolo non si pubblica.

1. **Mai le parole "citare", "citato", "citata", "citazione", "cita"** e simili. Usa "trovare", "consigliare", "esce il tuo nome", "fa il tuo nome".
2. **Niente numeri inventati.** Nessuna statistica, percentuale, costo per clic o "studio" senza fonte verificata e linkata.
3. **Niente casi studio, clienti, testimonianze o risultati inventati.** Niente "un nostro cliente", "abbiamo aiutato", "i nostri clienti ottengono".
4. **Mai promettere risultati**: né vendite, né clienti, né ritorni sulla spesa, né di essere consigliati dall'AI.
5. **Niente prezzi del nostro servizio.** I costi degli annunci si possono citare solo con fonte e data.
6. **Consigliati ≠ sponsorizzati.** Non far mai credere che un annuncio faccia comparire nella risposta di ChatGPT.
7. **Settori sensibili** (salute, finanza, politica…): ricorda che OpenAI non mostra annunci vicino ad argomenti sensibili e che in Italia la pubblicità sanitaria ha regole proprie. Non suggerire mai di aggirarle.
8. **Niente pagine "settore × città"** ("Annunci per dentisti a Milano"…). Le città compaiono solo come esempio.
9. **Niente loghi o immagini** di marchi. I nomi ChatGPT, OpenAI, Gemini, Perplexity, Google si possono scrivere come testo. Non dire mai che siamo partner o affiliati di OpenAI.
10. **Mai copiare** testo da altri siti.

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
5. **Chiusura**: un paragrafo breve che collega la guida all'[analisi gratuita](/analisi-gratuita), senza enfasi.
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

Priorità agli **annunci su ChatGPT**: come funzionano, quanto costano (con fonti), per chi convengono e per chi no, come si misurano, come si scrivono, differenze con Google Ads e Meta, regole e settori sensibili, errori da evitare, domande che i clienti fanno all'AI in un settore. Restano utili anche le guide su come l'AI sceglie chi consigliare.

Non vanno bene: notizie che invecchiano in un giorno, argomenti tecnici per addetti ai lavori, varianti della stessa guida con una parola cambiata, pagine per città.

## Controlli obbligatori prima del push

```bash
npm ci || npm install
node content-engine/check-content.mjs
NEXT_PUBLIC_SITE_URL=https://titrovano.it npx next build
```

Tutti e tre devono passare. Lo script di controllo blocca parole vietate, numeri sospetti, prezzi, titoli troppo lunghi, `#` nel corpo, link interni rotti, testi troppo corti o troppo lunghi, slug con nomi di città.
