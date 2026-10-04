import { ImageResponse } from "next/og";
import { bricolage } from "@/lib/og-font";

export const alt = "TiTrovano: più clienti da Google Maps, senza muovere un dito";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Colori del design system: carta, inchiostro, evidenziatore giallo.
export default async function OgImage() {
  const font = await bricolage(700);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#f7f2e8", color: "#16140f", fontFamily: font ? "Bricolage" : "sans-serif", borderBottom: "16px solid #16140f" }}>
        <div style={{ display: "flex", fontSize: 44, fontWeight: 700, letterSpacing: -1 }}>TiTrovano</div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2 }}>
          <span>Più clienti da Google Maps,</span>
          <div style={{ display: "flex", marginTop: 12 }}>
            <span style={{ background: "#ffd53d", padding: "0 12px", borderRadius: 8 }}>senza muovere un dito.</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", background: "#1f3fd6", color: "#ffffff", fontSize: 30, fontWeight: 700, padding: "16px 28px", borderRadius: 12 }}>
            Da 59 € al mese, senza vincoli →
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: font ? [{ name: "Bricolage", data: font, weight: 700, style: "normal" }] : [] },
  );
}
