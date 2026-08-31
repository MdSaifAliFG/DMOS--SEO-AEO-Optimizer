import { DashboardShell } from "@/components/layout/DashboardShell";
import { ProjectList } from "@/components/projects/ProjectList";

export default function ProjectsPage() {
  return (
    <DashboardShell>
      <ProjectList />
    </DashboardShell>
  );
}
