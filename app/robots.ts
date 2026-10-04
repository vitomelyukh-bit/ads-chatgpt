import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

// Crawler degli assistenti AI consentiti in modo esplicito.
const AI_BOTS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "ClaudeBot", "Google-Extended"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      ...AI_BOTS.map((userAgent) => ({ userAgent, allow: "/", disallow: ["/console", "/l/", "/api/", "/r/", "/scheda-google/grazie", "/scheda-google/gestisci"] })),
      { userAgent: "*", allow: "/", disallow: ["/console", "/l/", "/api/", "/r/", "/scheda-google/grazie", "/scheda-google/gestisci"] },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
