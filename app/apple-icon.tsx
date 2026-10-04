import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Stessa icona della favicon: fumetto giallo con la T, su carta.
export default function AppleIcon() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M6 2h20a4 4 0 0 1 4 4v15a4 4 0 0 1-4 4H13l-6 5v-5H6a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4z" fill="#ffd53d" stroke="#16140f" stroke-width="2.4" stroke-linejoin="round"/><path d="M9 7.5h14v4h-5v10h-4v-10H9z" fill="#16140f"/></svg>`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#f7f2e8" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`} width={136} height={136} alt="" />
      </div>
    ),
    size,
  );
}
