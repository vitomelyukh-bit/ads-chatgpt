import type { Faq } from "@/lib/content";

// Faq: details/summary, la prima domanda parte aperta.
export function FaqList({ items }: { items: Faq[] }) {
  return (
    <div className="tt-faq">
      {items.map((f, i) => (
        <details key={f.domanda} open={i === 0}>
          <summary>
            <h3 style={{ margin: 0, font: "inherit" }}>{f.domanda}</h3>
          </summary>
          <p>{f.risposta}</p>
        </details>
      ))}
    </div>
  );
}
