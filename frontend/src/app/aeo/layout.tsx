import type { Metadata } from "next";
import { createPrivatePageMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = createPrivatePageMetadata("AEO Intelligence Studio");

export default function AeoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
