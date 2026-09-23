import type { Metadata } from "next";
import { createPrivatePageMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = createPrivatePageMetadata("Sign In");

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
