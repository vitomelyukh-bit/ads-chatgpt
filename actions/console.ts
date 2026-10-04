"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { apriSessione, chiudiSessione, passwordValida, requireAdmin } from "@/lib/auth";
import { getCliente, parseFaq, righe, slugify } from "@/lib/clienti";
import { db } from "@/lib/db";

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim() || null;
const base = (id: string) => `/console/clienti/${id}`;

export async function login(_: unknown, fd: FormData) {
  if (!passwordValida(String(fd.get("password") ?? ""))) return { errore: "Password sbagliata." };
  await apriSessione();
  redirect("/console");
}

export async function logout() {
  await chiudiSessione();
  redirect("/console/login");
}

export async function salvaCliente(id: string | null, _: unknown, fd: FormData) {
  await requireAdmin();
  const nome = str(fd, "nome");
  if (!nome) return { errore: "Il nome è obbligatorio." };
  const colore = /^#[0-9a-f]{6}$/i.test(String(fd.get("colore"))) ? String(fd.get("colore")) : "#1f3fd6";
  const v = {
    settore: str(fd, "settore"), citta: str(fd, "citta"), telefono: str(fd, "telefono"),
    email: str(fd, "email_notifiche"), sito: str(fd, "sito"), privacy: str(fd, "privacy_url"),
    logo: str(fd, "logo_url"), pixel: str(fd, "meta_pixel_id")?.replace(/\D/g, "") || null, note: str(fd, "note"),
  };
  if (id) {
    await db()`update clienti set nome=${nome}, settore=${v.settore}, citta=${v.citta}, telefono=${v.telefono},
      email_notifiche=${v.email}, sito=${v.sito}, privacy_url=${v.privacy}, colore=${colore}, logo_url=${v.logo},
      meta_pixel_id=${v.pixel}, note=${v.note} where id=${id}`;
    revalidatePath(base(id));
    return { ok: "Salvato." };
  }
  let slug = slugify(nome);
  if (((await db()`select 1 from clienti where slug = ${slug}`) as unknown[]).length) slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
  const [r] = (await db()`insert into clienti (nome, slug, settore, citta, telefono, email_notifiche, sito, privacy_url, colore, logo_url, meta_pixel_id, note)
    values (${nome}, ${slug}, ${v.settore}, ${v.citta}, ${v.telefono}, ${v.email}, ${v.sito}, ${v.privacy}, ${colore}, ${v.logo}, ${v.pixel}, ${v.note})
    returning id`) as { id: string }[];
  redirect(base(r.id));
}

export async function eliminaCliente(id: string) {
  await requireAdmin();
  await db()`delete from clienti where id=${id}`;
  redirect("/console");
}

export async function nuovaLanding(clienteId: string, fd: FormData) {
  await requireAdmin();
  const titolo = str(fd, "titolo") ?? "Nuova pagina";
  let slug = slugify(titolo);
  if (((await db()`select 1 from landing where cliente_id=${clienteId} and slug=${slug}`) as unknown[]).length) slug = `${slug}-${Math.random().toString(36).slice(2, 5)}`;
  const [r] = (await db()`insert into landing (cliente_id, slug, titolo) values (${clienteId}, ${slug}, ${titolo}) returning id`) as { id: string }[];
  redirect(`${base(clienteId)}/landing/${r.id}`);
}

export async function salvaLanding(clienteId: string, landingId: string, _: unknown, fd: FormData) {
  await requireAdmin();
  const titolo = str(fd, "titolo");
  if (!titolo) return { errore: "Il titolo è obbligatorio." };
  const media = str(fd, "media_url");
  const tipo = media ? (/\.(mp4|webm|mov)(\?|$)/i.test(media) ? "video" : "immagine") : null;
  await db()`update landing set titolo=${titolo}, sottotitolo=${str(fd, "sottotitolo")}, punti=${JSON.stringify(righe(fd.get("punti")))},
    media_url=${media}, media_tipo=${tipo}, chi_siamo=${str(fd, "chi_siamo")}, faq=${JSON.stringify(parseFaq(fd.get("faq")))},
    cta=${str(fd, "cta") ?? "Richiedi informazioni"}, domanda_form=${str(fd, "domanda_form")}, aggiornata_il=now()
    where id=${landingId} and cliente_id=${clienteId}`;
  revalidatePath(`${base(clienteId)}/landing/${landingId}`);
  return { ok: "Salvato." };
}

export async function pubblicaLanding(clienteId: string, landingId: string, si: boolean) {
  await requireAdmin();
  if (si && !(await getCliente(clienteId))?.privacy_url) return;
  await db()`update landing set pubblicata=${si} where id=${landingId} and cliente_id=${clienteId}`;
  revalidatePath(`${base(clienteId)}/landing/${landingId}`);
  revalidatePath(base(clienteId));
}

export async function eliminaLanding(clienteId: string, landingId: string) {
  await requireAdmin();
  await db()`delete from landing where id=${landingId} and cliente_id=${clienteId}`;
  redirect(base(clienteId));
}

export async function registraCreativita(clienteId: string, url: string, tipo: "video" | "immagine", titolo: string) {
  await requireAdmin();
  if (!/^https:\/\/[a-z0-9.-]+\.public\.blob\.vercel-storage\.com\//.test(url)) throw new Error("URL non valido");
  await db()`insert into creativita (cliente_id, tipo, url, titolo) values (${clienteId}, ${tipo}, ${url}, ${titolo || null})`;
  revalidatePath(base(clienteId));
}

export async function statoCreativita(clienteId: string, id: number, stato: "da_approvare" | "approvata" | "scartata") {
  await requireAdmin();
  await db()`update creativita set stato=${stato} where id=${id} and cliente_id=${clienteId}`;
  revalidatePath(base(clienteId));
}

export async function statoRichiesta(clienteId: string, id: number, stato: string) {
  await requireAdmin();
  await db()`update richieste set stato=${stato} where id=${id} and cliente_id=${clienteId}`;
  revalidatePath(base(clienteId));
}

export async function statoScheda(id: number, stato: string) {
  await requireAdmin();
  await db()`update richieste_scheda set stato=${stato} where id=${id}`;
  revalidatePath("/console/scheda");
}
