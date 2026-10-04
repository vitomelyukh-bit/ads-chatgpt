"use client";

import { useActionState } from "react";
import { salvaLanding } from "@/actions/console";
import { faqToText, type Landing } from "@/lib/clienti";
import { Campo } from "./Campo";

export function LandingEditor({ l, media }: { l: Landing; media: { url: string; titolo: string | null; tipo: string }[] }) {
  const [state, action, pending] = useActionState(salvaLanding.bind(null, l.cliente_id, l.id), null);
  return (
    <form action={action} className="tt-form" style={{ maxWidth: "var(--measure)" }}>
      <Campo nome="titolo" etichetta="Titolo" valore={l.titolo} required />
      <Campo nome="sottotitolo" etichetta="Sottotitolo (facoltativo)" valore={l.sottotitolo} righe={2} />
      <Campo nome="punti" etichetta="Punti di forza, uno per riga (facoltativo)" valore={l.punti.join("\n")} righe={5} />
      <div className="tt-field">
        <label htmlFor="f-media">Video o immagine principale (facoltativo)</label>
        <select id="f-media" name="media_url" defaultValue={l.media_url ?? ""}>
          <option value="">Nessuno</option>
          {media.map((m) => <option key={m.url} value={m.url}>{m.tipo === "video" ? "Video" : "Immagine"}: {m.titolo || m.url.split("/").pop()}</option>)}
        </select>
        <p className="tt-field__help">Compaiono solo le creatività approvate del cliente.</p>
      </div>
      <Campo nome="chi_siamo" etichetta="Chi siamo (facoltativo)" valore={l.chi_siamo} righe={4} />
      <Campo nome="faq" etichetta="Domande frequenti (facoltativo)" valore={faqToText(l.faq)} righe={5} aiuto="Una per riga, così: Domanda? | Risposta" />
      <Campo nome="cta" etichetta="Testo del bottone" valore={l.cta} />
      <Campo nome="domanda_form" etichetta="Domanda nel modulo (facoltativo)" valore={l.domanda_form} placeholder="Come possiamo aiutarti?" />
      <div className="tt-row">
        <button disabled={pending} className="tt-btn">{pending ? "Salvo…" : "Salva landing"}</button>
        {state?.errore && <p className="tt-alert">Errore: {state.errore}</p>}
        {state?.ok && <p style={{ color: "var(--ok)", fontWeight: 700 }}>{state.ok}</p>}
      </div>
    </form>
  );
}
