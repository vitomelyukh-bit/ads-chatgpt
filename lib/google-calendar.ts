import { createSign } from "node:crypto";

// Accesso al Google Calendar con un account di servizio a cui il titolare ha
// condiviso il calendario. Nessuna libreria esterna: JWT firmato e REST.

const SCOPE = "https://www.googleapis.com/auth/calendar";
let cache: { token: string; scade: number } | null = null;

export function calendarioConfigurato() {
  return Boolean(process.env.GOOGLE_SA_EMAIL && process.env.GOOGLE_SA_PRIVATE_KEY && process.env.GOOGLE_CALENDAR_ID);
}

const b64url = (s: string | Buffer) => Buffer.from(s).toString("base64url");

async function accessToken() {
  if (cache && cache.scade > Date.now() + 60_000) return cache.token;
  const ora = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = b64url(
    JSON.stringify({ iss: process.env.GOOGLE_SA_EMAIL, scope: SCOPE, aud: "https://oauth2.googleapis.com/token", iat: ora, exp: ora + 3600 }),
  );
  const chiave = (process.env.GOOGLE_SA_PRIVATE_KEY ?? "").replace(/\\n/g, "\n");
  const firma = createSign("RSA-SHA256").update(`${header}.${claim}`).sign(chiave).toString("base64url");
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${header}.${claim}.${firma}` }),
  });
  if (!res.ok) throw new Error(`Google token ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const j = (await res.json()) as { access_token: string; expires_in: number };
  cache = { token: j.access_token, scade: Date.now() + j.expires_in * 1000 };
  return j.access_token;
}

async function api(path: string, init: RequestInit = {}) {
  const res = await fetch(`https://www.googleapis.com/calendar/v3${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${await accessToken()}`, "Content-Type": "application/json", ...(init.headers ?? {}) },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Google Calendar ${res.status}: ${(await res.text()).slice(0, 300)}`);
  return res.json();
}

const calendari = () =>
  [process.env.GOOGLE_CALENDAR_ID!, ...(process.env.GOOGLE_BUSY_CALENDARS ?? "").split(",")].map((s) => s.trim()).filter(Boolean);

// Intervalli occupati tra due date, su tutti i calendari condivisi.
export async function occupato(da: Date, a: Date): Promise<{ start: number; end: number }[]> {
  const j = await api("/freeBusy", {
    method: "POST",
    body: JSON.stringify({ timeMin: da.toISOString(), timeMax: a.toISOString(), items: calendari().map((id) => ({ id })) }),
  });
  const out: { start: number; end: number }[] = [];
  for (const c of Object.values(j.calendars ?? {}) as { busy?: { start: string; end: string }[]; errors?: unknown[] }[]) {
    if (c.errors?.length) throw new Error(`Calendario non leggibile: ${JSON.stringify(c.errors).slice(0, 200)}`);
    for (const b of c.busy ?? []) out.push({ start: Date.parse(b.start), end: Date.parse(b.end) });
  }
  return out;
}

export async function creaEvento(ev: { inizio: Date; fine: Date; titolo: string; descrizione: string }) {
  return api(`/calendars/${encodeURIComponent(process.env.GOOGLE_CALENDAR_ID!)}/events`, {
    method: "POST",
    body: JSON.stringify({
      summary: ev.titolo,
      description: ev.descrizione,
      start: { dateTime: ev.inizio.toISOString(), timeZone: "Europe/Rome" },
      end: { dateTime: ev.fine.toISOString(), timeZone: "Europe/Rome" },
      reminders: { useDefault: true },
    }),
  }) as Promise<{ id: string; htmlLink: string }>;
}
