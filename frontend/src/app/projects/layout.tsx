import type { Metadata } from "next";
import { createPrivatePageMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = createPrivatePageMetadata("Projects Management");

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
