import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Icona per iPhone ricavata da favicon.svg: "Ti" con il segnaposto su quadrato ink.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#16140f" }}>
        <svg width="180" height="180" viewBox="0 0 64 64">
          <g transform="translate(13.74 54.00) scale(0.788)">
            <path fill="#f5efe3" d="M20.71 0L12.35 0L12.35-31.26L1.04-31.26L1.04-38.28L32.02-38.28L32.02-31.26L20.71-31.26M44.30 0L35.95 0L35.95-30.45L44.30-30.45" />
            <path fill="#ffd53d" d="M40.20 -34.05C36.72 -39.87 32.29 -42.76 32.29 -47.91A7.91 7.91 0 1 1 48.12 -47.91C48.12 -42.76 43.69 -39.87 40.20 -34.05Z" />
          </g>
        </svg>
      </div>
    ),
    size,
  );
}
