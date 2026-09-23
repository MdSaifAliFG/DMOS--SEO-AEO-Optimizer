import type { Metadata } from "next";
import { createPrivatePageMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = createPrivatePageMetadata("Keyword Performance");

export default function KeywordsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
