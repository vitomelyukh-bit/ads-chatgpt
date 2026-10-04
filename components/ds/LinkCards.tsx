import Link from "next/link";

// LinkCard: righe cliccabili grandi con la freccia in brand.
export function LinkCards({ items }: { items: { href: string; label: string; sub?: string }[] }) {
  return (
    <ul className="tt-links">
      {items.map((it) => (
        <li key={it.href}>
          <Link href={it.href} className="tt-link">
            <span>
              {it.label}
              {it.sub && <small>{it.sub}</small>}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
