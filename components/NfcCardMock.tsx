// Mockup segnaposto della card NFC da banco (da sostituire con una foto vera).
export function NfcCardMock() {
  return (
    <figure className="tt-nfc-mock" style={{ margin: 0 }}>
      <div className="tt-nfc-card" aria-hidden="true">
        <span className="tt-nfc-onde">)))</span>
        <p className="tt-nfc-titolo">Ti è piaciuto?</p>
        <p className="tt-nfc-sotto">Avvicina il telefono e lasciaci una recensione</p>
        <span className="tt-nfc-stelle">★★★★★</span>
      </div>
      <figcaption className="tt-small tt-muted">Immagine indicativa: la card definitiva può essere diversa.</figcaption>
    </figure>
  );
}
