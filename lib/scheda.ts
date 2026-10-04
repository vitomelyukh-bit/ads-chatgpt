// Servizio "Scheda Google sempre viva": prezzi, testi condivisi e controlli.
export const scheda = {
  nome: "Scheda Google sempre viva",
  path: "/scheda-google",
  prezzoMese: 59,
  prezzoCard: 40,
  messaggioWhatsApp: "Ciao, vorrei info sulla Scheda Google sempre viva per la mia attività",
};

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

export const CATEGORIE = ["Ristorante o pizzeria", "Bar o caffetteria", "Negozio", "Artigiano", "Studio professionale", "Centro estetico o parrucchiere", "Hotel o B&B", "Altro"];
export const PROVINCE_HINT = "Sigla, es. MI";
