import type { Metadata } from "next";
import { createPrivatePageMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = createPrivatePageMetadata("Create Account");

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
