import type { Faq as FaqItem } from "@/lib/content";

// <details> nativi: si aprono senza JavaScript e il testo è nell'HTML.
export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="border-t border-ink/20">
      {items.map((f) => (
        <details key={f.domanda} className="group border-b border-ink/20">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-left [&::-webkit-details-marker]:hidden">
            <h3 className="font-serif text-2xl leading-snug text-ink group-open:[&>span]:hl">
              <span>{f.domanda}</span>
            </h3>
            <span
              aria-hidden="true"
              className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full border border-ink/25 font-mono text-lg text-ink transition group-open:rotate-45 group-open:bg-accent"
            >
              +
            </span>
          </summary>
          <p className="max-w-2xl pb-6 text-[17px] leading-relaxed text-ink-soft">{f.risposta}</p>
        </details>
      ))}
    </div>
  );
}
