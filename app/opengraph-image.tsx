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
          background: "#f5f1e8",
          color: "#151411",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 0, fontSize: 44, fontWeight: 700 }}>
          <span style={{ display: "flex" }}>Ti</span>
          <span style={{ display: "flex", background: "#ffdf3d", padding: "0 6px" }}>Trovano</span>
        </div>
        <div style={{ display: "flex", fontSize: 72, fontWeight: 700, lineHeight: 1.1, letterSpacing: -2, maxWidth: 1000 }}>
          Quando un cliente chiede all&apos;AI, esce il tuo nome?
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              display: "flex",
              background: "#151411",
              color: "#f5f1e8",
              fontSize: 32,
              fontWeight: 700,
              padding: "16px 32px",
              borderRadius: 999,
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
