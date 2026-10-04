import { booking } from "@/lib/booking-config";
import { calendarioConfigurato, occupato } from "@/lib/google-calendar";
import { libero, orariCandidati, raggruppa } from "@/lib/slots";

export const dynamic = "force-dynamic";

// Orari liberi per la call, letti dal Google Calendar del titolare.
export async function GET() {
  if (!calendarioConfigurato()) return Response.json({ attivo: false, giorni: [] });
  try {
    const candidati = orariCandidati();
    if (!candidati.length) return Response.json({ attivo: true, giorni: [] });
    const busy = await occupato(candidati[0], new Date(candidati.at(-1)!.getTime() + booking.durataMin * 60_000));
    const giorni = raggruppa(candidati.filter((t) => libero(t, busy)));
    return Response.json({ attivo: true, durata: booking.durataMin, giorni }, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    console.error("[orari]", e);
    return Response.json({ attivo: false, giorni: [] }, { status: 200 });
  }
}
