import { createHmac, timingSafeEqual } from "node:crypto";

// I dati della richiesta viaggiano firmati dal modulo alla prenotazione,
// così non serve un database e nessuno può prenotare a nome di altri.
export type Lead = {
  nome: string; attivita: string; sito: string; settore: string; citta: string;
  budget: string; email: string; telefono: string; exp: number;
};

const segreto = () => process.env.BOOKING_SECRET ?? "";

export function firmaLead(l: Omit<Lead, "exp">): string | null {
  if (!segreto()) return null;
  const body = Buffer.from(JSON.stringify({ ...l, exp: Date.now() + 2 * 3600_000 })).toString("base64url");
  return `${body}.${createHmac("sha256", segreto()).update(body).digest("base64url")}`;
}

export function leggiLead(token: string): Lead | null {
  const [body, sig] = token.split(".");
  if (!body || !sig || !segreto()) return null;
  const atteso = createHmac("sha256", segreto()).update(body).digest("base64url");
  if (sig.length !== atteso.length || !timingSafeEqual(Buffer.from(sig), Buffer.from(atteso))) return null;
  const l = JSON.parse(Buffer.from(body, "base64url").toString()) as Lead;
  return l.exp > Date.now() ? l : null;
}
