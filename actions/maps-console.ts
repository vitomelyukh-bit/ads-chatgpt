"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Resend } from "resend";
import { linkArea } from "@/lib/area-auth";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { email, TITROVANO } from "@/lib/email";
import { aggiungiRecensioneManuale, approvaRisposta, codiceCard, getClienteMaps, giro, preparaNovita } from "@/lib/maps";

// Azioni del backoffice Google Maps (solo admin).
const t = (fd: FormData, k: string, max = 2000) => String(fd.get(k) ?? "").trim().slice(0, max);
const aggiorna = (id?: number) => { revalidatePath("/console/maps"); if (id) revalidatePath(`/console/maps/${id}`); };

export async function nuovoClienteMaps(fd: FormData) {
  await requireAdmin();
  const attivita = t(fd, "attivita", 120), mail = t(fd, "email", 160).toLowerCase();
  if (!attivita || !/^\S+@\S+\.\S+$/.test(mail)) redirect("/console/maps?errore=dati");
  const [c] = (await db()`insert into maps_clienti (attivita, citta, nome, email, whatsapp, link_maps)
    values (${attivita}, ${t(fd, "citta", 80)}, ${t(fd, "nome", 80)}, ${mail}, ${t(fd, "whatsapp", 30)}, ${t(fd, "link_maps", 500) || null}) returning id`) as { id: number }[];
  await codiceCard(c.id);
  redirect(`/console/maps/${c.id}`);
}

export async function salvaClienteMaps(id: number, fd: FormData) {
  await requireAdmin();
  const [account, location] = t(fd, "scheda", 300).split("|");
  await db()`update maps_clienti set attivita = ${t(fd, "attivita", 120)}, citta = ${t(fd, "citta", 80)}, nome = ${t(fd, "nome", 80)},
    email = ${t(fd, "email", 160).toLowerCase()}, whatsapp = ${t(fd, "whatsapp", 30)}, link_maps = ${t(fd, "link_maps", 500) || null},
    link_recensioni = ${/^https:\/\//.test(t(fd, "link_recensioni", 500)) ? t(fd, "link_recensioni", 500) : null},
    tono = ${t(fd, "tono", 300)}, info = ${t(fd, "info", 3000)}, firma = ${t(fd, "firma", 120)}, spunti = ${t(fd, "spunti", 1500)},
    valore_cliente = ${Number(t(fd, "valore_cliente")) > 0 ? Math.round(Number(t(fd, "valore_cliente"))) : null},
    stato = ${["attivo", "pausa", "disdetto"].includes(t(fd, "stato")) ? t(fd, "stato") : "attivo"},
    google_account = ${account || null}, google_location = ${location || null}
    where id = ${id}`;
  aggiorna(id);
}

export async function mandaAccessoCliente(id: number) {
  await requireAdmin();
  const c = await getClienteMaps(id);
  const key = process.env.RESEND_API_KEY, from = process.env.RESEND_FROM;
  if (!c || !key || !from) return;
  await new Resend(key).emails.send({
    from, to: c.email, subject: `La tua area è pronta · ${c.attivita}`,
    ...email({
      marchio: TITROVANO, anteprima: "Da qui approvi le risposte e vedi le novità prima che escano.", titolo: `${c.nome ? `${c.nome}, la` : "La"} tua area è pronta`, evidenzia: "area",
      blocchi: [
        { tipo: "p", testo: `Da qui segui tutto quello che facciamo per ${c.attivita} su Google Maps.` },
        { tipo: "passi", passi: ["Approvi le risposte alle recensioni sotto le 4 stelle (alle altre rispondiamo noi).", "Vedi la novità della settimana prima che esca, e se vuoi la modifichi o la blocchi.", "Trovi i tuoi numeri del mese e il messaggio pronto per chiedere recensioni."] },
        { tipo: "bottone", testo: "Entra nella tua area →", url: linkArea(c.id) },
        { tipo: "nota", testo: "Il link vale 14 giorni. Dopo, entri da titrovano.it/area con la tua email." },
      ],
    }),
  });
  aggiorna(id);
}

export async function recensioneManuale(id: number, fd: FormData) {
  await requireAdmin();
  const stelle = Math.min(5, Math.max(1, Number(fd.get("stelle")) || 5));
  await aggiungiRecensioneManuale(id, { autore: t(fd, "autore", 80), stelle, testo: t(fd, "testo", 4000) });
  aggiorna(id);
}

export async function rispostaDaAdmin(clienteId: number, recensioneId: number, fd: FormData) {
  await requireAdmin();
  await approvaRisposta(clienteId, recensioneId, t(fd, "risposta", 4000));
  aggiorna(clienteId);
}

export async function segnaRecensione(clienteId: number, recensioneId: number, stato: "pubblicata" | "ignorata") {
  await requireAdmin();
  await db()`update maps_recensioni set stato = ${stato}, pubblicata_il = ${stato === "pubblicata" ? new Date().toISOString() : null} where id = ${recensioneId} and cliente_id = ${clienteId}`;
  aggiorna(clienteId);
}

export async function generaNovita(id: number) {
  await requireAdmin();
  const c = await getClienteMaps(id);
  if (c) await preparaNovita(c, true).catch((e) => console.error("[maps] novità", e));
  aggiorna(id);
}

export async function aggiornaNovita(clienteId: number, novitaId: number, fd: FormData) {
  await requireAdmin();
  const azione = t(fd, "azione");
  const testo = t(fd, "testo", 1500);
  if (testo) await db()`update maps_novita set testo = ${testo} where id = ${novitaId} and cliente_id = ${clienteId}`;
  if (azione === "pubblicata") await db()`update maps_novita set stato = 'pubblicata', pubblicata_il = now() where id = ${novitaId}`;
  if (azione === "blocca") await db()`update maps_novita set stato = 'bloccata' where id = ${novitaId}`;
  if (azione === "programma") await db()`update maps_novita set stato = 'programmata' where id = ${novitaId}`;
  if (azione === "elimina") await db()`delete from maps_novita where id = ${novitaId} and cliente_id = ${clienteId}`;
  aggiorna(clienteId);
}

export async function eseguiGiro() {
  await requireAdmin();
  const log = await giro();
  redirect(`/console/maps?giro=${encodeURIComponent(log.join(" · ") || "niente da fare")}`);
}
