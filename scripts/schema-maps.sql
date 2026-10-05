-- Servizio "Più clienti da Google Maps": clienti attivi, recensioni, novità, report, impostazioni.
create table if not exists maps_clienti (
  id serial primary key,
  creato_il timestamptz not null default now(),
  richiesta_id int references richieste_scheda(id) on delete set null,
  attivita text not null,
  citta text not null default '',
  nome text not null default '',
  email text not null,
  whatsapp text not null default '',
  link_maps text,
  -- Come scrivere per questo cliente: tono e cose vere da dire (servizi, prodotti, orari, punti forti).
  tono text not null default 'cordiale e professionale, dando del lei ai clienti',
  info text not null default '',
  firma text not null default '',
  -- Spunti per la prossima novità (li scrive il cliente o tu): si svuotano quando vengono usati.
  spunti text not null default '',
  google_account text,
  google_location text,
  stato text not null default 'attivo'
);
create unique index if not exists maps_clienti_richiesta on maps_clienti(richiesta_id) where richiesta_id is not null;

create table if not exists maps_recensioni (
  id serial primary key,
  cliente_id int not null references maps_clienti(id) on delete cascade,
  google_id text,
  autore text not null default '',
  stelle int not null,
  testo text not null default '',
  scritta_il timestamptz,
  bozza text,
  risposta text,
  -- nuova | da-approvare | pubblicata | da-pubblicare | ignorata | errore
  stato text not null default 'nuova',
  notificata_il timestamptz,
  pubblicata_il timestamptz,
  errore text,
  creata_il timestamptz not null default now()
);
create unique index if not exists maps_recensioni_google on maps_recensioni(cliente_id, google_id) where google_id is not null;
create index if not exists maps_recensioni_stato on maps_recensioni(stato);

create table if not exists maps_novita (
  id serial primary key,
  cliente_id int not null references maps_clienti(id) on delete cascade,
  testo text not null,
  -- programmata | bloccata | pubblicata | da-pubblicare | errore
  stato text not null default 'programmata',
  pubblica_il timestamptz not null,
  pubblicata_il timestamptz,
  google_id text,
  errore text,
  creata_il timestamptz not null default now()
);
create index if not exists maps_novita_coda on maps_novita(stato, pubblica_il);

create table if not exists maps_report (
  cliente_id int not null references maps_clienti(id) on delete cascade,
  mese text not null,
  dati jsonb not null,
  commento text not null default '',
  inviato_il timestamptz,
  primary key (cliente_id, mese)
);

create table if not exists impostazioni (
  chiave text primary key,
  valore text not null,
  aggiornata_il timestamptz not null default now()
);

-- Card e piedistalli collegati direttamente al cliente Maps, e ogni tocco con la sua data.
alter table nfc_codici add column if not exists cliente_id int references maps_clienti(id) on delete set null;
alter table maps_clienti add column if not exists link_recensioni text;
update nfc_codici n set cliente_id = c.id from maps_clienti c where c.richiesta_id = n.richiesta_id and n.cliente_id is null;
create table if not exists nfc_tocchi (
  id bigserial primary key,
  codice text not null references nfc_codici(codice) on delete cascade,
  quando timestamptz not null default now()
);
create index if not exists nfc_tocchi_codice on nfc_tocchi(codice, quando);

-- Quanto vale in media un cliente per l'attività (euro): serve alla stima del valore in area e report.
alter table maps_clienti add column if not exists valore_cliente int;

-- Quando abbiamo mandato al cliente l'accesso all'area (per la lista "Primi passi").
alter table maps_clienti add column if not exists accesso_inviato_il timestamptz;
