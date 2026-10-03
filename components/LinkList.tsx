import Link from "next/link";

// Elenco "da rivista": righe con indice, titolo e freccia.
export function LinkList({ items }: { items: { href: string; label: string; sub?: string }[] }) {
  return (
    <ul className="border-t border-ink/20">
      {items.map((it, i) => (
        <li key={it.href} className="border-b border-ink/20">
          <Link href={it.href} className="group flex items-baseline gap-4 py-4 sm:gap-6 sm:py-5">
            <span className="font-mono text-xs text-ink-mute">{String(i + 1).padStart(2, "0")}</span>
            <span className="flex-1">
              <span className="font-serif text-xl leading-snug text-ink group-hover:hl sm:text-2xl">{it.label}</span>
              {it.sub && <span className="mt-1 block text-[15px] text-ink-soft">{it.sub}</span>}
            </span>
            <span aria-hidden="true" className="font-mono text-ink-mute transition group-hover:translate-x-1 group-hover:text-ink">
              →
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
