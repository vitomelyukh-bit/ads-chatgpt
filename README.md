# TiTrovano

Sito di [titrovano.it](https://titrovano.it): gestione di annunci su ChatGPT per attività locali e aziende. Obiettivo: far richiedere l'analisi gratuita (`/analisi-gratuita`).

Stack: Next.js 16 (App Router) con TypeScript, Tailwind CSS 4 e contenuti MDX. Tutte le pagine sono generate staticamente, quindi il testo è nell'HTML iniziale anche per i crawler che non eseguono JavaScript.

## Avvio in locale

```bash
npm install
cp .env.example .env.local   # e compila i valori
npm run dev                  # http://localhost:3000
```

In sviluppo, se Resend non è configurato, il form registra la richiesta nella console e mostra comunque la conferma.

## Variabili d'ambiente (Vercel → Settings → Environment Variables)

| Variabile | Obbligatoria | Cosa mettere |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | **Sì, la build fallisce senza** | `https://titrovano.it`, senza slash finale. Serve per canonical, sitemap, Open Graph, JSON-LD e `llms.txt`. |
| `RESEND_API_KEY` | Sì in produzione | Chiave API di [Resend](https://resend.com). |
| `RESEND_FROM` | Sì in produzione | `TiTrovano <prova@titrovano.it>`. Il dominio `titrovano.it` va verificato su Resend (record DNS SPF/DKIM). |
| `LEAD_TO_EMAIL` | Sì in produzione | Indirizzo che riceve le richieste. Puoi metterne più di uno separati da virgola. |
| `GOOGLE_SITE_VERIFICATION` | No | Solo il valore `content` del meta tag di verifica di Google Search Console. |

In produzione, se manca una delle tre variabili Resend, il form mostra un errore all'utente e scrive nei log di Vercel quale variabile manca. Non mostra mai una finta conferma.

## Il form

- Campi: nome, attività/azienda, sito (facoltativo), settore, città (facoltativa), budget indicativo, email, telefono, consenso privacy.
- Server action in `actions/richiedi-analisi.ts`. Invia due email con Resend:
  1. una a `LEAD_TO_EMAIL` con i dati della richiesta, con Reply-To uguale all'email di chi ha compilato;
  2. una ricevuta a chi ha compilato, con Reply-To uguale al primo indirizzo di `LEAD_TO_EMAIL`.
- **Honeypot**: c'è un campo `sito_web` invisibile. Se viene compilato, la richiesta viene ignorata ma al bot si risponde "ok".
- **Limite per IP**: 3 invii ogni 10 minuti (`lib/rate-limit.ts`). Il limite vive nella memoria della funzione: su Vercel ogni istanza ha il suo contatore, quindi frena gli invii ripetuti ma non è un blocco assoluto. Per un limite condiviso tra istanze si può usare Upstash Redis (`@upstash/ratelimit`).
- **Analytics**: a invio riuscito parte l'evento `Analisi richiesta` con la proprietà `settore`.

## Analytics

Vercel Analytics non usa cookie, quindi non serve un banner. Da attivare in Vercel → progetto → Analytics. Gli eventi personalizzati come `Analisi richiesta` sono disponibili solo su alcuni piani Vercel: controlla il tuo.

## Contenuti

- `content/settori/*.mdx`: una pagina per settore, servita su `/settori/<nome-file>`.
- `content/guide/*.mdx`: una guida per file, servita su `/guide/<nome-file>`.

Per aggiungere un settore o una guida basta copiare un file esistente e cambiarne il frontmatter. Sitemap, `llms.txt`, footer, indici e select del form si aggiornano da soli. La build si ferma se:

- il frontmatter non è valido (lo schema è in `lib/content.ts`);
- `title` supera i 70 caratteri o `description` i 170;
- nel corpo c'è un titolo `# ` (l'H1 lo mette la pagina, nel corpo si parte da `##`).

I link a guide o settori correlati che non esistono vengono ignorati e segnalati nel log di build.

Regole di scrittura: vedi `content-engine/WRITING.md` (niente numeri o clienti inventati, niente risultati garantiti, niente prezzi del servizio, consigliati ≠ sponsorizzati, mai "citare/citato").

## SEO tecnica

- Metadata unici per pagina (`lib/metadata.ts`): title, description, canonical, Open Graph, Twitter.
- `app/sitemap.ts` → `/sitemap.xml`. `app/robots.ts` → `/robots.txt`, che consente in modo esplicito GPTBot, OAI-SearchBot, ChatGPT-User, PerplexityBot, ClaudeBot e Google-Extended.
- `app/llms.txt/route.ts` → `/llms.txt`, generato dai contenuti.
- JSON-LD (`lib/jsonld.ts`): Organization e WebSite in home, Article sulle guide, FAQPage dove c'è una FAQ visibile, BreadcrumbList su ogni pagina.
- Immagine Open Graph generata in build (`app/opengraph-image.tsx`).

## Privacy e cookie

I dati del titolare (nome, P.IVA, città, email) stanno in `lib/titolare.ts` e compaiono nel footer, nella privacy e nella cookie policy. Le due pagine sono in `noindex`. Se cambi fornitori (hosting, email, statistiche) aggiorna i testi e la data `policyAggiornata`.
