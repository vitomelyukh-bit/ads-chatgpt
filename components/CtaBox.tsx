import Link from "next/link";

export function CtaBox({
  titolo = "Scopri se l'AI consiglia la tua attività",
  testo = "Facciamo 20 domande vere a ChatGPT, Gemini e Perplexity e ti diciamo se esce il tuo nome. Gratis.",
}: {
  titolo?: string;
  testo?: string;
}) {
  return (
    <aside className="rounded-2xl bg-accent px-6 py-10 text-white sm:px-10">
      <h2 className="text-2xl font-semibold tracking-tight">{titolo}</h2>
      <p className="mt-3 max-w-xl text-white/85">{testo}</p>
      <Link
        href="/prova-gratuita"
        className="mt-6 inline-flex rounded-xl bg-white px-6 py-3.5 font-semibold text-accent hover:bg-accent-soft"
      >
        Richiedi la prova gratuita
      </Link>
    </aside>
  );
}
