// Controlli sui contenuti di content/. Esce con codice 1 se trova errori.
// Uso: node content-engine/check-content.mjs
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const dir = (d) => path.join(ROOT, "content", d);
const read = (d) =>
  fs.readdirSync(dir(d)).filter((f) => f.endsWith(".mdx")).map((f) => {
    const { data, content } = matter(fs.readFileSync(path.join(dir(d), f), "utf8"));
    return { file: `content/${d}/${f}`, slug: f.replace(/\.mdx$/, ""), data, body: content };
  });

const settori = read("settori");
const guide = read("guide");
const settoriSlugs = new Set(settori.map((s) => s.slug));
const guideSlugs = new Set(guide.map((g) => g.slug));
const errors = [];
const err = (file, msg) => errors.push(`${file}: ${msg}`);

const VIETATE = /(?<![\p{L}])cit(?:a|o|i|e|ò|ar\p{L}*|at\p{L}*|az\p{L}*|and\p{L}*|an\p{L}*|er\p{L}*|in\p{L}*)(?![\p{L}])/iu;
const PREZZO = /(€\s?\d|\d\s?€|\beuro\b|\bEUR\b)/i;
const PERCENTUALE = /\d+([.,]\d+)?\s?%|\bper cento\b/i;
const SOSPETTI = /\b(secondo (uno|un) studio|una ricerca (ha|di)|i dati (mostrano|dicono)|statistiche (dicono|mostrano))\b/i;
const VENDITA = /\b(garantiamo (risultati|vendite|clienti|il)|risultati garantiti|posizionamento garantito|ritorno garantito|partner (ufficiale )?di openai|certificati openai|i nostri clienti (ottengono|hanno ottenuto))\b/i;
const CITTA = ["roma","milano","napoli","torino","palermo","genova","bologna","firenze","bari","catania","venezia","verona","messina","padova","trieste","brescia","parma","taranto","prato","modena","reggio","perugia","livorno","ravenna","cagliari","foggia","rimini","salerno","ferrara","sassari","latina","monza","siracusa","pescara","bergamo","vicenza","trento","bolzano","lecce","matera","olbia","siena","taormina"];

const testo = (x) =>
  [x.data.title, x.data.description, x.data.h1, x.data.intro, x.data.rispostaBreve, x.body,
   ...(x.data.faq ?? []).flatMap((f) => [f.domanda, f.risposta])].filter(Boolean).join("\n");
const parole = (s) => s.replace(/[#*_>\-`\[\]()]/g, " ").split(/\s+/).filter(Boolean).length;

for (const x of [...settori, ...guide]) {
  const t = testo(x);
  const m = t.match(VIETATE);
  if (m) err(x.file, `parola vietata "${m[0]}" (usa trovare/consigliare/"esce il tuo nome")`);
  if (/\bciTati\b|\bCitati\b/.test(t)) err(x.file, `vecchio marchio "Citati"`);
  if (PREZZO.test(t) && !/budget|annunc/i.test(t.slice(Math.max(0, t.search(PREZZO) - 200), t.search(PREZZO) + 50))) err(x.file, `sembra contenere un prezzo: "${t.match(PREZZO)[0]}"`);
  if (VENDITA.test(t)) err(x.file, `linguaggio da vendita: "${t.match(VENDITA)[0]}"`);
  if (/^#\s/m.test(x.body)) err(x.file, `titolo "# " nel corpo: parti da "##"`);
  if (/^\s*\|.*\|\s*$/m.test(x.body)) err(x.file, `tabella Markdown non supportata: usa una lista`);
  if (!x.data.title || x.data.title.length > 70) err(x.file, `title mancante o oltre 70 caratteri (${x.data.title?.length ?? 0})`);
  if (!x.data.description || x.data.description.length > 170) err(x.file, `description mancante o oltre 170 caratteri (${x.data.description?.length ?? 0})`);
  if (!/· TiTrovano$/.test(x.data.title ?? "")) err(x.file, `il title deve finire con " · TiTrovano"`);
  for (const [, href] of x.body.matchAll(/\]\((\/[^)\s#]*)/g)) {
    const [, tipo, slug] = href.split("/");
    const ok =
      href === "/" || href === "/analisi-gratuita" || href === "/settori" || href === "/guide" ||
      (tipo === "settori" && settoriSlugs.has(slug)) || (tipo === "guide" && guideSlugs.has(slug));
    if (!ok) err(x.file, `link interno rotto: ${href}`);
  }
  for (const [, href] of x.body.matchAll(/\]\((https?:[^)\s]+)/g)) {
    if (!href.startsWith("https://")) err(x.file, `link esterno non https: ${href}`);
  }
}

const titoli = new Map();
for (const g of guide) {
  const d = g.data;
  const t = testo(g);
  if (PERCENTUALE.test(t)) err(g.file, `percentuale "${t.match(PERCENTUALE)[0]}": niente numeri senza fonte verificata (togli o riformula)`);
  if (SOSPETTI.test(t)) err(g.file, `formula da statistica: "${t.match(SOSPETTI)[0]}" — serve una fonte linkata o va tolta`);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(g.slug) || g.slug.length > 60) err(g.file, `slug non valido`);
  const pezzi = g.slug.split("-");
  const citta = CITTA.find((c) => pezzi.includes(c));
  if (citta) err(g.file, `slug con nome di città ("${citta}"): niente pagine per città`);
  for (const k of ["h1", "rispostaBreve", "datePublished", "dateModified"]) if (!d[k]) err(g.file, `manca "${k}"`);
  const frasi = (d.rispostaBreve ?? "").split(/(?<=[.!?])\s+/).filter(Boolean).length;
  if (frasi < 2 || frasi > 4) err(g.file, `rispostaBreve deve avere 2-3 frasi (ne ha ${frasi})`);
  // Le prime 6 guide (3 ottobre 2026) sono più brevi: la soglia vale per le nuove.
  const n = parole(g.body);
  if (String(d.datePublished) > "2026-10-03" && (n < 450 || n > 1400)) err(g.file, `corpo di ${n} parole: deve stare tra 500 e 1.200 circa`);
  if (!/\]\(\/analisi-gratuita\)/.test(g.body)) err(g.file, `manca il link all'[analisi gratuita](/analisi-gratuita)`);
  if (!/\]\(\/(guide|settori)\/[a-z0-9-]+\)/.test(g.body)) err(g.file, `serve almeno un link interno a una guida o a un settore`);
  for (const s of d.settoriCorrelati ?? []) if (!settoriSlugs.has(s)) err(g.file, `settoriCorrelati: "${s}" non esiste`);
  for (const s of d.guideCorrelate ?? []) if (!guideSlugs.has(s) || s === g.slug) err(g.file, `guideCorrelate: "${s}" non valida`);
  if (!(d.settoriCorrelati ?? []).length) err(g.file, `indica almeno un settore in settoriCorrelati`);
  // Articoli nuovi: verticali, con link alla pagina del loro settore.
  if (String(d.datePublished) > "2026-10-03" && d.settoriCorrelati?.[0] && !g.body.includes(`](/settori/${d.settoriCorrelati[0]})`)) {
    err(g.file, `articolo verticale: linka la pagina del settore principale (/settori/${d.settoriCorrelati[0]})`);
  }
  for (const k of ["title", "h1"]) {
    const v = String(d[k] ?? "").toLowerCase();
    if (titoli.has(v)) err(g.file, `${k} uguale a ${titoli.get(v)}`);
    titoli.set(v, g.file);
  }
  for (const k of ["datePublished", "dateModified"]) {
    if (d[k] && !/^\d{4}-\d{2}-\d{2}$/.test(String(d[k]))) err(g.file, `${k} deve essere AAAA-MM-GG tra virgolette`);
  }
}

const topics = JSON.parse(fs.readFileSync(path.join(ROOT, "content-engine/topics.json"), "utf8"));
for (const a of topics.argomenti) {
  if (a.stato === "fatto" && a.slug && !guideSlugs.has(a.slug)) err("content-engine/topics.json", `argomento "fatto" con slug inesistente: ${a.slug}`);
}

if (errors.length) {
  console.error(`✗ ${errors.length} problemi:\n- ` + errors.join("\n- "));
  process.exit(1);
}
console.log(`✓ Contenuti a posto: ${settori.length} settori, ${guide.length} guide.`);
