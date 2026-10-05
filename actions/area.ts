"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Resend } from "resend";
import { chiudiSessioneArea, linkArea, requireCliente } from "@/lib/area-auth";
import { db } from "@/lib/db";
import { email, TITROVANO } from "@/lib/email";
import { approvaRisposta } from "@/lib/maps";
import { isRateLimited } from "@/lib/rate-limit";

// Azioni dell'area clienti: ogni azione controlla che il dato sia del cliente collegato.

export async function richiediAccesso(_: unknown, fd: FormData) {
  const mail = String(fd.get("email") ?? "").trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(mail)) return { errore: "Controlla l'indirizzo email." };
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "?";
  if (isRateLimited(`area:${ip}`)) return { errore: "Troppi tentativi. Riprova tra qualche minuto." };
  const clienti = (await db()`select id, nome, attivita from maps_clienti where lower(email) = ${mail} and stato <> 'disdetto'`) as { id: number; nome: string; attivita: string }[];
  const key = process.env.RESEND_API_KEY, from = process.env.RESEND_FROM;
  if (clienti.length && key && from) {
    const resend = new Resend(key);
    for (const c of clienti) {
      await resend.emails.send({
        from, to: mail, subject: `Il tuo link per entrare · ${c.attivita}`,
        ...email({
          marchio: TITROVANO, anteprima: "Tocca il bottone per entrare nella tua area.", titolo: `Ciao${c.nome ? ` ${c.nome}` : ""}, ecco il tuo link`, evidenzia: "link",
          blocchi: [
            { tipo: "p", testo: `Tocca il bottone per entrare nell'area di ${c.attivita}. Non serve nessuna password.` },
            { tipo: "bottone", testo: "Entra nella tua area →", url: linkArea(c.id) },
            { tipo: "nota", testo: "Il link vale 14 giorni. Se non hai chiesto tu di entrare, ignora questa email." },
          ],
        }),
      });
    }
  }
  // Stessa risposta in ogni caso: non diciamo chi è cliente e chi no.
  return { inviato: true };
}

export async function esciArea() {
  await chiudiSessioneArea();
  redirect("/area/accedi");
}

export async function approva(recensioneId: number, fd: FormData) {
  const id = await requireCliente();
  await approvaRisposta(id, recensioneId, String(fd.get("risposta") ?? ""));
  revalidatePath("/area");
}

export async function salvaNovita(novitaId: number, fd: FormData) {
  const id = await requireCliente();
  const testo = String(fd.get("testo") ?? "").trim().slice(0, 1500);
  if (testo) await db()`update maps_novita set testo = ${testo} where id = ${novitaId} and cliente_id = ${id} and stato in ('programmata', 'bloccata')`;
  revalidatePath("/area");
}

export async function bloccaNovita(novitaId: number, blocca: boolean) {
  const id = await requireCliente();
  await db()`update maps_novita set stato = ${blocca ? "bloccata" : "programmata"} where id = ${novitaId} and cliente_id = ${id} and stato in ('programmata', 'bloccata')`;
  revalidatePath("/area");
}

export async function salvaSpunti(fd: FormData) {
  const id = await requireCliente();
  await db()`update maps_clienti set spunti = ${String(fd.get("spunti") ?? "").trim().slice(0, 1500)} where id = ${id}`;
  revalidatePath("/area");
}
