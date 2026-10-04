import { isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import type { Richiesta } from "@/lib/clienti";

// Esporta le richieste di un cliente in CSV (apribile con Excel).
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return new Response("Non autorizzato", { status: 401 });
  const { id } = await params;
  const rows = (await db()`select r.*, l.titolo as pagina from richieste r left join landing l on l.id=r.landing_id
    where r.cliente_id=${id} order by r.creata_il desc`) as (Richiesta & { pagina: string | null })[];
  const cell = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const head = ["data", "nome", "telefono", "email", "messaggio", "pagina", "utm_source", "utm_campaign", "stato"];
  const lines = rows.map((r) => [new Date(r.creata_il).toISOString(), r.nome, r.telefono, r.email, r.messaggio, r.pagina, r.utm.utm_source, r.utm.utm_campaign, r.stato].map(cell).join(";"));
  return new Response("﻿" + [head.join(";"), ...lines].join("\n"), {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="richieste-${id.slice(0, 8)}.csv"` },
  });
}
