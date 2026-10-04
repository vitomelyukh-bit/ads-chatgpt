// Mockup segnaposto di card e piedistallo da banco (da sostituire con foto vere).
export function NfcCardMock({ tipo = "card" }: { tipo?: "card" | "piedistallo" }) {
  return (
    <div className={tipo === "piedistallo" ? "tt-nfc-piedistallo" : undefined} aria-hidden="true">
      <div className="tt-nfc-card">
        <span className="tt-nfc-onde">)))</span>
        <p className="tt-nfc-titolo">Ti è piaciuto?</p>
        <p className="tt-nfc-sotto">Avvicina il telefono e lasciaci una recensione</p>
        <span className="tt-nfc-stelle">★★★★★</span>
      </div>
      {tipo === "piedistallo" && <div className="tt-nfc-base" />}
    </div>
  );
}
