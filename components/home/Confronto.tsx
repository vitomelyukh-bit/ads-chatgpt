// Con noi / agenzia tipica / fai da te. Su telefono ogni riga diventa una scheda.
const RIGHE = [
  { c: "Chi lavora sul tuo sito", noi: "Chi ti ha fatto la consulenza", agenzia: "Spesso un tecnico che non conosci", fai: "Tu, la sera, dopo il lavoro" },
  { c: "Pagine nuove", noi: "Ogni settimana", agenzia: "Quando si ricordano", fai: "Quando trovi il tempo" },
  { c: "I risultati", noi: "Report ogni mese, spiegato semplice", agenzia: "Report pieni di sigle", fai: "Non li vedi" },
  { c: "Il tuo sito", noi: "Lavoriamo su quello che hai", agenzia: "Spesso propongono di rifarlo", fai: "Dipende da quanto ne sai" },
  { c: "Le promesse", noi: "Nessuna: lavoro e numeri veri", agenzia: "A volte «prima pagina garantita»", fai: "Tutorial che promettono miracoli" },
  { c: "Il prezzo", noi: "Chiaro prima di iniziare", agenzia: "Spesso contratti lunghi", fai: "Gratis, ma ti costa tempo" },
];

export function Confronto() {
  return (
    <div className="tt-vs" role="table" aria-label="Confronto tra TiTrovano, agenzia tipica e fai da te">
      <div className="tt-vs__head" role="row">
        <span role="columnheader" className="tt-vs__c" />
        <span role="columnheader" className="tt-vs__noi">Con TiTrovano</span>
        <span role="columnheader">Agenzia tipica</span>
        <span role="columnheader">Fai da te</span>
      </div>
      {RIGHE.map((r) => (
        <div key={r.c} className="tt-vs__row" role="row">
          <span role="rowheader" className="tt-vs__c">{r.c}</span>
          <span role="cell" className="tt-vs__noi"><i aria-hidden="true">✓</i><small>Con TiTrovano</small>{r.noi}</span>
          <span role="cell" className="tt-vs__altro"><i aria-hidden="true">✕</i><small>Agenzia tipica</small>{r.agenzia}</span>
          <span role="cell" className="tt-vs__altro"><i aria-hidden="true">✕</i><small>Fai da te</small>{r.fai}</span>
        </div>
      ))}
    </div>
  );
}
