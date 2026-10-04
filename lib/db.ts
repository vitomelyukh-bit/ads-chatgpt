import { neon } from "@neondatabase/serverless";

let _sql: ReturnType<typeof neon> | null = null;

// Database (Neon). Inizializzazione pigra: la build non deve dipendere dal DB.
export function db() {
  if (!_sql) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL mancante");
    _sql = neon(url);
  }
  return _sql;
}
