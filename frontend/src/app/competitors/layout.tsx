import type { Metadata } from "next";
import { createPrivatePageMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = createPrivatePageMetadata("Competitor Benchmarking");

export default function CompetitorsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
