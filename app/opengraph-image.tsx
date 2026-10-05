import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "TiTrovano: più clienti da Google Maps, senza muovere un dito";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Copertina della direzione Mappa: la mappa, il tuo segnaposto in evidenza, gli altri in grigio.
const c = { ink: "#10231f", muted: "#4a5e58", brand: "#0a7d6c", pin: "#ef5b4c", pinMuted: "#7c8f89", land: "#e8eeea", park: "#cfe6d4", water: "#cfe2ee", star: "#f5a524" };
const PIN = "M12 29C8 22 2 17.5 2 11.5a10 10 0 1 1 20 0C22 17.5 16 22 12 29Z";

async function outfit(peso: number) {
  try {
    const css = await (await fetch(`https://fonts.googleapis.com/css2?family=Outfit:wght@${peso}`, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 6.1)" } })).text();
    const url = css.match(/src: url\((.+?)\) format/)?.[1];
    return url ? await (await fetch(url)).arrayBuffer() : null;
  } catch { return null; }
}

export default async function OgImage() {
  const [f700, f400] = await Promise.all([outfit(700), outfit(400)]);
  const logo = await readFile(join(process.cwd(), "public/brand/titrovano-logo.svg"), "utf8");
  const fonts = [...(f700 ? [{ name: "Outfit", data: f700, weight: 700 as const, style: "normal" as const }] : []), ...(f400 ? [{ name: "Outfit", data: f400, weight: 400 as const, style: "normal" as const }] : [])];
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: c.land, fontFamily: fonts.length ? "Outfit" : "sans-serif" }}>
        <svg width="1200" height="630" viewBox="0 0 1100 560" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", left: 0, top: 0 }}>
          <rect width="1100" height="560" fill={c.land} />
          <path d="M620 0h210v150H620z" fill={c.park} />
          <path d="M880 330c80-30 160 0 220 40v190H820c0-90 10-200 60-230z" fill={c.water} />
          <g stroke="#ffffff" fill="none" strokeLinecap="round">
            <path d="M-20 140L1120 60" strokeWidth="22" /><path d="M-20 420L1120 300" strokeWidth="26" /><path d="M560-20L640 580" strokeWidth="22" />
            <path d="M860-20L800 580" strokeWidth="16" /><path d="M-20 280L1120 190" strokeWidth="12" /><path d="M700-20L760 580" strokeWidth="10" />
            <path d="M960-20L1000 580" strokeWidth="12" /><path d="M-20 520L1120 460" strokeWidth="12" />
          </g>
          <path d="M640 470C700 380 720 300 838 236" stroke={c.brand} strokeWidth="5" strokeDasharray="2 12" strokeLinecap="round" fill="none" />
        </svg>
        <svg width="72" height="90" viewBox="0 0 24 30" style={{ position: "absolute", left: 880, top: 160 }}><path d={PIN} fill={c.pin} /><circle cx="12" cy="11.5" r="3.6" fill="#fff" /></svg>
        <svg width="34" height="43" viewBox="0 0 24 30" style={{ position: "absolute", left: 700, top: 440, opacity: 0.7 }}><path d={PIN} fill={c.pinMuted} /><circle cx="12" cy="11.5" r="3.6" fill="#fff" /></svg>
        <svg width="34" height="43" viewBox="0 0 24 30" style={{ position: "absolute", left: 1080, top: 400, opacity: 0.7 }}><path d={PIN} fill={c.pinMuted} /><circle cx="12" cy="11.5" r="3.6" fill="#fff" /></svg>
        <div style={{ position: "absolute", left: 790, top: 64, display: "flex", flexDirection: "column", padding: "16px 22px", borderRadius: 16, background: "#fff" }}>
          <span style={{ fontSize: 26, fontWeight: 700, color: c.ink }}>La tua attività</span>
          <span style={{ fontSize: 22, color: c.ink, display: "flex", alignItems: "center" }}>4,8
            {[0, 1, 2, 3, 4].map((i) => <svg key={i} width="22" height="22" viewBox="0 0 24 24" style={{ marginLeft: i ? 2 : 10 }}><path d="M12 2.5l2.9 6.2 6.6.8-4.9 4.6 1.3 6.6L12 17.4l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" fill={c.star} /></svg>)}
          </span>
        </div>
        <div style={{ position: "absolute", left: 56, top: 56, bottom: 56, width: 600, display: "flex", flexDirection: "column", justifyContent: "center", padding: 48, borderRadius: 28, background: "#fff" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`data:image/svg+xml;base64,${Buffer.from(logo).toString("base64")}`} width={285} height={80} alt="TiTrovano" />
          <div style={{ display: "flex", flexDirection: "column", marginTop: 32, fontSize: 44, fontWeight: 700, lineHeight: 1.1, letterSpacing: -1, color: c.ink }}>
            <span>Più clienti da Google Maps,</span>
            <span style={{ color: c.brand }}>senza muovere un dito.</span>
          </div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 26, color: c.muted }}>59 € al mese · disdici quando vuoi</div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
