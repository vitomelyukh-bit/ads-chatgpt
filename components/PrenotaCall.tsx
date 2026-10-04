"use client";

import { useEffect, useState, useTransition } from "react";
import { prenotaCall, type EsitoPrenotazione } from "@/actions/prenota-call";

type Giorno = { data: string; etichetta: string; orari: { iso: string; ora: string }[] };

// Dopo il modulo: orari liberi presi dal Google Calendar, scelta e conferma.
export function PrenotaCall({ token }: { token: string }) {
  const [giorni, setGiorni] = useState<Giorno[] | null>(null);
  const [attivo, setAttivo] = useState(true);
  const [giorno, setGiorno] = useState(0);
  const [scelto, setScelto] = useState<string | null>(null);
  const [esito, setEsito] = useState<EsitoPrenotazione | null>(null);
  const [pending, start] = useTransition();

  const carica = () =>
    fetch("/api/orari", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => { setAttivo(j.attivo); setGiorni(j.giorni); })
      .catch(() => setAttivo(false));
  useEffect(() => { carica(); }, []);

  if (!attivo) return null;
  if (esito?.ok) {
    return (
      <div className="tt-stack-2" role="status">
        <p className="tt-heading"><span className="tt-ok">Call confermata.</span></p>
        <p className="tt-body">Ti chiamiamo {esito.quando}. Ti abbiamo mandato l&apos;invito per il calendario via email.</p>
      </div>
    );
  }
  if (!giorni) return <p className="tt-small tt-muted">Carico gli orari liberi…</p>;
  if (!giorni.length) return <p className="tt-body">Al momento non ci sono orari liberi online. Ti chiamiamo noi.</p>;

  const g = giorni[Math.min(giorno, giorni.length - 1)];
  return (
    <div className="tt-stack-6">
      <div className="tt-stack-2">
        <h3 className="tt-heading">Scegli quando sentirci</h3>
        <p className="tt-body tt-muted">Una call di circa 20 minuti. Gli orari sono quelli liberi nel nostro calendario, in ora italiana.</p>
      </div>
      <div className="tt-days" role="group" aria-label="Giorno">
        {giorni.map((x, i) => (
          <button key={x.data} type="button" aria-pressed={i === giorno} onClick={() => { setGiorno(i); setScelto(null); }} className="tt-day">
            {x.etichetta}
          </button>
        ))}
      </div>
      <div className="tt-slots" role="group" aria-label={`Orari di ${g.etichetta}`}>
        {g.orari.map((o) => (
          <button key={o.iso} type="button" aria-pressed={scelto === o.iso} onClick={() => setScelto(o.iso)} className="tt-slot">
            {o.ora}
          </button>
        ))}
      </div>
      {esito && !esito.ok && <p role="alert" className="tt-alert">Errore: {esito.errore}</p>}
      <button
        type="button"
        className="tt-btn tt-btn--block"
        disabled={!scelto || pending}
        onClick={() => start(async () => {
          const r = await prenotaCall(token, scelto!);
          setEsito(r);
          if (!r.ok) { setScelto(null); carica(); }
        })}
      >
        {pending ? "Confermo…" : <>Conferma la call <span aria-hidden="true">→</span></>}
      </button>
    </div>
  );
}
