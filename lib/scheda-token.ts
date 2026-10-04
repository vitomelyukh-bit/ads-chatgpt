import { createHmac, timingSafeEqual } from "node:crypto";

// Token firmato per una richiesta: serve per pagare e per gestire l'abbonamento
// senza login. Non scade: il link "gestisci" resta valido nelle email.
const segreto = () => process.env.BOOKING_SECRET ?? process.env.ADMIN_SECRET ?? "";
export const firmaRichiesta = (id: number) => `${id}.${createHmac("sha256", segreto()).update(`scheda:${id}`).digest("base64url").slice(0, 32)}`;
export function leggiRichiesta(token: string | null | undefined): number | null {
  const [id, sig] = String(token ?? "").split(".");
  if (!id || !sig || !segreto()) return null;
  const atteso = firmaRichiesta(Number(id)).split(".")[1];
  return sig.length === atteso.length && timingSafeEqual(Buffer.from(sig), Buffer.from(atteso)) ? Number(id) : null;
}
