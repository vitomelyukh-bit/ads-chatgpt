import { ImageResponse } from "next/og";
import { bricolage } from "@/lib/og-font";

export const alt = "TiTrovano: più clienti da Google Maps, senza muovere un dito";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Copertina del design system: isolati di una mappa, un segnaposto e cinque stelle.
const c = { paper: "#f7f2e8", ink: "#16140f", muted: "#524c40", brand: "#1f3fd6", tint: "#e3e8fb", mark: "#ffd53d" };
const blocchi: [number, number, number, number, string][] = [
  [496, -16, 176, 88, c.tint], [688, -16, 112, 88, c.ink], [816, -16, 160, 88, c.tint],
  [496, 88, 304, 112, c.brand], [816, 88, 160, 112, c.mark],
  [496, 216, 112, 100, c.ink], [624, 216, 176, 100, c.tint], [816, 216, 160, 100, c.brand],
  [496, 332, 176, 100, c.tint], [688, 332, 112, 100, c.mark], [816, 332, 160, 100, c.tint],
  [496, 448, 112, 60, c.brand], [624, 448, 176, 60, c.ink], [816, 448, 160, 60, c.tint],
];
const STELLA = "M0-10l2.9 6.2 6.6.8-4.9 4.6 1.3 6.6L0 4.9l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z";

export default async function OgImage() {
  const font = await bricolage(700);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: c.paper, fontFamily: font ? "Bricolage" : "sans-serif" }}>
        <svg width="640" height="630" viewBox="488 -16 488 480" style={{ position: "absolute", right: 0, top: 0 }}>
          {blocchi.map(([x, y, w, h, f], i) => <rect key={i} x={x} y={y} width={w} height={h} rx="10" fill={f} />)}
          <path d="M648 186C636 164 622 150 622 134A26 26 0 1 1 674 134C674 150 660 164 648 186Z" fill="#ffffff" />
          <circle cx="648" cy="134" r="9" fill={c.brand} />
          {[0, 24, 48, 72, 96].map((dx) => <path key={dx} d={STELLA} transform={`translate(${840 + dx} 144)`} fill={c.ink} />)}
        </svg>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "64px 24px 64px 64px", width: 568, height: "100%" }}>
          <div style={{ display: "flex", fontSize: 104, fontWeight: 700, letterSpacing: -3, lineHeight: 0.95, color: c.ink }}>TiTrovano</div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: 28, fontSize: 36, fontWeight: 700, lineHeight: 1.1, letterSpacing: -1, color: c.ink }}>
            <span>Più clienti da Google Maps,</span>
            <span style={{ display: "flex", marginTop: 8 }}><span style={{ background: c.mark, padding: "0 10px", borderRadius: 8 }}>senza muovere un dito.</span></span>
          </div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 24, color: c.muted }}>59 € al mese · disdici quando vuoi</div>
        </div>
      </div>
    ),
    { ...size, fonts: font ? [{ name: "Bricolage", data: font, weight: 700, style: "normal" }] : [] },
  );
}
