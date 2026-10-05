import { isAdmin } from "@/lib/auth";
import { puntiRitiro } from "@/lib/packlink";
import { isRateLimited } from "@/lib/rate-limit";

// Punti di ritiro di un servizio Packlink vicino a un CAP.
export async function GET(req: Request) {
  const u = new URL(req.url);
  const servizio = (u.searchParams.get("servizio") ?? "").trim(), cap = (u.searchParams.get("cap") ?? "").trim();
  if (!/^[\w-]+$/.test(servizio) || !/^\d{5}$/.test(cap)) return Response.json({ errore: "Richiesta non valida." }, { status: 400 });
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "?";
  if (isRateLimited(`punti:${ip}`, Date.now(), 60)) return Response.json({ errore: "Troppe richieste, riprova tra poco." }, { status: 429 });
  try {
    if (u.searchParams.get("grezzo") && (await isAdmin())) {
      const r = await fetch(`https://api.packlink.com/v1/dropoffs/${servizio}/IT/${cap}`, { headers: { Authorization: process.env.PACKLINK_API_KEY! } });
      return Response.json(((await r.json()) as unknown[]).slice(0, 2));
    }
    return Response.json({ punti: await puntiRitiro(servizio, cap) });
  } catch (e) {
    console.error("[spedizione] punti", e);
    return Response.json({ errore: "Non riusciamo a caricare i punti di ritiro. Riprova." }, { status: 502 });
  }
}
