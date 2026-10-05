import { createHmac } from "node:crypto";
import { isAdmin } from "@/lib/auth";
import { googleConfigurato, scambiaCodice, urlAutorizzazione } from "@/lib/gbp";
import { site } from "@/lib/site";

// Collega l'account Google di TiTrovano (una volta sola, dalla console).
const redirectUri = () => `${site.url}/api/google/oauth`;
const stato = () => createHmac("sha256", process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "x").update("google-oauth").digest("hex").slice(0, 24);

export async function GET(req: Request) {
  if (!(await isAdmin())) return Response.redirect(`${site.url}/console/login`, 302);
  if (!googleConfigurato()) return Response.redirect(`${site.url}/console/maps?google=manca-config`, 302);
  const u = new URL(req.url);
  const code = u.searchParams.get("code");
  if (!code) return Response.redirect(urlAutorizzazione(redirectUri(), stato()), 302);
  if (u.searchParams.get("state") !== stato()) return new Response("Stato non valido", { status: 400 });
  try {
    await scambiaCodice(code, redirectUri());
    return Response.redirect(`${site.url}/console/maps?google=ok`, 302);
  } catch (e) {
    return Response.redirect(`${site.url}/console/maps?google=${encodeURIComponent((e as Error).message)}`, 302);
  }
}
