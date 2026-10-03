import type { Faq as FaqItem } from "@/lib/content";

export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((f) => (
        <details key={f.domanda} className="group">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-left [&::-webkit-details-marker]:hidden">
            <h3 className="text-lg font-medium tracking-tight text-fg">{f.domanda}</h3>
            <span aria-hidden="true" className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border border-line-strong text-fg-soft transition group-open:rotate-45 group-open:border-accent group-open:text-accent">+</span>
          </summary>
          <p className="max-w-3xl pb-6 leading-relaxed text-fg-soft">{f.risposta}</p>
        </details>
      ))}
    </div>
  );
}
