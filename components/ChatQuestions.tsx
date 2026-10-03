type Domanda = { testo: string; lingua?: "it" | "en" };

export function ChatQuestions({ domande }: { domande: Domanda[] }) {
  return (
    <ul className="space-y-3" aria-label="Domande che i clienti fanno all'AI">
      {domande.map((d, i) => (
        <li key={i} className={`flex ${i % 2 ? "sm:justify-end" : "sm:justify-start"}`}>
          <p lang={d.lingua === "en" ? "en" : undefined} className="max-w-xl rounded-2xl rounded-bl-sm border border-line bg-surface px-4 py-3 text-[15px] leading-snug text-fg">
            <span className="label-mono mb-1 block text-[10px] text-fg-mute">Cliente{d.lingua === "en" ? " · in inglese" : ""}</span>
            {d.testo}
          </p>
        </li>
      ))}
    </ul>
  );
}
