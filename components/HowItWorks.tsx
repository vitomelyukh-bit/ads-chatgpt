const passi = [
  {
    titolo: "Ci dici chi sei",
    testo: "Nome dell'attività, settore e città. Basta un minuto.",
  },
  {
    titolo: "Facciamo 20 domande all'AI",
    testo:
      "Scriviamo 20 domande come le farebbero i tuoi clienti. Le facciamo davvero a ChatGPT, Gemini e Perplexity.",
  },
  {
    titolo: "Ti consegniamo una pagina",
    testo: "Quante volte esce il tuo nome, quante volte escono i concorrenti, e perché l'AI sceglie loro.",
  },
];

export function HowItWorks({ headingLevel = 3 }: { headingLevel?: 2 | 3 }) {
  const H = `h${headingLevel}` as "h2" | "h3";
  return (
    <ol className="grid gap-px overflow-hidden rounded-2xl border border-ink/15 bg-ink/15 sm:grid-cols-3">
      {passi.map((p, i) => (
        <li key={p.titolo} className="bg-card p-6 sm:p-7">
          <span className="flex size-14 items-center justify-center rounded-full bg-accent font-serif text-4xl leading-none text-ink">
            {i + 1}
          </span>
          <H className="mt-6 text-lg font-semibold text-ink">{p.titolo}</H>
          <p className="mt-2 text-ink-soft">{p.testo}</p>
        </li>
      ))}
    </ol>
  );
}
