// Com'è fatta la pagina che ricevi con la prova. Nessun numero: i valori
// sono lasciati vuoti di proposito.
export function ReportPreview() {
  const riga = "flex items-baseline justify-between gap-4 border-b border-dashed border-ink/20 py-3";
  return (
    <figure className="relative rotate-[-0.8deg] rounded-xl border border-ink/15 bg-card p-6 shadow-[0_24px_50px_-30px_rgba(40,30,10,.4)] sm:p-8">
      <div className="flex items-center justify-between">
        <span className="label-mono text-ink-mute">La tua pagina</span>
        <span className="label-mono rounded-full border border-ink/20 px-2.5 py-1 text-ink-mute">Esempio</span>
      </div>
      <p className="mt-4 font-serif text-3xl leading-tight text-ink">La tua attività, a Roma</p>
      <dl className="mt-5 text-[15px]">
        <div className={riga}>
          <dt className="text-ink-soft">Domande fatte</dt>
          <dd className="font-mono text-ink">20 × 3 assistenti</dd>
        </div>
        <div className={riga}>
          <dt className="text-ink-soft">Il tuo nome è uscito</dt>
          <dd className="font-mono text-ink">
            <span className="inline-block w-10 border-b-2 border-ink align-baseline" aria-hidden="true" />
            <span className="sr-only">da scoprire</span> volte
          </dd>
        </div>
        <div className={riga}>
          <dt className="text-ink-soft">Concorrenti più consigliati</dt>
          <dd className="flex gap-1.5">
            <span className="sr-only">nomi oscurati</span>
            <span className="redact w-12" aria-hidden="true" />
            <span className="redact w-9" aria-hidden="true" />
            <span className="redact w-14" aria-hidden="true" />
          </dd>
        </div>
        <div className="pt-3">
          <dt className="text-ink-soft">Perché l&apos;AI sceglie loro</dt>
          <dd className="mt-2 space-y-2" aria-hidden="true">
            <span className="block h-2 w-full rounded-full bg-line" />
            <span className="block h-2 w-5/6 rounded-full bg-line" />
            <span className="block h-2 w-2/3 rounded-full bg-line" />
          </dd>
        </div>
      </dl>
      <figcaption className="mt-5 text-sm text-ink-mute">
        I numeri veri li scopri con la prova.
      </figcaption>
    </figure>
  );
}
