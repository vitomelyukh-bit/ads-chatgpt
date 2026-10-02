import type { Metadata } from "next";
import { site } from "./site";

export function pageMetadata(opts: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  noindex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
}): Metadata {
  return {
    // title.absolute: il marchio è già dentro i title scritti a mano.
    title: { absolute: opts.title },
    description: opts.description,
    alternates: { canonical: opts.path },
    robots: opts.noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: opts.type ?? "website",
      url: opts.path,
      siteName: site.name,
      locale: site.locale,
      title: opts.title,
      description: opts.description,
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: site.name }],
      ...(opts.type === "article"
        ? { publishedTime: opts.publishedTime, modifiedTime: opts.modifiedTime }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
      images: ["/opengraph-image"],
    },
  };
}
