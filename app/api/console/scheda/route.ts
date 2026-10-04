import { isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

// Esporta le richieste "Più clienti da Google Maps" in CSV (apribile con Excel).
export async function GET() {
  if (!(await isAdmin())) return new Response("Non autorizzato", { status: 401 });
  const rows = (await db()`select * from richieste_scheda order by creata_il desc`) as Record<string, unknown>[];
  const head = ["creata_il", "attivita", "citta", "categoria", "nome", "whatsapp", "email", "link_maps", "nfc_tipo", "sped_presso", "sped_via", "sped_cap", "sped_citta", "sped_provincia", "stato"];
  const cell = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = rows.map((r) => head.map((k) => cell(k === "nfc_tipo" ? (r[k] ?? "no") : k === "creata_il" ? new Date(String(r[k])).toISOString() : r[k])).join(";"));
  return new Response("﻿" + [head.join(";"), ...lines].join("\n"), {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": 'attachment; filename="richieste-google-maps.csv"' },
  });
}
