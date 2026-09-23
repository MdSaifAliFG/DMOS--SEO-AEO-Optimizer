import type { Metadata } from "next";
import { createPrivatePageMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = createPrivatePageMetadata("Register");

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
