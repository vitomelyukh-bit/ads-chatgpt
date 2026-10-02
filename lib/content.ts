import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

const CONTENT_DIR = path.join(process.cwd(), "content");

const faqItem = z.object({ domanda: z.string(), risposta: z.string() });

const settoreSchema = z.object({
  nome: z.string(),
  title: z.string().max(70),
  description: z.string().max(170),
  h1: z.string(),
  intro: z.string(),
  ordine: z.number().default(100),
  domande: z
    .array(z.object({ testo: z.string(), lingua: z.enum(["it", "en"]).default("it") }))
    .min(4),
  esempioRisposta: z.object({ domanda: z.string(), lingua: z.enum(["it", "en"]).default("it") }),
  faq: z.array(faqItem).default([]),
  guideCorrelate: z.array(z.string()).default([]),
});

const guidaSchema = z.object({
  title: z.string().max(70),
  description: z.string().max(170),
  h1: z.string(),
  rispostaBreve: z.string(),
  ordine: z.number().default(100),
  datePublished: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  dateModified: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  faq: z.array(faqItem).default([]),
  settoriCorrelati: z.array(z.string()).default([]),
  guideCorrelate: z.array(z.string()).default([]),
});

export type Faq = z.infer<typeof faqItem>;
export type Settore = z.infer<typeof settoreSchema> & { slug: string; body: string };
export type Guida = z.infer<typeof guidaSchema> & { slug: string; body: string };

function load<T extends object>(dir: string, schema: z.ZodType<T>): (T & { slug: string; body: string })[] {
  const full = path.join(CONTENT_DIR, dir);
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const { data, content } = matter(fs.readFileSync(path.join(full, file), "utf8"));
      const parsed = schema.safeParse(data);
      if (!parsed.success) {
        throw new Error(`Frontmatter non valido in content/${dir}/${file}: ${parsed.error.message}`);
      }
      // L'H1 lo mette la pagina: nel corpo si parte da ##.
      if (/^#\s/m.test(content)) {
        throw new Error(`content/${dir}/${file}: non usare titoli "# " nel corpo, parti da "##".`);
      }
      return { ...parsed.data, slug, body: content };
    });
}

let settoriCache: Settore[] | undefined;
let guideCache: Guida[] | undefined;

export function getSettori(): Settore[] {
  settoriCache ??= load("settori", settoreSchema).sort(
    (a, b) => a.ordine - b.ordine || a.nome.localeCompare(b.nome, "it"),
  );
  return settoriCache;
}

export function getGuide(): Guida[] {
  guideCache ??= load("guide", guidaSchema).sort((a, b) => a.ordine - b.ordine);
  return guideCache;
}

export const getSettore = (slug: string) => getSettori().find((s) => s.slug === slug);
export const getGuida = (slug: string) => getGuide().find((g) => g.slug === slug);

// Risolve una lista di slug ignorando quelli inesistenti (ma lo segnala in build).
export function resolve<T extends { slug: string }>(all: T[], slugs: string[], from: string): T[] {
  return slugs.flatMap((s) => {
    const hit = all.find((x) => x.slug === s);
    if (!hit) console.warn(`[content] ${from}: collegamento a "${s}" inesistente, ignorato.`);
    return hit ? [hit] : [];
  });
}

// Valori della select "settore" del form: i settori del sito più "Altro".
export function settoreOptions(): string[] {
  return [...getSettori().map((s) => s.nome), "Altro"];
}
