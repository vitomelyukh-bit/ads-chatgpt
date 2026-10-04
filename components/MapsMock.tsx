// Illustrazione nostra: una ricerca "vicino a me" e una scheda curata su Google Maps.
export function MapsMock() {
  return (
    <figure className="tt-chat" style={{ margin: 0 }}>
      <div>
        <p className="tt-chat__who" style={{ textAlign: "right" }}>Il tuo cliente cerca</p>
        <p className="tt-bubble tt-bubble--user" style={{ marginLeft: "auto" }}>pizzeria vicino a me</p>
      </div>
      <div className="tt-ad tt-maps">
        <p className="tt-ad__title" style={{ marginTop: 0 }}>La tua attività</p>
        <p><span className="tt-maps__stelle" aria-hidden="true">★★★★★</span> <span className="tt-muted">Recensioni recenti</span></p>
        <p><strong className="tt-maps__aperto">Aperto</strong> · orari sempre giusti</p>
        <div className="tt-maps__post"><span className="tt-tag">Novità di questa settimana</span><p>Da venerdì torna la pizza con i fiori di zucca.</p></div>
        <div className="tt-maps__risposta"><p className="tt-small"><strong>Risposta del proprietario</strong></p><p className="tt-small">Grazie Giulia, ti aspettiamo presto!</p></div>
      </div>
      <figcaption className="tt-chat__caption">Illustrazione: una scheda curata, con novità recenti e risposte alle recensioni.</figcaption>
    </figure>
  );
}
