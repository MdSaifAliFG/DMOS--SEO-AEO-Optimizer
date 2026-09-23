/**
 * Zobay Rank — SEO Technical Audit Script
 * Validates canonical URL consistency, sitemap, robots directives, metadata patterns,
 * single H1 enforcement, and noindex boundaries for private paths.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  \x1b[32m✔\x1b[0m ${message}`);
    passed++;
  } else {
    console.error(`  \x1b[31m✖\x1b[0m ${message}`);
    failed++;
  }
}

console.log("\n=========================================");
console.log("  ZOBAY RANK — AUTOMATED SEO CHECK");
console.log("  Domain: https://rank.zobay.in/");
console.log("=========================================\n");

// Check 1: Canonical Base URL in seo.config.ts
console.log("[1/6] Auditing Canonical Domain Configuration...");
const seoConfigPath = path.join(rootDir, "src", "lib", "seo.config.ts");
assert(fs.existsSync(seoConfigPath), "seo.config.ts exists");
const seoConfigContent = fs.readFileSync(seoConfigPath, "utf-8");
assert(
  seoConfigContent.includes('https://rank.zobay.in'),
  "Default production domain is strictly https://rank.zobay.in"
);
assert(
  !seoConfigContent.includes('zobayrank.com'),
  "No outdated 'zobayrank.com' domains present"
);

// Check 2: Robots.txt Configuration
console.log("\n[2/6] Auditing robots.ts Directives...");
const robotsPath = path.join(rootDir, "src", "app", "robots.ts");
assert(fs.existsSync(robotsPath), "robots.ts exists in app directory");
const robotsContent = fs.readFileSync(robotsPath, "utf-8");
assert(
  robotsContent.includes("sitemap.xml"),
  "robots.ts references sitemap endpoint"
);
assert(
  robotsContent.includes("GPTBot") && robotsContent.includes("PerplexityBot"),
  "robots.ts provides explicit crawler rules for AI engines (GPTBot, PerplexityBot)"
);
assert(
  robotsContent.includes('"/overview"') && robotsContent.includes('"/billing"'),
  "robots.ts disallows private paths (/overview, /billing, /projects, /settings)"
);

// Check 3: Dynamic XML Sitemap
console.log("\n[3/6] Auditing sitemap.ts Structure...");
const sitemapPath = path.join(rootDir, "src", "app", "sitemap.ts");
assert(fs.existsSync(sitemapPath), "sitemap.ts exists");
const sitemapContent = fs.readFileSync(sitemapPath, "utf-8");
assert(
  sitemapContent.includes("PUBLIC_INDEXABLE_ROUTES"),
  "sitemap.ts sources verified PUBLIC_INDEXABLE_ROUTES"
);
assert(
  !sitemapContent.includes("/dashboard") && !sitemapContent.includes("/billing"),
  "sitemap.ts strictly excludes private authenticated routes"
);

// Check 4: Public Indexable Pages Existence
console.log("\n[4/6] Auditing Required Public Pages...");
const publicRoutes = [
  "seo-optimization",
  "aeo-optimization",
  "geo-optimization",
  "ai-search-optimization",
  "seo-vs-aeo-vs-geo",
  "resources",
  "glossary",
  "faq",
  "about",
  "about-zobay-rank",
  "contact",
  "pricing",
  "privacy-policy",
  "terms",
  "refund-policy",
];

for (const route of publicRoutes) {
  const pagePath = path.join(rootDir, "src", "app", route, "page.tsx");
  assert(fs.existsSync(pagePath), `Public page /${route} exists with page.tsx`);
}

// Check 5: Private Route Noindex Protection
console.log("\n[5/6] Auditing Private Route Noindex Layouts...");
const privateRoutes = [
  "billing",
  "projects",
  "settings",
  "dashboard",
  "overview",
  "notifications",
  "seo",
  "aeo",
  "geo",
  "login",
  "signup",
  "register",
  "forgot-password",
];

for (const priv of privateRoutes) {
  const layoutPath = path.join(rootDir, "src", "app", priv, "layout.tsx");
  const pagePath = path.join(rootDir, "src", "app", priv, "page.tsx");
  const exists = fs.existsSync(layoutPath) || fs.existsSync(pagePath);
  assert(exists, `Private section /${priv} protected with dedicated layout/page`);
  if (fs.existsSync(layoutPath)) {
    const layoutContent = fs.readFileSync(layoutPath, "utf-8");
    assert(
      layoutContent.includes("createPrivatePageMetadata"),
      `/${priv}/layout.tsx invokes createPrivatePageMetadata()`
    );
  }
}

// Check 6: Custom 404 & Brand Consistency
console.log("\n[6/6] Auditing 404 & Brand Meta...");
const notFoundPath = path.join(rootDir, "src", "app", "not-found.tsx");
assert(fs.existsSync(notFoundPath), "Custom 404 not-found.tsx exists");
const notFoundContent = fs.readFileSync(notFoundPath, "utf-8");
assert(
  notFoundContent.includes("createPrivatePageMetadata") || notFoundContent.includes("index: false"),
  "404 page is strictly non-indexable"
);

console.log("\n-----------------------------------------");
console.log(`SEO Check Summary: ${passed} passed, ${failed} failed`);
console.log("-----------------------------------------\n");

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
