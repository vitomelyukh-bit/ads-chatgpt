-- Richieste del servizio "Scheda Google sempre viva" (con eventuale card NFC).
create table if not exists richieste_scheda (
  id serial primary key,
  creata_il timestamptz not null default now(),
  attivita text not null,
  citta text not null,
  categoria text not null,
  nome text not null,
  whatsapp text not null,
  email text not null,
  link_maps text,
  card_nfc boolean not null default false,
  sped_via text,
  sped_cap text,
  sped_citta text,
  sped_provincia text,
  sped_presso text,
  stato text not null default 'nuova'
);
create index if not exists richieste_scheda_data on richieste_scheda(creata_il desc);
