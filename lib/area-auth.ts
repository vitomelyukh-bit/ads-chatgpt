import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHmac, timingSafeEqual } from "node:crypto";
import { site } from "@/lib/site";

// Accesso dei clienti alla loro area (/area): link firmato via email, poi un cookie firmato.
const COOKIE = "tt_area";
const segreto = () => process.env.AREA_SECRET || process.env.BOOKING_SECRET || "";
const firma = (v: string) => createHmac("sha256", `area:${segreto()}`).update(v).digest("base64url");
const uguali = (a: string, b: string) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));

function token(id: number, msValidita: number) {
  const v = `${id}.${Date.now() + msValidita}`;
  return `${v}.${firma(v)}`;
}
function leggi(t: string | undefined | null): number | null {
  const [id, scade, sig] = (t ?? "").split(".");
  if (!id || !scade || !sig || !segreto() || Number(scade) < Date.now()) return null;
  return uguali(sig, firma(`${id}.${scade}`)) ? Number(id) : null;
}

// Link da mettere nelle email: vale 14 giorni e porta direttamente dentro.
export const linkArea = (clienteId: number, dove = "") => `${site.url}/area/entra?t=${token(clienteId, 14 * 86400_000)}${dove ? `&dove=${encodeURIComponent(dove)}` : ""}`;
export const leggiTokenArea = leggi;

export async function apriSessioneArea(clienteId: number) {
  const giorni = 90;
  (await cookies()).set(COOKIE, token(clienteId, giorni * 86400_000), {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: giorni * 86400,
  });
}
export async function chiudiSessioneArea() {
  (await cookies()).delete(COOKIE);
}
export async function clienteSessione() {
  return leggi((await cookies()).get(COOKIE)?.value);
}
export async function requireCliente() {
  const id = await clienteSessione();
  if (!id) redirect("/area/accedi");
  return id;
}
