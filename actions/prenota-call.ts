"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { booking } from "@/lib/booking-config";
import { calendarioConfigurato, creaEvento, occupato } from "@/lib/google-calendar";
import { leggiLead } from "@/lib/lead-token";
import { isRateLimited } from "@/lib/rate-limit";
import { etichettaCompleta, libero, orariCandidati } from "@/lib/slots";
import { email, TITROVANO } from "@/lib/email";
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
    const f = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const gcal = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Call con ${site.name}`)}&dates=${f(inizio)}/${f(fine)}&details=${encodeURIComponent(`Analisi gratuita per ${lead.attivita}. Ti chiamiamo al ${lead.telefono}.`)}`;
    const conferma = email({
      marchio: TITROVANO,
      anteprima: `Ti chiamiamo ${quando}.`,
      titolo: `Ciao ${lead.nome}, la call è confermata`,
      evidenzia: "confermata",
      blocchi: [
        { tipo: "evidenza", etichetta: "La tua call", testo: `${quando.charAt(0).toUpperCase()}${quando.slice(1)}` },
        { tipo: "p", testo: `Ti chiamiamo al numero ${lead.telefono}. Dura circa ${booking.durataMin} minuti: guardiamo insieme il caso di ${lead.attivita} e quale canale ha più senso per te.` },
        { tipo: "bottone", testo: "Aggiungi a Google Calendar →", url: gcal },
        { tipo: "nota", testo: "In allegato trovi anche l'invito per Outlook e Apple Calendar.\nSe devi spostarla, rispondi a questa email." },
      ],
    });
    const avviso = email({
      marchio: TITROVANO,
      anteprima: `${lead.attivita} · ${quando}`,
      titolo: `Call prenotata: ${lead.attivita}`,
      evidenzia: "Call prenotata",
      blocchi: [
        { tipo: "evidenza", etichetta: "Quando", testo: `${quando.charAt(0).toUpperCase()}${quando.slice(1)}` },
        { tipo: "righe", righe: [["Nome", lead.nome], ["Telefono", lead.telefono], ["Email", lead.email], ["Settore", lead.settore], ["Città", lead.citta || "—"], ["Sito", lead.sito || "—"], ["Budget indicativo", lead.budget]] },
        { tipo: "bottone", testo: `Chiama ${lead.nome} →`, url: `tel:${lead.telefono.replace(/\s/g, "")}` },
        { tipo: "nota", testo: "L'evento è già nel tuo Google Calendar." },
      ],
    });
    await Promise.all([
      resend.emails.send({
        from, to: lead.email, replyTo: to[0],
        subject: `Call confermata: ${quando} · ${site.name}`,
        ...conferma,
        attachments: [{ filename: "call-titrovano.ics", content: Buffer.from(invito).toString("base64") }],
      }),
      resend.emails.send({ from, to, replyTo: lead.email, subject: `Call prenotata: ${lead.attivita} · ${quando}`, ...avviso }),
    ]).catch((e) => console.error("[prenota-call] email", e));
  }
  return { ok: true, quando };
}
