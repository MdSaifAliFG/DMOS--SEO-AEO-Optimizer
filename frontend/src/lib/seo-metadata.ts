import type { Metadata } from "next";
import { SITE_CONFIG, getCanonicalUrl } from "./seo.config";

export interface PageMetadataOptions {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  noindex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  keywords?: string[];
  type?: "website" | "article";
}

/**
 * Creates standardized, fully validated Next.js metadata for any page in Zobay Rank.
 * Handles canonical URL generation, OpenGraph, Twitter Cards, and environment-aware indexing.
 */
export function createPageMetadata({
  title,
  description,
  path,
  ogImage = `${SITE_CONFIG.siteUrl}/brand-logo.png`,
  noindex = false,
  publishedTime,
  modifiedTime,
  keywords = [
    "Zobay Rank",
    "SEO Optimization",
    "Answer Engine Optimization",
    "AEO",
    "Generative Engine Optimization",
    "GEO",
    "AI Search",
    "AI Search Visibility",
    "Technical SEO",
    "Citation Analysis",
    "Entity Optimization",
  ],
  type = "website",
}: PageMetadataOptions): Metadata {
  const canonicalUrl = getCanonicalUrl(path);

  // Development/staging environments or explicit noindex flags must be noindex
  const isDevEnvironment =
    process.env.NODE_ENV !== "production" &&
    SITE_CONFIG.siteUrl.includes("localhost");
  const shouldNoIndex = noindex || isDevEnvironment;

  const resolvedOgImage = ogImage.startsWith("http")
    ? ogImage
    : `${SITE_CONFIG.siteUrl}${ogImage.startsWith("/") ? "" : "/"}${ogImage}`;

  const metadata: Metadata = {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: !shouldNoIndex,
      follow: !shouldNoIndex,
      googleBot: {
        index: !shouldNoIndex,
        follow: !shouldNoIndex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_CONFIG.name,
      locale: SITE_CONFIG.locale,
      type,
      images: [
        {
          url: resolvedOgImage,
          width: 1200,
          height: 630,
          alt: `${SITE_CONFIG.name} — ${title}`,
        },
      ],
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [resolvedOgImage],
      creator: SITE_CONFIG.twitterHandle,
      site: SITE_CONFIG.twitterHandle,
    },
  };

  return metadata;
}

/**
 * Creates standardized NOINDEX metadata for private dashboard, auth, or internal application pages.
 */
export function createPrivatePageMetadata(title: string): Metadata {
  return {
    title: `${title} | ${SITE_CONFIG.name}`,
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
      },
    },
  };
}
