import Link from "next/link";
import { euro, scheda } from "@/lib/scheda";

// Invito finale delle guide Google Maps: porta al servizio in home.
export function CtaBoxMaps() {
  return (
    <aside className="tt-card tt-stack-4">
      <h2 className="tt-heading">Non hai tempo di farlo? Lo facciamo noi.</h2>
      <p className="tt-body">
        Ogni settimana pubblichiamo una novità sulla tua attività, rispondiamo a tutte le recensioni e ti aiutiamo a riceverne di
        nuove. Tu devi solo approvare l&apos;accesso.
      </p>
      <p className="tt-body-strong" style={{ margin: 0 }}>{euro(scheda.prezzoMese)} al mese · nessun costo di attivazione · disdici quando vuoi</p>
      <p><Link href="/#attiva" className="tt-btn">Inizia ora <span aria-hidden="true">→</span></Link></p>
    </aside>
  );
}
