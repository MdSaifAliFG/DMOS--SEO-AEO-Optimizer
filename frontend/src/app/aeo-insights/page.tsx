import { DashboardShell } from "@/components/layout/DashboardShell";
import { ComingSoonPlaceholder } from "@/components/ui/ComingSoonPlaceholder";

export default function AEOInsightsPage() {
  return (
    <DashboardShell>
      <ComingSoonPlaceholder
        title="Answer Engine Optimization (AEO) & LLM Search"
        description="Monitor how AI search models (ChatGPT, Claude, Perplexity, Gemini, Copilot) perceive, cite, and recommend your brand."
        phase="Phase 2"
        features={[
          "AI Search Citation Tracking across major LLM engines",
          "Brand sentiment & entity authority indexing in generative responses",
          "AEO Prompt query testing and direct answer optimization",
          "Structured data & schema validation for LLM web crawlers",
        ]}
      />
    </DashboardShell>
  );
}
