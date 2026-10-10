import { db } from "./db";

// Richieste di consulenza (modulo del sito e del controllo gratuito): salvate qui oltre che via email.
export type Consulenza = {
  id: number; creata_il: string; interesse: string; attivita: string; citta: string; sito: string; piattaforma: string;
  nome: string; email: string; telefono: string; pagina: string; ref: string; stato: string; note: string;
};
export const STATI_CONSULENZA = ["da-chiamare", "chiamato", "proposta-inviata", "cliente", "perso"] as const;

let pronta: Promise<unknown> | null = null;
// La tabella si crea da sola al primo uso: niente migrazioni manuali.
export function tabellaConsulenze() {
  pronta ??= (async () => {
    await db()`create table if not exists richieste_consulenza (
      id serial primary key, creata_il timestamptz not null default now(),
      interesse text not null default '', attivita text not null, citta text not null default '', sito text not null default '',
      piattaforma text not null default '', nome text not null, email text not null, telefono text not null,
      pagina text not null default '', ref text not null default '', stato text not null default 'da-chiamare', note text not null default '')`;
    await db()`create index if not exists richieste_consulenza_data on richieste_consulenza(creata_il desc)`;
  })().catch((e) => { pronta = null; throw e; });
  return pronta;
}

export async function salvaConsulenza(c: Omit<Consulenza, "id" | "creata_il" | "stato" | "note">) {
  await tabellaConsulenze();
  await db()`insert into richieste_consulenza (interesse, attivita, citta, sito, piattaforma, nome, email, telefono, pagina, ref)
    values (${c.interesse}, ${c.attivita}, ${c.citta}, ${c.sito}, ${c.piattaforma}, ${c.nome}, ${c.email}, ${c.telefono}, ${c.pagina}, ${c.ref})`;
}

export async function elencoConsulenze() {
  await tabellaConsulenze();
  return (await db()`select * from richieste_consulenza order by creata_il desc limit 300`) as Consulenza[];
}

export async function aggiornaConsulenza(id: number, stato: string, note: string) {
  await tabellaConsulenze();
  await db()`update richieste_consulenza set stato = ${stato}, note = ${note} where id = ${id}`;
}
