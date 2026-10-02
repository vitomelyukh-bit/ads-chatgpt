type Domanda = { testo: string; lingua?: "it" | "en" };

// Domande vere, mostrate come messaggi in una chat. Solo HTML e CSS.
export function ChatQuestions({ domande }: { domande: Domanda[] }) {
  return (
    <ul className="space-y-3" aria-label="Domande che i clienti fanno all'AI">
      {domande.map((d, i) => (
        <li key={i} className={`flex ${i % 2 ? "sm:justify-end" : "sm:justify-start"}`}>
          <p
            lang={d.lingua === "en" ? "en" : undefined}
            className="max-w-xl rounded-2xl rounded-br-md bg-bubble px-4 py-3 text-[15px] leading-snug text-ink shadow-[0_1px_0_rgba(0,0,0,0.04)]"
          >
            {d.lingua === "en" && (
              <span className="mr-2 inline-block rounded bg-white/70 px-1.5 py-0.5 align-[1px] text-[11px] font-semibold tracking-wide text-ink-mute">
                EN
              </span>
            )}
            “{d.testo}”
          </p>
        </li>
      ))}
    </ul>
  );
}
