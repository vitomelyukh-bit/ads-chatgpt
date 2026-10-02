import type { MetadataRoute } from "next";
import { getGuide, getSettori } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl("/"), changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/prova-gratuita"), changeFrequency: "yearly", priority: 0.9 },
    { url: absoluteUrl("/settori"), changeFrequency: "monthly", priority: 0.7 },
    ...getSettori().map((s) => ({
      url: absoluteUrl(`/settori/${s.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: absoluteUrl("/guide"), changeFrequency: "weekly", priority: 0.7 },
    ...getGuide().map((g) => ({
      url: absoluteUrl(`/guide/${g.slug}`),
      lastModified: g.dateModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
