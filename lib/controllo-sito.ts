import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

// Controllo SEO gratuito di una pagina (/controllo-sito). Legge l'HTML come lo riceve Google,
// senza eseguire JavaScript, e restituisce controlli spiegati in parole semplici.

export type Esito = "ok" | "attenzione" | "problema";
export type Controllo = { id: string; titolo: string; esito: Esito; testo: string; consiglio?: string };
export type Risultato = {
  url: string;
  host: string;
  piattaforma: string | null;
  pagineInSitemap: number | null;
  millisecondi: number;
  voto: number;
  controlli: Controllo[];
};

const TIMEOUT = 8000;
const MAX_BYTES = 2_000_000;
const UA = "Mozilla/5.0 (compatible; TiTrovanoControllo/1.0; +https://titrovano.it/controllo-sito)";

export class ErroreControllo extends Error {}

// ---------- Sicurezza: solo siti pubblici ----------
function ipPrivato(ip: string) {
  if (isIP(ip) === 6) {
    const x = ip.toLowerCase();
    if (x.startsWith("::ffff:")) return ipPrivato(x.slice(7));
    return x === "::1" || x === "::" || x.startsWith("fc") || x.startsWith("fd") || x.startsWith("fe8") || x.startsWith("fe9") || x.startsWith("fea") || x.startsWith("feb");
  }
  const [a, b] = ip.split(".").map(Number);
  return (
    a === 0 || a === 10 || a === 127 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) || (a === 100 && b >= 64 && b <= 127) || a >= 224
  );
}

async function verificaHost(u: URL) {
  if (!["http:", "https:"].includes(u.protocol)) throw new ErroreControllo("Indirizzo non valido.");
  if (u.port && !["80", "443"].includes(u.port)) throw new ErroreControllo("Indirizzo non valido.");
  const host = u.hostname;
  if (isIP(host) || !host.includes(".") || host.endsWith(".local") || host.endsWith(".internal")) throw new ErroreControllo("Scrivi l'indirizzo del sito, per esempio tuosito.it");
  let indirizzi: { address: string }[];
  try {
    indirizzi = await lookup(host, { all: true });
  } catch {
    throw new ErroreControllo("Non troviamo questo sito. Controlla di aver scritto bene l'indirizzo.");
  }
  if (!indirizzi.length || indirizzi.some((a) => ipPrivato(a.address))) throw new ErroreControllo("Questo indirizzo non si può controllare.");
}

// Scarica una pagina seguendo i reindirizzamenti uno per uno (ognuno ricontrollato).
async function scarica(inizio: string, maxBytes = MAX_BYTES) {
  let url = new URL(inizio);
  const t0 = Date.now();
  for (let i = 0; i < 5; i++) {
    await verificaHost(url);
    const res = await fetch(url, {
      redirect: "manual",
      headers: { "user-agent": UA, accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", "accept-language": "it-IT,it;q=0.9" },
      signal: AbortSignal.timeout(TIMEOUT),
    });
    if (res.status >= 300 && res.status < 400 && res.headers.get("location")) {
      url = new URL(res.headers.get("location")!, url);
      continue;
    }
    const reader = res.body?.getReader();
    const parti: Uint8Array[] = [];
    let n = 0;
    while (reader) {
      const { done, value } = await reader.read();
      if (done) break;
      n += value.length;
      parti.push(value);
      if (n > maxBytes) { await reader.cancel(); break; }
    }
    const testo = new TextDecoder("utf-8").decode(Buffer.concat(parti));
    return { url: url.toString(), status: res.status, headers: res.headers, testo, ms: Date.now() - t0 };
  }
  throw new ErroreControllo("Il sito rimanda da un indirizzo all'altro troppe volte.");
}

async function scaricaSilenzioso(url: string, maxBytes = 1_000_000) {
  try { return await scarica(url, maxBytes); } catch { return null; }
}

// ---------- Lettura dell'HTML (senza librerie: bastano espressioni regolari prudenti) ----------
const decod = (s: string) =>
  s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
const meta = (html: string, nome: string) => {
  const re = new RegExp(`<meta[^>]+(?:name|property)=["']${nome}["'][^>]*>`, "i");
  const tag = html.match(re)?.[0];
  return tag ? decod(tag.match(/content=["']([^"']*)["']/i)?.[1] ?? "") : null;
};
const testoVisibile = (html: string) =>
  decod(
    html
      .replace(/<head[\s\S]*?<\/head>/i, " ")
      .replace(/<(script|style|noscript|svg|template)[\s\S]*?<\/\1>/gi, " ")
      .replace(/<[^>]+>/g, " "),
  );

function piattaforma(html: string, h: Headers): string | null {
  const s = html.slice(0, 400_000);
  if (/wp-content|wp-includes|<meta name=["']generator["'] content=["']WordPress/i.test(s)) return "WordPress";
  if (/static\.wixstatic\.com|wix\.com|_wixCIDX|x-wix/i.test(s) || h.get("x-wix-request-id")) return "Wix";
  if (/cdn\.shopify\.com|Shopify\.theme/i.test(s)) return "Shopify";
  if (/squarespace\.com|static1\.squarespace/i.test(s)) return "Squarespace";
  if (/jimdo/i.test(s)) return "Jimdo";
  if (/webflow\.(com|io)|data-wf-site/i.test(s)) return "Webflow";
  if (/sites\.google\.com/i.test(s)) return "Google Sites";
  if (/<div id=["'](root|app)["']>\s*<\/div>/i.test(s)) return "Sito su misura (app JavaScript)";
  return null;
}

const GENERICI = /^(home|homepage|home page|benvenut[io]|welcome|untitled|senza titolo|index|sito|my site|il mio sito|pagina iniziale)$/i;

export async function controllaSito(input: string): Promise<Risultato> {
  const pulito = input.trim().replace(/\s+/g, "");
  if (!pulito) throw new ErroreControllo("Scrivi l'indirizzo del tuo sito.");
  const url = /^https?:\/\//i.test(pulito) ? pulito : `https://${pulito}`;
  let pagina;
  try {
    pagina = await scarica(url);
  } catch (e) {
    if (e instanceof ErroreControllo) throw e;
    // Alcuni siti rispondono solo in http
    if (!/^http:/i.test(url)) pagina = await scarica(url.replace(/^https:/i, "http:")).catch(() => null);
    if (!pagina) throw new ErroreControllo("Il sito non risponde. Controlla l'indirizzo o riprova tra poco.");
  }
  if (pagina.status >= 400) throw new ErroreControllo(`Il sito risponde con un errore (${pagina.status}). Controlla l'indirizzo.`);

  const html = pagina.testo;
  const finale = new URL(pagina.url);
  const origine = finale.origin;
  const c: Controllo[] = [];
  const add = (x: Controllo) => c.push(x);

  // 1. Connessione sicura
  add(finale.protocol === "https:"
    ? { id: "https", titolo: "Connessione sicura (HTTPS)", esito: "ok", testo: "Il sito usa una connessione sicura, come chiede Google." }
    : { id: "https", titolo: "Connessione sicura (HTTPS)", esito: "problema", testo: "Il sito non usa HTTPS: i browser lo segnano come «Non sicuro» e i clienti si spaventano.", consiglio: "Attiva il certificato HTTPS dal pannello del tuo hosting o della piattaforma." });

  // 2. Blocchi all'indicizzazione
  const robotsMeta = (meta(html, "robots") ?? "") + " " + (meta(html, "googlebot") ?? "") + " " + (pagina.headers.get("x-robots-tag") ?? "");
  const noindex = /noindex/i.test(robotsMeta);
  const robotsTxt = await scaricaSilenzioso(`${origine}/robots.txt`, 200_000);
  const robots = robotsTxt && robotsTxt.status < 400 ? robotsTxt.testo : "";
  let bloccatoRobots = false;
  for (const gruppo of robots.split(/\n(?=\s*user-agent)/i)) {
    if (/user-agent:\s*(\*|googlebot)\s*$/im.test(gruppo) && /^\s*disallow:\s*\/\s*$/im.test(gruppo)) bloccatoRobots = true;
  }
  add(noindex || bloccatoRobots
    ? { id: "indicizzazione", titolo: "Google può mostrare il sito?", esito: "problema", testo: noindex ? "La pagina chiede a Google di NON mostrarla nei risultati (noindex). Finché resta così, non comparirai." : "Il file robots.txt vieta a Google di leggere il sito.", consiglio: "È spesso un'impostazione dimenticata dopo la messa online: su WordPress si trova in Impostazioni → Lettura." }
    : { id: "indicizzazione", titolo: "Google può mostrare il sito?", esito: "ok", testo: "Nessun blocco: Google può leggere e mostrare la pagina." });

  // 3. Titolo
  const titolo = decod(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "");
  if (!titolo) add({ id: "titolo", titolo: "Titolo della pagina", esito: "problema", testo: "La pagina non ha un titolo: Google non sa come presentarla.", consiglio: "Scrivi un titolo che dica cosa fai e dove, per esempio «Idraulico a Roma nord: pronto intervento»." });
  else if (GENERICI.test(titolo) || titolo.length < 15) add({ id: "titolo", titolo: "Titolo della pagina", esito: "problema", testo: `Il titolo è «${titolo}»: troppo generico. Non dice cosa fai né dove.`, consiglio: "Metti nel titolo il tuo servizio principale e la tua zona." });
  else if (titolo.length > 70) add({ id: "titolo", titolo: "Titolo della pagina", esito: "attenzione", testo: `Il titolo è lungo (${titolo.length} caratteri): Google lo taglia e la parte importante può sparire.`, consiglio: "Tienilo sotto i 60-65 caratteri, con il servizio all'inizio." });
  else add({ id: "titolo", titolo: "Titolo della pagina", esito: "ok", testo: `«${titolo}»` });

  // 4. Descrizione
  const descr = meta(html, "description");
  if (!descr) add({ id: "descrizione", titolo: "Descrizione per Google", esito: "attenzione", testo: "Manca la descrizione: Google sceglierà da solo un pezzo di testo da mostrare sotto il titolo.", consiglio: "Scrivi due righe che convincano a cliccare: cosa offri, dove, perché sceglierti." });
  else if (descr.length < 70 || descr.length > 170) add({ id: "descrizione", titolo: "Descrizione per Google", esito: "attenzione", testo: `La descrizione è ${descr.length < 70 ? "troppo corta" : "troppo lunga"} (${descr.length} caratteri).`, consiglio: "Tra 120 e 160 caratteri è la misura giusta." });
  else add({ id: "descrizione", titolo: "Descrizione per Google", esito: "ok", testo: `«${descr}»` });

  // 5. Testo leggibile senza JavaScript (Google e le AI)
  const parole = testoVisibile(html).split(" ").filter((w) => /\p{L}{2,}/u.test(w)).length;
  if (parole < 120) add({ id: "testo", titolo: "Testo leggibile da Google e dalle AI", esito: "problema", testo: `Nell'HTML ci sono solo ${parole} parole. Molti programmi che leggono il web, compresi diversi assistenti AI, vedono una pagina quasi vuota.`, consiglio: "Il testo deve essere già presente nella pagina, non caricato dopo con JavaScript." });
  else if (parole < 300) add({ id: "testo", titolo: "Testo leggibile da Google e dalle AI", esito: "attenzione", testo: `La pagina ha circa ${parole} parole: poco testo per spiegare cosa fai.`, consiglio: "Racconta i tuoi servizi, la zona, i tempi e le domande frequenti dei clienti." });
  else add({ id: "testo", titolo: "Testo leggibile da Google e dalle AI", esito: "ok", testo: `Circa ${parole} parole leggibili direttamente nella pagina.` });

  // 6. Titolo principale (H1)
  const h1 = decod((html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? "").replace(/<[^>]+>/g, " "));
  add(h1
    ? { id: "h1", titolo: "Titolo principale in pagina", esito: "ok", testo: `«${h1.slice(0, 90)}»` }
    : { id: "h1", titolo: "Titolo principale in pagina", esito: "attenzione", testo: "Manca il titolo principale (H1): Google capisce meno di cosa parla la pagina.", consiglio: "In alto nella pagina, un titolo chiaro con il tuo servizio." });

  // 7. Telefono
  add(/<meta[^>]+name=["']viewport["']/i.test(html)
    ? { id: "mobile", titolo: "Pensato per il telefono", esito: "ok", testo: "La pagina è impostata per adattarsi agli schermi dei telefoni." }
    : { id: "mobile", titolo: "Pensato per il telefono", esito: "problema", testo: "La pagina non è impostata per il telefono: da smartphone si vede rimpicciolita.", consiglio: "Serve un tema o un modello «responsive»." });

  // 8. Velocità di risposta
  const ms = pagina.ms;
  add(ms < 1200
    ? { id: "velocita", titolo: "Velocità di risposta", esito: "ok", testo: `Il sito risponde in ${(ms / 1000).toFixed(1)} secondi.` }
    : { id: "velocita", titolo: "Velocità di risposta", esito: ms < 3000 ? "attenzione" : "problema", testo: `Il sito ha impiegato ${(ms / 1000).toFixed(1)} secondi solo per rispondere: chi cerca dal telefono spesso non aspetta.`, consiglio: "Controlla hosting, plugin e immagini pesanti. Misura con PageSpeed Insights di Google." });

  // 9. Sitemap e numero di pagine
  let sitemapUrl = robots.match(/^\s*sitemap:\s*(\S+)/im)?.[1] ?? null;
  let sitemap = sitemapUrl ? await scaricaSilenzioso(sitemapUrl) : null;
  for (const p of ["/sitemap.xml", "/sitemap_index.xml", "/wp-sitemap.xml"]) {
    if (sitemap && sitemap.status < 400 && /<(urlset|sitemapindex)/i.test(sitemap.testo)) break;
    sitemapUrl = `${origine}${p}`;
    sitemap = await scaricaSilenzioso(sitemapUrl);
  }
  let pagine: number | null = null;
  if (sitemap && sitemap.status < 400 && /<(urlset|sitemapindex)/i.test(sitemap.testo)) {
    if (/<sitemapindex/i.test(sitemap.testo)) {
      const figlie = [...sitemap.testo.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)].map((m) => m[1]).slice(0, 8);
      const conti = await Promise.all(figlie.map(async (f) => {
        const x = await scaricaSilenzioso(f);
        return x ? (x.testo.match(/<url>/gi)?.length ?? 0) : 0;
      }));
      pagine = conti.reduce((a, b) => a + b, 0);
    } else pagine = sitemap.testo.match(/<url>/gi)?.length ?? 0;
    add(pagine < 10
      ? { id: "pagine", titolo: "Quante pagine conosce Google", esito: "attenzione", testo: `La sitemap elenca ${pagine} pagine. Google mostra pagine, non siti: con poche pagine intercetti poche ricerche.`, consiglio: "Una pagina per ogni servizio importante, più guide sulle domande dei clienti." }
      : { id: "pagine", titolo: "Quante pagine conosce Google", esito: "ok", testo: `La sitemap elenca ${pagine} pagine.` });
  } else {
    add({ id: "pagine", titolo: "Mappa del sito (sitemap)", esito: "attenzione", testo: "Non troviamo una sitemap: Google deve scoprire le pagine da solo, più lentamente.", consiglio: "Quasi tutte le piattaforme la creano: attivala e inviala da Google Search Console." });
  }

  // 10. Dati strutturati
  const jsonld = [...html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]).join(" ");
  const locale = /"@type"\s*:\s*\[?\s*"(LocalBusiness|[A-Za-z]*(Store|Restaurant|Service|Business|Clinic|Dentist|Attorney|LegalService|Salon|Spa|Hotel|Contractor|Plumber|Electrician|Physician|HealthAndBeautyBusiness|ProfessionalService|AutoRepair|RealEstateAgent))"/.test(jsonld);
  add(locale
    ? { id: "dati", titolo: "Dati per Google Maps e per le AI", esito: "ok", testo: "La pagina descrive l'attività con dati strutturati (indirizzo, tipo di attività, contatti)." }
    : { id: "dati", titolo: "Dati per Google Maps e per le AI", esito: "attenzione", testo: jsonld ? "Ci sono dati strutturati, ma non descrivono l'attività locale." : "Mancano i dati strutturati: Google e gli assistenti AI capiscono meno chi sei, dove sei e cosa fai.", consiglio: "Aggiungi i dati «LocalBusiness» con nome, indirizzo, telefono e orari." });

  // 11. Immagini descritte
  const imgs = html.match(/<img\b[^>]*>/gi) ?? [];
  const senzaAlt = imgs.filter((t) => !/\salt=["'][^"']+["']/i.test(t)).length;
  if (imgs.length >= 3) add(senzaAlt / imgs.length > 0.3
    ? { id: "immagini", titolo: "Immagini descritte", esito: "attenzione", testo: `${senzaAlt} immagini su ${imgs.length} non hanno una descrizione: Google non sa cosa mostrano.`, consiglio: "Aggiungi un testo alternativo che dica cosa c'è nella foto." }
    : { id: "immagini", titolo: "Immagini descritte", esito: "ok", testo: "Le immagini hanno quasi tutte una descrizione." });

  const punti = c.reduce((s, x) => s + (x.esito === "ok" ? 1 : x.esito === "attenzione" ? 0.5 : 0), 0);
  const ordine: Record<Esito, number> = { problema: 0, attenzione: 1, ok: 2 };
  c.sort((a, b) => ordine[a.esito] - ordine[b.esito]);
  return {
    url: pagina.url,
    host: finale.hostname.replace(/^www\./, ""),
    piattaforma: piattaforma(html, pagina.headers),
    pagineInSitemap: pagine,
    millisecondi: ms,
    voto: Math.round((punti / c.length) * 100),
    controlli: c,
  };
}
