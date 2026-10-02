import type { Faq as FaqItem } from "@/lib/content";

// <details> nativi: si aprono senza JavaScript e il testo è nell'HTML.
export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-line rounded-2xl border border-line bg-white">
      {items.map((f) => (
        <details key={f.domanda} className="group p-5 sm:p-6">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-left font-semibold text-ink [&::-webkit-details-marker]:hidden">
            <h3 className="text-base">{f.domanda}</h3>
            <span aria-hidden="true" className="mt-0.5 text-xl leading-none text-accent transition group-open:rotate-45">+</span>
          </summary>
          <p className="mt-3 text-ink-soft">{f.risposta}</p>
        </details>
      ))}
    </div>
  );
}
