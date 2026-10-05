// Template delle email: tabelle e stili inline, così si vedono bene in Gmail,
// Outlook e Apple Mail. Due marchi: TiTrovano (design system) e il cliente.

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export type Marchio = {
  nome: string;
  colore: string; // colore dei bottoni e dei link
  logo?: string | null; // URL immagine; se manca si scrive il nome
  piede: string; // riga in fondo (testo semplice)
  titrovano?: boolean; // stile TiTrovano (evidenziatore sul nome)
};

export const TITROVANO: Marchio = {
  nome: "TiTrovano",
  colore: "#0a7d6c",
  piede: "TiTrovano · Più clienti da Google Maps · titrovano.it · P.IVA 18333881003",
  titrovano: true,
};

export type Blocco =
  | { tipo: "p"; testo: string }
  | { tipo: "titoletto"; testo: string }
  | { tipo: "righe"; righe: [string, string][] }
  | { tipo: "passi"; passi: string[] }
  | { tipo: "evidenza"; etichetta: string; testo: string }
  | { tipo: "bottone"; testo: string; url: string }
  | { tipo: "nota"; testo: string };

const FONT = `Outfit, 'Trebuchet MS', Arial, sans-serif`;
const FONT_TITOLO = `Outfit, 'Trebuchet MS', Arial, sans-serif`;
const INK = "#10231f", MUTE = "#4a5e58", PAPER = "#f2f6f4", RAISED = "#ffffff", LINE = "#d5dedb", MARK = "#dff1ed";

function blocco(b: Blocco, m: Marchio): string {
  switch (b.tipo) {
    case "p":
      return `<p style="margin:0 0 16px;font:400 17px/1.6 ${FONT};color:${INK};">${esc(b.testo).replace(/\n/g, "<br>")}</p>`;
    case "titoletto":
      return `<p style="margin:24px 0 8px;font:700 13px/1.3 ${FONT};letter-spacing:.08em;text-transform:uppercase;color:${INK};">${esc(b.testo)}</p>`;
    case "righe":
      return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;border-top:1px solid ${LINE};">${b.righe
        .map(([k, v]) => `<tr><td style="padding:10px 12px 10px 0;border-bottom:1px solid ${LINE};font:700 15px/1.4 ${FONT};color:${MUTE};width:38%;vertical-align:top;">${esc(k)}</td><td style="padding:10px 0;border-bottom:1px solid ${LINE};font:400 16px/1.5 ${FONT};color:${INK};vertical-align:top;">${esc(v).replace(/\n/g, "<br>")}</td></tr>`)
        .join("")}</table>`;
    case "passi":
      return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 20px;">${b.passi
        .map((p, i) => `<tr><td style="padding:0 14px 14px 0;vertical-align:top;"><div style="width:32px;height:32px;line-height:32px;text-align:center;border-radius:8px;background:${INK};color:${PAPER};font:700 16px ${FONT_TITOLO};">${i + 1}</div></td><td style="padding:4px 0 14px;font:400 16px/1.5 ${FONT};color:${INK};vertical-align:top;">${esc(p)}</td></tr>`)
        .join("")}</table>`;
    case "evidenza":
      return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;"><tr><td style="padding:18px 20px;border:1px solid ${LINE};border-radius:16px;background:${MARK};">
        <span style="display:inline-block;padding:2px 8px;border-radius:6px;background:#ffffff;color:#0a7d6c;font:700 12px/1.4 ${FONT};letter-spacing:.08em;text-transform:uppercase;">${esc(b.etichetta)}</span>
        <p style="margin:10px 0 0;font:700 22px/1.3 ${FONT_TITOLO};color:${INK};">${esc(b.testo)}</p></td></tr></table>`;
    case "bottone":
      return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 24px;"><tr><td style="border-radius:12px;background:${m.colore};">
        <a href="${esc(b.url)}" style="display:inline-block;padding:15px 26px;font:700 17px/1 ${FONT};color:#ffffff;text-decoration:none;border-radius:999px;">${esc(b.testo)}</a></td></tr></table>`;
    case "nota":
      return `<p style="margin:0 0 12px;font:400 15px/1.5 ${FONT};color:${MUTE};">${esc(b.testo).replace(/\n/g, "<br>")}</p>`;
  }
}

export function emailHtml({ marchio: m, anteprima, titolo, evidenzia, blocchi }: {
  marchio: Marchio; anteprima: string; titolo: string; evidenzia?: string; blocchi: Blocco[];
}) {
  // Il titolo può avere una parola evidenziata (solo stile TiTrovano).
  const t = esc(titolo);
  const titoloHtml = evidenzia && m.titrovano
    ? t.replace(esc(evidenzia), `<span style="background:${MARK};padding:0 4px;border-radius:4px;">${esc(evidenzia)}</span>`)
    : t;
  const testata = m.logo
    ? `<img src="${esc(m.logo)}" alt="${esc(m.nome)}" height="36" style="display:block;height:36px;width:auto;border:0;">`
    : m.titrovano
      ? `<span style="font:800 24px/1 ${FONT_TITOLO};letter-spacing:-0.02em;color:${INK};">Ti<span style="color:#0a7d6c;">Trovano</span></span>`
      : `<span style="font:800 22px/1.2 ${FONT_TITOLO};color:${INK};">${esc(m.nome)}</span>`;
  // Stile TiTrovano: carta e bordo spesso. Stile cliente: neutro, con il suo colore in alto.
  const sfondo = m.titrovano ? PAPER : "#f3f3f1";
  const scheda = m.titrovano
    ? `background:${RAISED};border:2px solid ${INK};border-radius:20px;`
    : `background:${RAISED};border:1px solid #e2e0da;border-top:6px solid ${m.colore};border-radius:14px;`;
  return `<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only">
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&display=swap" rel="stylesheet">
<title>${esc(titolo)}</title></head>
<body style="margin:0;padding:0;background:${sfondo};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(anteprima)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${sfondo};"><tr><td align="center" style="padding:28px 14px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;">
    <tr><td style="padding:0 4px 18px;">${testata}</td></tr>
    <tr><td style="${scheda}padding:30px 28px 18px;">
      <h1 style="margin:0 0 18px;font:800 28px/1.15 ${FONT_TITOLO};letter-spacing:-0.01em;color:${INK};">${titoloHtml}</h1>
      ${blocchi.map((b) => blocco(b, m)).join("\n      ")}
    </td></tr>
    <tr><td style="padding:18px 6px 0;font:400 13px/1.5 ${FONT};color:${MUTE};">${esc(m.piede)}</td></tr>
  </table>
</td></tr></table></body></html>`;
}

// Versione solo testo, generata dagli stessi blocchi.
export function emailTesto(titolo: string, blocchi: Blocco[], piede: string) {
  const out = [titolo, ""];
  for (const b of blocchi) {
    if (b.tipo === "p" || b.tipo === "nota") out.push(b.testo, "");
    if (b.tipo === "titoletto") out.push(b.testo.toUpperCase());
    if (b.tipo === "righe") out.push(...b.righe.map(([k, v]) => `${k}: ${v}`), "");
    if (b.tipo === "passi") out.push(...b.passi.map((p, i) => `${i + 1}. ${p}`), "");
    if (b.tipo === "evidenza") out.push(`${b.etichetta}: ${b.testo}`, "");
    if (b.tipo === "bottone") out.push(`${b.testo}: ${b.url}`, "");
  }
  out.push("—", piede);
  return out.join("\n");
}

export function email(args: { marchio: Marchio; anteprima: string; titolo: string; evidenzia?: string; blocchi: Blocco[] }) {
  return { html: emailHtml(args), text: emailTesto(args.titolo, args.blocchi, args.marchio.piede) };
}
