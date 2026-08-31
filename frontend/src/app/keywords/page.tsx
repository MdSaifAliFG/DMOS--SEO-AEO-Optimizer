import { DashboardShell } from "@/components/layout/DashboardShell";
import { ComingSoonPlaceholder } from "@/components/ui/ComingSoonPlaceholder";

export default function KeywordsPage() {
  return (
    <DashboardShell>
      <ComingSoonPlaceholder
        title="Keyword Tracking & SERP Intelligence"
        description="Comprehensive keyword ranking tracker, search volume analysis, and historical SERP volatility monitoring."
        phase="Phase 2"
        features={[
          "Live search engine rank tracking across desktop & mobile",
          "Keyword intent classification & search volume telemetry",
          "SERP feature detection (Featured Snippets, People Also Ask, AI Overviews)",
          "Cannibalization detection and ranking fluctuation alerts",
        ]}
      />
    </DashboardShell>
  );
}
