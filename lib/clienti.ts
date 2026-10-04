import { db } from "@/lib/db";

export type Cliente = {
  id: string; creato_il: string; nome: string; slug: string; settore: string | null; citta: string | null;
  telefono: string | null; email_notifiche: string | null; sito: string | null; privacy_url: string | null;
  colore: string; logo_url: string | null; meta_pixel_id: string | null; note: string | null;
};
export type Faq = { domanda: string; risposta: string };
export type Landing = {
  id: string; creata_il: string; aggiornata_il: string; cliente_id: string; slug: string; titolo: string;
  sottotitolo: string | null; punti: string[]; media_url: string | null; media_tipo: string | null;
  chi_siamo: string | null; faq: Faq[]; cta: string; domanda_form: string | null; pubblicata: boolean;
};
export type Richiesta = {
  id: number; creata_il: string; cliente_id: string; landing_id: string | null; nome: string; telefono: string | null;
  email: string | null; messaggio: string | null; utm: Record<string, string>; stato: string;
};
export type Creativita = {
  id: number; creata_il: string; cliente_id: string; tipo: "video" | "immagine"; url: string; titolo: string | null;
  testo: string | null; stato: "da_approvare" | "approvata" | "scartata"; note: string | null;
};

export const slugify = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "pagina";

export async function getCliente(id: string) {
  const [c] = (await db()`select * from clienti where id = ${id}`) as Cliente[];
  return c ?? null;
}

export async function getLandingPubblica(clienteSlug: string, landingSlug: string) {
  const rows = (await db()`
    select l.*, row_to_json(c.*) as cliente from landing l join clienti c on c.id = l.cliente_id
    where c.slug = ${clienteSlug} and l.slug = ${landingSlug} and l.pubblicata`) as (Landing & { cliente: Cliente })[];
  return rows[0] ?? null;
}

// "Una riga per punto" e "Domanda | Risposta" per riga: facili da scrivere.
export const righe = (s: unknown) => String(s ?? "").split("\n").map((x) => x.trim()).filter(Boolean);
export const parseFaq = (s: unknown): Faq[] =>
  righe(s).map((r) => r.split("|")).filter((p) => p.length >= 2).map(([d, ...r]) => ({ domanda: d.trim(), risposta: r.join("|").trim() }));
export const faqToText = (f: Faq[]) => f.map((x) => `${x.domanda} | ${x.risposta}`).join("\n");
