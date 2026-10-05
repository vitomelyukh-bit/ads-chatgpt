import { apriSessioneArea, leggiTokenArea } from "@/lib/area-auth";

// Link delle email: apre la sessione del cliente e lo porta nella sua area.
export async function GET(req: Request) {
  const u = new URL(req.url);
  const id = leggiTokenArea(u.searchParams.get("t"));
  if (!id) return Response.redirect(new URL("/area/accedi?scaduto=1", req.url), 302);
  await apriSessioneArea(id);
  const dove = u.searchParams.get("dove") ?? "";
  return Response.redirect(new URL(`/area${/^#[a-z0-9-]+$/i.test(dove) ? dove : ""}`, req.url), 302);
}
