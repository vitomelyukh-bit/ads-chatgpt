import Link from "next/link";
import { breadcrumbList, type Crumb } from "@/lib/jsonld";
import { JsonLd } from "./JsonLd";

// Briciole visibili + BreadcrumbList. "Home" viene aggiunta in automatico.
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all = [{ name: "Home", path: "/" }, ...items];
  return (
    <>
      <nav aria-label="Percorso" className="tt-crumbs">
        <ol>
          {all.map((c, i) => (
            <li key={c.path}>
              {i === all.length - 1 ? (
                <span aria-current="page">{c.name}</span>
              ) : (
                <>
                  <Link href={c.path}>{c.name}</Link>
                  <span aria-hidden="true"> / </span>
                </>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd data={breadcrumbList(items)} />
    </>
  );
}
