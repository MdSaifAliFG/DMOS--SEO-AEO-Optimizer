import type { Metadata } from "next";
import { createPrivatePageMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = createPrivatePageMetadata("Overview");

export default function OverviewLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
