/**
 * Zobay Rank — AEO (Answer Engine Optimization) Audit Script
 * Validates llms.txt machine-readability, answer engine bot access,
 * structured question-answering schemas (FAQPageJsonLd, DefinedTermJsonLd),
 * and factual, direct answerability.
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
console.log("  ZOBAY RANK — AUTOMATED AEO CHECK");
console.log("  Answer Engine Optimization Audit");
console.log("=========================================\n");

// Check 1: llms.txt existence and content
console.log("[1/5] Auditing /public/llms.txt Specification...");
const llmsPath = path.join(rootDir, "public", "llms.txt");
assert(fs.existsSync(llmsPath), "public/llms.txt file exists");
const llmsContent = fs.readFileSync(llmsPath, "utf-8");
assert(
  llmsContent.includes("# Zobay Rank"),
  "llms.txt includes primary '# Zobay Rank' definition"
);
assert(
  llmsContent.includes("https://rank.zobay.in"),
  "llms.txt references canonical URL https://rank.zobay.in"
);
assert(
  llmsContent.includes("SEO") && llmsContent.includes("AEO") && llmsContent.includes("GEO"),
  "llms.txt defines the 3 foundational pillars: SEO, AEO, and GEO"
);
assert(
  llmsContent.includes("/llms-full.txt"),
  "llms.txt links to extended documentation: /llms-full.txt"
);

// Check 2: llms-full.txt comprehensive documentation
console.log("\n[2/5] Auditing /public/llms-full.txt Knowledge Base...");
const llmsFullPath = path.join(rootDir, "public", "llms-full.txt");
assert(fs.existsSync(llmsFullPath), "public/llms-full.txt file exists");
const llmsFullContent = fs.readFileSync(llmsFullPath, "utf-8");
assert(
  llmsFullContent.length > 3000,
  `llms-full.txt contains rich knowledge content (${llmsFullContent.length} bytes)`
);
assert(
  llmsFullContent.includes("8-Factor GEO Scoring") || llmsFullContent.includes("8-Factor GEO"),
  "llms-full.txt outlines the complete 8-factor GEO score model"
);
assert(
  llmsFullContent.includes("Pricing") && llmsFullContent.includes("Free Plan"),
  "llms-full.txt details factual pricing tiers"
);

// Check 3: Answer Engine Crawlers Allowed in robots.ts
console.log("\n[3/5] Auditing AI Answer Engine Crawler Permissions...");
const robotsPath = path.join(rootDir, "src", "app", "robots.ts");
const robotsContent = fs.readFileSync(robotsPath, "utf-8");

const requiredBots = [
  "GPTBot",
  "ClaudeBot",
  "PerplexityBot",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
];

for (const bot of requiredBots) {
  assert(
    robotsContent.includes(bot),
    `robots.ts explicitly configures directives for ${bot}`
  );
}

// Check 4: Structured Data Components (JsonLd.tsx)
console.log("\n[4/5] Auditing JSON-LD Answer Schemas in JsonLd.tsx...");
const jsonLdPath = path.join(rootDir, "src", "components", "seo", "JsonLd.tsx");
assert(fs.existsSync(jsonLdPath), "JsonLd.tsx component exists");
const jsonLdContent = fs.readFileSync(jsonLdPath, "utf-8");

const requiredSchemas = [
  "FAQPageJsonLd",
  "DefinedTermJsonLd",
  "SoftwareApplicationJsonLd",
  "OrganizationJsonLd",
  "BreadcrumbJsonLd",
];

for (const schema of requiredSchemas) {
  assert(
    jsonLdContent.includes(schema),
    `JsonLd.tsx exports reusable schema component: ${schema}`
  );
}

// Check 5: Direct Q&A Structure in FAQ & Glossary
console.log("\n[5/5] Auditing Direct Answer Structure on Public Knowledge Pages...");
const faqPagePath = path.join(rootDir, "src", "app", "faq", "page.tsx");
assert(fs.existsSync(faqPagePath), "Dedicated FAQ page exists");
const faqContent = fs.readFileSync(faqPagePath, "utf-8");
assert(
  faqContent.includes("FAQPageJsonLd"),
  "FAQ page injects FAQPageJsonLd schema for machine parsing"
);
assert(
  faqContent.includes("What is Zobay Rank?") && faqContent.includes("What is AEO"),
  "FAQ covers core entity and architectural questions"
);

const glossarySlugPath = path.join(rootDir, "src", "app", "glossary", "[slug]", "page.tsx");
assert(fs.existsSync(glossarySlugPath), "Dynamic glossary pages exist");
const glossaryContent = fs.readFileSync(glossarySlugPath, "utf-8");
assert(
  glossaryContent.includes("DefinedTermJsonLd"),
  "Glossary entries emit schema.org/DefinedTerm JSON-LD"
);
assert(
  glossaryContent.includes("Formal Definition") || glossaryContent.includes("definition:"),
  "Glossary pages provide direct, extractable definitions"
);

console.log("\n-----------------------------------------");
console.log(`AEO Check Summary: ${passed} passed, ${failed} failed`);
console.log("-----------------------------------------\n");

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
