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
  groupKey: "overview" | "seo" | "aeo" | "system";
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
    groupName: "AEO Optimization",
    groupKey: "aeo",
    items: [
      {
        title: "Dashboard",
        href: "/aeo/dashboard",
        icon: "Bot",
      },
      {
        title: "Action Center",
        href: "/aeo/actions",
        icon: "ListTodo",
        badge: "Actions",
        badgeVariant: "aeo",
      },
      {
        title: "Projects",
        href: "/aeo/projects",
        icon: "Sparkles",
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
        title: "Questions",
        href: "/aeo/questions",
        icon: "HelpCircle",
      },
      {
        title: "Entities",
        href: "/aeo/entities",
        icon: "Boxes",
      },
      {
        title: "Answer Engine",
        href: "/aeo/answer-engine",
        icon: "Cpu",
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
      {
        title: "Reports",
        href: "/aeo/reports",
        icon: "FileBarChart",
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
