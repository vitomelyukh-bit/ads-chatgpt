import { controllaSito, ErroreControllo } from "@/lib/controllo-sito";
import { isRateLimited } from "@/lib/rate-limit";

export const maxDuration = 30;

// Controllo SEO gratuito: GET /api/controllo?sito=tuosito.it
export async function GET(req: Request) {
  const sito = new URL(req.url).searchParams.get("sito")?.slice(0, 300) ?? "";
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "sconosciuto";
  if (isRateLimited(`controllo:${ip}`, Date.now(), 10)) {
    return Response.json({ errore: "Hai fatto molti controlli di seguito. Riprova tra qualche minuto." }, { status: 429 });
  }
  try {
    const r = await controllaSito(sito);
    console.log("[controllo]", r.host, r.voto, r.piattaforma ?? "");
    return Response.json(r, { headers: { "cache-control": "no-store" } });
  } catch (e) {
    if (e instanceof ErroreControllo) return Response.json({ errore: e.message }, { status: 400 });
    console.error("[controllo]", sito, e);
    return Response.json({ errore: "Non siamo riusciti a controllare il sito. Riprova tra poco." }, { status: 502 });
  }
}
