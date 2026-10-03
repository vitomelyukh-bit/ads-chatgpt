// Illustrazione generica di una risposta di un assistente AI con, sotto, un
// annuncio segnalato come sponsorizzato. Nessun logo né interfaccia reale.
export function AdMock({
  domanda = "Mi consigli un buon dentista a Bologna per un impianto?",
  inserzionista = "La tua attività",
  descrizione = "Prima visita e piano di cura chiaro. Prenota online.",
}: {
  domanda?: string;
  inserzionista?: string;
  descrizione?: string;
}) {
  return (
    <figure className="relative">
      <div aria-hidden="true" className="absolute -inset-10 -z-10 rounded-full bg-[radial-gradient(closest-side,#d7ff3f22,transparent)] blur-2xl" />
      <div className="card overflow-hidden bg-surface shadow-[0_40px_80px_-40px_#000]">
        <div className="flex items-center gap-2 border-b border-line px-4 py-3">
          <span className="size-2.5 rounded-full bg-line-strong" />
          <span className="size-2.5 rounded-full bg-line-strong" />
          <span className="size-2.5 rounded-full bg-line-strong" />
          <span className="label-mono ml-3 text-fg-mute">assistente ai</span>
        </div>
        <div className="space-y-5 p-5 sm:p-6">
          <p className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-sm bg-surface-2 px-4 py-2.5 text-[15px] leading-snug text-fg">
            {domanda}
          </p>
          <div className="space-y-2.5" aria-hidden="true">
            <span className="block h-2.5 w-11/12 rounded-full bg-line" />
            <span className="block h-2.5 w-full rounded-full bg-line" />
            <span className="block h-2.5 w-4/5 rounded-full bg-line" />
            <span className="block h-2.5 w-2/3 rounded-full bg-line" />
          </div>
          <span className="sr-only">La risposta dell&apos;assistente.</span>
          <div className="relative rounded-xl border border-accent/50 bg-accent-soft p-4 shadow-[0_0_40px_-12px_#d7ff3f66]">
            <p className="label-mono text-accent">Sponsorizzato</p>
            <p className="mt-2 font-semibold text-fg">{inserzionista}</p>
            <p className="mt-1 text-sm text-fg-soft">{descrizione}</p>
            <span className="mt-3 inline-flex rounded-full bg-fg px-3 py-1.5 text-xs font-semibold text-bg">Scopri di più</span>
          </div>
        </div>
      </div>
      <figcaption className="mt-4 text-center text-xs text-fg-mute">
        Illustrazione: l&apos;annuncio compare separato dalla risposta ed è segnalato come sponsorizzato.
      </figcaption>
    </figure>
  );
}
