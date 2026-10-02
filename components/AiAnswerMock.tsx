// Illustrazione di una risposta di un assistente AI con tre nomi oscurati.
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
    { w: "w-36", righe: ["w-full", "w-4/5"] },
    { w: "w-28", righe: ["w-11/12", "w-3/5"] },
    { w: "w-32", righe: ["w-full", "w-2/3"] },
  ];
  return (
    <figure className="relative">
      <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_20px_50px_-24px_rgba(15,40,35,0.25)]">
        <div className="flex items-center gap-2 border-b border-line/70 px-4 py-3">
          <span className="size-2.5 rounded-full bg-line" />
          <span className="size-2.5 rounded-full bg-line" />
          <span className="size-2.5 rounded-full bg-line" />
          <span className="ml-2 text-xs font-medium text-ink-mute">Assistente AI</span>
        </div>
        <div className="space-y-5 p-4 sm:p-6">
          <p lang={en ? "en" : undefined} className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-bubble px-4 py-2.5 text-[15px] text-ink">
            {domanda}
          </p>
          <div className="space-y-4 text-[15px] text-ink-soft" lang={en ? "en" : undefined}>
            <p>{en ? "Here are three options worth considering:" : "Ecco tre nomi che potresti considerare:"}</p>
            <ol className="space-y-4">
              {nomi.map((n, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-0.5 font-semibold text-ink">{i + 1}.</span>
                  <div className="flex-1 space-y-2">
                    <span className={`block h-4 ${n.w} rounded bg-ink/85`} aria-hidden="true" />
                    {n.righe.map((r, j) => (
                      <span key={j} className={`block h-2.5 ${r} rounded bg-line`} aria-hidden="true" />
                    ))}
                    <span className="sr-only">Nome oscurato</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
      <figcaption className="mt-4 flex items-center justify-center gap-2 text-center sm:absolute sm:-bottom-5 sm:right-6 sm:mt-0">
        <span className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white shadow-lg">
          Tu ci sei?
        </span>
      </figcaption>
    </figure>
  );
}
