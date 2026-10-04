import { booking } from "./booking-config";

// Data e ora "da muro" in Europe/Rome → istante UTC (gestisce l'ora legale).
export function romaToDate(y: number, m: number, d: number, hh: number, mm: number) {
  const guess = Date.UTC(y, m - 1, d, hh, mm);
  const offset = (t: number) => {
    const p = Object.fromEntries(
      new Intl.DateTimeFormat("en-US", { timeZone: booking.timeZone, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })
        .formatToParts(new Date(t))
        .map((x) => [x.type, x.value]),
    );
    return Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute) - t;
  };
  return new Date(guess - offset(guess - offset(guess)));
}

function partiRoma(t: Date) {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", { timeZone: booking.timeZone, year: "numeric", month: "2-digit", day: "2-digit", weekday: "short" })
      .formatToParts(t)
      .map((x) => [x.type, x.value]),
  );
  const wd = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(p.weekday);
  return { y: +p.year, m: +p.month, d: +p.day, wd };
}

export type Giorno = { data: string; etichetta: string; orari: { iso: string; ora: string }[] };

// Tutti gli orari possibili secondo le regole (prima di togliere gli impegni).
export function orariCandidati(ora = new Date()): Date[] {
  const out: Date[] = [];
  const minimo = ora.getTime() + booking.preavvisoOre * 3600_000;
  for (let i = 0; i <= booking.giorniAvanti; i++) {
    const { y, m, d, wd } = partiRoma(new Date(ora.getTime() + i * 86400_000));
    for (const [da, a] of booking.orari[wd] ?? []) {
      const [h1, m1] = da.split(":").map(Number);
      const [h2, m2] = a.split(":").map(Number);
      for (let min = h1 * 60 + m1; min + booking.durataMin <= h2 * 60 + m2; min += booking.passoMin) {
        const t = romaToDate(y, m, d, Math.floor(min / 60), min % 60);
        if (t.getTime() >= minimo) out.push(t);
      }
    }
  }
  return [...new Map(out.map((t) => [t.getTime(), t])).values()].sort((a, b) => a.getTime() - b.getTime());
}

export function libero(t: Date, busy: { start: number; end: number }[]) {
  const s = t.getTime();
  const e = s + booking.durataMin * 60_000;
  return !busy.some((b) => b.start < e && b.end > s);
}

export function raggruppa(orari: Date[]): Giorno[] {
  const giorni = new Map<string, Giorno>();
  for (const t of orari) {
    const data = new Intl.DateTimeFormat("sv-SE", { timeZone: booking.timeZone }).format(t);
    const g = giorni.get(data) ?? {
      data,
      etichetta: new Intl.DateTimeFormat("it-IT", { timeZone: booking.timeZone, weekday: "long", day: "numeric", month: "long" }).format(t),
      orari: [],
    };
    g.orari.push({ iso: t.toISOString(), ora: new Intl.DateTimeFormat("it-IT", { timeZone: booking.timeZone, hour: "2-digit", minute: "2-digit" }).format(t) });
    giorni.set(data, g);
  }
  return [...giorni.values()];
}

export function etichettaCompleta(t: Date) {
  return new Intl.DateTimeFormat("it-IT", { timeZone: booking.timeZone, weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" }).format(t);
}
