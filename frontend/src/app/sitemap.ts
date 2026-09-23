import type { MetadataRoute } from "next";
import { PUBLIC_INDEXABLE_ROUTES, getCanonicalUrl } from "@/lib/seo.config";

/**
 * Dynamic Next.js XML Sitemap Generator
 * Endpoint: /sitemap.xml
 *
 * Rules:
 *  - Includes only verified, public, indexable pages.
 *  - Normalized to https://rank.zobay.in with clean paths.
 *  - Omits authenticated, user-specific, project, billing, or draft routes.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();

  const entries: MetadataRoute.Sitemap = PUBLIC_INDEXABLE_ROUTES.map((route) => {
    let priority = 0.7;
    let changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" = "weekly";

    if (route === "/") {
      priority = 1.0;
      changeFrequency = "daily";
    } else if (
      route === "/seo-optimization" ||
      route === "/aeo-optimization" ||
      route === "/geo-optimization" ||
      route === "/ai-search-optimization" ||
      route === "/pricing"
    ) {
      priority = 0.9;
      changeFrequency = "daily";
    } else if (
      route === "/seo-vs-aeo-vs-geo" ||
      route.startsWith("/compare") ||
      route.startsWith("/use-cases")
    ) {
      priority = 0.8;
      changeFrequency = "weekly";
    } else if (route.startsWith("/glossary") || route === "/faq") {
      priority = 0.8;
      changeFrequency = "weekly";
    } else if (route.startsWith("/privacy") || route.startsWith("/terms")) {
      priority = 0.4;
      changeFrequency = "monthly";
    }

    return {
      url: getCanonicalUrl(route),
      lastModified: currentDate,
      changeFrequency,
      priority,
    };
  });

  return entries;
}
