import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { site } from "@/lib/site";
import "./globals.css";

// Carattere del design system TiTrovano (direzione Mappa): Outfit.
const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap", variable: "--font-outfit" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  applicationName: site.name,
  title: { default: site.name, template: `%s · ${site.name}` },
  description: site.description,
  formatDetection: { telephone: false, email: false, address: false },
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "only light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={outfit.variable}>
      <body className="tt">
        <a href="#contenuto" className="tt-btn tt-skip">
          Vai al contenuto
        </a>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
