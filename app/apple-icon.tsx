import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Icona per iPhone ricavata da favicon.svg ("Ti" con il segnaposto su quadrato ink), a tutto quadrato.
export default async function AppleIcon() {
  const svg = (await readFile(join(process.cwd(), "app/icon.svg"), "utf8")).replace('rx="16"', 'rx="0"');
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#10231f" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`} width={180} height={180} alt="" />
      </div>
    ),
    size,
  );
}
