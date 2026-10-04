export function Campo({ nome, etichetta, valore, tipo = "text", aiuto, righe, placeholder, required, full }: {
  nome: string; etichetta: string; valore?: string | null; tipo?: string; aiuto?: string; righe?: number;
  placeholder?: string; required?: boolean; full?: boolean;
}) {
  const id = `f-${nome}`;
  return (
    <div className={`tt-field${full ? " tt-full" : ""}`}>
      <label htmlFor={id}>{etichetta}</label>
      {righe ? (
        <textarea id={id} name={nome} rows={righe} defaultValue={valore ?? ""} placeholder={placeholder} required={required} />
      ) : (
        <input id={id} name={nome} type={tipo} defaultValue={valore ?? ""} placeholder={placeholder} required={required} />
      )}
      {aiuto && <p className="tt-field__help">{aiuto}</p>}
    </div>
  );
}
