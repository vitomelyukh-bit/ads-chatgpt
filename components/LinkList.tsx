import Link from "next/link";

export function LinkList({ items }: { items: { href: string; label: string; sub?: string }[] }) {
  return (
    <ul className="divide-y divide-line border-y border-line">
      {items.map((it) => (
        <li key={it.href}>
          <Link href={it.href} className="group flex items-baseline gap-4 py-4">
            <span className="flex-1">
              <span className="text-[17px] font-medium tracking-tight text-fg group-hover:text-accent">{it.label}</span>
              {it.sub && <span className="mt-1 block text-sm text-fg-mute">{it.sub}</span>}
            </span>
            <span aria-hidden="true" className="text-fg-mute transition group-hover:translate-x-1 group-hover:text-accent">→</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
