import type { Metadata } from "next";
import { createPrivatePageMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = createPrivatePageMetadata("Notifications");

export default function NotificationsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
