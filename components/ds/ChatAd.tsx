// ChatAd: dove compare un annuncio. Domanda del cliente, risposta dell'AI e,
// separato, l'annuncio con l'etichetta Sponsorizzato. Illustrazione nostra.
export function ChatAd({
  domanda,
  inserzionista,
  descrizione,
  linkTesto = "Scopri di più →",
}: {
  domanda: string;
  inserzionista: string;
  descrizione: string;
  linkTesto?: string;
}) {
  return (
    <figure className="tt-chat" style={{ margin: 0 }}>
      <div>
        <p className="tt-chat__who" style={{ textAlign: "right" }}>Il tuo cliente chiede</p>
        <p className="tt-bubble tt-bubble--user" style={{ marginLeft: "auto" }}>{domanda}</p>
      </div>
      <div>
        <p className="tt-chat__who">ChatGPT risponde</p>
        <div className="tt-bubble tt-bubble--ai" aria-hidden="true" style={{ width: "88%", display: "grid", gap: "var(--space-2)", padding: "var(--space-4)" }}>
          <span style={{ display: "block", height: 10, width: "95%", borderRadius: 999, background: "var(--line)" }} />
          <span style={{ display: "block", height: 10, width: "100%", borderRadius: 999, background: "var(--line)" }} />
          <span style={{ display: "block", height: 10, width: "70%", borderRadius: 999, background: "var(--line)" }} />
        </div>
        <span className="tt-sr">La risposta dell&apos;assistente.</span>
      </div>
      <div className="tt-ad">
        <span className="tt-tag">Sponsorizzato</span>
        <p className="tt-ad__title">{inserzionista}</p>
        <p>{descrizione}</p>
        <span aria-hidden="true" style={{ fontWeight: 700 }}>{linkTesto}</span>
      </div>
      <figcaption className="tt-chat__caption">
        Illustrazione: l&apos;annuncio compare separato dalla risposta ed è segnalato come sponsorizzato.
      </figcaption>
    </figure>
  );
}
