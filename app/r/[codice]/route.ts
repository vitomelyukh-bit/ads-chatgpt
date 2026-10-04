import { db } from "@/lib/db";

// Link scritto sulle card e sui piedistalli NFC: titrovano.it/r/<codice>.
// Porta alla pagina recensioni del cliente e conta i tocchi.
export async function GET(_: Request, { params }: { params: Promise<{ codice: string }> }) {
  const codice = (await params).codice.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 16);
  const [r] = (await db()`
    update nfc_codici n set tocchi = tocchi + 1, ultimo_tocco = now()
    from richieste_scheda s
    where n.codice = ${codice} and s.id = n.richiesta_id and s.pagata and s.stato <> 'disdetta'
    returning coalesce(s.link_recensioni, s.link_maps) as link`) as { link: string | null }[];
  if (r?.link) return Response.redirect(r.link, 302);
  return new Response(
    `<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Card non ancora attiva</title></head>
<body style="font:18px/1.5 system-ui,sans-serif;background:#f7f2e8;color:#16140f;display:grid;place-items:center;min-height:100vh;margin:0;padding:24px;text-align:center">
<div><h1 style="font-size:28px">Questa card non è ancora attiva</h1><p>Sarà pronta a breve. Grazie per la pazienza.</p></div></body></html>`,
    { status: 404, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } },
  );
}
