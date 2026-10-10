# Come scrivere una guida di TiTrovano

Questa guida la segue la routine automatica che pubblica le guide su titrovano.it. Va seguita per intero, ogni volta.

## Cos'è TiTrovano

Il servizio principale è la **SEO locale del sito** (home del sito, `/`): rendiamo il sito di un'attività o di un professionista leggibile da Google e dagli assistenti AI, sistemiamo i problemi tecnici, aggiungiamo ogni settimana pagine per ogni servizio e zona e guide sulle domande dei clienti, colleghiamo Google Search Console e mandiamo un report mensile. Funziona su qualunque piattaforma: WordPress, Wix, Shopify, Squarespace, siti su misura. Non si compra dal sito: si prenota una **consulenza gratuita** con Vitaliy (`/#attiva`).

Il secondo servizio è la gestione della **scheda Google Maps** (novità ogni settimana, risposte alle recensioni, recensioni nuove, report). Il terzo, secondario, sono gli annunci online (ChatGPT, Google, Meta).

## Quale guida scrivere oggi

Ogni guida ha nel frontmatter `tema: "seo"`, `tema: "maps"` oppure `tema: "chatgpt"`.

**Ogni giorno: tre guide SEO.** Ogni esecuzione della routine scrive una guida con `tema: "seo"`. Se oggi (Europe/Rome) ci sono già tre guide SEO, non scrivere nulla. I temi `maps` e `chatgpt` sono in pausa: le guide esistenti restano online, ma non se ne scrivono di nuove finché questo file non cambia.

Poi prendi dal backlog (`topics.json`) il primo argomento `"stato": "da-fare"` con `"tema": "seo"`.

## Guide SEO (tema "seo"): come si scrivono

Chi legge è un titolare o un professionista che ha già un sito e un dubbio preciso: «perché il mio sito WordPress non compare su Google», «Wix va bene per la SEO», «Search Console dice pagina scansionata ma non indicizzata», «sito del dentista: quali pagine servono». Lo cerca con parole molto specifiche, spesso la sua piattaforma o il suo settore. La SEO è un tema vecchio e affollato: vinciamo solo essendo **più specifici, più concreti e più onesti** degli articoli generici.

- **Una domanda sola, molto specifica.** Mai "Guida completa alla SEO" o "10 consigli SEO". Il titolo deve contenere la parola che usa chi cerca: la piattaforma (WordPress, Wix, Shopify, Squarespace, Google Sites, Jimdo, Webflow), il messaggio esatto di Search Console, il settore (dentista, avvocato, ristorante, idraulico, estetista…) o la situazione ("dopo aver cambiato dominio", "sito nuovo da 3 mesi").
- **Parti dal problema, con le sue parole**, e da perché gli costa clienti. Poi la **soluzione passo per passo**, verificata sulla documentazione ufficiale e **linkata**: almeno un link obbligatorio a Google Search Central (`developers.google.com/search`), all'aiuto di Search Console (`support.google.com/webmasters`), a `web.dev` o all'aiuto ufficiale della piattaforma (`wordpress.org`, `support.wix.com`, `help.shopify.com`, `support.squarespace.com`, documentazione di Yoast o Rank Math). Se un menu o un pulsante non riesci a verificarlo, descrivi il passaggio in modo generico invece di inventare nomi.
- **Esempi concreti da copiare**: un titolo di pagina prima e dopo, una meta description, l'elenco delle pagine che dovrebbe avere il sito di quel settore, un testo per la pagina di un servizio. In blocchi `>`, con nomi di fantasia e dettagli realistici.
- **Guide verticali per settore**: le pagine che servono, le ricerche tipiche dei clienti di quel settore (almeno 4, in un elenco), gli errori tipici dei siti di quel settore, regole particolari (per esempio la pubblicità sanitaria per dentisti e medici). Devono essere davvero diverse tra loro: niente testi uguali con il nome del settore cambiato. I settori in `content/settori/` riguardano gli annunci su ChatGPT: **non** mettere `settoriCorrelati` nelle guide SEO e non linkarli.
- **Guide per piattaforma**: cosa si può fare davvero su quella piattaforma, cosa è bloccato e come compensare con contenuti e pagine. Mai parlare male di una piattaforma: dire con onestà cosa offre e cosa no.
- **Assistenti AI**: quando è pertinente, spiega cosa serve perché ChatGPT, Gemini e Perplexity leggano il sito (testo presente nell'HTML, dati strutturati, pagine chiare). Mai promettere che un'AI ti consiglierà.
- **Cosa non fare**: scorciatoie che violano le regole di Google (link comprati, testi duplicati, pagine città copia-incolla, recensioni finte), con link alle [norme anti-spam di Google](https://developers.google.com/search/docs/essentials/spam-policies?hl=it) quando servono.
- **Niente promesse di posizionamento e niente tempi garantiti**: nessuno decide al posto di Google. Si può dire che la SEO richiede mesi, citando la fonte se si dà un ordine di grandezza.
- **Chiusura**: un paragrafo breve "se non hai tempo di farlo da solo" con il link `[prenota la consulenza gratuita](/#attiva)`. Senza prezzi, senza enfasi.
- Almeno un **link interno** a un'altra guida (`/guide/<slug>`), di preferenza un'altra guida SEO.
- **Lunghezza**: da 700 a 1.300 parole. Specifiche, non lunghe: se un paragrafo non aiuta a risolvere il problema, toglilo.

Fonti ufficiali utili (da ricontrollare quando le usi):
- Guida introduttiva alla SEO: https://developers.google.com/search/docs/fundamentals/seo-starter-guide?hl=it
- Norme anti-spam: https://developers.google.com/search/docs/essentials/spam-policies?hl=it
- Report Indicizzazione delle pagine in Search Console: https://support.google.com/webmasters/answer/7440203?hl=it
- Dati strutturati: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data?hl=it
- Titoli nei risultati: https://developers.google.com/search/docs/appearance/title-link?hl=it

## Guide Google Maps (tema "maps"): come si scrivono

Chi legge è un titolare con un problema concreto sulla sua scheda Google: una recensione cattiva, poche recensioni, la scheda che non compare, gli orari cambiati da qualcuno, l'accesso perso. Lo cerca su Google nel momento in cui il problema gli brucia. La guida deve **risolverglielo davvero**, poi ricordargli che, se non ha tempo, lo facciamo noi.

- **Parti dal dolore, con le sue parole.** Prima sezione: perché quel problema costa clienti, in modo concreto e senza allarmismo ("la legge chiunque ti cerca, per mesi"). Niente numeri inventati.
- **Poi la soluzione passo per passo**, verificata sulle guide ufficiali di Google (`support.google.com/business`, `support.google.com/contributionpolicy`, `support.google.com/maps`) e **linkata**: almeno un link a una pagina ufficiale di Google è obbligatorio. Se un passaggio dell'interfaccia non riesci a verificarlo, descrivilo in modo generico ("dal tuo profilo apri le recensioni") invece di inventare nomi di pulsanti.
- **Esempi pronti da copiare** quando hanno senso (risposte alle recensioni, messaggi WhatsApp per chiedere recensioni, testi per la scheda), in blocchi `>`. Nomi di fantasia, dettagli realistici, tono da titolare.
- **Cosa non fare**, quando serve: soprattutto le regole di Google sulle recensioni (niente recensioni false o comprate, niente sconti o regali in cambio, niente richieste solo ai clienti contenti, niente recensioni sui concorrenti). Mai suggerire di aggirarle.
- **Chiusura**: un paragrafo breve "se non hai tempo di farlo" con il link al servizio `[lo facciamo noi](/)`. Senza prezzi, senza enfasi. Le guide Maps **non** linkano l'analisi gratuita.
- Almeno un link interno a un'altra guida (`/guide/<slug>`), di preferenza un'altra guida Maps.
- `settoriCorrelati` è facoltativo: mettilo solo se la guida è davvero per un settore (es. "come rispondere alle recensioni di un ristorante"), e in quel caso linka anche `/settori/<slug>`.
- Niente promesse di posizionamento: nessuno decide al posto di Google chi compare per primo. Puoi riportare cosa dice Google sui fattori del posizionamento locale (pertinenza, distanza, prominenza: https://support.google.com/business/answer/7091?hl=it).

Fonti ufficiali già verificate (ottobre 2026), da ricontrollare quando le usi:
- Rispondere e gestire le recensioni: https://support.google.com/business/answer/3474050?hl=it (risposte pubbliche con il nome dell'attività, modificabili ed eliminabili; l'autore riceve una notifica e può modificare la recensione).
- Segnalare recensioni: https://support.google.com/business/answer/4596773?hl=it (Google toglie solo quelle che violano le norme, non interviene nelle controversie; esame in genere di diversi giorni; c'è uno strumento per lo stato della segnalazione).
- Contenuti vietati nelle recensioni: https://support.google.com/contributionpolicy/answer/7400114?hl=it (esperienza non autentica, incentivi, scoraggiare le negative o chiedere solo le positive, recensioni sui concorrenti).
- Posizionamento locale: https://support.google.com/business/answer/7091?hl=it
- Modifiche proposte da utenti e Google: https://support.google.com/business/answer/3480441?hl=it

Le altre regole di questo file valgono anche per le guide SEO e Maps, tranne dove le loro sezioni dicono diversamente.

## Annunci su ChatGPT (tema "chatgpt")

Un servizio che **progetta e gestisce annunci su ChatGPT** per attività locali e aziende italiane: strategia, configurazione dell'account, annunci, pagina di destinazione, ottimizzazione del budget, report. Si parte da un'**analisi gratuita** (`/analisi-gratuita`): valutiamo se gli annunci su ChatGPT hanno senso per quel settore, con quali messaggi e con quale budget di partenza.

Le guide informano in modo onesto e portano all'analisi gratuita. Sono utili anche quando dicono "in questo caso non conviene": nell'analisi gratuita valutiamo anche Google Ads, Meta Ads e SEO e proponiamo il canale più adatto. Quando ChatGPT non conviene, puoi dirlo e rimandare a [/canali](/canali). Il tema principale delle guide resta ChatGPT.

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
5. **Niente prezzi del nostro servizio** nel testo (il riquadro finale della pagina li mostra già). I costi degli annunci si possono citare solo con fonte e data.
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
3. **Corpo** in MDX: da 500 a 1.200 parole (guide SEO: da 700 a 1.300), sezioni con `##` e, se servono, `###`. **Mai `#`** (l'H1 lo mette la pagina). Liste puntate quando aiutano. Niente tabelle (non sono supportate).
4. Almeno **un link interno a una guida esistente** o a un settore (`/guide/<slug>`, `/settori/<slug>`), dove ha senso nel testo.
5. **Chiusura**: un paragrafo breve, senza enfasi. Tema seo: `[prenota la consulenza gratuita](/#attiva)`. Tema chatgpt: collega all'[analisi gratuita](/analisi-gratuita). Tema maps: collega al servizio, `[lo facciamo noi](/)`.
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
tema: "seo"                   # "seo" (oggi l'unico da scrivere), "maps" oppure "chatgpt"
datePublished: "AAAA-MM-GG"   # data di oggi (Europe/Rome)
dateModified: "AAAA-MM-GG"    # uguale a datePublished
settoriCorrelati:             # solo tema chatgpt: 1-3 slug esistenti in content/settori (mai per tema seo)
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
2. Decidi il tema di oggi (vedi "Quale guida scrivere oggi") e scegli dal backlog il primo argomento di quel tema con `"stato": "da-fare"` che **non si sovrappone** a una guida esistente. Se tutti sono fatti o sovrapposti, aggiungi tu nuovi argomenti al backlog rispettando le regole (vedi sotto) e usa il primo.
3. Se l'argomento richiede fatti su prodotti, aziende o regole, verificali con una ricerca web e tieni i link delle fonti ufficiali.
4. Scrivi la guida seguendo struttura, stile e regole.
5. Rileggila **da critico**: togli ogni frase che promette, che vende, che contiene numeri senza fonte, che ripete un'altra guida, che non servirebbe a un titolare.
6. In `content-engine/topics.json` segna l'argomento come `"stato": "fatto"` con `"slug"` e `"data"`.
7. Esegui i controlli (sotto). Se falliscono, correggi e riprova.

## Articoli verticali: la priorità (tema chatgpt)

L'obiettivo della SEO è portare in **call** attività e aziende interessate agli annunci su ChatGPT. Per questo la priorità sono **articoli verticali**: un settore preciso (quelli in \`content/settori/\`) e una domanda precisa che si fa un titolare o un responsabile marketing di quel settore.

Ogni articolo verticale deve:

- avere il settore nel titolo e in \`settoriCorrelati\` (solo quel settore, al massimo uno affine);
- contenere **almeno 4 domande realistiche** che i clienti di quel settore fanno a ChatGPT, scritte in un elenco;
- spiegare in modo concreto **quando conviene e quando no** per quel settore: valore di un cliente, stagionalità, zona, tipo di servizio, regole del settore;
- dire cosa serve per partire (pagina di destinazione, modo di contatto, misurazione) con esempi del settore;
- linkare la pagina del settore (\`/settori/<slug>\`) nel testo e chiudere invitando all'[analisi gratuita](/analisi-gratuita), che è una breve call;
- essere **davvero diverso** dagli altri articoli: niente testi uguali con il nome del settore cambiato. Se l'articolo potrebbe valere per qualsiasi settore, non è verticale: riscrivilo o scegli un altro argomento.

## Nuovi argomenti per il backlog

Tema seo: quando restano meno di 15 argomenti `da-fare`, aggiungine 30 in fondo. Devono essere **ricerche molto specifiche** che fa chi ha già un sito e vuole farsi trovare: alterna tre famiglie, una alla volta.
- **Piattaforma**: un problema preciso su una piattaforma precisa ("Wix: pagine non indicizzate dopo la pubblicazione", "WordPress: Yoast o Rank Math per un sito locale", "Shopify: titoli delle collezioni duplicati").
- **Messaggio o problema tecnico concreto**: errori di Search Console, sito sparito da Google, sito lento da telefono, cambio di dominio, HTTPS, pagine duplicate, sito in inglese e italiano.
- **Settore**: il sito di un mestiere preciso e le pagine che gli servono ("SEO per un idraulico: quali pagine creare", "sito di uno psicologo: come farsi trovare rispettando il codice deontologico"). Settori sempre diversi, mai lo stesso due volte di fila.
Più una quarta famiglia, una ogni 5: **SEO e assistenti AI** (farsi leggere da ChatGPT, Gemini e Perplexity). Niente pagine per città, niente confronti tra agenzie con nomi.

Tema maps: quando finiscono, aggiungi altri problemi reali della scheda Google che un titolare cerca su Google (recensioni, visibilità, accesso, modifiche, foto, orari, domande e risposte, sospensioni), poi le varianti per settore dei temi più forti (es. "rispondere alle recensioni di un parrucchiere"), con esempi davvero diversi per ogni settore.

Tema chatgpt: quando il backlog finisce, aggiungi argomenti verticali per i settori esistenti (uno per settore alla volta, alternando i settori), poi argomenti generali sugli annunci su ChatGPT (costi con fonti, misurazione, differenze con Google e Meta, regole, errori).

Non vanno bene: notizie che invecchiano in un giorno, argomenti tecnici per addetti ai lavori, varianti della stessa guida, pagine per città.

## Controlli obbligatori prima del push

```bash
npm ci || npm install
node content-engine/check-content.mjs
NEXT_PUBLIC_SITE_URL=https://titrovano.it npx next build
```

Tutti e tre devono passare. Lo script di controllo blocca parole vietate, numeri sospetti, prezzi, titoli troppo lunghi, `#` nel corpo, link interni rotti, testi troppo corti o troppo lunghi, slug con nomi di città.
