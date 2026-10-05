import { db } from "@/lib/db";

// Google Business Profile API con l'account Google di TiTrovano, gestore delle schede dei clienti.
// Il refresh token si ottiene una volta dalla console (/api/google/oauth) e sta nella tabella impostazioni.
export const SCOPE = "https://www.googleapis.com/auth/business.manage";
const TOKEN_URL = "https://oauth2.googleapis.com/token";

export const googleConfigurato = () => Boolean(process.env.GOOGLE_OAUTH_CLIENT_ID && process.env.GOOGLE_OAUTH_CLIENT_SECRET);

export async function refreshToken() {
  const [r] = (await db()`select valore from impostazioni where chiave = 'google_refresh_token'`) as { valore: string }[];
  return r?.valore ?? null;
}
export const googleCollegato = async () => googleConfigurato() && Boolean(await refreshToken());

let cache: { token: string; scade: number } | null = null;
async function accessToken() {
  if (cache && cache.scade > Date.now() + 60_000) return cache.token;
  const rt = await refreshToken();
  if (!rt || !googleConfigurato()) throw new Error("Google non collegato");
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: process.env.GOOGLE_OAUTH_CLIENT_ID!, client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!, refresh_token: rt, grant_type: "refresh_token" }),
  });
  const j = await res.json();
  if (!res.ok) throw new Error(`Token Google: ${j.error_description ?? j.error ?? res.status}`);
  cache = { token: j.access_token, scade: Date.now() + j.expires_in * 1000 };
  return cache.token;
}

async function api<T>(url: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(url, { ...init, headers: { Authorization: `Bearer ${await accessToken()}`, "Content-Type": "application/json", ...init.headers } });
  const testo = await res.text();
  if (!res.ok) throw new Error(`Google ${res.status}: ${testo.slice(0, 300)}`);
  return (testo ? JSON.parse(testo) : {}) as T;
}

export function urlAutorizzazione(redirectUri: string, state: string) {
  return `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
    client_id: process.env.GOOGLE_OAUTH_CLIENT_ID!, redirect_uri: redirectUri, response_type: "code", scope: SCOPE,
    access_type: "offline", prompt: "consent", state,
  })}`;
}

export async function scambiaCodice(code: string, redirectUri: string) {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ code, client_id: process.env.GOOGLE_OAUTH_CLIENT_ID!, client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!, redirect_uri: redirectUri, grant_type: "authorization_code" }),
  });
  const j = await res.json();
  if (!res.ok || !j.refresh_token) throw new Error(`Collegamento Google non riuscito: ${j.error_description ?? j.error ?? "manca il refresh token"}`);
  await db()`insert into impostazioni (chiave, valore) values ('google_refresh_token', ${j.refresh_token})
    on conflict (chiave) do update set valore = excluded.valore, aggiornata_il = now()`;
  cache = null;
}

// Schede che l'account di TiTrovano gestisce (proprietario o gestore).
export type SchedaGoogle = { account: string; location: string; titolo: string; indirizzo: string };
export async function elencaSchede(): Promise<SchedaGoogle[]> {
  const { accounts = [] } = await api<{ accounts?: { name: string }[] }>("https://mybusinessaccountmanagement.googleapis.com/v1/accounts");
  const out: SchedaGoogle[] = [];
  for (const a of accounts) {
    let pageToken = "";
    do {
      const q = new URLSearchParams({ readMask: "name,title,storefrontAddress", pageSize: "100", ...(pageToken ? { pageToken } : {}) });
      const r = await api<{ locations?: { name: string; title: string; storefrontAddress?: { addressLines?: string[]; locality?: string } }[]; nextPageToken?: string }>(
        `https://mybusinessbusinessinformation.googleapis.com/v1/${a.name}/locations?${q}`,
      );
      for (const l of r.locations ?? []) {
        out.push({ account: a.name, location: l.name, titolo: l.title, indirizzo: [...(l.storefrontAddress?.addressLines ?? []), l.storefrontAddress?.locality].filter(Boolean).join(", ") });
      }
      pageToken = r.nextPageToken ?? "";
    } while (pageToken);
  }
  return out;
}

// "accounts/1" + "locations/2" -> "accounts/1/locations/2" (formato delle API v4)
const v4 = (account: string, location: string) => `${account}/${location}`;
const STELLE: Record<string, number> = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };

export type RecensioneGoogle = { id: string; autore: string; stelle: number; testo: string; scritta: string; risposta: string | null };
export async function leggiRecensioni(account: string, location: string, max = 100): Promise<RecensioneGoogle[]> {
  const out: RecensioneGoogle[] = [];
  let pageToken = "";
  do {
    const q = new URLSearchParams({ pageSize: "50", orderBy: "updateTime desc", ...(pageToken ? { pageToken } : {}) });
    const r = await api<{ reviews?: { reviewId: string; reviewer?: { displayName?: string }; starRating: string; comment?: string; createTime: string; reviewReply?: { comment: string } }[]; nextPageToken?: string }>(
      `https://mybusiness.googleapis.com/v4/${v4(account, location)}/reviews?${q}`,
    );
    for (const x of r.reviews ?? []) {
      out.push({ id: x.reviewId, autore: x.reviewer?.displayName ?? "", stelle: STELLE[x.starRating] ?? 0, testo: x.comment ?? "", scritta: x.createTime, risposta: x.reviewReply?.comment ?? null });
    }
    pageToken = r.nextPageToken ?? "";
  } while (pageToken && out.length < max);
  return out;
}

export function rispondiRecensione(account: string, location: string, reviewId: string, testo: string) {
  return api(`https://mybusiness.googleapis.com/v4/${v4(account, location)}/reviews/${reviewId}/reply`, { method: "PUT", body: JSON.stringify({ comment: testo }) });
}

export async function pubblicaNovitaGoogle(account: string, location: string, testo: string) {
  const r = await api<{ name: string }>(`https://mybusiness.googleapis.com/v4/${v4(account, location)}/localPosts`, {
    method: "POST",
    body: JSON.stringify({ languageCode: "it", summary: testo, topicType: "STANDARD" }),
  });
  return r.name;
}

// Numeri del mese: visualizzazioni su Maps e Ricerca, chiamate, indicazioni, clic al sito.
export const METRICHE = {
  BUSINESS_IMPRESSIONS_MOBILE_MAPS: "Visualizzazioni su Maps (telefono)",
  BUSINESS_IMPRESSIONS_DESKTOP_MAPS: "Visualizzazioni su Maps (computer)",
  BUSINESS_IMPRESSIONS_MOBILE_SEARCH: "Visualizzazioni su Google (telefono)",
  BUSINESS_IMPRESSIONS_DESKTOP_SEARCH: "Visualizzazioni su Google (computer)",
  CALL_CLICKS: "Chiamate",
  BUSINESS_DIRECTION_REQUESTS: "Richieste di indicazioni",
  WEBSITE_CLICKS: "Clic sul sito",
} as const;
export type Metrica = keyof typeof METRICHE;

export async function numeriMese(location: string, anno: number, mese: number): Promise<Record<Metrica, number>> {
  const fine = new Date(Date.UTC(anno, mese, 0));
  const q = new URLSearchParams({
    "dailyRange.start_date.year": String(anno), "dailyRange.start_date.month": String(mese), "dailyRange.start_date.day": "1",
    "dailyRange.end_date.year": String(anno), "dailyRange.end_date.month": String(mese), "dailyRange.end_date.day": String(fine.getUTCDate()),
  });
  for (const m of Object.keys(METRICHE)) q.append("dailyMetrics", m);
  const r = await api<{ multiDailyMetricTimeSeries?: { dailyMetricTimeSeries?: { dailyMetric: Metrica; timeSeries?: { datedValues?: { value?: string }[] } }[] }[] }>(
    `https://businessprofileperformance.googleapis.com/v1/${location}:fetchMultiDailyMetricsTimeSeries?${q}`,
  );
  const out = Object.fromEntries(Object.keys(METRICHE).map((k) => [k, 0])) as Record<Metrica, number>;
  for (const s of r.multiDailyMetricTimeSeries?.flatMap((x) => x.dailyMetricTimeSeries ?? []) ?? []) {
    out[s.dailyMetric] = (s.timeSeries?.datedValues ?? []).reduce((t, v) => t + Number(v.value ?? 0), 0);
  }
  return out;
}
