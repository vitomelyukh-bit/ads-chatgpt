"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { z } from "zod";
import type { Cliente, Landing } from "@/lib/clienti";
import { db } from "@/lib/db";
import { email, TITROVANO } from "@/lib/email";
import { isRateLimited } from "@/lib/rate-limit";

export type StatoRichiesta = { stato: "idle" } | { stato: "ok" } | { stato: "errore"; messaggio: string };

const schema = z.object({
  nome: z.string().trim().min(2).max(80),
  telefono: z.string().trim().regex(/^[+\d][\d\s./-]{5,19}$/),
  email: z.string().trim().email().max(160).optional().or(z.literal("")),
  messaggio: z.string().trim().max(1000).optional(),
  privacy: z.literal("on"),
});

// "TiTrovano <prova@titrovano.it>" → "prova@titrovano.it"
const indirizzo = (from: string) => from.match(/<([^>]+)>/)?.[1] ?? from;

export async function inviaRichiestaLanding(landingId: string, _: StatoRichiesta, fd: FormData): Promise<StatoRichiesta> {
  if (String(fd.get("sito_web") ?? "")) return { stato: "ok" }; // honeypot
  const p = schema.safeParse(Object.fromEntries(fd));
  if (!p.success) return { stato: "errore", messaggio: "Controlla nome, telefono e consenso privacy." };
  const h = await headers();
  if (isRateLimited(`lp:${h.get("x-forwarded-for")?.split(",")[0]?.trim() || "?"}`)) {
    return { stato: "errore", messaggio: "Troppe richieste. Riprova tra qualche minuto." };
  }
  const [row] = (await db()`select l.*, row_to_json(c.*) as cliente from landing l join clienti c on c.id=l.cliente_id
    where l.id=${landingId} and l.pubblicata`) as (Landing & { cliente: Cliente })[];
  if (!row) return { stato: "errore", messaggio: "Questa pagina non è più attiva." };

  const utm: Record<string, string> = {};
  for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid"]) {
    const v = String(fd.get(k) ?? "").slice(0, 200);
    if (v) utm[k] = v;
  }
  const d = p.data;
  await db()`insert into richieste (cliente_id, landing_id, nome, telefono, email, messaggio, utm)
    values (${row.cliente_id}, ${row.id}, ${d.nome}, ${d.telefono}, ${d.email || null}, ${d.messaggio || null}, ${JSON.stringify(utm)})`;

  // Email con lo stesso Resend del sito. La richiesta è già salvata: se le email
  // non partono la si ritrova comunque nella console.
  const key = process.env.RESEND_API_KEY, from = process.env.RESEND_FROM;
  if (!key || !from) return { stato: "ok" };
  const resend = new Resend(key);
  const c = row.cliente;
  const copia = process.env.LEAD_TO_EMAIL?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];
  const destinatari = c.email_notifiche?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];
  const righe: [string, string][] = [
    ["Nome", d.nome], ["Telefono", d.telefono], ["Email", d.email || "—"], ["Messaggio", d.messaggio || "—"],
    ["Pagina", row.titolo], ["Provenienza", Object.entries(utm).map(([k, v]) => `${k}=${v}`).join(" ") || "—"],
  ];
  const invii: Promise<unknown>[] = [];
  if (destinatari.length || copia.length) {
    // Al cliente: stile TiTrovano (è il nostro servizio che gli porta la richiesta).
    const notifica = email({
      marchio: TITROVANO,
      anteprima: `${d.nome} · ${d.telefono} · da “${row.titolo}”`,
      titolo: `Nuova richiesta per ${c.nome}`,
      evidenzia: "Nuova richiesta",
      blocchi: [
        { tipo: "righe", righe },
        { tipo: "bottone", testo: `Chiama ${d.nome} →`, url: `tel:${d.telefono.replace(/\s/g, "")}` },
        { tipo: "nota", testo: "Ricontatta la persona il prima possibile: chi riceve una risposta veloce è molto più propenso a diventare cliente." },
      ],
    });
    invii.push(resend.emails.send({
      from, to: destinatari.length ? destinatari : copia, bcc: destinatari.length ? copia : undefined, replyTo: d.email || undefined,
      subject: `Nuova richiesta per ${c.nome}: ${d.nome}`,
      ...notifica,
    }));
  }
  if (d.email) {
    // A chi ha compilato: con logo e colore del cliente.
    const marchioCliente = {
      nome: c.nome, colore: c.colore, logo: c.logo_url,
      piede: [c.nome, c.citta, c.telefono, c.sito].filter(Boolean).join(" · "),
    };
    const ricevuta = email({
      marchio: marchioCliente,
      anteprima: `${c.nome} ti ricontatterà al più presto.`,
      titolo: `Grazie ${d.nome}, abbiamo ricevuto la tua richiesta`,
      blocchi: [
        { tipo: "p", testo: `Grazie per averci scritto. ${c.nome} ti ricontatterà al più presto al numero ${d.telefono}.` },
        ...(c.telefono ? [{ tipo: "bottone" as const, testo: `Chiamaci: ${c.telefono}`, url: `tel:${c.telefono.replace(/\s/g, "")}` }] : []),
        { tipo: "nota", testo: "Se vuoi aggiungere qualcosa, rispondi a questa email." },
      ],
    });
    invii.push(resend.emails.send({
      from: `${c.nome.replace(/[<>"]/g, "")} <${indirizzo(from)}>`, to: d.email, replyTo: destinatari[0],
      subject: `Abbiamo ricevuto la tua richiesta · ${c.nome}`,
      ...ricevuta,
    }));
  }
  await Promise.allSettled(invii).then((r) => r.forEach((x) => x.status === "rejected" && console.error("[richiesta-landing] email", x.reason)));
  return { stato: "ok" };
}
