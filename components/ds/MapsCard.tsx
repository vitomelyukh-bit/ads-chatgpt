import { Stars } from "./Stars";

// MapsCard: come appare su Google Maps un'attività curata. Illustrazione nostra,
// con un'attività di fantasia; i pulsanti sono finti e non si cliccano.
export function MapsCard({
  nome = "Trattoria da Maria",
  tipo = "Ristorante · Roma, Testaccio",
  voto = 4.8,
  recensioni = 127,
  orario = "chiude alle 23:00",
  novita = "Da giovedì torna il menù d'autunno. Prenota il tuo tavolo.",
}: { nome?: string; tipo?: string; voto?: number; recensioni?: number; orario?: string; novita?: string }) {
  return (
    <figure className="tt-maps" style={{ margin: 0 }}>
      <div><p className="tt-maps__name">{nome}</p><p className="tt-maps__kind">{tipo}</p></div>
      <p className="tt-maps__rating"><b>{voto.toLocaleString("it-IT")}</b> <Stars voto={voto} /> <span>{recensioni} recensioni</span></p>
      <p className="tt-maps__open"><b>Aperto</b> · {orario}</p>
      <div className="tt-maps__actions" aria-hidden="true"><span className="tt-btn tt-btn--secondary">Chiama</span><span className="tt-btn tt-btn--secondary">Indicazioni</span></div>
      <div className="tt-maps__news"><span className="tt-tag">Novità della settimana</span><p>{novita}</p></div>
      <figcaption className="tt-maps__caption">Esempio: così appare un&apos;attività curata. Orari giusti, recensioni con risposta, una novità ogni settimana.</figcaption>
    </figure>
  );
}
