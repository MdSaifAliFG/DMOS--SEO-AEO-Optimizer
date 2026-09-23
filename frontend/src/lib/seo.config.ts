/**
 * Centralized SEO, AEO & GEO Configuration for Zobay Rank
 * Primary Production Domain: https://rank.zobay.in/
 */

export const SITE_CONFIG = {
  name: "Zobay Rank",
  legalName: "Zobay",
  productName: "Zobay Rank",
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL || "https://rank.zobay.in").replace(/\/+$/, ""),
  defaultTitle: "Zobay Rank — SEO, AEO & GEO Optimization Platform",
  defaultDescription:
    "Zobay Rank helps businesses improve search visibility with SEO, Answer Engine Optimization and Generative Engine Optimization across traditional and AI-powered search.",
  tagline: "AI-Powered SEO, AEO & GEO Optimization Platform",
  supportEmail: "support@zobay.in",
  logoUrl: "https://rank.zobay.in/logo.png",
  faviconUrl: "https://rank.zobay.in/favicon.png",
  twitterHandle: "@zobayrank",
  locale: "en_US",
} as const;

/**
 * Normalizes any relative or absolute path into an absolute canonical URL
 * using https://rank.zobay.in as the single source of truth.
 * Ensures:
 *  - Lowercase paths
 *  - No trailing slash (except root)
 *  - No query params or hashes in canonical
 */
export function getCanonicalUrl(path: string = "/"): string {
  const base = SITE_CONFIG.siteUrl;
  let cleanPath = path.split("?")[0].split("#")[0].trim().toLowerCase();

  if (!cleanPath.startsWith("/")) {
    cleanPath = `/${cleanPath}`;
  }

  // Remove trailing slash unless it's root
  if (cleanPath.length > 1 && cleanPath.endsWith("/")) {
    cleanPath = cleanPath.slice(0, -1);
  }

  return cleanPath === "/" ? `${base}/` : `${base}${cleanPath}`;
}

/**
 * Public routes that must be indexed by search engines & AI crawlers
 */
export const PUBLIC_INDEXABLE_ROUTES = [
  "/",
  "/pricing",
  "/seo-optimization",
  "/aeo-optimization",
  "/geo-optimization",
  "/ai-search-optimization",
  "/seo-vs-aeo-vs-geo",
  "/compare",
  "/compare/zobay-rank-vs-traditional-seo-tools",
  "/use-cases/saas",
  "/use-cases/ecommerce",
  "/use-cases/agencies",
  "/use-cases/startups",
  "/use-cases/marketing-teams",
  "/use-cases/enterprise",
  "/resources",
  "/blog",
  "/guides",
  "/glossary",
  "/glossary/seo",
  "/glossary/aeo",
  "/glossary/geo",
  "/glossary/ai-search",
  "/glossary/technical-seo",
  "/glossary/entity-seo",
  "/glossary/citation",
  "/glossary/ai-visibility",
  "/faq",
  "/about",
  "/about-zobay-rank",
  "/contact",
  "/privacy-policy",
  "/terms",
  "/refund-policy",
] as const;

/**
 * Private routes that must explicitly emit NOINDEX, NOFOLLOW
 */
export const PRIVATE_NOINDEX_ROUTES = [
  "/dashboard",
  "/overview",
  "/seo",
  "/aeo",
  "/geo",
  "/projects",
  "/settings",
  "/billing",
  "/account",
  "/profile",
  "/api",
  "/admin",
  "/internal",
  "/login",
  "/register",
  "/signup",
  "/auth",
  "/forgot-password",
  "/reset-password",
  "/notifications",
] as const;

/**
 * Checks if a given pathname belongs to a private authenticated area
 */
export function isPrivateRoute(pathname: string): boolean {
  const clean = pathname.toLowerCase();
  return PRIVATE_NOINDEX_ROUTES.some((priv) => clean === priv || clean.startsWith(`${priv}/`));
}
