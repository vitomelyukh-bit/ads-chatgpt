type Domanda = { testo: string; lingua?: "it" | "en" };

// Domande vere, mostrate come messaggi in una chat. Solo HTML e CSS.
export function ChatQuestions({ domande }: { domande: Domanda[] }) {
  return (
    <ul className="space-y-3" aria-label="Domande che i clienti fanno all'AI">
      {domande.map((d, i) => (
        <li key={i} className={`flex ${i % 2 ? "sm:justify-end" : "sm:justify-start"}`}>
          <p
            lang={d.lingua === "en" ? "en" : undefined}
            className="max-w-xl rounded-2xl rounded-bl-sm border border-ink/10 bg-card px-4 py-3 text-[15px] leading-snug text-ink shadow-[0_1px_0_rgba(0,0,0,.03)]"
          >
            <span className="label-mono mb-1 block text-[10px] text-ink-mute">
              Cliente{d.lingua === "en" ? " · in inglese" : ""}
            </span>
            {d.testo}
          </p>
        </li>
      ))}
    </ul>
  );
}
