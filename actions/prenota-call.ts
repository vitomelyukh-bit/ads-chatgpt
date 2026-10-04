"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { booking } from "@/lib/booking-config";
import { calendarioConfigurato, creaEvento, occupato } from "@/lib/google-calendar";
import { leggiLead } from "@/lib/lead-token";
import { isRateLimited } from "@/lib/rate-limit";
import { etichettaCompleta, libero, orariCandidati } from "@/lib/slots";
import { site } from "@/lib/site";

export type EsitoPrenotazione = { ok: true; quando: string } | { ok: false; errore: string };

function ics(inizio: Date, fine: Date, titolo: string, descrizione: string) {
  const f = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  return [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//TiTrovano//Call//IT", "METHOD:PUBLISH", "BEGIN:VEVENT",
    `UID:${f(inizio)}-${Math.random().toString(36).slice(2)}@titrovano.it`, `DTSTAMP:${f(new Date())}`,
    `DTSTART:${f(inizio)}`, `DTEND:${f(fine)}`, `SUMMARY:${titolo}`,
    `DESCRIPTION:${descrizione.replace(/\n/g, "\\n")}`, "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
}

export async function prenotaCall(token: string, iso: string): Promise<EsitoPrenotazione> {
  if (!calendarioConfigurato()) return { ok: false, errore: "La prenotazione online non è disponibile. Ti chiamiamo noi." };
  const lead = leggiLead(token);
  if (!lead) return { ok: false, errore: "Il tempo per scegliere l'orario è scaduto. Compila di nuovo il modulo, oppure aspetta: ti chiamiamo noi." };

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "sconosciuto";
  if (isRateLimited(`call:${ip}`)) return { ok: false, errore: "Troppi tentativi. Riprova tra qualche minuto." };

  const inizio = new Date(iso);
  // L'orario deve essere uno di quelli ammessi e ancora libero.
  if (!orariCandidati().some((t) => t.getTime() === inizio.getTime())) {
    return { ok: false, errore: "Questo orario non è più disponibile. Scegline un altro." };
  }
  const fine = new Date(inizio.getTime() + booking.durataMin * 60_000);
  try {
    if (!libero(inizio, await occupato(inizio, fine))) return { ok: false, errore: "Questo orario è appena stato occupato. Scegline un altro." };
    const descrizione = [
      `Nome: ${lead.nome}`, `Attività: ${lead.attivita}`, `Telefono: ${lead.telefono}`, `Email: ${lead.email}`,
      `Settore: ${lead.settore}`, `Città: ${lead.citta || "—"}`, `Sito: ${lead.sito || "—"}`, `Budget indicativo: ${lead.budget}`,
      "", "Prenotata da titrovano.it",
    ].join("\n");
    await creaEvento({ inizio, fine, titolo: `Call TiTrovano – ${lead.attivita}`, descrizione });
  } catch (e) {
    console.error("[prenota-call]", e);
    return { ok: false, errore: "Non siamo riusciti a fissare la call. Ti chiamiamo noi per trovare un orario." };
  }

  const quando = etichettaCompleta(inizio);
  const from = process.env.RESEND_FROM;
  const to = process.env.LEAD_TO_EMAIL?.split(",").map((s) => s.trim()).filter(Boolean);
  if (process.env.RESEND_API_KEY && from && to?.length) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const invito = ics(inizio, fine, `Call con ${site.name}`, `Analisi gratuita: annunci su ChatGPT per ${lead.attivita}. Ti chiamiamo al ${lead.telefono}.`);
    await Promise.all([
      resend.emails.send({
        from, to: lead.email, replyTo: to[0],
        subject: `Call confermata: ${quando} · ${site.name}`,
        text: [`Ciao ${lead.nome},`, "", `la call per l'analisi gratuita è fissata per ${quando} (ora italiana).`,
          `Ti chiamiamo al numero ${lead.telefono}. Dura circa ${booking.durataMin} minuti.`, "",
          "Se devi spostarla, rispondi a questa email.", "", site.name, site.url].join("\n"),
        attachments: [{ filename: "call-titrovano.ics", content: Buffer.from(invito).toString("base64") }],
      }),
      resend.emails.send({
        from, to, replyTo: lead.email,
        subject: `Call prenotata: ${lead.attivita} · ${quando}`,
        text: `${lead.nome} (${lead.attivita}) ha prenotato la call per ${quando}.\nTelefono: ${lead.telefono}\nEmail: ${lead.email}\nSettore: ${lead.settore}\nBudget: ${lead.budget}\n\nL'evento è già nel tuo Google Calendar.`,
      }),
    ]).catch((e) => console.error("[prenota-call] email", e));
  }
  return { ok: true, quando };
}
