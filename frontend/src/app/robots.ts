import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/seo.config";

/**
 * Dynamic Next.js robots.txt handler
 * Endpoint: /robots.txt
 *
 * Rules:
 *  - Permits general search engines to crawl public marketing, educational, and documentation pages.
 *  - Allows legitimate AI crawlers (GPTBot, ClaudeBot, PerplexityBot, etc.) to index public content for AEO/GEO answer accuracy.
 *  - Strictly disallows private authenticated dashboard, project, billing, API, and credential routes.
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = SITE_CONFIG.siteUrl;

  const disallowedPrivatePaths = [
    "/dashboard",
    "/dashboard/",
    "/overview",
    "/overview/",
    "/seo/",
    "/aeo/",
    "/geo/",
    "/projects",
    "/projects/",
    "/settings",
    "/settings/",
    "/billing",
    "/billing/",
    "/login",
    "/signup",
    "/register",
    "/auth/",
    "/forgot-password",
    "/reset-password",
    "/api/",
    "/internal/",
    "/notifications",
    "/notifications/",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/pricing",
          "/seo-optimization",
          "/aeo-optimization",
          "/geo-optimization",
          "/ai-search-optimization",
          "/seo-vs-aeo-vs-geo",
          "/compare",
          "/compare/",
          "/use-cases/",
          "/resources",
          "/blog",
          "/blog/",
          "/guides",
          "/guides/",
          "/glossary",
          "/glossary/",
          "/faq",
          "/about",
          "/about-zobay-rank",
          "/contact",
          "/privacy-policy",
          "/terms",
          "/refund-policy",
        ],
        disallow: disallowedPrivatePaths,
      },
      // Explicit AI Crawler Accessibility (AEO & GEO discovery)
      {
        userAgent: [
          "GPTBot",
          "ClaudeBot",
          "PerplexityBot",
          "Google-Extended",
          "Applebot-Extended",
          "CCBot",
        ],
        allow: [
          "/",
          "/pricing",
          "/seo-optimization",
          "/aeo-optimization",
          "/geo-optimization",
          "/ai-search-optimization",
          "/seo-vs-aeo-vs-geo",
          "/compare",
          "/compare/",
          "/use-cases/",
          "/resources",
          "/blog",
          "/blog/",
          "/guides",
          "/guides/",
          "/glossary",
          "/glossary/",
          "/faq",
          "/about",
          "/about-zobay-rank",
          "/contact",
          "/llms.txt",
          "/llms-full.txt",
        ],
        disallow: disallowedPrivatePaths,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
