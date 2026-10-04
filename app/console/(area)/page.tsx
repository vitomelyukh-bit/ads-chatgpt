import Link from "next/link";
import type { Cliente } from "@/lib/clienti";
import { db } from "@/lib/db";

export default async function ConsoleHome() {
  const clienti = (await db()`
    select c.*, (select count(*) from landing l where l.cliente_id=c.id and l.pubblicata)::int as landing_attive,
      (select count(*) from richieste r where r.cliente_id=c.id and r.creata_il > now() - interval '30 days')::int as richieste_30,
      (select count(*) from creativita k where k.cliente_id=c.id and k.stato='da_approvare')::int as da_approvare
    from clienti c order by c.creato_il desc`) as (Cliente & { landing_attive: number; richieste_30: number; da_approvare: number })[];
  return (
    <div className="tt-stack-8">
      <div className="tt-row" style={{ justifyContent: "space-between" }}>
        <h1 className="tt-display-lg">Clienti</h1>
        <Link href="/console/clienti/nuovo" className="tt-btn">Nuovo cliente</Link>
      </div>
      {clienti.length === 0 ? (
        <p className="tt-body tt-muted">Nessun cliente ancora.</p>
      ) : (
        <ul className="tt-links">
          {clienti.map((c) => (
            <li key={c.id}>
              <Link href={`/console/clienti/${c.id}`} className="tt-link">
                <span>
                  {c.nome}
                  <small>
                    {[c.settore, c.citta].filter(Boolean).join(" · ")}
                    {" — "}{c.landing_attive} landing online · {c.richieste_30} richieste negli ultimi 30 giorni
                    {c.da_approvare ? ` · ${c.da_approvare} creatività da approvare` : ""}
                  </small>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
