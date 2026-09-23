import type { Metadata } from "next";
import { createPrivatePageMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = createPrivatePageMetadata("Billing & Subscriptions");

export default function BillingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
