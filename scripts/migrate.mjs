// Applica uno script SQL al database (idempotente). Uso: node --env-file=.env.local scripts/migrate.mjs scripts/schema-scheda.sql
import fs from "node:fs";
import { neon } from "@neondatabase/serverless";

const file = process.argv[2];
const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (!file || !url) throw new Error("Uso: node --env-file=.env.local scripts/migrate.mjs <file.sql> (serve DATABASE_URL)");
const sql = neon(url);
const ddl = fs.readFileSync(file, "utf8").split("\n").filter((r) => !r.trim().startsWith("--")).join("\n");
for (const stmt of ddl.split(/;\s*\n/).map((s) => s.trim()).filter(Boolean)) {
  await sql.query(stmt);
}
console.log("Applicato:", file);
