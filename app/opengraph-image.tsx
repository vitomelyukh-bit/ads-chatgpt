import { ImageResponse } from "next/og";

export const alt = "TiTrovano: annunci su ChatGPT per attività e aziende";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 80, background: "#0a0a0b", color: "#f2f2f0", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 40, fontWeight: 700 }}>
          <div style={{ width: 30, height: 30, borderRadius: 7, background: "#d7ff3f", display: "flex" }} />
          TiTrovano
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: -3 }}>
          <span>I tuoi clienti chiedono a ChatGPT.</span>
          <span style={{ color: "#d7ff3f" }}>Fatti trovare con gli annunci.</span>
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#b4b4b9" }}>Strategia · Campagne · Report — Analisi gratuita</div>
      </div>
    ),
    size,
  );
}
