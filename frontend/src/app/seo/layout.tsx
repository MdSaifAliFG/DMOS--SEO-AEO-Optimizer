import type { Metadata } from "next";
import { createPrivatePageMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = createPrivatePageMetadata("SEO Diagnostics & Crawl Studio");

export default function SeoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
