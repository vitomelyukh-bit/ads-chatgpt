import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE = "tt_console";

function firma(valore: string) {
  const segreto = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "";
  return createHmac("sha256", segreto).update(valore).digest("hex");
}

export function passwordValida(pw: string) {
  const attesa = process.env.ADMIN_PASSWORD;
  if (!attesa) return false;
  const a = Buffer.from(pw);
  const b = Buffer.from(attesa);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function apriSessione() {
  const scade = Date.now() + 30 * 24 * 3600 * 1000;
  const valore = `${scade}.${firma(String(scade))}`;
  (await cookies()).set(COOKIE, valore, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(scade),
  });
}

export async function chiudiSessione() {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin() {
  const v = (await cookies()).get(COOKIE)?.value;
  if (!v) return false;
  const [scade, sig] = v.split(".");
  if (!scade || !sig || Number(scade) < Date.now()) return false;
  const attesa = firma(scade);
  return sig.length === attesa.length && timingSafeEqual(Buffer.from(sig), Buffer.from(attesa));
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/console/login");
}
