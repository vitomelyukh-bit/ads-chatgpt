"use client";

import { useActionState } from "react";
import { salvaCliente } from "@/actions/console";
import type { Cliente } from "@/lib/clienti";
import { Campo } from "./Campo";

export function ClienteForm({ cliente }: { cliente?: Cliente }) {
  const [state, action, pending] = useActionState(salvaCliente.bind(null, cliente?.id ?? null), null);
  return (
    <form action={action} className="tt-form-2">
      <Campo nome="nome" etichetta="Nome dell'attività" valore={cliente?.nome} required />
      <Campo nome="settore" etichetta="Settore (facoltativo)" valore={cliente?.settore} />
      <Campo nome="citta" etichetta="Città (facoltativo)" valore={cliente?.citta} />
      <Campo nome="telefono" etichetta="Telefono mostrato nella landing (facoltativo)" valore={cliente?.telefono} />
      <Campo nome="email_notifiche" etichetta="Email per le richieste" valore={cliente?.email_notifiche} aiuto="Anche più indirizzi separati da virgola. Tu ricevi sempre una copia." />
      <Campo nome="sito" etichetta="Sito (facoltativo)" valore={cliente?.sito} />
      <Campo nome="privacy_url" etichetta="Link all'informativa privacy del cliente" valore={cliente?.privacy_url} aiuto="Serve per pubblicare le landing: i dati delle richieste sono del cliente." />
      <Campo nome="meta_pixel_id" etichetta="ID Pixel Meta (facoltativo)" valore={cliente?.meta_pixel_id} aiuto="Solo numeri." />
      <Campo nome="logo_url" etichetta="Link al logo (facoltativo)" valore={cliente?.logo_url} aiuto="Caricalo tra le creatività e incolla qui il suo link." />
      <div className="tt-field">
        <label htmlFor="f-colore">Colore principale</label>
        <input id="f-colore" name="colore" type="color" defaultValue={cliente?.colore ?? "#1f3fd6"} style={{ padding: 4 }} />
      </div>
      <Campo nome="note" etichetta="Note interne (facoltativo)" valore={cliente?.note} righe={3} full />
      <div className="tt-full tt-row">
        <button disabled={pending} className="tt-btn">{pending ? "Salvo…" : cliente ? "Salva" : "Crea cliente →"}</button>
        {state?.errore && <p className="tt-alert">Errore: {state.errore}</p>}
        {state?.ok && <p style={{ color: "var(--ok)", fontWeight: 700 }}>{state.ok}</p>}
      </div>
    </form>
  );
}
