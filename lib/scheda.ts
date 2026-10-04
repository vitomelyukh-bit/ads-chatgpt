// Servizio principale "Più clienti da Google Maps": prezzi, testi condivisi e controlli.
export const scheda = {
  nome: "Più clienti da Google Maps",
  path: "/",
  form: "/#attiva",
  prezzoMese: 59,
  messaggioWhatsApp: "Ciao, vorrei più clienti da Google Maps per la mia attività",
};

// Extra facoltativi da banco: chi li tocca col telefono apre la pagina delle recensioni.
export type TipoExtra = "card" | "piedistallo";
export const EXTRA: Record<TipoExtra, { nome: string; prezzo: number; descrizione: string; priceEnv: string }> = {
  card: { nome: "Card da banco", prezzo: 40, descrizione: "Una card da appoggiare sul bancone o in vetrina.", priceEnv: "STRIPE_PRICE_CARD" },
  piedistallo: { nome: "Piedistallo da banco", prezzo: 49.99, descrizione: "Sta in piedi da solo sul bancone, ben visibile.", priceEnv: "STRIPE_PRICE_PIEDISTALLO" },
};
export const isTipoExtra = (v: unknown): v is TipoExtra => v === "card" || v === "piedistallo";

// 49.99 → "49,99 €", 40 → "40 €"
export const euro = (n: number) => `${n.toLocaleString("it-IT", { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 })} €`;

// Numero WhatsApp in formato internazionale, solo cifre (es. 393331234567).
export function linkWhatsApp() {
  const n = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/\D/g, "");
  return n ? `https://wa.me/${n}?text=${encodeURIComponent(scheda.messaggioWhatsApp)}` : null;
}

// Link validi della scheda: google.<dominio>/maps, maps.app.goo.gl, g.page, g.co
export function isLinkMaps(raw: string) {
  try {
    const u = new URL(raw.trim());
    if (u.protocol !== "https:" && u.protocol !== "http:") return false;
    const h = u.hostname.toLowerCase().replace(/^www\./, "");
    if (/^google\.[a-z.]{2,6}$/.test(h) || h === "maps.google.com" || /^maps\.google\.[a-z.]{2,6}$/.test(h)) {
      return h.startsWith("maps.") || u.pathname.startsWith("/maps");
    }
    return h === "maps.app.goo.gl" || h === "g.page" || h === "g.co";
  } catch {
    return false;
  }
}
