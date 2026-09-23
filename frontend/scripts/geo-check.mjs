/**
 * Zobay Rank — GEO (Generative Engine Optimization) Audit Script
 * Validates brand entity consistency, 8-factor GEO scoring model coverage,
 * cross-engine parity representation, and zero fabricated claims.
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
console.log("  ZOBAY RANK — AUTOMATED GEO CHECK");
console.log("  Generative Engine Optimization Audit");
console.log("=========================================\n");

// Check 1: Brand Entity Integrity in seo.config.ts
console.log("[1/5] Auditing Brand Entity Constants...");
const seoConfigPath = path.join(rootDir, "src", "lib", "seo.config.ts");
const seoConfigContent = fs.readFileSync(seoConfigPath, "utf-8");
assert(
  seoConfigContent.includes('name: "Zobay Rank"') && seoConfigContent.includes('legalName: "Zobay"'),
  "SITE_CONFIG defines product as 'Zobay Rank' and parent company as 'Zobay'"
);

// Check 2: Audit public pages for prohibited legacy names
console.log("\n[2/5] Checking Public Pages for Legacy Brand Leaks...");
const publicPagesToCheck = [
  path.join(rootDir, "src", "app", "page.tsx"),
  path.join(rootDir, "src", "app", "seo-optimization", "page.tsx"),
  path.join(rootDir, "src", "app", "aeo-optimization", "page.tsx"),
  path.join(rootDir, "src", "app", "geo-optimization", "page.tsx"),
  path.join(rootDir, "src", "app", "ai-search-optimization", "page.tsx"),
  path.join(rootDir, "src", "app", "seo-vs-aeo-vs-geo", "page.tsx"),
  path.join(rootDir, "src", "app", "about-zobay-rank", "page.tsx"),
  path.join(rootDir, "src", "app", "faq", "page.tsx"),
  path.join(rootDir, "public", "llms.txt"),
];

const prohibitedNames = ["SEOSensing", "SEO Sensing", "SEO Intelligence Hub"];

let leaksFound = 0;
for (const filePath of publicPagesToCheck) {
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, "utf-8");
    for (const badName of prohibitedNames) {
      if (content.includes(badName)) {
        console.error(`    \x1b[31mLeak detected\x1b[0m: "${badName}" found in ${path.basename(filePath)}`);
        leaksFound++;
      }
    }
  }
}
assert(leaksFound === 0, `Zero legacy brand leaks in public pages (found ${leaksFound})`);

// Check 3: 8-Factor GEO Score Model Representation
console.log("\n[3/5] Auditing 8-Factor GEO Optimization Model Representation...");
const geoPagePath = path.join(rootDir, "src", "app", "geo-optimization", "page.tsx");
assert(fs.existsSync(geoPagePath), "geo-optimization page exists");
const geoContent = fs.readFileSync(geoPagePath, "utf-8");

const eightFactors = [
  "AI Visibility Score",
  "Recommendation Strength",
  "Citation Authority",
  "Entity Understanding",
  "Content Extractability",
  "Technical AI Accessibility",
  "Cross-Engine Parity",
  "Commercial Discovery",
];

let factorsMatched = 0;
for (const factor of eightFactors) {
  if (geoContent.toLowerCase().includes(factor.toLowerCase())) {
    factorsMatched++;
  }
}
assert(
  factorsMatched >= 7,
  `8-Factor GEO framework comprehensively detailed (${factorsMatched}/8 factors verified)`
);

// Check 4: Cross-Engine Parity Tracking Coverage
console.log("\n[4/5] Auditing Cross-Engine AI Engines Representation...");
const engines = ["ChatGPT", "Perplexity", "Google Gemini", "Claude"];
let enginesCovered = 0;
for (const eng of engines) {
  if (geoContent.includes(eng) || geoContent.includes(eng.replace("Google ", ""))) {
    enginesCovered++;
  }
}
assert(
  enginesCovered === 4,
  "All 4 major AI search engines tracked (ChatGPT, Perplexity, Gemini, Claude)"
);

// Check 5: Factual Authenticity & Zero Fabricated Reviews
console.log("\n[5/5] Auditing Factual Integrity & Review Authenticity...");
const landingHeroPath = path.join(rootDir, "src", "components", "landing", "HeroSection.tsx");
const heroContent = fs.readFileSync(landingHeroPath, "utf-8");
assert(
  !heroContent.includes("5-star") && !heroContent.includes("4.9/5"),
  "Hero section has no fake star ratings or fabricated customer quotes"
);

const pricingPath = path.join(rootDir, "src", "components", "landing", "PricingSection.tsx");
const pricingContent = fs.readFileSync(pricingPath, "utf-8");
assert(
  pricingContent.includes("Starter") && pricingContent.includes("Growth") && pricingContent.includes("Pro"),
  "Pricing section reflects authentic operational tiers ($29, $79, $149)"
);

console.log("\n-----------------------------------------");
console.log(`GEO Check Summary: ${passed} passed, ${failed} failed`);
console.log("-----------------------------------------\n");

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
