import { ImageResponse } from "next/og";

export const alt = "TiTrovano: quando un cliente chiede all'AI, esce il tuo nome?";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#ffffff",
          color: "#14201e",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 40, fontWeight: 700 }}>
          <div style={{ width: 40, height: 40, borderRadius: 40, border: "8px solid #0f5e54", display: "flex" }} />
          TiTrovano
        </div>
        <div style={{ display: "flex", fontSize: 72, fontWeight: 700, lineHeight: 1.1, letterSpacing: -2, maxWidth: 1000 }}>
          Quando un cliente chiede all&apos;AI, esce il tuo nome?
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              display: "flex",
              background: "#0f5e54",
              color: "#ffffff",
              fontSize: 32,
              fontWeight: 700,
              padding: "16px 32px",
              borderRadius: 16,
            }}
          >
            Scoprilo con la prova gratuita
          </div>
        </div>
      </div>
    ),
    size,
  );
}
