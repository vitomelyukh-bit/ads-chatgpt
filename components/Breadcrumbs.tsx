import Link from "next/link";
import { breadcrumbList, type Crumb } from "@/lib/jsonld";
import { JsonLd } from "./JsonLd";

// Briciole visibili + BreadcrumbList. "Home" viene aggiunta in automatico.
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all = [{ name: "Home", path: "/" }, ...items];
  return (
    <>
      <nav aria-label="Percorso" className="text-sm text-ink-mute">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {all.map((c, i) => {
            const last = i === all.length - 1;
            return (
              <li key={c.path} className="flex items-center gap-2">
                {last ? (
                  <span aria-current="page" className="text-ink-soft">{c.name}</span>
                ) : (
                  <>
                    <Link href={c.path} className="hover:text-accent">{c.name}</Link>
                    <span aria-hidden="true">/</span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbList(items)} />
    </>
  );
}
