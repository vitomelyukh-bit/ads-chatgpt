"use client";

import dynamic from "next/dynamic";
import { useActionState, useState } from "react";
import { ordinaBanco, type StatoOrdine } from "@/actions/compra-banco";
import type { Opzione, Punto } from "@/lib/packlink";

const MappaPunti = dynamic(() => import("./MappaPunti"), { ssr: false, loading: () => <div className="tt-ord__mappa tt-ord__mappa--vuota">Carico la mappa…</div> });
const eur = (n: number) => `${n.toFixed(2).replace(".", ",")} €`;
const GIORNI: Record<string, string> = { monday: "Lun", tuesday: "Mar", wednesday: "Mer", thursday: "Gio", friday: "Ven", saturday: "Sab", sunday: "Dom" };
const ORDINE = Object.keys(GIORNI);
const titolo = (s: string) => s.toLowerCase().replace(/(^|\s|')\S/g, (m) => m.toUpperCase());

// Scelta della spedizione prima del pagamento: CAP → a casa o punto di ritiro → mappa dei punti.
export function SceltaSpedizione({ tipo, prezzo }: { tipo: "card" | "piedistallo"; prezzo: number }) {
  const [cap, setCap] = useState("");
  const [opzioni, setOpzioni] = useState<Opzione[] | null>(null);
  const [modo, setModo] = useState<"casa" | "punto">("punto");
  const [scelta, setScelta] = useState<string | null>(null);
  const [punti, setPunti] = useState<Punto[] | null>(null);
  const [punto, setPunto] = useState<string | null>(null);
  const [errore, setErrore] = useState("");
  const [carico, setCarico] = useState(false);
  const [stato, invia, inviando] = useActionState<StatoOrdine, FormData>(ordinaBanco, null);
  const err = stato?.campi ?? {};

  async function cerca(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\d{5}$/.test(cap)) return setErrore("Scrivi un CAP di 5 cifre.");
    setErrore(""); setCarico(true); setOpzioni(null); setScelta(null); setPunti(null); setPunto(null);
    const r = await fetch(`/api/spedizione/opzioni?tipo=${tipo}&cap=${cap}`).then((x) => x.json()).catch(() => ({ errore: "Connessione assente, riprova." }));
    setCarico(false);
    if (r.errore) return setErrore(r.errore);
    setOpzioni(r.opzioni);
    if (!r.opzioni.some((o: Opzione) => o.puntoRitiro)) setModo("casa");
  }

  async function scegli(o: Opzione) {
    setScelta(o.id); setPunto(null); setPunti(null);
    if (!o.puntoRitiro) return;
    const r = await fetch(`/api/spedizione/punti?servizio=${o.id}&cap=${cap}`).then((x) => x.json()).catch(() => ({ errore: "Non riusciamo a caricare i punti." }));
    if (r.errore) return setErrore(r.errore);
    setPunti(r.punti);
  }

  const lista = (opzioni ?? []).filter((o) => o.puntoRitiro === (modo === "punto"));
  const sel = opzioni?.find((o) => o.id === scelta) ?? null;
  const puntoSel = punti?.find((p) => p.id === punto) ?? null;
  const pronto = sel && (!sel.puntoRitiro || puntoSel);

  return (
    <div className="tt-ord">
      <form onSubmit={cerca} className="tt-ord__cap">
        <label htmlFor="cap">Dove te lo spediamo? Scrivi il CAP</label>
        <div>
          <input id="cap" inputMode="numeric" autoComplete="postal-code" maxLength={5} placeholder="Es. 00139" value={cap} onChange={(e) => setCap(e.target.value.replace(/\D/g, ""))} />
          <button className="tt-btn" disabled={carico}>{carico ? "Cerco…" : "Vedi le spedizioni"}</button>
        </div>
        {errore && <p className="tt-ord__err" role="alert">Errore: {errore}</p>}
      </form>

      {opzioni && (
        <>
          <div className="tt-ord__tabs" role="tablist">
            {(["punto", "casa"] as const).map((m) => (
              <button key={m} type="button" role="tab" aria-selected={modo === m} className={modo === m ? "is-on" : undefined} onClick={() => { setModo(m); setScelta(null); setPunti(null); setPunto(null); }}>
                {m === "punto" ? "Punto di ritiro" : "A casa"}
                <small>da {eur(Math.min(...opzioni.filter((o) => o.puntoRitiro === (m === "punto")).map((o) => o.prezzo), 999))}</small>
              </button>
            ))}
          </div>
          {lista.length === 0 ? <p className="tt-soft__muted">Nessuna opzione di questo tipo per il tuo CAP.</p> : (
            <ul className="tt-ord__lista">
              {lista.map((o) => (
                <li key={o.id}>
                  <button type="button" className={`tt-ord__opz${scelta === o.id ? " is-on" : ""}`} onClick={() => scegli(o)} aria-pressed={scelta === o.id}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {o.logo ? <img src={o.logo} alt="" width={56} height={28} /> : <span className="tt-ord__logo" />}
                    <span className="tt-ord__nome"><strong>{o.corriere}</strong><small>{o.giorni ? `${o.giorni} ${o.giorni === 1 ? "giorno" : "giorni"} lavorativi` : "consegna standard"}</small></span>
                    <span className="tt-ord__prezzo">{eur(o.prezzo)}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {sel?.puntoRitiro && punti && (
        <div className="tt-ord__punti">
          <p className="tt-ord__t">Scegli il punto di ritiro</p>
          <MappaPunti punti={punti} scelto={punto} onScegli={setPunto} />
          <ul className="tt-ord__plist">
            {punti.slice(0, 12).map((p) => (
              <li key={p.id}>
                <button type="button" className={`tt-ord__punto${punto === p.id ? " is-on" : ""}`} onClick={() => setPunto(p.id)} aria-pressed={punto === p.id}>
                  <strong>{titolo(p.nome)}</strong>
                  <span>{titolo(p.indirizzo)}, {titolo(p.citta)}</span>
                  {p.orari.length > 0 && <small>{[...p.orari].sort((a, b) => ORDINE.indexOf(a.split(":")[0]) - ORDINE.indexOf(b.split(":")[0])).map((o) => `${GIORNI[o.split(":")[0]] ?? o.split(":")[0]} ${o.split(": ")[1]}`).join(" · ")}</small>}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {sel && (
        <form action={invia} className="tt-ord__dati" noValidate>
          <input type="hidden" name="tipo" value={tipo} />
          <input type="hidden" name="cap" value={cap} />
          <input type="hidden" name="servizio" value={sel.id} />
          <input type="hidden" name="punto" value={puntoSel ? `${puntoSel.id}|${titolo(puntoSel.nome)}, ${titolo(puntoSel.indirizzo)}, ${titolo(puntoSel.citta)}` : ""} />
          <p className="tt-ord__t">I tuoi dati</p>
          {([
            ["nome", "Nome e cognome", "name", "text"],
            ["email", "Email", "email", "email"],
            ["telefono", "Telefono", "tel", "tel"],
            ["attivita", "Nome della tua attività o link Google Maps", "organization", "text"],
            ["via", "Via e numero civico", "address-line1", "text"],
            ["citta", "Città", "address-level2", "text"],
            ["provincia", "Provincia (sigla)", "address-level1", "text"],
            ["presso", "Presso (facoltativo)", "off", "text"],
          ] as const).map(([k, l, ac, t]) => (
            <div key={k} className={`tt-ord__campo${k === "provincia" ? " tt-ord__campo--corto" : ""}${err[k] ? " is-err" : ""}`}>
              <label htmlFor={`o-${k}`}>{l}</label>
              <input id={`o-${k}`} name={k} type={t} autoComplete={ac} maxLength={k === "provincia" ? 2 : undefined} style={k === "provincia" ? { textTransform: "uppercase" } : undefined} aria-invalid={err[k] ? true : undefined} />
              {err[k] && <small className="tt-ord__err">Errore: {err[k]}</small>}
            </div>
          ))}
          <p className="tt-soft__muted" style={{ margin: 0 }}>CAP: {cap}{sel.puntoRitiro ? ". L'indirizzo serve al corriere per avvisarti quando il pacco è al punto di ritiro." : ""}</p>

          <div className="tt-ord__totale">
            <p><span>{tipo === "card" ? "Card da banco" : "Piedistallo da banco"}</span><strong>{eur(prezzo)}</strong></p>
            <p><span>Spedizione · {sel.corriere}{puntoSel ? ` · ${titolo(puntoSel.nome)}` : " · a casa"}</span><strong>{eur(sel.prezzo)}</strong></p>
            <p className="tt-ord__tot"><span>Totale</span><strong>{eur(prezzo + sel.prezzo)}</strong></p>
            {stato?.errore && <p className="tt-ord__err" role="alert">Errore: {stato.errore}</p>}
            <button className="tt-btn tt-btn--block" disabled={!pronto || inviando}>{inviando ? "Un attimo…" : pronto ? `Paga ${eur(prezzo + sel.prezzo)} →` : "Scegli un punto di ritiro sulla mappa"}</button>
            <small className="tt-soft__muted">Pagamento sicuro con carta su Stripe. Ti mandiamo la conferma per email.</small>
          </div>
        </form>
      )}
    </div>
  );
}
