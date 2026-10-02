import Link from "next/link";

export function LinkList({ items }: { items: { href: string; label: string; sub?: string }[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {items.map((it) => (
        <li key={it.href}>
          <Link
            href={it.href}
            className="block h-full rounded-xl border border-line bg-white p-4 transition hover:border-accent/50 hover:shadow-sm"
          >
            <span className="font-semibold text-ink">{it.label}</span>
            {it.sub && <span className="mt-1 block text-sm text-ink-soft">{it.sub}</span>}
          </Link>
        </li>
      ))}
    </ul>
  );
}
