import React from "react";
import type { Metadata } from "next";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { ContactSection } from "@/components/landing/ContactSection";
import { createPageMetadata } from "@/lib/seo-metadata";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = createPageMetadata({
  title: "Contact Zobay Rank — Support, Sales & Technical Inquiries",
  description:
    "Get in touch with the Zobay Rank team for platform support, technical questions, enterprise crawling architectures, or partnerships at support@zobay.in.",
  path: "/contact",
  keywords: [
    "Contact Zobay Rank",
    "Zobay Rank support",
    "SEO software support",
    "AEO consultation",
    "enterprise crawler inquiry",
    "support@zobay.in",
  ],
});

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://rank.zobay.in/" },
          { name: "Contact", url: "https://rank.zobay.in/contact" },
        ]}
      />
      <LandingNavbar />
      <main className="flex-1 pt-20">
        <ContactSection />
      </main>
      <LandingFooter />
    </div>
  );
}
