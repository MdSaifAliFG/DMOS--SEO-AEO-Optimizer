"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Skeleton } from "@/components/ui/Skeleton";

export default function GeoSettingsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/settings?tab=geo");
  }, [router]);

  return (
    <DashboardShell>
      <div className="p-8 max-w-xl mx-auto text-center space-y-4">
        <Skeleton className="h-8 w-48 mx-auto" />
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Redirecting to Global Platform Settings...
        </p>
      </div>
    </DashboardShell>
  );
}
