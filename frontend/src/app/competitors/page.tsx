import { DashboardShell } from "@/components/layout/DashboardShell";
import { ComingSoonPlaceholder } from "@/components/ui/ComingSoonPlaceholder";

export default function CompetitorsPage() {
  return (
    <DashboardShell>
      <ComingSoonPlaceholder
        title="Competitor Intelligence Matrix"
        description="Deep competitive domain benchmarking, content gap analysis, and market share tracking."
        phase="Phase 2"
        features={[
          "Domain-vs-domain organic visibility benchmarking",
          "Automated keyword overlap & content gap matrices",
          "Competitor publication velocity & new page alerts",
          "SERP battleground share-of-voice calculations",
        ]}
      />
    </DashboardShell>
  );
}
