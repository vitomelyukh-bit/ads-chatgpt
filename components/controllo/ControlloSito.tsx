"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { track } from "@vercel/analytics";
import type { Esito, Risultato } from "@/lib/controllo-sito";
import { ConsulenzaForm } from "@/components/ConsulenzaForm";

const ICONA: Record<Esito, string> = { ok: "✓", attenzione: "!", problema: "✕" };
const NOME: Record<Esito, string> = { ok: "Tutto a posto", attenzione: "Da migliorare", problema: "Da sistemare" };
const FASI = ["Apriamo il tuo sito come fa Google…", "Leggiamo titoli e testi…", "Cerchiamo la mappa del sito…", "Controlliamo i dati per Maps e per le AI…"];

function giudizio(v: number) {
  if (v >= 85) return "Buona base. Ora servono pagine nuove per farti trovare da più ricerche.";
  if (v >= 60) return "Ci sono cose importanti da sistemare prima di tutto il resto.";
  return "Così com'è, Google fa fatica a capire e a mostrare il tuo sito.";
}

export function ControlloSito() {
  const params = useSearchParams();
  const [sito, setSito] = useState(params.get("sito") ?? "");
  const [stato, setStato] = useState<"idle" | "carico" | "ok" | "errore">("idle");
  const [fase, setFase] = useState(0);
  const [r, setR] = useState<Risultato | null>(null);
  const [errore, setErrore] = useState("");
  const risultatoRef = useRef<HTMLDivElement>(null);
  const partito = useRef(false);

  async function avvia(valore = sito) {
    if (!valore.trim()) { setErrore("Scrivi l'indirizzo del tuo sito."); setStato("errore"); return; }
    setStato("carico"); setErrore(""); setFase(0);
    const t = setInterval(() => setFase((f) => Math.min(f + 1, FASI.length - 1)), 1600);
    try {
      const res = await fetch(`/api/controllo?sito=${encodeURIComponent(valore.trim())}`);
      const d = await res.json();
      if (!res.ok) throw new Error(d.errore ?? "Errore");
      setR(d); setStato("ok");
      track("Controllo sito", { voto: d.voto });
      setTimeout(() => risultatoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    } catch (e) {
      setErrore((e as Error).message); setStato("errore");
    } finally {
      clearInterval(t);
    }
  }

  // Link diretti (per esempio dai messaggi): /controllo-sito?sito=tuosito.it parte da solo.
  useEffect(() => {
    if (!partito.current && params.get("sito")) { partito.current = true; avvia(params.get("sito")!); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const conta = (e: Esito) => r?.controlli.filter((c) => c.esito === e).length ?? 0;

  return (
    <div className="tt-cs">
      <form className="tt-cs__form" onSubmit={(e) => { e.preventDefault(); avvia(); }}>
        <label htmlFor="cs-sito" className="tt-cs__label">L&apos;indirizzo del tuo sito</label>
        <div className="tt-cs__row">
          <input id="cs-sito" type="text" inputMode="url" autoComplete="url" placeholder="tuosito.it" value={sito} onChange={(e) => setSito(e.target.value)} />
          <button type="submit" className="tt-btn" disabled={stato === "carico"}>
            {stato === "carico" ? "Controllo in corso…" : <>Controlla gratis <span aria-hidden="true">→</span></>}
          </button>
        </div>
        <p className="tt-small tt-muted" style={{ margin: 0 }}>Gratis, senza registrazione. Ci vogliono circa 10 secondi.</p>
      </form>

      {stato === "carico" && (
        <div className="tt-cs__loading" role="status">
          <span className="tt-cs__spinner" aria-hidden="true" />
          <span>{FASI[fase]}</span>
        </div>
      )}
      {stato === "errore" && <p role="alert" className="tt-alert">Errore: {errore}</p>}

      {stato === "ok" && r && (
        <div ref={risultatoRef} className="tt-cs__res" style={{ scrollMarginTop: "var(--space-24)" }}>
          <div className="tt-cs__head">
            <div className="tt-cs__voto" style={{ ["--v" as string]: r.voto }} role="img" aria-label={`Punteggio ${r.voto} su 100`}>
              <span>{r.voto}</span><small>su 100</small>
            </div>
            <div className="tt-stack-2">
              <p className="tt-eyebrow" style={{ margin: 0 }}>{r.host}{r.piattaforma ? ` · ${r.piattaforma}` : ""}</p>
              <h2 className="tt-heading" style={{ margin: 0 }}>{giudizio(r.voto)}</h2>
              <p className="tt-small tt-muted" style={{ margin: 0 }}>
                {conta("problema")} da sistemare · {conta("attenzione")} da migliorare · {conta("ok")} a posto
              </p>
            </div>
          </div>

          <ul className="tt-cs__list">
            {r.controlli.map((c) => (
              <li key={c.id} className={`tt-cs__item tt-cs__item--${c.esito}`}>
                <span className="tt-cs__ico" aria-label={NOME[c.esito]}>{ICONA[c.esito]}</span>
                <div>
                  <h3>{c.titolo}</h3>
                  <p>{c.testo}</p>
                  {c.consiglio && <p className="tt-cs__tip"><b>Cosa fare:</b> {c.consiglio}</p>}
                </div>
              </li>
            ))}
          </ul>

          <aside className="tt-callout">
            <span className="tt-tag">Il controllo non dice tutto</span>
            <h3>Guarda solo la prima pagina</h3>
            <p>
              Non sa per quali ricerche compari, cosa fanno i concorrenti nella tua zona e quali pagine ti mancano. Questo lo
              guardiamo insieme nella consulenza gratuita, con i dati veri di Google.
            </p>
          </aside>

          <section id="attiva" className="tt-cs__cta" style={{ scrollMarginTop: "var(--space-24)" }}>
            <h2 className="tt-display-lg" style={{ margin: 0 }}>Vuoi che lo sistemiamo <span className="tt-mark">noi?</span></h2>
            <p className="tt-lead">Lascia i tuoi dati e scegli l&apos;orario: in consulenza con Vitaliy ti diciamo cosa fare per primo e quanto costa.</p>
            <div className="tt-card">
              <ConsulenzaForm interesse="Sito trovato su Google (SEO)" pagina={`/controllo-sito (voto ${r.voto})`} sito={r.host} />
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
