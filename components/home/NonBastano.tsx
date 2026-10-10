// "Hai già provato?": strumenti e scorciatoie che promettono SEO ma non portano clienti.
const VOCI = [
  {
    titolo: "Il semaforo verde del plugin",
    testo: "Il plugin dice «ottimo», ma controlla solo che una parola sia ripetuta abbastanza. Non sa cosa cercano i tuoi clienti né se qualcuno ti trova.",
    mock: (
      <div className="tt-nb__mock">
        <span className="tt-nb__row"><i className="tt-nb__dot tt-nb__dot--ok" />Punteggio SEO: ottimo</span>
        <span className="tt-nb__row tt-nb__row--muted"><i className="tt-nb__dot" />Clienti da Google: fermi</span>
      </div>
    ),
  },
  {
    titolo: "Il sito fatto con l'AI in cinque minuti",
    testo: "Bello da vedere, ma uguale a mille altri: nessuna pagina sui tuoi servizi, nessuna zona, niente di nuovo da far trovare.",
    mock: (
      <div className="tt-nb__mock tt-nb__mock--sito" aria-hidden="true">
        <span /><span /><span /><span />
      </div>
    ),
  },
  {
    titolo: "La «prima pagina garantita»",
    testo: "Nessuno può garantirla: Google decide da solo. Spesso dietro c'è pubblicità a pagamento, che sparisce quando smetti di pagare.",
    mock: <div className="tt-nb__mock"><span className="tt-nb__stamp">Garantito</span></div>,
  },
  {
    titolo: "Recensioni o link comprati",
    testo: "Vanno contro le regole di Google e rischiano di farti penalizzare. Funziona solo il lavoro vero, fatto con costanza.",
    mock: (
      <div className="tt-nb__mock">
        <span className="tt-nb__row"><span className="tt-nb__stars" aria-hidden="true">★★★★★</span> ×100</span>
        <span className="tt-nb__row tt-nb__row--muted">«Ottimo!» «Ottimo!» «Ottimo!»</span>
      </div>
    ),
  },
];

export function NonBastano() {
  return (
    <ul className="tt-nb">
      {VOCI.map((v, i) => (
        <li key={v.titolo} className="tt-nb__card" data-reveal style={{ ["--d" as string]: `${i * 80}ms` }}>
          {v.mock}
          <h3>{v.titolo}</h3>
          <p>{v.testo}</p>
        </li>
      ))}
    </ul>
  );
}
