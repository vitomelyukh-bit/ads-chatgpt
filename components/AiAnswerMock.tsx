// Illustrazione di una risposta di un assistente AI con i nomi oscurati.
// Volutamente generica: nessun logo né interfaccia di un prodotto reale.
export function AiAnswerMock({
  domanda = "Mi consigli un buon dentista a Bologna per un impianto?",
  lingua = "it",
}: {
  domanda?: string;
  lingua?: "it" | "en";
}) {
  const en = lingua === "en";
  const nomi = [
    { bar: "w-40", righe: ["w-full", "w-3/4"] },
    { bar: "w-28", righe: ["w-11/12", "w-1/2"] },
    { bar: "w-36", righe: ["w-full", "w-2/3"] },
  ];
  return (
    <figure className="relative mx-auto w-full max-w-md lg:max-w-none">
      <div className="relative rotate-[0.6deg] rounded-[1.25rem] border border-ink/15 bg-card shadow-[0_1px_0_rgba(0,0,0,.04),0_30px_60px_-30px_rgba(40,30,10,.35)]">
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <span className="label-mono text-ink-mute">assistente ai</span>
          <span className="label-mono text-ink-mute">nuova chat</span>
        </div>
        <div className="space-y-5 p-5 sm:p-6">
          <p
            lang={en ? "en" : undefined}
            className="ml-auto w-fit max-w-[88%] rounded-2xl rounded-br-sm bg-ink px-4 py-2.5 text-[15px] leading-snug text-paper"
          >
            {domanda}
          </p>
          <div lang={en ? "en" : undefined} className="space-y-4 text-[15px] text-ink-soft">
            <p>{en ? "Here are three options worth considering:" : "Ecco tre nomi che potresti considerare:"}</p>
            <ol className="space-y-4">
              {nomi.map((n, i) => (
                <li key={i} className="flex gap-3">
                  <span className="font-mono text-sm text-ink">{i + 1}.</span>
                  <div className="flex-1 space-y-2 pt-0.5">
                    <span className={`redact ${n.bar}`} aria-hidden="true" />
                    {n.righe.map((r, j) => (
                      <span key={j} className={`block h-2 ${r} rounded-full bg-line`} aria-hidden="true" />
                    ))}
                    <span className="sr-only">Nome oscurato</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
      <figcaption className="absolute -bottom-6 -left-2 flex items-end gap-1 sm:-left-8">
        <span className="hl -rotate-3 rounded-sm bg-accent px-3 py-1.5 font-serif text-2xl italic leading-none text-ink shadow-[3px_3px_0_var(--color-ink)]">
          Tu ci sei?
        </span>
        <svg aria-hidden="true" width="54" height="40" viewBox="0 0 54 40" className="mb-5 text-ink">
          <path d="M2 34 C 18 36, 34 26, 44 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M36 9 L45 6 L47 15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </figcaption>
    </figure>
  );
}
