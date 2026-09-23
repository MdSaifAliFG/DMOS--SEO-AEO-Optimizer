import type { Metadata } from "next";
import { createPrivatePageMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = createPrivatePageMetadata("GEO Optimization Engine");

export default function GeoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
