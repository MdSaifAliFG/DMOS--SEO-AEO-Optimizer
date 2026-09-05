import { ScanStatus } from "./types";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export interface NavItem {
  title: string;
  href: string;
  icon: string;
  badge?: string;
  badgeVariant?: "default" | "success" | "warning" | "neutral" | "primary" | "aeo";
}

export interface NavGroup {
  groupName: string;
  groupKey:
    | "overview"
    | "seo"
    | "aeo"
    | "aeo_optimization"
    | "aeo_intelligence"
    | "aeo_monitoring"
    | "system"
    | string;
  items: NavItem[];
}

export const NAVIGATION_CONFIG: NavGroup[] = [
  {
    groupName: "Overview",
    groupKey: "overview",
    items: [
      {
        title: "Overview",
        href: "/overview",
        icon: "LayoutDashboard",
      },
    ],
  },
  {
    groupName: "SEO Optimization",
    groupKey: "seo",
    items: [
      {
        title: "Dashboard",
        href: "/seo/dashboard",
        icon: "BarChart3",
      },
      {
        title: "Action Center",
        href: "/seo/actions",
        icon: "ListTodo",
        badge: "Actions",
        badgeVariant: "primary",
      },
      {
        title: "Projects",
        href: "/seo/projects",
        icon: "FolderKanban",
      },
      {
        title: "Keywords",
        href: "/seo/keywords",
        icon: "KeyRound",
      },
      {
        title: "Pages",
        href: "/seo/pages",
        icon: "FileText",
      },
      {
        title: "Issues",
        href: "/seo/issues",
        icon: "AlertTriangle",
      },
      {
        title: "Metadata Optimizer",
        href: "/seo/optimize/metadata",
        icon: "Sparkles",
      },
      {
        title: "Technical SEO",
        href: "/seo/technical",
        icon: "Wrench",
      },
      {
        title: "Content",
        href: "/seo/content",
        icon: "BookOpen",
      },
      {
        title: "Links",
        href: "/seo/links",
        icon: "Link2",
      },
      {
        title: "Optimization History",
        href: "/seo/optimization-history",
        icon: "History",
      },
      {
        title: "Reports",
        href: "/seo/reports",
        icon: "FileSpreadsheet",
      },
    ],
  },
  {
    groupName: "AEO Core",
    groupKey: "aeo",
    items: [
      {
        title: "Dashboard",
        href: "/aeo/dashboard",
        icon: "Bot",
      },
      {
        title: "Projects",
        href: "/aeo/projects",
        icon: "Sparkles",
      },
      {
        title: "Questions",
        href: "/aeo/questions",
        icon: "HelpCircle",
      },
      {
        title: "Answer Engine",
        href: "/aeo/answer-engine",
        icon: "Cpu",
      },
      {
        title: "Entities",
        href: "/aeo/entities",
        icon: "Boxes",
      },
      {
        title: "Citations",
        href: "/aeo/citations",
        icon: "Quote",
      },
      {
        title: "Visibility",
        href: "/aeo/visibility",
        icon: "Eye",
      },
      {
        title: "Reports",
        href: "/aeo/reports",
        icon: "FileBarChart",
      },
    ],
  },
  {
    groupName: "AEO Optimization",
    groupKey: "aeo_optimization",
    items: [
      {
        title: "Action Center",
        href: "/aeo/actions",
        icon: "ListTodo",
        badge: "Actions",
        badgeVariant: "aeo",
      },
      {
        title: "Content Gaps",
        href: "/aeo/optimization/content-gaps",
        icon: "Layers",
      },
      {
        title: "Prompt Gaps",
        href: "/aeo/optimization/prompts",
        icon: "Target",
      },
      {
        title: "Citation Gaps",
        href: "/aeo/optimization/citations",
        icon: "Share2",
      },
      {
        title: "Entity Health",
        href: "/aeo/optimization/entities",
        icon: "Network",
      },
      {
        title: "Content Studio",
        href: "/aeo/optimize/content",
        icon: "FileText",
      },
      {
        title: "Answer Evaluator",
        href: "/aeo/optimize/answer",
        icon: "FileCheck",
      },
      {
        title: "Optimization History",
        href: "/aeo/optimization-history",
        icon: "History",
      },
    ],
  },
  {
    groupName: "AEO Intelligence",
    groupKey: "aeo_intelligence",
    items: [
      {
        title: "Executive Intelligence",
        href: "/aeo/intelligence",
        icon: "Brain",
        badge: "Exec",
        badgeVariant: "aeo",
      },
      {
        title: "AI Engines",
        href: "/aeo/engines",
        icon: "Cpu",
      },
      {
        title: "Competitors",
        href: "/aeo/competitors",
        icon: "Users",
      },
      {
        title: "Change Center",
        href: "/aeo/changes",
        icon: "ArrowLeftRight",
      },
      {
        title: "Alerts",
        href: "/aeo/alerts",
        icon: "Bell",
      },
    ],
  },
  {
    groupName: "AEO Monitoring",
    groupKey: "aeo_monitoring",
    items: [
      {
        title: "Prompt Monitoring",
        href: "/aeo/monitoring/prompts",
        icon: "Target",
      },
      {
        title: "Citation Monitoring",
        href: "/aeo/monitoring/citations",
        icon: "Share2",
      },
      {
        title: "Entity Monitoring",
        href: "/aeo/monitoring/entities",
        icon: "Network",
      },
      {
        title: "Monitoring Settings",
        href: "/aeo/settings/monitoring",
        icon: "Sliders",
      },
    ],
  },
  {
    groupName: "System",
    groupKey: "system",
    items: [
      {
        title: "Integrations",
        href: "/integrations",
        icon: "Puzzle",
      },
      {
        title: "Settings",
        href: "/settings",
        icon: "Settings",
      },
    ],
  },
];

export const STATUS_CONFIG: Record<
  ScanStatus,
  {
    label: string;
    bgClass: string;
    textClass: string;
    borderClass: string;
    dotClass: string;
  }
> = {
  queued: {
    label: "Queued",
    bgClass: "bg-amber-50",
    textClass: "text-amber-700",
    borderClass: "border-amber-200",
    dotClass: "bg-amber-500",
  },
  initializing: {
    label: "Initializing",
    bgClass: "bg-blue-50",
    textClass: "text-blue-700",
    borderClass: "border-blue-200",
    dotClass: "bg-blue-500 animate-pulse",
  },
  crawling: {
    label: "Crawling",
    bgClass: "bg-blue-50",
    textClass: "text-blue-700",
    borderClass: "border-blue-200",
    dotClass: "bg-blue-600 animate-pulse",
  },
  analyzing: {
    label: "Analyzing",
    bgClass: "bg-purple-50",
    textClass: "text-purple-700",
    borderClass: "border-purple-200",
    dotClass: "bg-purple-600 animate-pulse",
  },
  scoring: {
    label: "Scoring",
    bgClass: "bg-indigo-50",
    textClass: "text-indigo-700",
    borderClass: "border-indigo-200",
    dotClass: "bg-indigo-600 animate-pulse",
  },
  completed: {
    label: "Completed",
    bgClass: "bg-emerald-50",
    textClass: "text-emerald-700",
    borderClass: "border-emerald-200",
    dotClass: "bg-emerald-500",
  },
  failed: {
    label: "Failed",
    bgClass: "bg-rose-50",
    textClass: "text-rose-700",
    borderClass: "border-rose-200",
    dotClass: "bg-rose-500",
  },
  cancelled: {
    label: "Cancelled",
    bgClass: "bg-slate-100",
    textClass: "text-slate-700",
    borderClass: "border-slate-300",
    dotClass: "bg-slate-500",
  },
};
