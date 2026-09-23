import React from "react";
import { SITE_CONFIG, getCanonicalUrl } from "@/lib/seo.config";

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

/**
 * Organization Schema (Zobay & Zobay Rank)
 * Uses strictly authentic data with no fabricated reviews, stars, or addresses.
 */
export const OrganizationJsonLd: React.FC = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_CONFIG.legalName,
    alternateName: SITE_CONFIG.productName,
    url: SITE_CONFIG.siteUrl,
    logo: `${SITE_CONFIG.siteUrl}/logo.png`,
    email: SITE_CONFIG.supportEmail,
    description: SITE_CONFIG.defaultDescription,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

/**
 * WebSite Schema for https://rank.zobay.in/
 */
export const WebSiteJsonLd: React.FC = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_CONFIG.name,
    url: `${SITE_CONFIG.siteUrl}/`,
    description: SITE_CONFIG.defaultDescription,
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.legalName,
      url: SITE_CONFIG.siteUrl,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

/**
 * SoftwareApplication Schema for Zobay Rank
 * Reflects genuine public subscription tiers without fake ratings.
 */
export const SoftwareApplicationJsonLd: React.FC = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_CONFIG.name,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: `${SITE_CONFIG.siteUrl}/`,
    description:
      "AI-powered SEO, Answer Engine Optimization (AEO), and Generative Engine Optimization (GEO) platform providing website crawling, AI answer citations, entity analysis, and generative search visibility tracking.",
    offers: [
      {
        "@type": "Offer",
        name: "Free Plan",
        price: "0",
        priceCurrency: "USD",
        description: "50 monthly credits with basic SEO crawling and AI answer inspection.",
      },
      {
        "@type": "Offer",
        name: "Starter Plan",
        price: "29",
        priceCurrency: "USD",
        description: "500 monthly credits with deep technical audits and AEO prompt tracking.",
      },
      {
        "@type": "Offer",
        name: "Growth Plan",
        price: "79",
        priceCurrency: "USD",
        description: "1,500 monthly credits with 8-factor GEO optimization and citation gap analysis.",
      },
      {
        "@type": "Offer",
        name: "Pro Plan",
        price: "149",
        priceCurrency: "USD",
        description: "3,500 monthly credits with multi-engine parity analysis and automated recommendations.",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

/**
 * BreadcrumbList Schema for hierarchical navigation
 */
export const BreadcrumbJsonLd: React.FC<{ items: BreadcrumbItem[] }> = ({ items }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: getCanonicalUrl(item.url),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

/**
 * FAQPage Schema for Q&A content
 */
export const FAQPageJsonLd: React.FC<{ faqs: FAQItem[] }> = ({ faqs }) => {
  if (!faqs || faqs.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

/**
 * Article Schema for educational blog and guides
 */
export const ArticleJsonLd: React.FC<{
  title: string;
  description: string;
  url: string;
  publishedTime: string;
  modifiedTime?: string;
  authorName?: string;
  image?: string;
}> = ({
  title,
  description,
  url,
  publishedTime,
  modifiedTime,
  authorName = "Zobay Rank Research Team",
  image = `${SITE_CONFIG.siteUrl}/brand-logo.png`,
}) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image,
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    author: {
      "@type": "Organization",
      name: authorName,
      url: SITE_CONFIG.siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_CONFIG.siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": getCanonicalUrl(url),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

/**
 * DefinedTerm Schema for glossary entries
 */
export const DefinedTermJsonLd: React.FC<{
  term: string;
  description: string;
  url: string;
}> = ({ term, description, url }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: term,
    description,
    url: getCanonicalUrl(url),
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: "Zobay Rank SEO, AEO & GEO Glossary",
      url: getCanonicalUrl("/glossary"),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
