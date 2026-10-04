import type { Metadata } from "next";

export const metadata: Metadata = { title: { absolute: "Console · TiTrovano" }, robots: { index: false, follow: false } };

export default function ConsoleRoot({ children }: { children: React.ReactNode }) {
  return children;
}
