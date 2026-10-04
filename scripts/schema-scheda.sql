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

-- Pagamento (Stripe)
alter table richieste_scheda add column if not exists pagata boolean not null default false;
alter table richieste_scheda add column if not exists pagata_il timestamptz;
alter table richieste_scheda add column if not exists stripe_session text;
alter table richieste_scheda add column if not exists stripe_customer text;
alter table richieste_scheda add column if not exists stripe_subscription text;
alter table richieste_scheda add column if not exists link_recensioni text;

-- Codici NFC: ogni card/piedistallo è programmato con titrovano.it/r/<codice>.
create table if not exists nfc_codici (
  codice text primary key,
  tipo text not null default 'card',
  creato_il timestamptz not null default now(),
  richiesta_id int references richieste_scheda(id) on delete set null,
  assegnato_il timestamptz,
  spedito_il timestamptz,
  tocchi int not null default 0,
  ultimo_tocco timestamptz
);
create index if not exists nfc_codici_liberi on nfc_codici(tipo, creato_il) where richiesta_id is null;
