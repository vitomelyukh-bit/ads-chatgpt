import type { Faq } from "@/lib/content";

// Faq: details/summary nativi (funzionano senza JavaScript), la prima aperta.
// Nel summary solo testo: un titolo lì dentro dà problemi di clic su Safari.
export function FaqList({ items }: { items: Faq[] }) {
  return (
    <div className="tt-faq">
      {items.map((f, i) => (
        <details key={f.domanda} {...(i === 0 ? { open: true } : {})}>
          <summary>
            <span className="tt-faq__q">{f.domanda}</span>
          </summary>
          <p>{f.risposta}</p>
        </details>
      ))}
    </div>
  );
}
