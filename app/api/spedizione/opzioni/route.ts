import { isAdmin } from "@/lib/auth";
import { opzioniSpedizione, serviziGrezzi } from "@/lib/packlink";
import { isRateLimited } from "@/lib/rate-limit";
import { isTipoExtra } from "@/lib/scheda";

// Opzioni di spedizione Packlink per un CAP italiano (a casa e punto di ritiro).
export async function GET(req: Request) {
  const u = new URL(req.url);
  const tipo = u.searchParams.get("tipo"), cap = (u.searchParams.get("cap") ?? "").trim();
  if (!isTipoExtra(tipo) || !/^\d{5}$/.test(cap)) return Response.json({ errore: "Scrivi un CAP di 5 cifre." }, { status: 400 });
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "?";
  if (isRateLimited(`sped:${ip}`, Date.now(), 40)) return Response.json({ errore: "Troppe richieste, riprova tra poco." }, { status: 429 });
  try {
    if (u.searchParams.get("grezzo") && (await isAdmin())) return Response.json((await serviziGrezzi(tipo, cap)).slice(0, 3));
    return Response.json({ opzioni: await opzioniSpedizione(tipo, cap) });
  } catch (e) {
    console.error("[spedizione] opzioni", e);
    return Response.json({ errore: "Non riusciamo a calcolare la spedizione per questo CAP. Controlla il CAP o riprova." }, { status: 502 });
  }
}
