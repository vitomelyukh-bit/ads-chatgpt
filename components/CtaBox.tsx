import Link from "next/link";

export function CtaBox({
  titolo = "Scopri se l'AI consiglia la tua attività",
  testo = "Facciamo 20 domande vere a ChatGPT, Gemini e Perplexity e ti diciamo se esce il tuo nome. Gratis.",
}: {
  titolo?: string;
  testo?: string;
}) {
  return (
    <aside className="relative overflow-hidden rounded-2xl bg-ink px-6 py-10 text-paper sm:px-10 sm:py-12">
      <h2 className="max-w-xl font-serif text-4xl leading-tight">{titolo}</h2>
      <p className="mt-4 max-w-xl text-paper/80">{testo}</p>
      <Link
        href="/prova-gratuita"
        className="mt-7 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 font-semibold text-ink transition hover:bg-paper"
      >
        Richiedi la prova gratuita <span aria-hidden="true">→</span>
      </Link>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 -bottom-10 select-none font-serif text-[11rem] leading-none text-paper/[0.06] italic"
      >
        ?
      </span>
    </aside>
  );
}
