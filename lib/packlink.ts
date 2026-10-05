// Packlink PRO: tariffe dei corrieri e bozze di spedizione (la chiave resta sul server).
// Partenza: l'indirizzo da cui spedisci card e piedistalli (variabili PACKLINK_FROM_*, solo sul server).
import type { TipoExtra } from "@/lib/scheda";

const BASE = "https://api.packlink.com/v1";
export const RICARICO = 0.5; // busta ed etichetta
export const FORFAIT_ITALIA = 5.9; // se Packlink non risponde
const CAP_RIFERIMENTO = "20121"; // per il preventivo prima della cassa (Italia, tariffa nazionale)

// Pacchi imballati, stimati.
export const PACCO: Record<TipoExtra, { weight: number; width: number; height: number; length: number; contenuto: string }> = {
  card: { weight: 0.1, width: 12, height: 1, length: 20, contenuto: "Card NFC in PVC per recensioni" },
  piedistallo: { weight: 0.3, width: 15, height: 8, length: 20, contenuto: "Espositore da banco NFC in PVC" },
};

const mittente = () => ({
  name: process.env.PACKLINK_FROM_NAME ?? "TiTrovano",
  surname: process.env.PACKLINK_FROM_SURNAME ?? "",
  company: process.env.PACKLINK_FROM_COMPANY ?? "TiTrovano",
  street1: process.env.PACKLINK_FROM_STREET ?? "",
  zip_code: process.env.PACKLINK_FROM_ZIP ?? "",
  city: process.env.PACKLINK_FROM_CITY ?? "",
  state: process.env.PACKLINK_FROM_STATE ?? process.env.PACKLINK_FROM_CITY ?? "",
  country: "IT",
  phone: process.env.PACKLINK_FROM_PHONE ?? "",
  email: process.env.PACKLINK_FROM_EMAIL ?? process.env.LEAD_TO_EMAIL?.split(",")[0]?.trim() ?? "",
});

export const packlinkAttivo = () => Boolean(process.env.PACKLINK_API_KEY && process.env.PACKLINK_FROM_ZIP);

async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { ...init, headers: { Authorization: process.env.PACKLINK_API_KEY!, "Content-Type": "application/json", ...init.headers }, signal: AbortSignal.timeout(8000) });
  const testo = await res.text();
  if (!res.ok) throw new Error(`Packlink ${res.status}: ${testo.slice(0, 200)}`);
  return JSON.parse(testo) as T;
}

type ServizioPacklink = { id: number | string; carrier_name?: string; name?: string; price?: { total_price?: number; base_price?: number }; transit_hours?: string | number; delivery_to_parcelshop?: boolean; dropoff?: boolean };
export type Tariffa = { serviceId: string; corriere: string; servizio: string; prezzo: number; giorni: number | null; forfait: boolean };

// La consegna a casa più economica, con il ricarico. Se Packlink non risponde: forfait.
export async function tariffaItalia(tipo: TipoExtra, cap = CAP_RIFERIMENTO): Promise<Tariffa> {
  if (!packlinkAttivo()) return { serviceId: "", corriere: "Corriere", servizio: "Consegna a domicilio", prezzo: FORFAIT_ITALIA, giorni: 3, forfait: true };
  try {
    const p = PACCO[tipo], m = mittente();
    const q = new URLSearchParams({
      "from[country]": "IT", "from[zip]": m.zip_code, "to[country]": "IT", "to[zip]": cap,
      "packages[0][weight]": String(p.weight), "packages[0][width]": String(p.width), "packages[0][height]": String(p.height), "packages[0][length]": String(p.length),
      sortBy: "totalPrice", source: "PRO",
    });
    const servizi = await api<ServizioPacklink[]>(`/services?${q}`);
    const casa = servizi.filter((s) => !s.delivery_to_parcelshop && !s.dropoff && (s.price?.total_price ?? 0) > 0)
      .sort((a, b) => (a.price!.total_price! - b.price!.total_price!));
    const s = casa[0];
    if (!s) throw new Error("nessun servizio a domicilio");
    const ore = Number(s.transit_hours);
    return {
      serviceId: String(s.id), corriere: s.carrier_name ?? "Corriere", servizio: s.name ?? "Consegna a domicilio",
      prezzo: Math.round((s.price!.total_price! + RICARICO) * 100) / 100, giorni: Number.isFinite(ore) && ore > 0 ? Math.ceil(ore / 24) : null, forfait: false,
    };
  } catch (e) {
    console.error("[packlink] tariffa", e);
    return { serviceId: "", corriere: "Corriere", servizio: "Consegna a domicilio", prezzo: FORFAIT_ITALIA, giorni: 3, forfait: true };
  }
}

// Bozza di spedizione nel pannello Packlink (gratis: l'etichetta si paga dal pannello quando il pacco è pronto).
export async function bozzaSpedizione(o: {
  tipo: TipoExtra; serviceId: string; nome: string; email: string; telefono: string;
  via: string; via2?: string; cap: string; citta: string; provincia: string; valore: number; riferimento: string;
}) {
  if (!packlinkAttivo() || !o.serviceId) return null;
  const p = PACCO[o.tipo];
  const [nome, ...cognome] = o.nome.trim().split(/\s+/);
  const r = await api<{ reference?: string }>("/shipments", {
    method: "POST",
    body: JSON.stringify({
      service_id: Number(o.serviceId) || o.serviceId,
      content: p.contenuto, contentvalue: o.valore, contentValue_currency: "EUR", content_second_hand: false,
      shipment_custom_reference: o.riferimento, source: "PRO",
      from: mittente(),
      to: { name: nome || o.nome, surname: cognome.join(" ") || "-", street1: o.via, street2: o.via2 ?? "", zip_code: o.cap, city: o.citta, state: o.provincia || o.citta, country: "IT", phone: o.telefono, email: o.email },
      packages: [{ weight: p.weight, width: p.width, height: p.height, length: p.length }],
    }),
  });
  return r.reference ?? null;
}
