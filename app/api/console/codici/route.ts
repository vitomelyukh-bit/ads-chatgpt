import { isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { site } from "@/lib/site";

// Lista dei codici liberi con il link da scrivere su ogni card (per il fornitore).
export async function GET() {
  if (!(await isAdmin())) return new Response("Non autorizzato", { status: 401 });
  const rows = (await db()`select codice, tipo from nfc_codici where richiesta_id is null order by creato_il, codice`) as { codice: string; tipo: string }[];
  const csv = ["codice;tipo;link", ...rows.map((r) => `${r.codice};${r.tipo};${site.url}/r/${r.codice}`)].join("\n");
  return new Response("﻿" + csv, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": 'attachment; filename="codici-nfc.csv"' } });
}
