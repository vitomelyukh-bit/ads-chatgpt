import { giro } from "@/lib/maps";

export const maxDuration = 300;

// Giro automatico: lo chiamano ogni ora GitHub Actions e una volta al giorno il cron di Vercel.
export async function GET(req: Request) {
  const segreto = process.env.CRON_SECRET;
  if (!segreto || req.headers.get("authorization") !== `Bearer ${segreto}`) return new Response("Non autorizzato", { status: 401 });
  const log = await giro();
  return Response.json({ ok: true, log });
}
